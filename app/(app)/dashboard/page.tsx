import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { consumeExitCode, log } from "@/lib/data";
import { dashboard } from "@/lib/dash";
import { dict, getLang } from "@/lib/i18n";
import Live from "./live";
export const dynamic = "force-dynamic";

async function validate(code: string) { "use server"; const s = await requireRole("ADMIN", "SUPERVISEUR"); const ok = /^\d{6}$/.test(code) && consumeExitCode(code); log(s.user, s.role, `Validation code de sortie : ${ok ? "valide" : "invalide"}`); return ok; }
async function sync() { "use server"; const s = await requireRole("ADMIN", "SUPERVISEUR"); log(s.user, s.role, "Synchronisation des stocks avec la caisse (POS)"); revalidatePath("/dashboard"); }

export default async function Dashboard() {
  const lang = await getLang(); const t = dict(lang);
  return <><h2>{t.dash}</h2><Live initial={dashboard()} t={t} lang={lang} validate={validate} sync={sync} /></>;
}
