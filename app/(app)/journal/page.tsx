import { requireRole } from "@/lib/auth";
import { db } from "@/lib/data";
export const dynamic = "force-dynamic";
export default async function Journal() {
  await requireRole("ADMIN");
  return <><h2>Journal des actions</h2><div className="card"><table><thead><tr><th>Date</th><th>Utilisateur</th><th>Rôle</th><th>Action</th></tr></thead><tbody>
    {db.audit.map((a) => <tr key={a.id}><td>{new Date(a.at).toLocaleString("fr-DZ")}</td><td>{a.user}</td><td>{a.role}</td><td>{a.action}</td></tr>)}</tbody></table></div></>;
}
