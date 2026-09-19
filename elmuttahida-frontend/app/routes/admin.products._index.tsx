import { Link } from "react-router";
import { useState, useEffect, useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";

export default function AdminProductsList() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { lang, dir } = useContext(LanguageContext);
  const isAr = lang === "ar";

  const t = {
    title: isAr ? "دليل المنتجات والمخزون" : "Products Catalog",
    subtitle: isAr ? "إدارة الفخار والسيراميك والقطع المتاحة للتصدير B2B" : "Manage inventory, wholesale ceramics, and export lines",
    addNew: isAr ? "إضافة منتج جديد" : "Add New Product",
    sku: isAr ? "رمز SKU" : "SKU",
    name: isAr ? "اسم المنتج" : "Product Name",
    price: isAr ? "السعر الأساسي" : "Base Price",
    stock: isAr ? "حالة التوفر" : "Stock Status",
    actions: isAr ? "العمليات" : "Actions",
    loading: isAr ? "جاري تحميل المنتجات..." : "Loading products...",
    empty: isAr ? "لم يتم العثور على منتجات. أضف منتجًا للبدء." : "No products found. Create one to get started.",
    inStock: isAr ? "متوفر" : "In Stock",
    edit: isAr ? "تعديل" : "Edit",
  };

  const defaultCatalog = [
    {
      product_id: 1,
      model_sku: "U0002-PN05-SET",
      name: isAr ? "طقم مزهريات سيراميك منقط بلمسة ذهبية" : "Speckled Gold Donut Vase Set",
      base_price: "499.00",
      in_stock: true
    },
    {
      product_id: 2,
      model_sku: "U0002-PN05",
      name: isAr ? "مزهرية أمفورا بورسلين تقليدية" : "Classic Porcelain Amphora Vase",
      base_price: "447.00",
      in_stock: true
    },
    {
      product_id: 3,
      model_sku: "U0003-NV12",
      name: isAr ? "وعاء طمي النيل المنحوت يدوياً" : "Hand-Carved Nile Clay Vessel",
      base_price: "320.00",
      in_stock: true
    },
    {
      product_id: 4,
      model_sku: "U0004-CB09",
      name: isAr ? "مزهرية مضلعة كوزميك زرقاء" : "Artisanal Cobalt Ribbed Vase",
      base_price: "285.00",
      in_stock: true
    }
  ];

  useEffect(() => {
    const apiUrl = typeof window !== "undefined" && (window as any).ENV?.VITE_API_URL 
      ? (window as any).ENV.VITE_API_URL 
      : "http://localhost:5000";

    fetch(`${apiUrl}/api/products`)
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.data) && data.data.length > 0) {
          setProducts(data.data);
        } else {
          setProducts(defaultCatalog);
        }
        setLoading(false);
      })
      .catch(() => {
        // Fallback to local catalog demonstration
        setProducts(defaultCatalog);
        setLoading(false);
      });
  }, []);

  const formatPrice = (price: any) => {
    const num = price ? parseFloat(price) : 299.00;
    const savedCurrency = typeof window !== "undefined" ? (localStorage.getItem("currency") || "USD ($)") : "USD ($)";
    if (savedCurrency.includes("EGP")) {
      return isAr ? `${num} ج.م` : `EGP ${num}`;
    } else if (savedCurrency.includes("EUR")) {
      return `€${num}`;
    } else {
      return `$${num}`;
    }
  };

  return (
    <div dir={dir} className="space-y-6">
      
      {/* Stitch Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t.title}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t.subtitle}
          </p>
        </div>

        <Link 
          to="/admin/products/new" 
          className="inline-flex items-center justify-center gap-2 bg-[#1152d4] hover:bg-blue-700 text-white font-semibold text-xs py-2.5 px-4 rounded-lg shadow-sm shadow-blue-500/20 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
          <span>{t.addNew}</span>
        </Link>
      </div>

      {/* Stitch Table Card */}
      <div className="bg-white dark:bg-[#1a2234] border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-slate-600 dark:text-slate-300 border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 font-bold uppercase text-[11px] tracking-wider">
              <tr>
                <th scope="col" className={`px-6 py-3.5 font-bold ${isAr ? 'text-right' : 'text-left'}`}>{t.sku}</th>
                <th scope="col" className={`px-6 py-3.5 font-bold ${isAr ? 'text-right' : 'text-left'}`}>{t.name}</th>
                <th scope="col" className={`px-6 py-3.5 font-bold ${isAr ? 'text-right' : 'text-left'}`}>{t.price}</th>
                <th scope="col" className={`px-6 py-3.5 font-bold ${isAr ? 'text-right' : 'text-left'}`}>{t.stock}</th>
                <th scope="col" className={`px-6 py-3.5 font-bold ${isAr ? 'text-left' : 'text-right'}`}>{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    <div className="inline-flex items-center gap-2">
                      <svg className="animate-spin w-4 h-4 text-[#1152d4]" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg>
                      <span>{t.loading}</span>
                    </div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    {t.empty}
                  </td>
                </tr>
              ) : (
                products.map((product: any) => (
                  <tr key={product.product_id || product.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors">
                    <td className={`px-6 py-4 font-mono font-bold text-slate-700 dark:text-slate-300 ${isAr ? 'text-right' : 'text-left'}`}>
                      {product.model_sku || product.sku || "-"}
                    </td>
                    <td className={`px-6 py-4 font-bold text-slate-900 dark:text-white ${isAr ? 'text-right' : 'text-left'}`}>
                      {product.name}
                    </td>
                    <td className={`px-6 py-4 font-mono font-medium ${isAr ? 'text-right' : 'text-left'}`}>
                      {formatPrice(product.base_price)}
                    </td>
                    <td className={`px-6 py-4 ${isAr ? 'text-right' : 'text-left'}`}>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
                        <span className="size-1.5 rounded-full bg-emerald-500"></span>
                        {t.inStock}
                      </span>
                    </td>
                    <td className={`px-6 py-4 ${isAr ? 'text-left' : 'text-right'}`}>
                      <Link 
                        to={`/admin/products/${product.product_id || product.id}`} 
                        className="text-[#1152d4] hover:underline font-bold text-xs"
                      >
                        {t.edit}
                      </Link>
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
