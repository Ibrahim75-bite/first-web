import { useEffect, useState, useContext, useCallback } from "react";
import { Link, useLoaderData, useNavigate } from "react-router";
import { LanguageContext } from "../context/LanguageContext";
import { ThemeContext } from "../context/ThemeContext";
import type { Route } from "./+types/catalogue";
import { fetchProducts as fetchSupabaseProducts, type SupabaseProduct } from "../lib/supabase";

function mapProductToUI(p: SupabaseProduct) {
    const swatches = (p.product_variants || []).map((v, i) => {
        let hex = "#d4af37";
        if (v.color_code?.includes("BLK")) hex = "#1a1a1a";
        else if (v.color_code?.includes("SLV")) hex = "#b8b8b8";
        else if (v.color_code?.includes("BRN")) hex = "#6f4e37";
        else if (v.color_code?.includes("BUR")) hex = "#800020";
        else if (v.color_code?.includes("AMB")) hex = "#d97706";
        else if (v.color_code?.includes("PPL")) hex = "#6b21a8";
        return {
            color: hex,
            name: v.color_en || `Finish ${i + 1}`,
            name_ar: v.color_ar,
            sku: v.sku,
            image: v.image_url || p.primary_image,
        };
    });

    return {
        _id: p.id,
        product_id: p.id,
        name: p.name_en,
        nameAr: p.name_ar,
        model_sku: p.product_code,
        slug: p.handle || p.product_code,
        images: p.images && p.images.length > 0 ? p.images : [p.primary_image],
        category: p.category,
        is_bundle: p.is_bundle,
        bundle_pieces: p.bundle_pieces || [],
        base_price: p.base_price,
        variants: swatches.length > 0 ? swatches : [
            {
                color: "#d4af37",
                name: "White & Gold",
                name_ar: "أبيض وذهبي",
                sku: `${p.product_code}-PN01-WHT-GLD`,
                image: p.primary_image,
            },
        ],
    };
}

// ── Loader for initial SSR ──
export async function loader({ request }: Route.LoaderArgs) {
    const url = new URL(request.url);
    const search = url.searchParams.get("search") || "";
    const category = url.searchParams.get("category") || "";
    const page = parseInt(url.searchParams.get("page") || "1", 10);

    try {
        const result = await fetchSupabaseProducts({
            search,
            category: category || undefined,
            page,
            limit: 24,
        });
        return {
            initialData: result.data.map(mapProductToUI),
            initialTotal: result.total,
            initialPages: result.totalPages,
        };
    } catch (err) {
        console.error("Loader fetch error:", err);
        return { initialData: [], initialTotal: 0, initialPages: 1 };
    }
}

export function meta() {
    return [
        { title: "Master Catalogue | El-Muttahida" },
        { name: "description", content: "Explore our premium Egyptian ceramic vase collections and master pottery" },
    ];
}

// ── Labels ──
const labels = {
    en: {
        searchPlaceholder: "Search SKU or product name...",
        categories: "PRODUCT CATEGORIES",
        allCategories: "All Products",
        showing: "Showing",
        of: "of",
        products: "products",
        sortBy: "Sort by:",
        newestArrivals: "Newest Arrivals",
        noResults: "No products found matching your criteria.",
        tryAdjusting: "Try adjusting your search or category filter.",
        loadMore: "Load More",
        loading: "Loading...",
        addToInquiry: "Add to Inquiry",
        errorMessage: "Failed to load products. Please try again.",
        heroBanner: "SUMMER 2026 MASTER CATALOGUE",
        heroTitle: "Egyptian Ceramic Mastery",
        heroDescription: "Explore our full master catalog of 38 exquisite handcrafted ceramic vases, multi-piece bundles, and luxury decorative accents.",
        inquiryCart: "Inquiry Cart",
        requestQuote: "REQUEST QUOTE",
        bundleBadge: "Luxury Bundle",
    },
    ar: {
        searchPlaceholder: "بحث برمز SKU أو اسم المنتج...",
        categories: "أقسام الكتالوج",
        allCategories: "جميع المنتجات",
        showing: "عرض",
        of: "من",
        products: "منتج",
        sortBy: "ترتيب حسب:",
        newestArrivals: "أحدث الوصولات",
        noResults: "لم يتم العثور على منتجات.",
        tryAdjusting: "جرب تعديل البحث أو اختيار قسم آخر.",
        loadMore: "تحميل المزيد",
        loading: "جارٍ التحميل...",
        addToInquiry: "إضافة للاستفسار",
        errorMessage: "فشل تحميل المنتجات.",
        heroBanner: "الكتالوج الشامل لصيف 2026",
        heroTitle: "أصالة الخزف المصري",
        heroDescription: "استكشف كتالوجنا الكامل المكون من 38 تحفة خزفية مصرية تضم أطقم متعددة القطع، مزهريات راقية، وصحون تقديم ملكية.",
        inquiryCart: "سلة الاستفسار",
        requestQuote: "طلب عرض أسعار",
        bundleBadge: "طقم متكامل",
    },
};

