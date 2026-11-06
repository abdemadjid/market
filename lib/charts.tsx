// Graphiques SVG sans dépendance (rapides, imprimables, thème clair/sombre).
const BLUE = "#b5651d", LIGHT = "#e8b273", BROWN = "#4a2a14";
export function Donut({ parts }: { parts: { v: number; c: string }[] }) {
  const tot = parts.reduce((s, p) => s + p.v, 0) || 1; let a = -Math.PI / 2;
  return <svg viewBox="0 0 100 100" width="110" height="110">{parts.map((p, i) => { const b = a + (p.v / tot) * 2 * Math.PI - 0.0001, big = b - a > Math.PI ? 1 : 0, pt = (r: number, x: number) => `${50 + r * Math.cos(x)} ${50 + r * Math.sin(x)}`;
    const d = `M${pt(45, a)} A45 45 0 ${big} 1 ${pt(45, b)} L${pt(26, b)} A26 26 0 ${big} 0 ${pt(26, a)}Z`; a = b; return <path key={i} d={d} fill={p.c} />; })}</svg>;
}
export function Bars({ data, h = 130 }: { data: { l: string; v: number; c?: string }[]; h?: number }) {
  const max = Math.max(1, ...data.map((d) => d.v)), w = 280, bw = w / data.length;
  return <svg viewBox={`0 0 ${w} ${h + 18}`} width="100%">{data.map((d, i) => { const bh = (d.v / max) * h; return <g key={i}><rect x={i * bw + bw * 0.2} y={h - bh} width={bw * 0.6} height={bh} rx="2" fill={d.c ?? BLUE} />
    <text x={i * bw + bw / 2} y={h + 13} fontSize="10" textAnchor="middle" fill="currentColor" opacity=".7">{d.l}</text><text x={i * bw + bw / 2} y={h - bh - 3} fontSize="9" textAnchor="middle" fill="currentColor" opacity=".8">{d.v}</text></g>; })}</svg>;
}
export function Area({ data, labels, h = 120 }: { data: number[]; labels: string[]; h?: number }) {
  const w = 280, max = Math.max(1, ...data), x = (i: number) => (i / Math.max(1, data.length - 1)) * (w - 10) + 5, y = (v: number) => h - (v / max) * (h - 8);
  const line = data.map((v, i) => `${i ? "L" : "M"}${x(i)} ${y(v)}`).join("");
  return <svg viewBox={`0 0 ${w} ${h + 18}`} width="100%"><path d={`${line}L${x(data.length - 1)} ${h}L${x(0)} ${h}Z`} fill={LIGHT} opacity=".35" /><path d={line} fill="none" stroke={BROWN} strokeWidth="2" />
    {labels.map((l, i) => <text key={i} x={x(i)} y={h + 13} fontSize="10" textAnchor="middle" fill="currentColor" opacity=".7">{l}</text>)}</svg>;
}
export function Gauge({ ok, ko }: { ok: number; ko: number }) {
  const r = ok / Math.max(1, ok + ko), ang = Math.PI * (1 - r), nx = 60 + 38 * Math.cos(ang), ny = 62 - 38 * Math.sin(ang);
  return <svg viewBox="0 0 120 70" width="170"><path d="M10 62A50 50 0 0 1 110 62" fill="none" stroke={BROWN} strokeWidth="12" /><path d={`M10 62A50 50 0 0 1 ${60 + 50 * Math.cos(ang)} ${62 - 50 * Math.sin(ang)}`} fill="none" stroke={BLUE} strokeWidth="12" />
    <line x1="60" y1="62" x2={nx} y2={ny} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" /><circle cx="60" cy="62" r="4" fill="currentColor" /></svg>;
}
// Carte stylisée (pas de tuiles distantes : la CSP et le hors-ligne l'interdisent). Remplaçable par MapLibre.
export function MiniMap({ kiosks }: { kiosks: { id: string; status: string }[] }) {
  const pos = [[60, 45], [105, 70], [80, 95], [135, 40], [150, 90]], col: Record<string, string> = { EN_LIGNE: "#0f766e", HORS_LIGNE: "#b91c1c", ALERTE: "#b45309" };
  return <svg viewBox="0 0 190 130" width="100%" style={{ borderRadius: 8, background: "#e6ecd9" }}><path d="M0 100Q50 70 90 85T190 60V130H0Z" fill="#cfe3f2" /><path d="M20 20L90 50L170 30M60 120L100 60" stroke="#fff" strokeWidth="3" fill="none" />
    <text x="12" y="18" fontSize="10" fill="#555">Oran</text>{kiosks.map((k, i) => <circle key={k.id} cx={pos[i % 5][0]} cy={pos[i % 5][1]} r="6" fill={col[k.status] ?? "#555"} stroke="#fff" strokeWidth="2" />)}</svg>;
}
export const C = { BLUE, LIGHT, BROWN };
