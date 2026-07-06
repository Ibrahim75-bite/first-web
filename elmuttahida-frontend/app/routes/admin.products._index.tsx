import { Link } from "react-router";
import { useState, useEffect, useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";

export default function AdminProductsList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { lang, dir } = useContext(LanguageContext);
  const isAr = lang === "ar";

  const t = {
    title: isAr ? "دليل المنتجات" : "Products Catalog",
    addNew: isAr ? "إضافة منتج جديد" : "Add New Product",
    sku: isAr ? "رمز SKU" : "SKU",
    name: isAr ? "اسم المنتج (EN)" : "Name (EN)",
    price: isAr ? "السعر" : "Price",
    stock: isAr ? "المخزون" : "Stock",
    actions: isAr ? "العمليات" : "Actions",
    loading: isAr ? "جاري تحميل المنتجات..." : "Loading products...",
    empty: isAr ? "لم يتم العثور على منتجات. أضف منتجًا للبدء." : "No products found. Create one to get started.",
    inStock: isAr ? "متوفر" : "In Stock",
    edit: isAr ? "تعديل" : "Edit",
  };

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then(res => res.json())
      .then(data => {
        setProducts(data.data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div dir={dir}>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">{t.title}</h1>
        <Link 
          to="/admin/products/new" 
          className="bg-amber-500 hover:bg-amber-600 text-black font-semibold py-2 px-4 rounded-xl transition-colors"
        >
          {t.addNew}
        </Link>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-neutral-400">
            <thead className="bg-neutral-950/50 text-neutral-300 border-b border-neutral-800">
              <tr>
                <th scope="col" className={`px-6 py-4 font-medium ${isAr ? 'text-right' : 'text-left'}`}>{t.sku}</th>
                <th scope="col" className={`px-6 py-4 font-medium ${isAr ? 'text-right' : 'text-left'}`}>{t.name}</th>
                <th scope="col" className={`px-6 py-4 font-medium ${isAr ? 'text-right' : 'text-left'}`}>{t.price}</th>
                <th scope="col" className={`px-6 py-4 font-medium ${isAr ? 'text-right' : 'text-left'}`}>{t.stock}</th>
                <th scope="col" className={`px-6 py-4 font-medium ${isAr ? 'text-left' : 'text-right'}`}>{t.actions}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-neutral-500">
                    {t.loading}
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-neutral-500">
                    {t.empty}
                  </td>
                </tr>
              ) : (
                products.map((product: any) => (
                  <tr key={product.id} className="border-b border-neutral-800/50 hover:bg-neutral-800/20 transition-colors">
                    <td className={`px-6 py-4 font-mono text-neutral-300 ${isAr ? 'text-right' : 'text-left'}`}>{product.sku}</td>
                    <td className={`px-6 py-4 text-white font-medium ${isAr ? 'text-right' : 'text-left'}`}>{product.name}</td>
                    <td className={`px-6 py-4 ${isAr ? 'text-right' : 'text-left'}`}>${product.base_price}</td>
                    <td className={`px-6 py-4 ${isAr ? 'text-right' : 'text-left'}`}>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400">
                        {t.inStock}
                      </span>
                    </td>
                    <td className={`px-6 py-4 ${isAr ? 'text-left' : 'text-right'}`}>
                      <Link to={`/admin/products/${product.id}`} className="text-amber-500 hover:text-amber-400 font-medium">
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
