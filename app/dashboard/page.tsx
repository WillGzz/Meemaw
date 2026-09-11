import { redirect } from "next/navigation";
import { currentUser } from "@/lib/server/session";
import { connections } from "@/lib/server/family";
import FamilyDashboard from "@/app/components/family/FamilyDashboard";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export default async function DashboardPage() {
  const user = await currentUser();
  if (!user) redirect("/login");
  return <FamilyDashboard initial={{ user, connections: connections(user) }} />;
}
