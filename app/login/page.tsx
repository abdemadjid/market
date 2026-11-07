import { redirect } from "next/navigation";
import { createSession, USERS } from "@/lib/auth";
import { log } from "@/lib/data";
import LoginForm from "./login-form";

async function login(f: FormData) {
  "use server";
  const u = String(f.get("user")).trim(), pw = String(f.get("password")), acc = USERS[u];
  if (!acc || acc.password !== pw) redirect("/login?e=1");
  await createSession({ user: u, role: acc.role }, f.get("remember") === "on");
  log(u, acc.role, "Connexion"); redirect("/dashboard");
}
const feats: [string, string, string][] = [["🛡️", "Supervision en temps réel", "Bornes, ventes, alertes"], ["📈", "Stock & ventes", "Synchronisés avec la caisse"], ["🚨", "Anti-fraude intelligent", "Poids, codes, caméras"], ["⚡", "Expérience fluide", "Scan & Pay en quelques secondes"]];
const fruits = ["🍎", "🥖", "🥛", "🍊", "🥕", "🍇", "🧃", "🛒"];

export default async function Login({ searchParams }: { searchParams: Promise<{ e?: string; f?: string }> }) {
  const { e, f } = await searchParams;
  return (
    <div className="kz">
      <section className="kz-left">
        <i className="kz-orb o1" /><i className="kz-orb o2" /><i className="kz-orb o3" />
        <div className="kz-float" aria-hidden>{fruits.map((x, i) => <span key={i} style={{ left: `${6 + i * 12}%`, animationDelay: `${i * 1.6}s`, animationDuration: `${11 + (i % 3) * 3}s` }}>{x}</span>)}</div>
        <header><span className="kz-logo">🛒</span><div><h1>Kenzo <b>Market</b></h1><p>Gestion Centrale des Bornes Automatiques</p></div></header>
        <div className="kz-rot" aria-live="off"><span>Gérez vos bornes en toute simplicité</span><span>Scannez. Payez. Sortez.</span><span dir="rtl">إدارة ذكية .. لتجربة تسوق أفضل</span></div>
        <div className="kz-stage"><img src="/kiosk.jpg" alt="Borne Scan & Pay" className="kz-kiosk" />
          <ul className="kz-feats">{feats.map(([i, t, s], k) => <li key={t} style={{ animationDelay: `${0.3 + k * 0.15}s` }}><span>{i}</span><div><b>{t}</b><small>{s}</small></div></li>)}</ul></div>
        <footer><div className="kz-tags"><span>🔒 Sessions sécurisées</span><span>⚡ Temps réel</span><span>📶 Mode hors-ligne</span></div><small>Entreprise Portuaire de Mostaganem · Innovation • Sécurité • Performance</small></footer>
      </section>
      <section className="kz-right"><LoginForm action={login} error={!!e} forgot={!!f} /><small className="kz-by">Kenzo Market · by Kenza</small></section>
    </div>
  );
}
