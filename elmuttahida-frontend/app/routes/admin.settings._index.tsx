import { useState, useContext, useEffect } from "react";
import { LanguageContext } from "../context/LanguageContext";

export default function AdminSettings() {
  const { lang, dir } = useContext(LanguageContext);
  const isAr = lang === "ar";

  const t = {
    title: isAr ? "إعدادات المنصة" : "Platform Settings",
    save: isAr ? "حفظ التغييرات" : "Save Changes",
    general: isAr ? "الإعدادات العامة" : "General Settings",
    storeName: isAr ? "اسم المتجر" : "Store Name",
    contactEmail: isAr ? "البريد الإلكتروني للتواصل" : "Contact Email",
    whatsapp: isAr ? "رقم الواتساب للتواصل B2B" : "B2B WhatsApp Number",
    currency: isAr ? "العملة الافتراضية" : "Default Currency",
    saved: isAr ? "تم حفظ الإعدادات بنجاح!" : "Settings saved successfully!",
  };

  const [formData, setFormData] = useState({
    storeName: "Elmuttahida",
    email: "info@elmuttahida.com",
    whatsapp: "+20123456789",
    currency: "USD ($)",
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedName = localStorage.getItem("storeName") || "Elmuttahida";
    const savedEmail = localStorage.getItem("email") || "info@elmuttahida.com";
    const savedWhatsapp = localStorage.getItem("whatsapp") || "+20123456789";
    const savedCurrency = localStorage.getItem("currency") || "USD ($)";
    setFormData({
      storeName: savedName,
      email: savedEmail,
      whatsapp: savedWhatsapp,
      currency: savedCurrency,
    });
  }, []);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    localStorage.setItem("storeName", formData.storeName);
    localStorage.setItem("email", formData.email);
    localStorage.setItem("whatsapp", formData.whatsapp);
    localStorage.setItem("currency", formData.currency);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div dir={dir} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{t.title}</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isAr ? "إدارة إعدادات المتجر وبيانات التواصل والعملة الافتراضية" : "Manage store configuration, contact channels, and system defaults"}
          </p>
        </div>
        <button 
          onClick={handleSubmit}
          className="inline-flex items-center justify-center gap-2 bg-[#1152d4] hover:bg-blue-700 text-white font-semibold text-xs py-2.5 px-6 rounded-lg shadow-sm shadow-blue-500/20 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
          <span>{t.save}</span>
        </button>
      </div>

      {saved && (
        <div className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40 px-4 py-3 rounded-lg text-xs font-semibold flex items-center gap-2">
          <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
          <span>{t.saved}</span>
        </div>
      )}

      <div className="bg-white dark:bg-[#1a2234] border border-slate-200 dark:border-slate-800 rounded-xl p-6 max-w-2xl shadow-xs">
        <h2 className="text-base font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-800 pb-3">{t.general}</h2>
        <div className="space-y-5 text-xs">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t.storeName}</label>
            <input 
              type="text" 
              value={formData.storeName}
              onChange={(e) => setFormData({...formData, storeName: e.target.value})}
              className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-[#1152d4] transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t.contactEmail}</label>
            <input 
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-[#1152d4] transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t.whatsapp}</label>
            <input 
              type="text" 
              value={formData.whatsapp}
              onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
              className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-[#1152d4] transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t.currency}</label>
            <select 
              value={formData.currency}
              onChange={(e) => setFormData({...formData, currency: e.target.value})}
              className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-[#1152d4] transition-colors cursor-pointer"
            >
              <option>USD ($)</option>
              <option>EGP (ج.م)</option>
              <option>EUR (€)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
