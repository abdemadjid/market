import Link from "next/link";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/data";
import { dict, getLang, type Dict } from "@/lib/i18n";
import { PERMS, can } from "@/lib/perms";
import CountUp from "./count-up";
import Refresh from "./refresh";
export const dynamic = "force-dynamic";
const d = (i: number) => ({ "--i": i }) as React.CSSProperties;
const dot: Record<string, string> = { RUPTURE: "#c62828", ECART_POIDS: "#e68a00", CONTROLE: "#1976d2", AIDE: "#1976d2" };
const kindKey: Record<string, keyof Dict> = { RUPTURE: "stLow", ECART_POIDS: "alert", CONTROLE: "rand", AIDE: "help" };

export default async function Dashboard() {
  const s = (await getSession())!, lang = await getLang(), t = dict(lang);
  const ago = (at: number) => { const m = Math.max(1, Math.round((Date.now() - at) / 60000)); return m < 60 ? t.agoM.replace("{n}", String(m)) : t.agoH.replace("{n}", String(Math.round(m / 60))); };
  const active = db.kiosks.filter((k) => k.status !== "HORS_LIGNE").length, open = db.alerts.filter((a) => a.open);
  const sales = db.txs.filter((x) => x.at > Date.now() - 86400000).reduce((a, x) => a + x.totalDZD, 0), cat = (id: string) => db.categories.find((c) => c.id === id);
  const visual = (c?: { image?: string; emoji: string }) => (c?.image ? <div className="catimg" style={{ backgroundImage: `url(${c.image})` }} /> : <div className="catimg">{c?.emoji ?? "📦"}</div>);
  return <><Refresh />
    <section className="hero anim" style={d(0)}><div className="cart">🛒</div><div className="hero-t"><h2>{t.w1}<br /><b>Kenzo Market</b></h2><p>{t.w2}</p><Link href="/catalogue" className="btn">{t.goCat} →</Link></div>
      <div className="hero-art"><span className="logo-pill"><img src="/logo-usaida.png" alt="Université de Saïda" /></span><small>📍 {t.wilaya} · {t.project}</small></div></section>
    <div className="kpis">{[["🖥️", t.kp1, <><CountUp to={active} /> / {db.kiosks.length}</>, ""], ["🛍️", t.kp2, <CountUp key="s" to={sales} suffix={` ${t.cur}`} />, ""], ["📦", t.kp3, <CountUp key="p" to={db.products.reduce((a, p) => a + p.stock, 0)} />, ""], ["🔔", t.kp4, <CountUp key="a" to={open.length} />, "bad"]].map(([i, l, v, c], k) =>
      <div className="kpi anim" style={d(k + 1)} key={String(l)}><span className="ico">{i}</span><div><small>{l}</small><b className={String(c)}>{v}</b></div></div>)}</div>
    <div className="row-main">
      <section className="panel anim" style={d(5)}><div className="ph"><h3>📶 {t.kiosks}</h3><Link href="/rapports">{t.all} →</Link></div><div className="kgrid">
        {db.kiosks.map((k) => { const off = k.status === "HORS_LIGNE"; return <div className="kcard" key={k.id}><span className="kscr">🖥️</span><div><b><i className={off ? "dr" : "dg"} />{k.name}</b><div className={off ? "bad" : "ok"}>{off ? t.offline : t.online}</div></div><div className="kbar"><i style={{ width: off ? "55%" : "100%", background: off ? "#c62828" : "#2e9e4f" }} /></div></div>; })}</div></section>
      <section className="panel anim" style={d(6)}><div className="ph"><h3>🔥 {t.pop}</h3><Link href="/catalogue">{t.all} →</Link></div><div className="pgrid">
        {db.products.slice(0, 3).map((p) => <div className="pcard" key={p.barcode}>{visual(cat(p.categoryId))}<b>{p.name[lang]}</b><div className="price">{p.priceDZD} {t.cur}</div><Link href="/stock" className="btn dark">＋ {t.add}</Link></div>)}</div></section>
      <section className="panel anim" style={d(7)}><div className="ph"><h3>🔔 {t.recent}</h3><Link href="/rapports">{t.all} →</Link></div>
        {open.slice(0, 3).map((a) => <div className="al" key={a.id}><div><b>{t[kindKey[a.kind]]}</b> {a.kioskId !== "-" && `· ${a.kioskId}`}<br /><small>{ago(a.at)}</small></div><i style={{ background: dot[a.kind] }} /></div>)}{open.length === 0 && <p>{t.empty}</p>}
        <div className="secure">🛡️ <div><b>{t.sec1}</b><br /><small>{t.sec2}</small></div></div></section>
    </div>
    <section className="panel anim" style={{ ...d(8), marginTop: 14 }}><div className="ph"><h3>🗂️ {t.n_cats}</h3><Link href="/categories">{t.manage} →</Link></div>
      <div className="catgrid">{db.categories.map((c) => <Link href="/categories" className="catcard" key={c.id}>{visual(c)}<div className="catbody"><b>{c.name[lang]}</b><small className="mut">{db.products.filter((p) => p.categoryId === c.id).length} {t.c_n}</small></div></Link>)}</div></section>
    <section className="panel anim" style={{ ...d(9), marginTop: 14 }}><div className="ph"><h3>🔑 {t.yourRole} : {s.role === "ADMIN" ? t.r_admin : t.r_sup}</h3><Link href="/roles">{t.n_roles} →</Link></div>
      <ul className="perms">{PERMS.map((p) => { const ok = can(s.role, p); return <li key={p} className={ok ? "ok" : "no"}><span>{ok ? "✔" : "✘"}</span>{t[`p_${p}` as keyof Dict]} <small>{ok ? t.yes : t.no}</small></li>; })}</ul></section>
    <section className="strip anim" style={d(10)}><div>🛡️ <b>{t.s1}</b><small>{t.s1b}</small></div><div>🔗 <b>{t.s2}</b><small>{t.s2b}</small></div><div>🎧 <b>{t.s3}</b><small>{t.s3b}</small></div><Link href="/rapports" className="btn dark">{t.toRep} →</Link></section></>;
}
