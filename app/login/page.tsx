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

export default async function Login({ searchParams }: { searchParams: Promise<{ e?: string; f?: string }> }) {
  const { e, f } = await searchParams;
  return (
    <div className="lg">
      <div className="lg-img" role="img" aria-label="Borne-Admin — Gestion Centrale des Bornes Automatiques" />
      <section className="lg-right"><LoginForm action={login} error={!!e} forgot={!!f} /><small className="lg-by">by Kenza</small></section>
    </div>
  );
}
