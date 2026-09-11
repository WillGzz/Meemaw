import { randomUUID } from "node:crypto";
import { db } from "./db";
import { ApiError, field } from "./errors";
import { userById } from "./accounts";
import type { User, FamilyConnection, ConnectionStatus } from "../types";
export function connections(user: User): FamilyConnection[] {
  const elder = user.role === "ELDER";
  const rows = db().prepare(`SELECT c.id, c.status, c.relationship, u.id AS personId, u.name, u.instagram_username AS instagramUsername, u.location FROM elder_relative_connections c JOIN users u ON u.id = c.${elder ? "relative_id" : "elder_id"} WHERE c.${elder ? "elder_id" : "relative_id"} = ? ORDER BY c.created_at DESC`).all(user.id) as { id: string; status: ConnectionStatus; relationship: string; personId: string; name: string; instagramUsername: string | null; location: string }[];
  return rows.map(({ personId, name, instagramUsername, location, ...connection }) => ({ ...connection, person: { id: personId, name, instagramUsername, location } }));
}
export function requestConnection(elder: User, input: Record<string, unknown>) {
  if (elder.role !== "ELDER") throw new ApiError(403, "Only elder accounts can request family connections.");
  const code = field(input.familyCode, "Family code", 1, 40).toUpperCase();
  const relationship = field(input.relationship, "Relationship", 1, 60);
  const relative = db().prepare("SELECT id FROM users WHERE family_code = ? AND role = 'RELATIVE'").get(code) as { id: string } | undefined;
  if (!relative) throw new ApiError(404, "That family code was not found. Check it with your relative.");
  const existing = db().prepare("SELECT status FROM elder_relative_connections WHERE elder_id = ? AND relative_id = ?").get(elder.id, relative.id) as { status: string } | undefined;
  if (existing) throw new ApiError(409, existing.status === "DECLINED" ? "This connection was declined. Please speak with your relative." : "You have already requested this connection.");
  db().prepare("INSERT INTO elder_relative_connections(id,elder_id,relative_id,relationship,status,created_at) VALUES (?,?,?,?,'PENDING',?)").run(randomUUID(), elder.id, relative.id, relationship, Date.now());
}
export function respondConnection(relative: User, id: string, status: unknown) {
  if (relative.role !== "RELATIVE") throw new ApiError(403, "Only relatives can approve connections.");
  if (status !== "ACCEPTED" && status !== "DECLINED") throw new ApiError(400, "Choose accept or decline.");
  const result = db().prepare("UPDATE elder_relative_connections SET status = ? WHERE id = ? AND relative_id = ? AND (status = 'PENDING' OR (status = 'ACCEPTED' AND ? = 'DECLINED'))").run(status, id, relative.id, status);
  if (!result.changes) throw new ApiError(404, "This connection is no longer available.");
}
export function connectedRelative(elder: User, relativeId: string) {
  if (elder.role !== "ELDER") throw new ApiError(403, "Only elder accounts can ask about family.");
  const found = db().prepare("SELECT id FROM elder_relative_connections WHERE elder_id = ? AND relative_id = ? AND status = 'ACCEPTED'").get(elder.id, relativeId);
  if (!found) throw new ApiError(403, "Your relative must approve your connection before you can ask about them.");
  const user = userById(relativeId);
  if (!user) throw new ApiError(404, "Relative not found.");
  return user;
}
