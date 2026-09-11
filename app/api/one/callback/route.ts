import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { currentUser, cookieName } from "@/lib/server/session";
import { tokenHash } from "@/lib/server/accounts";
import { db } from "@/lib/server/db";
import { exchangeToken, oneConfig, saveGrant, unseal } from "@/lib/server/one";
export const runtime = "nodejs";
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const state = params.get("state") || "";
  const validState = /^[a-f0-9]{32}$/.test(state);
  const finish = (error?: string) => {
    const url = new URL("/dashboard", request.url);
    url.searchParams.set("one_connect", error ? "error" : "success");
    if (error) url.searchParams.set("one_connect_message", error);
    const response = NextResponse.redirect(url, 302);
    if (validState) response.cookies.delete(`one_tx_${state}`);
    response.headers.set("Cache-Control", "no-store");
    return response;
  };
  try {
    const user = await currentUser();
    const jar = await cookies();
    const proof = validState ? jar.get(`one_tx_${state}`)?.value : undefined;
    const session = jar.get(cookieName)?.value;
    if (!validState || !proof || !session || !user || user.role !== "RELATIVE") return finish("The connection attempt expired. Please start again.");
    // Atomic consumption prevents callback replay, even across multiple requests.
    const transaction = db().prepare("DELETE FROM one_transactions WHERE state=? AND user_id=? AND session_hash=? AND proof_hash=? AND expires_at>? RETURNING encrypted_verifier")
      .get(state, user.id, tokenHash(session), tokenHash(proof), Date.now()) as { encrypted_verifier: string } | undefined;
    if (!transaction) return finish("The connection attempt expired. Please start again.");
    if (params.has("error")) return finish("You cancelled the connection. You can try again whenever you’re ready.");
    const code = params.get("code");
    if (!code || code.length > 4096) return finish("One did not return a valid authorization code.");
    const config = oneConfig();
    if (new URL(request.url).origin !== config.origin) return finish("The callback address did not match.");
    const result = await exchangeToken(new URLSearchParams({ grant_type: "authorization_code", code, redirect_uri: config.redirectUri, code_verifier: unseal(transaction.encrypted_verifier, user.id) }));
    saveGrant(user.id, result.tokens, result.expiresAt);
    return finish();
  } catch { return finish("One could not finish connecting. Please try again."); }
}
