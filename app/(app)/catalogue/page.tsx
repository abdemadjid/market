import { revalidatePath } from "next/cache";
import { getSession, requirePerm } from "@/lib/auth";
import { can } from "@/lib/perms";
import { db, log } from "@/lib/data";
import { dict, getLang } from "@/lib/i18n";
export const dynamic = "force-dynamic";

async function addProduct(f: FormData) {
  "use server";
  const s = await requirePerm("manage_catalogue"), barcode = String(f.get("barcode")).trim(), cat = String(f.get("cat")), nm = (k: string) => String(f.get(k)).trim().slice(0, 80);
  if (!/^\d{8,14}$/.test(barcode) || db.products.some((p) => p.barcode === barcode) || !db.categories.some((c) => c.id === cat) || !nm("fr") || !nm("ar") || !nm("en")) return;
  db.products.push({ barcode, categoryId: cat, name: { fr: nm("fr"), ar: nm("ar"), en: nm("en") }, priceDZD: Math.max(0, Number(f.get("price")) || 0), weightG: Math.max(1, Number(f.get("weight")) || 1), stock: 0, minStock: 10 });
  log(s.user, s.role, `Produit ajouté ${barcode}`); revalidatePath("/catalogue");
}
export default async function Catalogue({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const q = ((await searchParams).q ?? "").toLowerCase(), lang = await getLang(), t = dict(lang), s = (await getSession())!, edit = can(s.role, "manage_catalogue");
  const list = db.products.filter((p) => !q || p.barcode.includes(q) || Object.values(p.name).some((n) => n.toLowerCase().includes(q)) || (db.categories.find((c) => c.id === p.categoryId)?.name[lang] ?? "").toLowerCase().includes(q));
  return <><h2>📦 {t.cat}</h2>
    <div className="card anim"><table><thead><tr><th>{t.h_bar}</th><th>{t.h_cat}</th><th>FR</th><th>AR</th><th>EN</th><th>{t.h_price}</th><th>{t.h_w}</th></tr></thead><tbody>
      {list.map((p) => { const c = db.categories.find((x) => x.id === p.categoryId); return <tr key={p.barcode}><td>{p.barcode}</td><td>{c ? `${c.emoji} ${c.name[lang]}` : "—"}</td><td>{p.name.fr}</td><td dir="rtl">{p.name.ar}</td><td>{p.name.en}</td><td>{p.priceDZD} {t.cur}</td><td>{p.weightG} g</td></tr>; })}</tbody></table></div>
    {edit && <form action={addProduct} className="card grid" style={{ marginTop: 16 }}><b>{t.addP}</b>
      <input name="barcode" placeholder={t.h_bar} inputMode="numeric" required /><select name="cat" required>{db.categories.map((c) => <option key={c.id} value={c.id}>{c.emoji} {c.name[lang]}</option>)}</select>
      <input name="fr" placeholder={t.nFr} required /><input name="ar" dir="rtl" placeholder={t.nAr} required /><input name="en" placeholder={t.nEn} required />
      <input name="price" type="number" min="0" placeholder={t.h_price} required /><input name="weight" type="number" min="1" placeholder={t.h_w} required /><button>＋ {t.add}</button></form>}</>;
}
