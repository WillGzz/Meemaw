import { feedback } from "@/lib/server/learning";
import { cookies } from "next/headers";
import { ApiError, field } from "@/lib/server/errors";
import { createSession, limit, login, register, revokeSession, sessionAge } from "@/lib/server/accounts";
import { cookieName, currentUser } from "@/lib/server/session";
import { connections, requestConnection, respondConnection } from "@/lib/server/family";
import { ask } from "@/lib/server/ai";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function readBody(request: Request): Promise<Record<string, unknown>> {
  if (!request.headers.get("content-type")?.includes("application/json")) throw new ApiError(415, "Send JSON data.");
  const reader = request.body?.getReader();
  if (!reader) throw new ApiError(400, "Request data is missing.");
  let size = 0;
  const chunks: Uint8Array[] = [];
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 16384) { await reader.cancel(); throw new ApiError(413, "Request is too large."); }
    chunks.push(value);
  }
  try {
    const data: unknown = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (!data || typeof data !== "object" || Array.isArray(data)) throw new Error();
    return data as Record<string, unknown>;
  } catch { throw new ApiError(400, "Request data is invalid."); }
}
async function handle(request: Request) {
  try {
    const path = new URL(request.url).pathname;
    const method = request.method;
    const json = (data: unknown) => Response.json(data, { headers: { "Cache-Control": "no-store" } });
    if (method !== "GET") {
      const allowedOrigin = process.env.APP_ORIGIN || new URL(request.url).origin;
      if (request.headers.get("origin") !== allowedOrigin) throw new ApiError(403, "Please submit this request from Meemaw.");
    }
    if (method === "POST" && (path === "/api/auth/register" || path === "/api/auth/login")) {
      limit("auth:global", 100, 900);
      const data = await readBody(request);
      const user = path.endsWith("register") ? await register(data) : await login(data);
      const jar = await cookies();
      revokeSession(jar.get(cookieName)?.value);
      jar.set(cookieName, createSession(user.id), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: sessionAge });
      return json({ user });
    }
    if (method === "POST" && path === "/api/auth/logout") {
      const jar = await cookies();
      revokeSession(jar.get(cookieName)?.value);
      jar.delete(cookieName);
      return json({ ok: true });
    }
    const user = await currentUser();
    if (!user) throw new ApiError(401, "Please sign in to continue.");
    if (method === "GET" && path === "/api/dashboard") return json({ user, connections: connections(user) });
    if (method === "POST" && path === "/api/connections") {
      limit(`connect:${user.id}`, 15, 900);
      requestConnection(user, await readBody(request));
      return json({ connections: connections(user) });
    }
    if (method === "PATCH" && /^\/api\/connections\/[^/]+$/.test(path)) {
      const data = await readBody(request);
      respondConnection(user, path.split("/").pop()!, data.status);
      return json({ connections: connections(user) });
    }
    if (method === "POST" && path === "/api/elder/ask") {
      limit(`ask:${user.id}`, 30, 300);
      const data = await readBody(request);
      return json(await ask(user, field(data.relativeId, "Relative", 1, 100), field(data.question, "Question", 1, 2000)));
    }
    if (method === "POST" && path === "/api/elder/feedback") {
      const data = await readBody(request);
      return json({ preferences: feedback(user, field(data.answerId, "Answer", 1, 100), data.kind) });
    }
    throw new ApiError(404, "This endpoint does not exist.");
  } catch (error) {
    const expected = error instanceof ApiError;
    if (!expected) console.error("Meemaw request failed", error instanceof Error ? error.name : "UnknownError");
    return Response.json({ error: expected ? error.message : "Something went wrong. Please try again." }, { status: expected ? error.status : 500, headers: { "Cache-Control": "no-store" } });
  }
}
export const GET = handle;
export const POST = handle;
export const PATCH = handle;
