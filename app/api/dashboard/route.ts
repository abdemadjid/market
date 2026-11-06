import { getSession } from "@/lib/auth";
import { dashboard } from "@/lib/dash";
export const dynamic = "force-dynamic";
export async function GET() {
  if (!(await getSession())) return Response.json({ error: "unauthorized" }, { status: 401 });
  return Response.json(dashboard());
}
