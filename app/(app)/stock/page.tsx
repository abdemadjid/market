import { revalidatePath } from "next/cache";
import { requirePerm } from "@/lib/auth";
import { db, log } from "@/lib/data";
import { dict, getLang } from "@/lib/i18n";
export const dynamic = "force-dynamic";
async function adjust(f: FormData) {
  "use server";
  const s = await requirePerm("adjust_stock"), p = db.products.find((x) => x.barcode === String(f.get("barcode"))), delta = Math.max(-1000, Math.min(1000, Math.trunc(Number(f.get("delta")) || 0)));
  if (!p) return; p.stock = Math.max(0, p.stock + delta); log(s.user, s.role, `Stock ${p.barcode} ajusté → ${p.stock}`); revalidatePath("/stock");
}
export default async function Stock() {
  const lang = await getLang(), t = dict(lang);
  return <><h2>🧊 {t.stock}</h2><p className="mut">{t.s_hint}</p>
    <div className="card anim"><table><thead><tr><th>{t.h_prod}</th><th>{t.h_stock}</th><th>{t.h_min}</th><th>{t.h_state}</th><th>{t.h_restock}</th></tr></thead><tbody>
      {db.products.map((p) => <tr key={p.barcode}><td>{p.name[lang]}</td><td>{p.stock}</td><td>{p.minStock}</td><td className={p.stock <= p.minStock ? "bad" : "ok"}>{p.stock === 0 ? t.stOut : p.stock <= p.minStock ? t.stLow : t.stOk}</td>
        <td><form action={adjust} style={{ display: "flex", gap: 6 }}><input type="hidden" name="barcode" value={p.barcode} /><input name="delta" type="number" defaultValue={20} style={{ width: 90 }} aria-label={t.h_restock} /><button>＋</button></form></td></tr>)}</tbody></table></div></>;
}
