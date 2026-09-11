import { randomUUID } from "node:crypto";
import { cleanActivity, cleanText, type CleanActivity } from "./clean";
import { preferences } from "./learning";
import { db } from "./db";
import { ApiError } from "./errors";
import { connectedRelative } from "./family";
import type { AskResponse, User } from "../types";

type Activity = CleanActivity;
const inFlight = new Map<string, Promise<{ activity: Activity; fetchedAt: number }>>();
const cacheLifetime = 45 * 60 * 1000;

async function upstream(path: string, body: unknown): Promise<Record<string, unknown>> {
  const base = process.env.FRIEND_API_BASE_URL;
  if (!base) throw new ApiError(503, "Family updates are not connected yet. Please try again once setup is complete.");
  let url: URL;
  try {
    const root = new URL(base.endsWith("/") ? base : `${base}/`);
    url = new URL(path.replace(/^\//, ""), root);
    if (!["http:", "https:"].includes(url.protocol) || url.origin !== root.origin) throw new Error("Invalid URL");
  } catch { throw new ApiError(503, "Family updates are not configured correctly."); }
  try {
    const response = await fetch(url, {
      method: "POST", cache: "no-store", signal: AbortSignal.timeout(30000),
      headers: { "Content-Type": "application/json", ...(process.env.FRIEND_API_KEY ? { Authorization: `Bearer ${process.env.FRIEND_API_KEY}` } : {}) },
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new ApiError(502, "We could not get a family update right now. Please try again later.");
    const reader = response.body?.getReader();
    if (!reader) throw new Error("Empty response");
    let length = 0;
    const chunks: Uint8Array[] = [];
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > 1024 * 1024) { await reader.cancel(); throw new Error("Oversized response"); }
      chunks.push(value);
    }
    const data: unknown = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (!data || typeof data !== "object" || Array.isArray(data)) throw new Error("Invalid response");
    return data as Record<string, unknown>;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(502, "The family update service is unavailable. Please try again later.");
  }
}
async function youSearch(relative: User): Promise<{ activity: Activity; fetchedAt: number }> {
  const key = process.env.YOUCOM || process.env.YOU_SEARCH_API_KEY;
  if (!key) throw new ApiError(503, "Family updates are not connected yet. Add your friend API URL or a You.com key.");
  const query = [relative.name, relative.instagramUsername && `@${relative.instagramUsername}`, "recent updates"].filter(Boolean).join(" ");
  try {
    const response = await fetch(`https://api.you.com/v1/search?query=${encodeURIComponent(query)}&count=5`, {
      cache: "no-store", signal: AbortSignal.timeout(20000), headers: { "X-API-Key": key, Accept: "application/json" },
    });
    if (!response.ok) throw new Error("search failed");
    const payload = await response.json() as Record<string, unknown>;
    const raw: unknown[] = Array.isArray(payload.results) ? payload.results : Array.isArray((payload.results as Record<string, unknown> | undefined)?.web) ? (payload.results as Record<string, unknown>).web as unknown[] : [];
    const sources = raw.flatMap((item: unknown) => {
      if (!item || typeof item !== "object") return [];
      const value = item as Record<string, unknown>;
      const url = typeof value.url === "string" ? value.url : null;
      const title = typeof value.title === "string" ? value.title : "Public web result";
      const snippet = typeof value.description === "string" ? value.description : Array.isArray(value.snippets) ? value.snippets.filter((part): part is string => typeof part === "string").join(" ") : "";
      if (!url || !snippet) return [];
      return [{ title, url, snippet }];
    }).slice(0, 5);
    const activity = cleanActivity({ content: sources.map((source: { title: string; snippet: string; url: string }) => `${source.title}: ${source.snippet}`).join("\n"), sources });
    return { activity, fetchedAt: Date.now() };
  } catch { throw new ApiError(502, "You.com could not find a public update right now. Please try again later."); }
}
async function recentActivity(relative: User) {
  const cached = db().prepare("SELECT payload, fetched_at FROM activity_cache WHERE relative_id = ?").get(relative.id) as { payload: string; fetched_at: number } | undefined;
  if (cached && Date.now() - cached.fetched_at < cacheLifetime) return { activity: JSON.parse(cached.payload) as Activity, fetchedAt: cached.fetched_at };
  const pending = inFlight.get(relative.id);
  if (pending) return pending;
  const job = (async () => {
    let activity: Activity;
    let fetchedAt = Date.now();
    if (process.env.FRIEND_API_BASE_URL) {
      const data = await upstream(process.env.FRIEND_ACTIVITY_PATH || "activity", { instagramUsername: relative.instagramUsername });
      try { activity = cleanActivity(data); } catch { throw new ApiError(502, "The family update service returned an unexpected response."); }
    } else {
      const fallback = await youSearch(relative);
      activity = fallback.activity; fetchedAt = fallback.fetchedAt;
    }
    db().prepare("INSERT INTO activity_cache(relative_id,payload,fetched_at) VALUES (?,?,?) ON CONFLICT(relative_id) DO UPDATE SET payload=excluded.payload,fetched_at=excluded.fetched_at").run(relative.id, JSON.stringify(activity), fetchedAt);
    return { activity, fetchedAt };
  })();
  inFlight.set(relative.id, job);
  try { return await job; } finally { inFlight.delete(relative.id); }
}
export async function ask(elder: User, relativeId: string, question: string): Promise<AskResponse> {
  const relative = connectedRelative(elder, relativeId);
  const { activity, fetchedAt } = await recentActivity(relative);
  const learning = preferences(elder.id);
  let answer = `There aren't any recent updates available for ${relative.name} yet.`;
  if (activity.content.trim() && process.env.FRIEND_API_BASE_URL) {
    const result = await upstream(process.env.FRIEND_ASK_PATH || "ask", {
      relative: { id: relative.id, name: relative.name, instagramUsername: relative.instagramUsername },
      question, activity, responseStyle: learning.responseStyle,
      feedbackGuidance: { preferVerifiedClaims: learning.preferVerifiedClaims, feedbackCount: learning.feedbackCount },
    });
    if (typeof result.answer !== "string" || !result.answer.trim() || result.answer.length > 20000) throw new ApiError(502, "The answer service returned an unexpected response. Please try again.");
    answer = cleanText(result.answer, 20000);
    if (!answer) throw new ApiError(502, "No readable answer was returned. Please try again.");
  }
  if (!process.env.FRIEND_API_BASE_URL && activity.content.trim()) {
    answer = `Here are the recent public updates I found for ${relative.name}: ${activity.content.split("\n").slice(0, 3).join(" ")}`;
  }
  // A relative may have revoked approval while the upstream requests were running.
  connectedRelative(elder, relativeId);
  const id = randomUUID();
  db().prepare("INSERT INTO answers(id,elder_id,relative_id,question,answer,created_at) VALUES (?,?,?,?,?,?)").run(id, elder.id, relativeId, question, answer, Date.now());
  return { id, learning, quality: activity.quality, relative: { id: relative.id, name: relative.name }, question, answer, activityUpdatedAt: new Date(fetchedAt).toISOString(), sources: activity.sources || [] };
}
