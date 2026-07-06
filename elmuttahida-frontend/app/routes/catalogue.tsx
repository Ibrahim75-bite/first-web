import { useEffect, useState, useContext, useCallback } from "react";
import { Link, useLoaderData, useNavigate } from "react-router";
import { LanguageContext } from "../context/LanguageContext";
import { ThemeContext } from "../context/ThemeContext";
import type { Route } from "./+types/catalogue";

// ── Loader for initial SSR ──
export async function loader({ request }: Route.LoaderArgs) {
    const url = new URL(request.url);
    const search = url.searchParams.get("search") || "";
    const tags = url.searchParams.get("tags") || "";
    const page = url.searchParams.get("page") || "1";

    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    try {
        const res = await fetch(`${apiUrl}/products?search=${search}&tags=${tags}&page=${page}&limit=20`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        return { initialData: data.data || [], initialTotal: data.total || 0, initialPages: data.totalPages || 1 };
    } catch (err) {
        return { initialData: [], initialTotal: 0, initialPages: 1 };
    }
}

export function meta() {
    return [
        { title: "Vase Catalogue | El-Muttahida" },
        { name: "description", content: "Explore our premium vase collections" },
    ];
}

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
const COLLECTION_LABELS: Record<string, { en: string; ar: string }> = {
    "summer-2026": { en: "Summer 2026", ar: "صيف 2026" },
    "royal-heritage": { en: "Royal Heritage", ar: "التراث الملكي" },
    minimalist: { en: "Minimalist", ar: "بسيط" },
};

const FALLBACK_COLORS = ["#c4a35a", "#8b5e3c", "#2f4f4f", "#2c2c2c", "#f5f0e8", "#3d5a80", "#b8395a"];

export default function Catalogue() {
    const { initialData, initialTotal, initialPages } = useLoaderData<typeof loader>();
    const { lang, dir } = useContext(LanguageContext);
    const { theme } = useContext(ThemeContext);
    const navigate = useNavigate();

    const t = labels[lang] || labels.en;
    const isDark = theme === "dark";

    // ── State ──
    const [products, setProducts] = useState<any[]>(initialData);
    const [total, setTotal] = useState(initialTotal);
    const [totalPages, setTotalPages] = useState(initialPages);
    const [search, setSearch] = useState("");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [cartCount, setCartCount] = useState(0);

    const [selectedVariants, setSelectedVariants] = useState<Record<string, number>>({});
    const [openSections, setOpenSections] = useState({ collections: true, style: true });

    const toggleSection = (key: keyof typeof openSections) =>
        setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

    // ── Cart count ──
    const refreshCartCount = useCallback(() => {
        try {
            const cart = JSON.parse(localStorage.getItem("elmuttahida_inquiryCart") || "[]");
            setCartCount(cart.length);
        } catch {
            setCartCount(0);
        }
    }, []);

    useEffect(() => {
        refreshCartCount();
    }, [refreshCartCount]);

    // ── Fetch Products Manually (Client Side override) ──
    const fetchProducts = useCallback(
        async (currentPage: number, append = false) => {
            try {
                setLoading(true);
                setError(null);
                const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
                const querySearch = search.trim() ? `&search=${encodeURIComponent(search.trim())}` : "";
                const queryTags = selectedTags.length ? `&tags=${encodeURIComponent(selectedTags.join(","))}` : "";

                const res = await fetch(`${apiUrl}/products?lang=${lang}&page=${currentPage}&limit=20${querySearch}${queryTags}`);
                if (!res.ok) throw new Error("Fetch failed");

                const data = await res.json();
                const newProducts = data.data || [];

                if (append) {
                    setProducts((prev) => [...prev, ...newProducts]);
                } else {
                    setProducts(newProducts);
                }
                setTotal(data.total || 0);
                setTotalPages(data.totalPages || 1);
            } catch (err) {
                console.error("Catalogue fetch error", err);
                setError(t.errorMessage);
            } finally {
                setLoading(false);
            }
        },
        [lang, search, selectedTags, t.errorMessage]
    );

    // Re-fetch when filters change (ignoring page 1 initial hydration if possible)
    useEffect(() => {
        // Only re-fetch if not using initial data logic immediately
        setPage(1);
        fetchProducts(1, false);
    }, [search, selectedTags, lang, fetchProducts]);

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchProducts(nextPage, true);
    };

    const toggleTag = (tag: string) => {
        setSelectedTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        );
    };

    // ── Add to Inquiry ──
    const addToInquiry = (prod: any, variantIdx: number) => {
        const variant = prod.variants?.[variantIdx || 0];
        const cartItem = {
            id: prod._id || prod.product_id, // Normalize id depending on API structure
            name: lang === "ar" && prod.nameAr ? prod.nameAr : prod.name,
            model_sku: prod.model_sku,
            image: variant?.images?.[0]?.thumbnail || variant?.images?.[0]?.url || prod.images?.[0] || null,
            mainImage: variant?.images?.[0]?.url || variant?.images?.[0]?.thumbnail || prod.images?.[0] || null,
            code: variant?.sku || prod.model_sku,
            color: variant?.color || prod.colors?.[0],
            finish: variant?.finish || "Standard",
            slug: prod.slug,
            qty: variant?.min_order_qty || 1,
        };
        const existing = JSON.parse(localStorage.getItem("elmuttahida_inquiryCart") || "[]");
        existing.push(cartItem);
        localStorage.setItem("elmuttahida_inquiryCart", JSON.stringify(existing));
        refreshCartCount();
        alert(lang === "ar" ? `تمت إضافة المُنْتَج بنجاح!` : `Added to inquiry cart successfully!`);
    };

    // ── Helpers ──
    const getProductImage = (prod: any, variantIdx: number) => {
        const v = prod.variants?.[variantIdx || 0];
        return v?.images?.[0]?.thumbnail || v?.images?.[0]?.url || prod.images?.[0];
    };

    const getVariantSwatches = (prod: any) => {
        if (prod.variants?.length > 0) {
            return prod.variants.map((v: any, i: number) => ({
                color: v.color_code || FALLBACK_COLORS[i % FALLBACK_COLORS.length],
                name: v.color || `Variant ${i + 1}`,
            }));
        } else if (prod.colors?.length > 0) {
            return prod.colors.map((c: string, i: number) => ({
                color: c,
                name: c
            }));
        }
        return [];
    };

    // ── Chevron SVG ──
    const Chevron = ({ open }: { open: boolean }) => (
        <svg className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""} ${isDark ? "text-gray-400" : "text-gray-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
    );

    // ── Theme classes ──
    const c = {
        bg: "bg-surface-50 dark:bg-[#101622]",
        sidebar: isDark ? "bg-[#101622] border-gray-800" : "bg-white border-gray-200",
        input: isDark ? "bg-[#1a2332] text-gray-200 placeholder:text-gray-500 border-gray-700" : "bg-gray-50 text-gray-800 placeholder:text-gray-400 border-gray-200",
        sectionTitle: isDark ? "text-gray-300" : "text-gray-700",
        checkbox: isDark ? "border-gray-600 bg-[#1a2332]" : "border-gray-300 bg-white",
        checkboxLabel: isDark ? "text-gray-400" : "text-gray-600",
        divider: isDark ? "border-gray-800" : "border-gray-200",
        card: isDark ? "bg-[#1a2332] border-gray-800/50 hover:border-gray-700" : "bg-white border-gray-200 hover:border-gray-300 shadow-sm",
        cardImageBg: isDark ? "bg-[#141e2e]" : "bg-gray-100",
        cardTitle: isDark ? "text-white" : "text-gray-900",
        cardDesc: isDark ? "text-gray-500" : "text-gray-500",
        cardBtn: isDark ? "border-gray-700 bg-[#1f2b3d] hover:bg-[#263548] text-white" : "border-gray-200 bg-white hover:bg-gray-50 text-gray-900",
        banner: isDark ? "bg-[#1a2332]" : "bg-gradient-to-r from-primary-dark to-primary",
    };

    return (
        <div className={`flex min-h-screen pt-20 ${c.bg} transition-colors duration-300`} dir={dir}>
            <aside className={`hidden md:flex w-56 lg:w-64 shrink-0 flex-col gap-6 border-r ${c.sidebar} p-6 transition-colors duration-300`}>
                <div className="relative">
                    <svg className={`absolute ${dir === "rtl" ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={t.searchPlaceholder}
                        className={`w-full h-10 ${dir === "rtl" ? "pr-9 pl-3" : "pl-9 pr-3"} rounded-lg text-sm outline-none border transition-colors ${c.input}`}
                    />
                </div>

                <div>
                    <button onClick={() => toggleSection("collections")} className={`flex w-full items-center justify-between py-2 text-[11px] font-bold tracking-widest uppercase ${c.sectionTitle}`}>
                        {t.collections} <Chevron open={openSections.collections} />
                    </button>
                    {openSections.collections && (
                        <div className="mt-2 space-y-2.5">
                            {COLLECTION_TAGS.map((tag) => (
                                <label key={tag} className="flex items-center gap-2.5 cursor-pointer group">
                                    <input type="checkbox" checked={selectedTags.includes(tag)} onChange={() => toggleTag(tag)} className={`h-4 w-4 rounded cursor-pointer ${c.checkbox}`} />
                                    <span className={`text-sm ${c.checkboxLabel}`}>{COLLECTION_LABELS[tag]?.[lang] || tag}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                <div className={`border-t pt-4 ${c.divider}`}>
                    <button onClick={() => toggleSection("style")} className={`flex w-full items-center justify-between py-2 text-[11px] font-bold tracking-widest uppercase ${c.sectionTitle}`}>
                        {t.styleMaterial} <Chevron open={openSections.style} />
                    </button>
                    {openSections.style && (
                        <div className="mt-2 space-y-2.5">
                            {STYLE_TAGS.map((tag) => (
                                <label key={tag} className="flex items-center gap-2.5 cursor-pointer group">
                                    <input type="checkbox" checked={selectedTags.includes(tag)} onChange={() => toggleTag(tag)} className={`h-4 w-4 rounded cursor-pointer ${c.checkbox}`} />
                                    <span className={`text-sm capitalize ${c.checkboxLabel}`}>{tag}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>
            </aside>

            <main className="flex-grow p-4 sm:p-6 lg:p-8 pb-28 mb-32">
                <div className={`mb-8 rounded-2xl overflow-hidden relative h-48 ${c.banner}`}>
                    <div className="absolute inset-0 bg-black/40 z-10" />
                    <div className="relative z-20 h-full flex flex-col justify-center px-10">
                        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary-200 mb-2">{t.heroBanner}</span>
                        <h1 className="font-serif text-3xl font-bold text-white mb-2">{t.heroTitle}</h1>
                        <p className="text-sm text-gray-300 max-w-md">{t.heroDescription}</p>
                    </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                    <p className="text-sm text-gray-500">
                        {t.showing} <span className="font-medium text-gray-900 dark:text-white">{products.length}</span> {t.of} <span className="font-medium text-gray-900 dark:text-white">{total}</span> {t.products}
                    </p>
                </div>

                {error && <div className="mb-6 bg-red-100 text-red-600 p-4 rounded-xl">{error}</div>}

                {!loading && !error && products.length === 0 && (
                    <div className="py-20 text-center">
                        <p className="font-bold mb-1 dark:text-white">{t.noResults}</p>
                        <p className="text-sm text-gray-500">{t.tryAdjusting}</p>
                    </div>
                )}

                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {products.map((prod) => {
                        const variantIdx = selectedVariants[prod._id || prod.product_id] || 0;
                        const image = getProductImage(prod, variantIdx);
                        const swatches = getVariantSwatches(prod);

                        return (
                            <div key={prod._id || prod.product_id} className={`group flex flex-col rounded-2xl overflow-hidden border transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${c.card}`}>
                                <div onClick={() => navigate(`/product/${(prod.slug && prod.slug !== 'null') ? prod.slug : (prod.product_id || prod._id)}`)} className={`relative aspect-square overflow-hidden cursor-pointer ${c.cardImageBg}`}>
                                    {image ? (
                                        <img src={image} alt={prod.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">No Image</div>
                                    )}
                                    {swatches.length > 0 && (
                                        <div className="absolute bottom-3 left-3 flex gap-1.5 z-10" onClick={(e) => e.stopPropagation()}>
                                            {swatches.map((swatch: any, i: number) => (
                                                <button key={i} onClick={() => setSelectedVariants(p => ({ ...p, [prod._id || prod.product_id]: i }))} className={`h-4 w-4 rounded-full border-2 ${variantIdx === i ? "border-white scale-125" : "border-white/50"}`} style={{ backgroundColor: swatch.color }} title={swatch.name} />
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="p-4 flex flex-col flex-1">
                                    <h3 className={`font-serif text-lg font-bold ${c.cardTitle}`}>{lang === "ar" && prod.nameAr ? prod.nameAr : prod.name}</h3>
                                    <p className={`mt-1 text-xs ${c.cardDesc}`}>SKU: {prod.model_sku || prod.slug}</p>

                                    <button onClick={() => addToInquiry(prod, variantIdx)} className={`mt-auto mt-4 flex items-center justify-center gap-2 w-full h-10 rounded-lg border text-sm font-medium transition-all ${c.cardBtn}`}>
                                        {t.addToInquiry}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {products.length > 0 && page < totalPages && (
                    <div className="flex justify-center mt-12">
                        <button onClick={handleLoadMore} disabled={loading} className="rounded-lg border px-8 py-3 text-sm font-bold bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                            {loading ? t.loading : t.loadMore}
                        </button>
                    </div>
                )}
            </main>

            {/* Floating Inquiry Cart Bar */}
            <div className="fixed bottom-6 w-full px-6 flex justify-end pointer-events-none z-50">
                <Link to="/cart" className="pointer-events-auto flex items-center gap-2 bg-gray-900/90 dark:bg-gray-100/90 backdrop-blur-md px-6 py-4 rounded-full shadow-2xl text-white dark:text-gray-900 hover:-translate-y-1 transition-transform">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <span className="font-bold">{t.inquiryCart} ({cartCount})</span>
                </Link>
            </div>
        </div>
    );
}
