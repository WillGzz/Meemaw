import { currentUser } from "@/lib/server/session";
import { oneConfigured, reachableConnections } from "@/lib/server/one";
import { ApiError } from "@/lib/server/errors";
export const runtime = "nodejs";
export async function GET() {
  const headers = { "Cache-Control": "no-store" };
  try {
    const user = await currentUser();
    if (!user) throw new ApiError(401, "Please sign in to continue.");
    if (user.role !== "RELATIVE") throw new ApiError(403, "Only relatives can view these connections.");
    if (!oneConfigured()) return Response.json({ configured: false, connected: false, connections: [] }, { headers });
    try { return Response.json({ configured: true, connected: true, connections: await reachableConnections(user.id) }, { headers }); }
    catch (error) {
      if (error instanceof ApiError && error.status === 409) return Response.json({ configured: true, connected: false, connections: [], message: error.message }, { headers });
      throw error;
    }
  } catch (error) {
    return Response.json({ error: error instanceof ApiError ? error.message : "Could not load connected accounts." }, { status: error instanceof ApiError ? error.status : 500, headers });
  }
}
