import { cookies } from "next/headers";
export type Lang = "fr" | "ar" | "en";
const D = {
  fr: { title: "Plateforme de Gestion Centrale - Bornes", dash: "Tableau de bord", cat: "Catalogue", stock: "Stocks", sec: "Sécurité", rep: "Rapports", journal: "Journal des Actions",
    kiosks: "État des Bornes", sales: "Ventes du Jour", tx: "Transactions", alerts: "Alertes en Temps Réel", low: "Alertes de Rupture & Stock", last: "Dernières Transactions & Sécurité",
    perf: "Rapports & Performance", rand: "Contrôle Aléatoire & Anti-fraude", sync: "Synchroniser Stocks", validate: "Valider Code de Sortie", online: "En ligne", offline: "Hors-ligne", alert: "Alerte",
    card: "Par Carte", cash: "Espèces", code: "Code de sortie", wait: "Temps d'attente moyen (min)", usage: "Taux d'usage des bornes (%)", dur: "Durée transaction moyenne (min)", help: "Demandes d'aide/24h",
    rate: "Taux de contrôle actuel", ok: "Valide", ko: "Rejeté", used: "Utilisé", server: "Serveur", connected: "Connecté", logout: "Déconnexion", exp: "Poids attendu vs réel", cam: "Caméra Borne", nocam: "Caméra non connectée", empty: "Aucune alerte", valid: "Code valide ✔", invalid: "Code invalide ✘" },
  en: { title: "Central Management Platform - Kiosks", dash: "Dashboard", cat: "Catalogue", stock: "Stock", sec: "Security", rep: "Reports", journal: "Action Log",
    kiosks: "Kiosk Status", sales: "Today's Sales", tx: "Transactions", alerts: "Real-time Alerts", low: "Stock-out & Low Stock Alerts", last: "Latest Transactions & Security",
    perf: "Reports & Performance", rand: "Random Check & Anti-fraud", sync: "Sync Stock", validate: "Validate Exit Code", online: "Online", offline: "Offline", alert: "Alert",
    card: "Card", cash: "Cash", code: "Exit code", wait: "Avg. wait time (min)", usage: "Kiosk usage rate (%)", dur: "Avg. transaction time (min)", help: "Help requests/24h",
    rate: "Current check rate", ok: "Valid", ko: "Rejected", used: "Used", server: "Server", connected: "Connected", logout: "Log out", exp: "Expected vs actual weight", cam: "Kiosk camera", nocam: "Camera not connected", empty: "No alerts", valid: "Valid code ✔", invalid: "Invalid code ✘" },
  ar: { title: "منصة الإدارة المركزية - المحطات", dash: "لوحة القيادة", cat: "الكتالوج", stock: "المخزون", sec: "الأمان", rep: "التقارير", journal: "سجل الإجراءات",
    kiosks: "حالة المحطات", sales: "مبيعات اليوم", tx: "المعاملات", alerts: "تنبيهات فورية", low: "تنبيهات نفاد المخزون", last: "آخر المعاملات والأمان",
    perf: "التقارير والأداء", rand: "الفحص العشوائي ومكافحة الاحتيال", sync: "مزامنة المخزون", validate: "تأكيد رمز الخروج", online: "متصل", offline: "غير متصل", alert: "تنبيه",
    card: "بالبطاقة", cash: "نقداً", code: "رمز الخروج", wait: "متوسط الانتظار (د)", usage: "نسبة استخدام المحطات (%)", dur: "متوسط مدة المعاملة (د)", help: "طلبات المساعدة/24س",
    rate: "نسبة الفحص الحالية", ok: "صالح", ko: "مرفوض", used: "مستعمل", server: "الخادم", connected: "متصل", logout: "تسجيل الخروج", exp: "الوزن المتوقع مقابل الفعلي", cam: "كاميرا المحطة", nocam: "الكاميرا غير متصلة", empty: "لا توجد تنبيهات", valid: "الرمز صالح ✔", invalid: "الرمز غير صالح ✘" },
};
export type Dict = typeof D.fr;
export async function getLang(): Promise<Lang> { const v = (await cookies()).get("lang")?.value; return v === "ar" || v === "en" ? v : "fr"; }
export const dict = (l: Lang): Dict => D[l];
