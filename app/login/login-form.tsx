"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

// Comptes d'essai (à retirer en production). Un clic sur un onglet remplit les champs.
const ROLES = [{ key: "admin", label: "Administrateur", icon: "👑", user: "admin", pw: "admin123" }, { key: "sup", label: "Superviseur", icon: "🧭", user: "superviseur", pw: "super123" }];

export default function LoginForm({ action, error, forgot }: { action: (f: FormData) => void; error: boolean; forgot: boolean }) {
  const [r, setR] = useState(0), [u, setU] = useState(ROLES[0].user), [p, setP] = useState(ROLES[0].pw), [show, setShow] = useState(false), [hi, setHi] = useState("Bienvenue");
  useEffect(() => { const h = new Date().getHours(); setHi(h < 12 ? "Bonjour" : h < 18 ? "Bon après-midi" : "Bonsoir"); }, []);
  const pick = (i: number) => { setR(i); setU(ROLES[i].user); setP(ROLES[i].pw); };
  return (
    <div className="kz-wrap"><form action={action} className="kz-card">
      <div className="kz-avatar"><span>{ROLES[r].icon}</span></div>
      <small className="kz-hi">{hi} 👋</small>
      <h2>Connexion <b>{ROLES[r].label}</b></h2><p className="mut">Accédez à votre espace de gestion</p>
      <div className="kz-tabs">{ROLES.map((x, i) => <button type="button" key={x.key} className={i === r ? "on" : ""} onClick={() => pick(i)}>{x.icon} {x.label}</button>)}</div>
      <label className="kz-f"><span>👤</span><input name="user" value={u} onChange={(e) => setU(e.target.value)} placeholder="Nom d'utilisateur" autoComplete="username" required /></label>
      <label className="kz-f"><span>🔒</span><input name="password" type={show ? "text" : "password"} value={p} onChange={(e) => setP(e.target.value)} placeholder="Mot de passe" autoComplete="current-password" required />
        <button type="button" className="kz-eye" onClick={() => setShow(!show)} aria-label={show ? "Masquer" : "Afficher"}>{show ? "🙈" : "👁️"}</button></label>
      <div className="kz-opts"><label><input type="checkbox" name="remember" /> Se souvenir de moi</label><Link href="/login?f=1">Mot de passe oublié ?</Link></div>
      {forgot && <div className="kz-info">Contactez l&apos;administrateur système pour réinitialiser votre mot de passe.</div>}
      {error && <div className="err">Identifiants invalides.</div>}
      <button className="kz-btn"><span>Se connecter</span><i>→</i></button>
      <div className="kz-or"><i />comptes d&apos;essai<i /></div>
      <div className="kz-demo"><span>👑 <b>admin</b> / admin123</span><span>🧭 <b>superviseur</b> / super123</span></div>
    </form></div>
  );
}
