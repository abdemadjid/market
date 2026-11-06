import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { db, log } from "@/lib/data";
export const dynamic = "force-dynamic";

async function adjust(f: FormData) {
  "use server";
  const s = await requireRole("ADMIN", "SUPERVISEUR");
  const p = db.products.find((x) => x.barcode === String(f.get("barcode"))); if (!p) return;
  p.stock = Math.max(0, p.stock + Number(f.get("delta")));
  log(s.user, s.role, `Stock ${p.barcode} ajusté → ${p.stock}`); revalidatePath("/stock");
}

export default function Stock() {
  return <><h2>Stock</h2><p style={{ color: "var(--mut)" }}>Décrémenté à chaque vente ; synchronisation caisse (POS) via <code>/api/kiosk/transactions</code>.</p>
    <div className="card"><table><thead><tr><th>Produit</th><th>Stock</th><th>Seuil</th><th>État</th><th>Réapprovisionner</th></tr></thead><tbody>
      {db.products.map((p) => <tr key={p.barcode}><td>{p.name.fr}</td><td>{p.stock}</td><td>{p.minStock}</td>
        <td className={p.stock <= p.minStock ? "bad" : "ok"}>{p.stock === 0 ? "Rupture" : p.stock <= p.minStock ? "Stock bas" : "OK"}</td>
        <td><form action={adjust} style={{ display: "flex", gap: 6 }}><input type="hidden" name="barcode" value={p.barcode} /><input name="delta" type="number" defaultValue={20} style={{ width: 80 }} /><button>+</button></form></td></tr>)}</tbody></table></div></>;
}
