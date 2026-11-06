"use client";
import { useEffect, useState } from "react";
import type { Dash } from "@/lib/dash";
import type { Dict } from "@/lib/i18n";
import { Area, Bars, C, Donut, Gauge, MiniMap } from "@/lib/charts";
const dzd = (n: number) => new Intl.NumberFormat("fr-DZ").format(n);

export default function Live({ initial, t, lang, validate, sync }: { initial: Dash; t: Dict; lang: "fr" | "ar" | "en"; validate: (c: string) => Promise<boolean>; sync: () => Promise<void> }) {
  const [d, setD] = useState(initial); const [res, setRes] = useState<boolean | null>(null); const [code, setCode] = useState("");
  useEffect(() => { const id = setInterval(async () => { try { const r = await fetch("/api/dashboard", { cache: "no-store" }); if (r.ok) setD(await r.json()); } catch {} }, 5000); return () => clearInterval(id); }, []);
  const k = d.counts, pn = (x: { fr: string; ar: string; en: string }) => x[lang];
  const st: Record<string, string> = { ok: t.ok, used: t.used, ko: t.ko };
  return <div className="dash">
    <div className="live">● {t.server}: <b className="ok">{t.connected}</b></div>
    <div className="row4">
      <section className="card"><h3>{t.kiosks}</h3><div className="split"><div><Donut parts={[{ v: k.online, c: C.BLUE }, { v: k.alert, c: C.LIGHT }, { v: k.offline, c: C.BROWN }]} />
        <small className="leg"><i style={{ background: C.BLUE }} />{t.online} ({k.online})<br /><i style={{ background: C.BROWN }} />{t.offline} ({k.offline})<br /><i style={{ background: C.LIGHT }} />{t.alert} ({k.alert})</small></div><MiniMap kiosks={d.kiosks} /></div></section>
      <section className="card"><h3>{t.sales}</h3><Area data={d.byHour} labels={["0h", "4h", "8h", "12h", "16h", "20h"]} /><b>{dzd(d.salesDZD)} DZD</b></section>
      <section className="card"><h3>{t.tx}</h3><Bars data={[{ l: t.card, v: d.pay.card }, { l: t.cash, v: d.pay.cash, c: C.LIGHT }, { l: t.code, v: d.pay.code, c: C.BROWN }]} /></section>
      <section className="card"><h3>{t.alerts}</h3><ul className="alerts">{d.alerts.length === 0 && <li>{t.empty}</li>}{d.alerts.map((a) => <li key={a.id}><b>{a.kioskId !== "-" ? `${a.kioskId} · ` : ""}{a.kind.replace("_", " ")}</b><br /><small>{a.message}</small></li>)}</ul></section>
    </div>
    <div className="row3">
      <div className="stack">
        <section className="card"><h3>{t.low}</h3><table><thead><tr><th>Code</th><th>FR/AR</th><th>g</th><th>Stock</th><th>Seuil</th></tr></thead><tbody>
          {d.low.map((p) => <tr key={p.barcode}><td>{p.barcode}</td><td>{pn(p.name)}</td><td>{p.weightG}</td><td className={p.stock <= p.minStock ? "bad" : ""}>{p.stock}</td><td>{p.minStock}</td></tr>)}</tbody></table>
          <form action={sync} style={{ marginTop: 10, textAlign: "end" }}><button>{t.sync}</button></form></section>
        <section className="card" id="securite"><h3>{t.rand}</h3><div className="split"><div style={{ flex: 1 }}><small>{t.rate} <b className="ok">({d.controlRate}%)</b></small><div className="bar"><i style={{ width: `${d.controlRate * 4}%` }} /></div>
          <small>✔ {d.weightOk} · ✘ {d.weightKo}</small></div><div style={{ textAlign: "center" }}><Gauge ok={d.weightOk} ko={d.weightKo} /><br /><small>{t.exp}</small></div></div></section>
      </div>
      <section className="card"><h3>{t.last}</h3><table><thead><tr><th>Date</th><th>Borne</th><th>{t.code}</th><th>DZD</th><th>Δ %</th><th></th></tr></thead><tbody>
        {d.last.map((x) => <tr key={x.id}><td>{new Date(x.at).toLocaleString("fr-DZ", { dateStyle: "short", timeStyle: "short" })}</td><td>{x.kioskId}</td><td>••••••</td><td>{dzd(x.totalDZD)}</td><td>{x.dev.toFixed(1)}</td><td><span className={`pill ${x.status === "ko" ? "HORS_LIGNE" : "EN_LIGNE"}`}>{st[x.status]}</span></td></tr>)}</tbody></table>
        <form className="vrow" onSubmit={async (e) => { e.preventDefault(); setRes(await validate(code)); setCode(""); }}><span>{t.validate}</span><input value={code} onChange={(e) => setCode(e.target.value)} inputMode="numeric" maxLength={6} pattern="\d{6}" required /><button>OK</button></form>
        {res !== null && <div className={res ? "ok" : "bad"}>{res ? t.valid : t.invalid}</div>}
        <div className="cams"><div className="cam">📹 {t.cam} 1</div><div className="cam off">{t.nocam}</div></div></section>
      <section className="card"><h3>{t.perf}</h3><div className="perf">
        <div><small>{t.wait}</small><Bars h={70} data={d.perKiosk.map((p) => ({ l: p.id, v: p.wait }))} /></div><div><small>{t.usage}</small><Area h={70} data={d.perKiosk.map((p) => p.usage)} labels={d.perKiosk.map((p) => p.id)} /></div>
        <div><small>{t.dur}</small><Bars h={70} data={d.perKiosk.map((p, i) => ({ l: p.id, v: p.dur, c: i % 2 ? C.LIGHT : C.BLUE }))} /></div><div><small>{t.help}</small><Bars h={70} data={d.help.map((v, i) => ({ l: `${i * 5}h`, v, c: C.BROWN }))} /></div></div></section>
    </div></div>;
}
