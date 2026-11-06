import { redirect } from "next/navigation";
import { createSession, USERS } from "@/lib/auth";
import { log } from "@/lib/data";

async function login(formData: FormData) {
  "use server";
  const u = String(formData.get("user")), pw = String(formData.get("password")), acc = USERS[u];
  if (!acc || acc.password !== pw) redirect("/login?e=1");
  await createSession({ user: u, role: acc.role }); log(u, acc.role, "Connexion"); redirect("/dashboard");
}

export default async function Login({ searchParams }: { searchParams: Promise<{ e?: string }> }) {
  const { e } = await searchParams;
  return (
    <div className="lw">
      <div className="lbrand"><div className="logo">🛒</div><h1>Borne-Admin</h1><p>Gérez vos bornes, votre stock et vos ventes en toute simplicité.</p><small>Une expérience d&apos;achat moderne</small></div>
      <div className="lform"><form action={login}><h2>Connexion</h2><p className="mut">Accédez à votre espace de gestion</p>
        <input name="user" placeholder="Identifiant" autoComplete="username" required /><input name="password" type="password" placeholder="Mot de passe" autoComplete="current-password" required />
        {e && <div className="err">Identifiants invalides.</div>}<button>Se connecter →</button></form></div>
    </div>
  );
}
