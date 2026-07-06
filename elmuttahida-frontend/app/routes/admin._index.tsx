import { useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";

export default function AdminDashboard() {
  const { lang, dir } = useContext(LanguageContext);
  const isAr = lang === "ar";

  const t = {
    title: isAr ? "نظرة عامة على لوحة التحكم" : "Dashboard Overview",
    totalProducts: isAr ? "إجمالي المنتجات" : "Total Products",
    activeInquiries: isAr ? "الاستفسارات النشطة" : "Active Inquiries",
    systemHealth: isAr ? "حالة النظام" : "System Health",
    healthy: isAr ? "سليم وبحالة جيدة" : "99.9% Healthy",
  };

  return (
    <div dir={dir}>
      <h1 className="text-3xl font-bold text-white mb-8">{t.title}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
          <h3 className="text-neutral-400 text-sm font-medium mb-2">{t.totalProducts}</h3>
          <p className="text-3xl font-bold text-white">124</p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
          <h3 className="text-neutral-400 text-sm font-medium mb-2">{t.activeInquiries}</h3>
          <p className="text-3xl font-bold text-white">12</p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
          <h3 className="text-neutral-400 text-sm font-medium mb-2">{t.systemHealth}</h3>
          <p className="text-3xl font-bold text-emerald-400">{t.healthy}</p>
        </div>
      </div>
    </div>
  );
}
