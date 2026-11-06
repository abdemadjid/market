import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getSession } from "@/lib/auth";
import { db, log } from "@/lib/data";
import { dict, getLang, type Lang } from "@/lib/i18n";

async function logout() { "use server"; const s = await getSession(); if (s) log(s.user, s.role, "Déconnexion"); (await cookies()).delete("session"); redirect("/login"); }
async function setLang(l: Lang) { "use server"; (await cookies()).set("lang", l, { path: "/", sameSite: "strict", maxAge: 31536000 }); redirect("/dashboard"); }

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const s = await getSession(); if (!s) redirect("/login");
  const lang = await getLang(), t = dict(lang), n = db.alerts.filter((a) => a.open).length, role = s.role === "ADMIN" ? "Administrateur" : "Superviseur";
  return (
    <div className="shell" dir={lang === "ar" ? "rtl" : "ltr"} lang={lang}>
      <nav className="side"><div className="brand"><div className="logo">🛒</div><b>Borne-Admin</b><small>Gestion Centrale</small></div>
        <Link href="/dashboard">🏠 {t.dash}</Link><Link href="/catalogue">📦 {t.cat}</Link><Link href="/stock">🧊 {t.stock}</Link><Link href="/rapports">📊 {t.rep}</Link><Link href="/rapports#securite">🛡️ Anti-Fraude</Link>
        {s.role === "ADMIN" && <Link href="/journal">📋 {t.journal}</Link>}
        <div className="ucard"><b>{s.user}</b><small>{role}</small><form action={logout}><button>⎋ {t.logout}</button></form></div></nav>
      <div className="body"><header className="top"><form action="/catalogue" className="search"><input name="q" placeholder="Rechercher un produit, une borne..." /></form>
        <span className="bell">🔔{n > 0 && <i>{n}</i>}</span>
        <div className="langs">{(["fr", "ar", "en"] as Lang[]).map((l) => <form key={l} action={setLang.bind(null, l)}><button className={l === lang ? "on" : ""}>{l.toUpperCase()}</button></form>)}</div>
        <b className="who">👤 {s.user}</b></header><main>{children}</main></div>
    </div>
  );
}
