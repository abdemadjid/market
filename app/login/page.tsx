import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { clearFails, createSession, isLocked, noteFail, USERS } from "@/lib/auth";
import { log } from "@/lib/data";
import { dict, getLang, type Lang } from "@/lib/i18n";
import LoginForm from "./login-form";

async function login(f: FormData) {
  "use server";
  const u = String(f.get("user")).trim().slice(0, 40), pw = String(f.get("password")), acc = USERS[u];
  if (isLocked(u)) redirect("/login?e=2");
  if (!acc || acc.password !== pw) { noteFail(u); redirect("/login?e=1"); }
  clearFails(u); await createSession({ user: u, role: acc.role }, f.get("remember") === "on");
  log(u, acc.role, "Connexion"); redirect("/dashboard");
}
async function setLang(l: Lang) { "use server"; (await cookies()).set("lang", l, { path: "/", sameSite: "strict", maxAge: 31536000 }); redirect("/login"); }
const fruits = ["🍎", "🥖", "🥛", "🍊", "🥕", "🍇", "🧃", "🛒"];

export default async function Login({ searchParams }: { searchParams: Promise<{ e?: string; f?: string }> }) {
  const { e, f } = await searchParams, lang = await getLang(), t = dict(lang);
  const feats: [string, string][] = [["🛡️", t.f1], ["📈", t.f2], ["🚨", t.f3], ["⚡", t.f4]];
  return (
    <div className="kz">
      <section className="kz-left">
        <i className="kz-orb o1" /><i className="kz-orb o2" /><i className="kz-orb o3" />
        <div className="kz-float" aria-hidden>{fruits.map((x, i) => <span key={i} style={{ insetInlineStart: `${6 + i * 12}%`, animationDelay: `${i * 1.6}s`, animationDuration: `${11 + (i % 3) * 3}s` }}>{x}</span>)}</div>
        <header><span className="kz-logo">🛒</span><div><h1>Kenzo <b>Market</b></h1><p>{t.tag}</p></div></header>
        <div className="kz-rot"><span>{t.rot1}</span><span>{t.rot2}</span><span dir="rtl">{t.rot3}</span></div>
        <div className="kz-stage"><img src="/kiosk.jpg" alt="" className="kz-kiosk" />
          <ul className="kz-feats">{feats.map(([i, x], k) => <li key={x} style={{ animationDelay: `${0.3 + k * 0.15}s` }}><span>{i}</span><div><b>{x}</b></div></li>)}</ul></div>
        <footer><div className="kz-tags"><span>🔒 {t.chip1}</span><span>⚡ {t.chip2}</span><span>📶 {t.chip3}</span></div>
          <div className="kz-uni"><span className="logo-pill"><img src="/logo-usaida.png" alt="Université de Saïda" /></span><div><b>{t.univ}</b><br />📍 {t.wilaya} · <span className="kz-proj">{t.project}</span></div></div><small>{t.slogan}</small></footer>
      </section>
      <section className="kz-right">
        <div className="kz-lang">{(["fr", "ar", "en"] as Lang[]).map((l) => <form key={l} action={setLang.bind(null, l)}><button className={l === lang ? "on" : ""}>{l.toUpperCase()}</button></form>)}</div>
        <LoginForm action={login} error={e === "1" ? t.l_bad : e === "2" ? t.l_lock : ""} forgot={!!f} t={t} />
        <small className="kz-by">Kenzo Market · by Kenza</small></section>
    </div>
  );
}
