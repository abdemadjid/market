"use client";
import { useState } from "react";
import Link from "next/link";

// Comptes d'essai : un clic sur une ligne remplit les champs. À retirer avant la mise en production.
const DEMO = [{ label: "Admin :", user: "admin", pw: "admin123" }, { label: "Superviseur :", user: "superviseur", pw: "super123" }];

export default function LoginForm({ action, error, forgot }: { action: (f: FormData) => void; error: boolean; forgot: boolean }) {
  const [u, setU] = useState("admin"), [p, setP] = useState("admin123"), [show, setShow] = useState(false);
  return (
    <form action={action} className="lg-card">
      <div className="lg-avatar">👤</div>
      <h2>Connexion <b>Administrateur</b></h2><p>Accédez à votre espace de gestion</p>
      <div className="lg-div"><i /><span>🛒</span><i /></div>
      <div className="lg-field"><span>👤</span><input name="user" value={u} onChange={(e) => setU(e.target.value)} placeholder="Nom d'utilisateur" autoComplete="username" required /></div>
      <div className="lg-field"><span>🔒</span><input name="password" type={show ? "text" : "password"} value={p} onChange={(e) => setP(e.target.value)} placeholder="Mot de passe" autoComplete="current-password" required />
        <button type="button" className="lg-eye" onClick={() => setShow(!show)} aria-label={show ? "Masquer" : "Afficher"}>{show ? "🙈" : "👁️"}</button></div>
      <div className="lg-opts"><label><input type="checkbox" name="remember" /> Se souvenir de moi</label><Link href="/login?f=1">Mot de passe oublié ?</Link></div>
      {forgot && <div className="lg-info">Contactez l&apos;administrateur système pour réinitialiser votre mot de passe.</div>}
      {error && <div className="err">Identifiants invalides.</div>}
      <button className="lg-btn">⇥ Se connecter</button>
      <div className="lg-or"><i />ou<i /></div>
      <div className="lg-demo"><b>ⓘ Comptes de démonstration :</b>
        {DEMO.map((d) => <button type="button" key={d.user} className="lg-acc" onClick={() => { setU(d.user); setP(d.pw); }}><span>{d.label}</span> {d.user} / {d.pw}</button>)}</div>
    </form>
  );
}
