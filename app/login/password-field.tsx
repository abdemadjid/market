"use client";
import { useState } from "react";
export default function PasswordField() {
  const [show, setShow] = useState(false);
  return <div className="lg-field"><span>🔒</span><input name="password" type={show ? "text" : "password"} placeholder="Mot de passe" autoComplete="current-password" required />
    <button type="button" className="lg-eye" onClick={() => setShow(!show)} aria-label={show ? "Masquer" : "Afficher"}>{show ? "🙈" : "👁️"}</button></div>;
}
