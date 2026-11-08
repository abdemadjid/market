// Stockage en mémoire pour la démo. En production : PostgreSQL (Prisma/Drizzle).
// Le domaine (poids, code de sortie, idempotence) est isolé ici pour être réutilisable
// par une future app mobile / chariot intelligent via les mêmes routes /api/kiosk/*.
import { randomInt, randomUUID } from "node:crypto";

export type Role = "ADMIN" | "SUPERVISEUR";
export type Category = { id: string; name: { fr: string; ar: string; en: string }; emoji: string; image?: string };
export type Product = { barcode: string; categoryId: string; name: { fr: string; ar: string; en: string }; priceDZD: number; weightG: number; stock: number; minStock: number };
export type Kiosk = { id: string; name: string; status: "EN_LIGNE" | "HORS_LIGNE" | "ALERTE"; lastSeen: number; offlineQueue: number };
export type Alert = { id: string; at: number; kind: "RUPTURE" | "ECART_POIDS" | "CONTROLE" | "AIDE"; kioskId: string; message: string; open: boolean };
export type Tx = { id: string; idempotencyKey: string; kioskId: string; at: number; durationSec: number; waitSec: number; totalDZD: number; items: { barcode: string; qty: number; measuredG: number }[]; exitCodeHash?: string; deviationPct?: number };
export type Audit = { id: string; at: number; user: string; role: Role; action: string };

const now = Date.now();
const p = (barcode: string, fr: string, ar: string, en: string, priceDZD: number, weightG: number, stock: number, minStock = 10, categoryId = "c-epicerie"): Product =>
  ({ barcode, categoryId, name: { fr, ar, en }, priceDZD, weightG, stock, minStock });

const g = globalThis as unknown as { __db?: DB };
type DB = { categories: Category[]; products: Product[]; kiosks: Kiosk[]; alerts: Alert[]; txs: Tx[]; audit: Audit[]; exitCodes: Map<string, { txId: string; used: boolean; exp: number }>; helpRequests: number };

export const db: DB = (g.__db ??= {
  categories: [
    { id: "c-laitier", name: { fr: "Produits laitiers", ar: "منتجات الألبان", en: "Dairy" }, emoji: "🥛" },
    { id: "c-boulangerie", name: { fr: "Boulangerie", ar: "مخبزة", en: "Bakery" }, emoji: "🍞" },
    { id: "c-epicerie", name: { fr: "Épicerie", ar: "مواد غذائية", en: "Grocery" }, emoji: "🌾" },
    { id: "c-boissons", name: { fr: "Boissons", ar: "مشروبات", en: "Drinks" }, emoji: "💧" },
    { id: "c-fruits", name: { fr: "Fruits & légumes", ar: "فواكه وخضر", en: "Fruits & veg" }, emoji: "🍎" },
  ],
  products: [
    p("6130000000011", "Lait entier 1L", "حليب كامل الدسم 1 لتر", "Whole milk 1L", 140, 1030, 120, 10, "c-laitier"),
    p("6130000000028", "Pain de mie", "خبز القالب", "Sandwich bread", 120, 500, 8, 10, "c-boulangerie"),
    p("6130000000035", "Huile de table 2L", "زيت المائدة 2 لتر", "Cooking oil 2L", 560, 1850, 45),
    p("6130000000042", "Semoule fine 1kg", "سميد ناعم 1 كغ", "Fine semolina 1kg", 95, 1005, 200),
    p("6130000000059", "Eau minérale 1.5L", "ماء معدني 1.5 لتر", "Mineral water 1.5L", 45, 1530, 3, 20, "c-boissons"),
  ],
  kiosks: ["Borne 01", "Borne 02", "Borne 03", "Borne 04"].map((name, i) => ({ id: `K${i + 1}`, name, status: i === 3 ? "HORS_LIGNE" : "EN_LIGNE", lastSeen: now - (i === 3 ? 600000 : 2000), offlineQueue: i === 3 ? 4 : 0 })),
  alerts: [
    { id: randomUUID(), at: now - 120000, kind: "ECART_POIDS", kioskId: "K2", message: "Écart de poids : attendu 1030 g, mesuré 1290 g", open: true },
    { id: randomUUID(), at: now - 300000, kind: "RUPTURE", kioskId: "-", message: "Stock bas : Eau minérale 1.5L (3)", open: true },
  ],
  txs: Array.from({ length: 24 }, (_, i) => ({ id: randomUUID(), idempotencyKey: `seed-${i}`, kioskId: `K${(i % 3) + 1}`, at: now - i * 3600000, durationSec: 70 + ((i * 17) % 90), waitSec: 10 + ((i * 7) % 60), totalDZD: 300 + ((i * 137) % 2200), items: [] })),
  audit: [],
  exitCodes: new Map(),
  helpRequests: 6,
});

