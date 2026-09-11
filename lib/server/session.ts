import { cookies } from "next/headers";
import { sessionUser } from "./accounts";
export const cookieName = "meemaw_session";
export async function currentUser() { return sessionUser((await cookies()).get(cookieName)?.value); }
