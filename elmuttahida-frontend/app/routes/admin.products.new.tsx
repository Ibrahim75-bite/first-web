import { Link, useNavigate } from "react-router";
import { useState, useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";

export default function AdminProductNew() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const { lang, dir } = useContext(LanguageContext);
  const isAr = lang === "ar";
  
  // Read currency from localStorage
  const savedCurrency = localStorage.getItem("currency") || "USD ($)";
  let currencySymbol = "$";
  if (savedCurrency.includes("EGP")) {
    currencySymbol = isAr ? "ج.م" : "EGP";
  } else if (savedCurrency.includes("EUR")) {
    currencySymbol = "€";
  }

  const [formData, setFormData] = useState({
    sku: "",
    base_price: "",
    status: "draft",
    // English Content
    name_en: "",
    description_en: "",
    // Arabic Content
    name_ar: "",
    description_ar: "",

    // New Options
    item_type: "single", // "single" or "bundle"
    height: "",
    width: "",
    depth: "",
    package_height: "",
    package_width: "",
    package_depth: "",
    single_weight: "",
    bundle_weight: "",
    images: [] as string[],
  });

  const [newImageUrl, setNewImageUrl] = useState("");

  const t = {
    backToProducts: isAr ? "العودة إلى المنتجات" : "Back to Products",
    createProduct: isAr ? "إضافة منتج جديد" : "Create New Product",
    submitBtn: isAr ? "إنشاء المنتج" : "Create Product",
    creating: isAr ? "جاري الإنشاء..." : "Creating...",
    coreInfo: isAr ? "المعلومات الأساسية" : "Core Information",
    sku: isAr ? "رمز SKU" : "SKU",
    basePrice: isAr ? `السعر الأساسي (${currencySymbol})` : `Base Price (${currencySymbol})`,
    localizationContent: isAr ? "محتوى الترجمة واللغات" : "Localization Content",
    english: isAr ? "النسخة الإنجليزية" : "English Version",
    arabic: isAr ? "النسخة العربية" : "Arabic Version",
    status: isAr ? "الحالة" : "Status",
    visibility: isAr ? "حالة الظهور" : "Visibility",
    active: isAr ? "نشط (منشور)" : "Active (Published)",
    draft: isAr ? "مسودة (مخفي)" : "Draft (Hidden)",
    archived: isAr ? "مؤرشف" : "Archived",

    // Bundle / Options Translations
    productType: isAr ? "نوع المنتج" : "Product Type",
    singleItem: isAr ? "قطعة فردية (Single)" : "Single Item",
    bundleSet: isAr ? "مجموعة / طقم (Bundle)" : "Bundle / Set",
    dimensions: isAr ? "المقاسات والأبعاد (سم)" : "Dimensions & Measurements (cm)",
    height: isAr ? "الارتفاع" : "Height",
    width: isAr ? "العرض" : "Width",
    depth: isAr ? "العمق / الطول" : "Depth / Length",
    packageDimensions: isAr ? "أبعاد الطرد / التعبئة (سم)" : "Package / Bundle Dimensions (cm)",
    packageHeight: isAr ? "ارتفاع الطرد" : "Package Height",
    packageWidth: isAr ? "عرض الطرد" : "Package Width",
    packageDepth: isAr ? "عمق الطرد" : "Package Depth",
    weights: isAr ? "الأوزان (كجم)" : "Weights (kg)",
    singleWeight: isAr ? "وزن القطعة الفردية" : "Single Item Weight",
    bundleWeight: isAr ? "وزن المجموعة / الطرد" : "Packaged / Bundle Weight",
    productImages: isAr ? "صور المنتج" : "Product Images",
    addImageUrl: isAr ? "إضافة رابط" : "Add URL",
    enterImageUrl: isAr ? "أدخل رابط الصورة..." : "Enter image URL...",
    uploadFile: isAr ? "تحميل صورة" : "Upload Image",
    noImages: isAr ? "لا توجد صور لهذا المنتج بعد." : "No images uploaded yet.",
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddImage = (e: any) => {
    e.preventDefault();
    if (newImageUrl.trim()) {
      setFormData(prev => ({ ...prev, images: [...prev.images, newImageUrl.trim()] }));
      setNewImageUrl("");
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== index)
    }));
  };

  const handleLocalImageUpload = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const fakeUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, images: [...prev.images, fakeUrl] }));
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSaving(true);
    
    // Simulate save
    setTimeout(() => {
      setSaving(false);
      navigate("/admin/products");
    }, 1000);
  };

  return (
    <div dir={dir}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link to="/admin/products" className="text-neutral-400 hover:text-white mb-2 inline-flex items-center text-sm transition-colors">
            <svg className={`w-4 h-4 ${isAr ? 'ml-1 rotate-180' : 'mr-1'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t.backToProducts}
          </Link>
          <h1 className="text-3xl font-bold text-white">{t.createProduct}</h1>
        </div>
        <button 
          onClick={handleSubmit}
          disabled={saving}
          className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-black font-semibold py-2 px-6 rounded-xl transition-colors flex items-center"
        >
          {saving ? t.creating : t.submitBtn}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Form */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Core Info & Single/Bundle Choice */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">{t.coreInfo}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">{t.sku}</label>
                <input 
                  type="text" 
                  name="sku" 
                  value={formData.sku} 
                  onChange={handleChange}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">{t.basePrice}</label>
                <input 
                  type="number" 
                  name="base_price" 
                  value={formData.base_price} 
                  onChange={handleChange}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">{t.productType}</label>
                <select 
                  name="item_type" 
                  value={formData.item_type} 
                  onChange={handleChange}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                >
                  <option value="single">{t.singleItem}</option>
                  <option value="bundle">{t.bundleSet}</option>
                </select>
              </div>
            </div>

            {/* Sizes & Measurements */}
            <div className="border-t border-neutral-800/80 pt-6">
              <h3 className="text-base font-bold text-white mb-4">{t.dimensions}</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">{t.height}</label>
                  <input 
                    type="number" 
                    name="height" 
                    value={formData.height} 
                    onChange={handleChange}
                    placeholder="cm"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">{t.width}</label>
                  <input 
                    type="number" 
                    name="width" 
                    value={formData.width} 
                    onChange={handleChange}
                    placeholder="cm"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">{t.depth}</label>
                  <input 
                    type="number" 
                    name="depth" 
                    value={formData.depth} 
                    onChange={handleChange}
                    placeholder="cm"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Packaged/Bundle Pack Dimensions (conditional) */}
            {formData.item_type === "bundle" && (
              <div className="border-t border-neutral-800/80 mt-6 pt-6">
                <h3 className="text-base font-bold text-white mb-4">{t.packageDimensions}</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">{t.packageHeight}</label>
                    <input 
                      type="number" 
                      name="package_height" 
                      value={formData.package_height} 
                      onChange={handleChange}
                      placeholder="cm"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">{t.packageWidth}</label>
                    <input 
                      type="number" 
                      name="package_width" 
                      value={formData.package_width} 
                      onChange={handleChange}
                      placeholder="cm"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">{t.packageDepth}</label>
                    <input 
                      type="number" 
                      name="package_depth" 
                      value={formData.package_depth} 
                      onChange={handleChange}
                      placeholder="cm"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Weights Section */}
            <div className="border-t border-neutral-800/80 mt-6 pt-6">
              <h3 className="text-base font-bold text-white mb-4">{t.weights}</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">{t.singleWeight}</label>
                  <input 
                    type="number" 
                    name="single_weight" 
                    value={formData.single_weight} 
                    onChange={handleChange}
                    placeholder="kg"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
                {formData.item_type === "bundle" && (
                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">{t.bundleWeight}</label>
                    <input 
                      type="number" 
                      name="bundle_weight" 
                      value={formData.bundle_weight} 
                      onChange={handleChange}
                      placeholder="kg"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Bilingual Content */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">{t.localizationContent}</h2>
            
            <div className="space-y-8">
              {/* English Section */}
              <div className="p-5 border border-neutral-800/80 rounded-xl bg-neutral-950/50" dir="ltr">
                <div className="flex items-center mb-4">
                  <span className="bg-blue-500/10 text-blue-400 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">{t.english}</span>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">Product Name</label>
                    <input 
                      type="text" 
                      name="name_en" 
                      value={formData.name_en} 
                      onChange={handleChange}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">Description</label>
                    <textarea 
                      name="description_en" 
                      value={formData.description_en} 
                      onChange={handleChange}
                      rows={4}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Arabic Section */}
              <div className="p-5 border border-neutral-800/80 rounded-xl bg-neutral-950/50" dir="rtl">
                <div className="flex items-center mb-4">
                  <span className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">{t.arabic}</span>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">اسم المنتج</label>
                    <input 
                      type="text" 
                      name="name_ar" 
                      value={formData.name_ar} 
                      onChange={handleChange}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">الوصف</label>
                    <textarea 
                      name="description_ar" 
                      value={formData.description_ar} 
                      onChange={handleChange}
                      rows={4}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Sidebar settings */}
        <div className="space-y-6">
          {/* Status & Visibility */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">{t.status}</h2>
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">{t.visibility}</label>
              <select 
                name="status" 
                value={formData.status} 
                onChange={handleChange}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
              >
                <option value="active">{t.active}</option>
                <option value="draft">{t.draft}</option>
                <option value="archived">{t.archived}</option>
              </select>
            </div>
          </div>

          {/* Product Images Manager */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">{t.productImages}</h2>
            
            {/* Current Images List */}
            <div className="space-y-3 mb-6">
              {formData.images.length === 0 ? (
                <p className="text-sm text-neutral-500 italic">{t.noImages}</p>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {formData.images.map((imgUrl, index) => (
                    <div key={index} className="relative group aspect-square rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800">
                      <img 
                        src={imgUrl} 
                        alt={`Product img ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                      <button 
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1.5 right-1.5 bg-red-500/80 hover:bg-red-600 text-white rounded-lg p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove Image"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Image URLs Input */}
            <div className="space-y-4 pt-4 border-t border-neutral-800/80">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder={t.enterImageUrl}
                  value={newImageUrl} 
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                />
                <button 
                  type="button"
                  onClick={handleAddImage}
                  className="bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-colors shrink-0"
                >
                  {t.addImageUrl}
                </button>
              </div>

              {/* Local File input */}
              <div>
                <label className="block w-full bg-neutral-950 border border-neutral-800 border-dashed rounded-xl py-3 text-center text-xs font-semibold text-neutral-400 hover:text-white hover:border-amber-500/50 cursor-pointer transition-all">
                  <span>{t.uploadFile}</span>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleLocalImageUpload}
                    className="hidden" 
                  />
                </label>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
