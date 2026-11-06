import { db, stats } from "./data";
const avg = (a: number[]) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0);
export function dashboard() {
  const s = stats(), day = db.txs.filter((t) => t.at > Date.now() - 86400000);
  const byHour = [0, 0, 0, 0, 0, 0]; day.forEach((t) => (byHour[Math.floor(new Date(t.at).getHours() / 4)] += t.totalDZD));
  // Répartition des paiements : donnée de démo ; la vraie source sera le POS.
  const pay = { card: 0, cash: 0, code: 0 };
  day.forEach((t) => { const n = parseInt(t.id[0], 16) % 10; n < 6 ? pay.card++ : n < 9 ? pay.cash++ : pay.code++; });
  const perKiosk = db.kiosks.map((k) => { const m = day.filter((t) => t.kioskId === k.id); return { id: k.id, wait: +(avg(m.map((t) => t.waitSec)) / 60).toFixed(1), dur: +(avg(m.map((t) => t.durationSec)) / 60).toFixed(1), usage: Math.round((m.length / Math.max(1, day.length)) * 100) }; });
  const help = [0, 1, 2, 3, 4].map((i) => Math.round((s.helpRequests * [3, 1, 0, 2, 0][i]) / 6));
  const last = db.txs.slice(0, 5).map((t) => ({ id: t.id, at: t.at, kioskId: t.kioskId, totalDZD: t.totalDZD, dev: t.deviationPct ?? 0, status: t.exitCodeHash ? (db.exitCodes.get(t.exitCodeHash)?.used ? "used" : "ok") : "ko" }));
  const controls = db.alerts.filter((a) => a.kind === "CONTROLE" || a.kind === "ECART_POIDS").length;
  return { ...s, byHour, pay, perKiosk, help, last, controlRate: 5, weightOk: Math.max(0, day.length - controls), weightKo: controls,
    low: db.products.filter((p) => p.stock <= p.minStock * 2).map((p) => ({ barcode: p.barcode, name: p.name, weightG: p.weightG, stock: p.stock, minStock: p.minStock })),
    counts: { online: db.kiosks.filter((k) => k.status === "EN_LIGNE").length, offline: db.kiosks.filter((k) => k.status === "HORS_LIGNE").length, alert: db.kiosks.filter((k) => k.status === "ALERTE").length } };
}
export type Dash = ReturnType<typeof dashboard>;
