import { Link } from "react-router";
import { useState, useContext, useEffect } from "react";
import { LanguageContext } from "../context/LanguageContext";

interface Category {
  id: number;
  nameEn: string;
  nameAr: string;
  slug: string;
  count: number;
}

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
    
    // Modal Translations
    addCategory: isAr ? "إضافة فئة جديدة" : "Add New Category",
    editCategory: isAr ? "تعديل الفئة" : "Edit Category",
    nameEn: isAr ? "الاسم بالإنجليزية" : "Name (English)",
    nameAr: isAr ? "الاسم بالعربية" : "Name (Arabic)",
    save: isAr ? "حفظ التغييرات" : "Save Changes",
    create: isAr ? "إنشاء الفئة" : "Create Category",
    cancel: isAr ? "إلغاء" : "Cancel",
    confirmDelete: isAr ? "تأكيد الحذف" : "Confirm Delete",
    deleteWarning: isAr ? "هل أنت متأكد من رغبتك في حذف هذه الفئة؟ لا يمكن التراجع عن هذا الإجراء." : "Are you sure you want to delete this category? This action cannot be undone.",
    deleteBtn: isAr ? "نعم، احذف" : "Yes, Delete",
  };

  const defaultCategories: Category[] = [
    { id: 1, nameEn: "Vases", nameAr: "مزهريات", slug: "vases", count: 45 },
    { id: 2, nameEn: "Bowls", nameAr: "أوعية وديكورات", slug: "bowls", count: 32 },
    { id: 3, nameEn: "Lamps & Lighting", nameAr: "مصابيح وإضاءة", slug: "lamps-lighting", count: 18 },
  ];

  // Load from localStorage or default
  const [categories, setCategories] = useState<Category[]>([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("elmuttahida_categories");
      if (saved) {
        try {
          setCategories(JSON.parse(saved));
        } catch (e) {
          setCategories(defaultCategories);
        }
      } else {
        setCategories(defaultCategories);
        localStorage.setItem("elmuttahida_categories", JSON.stringify(defaultCategories));
      }
      setInitialized(true);
    }
  }, []);

  const saveCategories = (newCats: Category[]) => {
    setCategories(newCats);
    if (typeof window !== "undefined") {
      localStorage.setItem("elmuttahida_categories", JSON.stringify(newCats));
    }
  };

  // Modals state
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  
  // Form fields
  const [formNameEn, setFormNameEn] = useState("");
  const [formNameAr, setFormNameAr] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formCount, setFormCount] = useState(0);

  const handleOpenAdd = () => {
    setSelectedCategory(null);
    setFormNameEn("");
    setFormNameAr("");
    setFormSlug("");
    setFormCount(0);
    setShowAddEditModal(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setSelectedCategory(cat);
    setFormNameEn(cat.nameEn);
    setFormNameAr(cat.nameAr);
    setFormSlug(cat.slug);
    setFormCount(cat.count);
    setShowAddEditModal(true);
  };

  const handleOpenDelete = (cat: Category) => {
    setSelectedCategory(cat);
    setShowDeleteModal(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNameEn || !formNameAr || !formSlug) return;

    if (selectedCategory) {
      // Editing
      const updated = categories.map(cat => 
        cat.id === selectedCategory.id 
          ? { ...cat, nameEn: formNameEn, nameAr: formNameAr, slug: formSlug, count: formCount }
          : cat
      );
      saveCategories(updated);
    } else {
      // Adding
      const newId = categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1;
      const newCat: Category = {
        id: newId,
        nameEn: formNameEn,
        nameAr: formNameAr,
        slug: formSlug,
        count: formCount
      };
      saveCategories([...categories, newCat]);
    }
    setShowAddEditModal(false);
  };

  const handleDeleteConfirm = () => {
    if (!selectedCategory) return;
    const updated = categories.filter(cat => cat.id !== selectedCategory.id);
    saveCategories(updated);
    setShowDeleteModal(false);
  };

  // Generate slug dynamically from English name
  const handleNameEnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormNameEn(val);
    if (!selectedCategory) {
      // Auto-generate slug for new categories
      setFormSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
    }
  };

  if (!initialized) {
    return <div className="text-neutral-400 p-8">{isAr ? "جاري التحميل..." : "Loading..."}</div>;
  }

  return (
    <div dir={dir} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{t.title}</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isAr ? "إدارة تصنيفات وتصنيفات المزهريات والقطع الفخارية" : "Manage pottery product classifications and catalog taxonomies"}
          </p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 bg-[#1152d4] hover:bg-blue-700 text-white font-semibold text-xs py-2.5 px-4 rounded-lg shadow-sm shadow-blue-500/20 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
          <span>{t.addNew}</span>
        </button>
      </div>

      <div className="bg-white dark:bg-[#1a2234] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300 border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 font-bold uppercase text-[11px] tracking-wider">
              <tr>
                <th scope="col" className={`px-6 py-3.5 font-bold ${isAr ? 'text-right' : 'text-left'}`}>{t.name}</th>
                <th scope="col" className={`px-6 py-3.5 font-bold ${isAr ? 'text-right' : 'text-left'}`}>{t.slug}</th>
                <th scope="col" className={`px-6 py-3.5 font-bold ${isAr ? 'text-right' : 'text-left'}`}>{t.productsCount}</th>
                <th scope="col" className={`px-6 py-3.5 font-bold ${isAr ? 'text-left' : 'text-right'}`}>{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400 font-medium">
                    {isAr ? "لا توجد فئات حالياً. قم بإضافة فئة جديدة." : "No categories found. Create a new one to get started."}
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors">
                    <td className={`px-6 py-4 text-slate-900 dark:text-white font-bold ${isAr ? 'text-right' : 'text-left'}`}>
                      {isAr ? cat.nameAr : cat.nameEn}
                    </td>
                    <td className={`px-6 py-4 font-mono text-slate-400 text-xs ${isAr ? 'text-right' : 'text-left'}`}>
                      {cat.slug}
                    </td>
                    <td className={`px-6 py-4 font-bold text-slate-900 dark:text-white ${isAr ? 'text-right' : 'text-left'}`}>
                      {cat.count}
                    </td>
                    <td className={`px-6 py-4 ${isAr ? 'text-left' : 'text-right'}`}>
                      <div className={`flex items-center gap-3 ${isAr ? 'justify-start' : 'justify-end'}`}>
                        <button 
                          onClick={() => handleOpenEdit(cat)}
                          className="text-[#1152d4] hover:underline font-bold text-xs"
                        >
                          {t.edit}
                        </button>
                        <span className="text-slate-300 dark:text-slate-700">|</span>
                        <button 
                          onClick={() => handleOpenDelete(cat)}
                          className="text-red-500 hover:underline font-bold text-xs"
                        >
                          {t.delete}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Category Modal */}
      {showAddEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300">
          <div className="w-full max-w-md bg-white dark:bg-[#1a2234] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200" dir={dir}>
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/60 dark:bg-slate-900/40">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {selectedCategory ? t.editCategory : t.addCategory}
              </h2>
              <button 
                onClick={() => setShowAddEditModal(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSaveCategory} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t.nameEn}</label>
                <input 
                  type="text"
                  required
                  value={formNameEn}
                  onChange={handleNameEnChange}
                  placeholder="e.g. Vases"
                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-[#1152d4] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t.nameAr}</label>
                <input 
                  type="text"
                  required
                  value={formNameAr}
                  onChange={(e) => setFormNameAr(e.target.value)}
                  placeholder="مثال: مزهريات"
                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-[#1152d4] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t.slug}</label>
                <input 
                  type="text"
                  required
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value)}
                  placeholder="e.g. vases"
                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-2 text-slate-900 dark:text-white font-mono focus:outline-none focus:border-[#1152d4] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t.productsCount}</label>
                <input 
                  type="number"
                  required
                  value={formCount}
                  onChange={(e) => setFormCount(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-[#1152d4] transition-colors"
                />
              </div>

              <div className="flex gap-2.5 justify-end pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddEditModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-lg transition-colors text-xs"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1152d4] hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-sm shadow-blue-500/20 text-xs"
                >
                  {selectedCategory ? t.save : t.create}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300">
          <div className="w-full max-w-sm bg-white dark:bg-[#1a2234] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200" dir={dir}>
            <div className="p-6 text-xs">
              <div className="flex items-center gap-3 mb-3 text-red-500">
                <svg className="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{t.confirmDelete}</h3>
              </div>
              <p className="text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                {t.deleteWarning}
              </p>
              <div className="flex gap-2.5 justify-end">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-lg transition-colors"
                >
                  {t.cancel}
                </button>
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors shadow-sm"
                >
                  {t.deleteBtn}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

