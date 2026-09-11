import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import { db } from "./db";
import { ApiError } from "./errors";

type Tokens = { accessToken: string; refreshToken: string };
type Grant = { encrypted_tokens: string; expires_at: number; refreshed_at: number; lock_until: number };
export type OneConnection = { key: string; platform: string; name: string; access: Record<string, unknown> };
export function oneConfigured() {
  return Boolean(process.env.ONE_CLIENT_ID && process.env.ONE_CLIENT_SECRET && process.env.ONE_REDIRECT_URI && /^[a-f0-9]{64}$/i.test(process.env.ONE_TOKEN_ENCRYPTION_KEY || ""));
}
export function oneConfig() {
  if (!oneConfigured()) throw new ApiError(503, "Account connections are not available yet. Please try again once setup is complete.");
  const redirectUri = process.env.ONE_REDIRECT_URI!;
  const redirect = new URL(redirectUri);
  if (redirect.protocol !== "https:" || redirect.pathname !== "/api/one/callback" || redirect.search || redirect.hash) throw new ApiError(503, "The account connection callback is not configured correctly.");
  return { clientId: process.env.ONE_CLIENT_ID!, clientSecret: process.env.ONE_CLIENT_SECRET!, redirectUri, origin: redirect.origin };
}
function encryptionKey() {
  const key = process.env.ONE_TOKEN_ENCRYPTION_KEY || "";
  if (!/^[a-f0-9]{64}$/i.test(key)) throw new ApiError(503, "Account connection storage is not configured.");
  return Buffer.from(key, "hex");
}
export function seal(value: string, userId: string) {
  const nonce = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(), nonce);
  cipher.setAAD(Buffer.from(userId));
  const ciphertext = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  return [nonce, cipher.getAuthTag(), ciphertext].map(part => part.toString("base64url")).join(".");
}
export function unseal(value: string, userId: string) {
  const [nonce, tag, ciphertext] = value.split(".").map(part => Buffer.from(part, "base64url"));
  const decipher = createDecipheriv("aes-256-gcm", encryptionKey(), nonce);
  decipher.setAAD(Buffer.from(userId)); decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString("utf8");
}
export function clearOne(userId: string) {
  db().prepare("DELETE FROM one_grants WHERE user_id = ?").run(userId);
  db().prepare("DELETE FROM activity_cache WHERE relative_id = ?").run(userId);
}
export async function exchangeToken(parameters: URLSearchParams) {
  const config = oneConfig();
  let response: Response;
  try {
    response = await fetch("https://api.withone.ai/oauth/token", { method: "POST", cache: "no-store", signal: AbortSignal.timeout(15000),
      headers: { Authorization: `Basic ${Buffer.from(`${config.clientId}:${config.clientSecret}`).toString("base64")}`, "Content-Type": "application/x-www-form-urlencoded" }, body: parameters });
  } catch { throw new ApiError(502, "One could not be reached. Please try connecting again."); }
  if (!response.ok) throw new ApiError(response.status === 400 || response.status === 401 ? 401 : 502, "One could not complete the connection. Please connect again.");
  const body = await response.json();
  if (typeof body.access_token !== "string" || !body.access_token || typeof body.refresh_token !== "string" || !body.refresh_token || !Number.isFinite(body.expires_in) || body.expires_in <= 0) throw new ApiError(502, "One returned an unexpected connection response.");
  return { tokens: { accessToken: body.access_token, refreshToken: body.refresh_token } as Tokens, expiresAt: Date.now() + body.expires_in * 1000 };
}
export function saveGrant(userId: string, tokens: Tokens, expiresAt: number) {
  db().prepare("INSERT INTO one_grants(user_id,encrypted_tokens,expires_at,refreshed_at,lock_until) VALUES (?,?,?,?,0) ON CONFLICT(user_id) DO UPDATE SET encrypted_tokens=excluded.encrypted_tokens, expires_at=excluded.expires_at, refreshed_at=excluded.refreshed_at, lock_until=0")
    .run(userId, seal(JSON.stringify(tokens), userId), expiresAt, Date.now());
  db().prepare("DELETE FROM activity_cache WHERE relative_id = ?").run(userId);
}
export async function oneAccessToken(userId: string) {
  const grant = db().prepare("SELECT encrypted_tokens,expires_at,refreshed_at,lock_until FROM one_grants WHERE user_id = ?").get(userId) as Grant | undefined;
  if (!grant) throw new ApiError(409, "Please connect your account with One.");
  const tokens = JSON.parse(unseal(grant.encrypted_tokens, userId)) as Tokens;
  if (Date.now() < grant.expires_at - 60000 && Date.now() - grant.refreshed_at < 14 * 86400000) return tokens.accessToken;
  const lock = db().prepare("UPDATE one_grants SET lock_until = ? WHERE user_id = ? AND lock_until < ? AND encrypted_tokens = ?").run(Date.now() + 90000, userId, Date.now(), grant.encrypted_tokens);
  if (!lock.changes) throw new ApiError(503, "Your account connection is updating. Please try again in a moment.");
  try {
    const next = await exchangeToken(new URLSearchParams({ grant_type: "refresh_token", refresh_token: tokens.refreshToken }));
    const saved = db().prepare("UPDATE one_grants SET encrypted_tokens=?, expires_at=?, refreshed_at=?, lock_until=0 WHERE user_id=? AND encrypted_tokens=?")
      .run(seal(JSON.stringify(next.tokens), userId), next.expiresAt, Date.now(), userId, grant.encrypted_tokens);
    if (!saved.changes) throw new ApiError(409, "Your account connection changed. Please try again.");
    return next.tokens.accessToken;
  } catch (error) {
    // A timed-out refresh may already have consumed the token. Never reuse that pair.
    db().prepare("DELETE FROM one_grants WHERE user_id=? AND encrypted_tokens=?").run(userId, grant.encrypted_tokens);
    db().prepare("DELETE FROM activity_cache WHERE relative_id=?").run(userId);
    throw error;
  }
}
function tenantHeaders(token: string) {
  const headers: Record<string, string> = {};
  // Token comes from One's authenticated token endpoint; payload only selects tenancy.
  // One still validates the token and enforces the grant on each request.
  try {
    const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString("utf8"));
    if (typeof payload.organization_ids?.[0] === "string") headers["X-One-Organization-Id"] = payload.organization_ids[0];
    if (typeof payload.project_ids?.[0] === "string") headers["X-One-Project-Id"] = payload.project_ids[0];
  } catch { /* Opaque/personal tokens do not supply tenancy headers. */ }
  return headers;
}
export async function reachableConnections(userId: string): Promise<OneConnection[]> {
  const token = await oneAccessToken(userId);
  let response: Response;
  try {
    response = await fetch("https://api.withone.ai/v1/connections/reachable", { cache: "no-store", signal: AbortSignal.timeout(15000), headers: { Authorization: `Bearer ${token}`, ...tenantHeaders(token) } });
  } catch { throw new ApiError(502, "One could not be reached. Please try again."); }
  if (response.status === 401) { clearOne(userId); throw new ApiError(409, "Your One connection expired or was revoked. Please reconnect."); }
  if (response.status === 403) throw new ApiError(403, "Your One grant does not allow access to this connection list.");
  if (!response.ok) throw new ApiError(502, "Your connected accounts could not be loaded.");
  const data = await response.json();
  if (!Array.isArray(data.rows)) throw new ApiError(502, "One returned an unexpected account list.");
  return data.rows.filter((row: Record<string, unknown>) => typeof row.key === "string").map((row: Record<string, unknown>) => ({
    key: row.key as string, platform: typeof row.platform === "string" ? row.platform : "unknown",
    name: typeof row.name === "string" ? row.name : typeof row.title === "string" ? row.title : "Connected account",
    access: row.access && typeof row.access === "object" ? row.access as Record<string, unknown> : {},
  }));
}
