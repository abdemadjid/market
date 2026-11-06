import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { db, log } from "@/lib/data";

async function addProduct(f: FormData) {
  "use server";
  const s = await requireRole("ADMIN"); // seul l'administrateur modifie le catalogue
  const barcode = String(f.get("barcode")).trim();
  if (!/^\d{8,14}$/.test(barcode) || db.products.some((p) => p.barcode === barcode)) return;
  db.products.push({ barcode, name: { fr: String(f.get("fr")), ar: String(f.get("ar")), en: String(f.get("en")) },
    priceDZD: Math.max(0, Number(f.get("price"))), weightG: Math.max(1, Number(f.get("weight"))), stock: 0, minStock: 10 });
  log(s.user, s.role, `Produit ajouté ${barcode}`); revalidatePath("/catalogue");
}

export default async function Catalogue() {
  return <><h2>Catalogue</h2>
    <div className="card"><table><thead><tr><th>Code-barres</th><th>Français</th><th>العربية</th><th>English</th><th>Prix</th><th>Poids réf.</th></tr></thead><tbody>
      {db.products.map((p) => <tr key={p.barcode}><td>{p.barcode}</td><td>{p.name.fr}</td><td dir="rtl">{p.name.ar}</td><td>{p.name.en}</td><td>{p.priceDZD} DZD</td><td>{p.weightG} g</td></tr>)}</tbody></table></div>
    <form action={addProduct} className="card grid" style={{ marginTop: 16 }}>
      <input name="barcode" placeholder="Code-barres" required /><input name="fr" placeholder="Nom (FR)" required />
      <input name="ar" dir="rtl" placeholder="الاسم (AR)" required /><input name="en" placeholder="Name (EN)" required />
      <input name="price" type="number" min="0" placeholder="Prix DZD" required /><input name="weight" type="number" min="1" placeholder="Poids (g)" required />
      <button>Ajouter (admin)</button></form></>;
}
