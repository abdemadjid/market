import { redirect } from "next/navigation";
import Link from "next/link";
import { createSession, USERS } from "@/lib/auth";
import { log } from "@/lib/data";
import PasswordField from "./password-field";

async function login(f: FormData) {
  "use server";
  const u = String(f.get("user")).trim(), pw = String(f.get("password")), acc = USERS[u];
  if (!acc || acc.password !== pw) redirect("/login?e=1");
  await createSession({ user: u, role: acc.role }, f.get("remember") === "on");
  log(u, acc.role, "Connexion"); redirect("/dashboard");
}
const feats: [string, string][] = [["🛡️", "Supervision en temps réel"], ["📈", "Gestion du stock et des ventes"], ["🔔", "Alertes & Sécurité Anti-Fraude"], ["🏪", "Une expérience moderne et fluide"]];

export default async function Login({ searchParams }: { searchParams: Promise<{ e?: string; f?: string }> }) {
  const { e, f } = await searchParams;
  return (
    <div className="lg">
      <section className="lg-left">
        <header><span className="lg-cart">🛒</span><div><h1>Borne-<b>Admin</b></h1><p>Gestion Centrale des Bornes Automatiques</p></div><em dir="rtl">إدارة ذكية .. لتجربة تسوق أفضل</em></header>
        <div className="lg-mid"><div className="lg-kiosk">🖥️<small>Bienvenue<br />Scan &amp; Pay</small></div>
          <ul>{feats.map(([i, t]) => <li key={t}><span>{i}</span>{t}</li>)}</ul></div>
        <footer><div className="lg-org">🏛️ <span>Entreprise Portuaire<br />de Mostaganem</span></div><em>Innovation • Sécurité • Performance</em><small>Conçu par Kenza</small></footer>
      </section>
      <section className="lg-right"><form action={login} className="lg-card">
        <div className="lg-avatar">👤</div><h2>Connexion <b>Administrateur</b></h2><p className="mut">Accédez à votre espace de gestion</p>
        <div className="lg-field"><span>👤</span><input name="user" placeholder="Nom d'utilisateur" autoComplete="username" required /></div>
        <PasswordField />
        <div className="lg-opts"><label><input type="checkbox" name="remember" /> Se souvenir de moi</label><Link href="/login?f=1">Mot de passe oublié ?</Link></div>
        {f && <div className="lg-info">Contactez l&apos;administrateur système pour réinitialiser votre mot de passe.</div>}
        {e && <div className="err">Identifiants invalides.</div>}
        <button className="lg-btn">⇥ Se connecter</button>
        <div className="lg-or"><i />ou<i /></div>
        <div className="lg-demo"><b>ⓘ Comptes de démonstration :</b><br /><span>Admin :</span> admin / admin123<br /><span>Superviseur :</span> superviseur / super123</div>
      </form></section>
    </div>
  );
}
