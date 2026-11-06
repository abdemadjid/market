import { kioskAuthorized } from "@/lib/auth";
import { recordTransaction } from "@/lib/data";
export async function POST(req: Request) {
  if (!kioskAuthorized(req)) return Response.json({ error: "unauthorized" }, { status: 401 });
  const b = await req.json(); // ⚠ Aucune donnée de carte : le paiement reste sur le TPE/POS.
  if (!b.idempotencyKey || !Array.isArray(b.items)) return Response.json({ error: "invalid" }, { status: 400 });
  const r = recordTransaction(b);
  return Response.json({ id: r.tx.id, duplicate: r.duplicate, controlled: r.controlled, exitCode: r.exitCode, mismatches: r.mismatches });
}
