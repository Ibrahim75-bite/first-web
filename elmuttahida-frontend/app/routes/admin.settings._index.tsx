import { useState, useContext } from "react";
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

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div dir={dir}>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">{t.title}</h1>
        <button 
          onClick={handleSubmit}
          className="bg-amber-500 hover:bg-amber-600 text-black font-semibold py-2 px-6 rounded-xl transition-colors"
        >
          {t.save}
        </button>
      </div>

      {saved && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-xl mb-6">
          {t.saved}
        </div>
      )}

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 max-w-2xl">
        <h2 className="text-xl font-bold text-white mb-6 border-b border-neutral-800 pb-4">{t.general}</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-2">{t.storeName}</label>
            <input 
              type="text" 
              value={formData.storeName}
              onChange={(e) => setFormData({...formData, storeName: e.target.value})}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-2">{t.contactEmail}</label>
            <input 
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-2">{t.whatsapp}</label>
            <input 
              type="text" 
              value={formData.whatsapp}
              onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-2">{t.currency}</label>
            <select 
              value={formData.currency}
              onChange={(e) => setFormData({...formData, currency: e.target.value})}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
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
