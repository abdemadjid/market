"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { Dict } from "@/lib/i18n";
// Comptes d'essai (à retirer en production).
const ROLES = [{ icon: "👑", user: "admin", pw: "admin123", k: "r_admin" as const }, { icon: "🧭", user: "superviseur", pw: "super123", k: "r_sup" as const }];

export default function LoginForm({ action, error, forgot, t }: { action: (f: FormData) => void; error: string; forgot: boolean; t: Dict }) {
  const [r, setR] = useState(0), [u, setU] = useState(ROLES[0].user), [p, setP] = useState(ROLES[0].pw), [show, setShow] = useState(false), [hi, setHi] = useState(t.hi1);
  useEffect(() => { const h = new Date().getHours(); setHi(h < 12 ? t.hi1 : h < 18 ? t.hi2 : t.hi3); }, [t]);
  const pick = (i: number) => { setR(i); setU(ROLES[i].user); setP(ROLES[i].pw); };
  return (
    <div className="kz-wrap"><form action={action} className="kz-card">
      <div className="kz-avatar"><span>{ROLES[r].icon}</span></div><small className="kz-hi">{hi} 👋</small>
      <h2>{t.l_title} <b>{t[ROLES[r].k]}</b></h2><p className="mut">{t.l_sub}</p>
      <div className="kz-tabs" role="tablist">{ROLES.map((x, i) => <button type="button" role="tab" aria-selected={i === r} key={x.user} className={i === r ? "on" : ""} onClick={() => pick(i)}>{x.icon} {t[x.k]}</button>)}</div>
      <label className="kz-f"><span aria-hidden>👤</span><input name="user" value={u} onChange={(e) => setU(e.target.value)} placeholder={t.l_user} autoComplete="username" required /></label>
      <label className="kz-f"><span aria-hidden>🔒</span><input name="password" type={show ? "text" : "password"} value={p} onChange={(e) => setP(e.target.value)} placeholder={t.l_pass} autoComplete="current-password" required />
        <button type="button" className="kz-eye" onClick={() => setShow(!show)} aria-label="👁">{show ? "🙈" : "👁️"}</button></label>
      <div className="kz-opts"><label><input type="checkbox" name="remember" /> {t.l_rem}</label><Link href="/login?f=1">{t.l_forgot}</Link></div>
      {forgot && <div className="kz-info">{t.l_fmsg}</div>}{error && <div className="err" role="alert">{error}</div>}
      <button className="kz-btn"><span>{t.l_btn}</span><i>→</i></button>
      <div className="kz-or"><i />{t.l_demo}<i /></div>
      <div className="kz-demo"><span>👑 <b>admin</b> / admin123</span><span>🧭 <b>superviseur</b> / super123</span></div>
    </form></div>
  );
}
