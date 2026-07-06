import { Link } from "react-router";
import { useState, useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";

export default function AdminCategories() {
  const { lang, dir } = useContext(LanguageContext);
  const isAr = lang === "ar";

  const t = {
    title: isAr ? "إدارة الفئات" : "Categories Management",
    addNew: isAr ? "إضافة فئة جديدة" : "Add New Category",
    name: isAr ? "اسم الفئة" : "Category Name",
    slug: isAr ? "الرابط الفرعي (Slug)" : "Slug",
    productsCount: isAr ? "عدد المنتجات" : "Products Count",
    actions: isAr ? "العمليات" : "Actions",
    edit: isAr ? "تعديل" : "Edit",
    delete: isAr ? "حذف" : "Delete",
  };

  const [categories] = useState([
    { id: 1, nameEn: "Vases", nameAr: "مزهريات", slug: "vases", count: 45 },
    { id: 2, nameEn: "Bowls", nameAr: "أوعية وديكورات", slug: "bowls", count: 32 },
    { id: 3, nameEn: "Lamps & Lighting", nameAr: "مصابيح وإضاءة", slug: "lamps-lighting", count: 18 },
  ]);

  return (
    <div dir={dir}>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">{t.title}</h1>
        <button className="bg-amber-500 hover:bg-amber-600 text-black font-semibold py-2 px-4 rounded-xl transition-colors">
          {t.addNew}
        </button>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-neutral-400">
            <thead className="bg-neutral-950/50 text-neutral-300 border-b border-neutral-800">
              <tr>
                <th scope="col" className={`px-6 py-4 font-medium ${isAr ? 'text-right' : 'text-left'}`}>{t.name}</th>
                <th scope="col" className={`px-6 py-4 font-medium ${isAr ? 'text-right' : 'text-left'}`}>{t.slug}</th>
                <th scope="col" className={`px-6 py-4 font-medium ${isAr ? 'text-right' : 'text-left'}`}>{t.productsCount}</th>
                <th scope="col" className={`px-6 py-4 font-medium ${isAr ? 'text-left' : 'text-right'}`}>{t.actions}</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="border-b border-neutral-800/50 hover:bg-neutral-800/20 transition-colors">
                  <td className={`px-6 py-4 text-white font-medium ${isAr ? 'text-right' : 'text-left'}`}>
                    {isAr ? cat.nameAr : cat.nameEn}
                  </td>
                  <td className={`px-6 py-4 font-mono text-neutral-400 ${isAr ? 'text-right' : 'text-left'}`}>
                    {cat.slug}
                  </td>
                  <td className={`px-6 py-4 ${isAr ? 'text-right' : 'text-left'}`}>
                    {cat.count}
                  </td>
                  <td className={`px-6 py-4 ${isAr ? 'text-left' : 'text-right'} space-x-3 space-x-reverse`}>
                    <button className="text-amber-500 hover:text-amber-400 font-medium">{t.edit}</button>
                    <button className="text-red-500 hover:text-red-400 font-medium">{t.delete}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
