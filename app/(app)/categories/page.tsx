import { getSession } from "@/lib/auth";
import { can } from "@/lib/perms";
import { db } from "@/lib/data";
import { dict, getLang } from "@/lib/i18n";
import { deleteCategory, saveCategory } from "@/lib/cat-actions";
export const dynamic = "force-dynamic";

function Fields({ t, c }: { t: ReturnType<typeof dict>; c?: (typeof db.categories)[number] }) {
  return <>{c && <input type="hidden" name="id" value={c.id} />}
    <input name="fr" placeholder={t.nFr} defaultValue={c?.name.fr} required maxLength={60} /><input name="ar" dir="rtl" placeholder={t.nAr} defaultValue={c?.name.ar} required maxLength={60} /><input name="en" placeholder={t.nEn} defaultValue={c?.name.en} required maxLength={60} />
    <input name="emoji" placeholder={t.c_emoji} defaultValue={c?.emoji} maxLength={4} /><label className="mut">{t.c_img}<input type="file" name="image" accept="image/jpeg,image/png,image/webp" /></label><button>{t.c_save}</button></>;
}
export default async function Categories() {
  const s = (await getSession())!, lang = await getLang(), t = dict(lang), edit = can(s.role, "manage_cats");
  return <><h2>🗂️ {t.c_title}</h2><p className="mut">{t.c_sub}</p>{!edit && <div className="kz-info">🔒 {t.c_ro}</div>}
    {edit && <details className="card edit" style={{ margin: "12px 0" }}><summary>＋ {t.c_add}</summary><form action={saveCategory} className="cform"><Fields t={t} /></form></details>}
    <div className="catgrid">{db.categories.map((c, i) => { const n = db.products.filter((p) => p.categoryId === c.id).length;
      return <article className="catcard anim" style={{ "--i": i } as React.CSSProperties} key={c.id}>
        {c.image ? <div className="catimg" style={{ backgroundImage: `url(${c.image})` }} /> : <div className="catimg">{c.emoji}</div>}
        <div className="catbody"><b>{c.name[lang]}</b><small className="mut">{c.name.fr} · {c.name.en} · <span dir="rtl">{c.name.ar}</span></small><small>{n} {t.c_n}</small>
          {edit && <details className="edit"><summary>✏️ {t.c_edit}</summary><form action={saveCategory} className="cform"><Fields t={t} c={c} /></form>
            <form action={deleteCategory}><input type="hidden" name="id" value={c.id} /><button className="danger" disabled={n > 0} title={n > 0 ? t.c_inuse : ""}>🗑️ {t.c_del}</button></form></details>}</div></article>; })}</div></>;
}
