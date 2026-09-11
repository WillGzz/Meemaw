export type Source = { title: string; url: string };
export type CleanActivity = { content: string; sources: Source[]; quality: { removedItems: number; duplicateItems: number; cleanedAt: string } };
export function cleanText(value: unknown, max = 100000): string {
  if (typeof value !== "string") return "";
  return value.slice(0, max * 2)
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&(?:nbsp|amp|lt|gt|quot|apos|#39);/g, entity => ({ "&nbsp;": " ", "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&apos;": "'", "&#39;": "'" })[entity] || "")
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f\u200b-\u200f\u202a-\u202e\u2066-\u2069]/g, "")
    .replace(/\r\n?/g, "\n").replace(/[\t ]+/g, " ").replace(/ *\n */g, "\n").replace(/\n{3,}/g, "\n\n").normalize("NFKC").trim().slice(0, max);
}
export function cleanUrl(value: unknown): string | null {
  if (typeof value !== "string" || value.length > 4096) return null;
  try {
    const url = new URL(value.trim());
    if (!["https:", "http:"].includes(url.protocol) || url.username || url.password) return null;
    for (const key of [...url.searchParams.keys()]) if (/^(utm_|fbclid$|gclid$)/i.test(key)) url.searchParams.delete(key);
    url.hash = "";
    return url.href;
  } catch { return null; }
}
export function cleanActivity(raw: Record<string, unknown>): CleanActivity {
  const seen = new Set<string>();
  const lines: string[] = [];
  let removedItems = 0;
  let duplicateItems = 0;
  const append = (value: unknown) => {
    const text = cleanText(value);
    if (!text) { removedItems++; return; }
    const key = text.toLowerCase().replace(/\s+/g, " ");
    if (seen.has(key)) { duplicateItems++; return; }
    seen.add(key); lines.push(text);
  };
  const candidates: unknown[] = Array.isArray(raw.sources) ? [...raw.sources.slice(0, 100)] : [];
  if (Array.isArray(raw.posts)) {
    const ids = new Set<string>();
    for (const post of raw.posts.slice(0, 500)) {
      if (!post || typeof post !== "object") { removedItems++; continue; }
      const id = typeof post.id === "string" ? post.id.trim() : "";
      if (id && ids.has(id)) { duplicateItems++; continue; }
      if (post.publishedAt !== undefined && (typeof post.publishedAt !== "string" || !Number.isFinite(Date.parse(post.publishedAt)) || Date.parse(post.publishedAt) > Date.now() + 86400000)) { removedItems++; continue; }
      const caption = cleanText(post.caption, 10000);
      if (!caption) { removedItems++; continue; }
      if (id) ids.add(id);
      append(caption);
      if (post.url) candidates.push({ title: caption.slice(0, 120), url: post.url });
    }
  } else if (typeof raw.content === "string") {
    for (const line of cleanText(raw.content).split("\n")) if (line.trim()) append(line);
  } else { throw new Error("Expected content or posts"); }
  const sourceUrls = new Set<string>();
  const sources: Source[] = [];
  for (const entry of candidates) {
    if (!entry || typeof entry !== "object") { removedItems++; continue; }
    const source = entry as Record<string, unknown>;
    const url = cleanUrl(source.url);
    const title = cleanText(source.title, 200);
    if (!url || !title) { removedItems++; continue; }
    if (sourceUrls.has(url)) { duplicateItems++; continue; }
    sourceUrls.add(url); sources.push({ title, url });
  }
  return { content: lines.join("\n").slice(0, 100000), sources: sources.slice(0, 10), quality: { removedItems, duplicateItems, cleanedAt: new Date().toISOString() } };
}
