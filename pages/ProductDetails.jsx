import { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { LanguageContext } from "../context/LanguageContext";
import { ThemeContext } from "../context/ThemeContext";

export default function ProductDetails() {
  const { slug } = useParams();
  const { lang } = useContext(LanguageContext);
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";
  const navigate = useNavigate();

  // ── Core State ──
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [addedToCart, setAddedToCart] = useState(false);
  const [qty, setQty] = useState(1);

  // ── 1. Fetch Product ──
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const res = await api.get(`/products/${slug}`, {
          params: { lang },
        });
        setProduct(res.data);
        const firstVariant = res.data.variants?.[0] || null;
        setSelectedVariant(firstVariant);
        setQty(firstVariant?.min_order_qty || 1);
      } catch (err) {
        console.error("Failed to fetch product", err);
      }
    };
    if (slug) loadProduct();
  }, [slug, lang]);

  // ── Sync main image when variant changes ──
  useEffect(() => {
    if (selectedVariant?.images?.length) {
      setMainImage(selectedVariant.images[0].url);
    } else {
      setMainImage(null);
    }
    setAddedToCart(false);
  }, [selectedVariant]);

  // ── Load tag-based recommended products ──
  useEffect(() => {
    const loadRecommended = async () => {
      if (!product?.tags?.length) return;
      try {
        const tagSlugs = product.tags.map((t) => t.slug).join(",");
        const res = await api.get("/products", {
          params: { lang, tags: tagSlugs, limit: 4 },
        });
        const allProducts = Array.isArray(res.data)
          ? res.data
          : res.data.data || [];
        const filtered = allProducts.filter(
          (p) => p.product_id !== product.product_id
        );
        setRecommended(filtered.slice(0, 3));
      } catch (err) {
        console.error("Failed to fetch recommended products", err);
      }
    };
    loadRecommended();
  }, [product, lang]);

  // ── Add to Cart ──
  const handleAddToCart = () => {
    const cartItem = {
      product_id: product.product_id,
      name: product.name,
      model_sku: product.model_sku,
      material: product.material,
      weight: product.weight,
      height: product.height,
      image:
        selectedVariant?.images?.[0]?.thumbnail ||
        selectedVariant?.images?.[0]?.url ||
        null,
      mainImage:
        selectedVariant?.images?.[0]?.url ||
        selectedVariant?.images?.[0]?.thumbnail ||
        null,
      code: selectedVariant?.sku || product.model_sku,
      color: selectedVariant?.color,
      color_code: selectedVariant?.color_code,
      variant_id: selectedVariant?.variant_id,
      qty: qty,
    };
    const existing = JSON.parse(localStorage.getItem("inquiryCart") || "[]");
    existing.push(cartItem);
    localStorage.setItem("inquiryCart", JSON.stringify(existing));
    setAddedToCart(true);
  };

  // ── Loading Guard ──
  if (!product) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-700 border-t-[#0071e3]" />
          <p className={`text-sm font-medium ${isDark ? "text-gray-500" : "text-gray-400"}`}>
            {lang === "ar" ? "جارٍ التحميل..." : "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  const images = selectedVariant?.images || [];
  const fallbackColors = [
    "#c4a35a",
    "#8b5e3c",
    "#2f4f4f",
    "#2c2c2c",
    "#f5f0e8",
    "#3d5a80",
    "#b8395a",
  ];

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-16 py-8">
      {/* ── Breadcrumb ── */}
      <nav
        className={`text-sm font-medium mb-8 ${isDark ? "text-gray-500" : "text-gray-400"}`}
        aria-label="Breadcrumb"
      >
        <Link to="/" className="hover:text-[#0071e3] transition-colors">
          {lang === "ar" ? "الرئيسية" : "Home"}
        </Link>
        <span className="mx-2">›</span>
        <Link to="/catalogue" className="hover:text-[#0071e3] transition-colors">
          {lang === "ar" ? "الكتالوج" : "Catalogue"}
        </Link>
        <span className="mx-2">›</span>
        <span className={isDark ? "text-gray-300" : "text-gray-700"}>{product.name}</span>
      </nav>

      {/* ═══════════════ Product Section ═══════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        {/* ── LEFT: Image Gallery ── */}
        <div className="flex flex-col-reverse md:flex-row gap-4">
          {/* Thumbnails */}
          <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto md:max-h-[560px] md:w-24 shrink-0 no-scrollbar">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => setMainImage(img.url)}
                className={`group relative aspect-square w-20 md:w-full shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-300 ${mainImage === img.url
                  ? "border-[#0071e3] shadow-md"
                  : isDark ? "border-transparent hover:border-gray-700" : "border-transparent hover:border-gray-300"
                  }`}
                aria-label={`View image ${index + 1}`}
              >
                <img
                  src={img.thumbnail || img.url}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </button>
            ))}
          </div>

          {/* Main Image */}
          <div className={`relative flex-grow aspect-square rounded-3xl overflow-hidden shadow-lg ${isDark ? "bg-[#1a2332]" : "bg-[#f0ece4]"}`}>
            {mainImage ? (
              <img
                key={mainImage}
                src={mainImage}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className={`flex h-full w-full items-center justify-center ${isDark ? "bg-[#1a2332]" : "bg-gray-100"}`}>
                <span className={`font-medium ${isDark ? "text-gray-600" : "text-gray-400"}`}>
                  {lang === "ar" ? "لا توجد صورة" : "No Image"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT: Product Info ── */}
        <div className="flex flex-col gap-6">
          {/* In Stock Badge */}
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold tracking-wider uppercase rounded-full border ${isDark ? "bg-green-900/30 text-green-400 border-green-800" : "bg-green-50 text-green-600 border-green-200"
              }`}>
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              {lang === "ar" ? "متوفر" : "In Stock"}
            </span>
          </div>

          {/* Title + SKU */}
          <div>
            <h1 className={`text-3xl md:text-4xl font-display font-bold leading-tight ${isDark ? "text-white" : "text-gray-900"}`}>
              {product.name}
            </h1>
            <p className="mt-2 text-sm font-medium text-[#0071e3]">
              {lang === "ar" ? "البند" : "ITEM"} #{product.model_sku}
            </p>
          </div>

          {/* Description */}
          <p className={`text-sm leading-relaxed ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            {product.description}
          </p>

          {/* ── Available Glazes/Colors ── */}
          <div>
            <h3 className={`text-sm font-bold mb-3 ${isDark ? "text-gray-200" : "text-gray-800"}`}>
              {lang === "ar" ? "الألوان المتوفرة" : "Available Glazes"}
            </h3>
            <div className="flex gap-3 items-center">
              {product.variants.map((variant, idx) => {
                const isSelected =
                  selectedVariant?.variant_id === variant.variant_id;
                const circleColor =
                  variant.color_code ||
                  fallbackColors[idx % fallbackColors.length];

                return (
                  <button
                    key={variant.variant_id}
                    onClick={() => {
                      setSelectedVariant(variant);
                      setQty(variant.min_order_qty || 1);
                    }}
                    className={`relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 ${isSelected
                      ? `ring-2 ring-[#0071e3] ${isDark ? "ring-offset-[#101622]" : "ring-offset-white"} ring-offset-2 scale-110`
                      : "hover:scale-105"
                      }`}
                    aria-label={variant.color}
                    title={variant.color || `Variant ${idx + 1}`}
                  >
                    <span
                      className="h-8 w-8 rounded-full border border-black/10"
                      style={{ backgroundColor: circleColor }}
                    />
                  </button>
                );
              })}
              {selectedVariant?.color && (
                <span className={`ml-2 text-xs font-medium ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                  {selectedVariant.color}
                </span>
              )}
            </div>
          </div>

          {/* ── Specifications Table ── */}
          <div className={`rounded-2xl border overflow-hidden shadow-sm ${isDark ? "bg-[#1a2332] border-gray-800" : "bg-white border-gray-200"}`}>
            <div className={`px-5 py-3 border-b ${isDark ? "border-gray-800" : "border-gray-200"}`}>
              <h3 className={`text-sm font-bold ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                {lang === "ar" ? "المواصفات" : "Specifications"}
              </h3>
            </div>
            <table className="w-full text-sm">
              <tbody>
                {product.material && (
                  <tr className={`border-b ${isDark ? "border-gray-800" : "border-gray-200"}`}>
                    <td className={`px-5 py-3 font-medium ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                      {lang === "ar" ? "المادة" : "Material"}
                    </td>
                    <td className={`px-5 py-3 text-right font-bold ${isDark ? "text-gray-200" : "text-gray-900"}`}>
                      {product.material}
                    </td>
                  </tr>
                )}
                {selectedVariant?.color && (
                  <tr className="border-b border-primary/5">
                    <td className="px-5 py-3 text-primary/40 font-medium">
                      {lang === "ar" ? "اللون" : "Finish"}
                    </td>
                    <td className="px-5 py-3 text-right font-bold text-primary">
                      {selectedVariant.color}
                    </td>
                  </tr>
                )}
                {product.weight && (
                  <tr className="border-b border-primary/5">
                    <td className="px-5 py-3 text-primary/40 font-medium">
                      {lang === "ar" ? "الوزن" : "Weight"}
                    </td>
                    <td className="px-5 py-3 text-right font-bold text-primary">
                      {product.weight} kg
                    </td>
                  </tr>
                )}
                {product.height && (
                  <tr>
                    <td className="px-5 py-3 text-primary/40 font-medium">
                      {lang === "ar" ? "الارتفاع" : "Height"}
                    </td>
                    <td className="px-5 py-3 text-right font-bold text-primary">
                      {product.height} cm
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
                {/* Qty Selector */}
                <div className={`inline-flex items-center rounded-xl border overflow-hidden ${isDark ? "bg-[#1a2332] border-gray-700" : "bg-white border-gray-200"}`}>
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className={`flex h-12 w-10 items-center justify-center text-lg transition-colors ${isDark ? "text-gray-500 hover:text-white hover:bg-gray-800" : "text-gray-400 hover:text-gray-900 hover:bg-gray-100"}`}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={qty}
                    onChange={(e) =>
                      setQty(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    min={1}
                    className={`h-12 w-14 bg-transparent text-center text-sm font-bold border-x outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${isDark ? "text-white border-gray-700" : "text-gray-900 border-gray-200"}`}
                    aria-label="Quantity"
                  />
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    className={`flex h-12 w-10 items-center justify-center text-lg transition-colors ${isDark ? "text-gray-500 hover:text-white hover:bg-gray-800" : "text-gray-400 hover:text-gray-900 hover:bg-gray-100"}`}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 h-12 rounded-xl bg-[#0071e3] hover:bg-[#0060c0] text-white text-sm font-bold tracking-wide shadow-md hover:shadow-lg transition-all duration-300 active:scale-95"
                >
                  {lang === "ar"
                    ? "أضف إلى سلة الاستفسار"
                    : "ADD TO INQUIRY CART"}
                  <span>→</span>
                </button>
              </div>

              {/* Min order note */}
              {selectedVariant?.min_order_qty > 1 && (
                <p className={`text-[11px] ${isDark ? "text-gray-600" : "text-gray-400"}`}>
                  {lang === "ar"
                    ? `الحد الأدنى للطلب: ${selectedVariant.min_order_qty} قطعة للتسعير بالجملة`
                    : `Minimum order quantity: ${selectedVariant.min_order_qty} units for wholesale pricing`}
                </p>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className={`flex items-center justify-center gap-2 rounded-xl p-4 text-sm font-bold border ${isDark ? "bg-green-900/30 text-green-400 border-green-800" : "bg-green-50 text-green-600 border-green-200"}`}>
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {lang === "ar" ? "تمت الإضافة بنجاح!" : "Added to cart!"}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setAddedToCart(false)}
                  className={`flex-1 h-12 rounded-xl border text-sm font-bold transition-all ${isDark ? "border-gray-700 bg-[#1a2332] text-gray-300 hover:bg-[#263548]" : "border-gray-200 bg-white text-gray-700 hover:bg-gray-100"}`}
                >
                  {lang === "ar" ? "أضف مرة أخرى" : "Add Another"}
                </button>
                <Link
                  to="/cart"
                  className="flex-1 flex items-center justify-center gap-2 h-12 rounded-xl bg-[#0071e3] hover:bg-[#0060c0] text-sm font-bold text-white shadow-md hover:shadow-lg transition-all"
                >
                  {lang === "ar" ? "عرض السلة" : "View Cart"}
                  <span>{lang === "ar" ? "←" : "→"}</span>
                </Link>
              </div>
            </div>
          )}

          {/* Tags */}
          {product.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span
                  key={tag.slug}
                  className={`inline-block rounded-full px-4 py-1.5 text-[11px] font-semibold ${isDark ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-500"}`}
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ═══════════════ Recommended Products ═══════════════ */}
      {recommended.length > 0 && (
        <section className="mt-24">
          <div className="flex items-center justify-between mb-10">
            <h2 className={`font-display text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
              {lang === "ar" ? "منتجات مقترحة" : "Recommended Pairings"}
            </h2>
            <Link
              to="/catalogue"
              className="text-sm font-bold text-[#0071e3] hover:underline flex items-center gap-1"
            >
              {lang === "ar" ? "عرض المجموعة" : "View Collection"}
              <span>{lang === "ar" ? "←" : "→"}</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {recommended.map((item) => {
              const thumb =
                item.variants?.[0]?.images?.[0]?.thumbnail ||
                item.variants?.[0]?.images?.[0]?.url;

              return (
                <Link
                  key={item.product_id}
                  to={`/product/${item.product_id}`}
                  className={`group flex flex-col rounded-2xl overflow-hidden border transition-all ${isDark ? "bg-[#1a2332] border-gray-800 hover:border-gray-700" : "bg-white border-gray-200 shadow-sm hover:shadow-md"}`}
                >
                  <div className={`relative aspect-square overflow-hidden ${isDark ? "bg-[#141e2e]" : "bg-[#f0ece4]"}`}>
                    {thumb ? (
                      <img
                        src={thumb}
                        alt={item.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className={`flex h-full w-full items-center justify-center ${isDark ? "bg-[#141e2e]" : "bg-gray-100"}`}>
                        <span className={`font-medium ${isDark ? "text-gray-600" : "text-gray-400"}`}>
                          No Image
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex items-start justify-between gap-3">
                    <div>
                      <h4 className={`font-display text-base font-bold group-hover:text-[#0071e3] ${isDark ? "text-white" : "text-gray-900"}`}>
                        {item.name}
                      </h4>
                      <p className={`mt-0.5 text-[11px] font-mono ${isDark ? "text-gray-600" : "text-gray-400"}`}>
                        SKU: {item.model_sku}
                      </p>
                      {item.description && (
                        <p className={`mt-1.5 text-xs line-clamp-2 ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                          {item.description}
                        </p>
                      )}
                    </div>
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0071e3] text-white shadow-sm">
                      <span className="text-lg leading-none">+</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
