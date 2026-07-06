import { useEffect, useState, useContext, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { LanguageContext } from "../context/LanguageContext";
import { ThemeContext } from "../context/ThemeContext";
import { useToast } from "../components/Toast";

// ── Labels ──
const labels = {
  en: {
    searchPlaceholder: "Search SKU...",
    collections: "COLLECTIONS",
    styleMaterial: "STYLE & MATERIAL",
    showing: "Showing",
    of: "of",
    products: "products",
    sortBy: "Sort by:",
    newestArrivals: "Newest Arrivals",
    noResults: "No products found matching your criteria.",
    tryAdjusting: "Try adjusting your search or filters.",
    loadMore: "Load More",
    loading: "Loading...",
    addToInquiry: "Add to Inquiry",
    errorMessage: "Failed to load products. Please try again.",
    heroBanner: "SUMMER 2026 COLLECTION",
    heroTitle: "Modern Clay Elegance",
    heroDescription: "Discover our latest range of handcrafted minimalist vases, designed for premium spaces.",
    inquiryCart: "Inquiry Cart",
    requestQuote: "REQUEST QUOTE",
  },
  ar: {
    searchPlaceholder: "بحث بالرمز...",
    collections: "المجموعات",
    styleMaterial: "الأسلوب والمادة",
    showing: "عرض",
    of: "من",
    products: "منتج",
    sortBy: "ترتيب حسب:",
    newestArrivals: "أحدث الوصولات",
    noResults: "لم يتم العثور على منتجات.",
    tryAdjusting: "جرب تعديل البحث أو الفلاتر.",
    loadMore: "تحميل المزيد",
    loading: "جارٍ التحميل...",
    addToInquiry: "إضافة للاستفسار",
    errorMessage: "فشل تحميل المنتجات.",
    heroBanner: "مجموعة صيف 2026",
    heroTitle: "أناقة الخزف الحديث",
    heroDescription: "اكتشف مجموعتنا الأحدث من المزهريات المصنوعة يدويًا، مصممة للمساحات الفاخرة.",
    inquiryCart: "سلة الاستفسار",
    requestQuote: "طلب عرض أسعار",
  },
};

// ── Filter Data ──
const STYLE_TAGS = ["modern", "classic", "ceramic", "glass"];
const COLLECTION_TAGS = ["summer-2026", "royal-heritage", "minimalist"];
const COLLECTION_LABELS = {
  "summer-2026": { en: "Summer 2026", ar: "صيف 2026" },
  "royal-heritage": { en: "Royal Heritage", ar: "التراث الملكي" },
  minimalist: { en: "Minimalist", ar: "بسيط" },
};

const FALLBACK_COLORS = ["#c4a35a", "#8b5e3c", "#2f4f4f", "#2c2c2c", "#f5f0e8", "#3d5a80", "#b8395a"];

export default function Catalogue() {
  const { lang } = useContext(LanguageContext);
  const { theme } = useContext(ThemeContext);
  const t = labels[lang] || labels.en;
  const isDark = theme === "dark";
  const toast = useToast();

  // ── State ──
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  // Track selected variant per product card: { productId: variantIndex }
  const [selectedVariants, setSelectedVariants] = useState({});

  // ── Collapsible filter sections ──
  const [openSections, setOpenSections] = useState({
    collections: true,
    style: true,
  });
  const toggleSection = (key) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  // ── Cart count ──
  const refreshCartCount = () => {
    try {
      const cart = JSON.parse(localStorage.getItem("inquiryCart") || "[]");
      setCartCount(cart.length);
    } catch {
      setCartCount(0);
    }
  };

  useEffect(() => {
    refreshCartCount();
  }, []);

  // ── Fetch Products ──
  const fetchProducts = useCallback(
    async (currentPage, append = false) => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get("/products", {
          params: {
            lang,
            search: search.trim() || undefined,
            tags: selectedTags.length ? selectedTags.join(",") : undefined,
            page: currentPage,
            limit: 20,
          },
        });
        const data = res.data.data || [];
        if (append) {
          setProducts((prev) => [...prev, ...data]);
        } else {
          setProducts(data);
        }
        setTotal(res.data.total || 0);
        setTotalPages(res.data.totalPages || 1);
      } catch (err) {
        console.error("Catalogue fetch error", err);
        setError(t.errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [lang, search, selectedTags, t.errorMessage]
  );

  useEffect(() => {
    setPage(1);
    fetchProducts(1, false);
  }, [lang, search, selectedTags, fetchProducts]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProducts(nextPage, true);
  };

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // ── Add to Inquiry ──
  const addToInquiry = (prod, variantIdx) => {
    const variant = prod.variants?.[variantIdx || 0];
    const cartItem = {
      product_id: prod.product_id,
      name: prod.name,
      model_sku: prod.model_sku,
      material: prod.material,
      weight: prod.weight,
      height: prod.height,
      image: variant?.images?.[0]?.thumbnail || variant?.images?.[0]?.url || null,
      mainImage: variant?.images?.[0]?.url || variant?.images?.[0]?.thumbnail || null,
      code: variant?.sku || prod.model_sku,
      color: variant?.color,
      color_code: variant?.color_code,
      variant_id: variant?.variant_id,
      qty: variant?.min_order_qty || 1,
    };
    const existing = JSON.parse(localStorage.getItem("inquiryCart") || "[]");
    existing.push(cartItem);
    localStorage.setItem("inquiryCart", JSON.stringify(existing));
    refreshCartCount();
    toast(
      lang === "ar"
        ? `تمت إضافة "${prod.name}" إلى سلة الاستفسار`
        : `"${prod.name}" added to inquiry cart`,
      "success"
    );
  };

  // ── Helpers ──
  const getProductImage = (prod, variantIdx) => {
    const v = prod.variants?.[variantIdx || 0];
    return v?.images?.[0]?.thumbnail || v?.images?.[0]?.url;
  };

  const getVariantSwatches = (prod) =>
    prod.variants?.map((v, i) => ({
      color: v.color_code || FALLBACK_COLORS[i % FALLBACK_COLORS.length],
      name: v.color || `Variant ${i + 1}`,
    })) || [];

  // ── Chevron SVG ──
  const Chevron = ({ open }) => (
    <svg
      className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""} ${isDark ? "text-gray-400" : "text-gray-500"}`}
      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );

  // ── Theme classes ──
  const c = {
    bg: isDark ? "bg-[#101622]" : "bg-[#fafafa]",
    sidebar: isDark ? "bg-[#101622] border-gray-800" : "bg-white border-gray-200",
    input: isDark ? "bg-[#1a2332] text-gray-200 placeholder:text-gray-500 border-gray-700 focus:border-[#0071e3]" : "bg-gray-50 text-gray-800 placeholder:text-gray-400 border-gray-200 focus:border-[#0071e3]",
    sectionTitle: isDark ? "text-gray-300" : "text-gray-700",
    checkbox: isDark ? "border-gray-600 bg-[#1a2332] text-[#0071e3]" : "border-gray-300 bg-white text-[#0071e3]",
    checkboxLabel: isDark ? "text-gray-400 group-hover:text-gray-200" : "text-gray-600 group-hover:text-gray-900",
    divider: isDark ? "border-gray-800" : "border-gray-200",
    card: isDark ? "bg-[#1a2332] border-gray-800/50 hover:border-gray-700" : "bg-white border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md",
    cardImageBg: isDark ? "bg-[#141e2e]" : "bg-gray-100",
    cardTitle: isDark ? "text-white" : "text-gray-900",
    cardSku: isDark ? "text-gray-500" : "text-gray-400",
    cardDesc: isDark ? "text-gray-500" : "text-gray-500",
    cardBtn: isDark ? "bg-[#1f2b3d] hover:bg-[#263548] border-gray-700 text-gray-300 hover:text-white" : "bg-gray-100 hover:bg-[#0071e3] border-gray-200 text-gray-600 hover:text-white hover:border-[#0071e3]",
    banner: isDark ? "bg-[#1a2332]" : "bg-gradient-to-r from-[#1a2332] to-[#2a3a52]",
    resultText: isDark ? "text-gray-400" : "text-gray-500",
    resultBold: isDark ? "text-white" : "text-gray-900",
    noImage: isDark ? "text-gray-600" : "text-gray-400",
    floatBg: isDark ? "bg-[#1a2332] border-gray-700" : "bg-white border-gray-200 shadow-lg",
    floatText: isDark ? "text-gray-300" : "text-gray-600",
  };

  return (
    <div className={`flex min-h-screen ${c.bg} transition-colors duration-300`}>

      {/* ═══════════ Sidebar Filters ═══════════ */}
      <aside className={`hidden md:flex w-56 lg:w-64 shrink-0 flex-col gap-6 border-r ${c.sidebar} p-6 pt-8 transition-colors duration-300`}>

        {/* Search */}
        <div className="relative">
          <svg className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${isDark ? "text-gray-500" : "text-gray-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.searchPlaceholder}
            className={`w-full h-10 pl-9 pr-3 rounded-lg text-sm outline-none border transition-colors ${c.input}`}
            aria-label={t.searchPlaceholder}
          />
        </div>

        {/* Collections */}
        <div>
          <button
            onClick={() => toggleSection("collections")}
            className={`flex w-full items-center justify-between py-2 text-[11px] font-bold tracking-widest uppercase ${c.sectionTitle}`}
          >
            {t.collections}
            <Chevron open={openSections.collections} />
          </button>
          {openSections.collections && (
            <div className="mt-2 space-y-2.5">
              {COLLECTION_TAGS.map((tag) => (
                <label key={tag} className="flex items-center gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedTags.includes(tag)}
                    onChange={() => toggleTag(tag)}
                    className={`h-4 w-4 rounded cursor-pointer ${c.checkbox} focus:ring-[#0071e3]/30`}
                  />
                  <span className={`text-sm transition-colors ${c.checkboxLabel}`}>
                    {COLLECTION_LABELS[tag]?.[lang] || tag}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Style & Material */}
        <div className={`border-t pt-4 ${c.divider}`}>
          <button
            onClick={() => toggleSection("style")}
            className={`flex w-full items-center justify-between py-2 text-[11px] font-bold tracking-widest uppercase ${c.sectionTitle}`}
          >
            {t.styleMaterial}
            <Chevron open={openSections.style} />
          </button>
          {openSections.style && (
            <div className="mt-2 space-y-2.5">
              {STYLE_TAGS.map((tag) => (
                <label key={tag} className="flex items-center gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedTags.includes(tag)}
                    onChange={() => toggleTag(tag)}
                    className={`h-4 w-4 rounded cursor-pointer ${c.checkbox} focus:ring-[#0071e3]/30`}
                  />
                  <span className={`text-sm capitalize transition-colors ${c.checkboxLabel}`}>
                    {tag}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* ═══════════ Main Content ═══════════ */}
      <main className="flex-grow p-4 sm:p-6 lg:p-8 pb-28 sm:pb-24" role="main">

        {/* ── Hero Banner ── */}
        <div className={`mb-6 sm:mb-8 rounded-xl sm:rounded-2xl overflow-hidden relative h-32 sm:h-40 lg:h-48 ${c.banner}`}>
          <div className="absolute inset-0 bg-gradient-to-r from-[#101622]/90 via-[#101622]/60 to-transparent z-10" />
          <div className="relative z-20 h-full flex flex-col justify-center px-5 sm:px-8 lg:px-10">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#0071e3] mb-2">
              {t.heroBanner}
            </span>
            <h1 className="font-display text-lg sm:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2 leading-tight">
              {t.heroTitle}
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 max-w-md leading-relaxed hidden sm:block">
              {t.heroDescription}
            </p>
          </div>
        </div>

        {/* ── Results + Sort ── */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4" aria-live="polite">
          <p className={`text-sm ${c.resultText}`}>
            {t.showing}{" "}
            <span className={`font-medium ${c.resultBold}`}>{products.length}</span>{" "}
            {t.of}{" "}
            <span className={`font-medium ${c.resultBold}`}>{total}</span>{" "}
            {t.products}
          </p>
          <div className={`flex items-center gap-2 text-sm ${c.resultText}`}>
            <span>{t.sortBy}</span>
            <span className={`font-medium ${c.resultBold} flex items-center gap-1`}>
              {t.newestArrivals}
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </div>
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="mb-6 rounded-xl bg-red-900/30 border border-red-800 p-5 text-center">
            <p className="text-sm font-medium text-red-400">{error}</p>
          </div>
        )}

        {/* ── Loading ── */}
        {loading && products.length === 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className={`flex flex-col rounded-2xl overflow-hidden border ${c.card}`}>
                <div className="skeleton aspect-square rounded-none" />
                <div className="p-4 flex flex-col gap-3">
                  <div className="skeleton h-4 w-3/4" />
                  <div className="skeleton h-3 w-1/2" />
                  <div className="skeleton h-3 w-full" />
                  <div className="skeleton h-10 w-full mt-2 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── No Results ── */}
        {!loading && !error && products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className={`text-base font-bold mb-1 ${c.resultBold}`}>{t.noResults}</p>
            <p className={`text-sm ${c.resultText}`}>{t.tryAdjusting}</p>
          </div>
        )}

        {/* ═══════════ Product Grid ═══════════ */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
          {products.map((prod) => {
            const variantIdx = selectedVariants[prod.product_id] || 0;
            const image = getProductImage(prod, variantIdx);
            const swatches = getVariantSwatches(prod);

            return (
              <div
                key={prod.product_id}
                className={`group flex flex-col rounded-2xl overflow-hidden border transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${c.card}`}
              >
                {/* Image — click to navigate */}
                <Link to={`/product/${prod.product_id}`} className={`relative aspect-square overflow-hidden ${c.cardImageBg}`}>
                  {image ? (
                    <img
                      src={image}
                      alt={prod.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <span className={`text-sm ${c.noImage}`}>
                        {lang === "ar" ? "لا توجد صورة" : "No Image"}
                      </span>
                    </div>
                  )}

                  {/* Color dots — clicking changes variant */}
                  {swatches.length > 0 && (
                    <div
                      className="absolute bottom-3 left-3 flex gap-1.5 z-10"
                      onClick={(e) => e.preventDefault()}
                    >
                      {swatches.map((swatch, i) => (
                        <button
                          key={i}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSelectedVariants((prev) => ({
                              ...prev,
                              [prod.product_id]: i,
                            }));
                          }}
                          className={`block h-3.5 w-3.5 rounded-full border-2 transition-all ${variantIdx === i
                            ? "border-white scale-125 shadow-lg"
                            : "border-white/30 hover:border-white/60"
                            }`}
                          style={{ backgroundColor: swatch.color }}
                          title={swatch.name}
                          aria-label={`Select ${swatch.name}`}
                        />
                      ))}
                    </div>
                  )}
                </Link>

                {/* Info */}
                <div className="p-4 flex flex-col flex-1">
                  <Link to={`/product/${prod.product_id}`}>
                    <h3 className={`font-display text-sm font-bold leading-snug ${c.cardTitle}`}>
                      {prod.name}
                    </h3>
                  </Link>
                  <p className={`mt-1 text-[11px] ${c.cardSku}`}>
                    SKU: <span className="font-mono">{prod.model_sku}</span>
                  </p>
                  {prod.description && (
                    <p className={`mt-2 text-xs line-clamp-2 leading-relaxed ${c.cardDesc}`}>
                      {prod.description}
                    </p>
                  )}

                  {/* Add to Inquiry Button */}
                  <button
                    onClick={() => addToInquiry(prod, variantIdx)}
                    className={`mt-auto pt-4 flex items-center justify-center gap-2 w-full h-10 rounded-lg border text-sm font-medium transition-all duration-200 ${c.cardBtn}`}
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                    </svg>
                    {t.addToInquiry}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* ═══════════ Load More ═══════════ */}
        {products.length > 0 && page < totalPages && (
          <div className="flex justify-center mt-12">
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className={`rounded-lg border px-8 py-3 text-sm font-bold disabled:opacity-50 transition-all ${isDark
                ? "bg-[#1a2332] border-gray-700 text-gray-300 hover:text-white hover:border-gray-600"
                : "bg-white border-gray-300 text-gray-600 hover:text-gray-900 hover:border-gray-400"
                }`}
            >
              {loading ? t.loading : t.loadMore}
            </button>
          </div>
        )}
      </main>

      {/* ═══════════ Floating Inquiry Cart Bar ═══════════ */}
      <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-50">
        <Link
          to="/cart"
          className={`flex items-center justify-center sm:justify-start gap-0 rounded-full border overflow-hidden transition-all ${c.floatBg}`}
        >
          <div className={`flex items-center gap-2 px-4 sm:px-5 py-3 text-sm font-medium ${c.floatText}`}>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {t.inquiryCart} ({cartCount})
          </div>
          <div className="bg-[#0071e3] hover:bg-[#0060c0] px-4 sm:px-5 py-3 text-[11px] font-bold tracking-wider uppercase text-white transition-colors">
            {t.requestQuote}
          </div>
        </Link>
      </div>
    </div>
  );
}
