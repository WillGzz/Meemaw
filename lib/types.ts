export type Role = "ELDER" | "RELATIVE";
export type ConnectionStatus = "PENDING" | "ACCEPTED" | "DECLINED";
export type User = { id: string; name: string; email: string; role: Role; instagramUsername: string | null; familyCode: string | null; location: string };
export type FamilyConnection = { id: string; status: ConnectionStatus; relationship: string; person: Pick<User, "id" | "name" | "instagramUsername" | "location"> };
export type DashboardData = { user: User; connections: FamilyConnection[] };
export type AskResponse = { id: string; learning: { responseStyle: string; feedbackCount: number }; quality: { removedItems: number; duplicateItems: number; cleanedAt: string }; relative: { id: string; name: string }; question: string; answer: string; activityUpdatedAt: string; sources: { title: string; url: string }[] };
export type RegisterInput = { name: string; email: string; password: string; role: Role; instagramUsername?: string; location?: string };
