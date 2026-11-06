import Link from "next/link";
import { db } from "@/lib/data";
import Refresh from "./refresh";
export const dynamic = "force-dynamic";
const ago = (t: number) => { const m = Math.max(1, Math.round((Date.now() - t) / 60000)); return m < 60 ? `Il y a ${m} min` : `Il y a ${Math.round(m / 60)} h`; };
const icon = ["🥛", "🍞", "🛢️", "🌾", "💧"];
const dot: Record<string, string> = { RUPTURE: "#c62828", ECART_POIDS: "#e68a00", CONTROLE: "#1976d2", AIDE: "#1976d2" };
const title: Record<string, string> = { RUPTURE: "Stock bas", ECART_POIDS: "Écart de poids", CONTROLE: "Contrôle aléatoire", AIDE: "Demande d'aide" };

export default function Dashboard() {
  const active = db.kiosks.filter((k) => k.status !== "HORS_LIGNE").length, open = db.alerts.filter((a) => a.open);
  const kpis: [string, string, string, string][] = [["🖥️", "Bornes actives", `${active} / ${db.kiosks.length}`, ""], ["🛍️", "Ventes aujourd'hui", `${new Intl.NumberFormat("fr-DZ").format(db.txs.filter((t) => t.at > Date.now() - 86400000).reduce((s, t) => s + t.totalDZD, 0))} DA`, ""],
    ["📦", "Produits en stock", String(db.products.reduce((s, p) => s + p.stock, 0)), ""], ["🔔", "Alertes", String(open.length), "bad"]];
  return <><Refresh />
    <section className="hero"><div className="cart">🛒</div><div className="hero-t"><h2>Bienvenue sur<br /><b>Borne-Admin</b></h2><p>Gérez vos bornes, votre stock et vos ventes en toute simplicité.</p><Link href="/catalogue" className="btn">Accéder au catalogue →</Link></div>
      <div className="hero-art">🖥️<small>Une expérience d&apos;achat moderne</small></div></section>
    <div className="kpis">{kpis.map(([i, l, v, c]) => <div className="kpi" key={l}><span className="ico">{i}</span><div><small>{l}</small><b className={c}>{v}</b></div></div>)}</div>
    <div className="row-main">
      <section className="panel"><div className="ph"><h3>📶 État des Bornes</h3><Link href="/rapports">Voir tout →</Link></div><div className="kgrid">
        {db.kiosks.map((k) => { const off = k.status === "HORS_LIGNE"; return <div className="kcard" key={k.id}><span className="kscr">🖥️</span><div><b><i className={off ? "dr" : "dg"} />{k.name}</b><div className={off ? "bad" : "ok"}>{off ? "Hors ligne" : "En ligne"}</div></div><div className="kbar"><i style={{ width: off ? "55%" : "100%", background: off ? "#c62828" : "#2e9e4f" }} /></div></div>; })}</div></section>
      <section className="panel"><div className="ph"><h3>🔥 Produits Populaires</h3><Link href="/catalogue">Voir tout →</Link></div><div className="pgrid">
        {db.products.slice(0, 3).map((p, i) => <div className="pcard" key={p.barcode}><div className="pic">{icon[i]}</div><b>{p.name.fr}</b><div className="price">{p.priceDZD} DA</div><Link href="/stock" className="btn dark">＋ Ajouter</Link></div>)}</div></section>
      <section className="panel"><div className="ph"><h3>🔔 Alertes Récentes</h3><Link href="/rapports">Voir tout →</Link></div>
        {open.slice(0, 3).map((a) => <div className="al" key={a.id}><div><b>{title[a.kind]}</b> : {a.message}<br /><small>{ago(a.at)}</small></div><i style={{ background: dot[a.kind] }} /></div>)}{open.length === 0 && <p>Aucune alerte</p>}
        <div className="secure">🛡️ <div><b>Système sécurisé</b><br /><small>et surveillé en temps réel</small></div></div></section>
    </div>
    <section className="strip"><div>🛡️ <b>Anti-Fraude Intelligent</b><small>Contrôle automatique</small></div><div>🔗 <b>Synchronisation Réseau</b><small>Transactions fiables</small></div><div>🎧 <b>Assistance 24/7</b><small>Toujours à votre écoute</small></div><Link href="/rapports" className="btn dark">Voir les Rapports →</Link></section></>;
}
