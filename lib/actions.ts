"use server";
import { revalidatePath } from "next/cache";
import { requireRole } from "./auth";
import { consumeExitCode, log } from "./data";
export async function validate(code: string) { const s = await requireRole("ADMIN", "SUPERVISEUR"); const ok = /^\d{6}$/.test(code) && consumeExitCode(code); log(s.user, s.role, `Validation code de sortie : ${ok ? "valide" : "invalide"}`); return ok; }
export async function sync() { const s = await requireRole("ADMIN", "SUPERVISEUR"); log(s.user, s.role, "Synchronisation des stocks avec la caisse (POS)"); revalidatePath("/rapports"); }
