import { stats } from "@/lib/data";
export const dynamic = "force-dynamic";
const mmss = (s: number) => `${Math.floor(s / 60)} min ${s % 60} s`;
export default function Rapports() {
  const s = stats();
  const rows: [string, string][] = [["Temps d'attente moyen", mmss(s.avgWaitSec)], ["Taux d'usage des bornes", `${s.usageRate} %`],
    ["Durée moyenne d'une transaction", mmss(s.avgDurationSec)], ["Demandes d'aide", String(s.helpRequests)], ["Précision du stock", `${s.stockAccuracy} %`], ["Transactions en attente de synchro", String(s.offlinePending)]];
  return <><h2>Rapports (24 h)</h2><div className="card"><table><tbody>{rows.map(([k, v]) => <tr key={k}><td>{k}</td><td><b>{v}</b></td></tr>)}</tbody></table></div></>;
}
