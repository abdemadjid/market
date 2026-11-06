import { dashboard } from "@/lib/dash";
import { dict, getLang } from "@/lib/i18n";
import { validate, sync } from "@/lib/actions";
import Live from "./live";
export const dynamic = "force-dynamic";
export default async function Rapports() {
  const lang = await getLang(), t = dict(lang);
  return <><h2>{t.rep} & {t.sec}</h2><Live initial={dashboard()} t={t} lang={lang} validate={validate} sync={sync} /></>;
}
