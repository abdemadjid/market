import { redirect } from "next/navigation";
import { createSession, USERS } from "@/lib/auth";
import { log } from "@/lib/data";

async function login(formData: FormData) {
  "use server";
  const u = String(formData.get("user")), pw = String(formData.get("password"));
  const acc = USERS[u];
  if (!acc || acc.password !== pw) redirect("/login?e=1");
  await createSession({ user: u, role: acc.role });
  log(u, acc.role, "Connexion");
  redirect("/dashboard");
}

export default async function Login({ searchParams }: { searchParams: Promise<{ e?: string }> }) {
  const { e } = await searchParams;
  return (
    <div className="login"><form action={login} className="card">
      <h2>Connexion</h2>
      <input name="user" placeholder="Identifiant" autoComplete="username" required />
      <input name="password" type="password" placeholder="Mot de passe" autoComplete="current-password" required />
      {e && <div className="err">Identifiants invalides.</div>}
      <button>Se connecter</button>
      <small style={{ color: "var(--mut)" }}>Démo : admin / admin123 — superviseur / super123</small>
    </form></div>
  );
}
