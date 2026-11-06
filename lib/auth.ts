import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";
import type { Role } from "./data";

const secret = () => process.env.SESSION_SECRET ?? "dev-only-secret-dev-only-secret-0000";
const sign = (v: string) => createHmac("sha256", secret()).update(v).digest("base64url");
export type Session = { user: string; role: Role };

// Comptes de démo. En production : base de données + mots de passe hachés (argon2/bcrypt) + 2FA.
export const USERS: Record<string, { password: string; role: Role }> = {
  admin: { password: "admin123", role: "ADMIN" },
  superviseur: { password: "super123", role: "SUPERVISEUR" },
};

export async function createSession(s: Session, remember = false) {
  const body = Buffer.from(JSON.stringify({ ...s, exp: Date.now() + (remember ? 30 * 24 : 8) * 3600_000 })).toString("base64url");
  (await cookies()).set("session", `${body}.${sign(body)}`, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: (remember ? 30 * 24 : 8) * 3600 });
}
export async function getSession(): Promise<Session | null> {
  const raw = (await cookies()).get("session")?.value; if (!raw) return null;
  const [body, sig] = raw.split("."); if (!body || !sig) return null;
  const a = Buffer.from(sig), b = Buffer.from(sign(body));
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  const d = JSON.parse(Buffer.from(body, "base64url").toString());
  return d.exp > Date.now() ? { user: d.user, role: d.role } : null;
}
export async function requireRole(...roles: Role[]) {
  const s = await getSession();
  if (!s || (roles.length && !roles.includes(s.role))) throw new Error("Accès refusé");
  return s;
}
export function kioskAuthorized(req: Request) {
  return req.headers.get("x-api-key") === (process.env.KIOSK_API_KEY ?? "dev-kiosk-key");
}
