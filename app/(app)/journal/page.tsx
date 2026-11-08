import { requirePerm } from "@/lib/auth";
import { db } from "@/lib/data";
import { dict, getLang } from "@/lib/i18n";
export const dynamic = "force-dynamic";
export default async function Journal() {
  await requirePerm("view_audit"); const t = dict(await getLang());
  return <><h2>📋 {t.journal}</h2><div className="card anim"><table><thead><tr><th>{t.h_date}</th><th>{t.h_user}</th><th>{t.h_role}</th><th>{t.h_act}</th></tr></thead><tbody>
    {db.audit.map((a) => <tr key={a.id}><td>{new Date(a.at).toLocaleString("fr-DZ")}</td><td>{a.user}</td><td>{a.role}</td><td>{a.action}</td></tr>)}</tbody></table></div></>;
}
