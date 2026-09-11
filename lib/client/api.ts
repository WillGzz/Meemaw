import type { AskResponse, DashboardData, RegisterInput } from "../types";
export class RequestError extends Error { constructor(message: string, public status: number) { super(message); } }
async function request<T>(path: string, method = "GET", body?: unknown, signal?: AbortSignal): Promise<T> {
  let response: Response;
  try {
    response = await fetch(path, { method, credentials: "same-origin", cache: "no-store", signal,
      headers: body === undefined ? {} : { "Content-Type": "application/json" }, body: body === undefined ? undefined : JSON.stringify(body) });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") throw error;
    throw new RequestError("Cannot reach Meemaw. Check your connection and try again.", 0);
  }
  const data = await response.json();
  if (!response.ok) throw new RequestError(data.error || "Please try again.", response.status);
  return data as T;
}
export const api = {
  register: (input: RegisterInput) => request("/api/auth/register", "POST", input),
  login: (email: string, password: string) => request("/api/auth/login", "POST", { email, password }),
  logout: () => request("/api/auth/logout", "POST", {}),
  dashboard: () => request<DashboardData>("/api/dashboard"),
  connect: (familyCode: string, relationship: string) => request("/api/connections", "POST", { familyCode, relationship }),
  respond: (id: string, status: "ACCEPTED" | "DECLINED") => request(`/api/connections/${encodeURIComponent(id)}`, "PATCH", { status }),
  feedback: (answerId: string, kind: string) => request("/api/elder/feedback", "POST", { answerId, kind }),
  askRelative: (relativeId: string, question: string, signal?: AbortSignal) => request<AskResponse>("/api/elder/ask", "POST", { relativeId, question }, signal),
};
