import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Borne Admin — Plateforme de gestion centrale", robots: { index: false } };
export default function Root({ children }: { children: React.ReactNode }) {
  return <html lang="fr"><body>{children}</body></html>;
}
