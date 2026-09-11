import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { currentUser, cookieName } from "@/lib/server/session";
import { limit, tokenHash } from "@/lib/server/accounts";
import { oneConfig, seal } from "@/lib/server/one";
import { db } from "@/lib/server/db";
import { ApiError } from "@/lib/server/errors";
export const runtime = "nodejs";
export async function GET(request: Request) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.redirect(new URL("/login", request.url));
    if (user.role !== "RELATIVE") throw new ApiError(403, "Only relatives can connect social accounts.");
    limit(`one-auth:${user.id}`, 10, 600);
    const config = oneConfig();
    if (new URL(request.url).origin !== config.origin) throw new ApiError(400, "Open Meemaw at its configured HTTPS address before connecting.");
    const state = randomBytes(16).toString("hex");
    const verifier = randomBytes(32).toString("base64url");
    const proof = randomBytes(32).toString("hex");
    const session = (await cookies()).get(cookieName)!.value;
    db().prepare("DELETE FROM one_transactions WHERE expires_at <= ?").run(Date.now());
    db().prepare("INSERT INTO one_transactions(state,user_id,session_hash,proof_hash,encrypted_verifier,expires_at) VALUES (?,?,?,?,?,?)")
      .run(state, user.id, tokenHash(session), tokenHash(proof), seal(verifier, user.id), Date.now() + 600000);
    const url = new URL("https://api.withone.ai/oauth/authorize");
    url.search = new URLSearchParams({ client_id: config.clientId, redirect_uri: config.redirectUri, response_type: "code", scope: "user:connections:read user:connections:write org:connections:read org:connections:write project:connections:read project:connections:write", state,
      code_challenge: createHash("sha256").update(verifier).digest("base64url"), code_challenge_method: "S256", login_hint: user.email }).toString();
    if (process.env.ONE_PERMISSION_SET) url.searchParams.set("permission_set", process.env.ONE_PERMISSION_SET);
    const response = NextResponse.redirect(url, 302);
    response.cookies.set(`one_tx_${state}`, proof, { httpOnly: true, secure: true, sameSite: "lax", maxAge: 600, path: "/" });
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch (error) {
    const url = new URL("/dashboard", request.url);
    url.searchParams.set("one_connect", "error");
    url.searchParams.set("one_connect_message", error instanceof ApiError ? error.message : "Account connection could not start.");
    return NextResponse.redirect(url, 302);
  }
}
