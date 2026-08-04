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
    <div dir={dir}>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">{t.title}</h1>
        <button 
          onClick={handleOpenAdd}
          className="bg-amber-500 hover:bg-amber-600 text-black font-semibold py-2 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 active:scale-95"
        >
          {t.addNew}
        </button>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-neutral-400">
            <thead className="bg-neutral-950/60 text-neutral-300 border-b border-neutral-800">
              <tr>
                <th scope="col" className={`px-6 py-4 font-semibold ${isAr ? 'text-right' : 'text-left'}`}>{t.name}</th>
                <th scope="col" className={`px-6 py-4 font-semibold ${isAr ? 'text-right' : 'text-left'}`}>{t.slug}</th>
                <th scope="col" className={`px-6 py-4 font-semibold ${isAr ? 'text-right' : 'text-left'}`}>{t.productsCount}</th>
                <th scope="col" className={`px-6 py-4 font-semibold ${isAr ? 'text-right' : 'text-left'}`}>{t.actions}</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-neutral-500 font-medium">
                    {isAr ? "لا توجد فئات حالياً. قم بإضافة فئة جديدة." : "No categories found. Create a new one to get started."}
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id} className="border-b border-neutral-800/40 hover:bg-neutral-800/20 transition-all duration-200">
                    <td className={`px-6 py-4 text-white font-medium ${isAr ? 'text-right' : 'text-left'}`}>
                      {isAr ? cat.nameAr : cat.nameEn}
                    </td>
                    <td className={`px-6 py-4 font-mono text-neutral-400 text-xs ${isAr ? 'text-right' : 'text-left'}`}>
                      {cat.slug}
                    </td>
                    <td className={`px-6 py-4 font-semibold text-neutral-300 ${isAr ? 'text-right' : 'text-left'}`}>
                      {cat.count}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3 justify-start">
                        <button 
                          onClick={() => handleOpenEdit(cat)}
                          className="text-amber-500 hover:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200"
                        >
                          {t.edit}
                        </button>
                        <button 
                          onClick={() => handleOpenDelete(cat)}
                          className="text-red-500 hover:text-red-400 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200"
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

      {/* Add / Edit Modal */}
      {showAddEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm transition-opacity duration-300">
          <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200" dir={dir}>
            <div className="px-6 py-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-950/40">
              <h2 className="text-xl font-bold text-white">
                {selectedCategory ? t.editCategory : t.addCategory}
              </h2>
              <button 
                onClick={() => setShowAddEditModal(false)}
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSaveCategory} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-neutral-400 mb-1.5">{t.nameEn}</label>
                <input 
                  type="text"
                  required
                  value={formNameEn}
                  onChange={handleNameEnChange}
                  placeholder="e.g. Vases"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-400 mb-1.5">{t.nameAr}</label>
                <input 
                  type="text"
                  required
                  value={formNameAr}
                  onChange={(e) => setFormNameAr(e.target.value)}
                  placeholder="مثال: مزهريات"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-400 mb-1.5">{t.slug}</label>
                <input 
                  type="text"
                  required
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value)}
                  placeholder="e.g. vases"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-400 mb-1.5">{t.productsCount}</label>
                <input 
                  type="number"
                  required
                  value={formCount}
                  onChange={(e) => setFormCount(parseInt(e.target.value) || 0)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-neutral-800/60 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddEditModal(false)}
                  className="px-5 py-2.5 bg-neutral-950 border border-neutral-850 hover:bg-neutral-800 text-neutral-300 font-semibold rounded-xl transition-colors"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-xl transition-colors shadow-lg shadow-amber-500/10"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm transition-opacity duration-300">
          <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200" dir={dir}>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4 text-red-500">
                <svg className="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h2 className="text-lg font-bold text-white">
                  {t.confirmDelete}
                </h2>
              </div>
              <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                {t.deleteWarning}
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-neutral-950 border border-neutral-850 hover:bg-neutral-800 text-neutral-300 font-semibold rounded-xl transition-colors text-sm"
                >
                  {t.cancel}
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors text-sm shadow-lg shadow-red-600/20"
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

