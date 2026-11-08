import { getSession } from "@/lib/auth";
import { dict, getLang, type Dict } from "@/lib/i18n";
import { PERMS, can } from "@/lib/perms";
export const dynamic = "force-dynamic";
export default async function Roles() {
  const s = (await getSession())!, t = dict(await getLang());
  const roles = [{ r: "ADMIN" as const, icon: "👑", name: t.rl_a, d: t.rl_ad }, { r: "SUPERVISEUR" as const, icon: "🧭", name: t.rl_s, d: t.rl_sd }];
  return <><h2>🔑 {t.rl_t}</h2><p className="mut">{t.rl_i}</p>
    <div className="roles">{roles.map((x, i) => <article key={x.r} className={`rolecard anim ${s.role === x.r ? "me" : ""}`} style={{ "--i": i } as React.CSSProperties}><span className="ico">{x.icon}</span><h3>{x.name}{s.role === x.r && <span className="pill"> {t.yourRole}</span>}</h3><p>{x.d}</p></article>)}</div>
    <div className="card"><h3 style={{ marginBottom: 10 }}>{t.rl_m}</h3><table className="matrix"><thead><tr><th>{t.rl_p}</th><th>👑 {t.rl_a}</th><th>🧭 {t.rl_s}</th></tr></thead><tbody>
      {PERMS.map((p) => <tr key={p}><td>{t[`p_${p}` as keyof Dict]}</td>{(["ADMIN", "SUPERVISEUR"] as const).map((r) => <td key={r} className={can(r, p) ? "ok" : "bad"} aria-label={can(r, p) ? t.yes : t.no}>{can(r, p) ? "✔" : "✘"}</td>)}</tr>)}</tbody></table></div></>;
}
