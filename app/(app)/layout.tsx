import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getSession } from "@/lib/auth";
import { can } from "@/lib/perms";
import { db, log } from "@/lib/data";
import { dict, getLang, type Lang } from "@/lib/i18n";

async function logout() { "use server"; const s = await getSession(); if (s) log(s.user, s.role, "Déconnexion"); (await cookies()).delete("session"); redirect("/login"); }
async function setLang(l: Lang) { "use server"; (await cookies()).set("lang", l, { path: "/", sameSite: "strict", maxAge: 31536000 }); redirect("/dashboard"); }

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const s = await getSession(); if (!s) redirect("/login");
  const lang = await getLang(), t = dict(lang), n = db.alerts.filter((a) => a.open).length, role = s.role === "ADMIN" ? t.r_admin : t.r_sup;
  const nav: [string, string, string][] = [["/dashboard", "🏠", t.dash], ["/catalogue", "📦", t.cat], ["/categories", "🗂️", t.n_cats], ["/stock", "🧊", t.stock], ["/rapports", "📊", t.rep], ["/rapports#securite", "🛡️", t.n_fraud], ["/roles", "🔑", t.n_roles]];
  if (can(s.role, "view_audit")) nav.push(["/journal", "📋", t.journal]);
  return (
    <div className="shell">
      <nav className="side"><div className="brand"><div className="logo">🛒</div><b>Kenzo Market</b><small>{t.tag}</small></div>
        {nav.map(([h, i, l]) => <Link key={h} href={h}>{i} {l}</Link>)}
        <div className="uni"><span className="logo-pill"><img src="/logo-usaida.png" alt="Université de Saïda" /></span><small>📍 {t.wilaya}</small><small><b>{t.project}</b></small></div>
        <div className="ucard"><b>{s.user}</b><small>{role}</small><form action={logout}><button>⎋ {t.logout}</button></form></div><small className="by">by Kenza</small></nav>
      <div className="body"><header className="top"><form action="/catalogue" className="search"><input name="q" placeholder={t.search} aria-label={t.search} /></form>
        <span className="bell" aria-label={t.alerts}>🔔{n > 0 && <i>{n}</i>}</span>
        <div className="langs">{(["fr", "ar", "en"] as Lang[]).map((l) => <form key={l} action={setLang.bind(null, l)}><button className={l === lang ? "on" : ""}>{l.toUpperCase()}</button></form>)}</div>
        <b className="who">👤 {s.user} · {role}</b></header><main>{children}</main></div>
    </div>
  );
}
