import { kioskAuthorized } from "@/lib/auth";
import { consumeExitCode } from "@/lib/data";
export async function POST(req: Request) {
  if (!kioskAuthorized(req)) return Response.json({ error: "unauthorized" }, { status: 401 });
  const { code } = await req.json();
  return Response.json({ valid: consumeExitCode(String(code ?? "")) });
}