const CATEGORIES = [
    { key: "", en: "All Products", ar: "جميع المنتجات" },
    { key: "Multi-Piece Sets & Bundles", en: "Multi-Piece Sets & Bundles", ar: "أطقم ومجموعات متكاملة" },
    { key: "Single Vases & Planters", en: "Single Vases & Planters", ar: "مزهريات مفردة" },
    { key: "Plates & Centerpieces", en: "Plates & Centerpieces", ar: "صحون ومراكز طاولة" },
    { key: "Modern Sculptures & Décor", en: "Modern Sculptures & Décor", ar: "منحوتات ومجسمات عصرية" },
];

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
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [cartCount, setCartCount] = useState(0);

    const [selectedVariants, setSelectedVariants] = useState<Record<string, number>>({});

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

    // ── Fetch Products (Client Side via Supabase) ──
    const loadProducts = useCallback(
        async (currentPage: number, append = false) => {
            try {
                setLoading(true);
                setError(null);
                const result = await fetchSupabaseProducts({
                    search: search.trim() || undefined,
                    category: selectedCategory || undefined,
                    page: currentPage,
                    limit: 24,
                });

                const mapped = result.data.map(mapProductToUI);

                if (append) {
                    setProducts((prev) => [...prev, ...mapped]);
                } else {
                    setProducts(mapped);
                }
                setTotal(result.total);
                setTotalPages(result.totalPages);
            } catch (err) {
                console.error("Catalogue fetch error", err);
                setError(t.errorMessage);
            } finally {
                setLoading(false);
            }
        },
        [search, selectedCategory, t.errorMessage]
    );

    // Re-fetch when search or category changes
    useEffect(() => {
        setPage(1);
        loadProducts(1, false);
    }, [search, selectedCategory, loadProducts]);

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        loadProducts(nextPage, true);
    };

    // ── Add to Inquiry ──
    const addToInquiry = (prod: any, variantIdx: number) => {
        const variant = prod.variants?.[variantIdx || 0];
        const cartItem = {
            id: prod._id || prod.product_id,
            name: lang === "ar" && prod.nameAr ? prod.nameAr : prod.name,
            model_sku: prod.model_sku,
            image: variant?.image || prod.images?.[0] || null,
            mainImage: variant?.image || prod.images?.[0] || null,
            code: variant?.sku || prod.model_sku,
            color: variant?.name || "Standard",
            finish: variant?.name || "Standard",
            slug: prod.slug,
            qty: 1,
            is_bundle: prod.is_bundle,
            bundle_pieces: prod.bundle_pieces || [],
        };
        const existing = JSON.parse(localStorage.getItem("elmuttahida_inquiryCart") || "[]");
        existing.push(cartItem);
        localStorage.setItem("elmuttahida_inquiryCart", JSON.stringify(existing));
        refreshCartCount();
        alert(lang === "ar" ? `تمت إضافة ${cartItem.name} إلى سلة الاستفسار بنجاح!` : `Added ${cartItem.name} to inquiry cart successfully!`);
    };

    const getProductImage = (prod: any, variantIdx: number) => {
        const v = prod.variants?.[variantIdx || 0];
        return v?.image || prod.images?.[0];
    };

    const formatPrice = (price: number) => {
        if (!price) return "";
        return `${price.toLocaleString()} ${lang === "ar" ? "ج.م" : "EGP"}`;
    };

    // ── Theme classes ──
    const c = {
        bg: "bg-[#fbfaf8] dark:bg-[#101622]",
        sidebar: isDark ? "bg-[#101622] border-gray-800" : "bg-white border-gray-200",
        input: isDark ? "bg-[#1a2332] text-gray-200 placeholder:text-gray-500 border-gray-700" : "bg-gray-50 text-gray-800 placeholder:text-gray-400 border-gray-200",
        sectionTitle: isDark ? "text-gray-300" : "text-gray-700",
        card: isDark ? "bg-[#1a2332] border-gray-800/60 hover:border-gray-700" : "bg-white border-gray-200/80 hover:border-gray-300 shadow-sm",
        cardImageBg: isDark ? "bg-[#141e2e]" : "bg-stone-50",
        cardTitle: isDark ? "text-white" : "text-gray-900",
        cardDesc: isDark ? "text-gray-400" : "text-gray-500",
        cardBtn: isDark ? "border-gray-700 bg-[#1f2b3d] hover:bg-[#263548] text-white" : "border-gray-200 bg-white hover:bg-stone-50 text-gray-900",
        banner: isDark ? "bg-[#1a2332]" : "bg-gradient-to-r from-stone-900 via-stone-800 to-amber-950",
    };

    return (
        <div className={`flex min-h-screen pt-20 ${c.bg} transition-colors duration-300`} dir={dir}>
            {/* Sidebar */}
            <aside className={`hidden md:flex w-64 lg:w-72 shrink-0 flex-col gap-6 border-r ${c.sidebar} p-6 transition-colors duration-300`}>
                <div className="relative">
                    <svg className={`absolute ${dir === "rtl" ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={t.searchPlaceholder}
                        className={`w-full h-11 ${dir === "rtl" ? "pr-9 pl-3" : "pl-9 pr-3"} rounded-xl text-sm outline-none border transition-colors ${c.input}`}
                    />
                </div>

                <div>
                    <h3 className={`text-[11px] font-bold tracking-widest uppercase mb-3 ${c.sectionTitle}`}>
                        {t.categories}
                    </h3>
                    <div className="space-y-1.5">
                        {CATEGORIES.map((cat) => {
                            const isSelected = selectedCategory === cat.key;
                            return (
                                <button
                                    key={cat.key}
                                    onClick={() => setSelectedCategory(cat.key)}
                                    className={`w-full text-left flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                        isSelected
                                            ? "bg-[#1152d4] text-white shadow-sm"
                                            : isDark
                                            ? "text-gray-400 hover:bg-gray-800/50 hover:text-white"
                                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                    }`}
                                >
                                    <span>{lang === "ar" ? cat.ar : cat.en}</span>
                                    {isSelected && (
                                        <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">✓</span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Quick Info box */}
                <div className={`mt-auto p-4 rounded-xl border text-xs ${isDark ? "bg-[#151c28] border-gray-800 text-gray-400" : "bg-stone-50 border-stone-200 text-stone-600"}`}>
                    <div className="font-bold text-sm mb-1 text-gray-900 dark:text-white">
                        {lang === "ar" ? "تصنيع وتصدير B2B" : "Wholesale & Custom Export"}
                    </div>
                    <p className="leading-relaxed">
                        {lang === "ar"
                            ? "جميع الموديلات متوفرة للطلبيات المخصصة وتصدير الفنادق والمشاريع المعمارية."
                            : "Available for hospitality contracts, architectural projects, and bespoke corporate orders."}
                    </p>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-grow p-4 sm:p-6 lg:p-8 pb-28 mb-32">
                {/* Hero Banner */}
                <div className={`mb-8 rounded-2xl overflow-hidden relative h-52 shadow-md ${c.banner}`}>
                    <div className="absolute inset-0 bg-black/40 z-10" />
                    <div className="relative z-20 h-full flex flex-col justify-center px-6 sm:px-10">
                        <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-amber-300 mb-2">
                            {t.heroBanner}
                        </span>
                        <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                            {t.heroTitle}
                        </h1>
                        <p className="text-xs sm:text-sm text-gray-200 max-w-xl leading-relaxed">
                            {t.heroDescription}
                        </p>
                    </div>
                </div>

                {/* Counter bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-200 dark:border-gray-800">
                    <p className="text-sm text-gray-500">
                        {t.showing} <span className="font-bold text-gray-900 dark:text-white">{products.length}</span> {t.of}{" "}
                        <span className="font-bold text-gray-900 dark:text-white">{total}</span> {t.products}
                    </p>

                    {/* Mobile category pills */}
                    <div className="flex md:hidden gap-2 overflow-x-auto pb-1">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat.key}
                                onClick={() => setSelectedCategory(cat.key)}
                                className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap font-medium transition-colors ${
                                    selectedCategory === cat.key
                                        ? "bg-[#1152d4] text-white"
                                        : isDark
                                        ? "bg-gray-800 text-gray-300"
                                        : "bg-gray-200 text-gray-700"
                                }`}
                            >
                                {lang === "ar" ? cat.ar : cat.en}
                            </button>
                        ))}
                    </div>
                </div>

                {error && <div className="mb-6 bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm">{error}</div>}

                {!loading && !error && products.length === 0 && (
                    <div className="py-20 text-center">
                        <p className="font-bold text-lg mb-1 dark:text-white">{t.noResults}</p>
                        <p className="text-sm text-gray-500">{t.tryAdjusting}</p>
                    </div>
                )}

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((prod) => {
                        const variantIdx = selectedVariants[prod._id || prod.product_id] || 0;
                        const image = getProductImage(prod, variantIdx);
                        const swatches = prod.variants || [];

                        return (
                            <div
                                key={prod._id || prod.product_id}
                                className={`group flex flex-col rounded-2xl overflow-hidden border transition-all duration-300 hover:scale-[1.01] hover:shadow-xl ${c.card}`}
                            >
                                <div
                                    onClick={() => navigate(`/product/${prod.slug || prod.model_sku}`)}
                                    className={`relative aspect-square overflow-hidden cursor-pointer ${c.cardImageBg}`}
                                >
                                    {image ? (
                                        <img
                                            src={image}
                                            alt={prod.name}
                                            loading="lazy"
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
                                            No Image
                                        </div>
                                    )}

                                    {/* Bundle Pill Badge */}
                                    {prod.is_bundle && (
                                        <div className="absolute top-3 right-3 z-10">
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-amber-500/90 backdrop-blur-xs text-white shadow-xs">
                                                ★ {t.bundleBadge}
                                            </span>
                                        </div>
                                    )}

                                    {/* Swatches */}
                                    {swatches.length > 1 && (
                                        <div
                                            className="absolute bottom-3 left-3 flex gap-1.5 z-10 bg-black/40 backdrop-blur-xs px-2 py-1 rounded-full"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {swatches.map((swatch: any, i: number) => (
                                                <button
                                                    key={i}
                                                    onClick={() =>
                                                        setSelectedVariants((p) => ({
                                                            ...p,
                                                            [prod._id || prod.product_id]: i,
                                                        }))
                                                    }
                                                    className={`h-4 w-4 rounded-full border-2 transition-transform ${
                                                        variantIdx === i
                                                            ? "border-white scale-125 shadow-xs"
                                                            : "border-white/50 hover:scale-110"
                                                    }`}
                                                    style={{ backgroundColor: swatch.color }}
                                                    title={lang === "ar" && swatch.name_ar ? swatch.name_ar : swatch.name}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="p-4 flex flex-col flex-1">
                                    <div className="flex items-center justify-between gap-2 mb-1.5">
                                        <span className="font-mono text-[11px] font-bold text-[#1152d4] dark:text-blue-400">
                                            {prod.model_sku}
                                        </span>
                                        <span className="text-xs font-semibold text-gray-900 dark:text-white">
                                            {formatPrice(prod.base_price)}
                                        </span>
                                    </div>

                                    <h3
                                        onClick={() => navigate(`/product/${prod.slug || prod.model_sku}`)}
                                        className={`font-serif text-base font-bold line-clamp-1 cursor-pointer hover:text-[#1152d4] transition-colors ${c.cardTitle}`}
                                    >
                                        {lang === "ar" && prod.nameAr ? prod.nameAr : prod.name}
                                    </h3>

                                    {prod.is_bundle && prod.bundle_pieces?.length > 0 && (
                                        <p className="text-[11px] text-amber-700 dark:text-amber-400/90 mt-1 line-clamp-1">
                                            {lang === "ar"
                                                ? `طقم ${prod.bundle_pieces.length} قطع: ${prod.bundle_pieces.map((p: any) => p.name_ar || p.name_en).join(" + ")}`
                                                : `Includes ${prod.bundle_pieces.length} pcs: ${prod.bundle_pieces.map((p: any) => p.name_en).join(" + ")}`}
                                        </p>
                                    )}

                                    <button
                                        onClick={() => addToInquiry(prod, variantIdx)}
                                        className={`mt-4 flex items-center justify-center gap-2 w-full h-10 rounded-xl border text-xs font-bold transition-all shadow-2xs hover:shadow-xs active:scale-95 ${c.cardBtn}`}
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                        </svg>
                                        <span>{t.addToInquiry}</span>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Load More Button */}
                {products.length > 0 && page < totalPages && (
                    <div className="flex justify-center mt-12">
                        <button
                            onClick={handleLoadMore}
                            disabled={loading}
                            className="rounded-xl border px-8 py-3 text-sm font-bold bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-xs hover:shadow-md transition-all active:scale-95"
                        >
                            {loading ? t.loading : t.loadMore}
                        </button>
                    </div>
                )}
            </main>

            {/* Floating Inquiry Cart Bar */}
            <div className="fixed bottom-6 w-full px-6 flex justify-end pointer-events-none z-50">
                <Link
                    to="/cart"
                    className="pointer-events-auto flex items-center gap-3 bg-stone-900/95 dark:bg-stone-100/95 backdrop-blur-md px-6 py-3.5 rounded-full shadow-2xl text-white dark:text-stone-900 hover:-translate-y-1 transition-transform"
                >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <span className="font-bold text-sm">
                        {t.inquiryCart} ({cartCount})
                    </span>
                </Link>
            </div>
        </div>
    );
}
