import { createHash, randomBytes, randomUUID, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { db } from "./db";
import { ApiError, field } from "./errors";
import type { User } from "../types";
const derive = promisify(scrypt);
const columns = `id, name, email, role, instagram_username AS instagramUsername, family_code AS familyCode, location`;
export const sessionAge = 60 * 60 * 24 * 7;
export const tokenHash = (value: string) => createHash("sha256").update(value).digest("hex");
export function userById(id: string) { return db().prepare(`SELECT ${columns} FROM users WHERE id = ?`).get(id) as User | undefined; }

export function limit(bucket: string, maximum: number, seconds: number) {
  const now = Date.now();
  db().transaction(() => {
    db().prepare("DELETE FROM rate_limits WHERE expires_at <= ?").run(now);
    db().prepare(`INSERT INTO rate_limits(bucket,count,expires_at) VALUES (?,1,?) ON CONFLICT(bucket) DO UPDATE SET count = count + 1`).run(bucket, now + seconds * 1000);
    const entry = db().prepare("SELECT count FROM rate_limits WHERE bucket = ?").get(bucket) as { count: number };
    if (entry.count > maximum) throw new ApiError(429, "Please wait a few minutes before trying again.");
  })();
}

export async function register(input: Record<string, unknown>) {
  const name = field(input.name, "Name", 1, 100);
  const email = field(input.email, "Email", 3, 254).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new ApiError(400, "Enter a valid email address.");
  if (typeof input.password !== "string" || input.password.length < 10 || input.password.length > 128) throw new ApiError(400, "Use a password between 10 and 128 characters.");
  const role = input.role;
  if (role !== "ELDER" && role !== "RELATIVE") throw new ApiError(400, "Choose an account type.");
  let instagram: string | null = null;
  if (role === "RELATIVE") {
    instagram = field(input.instagramUsername, "Instagram username", 1, 31).replace(/^@/, "").toLowerCase();
    if (!/^[a-z0-9._]{1,30}$/.test(instagram)) throw new ApiError(400, "Enter an Instagram username, not a profile URL.");
  }
  const location = input.location ? field(input.location, "Location", 1, 120) : "";
  const salt = randomBytes(16).toString("hex");
  const hash = (await derive(input.password, salt, 64)) as Buffer;
  const id = randomUUID();
  const code = role === "RELATIVE" ? `MF-${randomBytes(6).toString("hex").toUpperCase()}` : null;
  try {
    db().prepare("INSERT INTO users(id,name,email,password_hash,role,instagram_username,family_code,location,created_at) VALUES (?,?,?,?,?,?,?,?,?)")
      .run(id, name, email, `${salt}:${hash.toString("hex")}`, role, instagram, code, location, Date.now());
  } catch (error) {
    if ((error as { code?: string }).code === "SQLITE_CONSTRAINT_UNIQUE") throw new ApiError(409, "An account with these details already exists. Try signing in.");
    throw error;
  }
  return userById(id)!;
}

export async function login(input: Record<string, unknown>) {
  const email = field(input.email, "Email", 3, 254).toLowerCase();
  limit(`login:${tokenHash(email)}`, 15, 900);
  if (typeof input.password !== "string" || input.password.length > 128) throw new ApiError(400, "Enter your password.");
  const row = db().prepare("SELECT id,password_hash FROM users WHERE email = ?").get(email) as { id: string; password_hash: string } | undefined;
  // Derive a key even for an unknown email to avoid a fast account-existence signal.
  const [salt, expected] = (row?.password_hash || `${"0".repeat(32)}:${"0".repeat(128)}`).split(":");
  const actual = (await derive(input.password, salt, 64)) as Buffer;
  if (!timingSafeEqual(actual, Buffer.from(expected, "hex")) || !row) throw new ApiError(401, "Email or password is incorrect.");
  return userById(row.id)!;
}
export function createSession(userId: string) {
  const token = randomBytes(32).toString("hex");
  db().prepare("DELETE FROM sessions WHERE expires_at <= ?").run(Date.now());
  db().prepare("INSERT INTO sessions(token_hash,user_id,expires_at) VALUES (?,?,?)").run(tokenHash(token), userId, Date.now() + sessionAge * 1000);
  return token;
}
export function sessionUser(token: string | undefined) {
  if (!token) return undefined;
  const row = db().prepare("SELECT user_id FROM sessions WHERE token_hash = ? AND expires_at > ?").get(tokenHash(token), Date.now()) as { user_id: string } | undefined;
  return row ? userById(row.user_id) : undefined;
}
export function revokeSession(token: string | undefined) {
  if (token) db().prepare("DELETE FROM sessions WHERE token_hash = ?").run(tokenHash(token));
}
