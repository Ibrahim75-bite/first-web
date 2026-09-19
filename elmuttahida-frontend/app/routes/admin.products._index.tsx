import { Link } from "react-router";
import { useState, useEffect, useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";
import { fetchAllProductsAdmin, type SupabaseProduct } from "../lib/supabase";

export default function AdminProductsList() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { lang, dir } = useContext(LanguageContext);
  const isAr = lang === "ar";

  const t = {
    title: isAr ? "دليل المنتجات والمخزون الحي" : "Products & Master Inventory",
    subtitle: isAr ? "إدارة منتجات الفخار والسيراميك المصري المتصلة بقاعدة بيانات Supabase" : "Manage ceramic products, master bundles, and live Supabase catalog",
    addNew: isAr ? "إضافة منتج جديد" : "Add New Product",
    sku: isAr ? "رمز SKU" : "SKU",
    photo: isAr ? "الصورة" : "Image",
    name: isAr ? "اسم المنتج والتصنيف" : "Product & Category",
    price: isAr ? "السعر الأساسي" : "Base Price",
    stock: isAr ? "الحالة" : "Status",
    actions: isAr ? "العمليات" : "Actions",
    loading: isAr ? "جاري جلب المنتجات من Supabase..." : "Loading products from Supabase...",
    empty: isAr ? "لم يتم العثور على منتجات." : "No products found in database.",
    inStock: isAr ? "جاهز للتصدير" : "Ready / Active",
    bundleBadge: isAr ? "طقم متكامل" : "Bundle",
    viewOnline: isAr ? "معاينة بالمتجر" : "View Store",
    edit: isAr ? "تعديل" : "Edit",
  };

  useEffect(() => {
    fetchAllProductsAdmin()
      .then((spList) => {
        if (spList && spList.length > 0) {
          const mapped = spList.map((p) => ({
            id: p.id,
            product_id: p.id,
            model_sku: p.product_code,
            sku: p.product_code,
            slug: p.handle,
            name: isAr && p.name_ar ? p.name_ar : p.name_en,
            name_en: p.name_en,
            name_ar: p.name_ar,
            base_price: p.base_price,
            category: p.category,
            is_bundle: p.is_bundle,
            bundle_count: p.bundle_pieces?.length || 0,
            primary_image: p.primary_image,
            in_stock: true,
          }));
          setProducts(mapped);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load products in admin:", err);
        setLoading(false);
      });
  }, [isAr]);

  const formatPrice = (price: any) => {
    const num = price ? parseFloat(price) : 0;
    return isAr ? `${num.toLocaleString()} ج.م` : `EGP ${num.toLocaleString()}`;
  };

  return (
    <div dir={dir} className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {t.title}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
              {products.length} {isAr ? "منتج" : "Products"}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/catalogue"
            target="_blank"
            className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs py-2.5 px-4 rounded-xl transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            <span>{t.viewOnline}</span>
          </Link>
          <Link
            to="/admin/products/new"
            className="inline-flex items-center justify-center gap-2 bg-[#1152d4] hover:bg-blue-700 text-white font-semibold text-xs py-2.5 px-4 rounded-xl shadow-xs transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
            <span>{t.addNew}</span>
          </Link>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white dark:bg-[#1a2234] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-slate-600 dark:text-slate-300 border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 font-bold uppercase text-[11px] tracking-wider">
              <tr>
                <th scope="col" className={`px-4 py-3.5 font-bold ${isAr ? "text-right" : "text-left"}`}>{t.photo}</th>
                <th scope="col" className={`px-4 py-3.5 font-bold ${isAr ? "text-right" : "text-left"}`}>{t.sku}</th>
                <th scope="col" className={`px-6 py-3.5 font-bold ${isAr ? "text-right" : "text-left"}`}>{t.name}</th>
                <th scope="col" className={`px-4 py-3.5 font-bold ${isAr ? "text-right" : "text-left"}`}>{t.price}</th>
                <th scope="col" className={`px-4 py-3.5 font-bold ${isAr ? "text-right" : "text-left"}`}>{t.stock}</th>
                <th scope="col" className={`px-6 py-3.5 font-bold ${isAr ? "text-left" : "text-right"}`}>{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    <div className="inline-flex items-center gap-2">
                      <svg className="animate-spin w-4 h-4 text-[#1152d4]" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg>
                      <span>{t.loading}</span>
                    </div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    {t.empty}
                  </td>
                </tr>
              ) : (
                products.map((product: any) => (
                  <tr key={product.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors">
                    {/* Thumbnail */}
                    <td className="px-4 py-3">
                      <div className="w-12 h-12 rounded-lg bg-stone-100 dark:bg-stone-800 overflow-hidden border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                        {product.primary_image ? (
                          <img src={product.primary_image} alt={product.name} className="w-full h-full object-contain p-0.5" />
                        ) : (
                          <span className="text-[10px] text-slate-400">N/A</span>
                        )}
                      </div>
                    </td>

                    {/* SKU */}
                    <td className={`px-4 py-3 font-mono font-bold text-slate-800 dark:text-blue-400 ${isAr ? "text-right" : "text-left"}`}>
                      {product.model_sku}
                    </td>

                    {/* Name & Category */}
                    <td className={`px-6 py-3 ${isAr ? "text-right" : "text-left"}`}>
                      <div className="font-bold text-slate-900 dark:text-white hover:text-[#1152d4] cursor-pointer">
                        <Link to={`/product/${product.slug || product.model_sku}`}>
                          {product.name}
                        </Link>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">
                          {product.category}
                        </span>
                        {product.is_bundle && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                            ★ {t.bundleBadge} ({product.bundle_count})
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Price */}
                    <td className={`px-4 py-3 font-mono font-bold text-slate-800 dark:text-slate-200 ${isAr ? "text-right" : "text-left"}`}>
                      {formatPrice(product.base_price)}
                    </td>

                    {/* Stock status */}
                    <td className={`px-4 py-3 ${isAr ? "text-right" : "text-left"}`}>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
                        <span className="size-1.5 rounded-full bg-emerald-500"></span>
                        {t.inStock}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className={`px-6 py-3 ${isAr ? "text-left" : "text-right"}`}>
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          to={`/product/${product.slug || product.model_sku}`}
                          className="text-slate-500 hover:text-[#1152d4] text-xs font-semibold"
                          title="View on store"
                        >
                          {t.viewOnline}
                        </Link>
                        <Link
                          to={`/admin/products/${product.id}`}
                          className="text-[#1152d4] hover:underline font-bold text-xs"
                        >
                          {t.edit}
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
