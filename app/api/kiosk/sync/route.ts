// Renvoi de la file hors-ligne : chaque transaction porte son idempotencyKey → aucun doublon.
import { kioskAuthorized } from "@/lib/auth";
import { db, recordTransaction } from "@/lib/data";
export async function POST(req: Request) {
  if (!kioskAuthorized(req)) return Response.json({ error: "unauthorized" }, { status: 401 });
  const { kioskId, queue } = await req.json();
  const res = (queue ?? []).map((t: Parameters<typeof recordTransaction>[0]) => ({ key: t.idempotencyKey, duplicate: recordTransaction({ ...t, kioskId }).duplicate }));
  const k = db.kiosks.find((x) => x.id === kioskId);
  if (k) { k.status = "EN_LIGNE"; k.offlineQueue = 0; k.lastSeen = Date.now(); }
  return Response.json({ results: res });
}
