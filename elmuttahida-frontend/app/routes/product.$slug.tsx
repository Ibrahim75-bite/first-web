import { useState, useContext, useEffect } from "react";
import { Link, useNavigate, useLoaderData } from "react-router";
import type { Route } from "./+types/product.$slug";
import { LanguageContext } from "../context/LanguageContext";
import { ThemeContext } from "../context/ThemeContext";
import { fetchProductBySlug, type SupabaseProduct } from "../lib/supabase";

export async function loader({ params }: Route.LoaderArgs) {
    const slugParam = decodeURIComponent(params.slug || "").trim();
    const { product: spProduct, variants: spVariants, recommended: spRecommended } = await fetchProductBySlug(slugParam);

    if (!spProduct) {
        throw new Response("Product Not Found", { status: 404 });
    }

    const swatches = (spVariants.length > 0 ? spVariants : []).map((v, i) => {
        let hex = "#d4af37";
        if (v.color_code?.includes("BLK")) hex = "#1a1a1a";
        else if (v.color_code?.includes("SLV")) hex = "#b8b8b8";
        else if (v.color_code?.includes("BRN")) hex = "#6f4e37";
        else if (v.color_code?.includes("BUR")) hex = "#800020";
        else if (v.color_code?.includes("AMB")) hex = "#d97706";
        else if (v.color_code?.includes("PPL")) hex = "#6b21a8";

        return {
            variant_id: v.id || `v-${i}`,
            sku: v.sku,
            color: v.color_en || "White & Gold",
            color_ar: v.color_ar || "أبيض وذهبي",
            color_code: hex,
            price: v.price || spProduct.base_price,
            weight: v.weight_kg,
            height: v.height_cm,
            length: v.length_cm,
            width: v.width_cm,
            min_order_qty: 1,
            images: [
                {
                    url: v.image_url || spProduct.primary_image,
                    thumbnail: v.image_url || spProduct.primary_image,
                },
            ],
        };
    });

    const allImages = (spProduct.images && spProduct.images.length > 0)
        ? spProduct.images.map((img) => ({ url: img, thumbnail: img }))
        : [{ url: spProduct.primary_image, thumbnail: spProduct.primary_image }];

    const product = {
        _id: spProduct.id,
        product_id: spProduct.id,
        name: spProduct.name_en,
        nameAr: spProduct.name_ar,
        model_sku: spProduct.product_code,
        sku: spProduct.product_code,
        slug: spProduct.handle,
        description: spProduct.long_desc_en || spProduct.short_desc_en || "Artisan handcrafted luxury Egyptian ceramic from El-Muttahida.",
        descriptionAr: spProduct.long_desc_ar || spProduct.short_desc_ar || "تحفة خزفية وسيراميك مصري فاخر مصنوع يدوياً بأعلى معايير الإتقان.",
        material: "Egyptian Ceramic & Fine Glazed Porcelain",
        materialAr: "سيراميك مصري وبورسلين مطلي عالي النقاء",
        weight: spVariants[0]?.weight_kg || 1.8,
        height: spVariants[0]?.height_cm || 30,
        length: spVariants[0]?.length_cm || null,
        width: spVariants[0]?.width_cm || null,
        is_bundle: spProduct.is_bundle,
        bundle_pieces: spProduct.bundle_pieces || [],
        category: spProduct.category,
        base_price: spProduct.base_price,
        images: allImages,
        variants: swatches.length > 0 ? swatches : [
            {
                variant_id: "v-default",
                sku: `${spProduct.product_code}-PN01-WHT-GLD`,
                color: "White & Gold",
                color_ar: "أبيض وذهبي",
                color_code: "#d4af37",
                price: spProduct.base_price,
                min_order_qty: 1,
                images: allImages,
            },
        ],
    };

    const recommended = spRecommended.map((r) => ({
        product_id: r.id,
        slug: r.handle || r.product_code,
        name: r.name_en,
        nameAr: r.name_ar,
        model_sku: r.product_code,
        variants: [
            {
                images: [{ thumbnail: r.primary_image, url: r.primary_image }],
            },
        ],
    }));

    return { product, recommended };
}

export function meta({ data }: Route.MetaArgs) {
    const title = data?.product?.name || "Product Details";
    return [
        { title: `${title} | El-Muttahida` },
    ];
}

