import { db } from "./db";
import { ApiError } from "./errors";
import type { User } from "../types";
export type FeedbackKind = "HELPFUL" | "SHORTER" | "MORE_DETAIL" | "NOT_ACCURATE";
export function feedback(user: User, answerId: string, kind: unknown) {
  if (user.role !== "ELDER") throw new ApiError(403, "Only elder accounts can rate answers.");
  if (!["HELPFUL", "SHORTER", "MORE_DETAIL", "NOT_ACCURATE"].includes(String(kind))) throw new ApiError(400, "Choose a feedback option.");
  const answer = db().prepare("SELECT relative_id FROM answers WHERE id=? AND elder_id=?").get(answerId, user.id) as { relative_id: string } | undefined;
  if (!answer) throw new ApiError(404, "Answer not found.");
  db().prepare("INSERT INTO answer_feedback(answer_id,elder_id,kind,created_at) VALUES (?,?,?,?) ON CONFLICT(answer_id) DO UPDATE SET kind=excluded.kind,created_at=excluded.created_at").run(answerId, user.id, kind, Date.now());
  // An inaccurate answer may have come from stale activity; fetch again next time.
  if (kind === "NOT_ACCURATE") db().prepare("DELETE FROM activity_cache WHERE relative_id=?").run(answer.relative_id);
  return preferences(user.id);
}
export function preferences(elderId: string) {
  const rows = db().prepare("SELECT kind FROM answer_feedback WHERE elder_id=? ORDER BY created_at DESC, rowid DESC LIMIT 20").all(elderId) as { kind: FeedbackKind }[];
  const length = rows.find(row => row.kind === "SHORTER" || row.kind === "MORE_DETAIL")?.kind;
  return { responseStyle: length === "MORE_DETAIL" ? "detailed" : "short", preferVerifiedClaims: rows.slice(0, 5).some(row => row.kind === "NOT_ACCURATE"), feedbackCount: rows.length };
}
