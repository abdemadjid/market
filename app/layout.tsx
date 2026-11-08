import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { getLang } from "@/lib/i18n";
const cairo = Cairo({ subsets: ["arabic", "latin"], display: "swap" });
export const metadata: Metadata = { title: "Kenzo Market — Gestion Centrale", robots: { index: false } };
export default async function Root({ children }: { children: React.ReactNode }) {
  const lang = await getLang();
  return <html lang={lang} dir={lang === "ar" ? "rtl" : "ltr"}><body className={cairo.className}>{children}</body></html>;
}
