import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getSession } from "@/lib/auth";
import { log } from "@/lib/data";
import { dict, getLang, type Lang } from "@/lib/i18n";

async function logout() { "use server"; const s = await getSession(); if (s) log(s.user, s.role, "Déconnexion"); (await cookies()).delete("session"); redirect("/login"); }
async function setLang(l: Lang) { "use server"; (await cookies()).set("lang", l, { path: "/", sameSite: "strict", maxAge: 31536000 }); redirect("/dashboard"); }

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const s = await getSession(); if (!s) redirect("/login");
  const lang = await getLang(), t = dict(lang);
  return (
    <div className="shell" dir={lang === "ar" ? "rtl" : "ltr"} lang={lang}>
      <nav className="side"><div className="logo">🛒</div>
        <Link href="/dashboard">▦ {t.dash}</Link><Link href="/catalogue">▤ {t.cat}</Link><Link href="/stock">▥ {t.stock}</Link><Link href="/dashboard#securite">⛨ {t.sec}</Link><Link href="/rapports">▧ {t.rep}</Link>
        {s.role === "ADMIN" && <Link href="/journal">▨ {t.journal}</Link>}</nav>
      <div className="body"><header className="top"><h1>{t.title}</h1>
        <div className="langs">{(["fr", "ar", "en"] as Lang[]).map((l) => <form key={l} action={setLang.bind(null, l)}><button className={l === lang ? "on" : ""}>{l.toUpperCase()}</button></form>)}</div>
        <div className="user"><b>{s.user} ({s.role === "ADMIN" ? "Admin" : "Superviseur"})</b><form action={logout}><button className="link">{t.logout}</button></form></div></header>
        <main>{children}</main></div>
    </div>
  );
}