export default function ProductDetails() {
    const { product: initialProduct, recommended: initialRecommended } = useLoaderData<typeof loader>();
    const { lang, dir } = useContext(LanguageContext);
    const { theme } = useContext(ThemeContext);
    const isDark = theme === "dark";
    const navigate = useNavigate();

    // ── Localized State ──
    const [product, setProduct] = useState<any>(initialProduct);
    const [recommended, setRecommended] = useState<any[]>(initialRecommended);

    // Keep product updated if loader changes
    useEffect(() => {
        setProduct(initialProduct);
        setRecommended(initialRecommended);
    }, [initialProduct, initialRecommended]);

    // ── Core State ──
    const [selectedVariant, setSelectedVariant] = useState<any>(product?.variants?.[0] || null);
    const [mainImage, setMainImage] = useState<string | null>(
        product?.variants?.[0]?.images?.[0]?.url ||
        product?.variants?.[0]?.images?.[0]?.thumbnail ||
        product?.images?.[0]?.url ||
        null
    );
    const [addedToCart, setAddedToCart] = useState(false);
    const [qty, setQty] = useState(product?.variants?.[0]?.min_order_qty || 1);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // ── Sync states when product updates ──
    useEffect(() => {
        if (product) {
            let variantToSet = product.variants?.[0] || null;
            if (selectedVariant) {
                const matching = product.variants?.find((v: any) => v.variant_id === selectedVariant.variant_id);
                if (matching) variantToSet = matching;
            }
            setSelectedVariant(variantToSet);
            setQty((q: number) => (q < (variantToSet?.min_order_qty || 1) ? variantToSet?.min_order_qty : q));
        }
    }, [product]);

    // ── Sync main image when variant changes ──
    useEffect(() => {
        if (selectedVariant?.images?.length) {
            const img = selectedVariant.images[0].url || selectedVariant.images[0].thumbnail;
            setMainImage(img);
        } else if (product?.images?.length) {
            setMainImage(product.images[0].url || product.images[0]);
        }
        setAddedToCart(false);
    }, [selectedVariant, product]);

    // ── Add to Cart ──
    const handleAddToCart = () => {
        if (!product) return;
        const cartItem = {
            product_id: product.product_id || product._id,
            name: (lang === "ar" && product.nameAr) ? product.nameAr : product.name,
            model_sku: product.model_sku,
            material: (lang === "ar" && product.materialAr) ? product.materialAr : product.material,
            weight: selectedVariant?.weight || product.weight,
            height: selectedVariant?.height || product.height,
            image: mainImage,
            mainImage: mainImage,
            code: selectedVariant?.sku || product.model_sku || product.sku,
            color: selectedVariant?.color || "Standard",
            color_code: selectedVariant?.color_code,
            variant_id: selectedVariant?.variant_id,
            qty: qty,
            is_bundle: product.is_bundle,
            bundle_pieces: product.bundle_pieces || [],
        };
        const existing = JSON.parse(localStorage.getItem("elmuttahida_inquiryCart") || "[]");
        existing.push(cartItem);
        localStorage.setItem("elmuttahida_inquiryCart", JSON.stringify(existing));
        window.dispatchEvent(new Event("cartUpdated"));
        setAddedToCart(true);
    };

    if (!product) return null;

    const images = selectedVariant?.images || product.images?.map((img: any) => (typeof img === 'string' ? { url: img, thumbnail: img } : img)) || [];

    return (
        <div className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-16 py-8 pt-32" dir={dir}>
            {/* ── Breadcrumb ── */}
            <nav
                className={`text-sm font-medium mb-8 ${isDark ? "text-gray-500" : "text-gray-400"}`}
                aria-label="Breadcrumb"
            >
                <Link to="/" className="hover:text-[#0071e3] transition-colors">
                    {lang === "ar" ? "الرئيسية" : "Home"}
                </Link>
                <span className="mx-2">{dir === "rtl" ? "←" : "›"}</span>
                <Link to="/catalogue" className="hover:text-[#0071e3] transition-colors">
                    {lang === "ar" ? "الكتالوج" : "Catalogue"}
                </Link>
                <span className="mx-2">{dir === "rtl" ? "←" : "›"}</span>
                <span className={isDark ? "text-gray-300" : "text-gray-700"}>
                    {(lang === "ar" && product.nameAr) ? product.nameAr : product.name}
                </span>
            </nav>

            {/* ═══════════════ Product Section ═══════════════ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                {/* ── LEFT: Image Gallery ── */}
                <div className="flex flex-col-reverse md:flex-row gap-4">
                    {/* Thumbnails */}
                    {images.length > 1 && (
                        <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto md:max-h-[560px] md:w-24 shrink-0 no-scrollbar">
                            {images.map((img: any, index: number) => (
                                <button
                                    key={index}
                                    onClick={() => setMainImage(img.url)}
                                    className={`group relative aspect-square w-20 md:w-full shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-300 ${mainImage === img.url
                                        ? "border-[#0071e3] shadow-md scale-105"
                                        : isDark
                                            ? "border-transparent hover:border-gray-700"
                                            : "border-transparent hover:border-gray-300"
                                        }`}
                                    aria-label={`View image ${index + 1}`}
                                >
                                    <img
                                        src={img.thumbnail || img.url}
                                        alt=""
                                        loading="lazy"
                                        className="h-full w-full object-contain p-1 transition-transform duration-500 group-hover:scale-110"
                                    />
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Main Image */}
                    <div className={`relative flex-grow aspect-square rounded-3xl overflow-hidden shadow-lg border flex items-center justify-center ${isDark ? "bg-[#141e2e] border-gray-800" : "bg-[#f8f7f4] border-stone-200"}`}>
                        {mainImage ? (
                            <img
                                key={mainImage}
                                src={mainImage}
                                alt={product.name}
                                onClick={() => setIsModalOpen(true)}
                                className="h-full w-full object-contain rounded-2xl cursor-zoom-in hover:scale-[1.02] transition-transform duration-300 p-1 sm:p-2"
                            />
                        ) : (
                            <div className={`flex h-full w-full items-center justify-center ${isDark ? "bg-[#141e2e]" : "bg-gray-100"}`}>
                                <span className={`font-medium ${isDark ? "text-gray-600" : "text-gray-400"}`}>
                                    {lang === "ar" ? "لا توجد صورة" : "No Image"}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── RIGHT: Product Info ── */}
                <div className="flex flex-col gap-6">
                    {/* In Stock Badge, Bundle Badge & SKU */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold tracking-wider uppercase rounded-full border ${isDark ? "bg-green-900/30 text-green-400 border-green-800" : "bg-green-50 text-green-700 border-green-200"}`}>
                                <span className="h-2 w-2 rounded-full bg-green-500" />
                                {lang === "ar" ? "جاهز للتصدير والتصنيع B2B" : "Ready for B2B Export & Custom Orders"}
                            </span>
                            {product.is_bundle && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold tracking-wider uppercase rounded-full bg-amber-500 text-white shadow-xs">
                                    ★ {lang === "ar" ? "طقم متكامل متعدد القطع" : "Luxury Multi-Piece Set"}
                                </span>
                            )}
                        </div>
                        <span className="font-mono text-xs font-bold text-[#1152d4] dark:text-blue-400 shrink-0">
                            #{selectedVariant?.sku || product.model_sku}
                        </span>
                    </div>

                    {/* Title */}
                    <div>
                        <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-serif font-bold leading-tight ${isDark ? "text-white" : "text-gray-900"}`}>
                            {(lang === "ar" && product.nameAr) ? product.nameAr : product.name}
                        </h1>
                        {product.base_price > 0 && (
                            <p className="mt-2 text-xl font-bold text-amber-600 dark:text-amber-400">
                                {product.base_price.toLocaleString()} {lang === "ar" ? "ج.م" : "EGP"}
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <p className={`text-sm sm:text-base leading-relaxed ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                        {(lang === "ar" && product.descriptionAr) ? product.descriptionAr : product.description}
                    </p>

                    {/* ── Available Glazes/Colors ── */}
                    {product.variants && product.variants.length > 0 && (
                        <div>
                            <h3 className={`text-sm font-bold mb-3 ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                                {lang === "ar" ? "التشطيبات والألوان المتاحة" : "Available Finishes & Glazes"}
                            </h3>
                            <div className="flex gap-3 items-center">
                                {product.variants.map((variant: any, idx: number) => {
                                    const isSelected = selectedVariant?.variant_id === variant.variant_id;
                                    const circleColor = variant.color_code || "#d4af37";

                                    return (
                                        <button
                                            key={variant.variant_id || idx}
                                            onClick={() => {
                                                setSelectedVariant(variant);
                                                setQty(variant.min_order_qty || 1);
                                            }}
                                            className={`relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 ${isSelected
                                                ? `ring-2 ring-[#0071e3] ${isDark ? "ring-offset-[#101622]" : "ring-offset-white"} ring-offset-2 scale-110 shadow-sm`
                                                : "hover:scale-105"
                                                }`}
                                            aria-label={variant.color}
                                            title={lang === "ar" && variant.color_ar ? variant.color_ar : variant.color}
                                        >
                                            <span
                                                className="h-8 w-8 rounded-full border border-black/10"
                                                style={{ backgroundColor: circleColor }}
                                            />
                                        </button>
                                    );
                                })}
                                {selectedVariant?.color && (
                                    <span className={`text-xs font-bold ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                                        {lang === "ar" && selectedVariant.color_ar ? selectedVariant.color_ar : selectedVariant.color}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ── Bundle Pieces Breakdown Table (if product is a bundle) ── */}
                    {product.is_bundle && product.bundle_pieces && product.bundle_pieces.length > 0 && (
                        <div className={`rounded-2xl border overflow-hidden shadow-xs ${isDark ? "bg-[#1a2332] border-gray-800" : "bg-white border-stone-200"}`}>
                            <div className={`px-5 py-3 border-b flex items-center justify-between ${isDark ? "border-gray-800 bg-stone-900/40" : "border-stone-100 bg-amber-50/60"}`}>
                                <h3 className={`text-sm font-bold text-amber-800 dark:text-amber-300`}>
                                    {lang === "ar" ? "محتويات ومواصفات قطع الطقم" : "Bundle Pieces & Dimensions"}
                                </h3>
                                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold">
                                    {product.bundle_pieces.length} {lang === "ar" ? "قطع" : "Pieces"}
                                </span>
                            </div>
                            <div className="divide-y divide-stone-100 dark:divide-gray-800">
                                {product.bundle_pieces.map((piece: any, idx: number) => (
                                    <div key={idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm">
                                        <div className="flex items-center gap-3">
                                            <span className="h-6 w-6 rounded-full bg-[#1152d4]/10 text-[#1152d4] dark:text-blue-400 flex items-center justify-center text-xs font-bold shrink-0">
                                                P{piece.piece_number || idx + 1}
                                            </span>
                                            <span className={`font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                                                {lang === "ar" && piece.name_ar ? piece.name_ar : piece.name_en}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                                            {piece.dimensions_cm && (
                                                <span>
                                                    <strong className="text-gray-700 dark:text-gray-300">
                                                        {lang === "ar" ? "الأبعاد: " : "Dims: "}
                                                    </strong>
                                                    {piece.dimensions_cm} {lang === "ar" ? "سم" : "cm"}
                                                </span>
                                            )}
                                            {piece.weight_kg && (
                                                <span>
                                                    <strong className="text-gray-700 dark:text-gray-300">
                                                        {lang === "ar" ? "الوزن: " : "Weight: "}
                                                    </strong>
                                                    {piece.weight_kg} {lang === "ar" ? "كجم" : "kg"}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── Specifications Table ── */}
                    <div className={`rounded-2xl border overflow-hidden shadow-xs ${isDark ? "bg-[#1a2332] border-gray-800" : "bg-white border-stone-200"}`}>
                        <div className={`px-5 py-3 border-b ${isDark ? "border-gray-800" : "border-stone-100"}`}>
                            <h3 className={`text-sm font-bold ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                                {lang === "ar" ? "المواصفات الفنية" : "Technical Specifications"}
                            </h3>
                        </div>
                        <table className="w-full text-xs sm:text-sm">
                            <tbody>
                                <tr className={`border-b ${isDark ? "border-gray-800" : "border-stone-100"}`}>
                                    <td className={`px-5 py-3 font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                                        {lang === "ar" ? "المادة" : "Material"}
                                    </td>
                                    <td className={`px-5 py-3 ${dir === "rtl" ? "text-left" : "text-right"} font-bold ${isDark ? "text-gray-200" : "text-gray-900"}`}>
                                        {(lang === "ar" && product.materialAr) ? product.materialAr : product.material}
                                    </td>
                                </tr>
                                {selectedVariant?.color && (
                                    <tr className={`border-b ${isDark ? "border-gray-800" : "border-stone-100"}`}>
                                        <td className={`px-5 py-3 font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                                            {lang === "ar" ? "اللون / التشطيب" : "Finish / Glaze"}
                                        </td>
                                        <td className={`px-5 py-3 ${dir === "rtl" ? "text-left" : "text-right"} font-bold ${isDark ? "text-gray-200" : "text-gray-900"}`}>
                                            {lang === "ar" && selectedVariant.color_ar ? selectedVariant.color_ar : selectedVariant.color}
                                        </td>
                                    </tr>
                                )}
                                {(selectedVariant?.weight || product.weight) && (
                                    <tr className={`border-b ${isDark ? "border-gray-800" : "border-stone-100"}`}>
                                        <td className={`px-5 py-3 font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                                            {lang === "ar" ? "الوزن الكلي" : "Total Weight"}
                                        </td>
                                        <td className={`px-5 py-3 ${dir === "rtl" ? "text-left" : "text-right"} font-bold ${isDark ? "text-gray-200" : "text-gray-900"}`}>
                                            {selectedVariant?.weight || product.weight} {lang === "ar" ? "كجم" : "kg"}
                                        </td>
                                    </tr>
                                )}
                                {(selectedVariant?.height || product.height) && (
                                    <tr className={`${isDark ? "border-gray-800" : "border-stone-100"}`}>
                                        <td className={`px-5 py-3 font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                                            {lang === "ar" ? "الارتفاع" : "Height"}
                                        </td>
                                        <td className={`px-5 py-3 ${dir === "rtl" ? "text-left" : "text-right"} font-bold ${isDark ? "text-gray-200" : "text-gray-900"}`}>
                                            {selectedVariant?.height || product.height} {lang === "ar" ? "سم" : "cm"}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* ── Quantity + Add to Cart ── */}
                    {!addedToCart ? (
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-4">
                                <div className={`inline-flex items-center rounded-xl border overflow-hidden ${isDark ? "bg-[#1a2332] border-gray-700" : "bg-white border-stone-200"}`}>
                                    <button
                                        onClick={() => setQty((q: number) => Math.max(1, q - 1))}
                                        className={`flex h-12 w-10 items-center justify-center text-lg transition-colors ${isDark ? "text-gray-400 hover:text-white hover:bg-gray-800" : "text-gray-400 hover:text-gray-900 hover:bg-stone-100"}`}
                                        aria-label="Decrease quantity"
                                    >
                                        −
                                    </button>
                                    <input
                                        type="number"
                                        value={qty}
                                        onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                                        min={1}
                                        className={`h-12 w-14 bg-transparent text-center text-sm font-bold border-x outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${isDark ? "text-white border-gray-700" : "text-gray-900 border-stone-200"}`}
                                        aria-label="Quantity"
                                    />
                                    <button
                                        onClick={() => setQty((q: number) => q + 1)}
                                        className={`flex h-12 w-10 items-center justify-center text-lg transition-colors ${isDark ? "text-gray-400 hover:text-white hover:bg-gray-800" : "text-gray-400 hover:text-gray-900 hover:bg-stone-100"}`}
                                        aria-label="Increase quantity"
                                    >
                                        +
                                    </button>
                                </div>

                                <button
                                    onClick={handleAddToCart}
                                    className="flex-1 flex items-center justify-center gap-2 h-12 rounded-xl bg-[#1152d4] hover:bg-blue-700 text-white text-sm font-bold tracking-wide shadow-md hover:shadow-lg transition-all duration-300 active:scale-95 cursor-pointer"
                                >
                                    {lang === "ar" ? "أضف إلى سلة الاستفسار" : "ADD TO INQUIRY CART"}
                                    <span>{dir === "rtl" ? "←" : "→"}</span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            <div className={`flex items-center justify-center gap-2 rounded-xl p-4 text-sm font-bold border ${isDark ? "bg-green-900/30 text-green-400 border-green-800" : "bg-green-50 text-green-700 border-green-200"}`}>
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                {lang === "ar" ? "تمت الإضافة إلى سلة الاستفسار بنجاح!" : "Added to inquiry cart successfully!"}
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setAddedToCart(false)}
                                    className={`flex-1 h-12 rounded-xl border text-sm font-bold transition-all ${isDark ? "border-gray-700 bg-[#1a2332] text-gray-300 hover:bg-[#263548]" : "border-stone-200 bg-white text-gray-700 hover:bg-stone-100"}`}
                                >
                                    {lang === "ar" ? "أضف المزيد" : "Add More"}
                                </button>
                                <Link
                                    to="/cart"
                                    className="flex-1 flex items-center justify-center gap-2 h-12 rounded-xl bg-[#1152d4] hover:bg-blue-700 text-sm font-bold text-white shadow-md hover:shadow-lg transition-all"
                                >
                                    {lang === "ar" ? "عرض سلة الاستفسار" : "View Inquiry Cart"}
                                    <span>{lang === "ar" ? "←" : "→"}</span>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ═══════════════ Recommended Products ═══════════════ */}
            {recommended.length > 0 && (
                <section className="mt-24">
                    <div className="flex items-center justify-between mb-10 pb-4 border-b border-stone-200 dark:border-gray-800">
                        <h2 className={`font-serif text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                            {lang === "ar" ? "قطع مقترحة من نفس المجموعة" : "Coordinating Pieces From Collection"}
                        </h2>
                        <Link
                            to="/catalogue"
                            className="text-sm font-bold text-[#1152d4] hover:underline flex items-center gap-1"
                        >
                            {lang === "ar" ? "عرض الكتالوج بالكامل" : "View Entire Catalogue"}
                            <span>{lang === "ar" ? "←" : "→"}</span>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                        {recommended.map((item) => {
                            const thumb = item.variants?.[0]?.images?.[0]?.url || item.variants?.[0]?.images?.[0]?.thumbnail;

                            return (
                                <Link
                                    key={item.product_id}
                                    to={`/product/${item.slug || item.model_sku}`}
                                    className={`group flex flex-col rounded-2xl overflow-hidden border transition-all ${isDark ? "bg-[#1a2332] border-gray-800 hover:border-gray-700" : "bg-white border-stone-200 shadow-xs hover:shadow-md"}`}
                                >
                                    <div className={`relative aspect-square overflow-hidden flex items-center justify-center p-3 ${isDark ? "bg-[#141e2e]" : "bg-stone-50"}`}>
                                        {thumb ? (
                                            <img
                                                src={thumb}
                                                alt={item.name}
                                                loading="lazy"
                                                className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-gray-400">
                                                No Image
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-5 flex items-center justify-between gap-3">
                                        <div>
                                            <span className="text-[10px] font-mono font-bold text-[#1152d4] dark:text-blue-400">
                                                {item.model_sku}
                                            </span>
                                            <h4 className={`font-serif text-base font-bold group-hover:text-[#1152d4] transition-colors line-clamp-1 ${isDark ? "text-white" : "text-gray-900"}`}>
                                                {(lang === "ar" && item.nameAr) ? item.nameAr : item.name}
                                            </h4>
                                        </div>
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1152d4] text-white shadow-xs">
                                            <span>+</span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* ═══════════════ Lightbox Modal ═══════════════ */}
            {isModalOpen && mainImage && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 md:p-10 cursor-zoom-out"
                    onClick={() => setIsModalOpen(false)}
                >
                    <div className="relative max-w-5xl w-full max-h-full flex items-center justify-center">
                        <img
                            src={mainImage}
                            alt={product.name}
                            className="max-w-full max-h-[88vh] object-contain rounded-2xl shadow-2xl cursor-default"
                            onClick={(e) => e.stopPropagation()}
                        />
                        <button
                            className="absolute top-2 right-2 md:-top-8 md:-right-8 bg-black/50 hover:bg-black/70 text-white rounded-full p-2.5 backdrop-blur-md transition-colors"
                            onClick={() => setIsModalOpen(false)}
                            aria-label="Close"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