export const TOLERANCE_G = 15; // tolérance de balance, à calibrer par produit
export const RANDOM_CHECK_RATE = 0.1; // 10 % des transactions

export function log(user: string, role: Role, action: string) {
  db.audit.unshift({ id: randomUUID(), at: Date.now(), user, role, action });
  db.audit.length = Math.min(db.audit.length, 500);
}
export function raise(kind: Alert["kind"], kioskId: string, message: string) {
  db.alerts.unshift({ id: randomUUID(), at: Date.now(), kind, kioskId, message, open: true });
}
const hash = (s: string) => require("node:crypto").createHash("sha256").update(s).digest("hex") as string;

/** Enregistre une transaction : idempotente (renvoi hors-ligne sans doublon), décrémente le stock, vérifie les poids. */
export function recordTransaction(input: Omit<Tx, "id" | "at"> & { at?: number }) {
  const dup = db.txs.find((t) => t.idempotencyKey === input.idempotencyKey);
  if (dup) return { tx: dup, duplicate: true as const, exitCode: null, controlled: false, mismatches: [] as string[] };

  const mismatches: string[] = []; let dev = 0;
  for (const it of input.items) {
    const prod = db.products.find((x) => x.barcode === it.barcode);
    if (!prod) { mismatches.push(`Code inconnu ${it.barcode}`); continue; }
    const expected = prod.weightG * it.qty; dev = Math.max(dev, (Math.abs(it.measuredG - expected) / expected) * 100);
    if (Math.abs(it.measuredG - expected) > TOLERANCE_G * it.qty) {
      const m = `Écart de poids ${prod.name.fr} : attendu ${expected} g, mesuré ${it.measuredG} g`;
      mismatches.push(m); raise("ECART_POIDS", input.kioskId, m);
    }
    prod.stock = Math.max(0, prod.stock - it.qty);
    if (prod.stock <= prod.minStock) raise("RUPTURE", "-", `Stock bas : ${prod.name.fr} (${prod.stock})`);
  }
  const controlled = mismatches.length > 0 || Math.random() < RANDOM_CHECK_RATE;
  if (controlled && !mismatches.length) raise("CONTROLE", input.kioskId, "Contrôle aléatoire déclenché (vérification caméra)");

  // Code de sortie à usage unique : 6 chiffres, seul le hash est conservé, expire en 10 min.
  const exitCode = controlled ? null : String(randomInt(0, 1_000_000)).padStart(6, "0");
  const tx: Tx = { ...input, id: randomUUID(), at: input.at ?? Date.now(), deviationPct: Math.round(dev * 10) / 10, exitCodeHash: exitCode ? hash(exitCode) : undefined };
  db.txs.unshift(tx);
  if (exitCode) db.exitCodes.set(hash(exitCode), { txId: tx.id, used: false, exp: Date.now() + 600000 });
  return { tx, duplicate: false as const, exitCode, controlled, mismatches };
}

/** Validation à la porte : usage unique. */
export function consumeExitCode(code: string) {
  const e = db.exitCodes.get(hash(code));
  if (!e || e.used || e.exp < Date.now()) return false;
  e.used = true; return true;
}

export function stats() {
  const day = db.txs.filter((t) => t.at > Date.now() - 86400000);
  const avg = (a: number[]) => (a.length ? Math.round(a.reduce((x, y) => x + y, 0) / a.length) : 0);
  const sales = day.reduce((s, t) => s + t.totalDZD, 0);
  const online = db.kiosks.filter((k) => k.status !== "HORS_LIGNE").length;
  return {
    kiosks: db.kiosks, alerts: db.alerts.filter((a) => a.open).slice(0, 8),
    salesDZD: sales, txCount: day.length, avgDurationSec: avg(day.map((t) => t.durationSec)),
    avgWaitSec: avg(day.map((t) => t.waitSec)), usageRate: Math.round((online / db.kiosks.length) * 100),
    helpRequests: db.helpRequests, stockAccuracy: 98.7, offlinePending: db.kiosks.reduce((s, k) => s + k.offlineQueue, 0),
  };
}
