"use server";
import { revalidatePath } from "next/cache";
import { randomUUID } from "node:crypto";
import { requirePerm } from "./auth";
import { db, log } from "./data";
const MAX = 300 * 1024, OK = ["image/jpeg", "image/png", "image/webp"];
const clean = (v: FormDataEntryValue | null) => String(v ?? "").trim().slice(0, 60);
async function img(f: FormData) { const file = f.get("image"); if (!(file instanceof File) || file.size === 0) return undefined; if (!OK.includes(file.type) || file.size > MAX) return null; return `data:${file.type};base64,${Buffer.from(await file.arrayBuffer()).toString("base64")}`; }
export async function saveCategory(f: FormData) {
  const s = await requirePerm("manage_cats"); // droit vérifié côté serveur
  const name = { fr: clean(f.get("fr")), ar: clean(f.get("ar")), en: clean(f.get("en")) }, image = await img(f), emoji = clean(f.get("emoji")) || "📦";
  if (!name.fr || !name.ar || !name.en || image === null) return;
  const ex = db.categories.find((c) => c.id === String(f.get("id") ?? ""));
  if (ex) { Object.assign(ex, { name, emoji }); if (image) ex.image = image; log(s.user, s.role, `Catégorie modifiée : ${name.fr}`); }
  else { db.categories.push({ id: "c-" + randomUUID().slice(0, 8), name, emoji, image }); log(s.user, s.role, `Catégorie ajoutée : ${name.fr}`); }
  revalidatePath("/categories"); revalidatePath("/dashboard");
}
export async function deleteCategory(f: FormData) {
  const s = await requirePerm("manage_cats"), id = String(f.get("id"));
  if (db.products.some((p) => p.categoryId === id)) return;
  db.categories = db.categories.filter((c) => c.id !== id); log(s.user, s.role, `Catégorie supprimée : ${id}`);
  revalidatePath("/categories"); revalidatePath("/dashboard");
}
