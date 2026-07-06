import { useState, useContext, useEffect } from "react";
import { Link } from "react-router";
import { LanguageContext } from "../context/LanguageContext";
import { ThemeContext } from "../context/ThemeContext";

// ── Bilingual Labels ──
const labels = {
    en: {
        breadcrumbCatalog: "Catalog",
        breadcrumbInquiry: "Inquiry Review",
        title: "Finalize Your Inquiry",
        subtitle: "Review your selected products and provide shipping details to receive a formal quote via WhatsApp.",
        tableProduct: "Product",
        tableCode: "Code",
        tableSpecs: "Specs",
        tableQty: "Quantity",
        tableAction: "Action",
        continueBrowsingTitle: "Continue browsing?",
        continueBrowsingDesc: "We have hundreds of new designs in our Summer 2026 collection.",
        viewCatalog: "View Catalog",
        inquirySummary: "Inquiry Summary",
        itemCount: "{{count}} Items",
        completeDetails: "Complete your details to get a quote.",
        destinationRegion: "Destination Region",
        selectRegion: "Select region...",
        egypt: "Egypt (Domestic)",
        gcc: "GCC Countries",
        eu: "European Union",
        na: "North America",
        otherIntl: "Other International",
        cityPort: "City / Port",
        cityPlaceholder: "e.g., Dubai, Cairo, Hamburg",
        buyerName: "Buyer Name",
        namePlaceholder: "Your full name",
        buyerNotes: "Buyer Notes",
        notesPlaceholder: "Special packaging requests, delivery deadlines, or specific questions...",
        sendWhatsApp: "Send Inquiry via WhatsApp",
        disclaimer: "By proceeding, you agree to share your cart details via WhatsApp for a personalized quote.",
        termsOfService: "Terms of Service",
        sslSecure: "SSL Secure",
        verifiedMfg: "Verified Mfg",
        emptyTitle: "Your inquiry cart is empty",
        emptySubtitle: "Browse our catalog to find the perfect products for your business.",
        returnToCatalog: "Return to Catalog",
        regionRequired: "Please select a destination region.",
        cityRequired: "Please enter a city or port.",
        nameRequired: "Please enter your name.",
    },
    ar: {
        breadcrumbCatalog: "الكتالوج",
        breadcrumbInquiry: "مراجعة الاستفسار",
        title: "إنهاء استفسارك",
        subtitle: "راجع المنتجات المختارة وقدم تفاصيل الشحن لتلقي عرض أسعار رسمي عبر واتساب.",
        tableProduct: "المنتج",
        tableCode: "الكود",
        tableSpecs: "المواصفات",
        tableQty: "الكمية",
        tableAction: "الإجراء",
        continueBrowsingTitle: "الاستمرار في التصفح؟",
        continueBrowsingDesc: "لدينا مئات التصاميم الجديدة في مجموعة صيف 2026.",
        viewCatalog: "عرض الكتالوج",
        inquirySummary: "ملخص الاستفسار",
        itemCount: "{{count}} عنصر",
        completeDetails: "أكمل تفاصيلك للحصول على عرض أسعار.",
        destinationRegion: "منطقة الوجهة",
        selectRegion: "اختر المنطقة...",
        egypt: "مصر (محلي)",
        gcc: "دول الخليج",
        eu: "الاتحاد الأوروبي",
        na: "أمريكا الشمالية",
        otherIntl: "دول دولية أخرى",
        cityPort: "مدينة / ميناء",
        cityPlaceholder: "مثال: دبي، القاهرة، هامبورغ",
        buyerName: "اسم المشتري",
        namePlaceholder: "اسمك الكامل",
        buyerNotes: "ملاحظات المشتري",
        notesPlaceholder: "طلبات تغليف خاصة، مواعيد تسليم، أو أسئلة محددة...",
        sendWhatsApp: "إرسال الاستفسار عبر واتساب",
        disclaimer: "بالمتابعة، توافق على مشاركة تفاصيل سلتك عبر واتساب لعرض أسعار شخصي.",
        termsOfService: "شروط الخدمة",
        sslSecure: "آمن بـ SSL",
        verifiedMfg: "مصنع معتمد",
        emptyTitle: "سلة الاستفسار فارغة",
        emptySubtitle: "تصفح كتالوجنا للعثور على المنتجات المثالية لعملك.",
        returnToCatalog: "العودة إلى الكتالوج",
        regionRequired: "يرجى اختيار منطقة الوجهة.",
        cityRequired: "يرجى إدخال المدينة أو الميناء.",
        nameRequired: "يرجى إدخال اسمك.",
    },
};

// ── Region options ──
const REGIONS = [
    { value: "eg", labelKey: "egypt" },
    { value: "gcc", labelKey: "gcc" },
    { value: "eu", labelKey: "eu" },
    { value: "na", labelKey: "na" },
    { value: "other", labelKey: "otherIntl" },
];

// ── WhatsApp number (no + sign, no spaces) ──
const WHATSAPP_NUMBER = "201065583355";

export default function Cart() {
    const { lang, dir } = useContext(LanguageContext);
    const { theme } = useContext(ThemeContext);
    const t = labels[lang as keyof typeof labels] || labels.en;
    const isDark = theme === "dark";

    // ── State: Cart from localStorage only ──
    const [cart, setCart] = useState<any[]>(() => {
        try {
            if (typeof window !== "undefined") {
                return JSON.parse(localStorage.getItem("elmuttahida_inquiryCart") || "[]");
            }
            return [];
        } catch {
            return [];
        }
    });

    // ── Form State ──
    const [buyerName, setBuyerName] = useState("");
    const [region, setRegion] = useState("");
    const [city, setCity] = useState("");
    const [notes, setNotes] = useState("");
    const [formError, setFormError] = useState<string | null>(null);

    // ── Persist cart changes to localStorage ──
    useEffect(() => {
        localStorage.setItem("elmuttahida_inquiryCart", JSON.stringify(cart));
        window.dispatchEvent(new Event("cartUpdated"));
    }, [cart]);

    // ── Cart Mutations ──
    const updateQty = (index: number, delta: number) => {
        setCart((prev) =>
            prev.map((item, i) =>
                i === index ? { ...item, qty: Math.max(1, (item.qty || 1) + delta) } : item
            )
        );
    };

    const setQty = (index: number, value: string) => {
        const qty = Math.max(1, parseInt(value) || 1);
        setCart((prev) =>
            prev.map((item, i) => (i === index ? { ...item, qty } : item))
        );
    };

    const removeItem = (index: number) => {
        setCart((prev) => prev.filter((_, i) => i !== index));
    };

    // ── Get display fields safely ──
    const getItemImage = (item: any) =>
        item.mainImage ||
        item.image ||
        item.variants?.[0]?.images?.[0]?.thumbnail ||
        item.variants?.[0]?.images?.[0]?.url ||
        null;

    const getItemMainImage = (item: any) =>
        item.mainImage ||
        item.image ||
        item.variants?.[0]?.images?.[0]?.url ||
        item.variants?.[0]?.images?.[0]?.thumbnail ||
        null;

    const getItemCode = (item: any) =>
        item.code || item.model_sku || item.sku || item.variants?.[0]?.sku || "—";

    const getItemSpecsLines = (item: any) => {
        const line1 = item.color
            ? `${item.color}${item.material ? " " + item.material : ""}`
            : item.material || item.finish || item.specs || "";
        const dims = [];
        if (item.height) dims.push(`${item.height}cm Height`);
        if (item.weight) dims.push(`${item.weight}kg`);
        const line2 = dims.join(" · ");
        return { line1: line1 || "Standard", line2 };
    };

    // ── WhatsApp Message Builder ──
    const buildWhatsAppMessage = () => {
        const getAbsoluteUrl = (path: string | null) => {
            if (!path) return "";
            if (path.startsWith("http")) return path;
            if (typeof window !== "undefined") {
                return `${window.location.origin}${path.startsWith("/") ? "" : "/"}${path}`;
            }
            return path;
        };

        const productLines = cart
            .map((item, i) => {
                const image = getAbsoluteUrl(getItemMainImage(item));
                return [
                    `${i + 1}) ${item.name} (${getItemCode(item)}) x ${item.qty || 1}`,
                    image ? `Image: ${image}` : "",
                ].filter(Boolean).join("\n");
            })
            .join("\n\n");

        const selectedRegion = REGIONS.find((r) => r.value === region);
        const regionLabel = selectedRegion ? (t as any)[selectedRegion.labelKey] : region;

        return [
            "🧾 *Inquiry from Website*",
            "",
            `*Name:* ${buyerName.trim()}`,
            "",
            "🛍️ *Products:*",
            productLines,
            "",
            "📍 *Destination:*",
            `Region: ${regionLabel}`,
            `City: ${city}`,
            "",
            notes ? `📝 *Notes:*\n${notes}` : "",
        ]
            .filter(Boolean)
            .join("\n");
    };

    const handleSendWhatsApp = () => {
        setFormError(null);
        if (!buyerName.trim()) {
            setFormError(t.nameRequired);
            return;
        }
        if (!region) {
            setFormError(t.regionRequired);
            return;
        }
        if (!city.trim()) {
            setFormError(t.cityRequired);
            return;
        }

        const message = buildWhatsAppMessage();
        const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
        window.open(url, "_blank");
    };

    // ── Theme classes ──
    const c = {
        text: isDark ? "text-gray-100" : "text-gray-900",
        textMuted: isDark ? "text-gray-400" : "text-gray-500",
        textFaint: isDark ? "text-gray-500" : "text-gray-400",
        textVeryFaint: isDark ? "text-gray-600" : "text-gray-300",
        card: isDark ? "bg-[#1a2332] border-gray-800" : "bg-white border-gray-200",
        cardShadow: isDark ? "shadow-lg" : "shadow-sm",
        rowBorder: isDark ? "border-gray-800" : "border-gray-100",
        rowHover: isDark ? "hover:bg-[#1f2b3d]" : "hover:bg-gray-50",
        imgPlaceholder: isDark ? "bg-[#141e2e]" : "bg-gray-100",
        input: isDark
            ? "bg-[#141e2e] border-gray-700 text-gray-200 placeholder:text-gray-600 focus:border-[#0071e3]"
            : "bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400 focus:border-[#0071e3]",
        qtyBg: isDark ? "bg-[#141e2e] border-gray-700" : "bg-gray-50 border-gray-200",
        qtyBtn: isDark ? "text-gray-500 hover:text-white hover:bg-gray-800" : "text-gray-400 hover:text-gray-900 hover:bg-gray-200",
        qtyInput: isDark ? "text-white" : "text-gray-900",
        removeBtn: isDark ? "text-gray-600 hover:text-red-400 hover:bg-red-900/30" : "text-gray-300 hover:text-red-500 hover:bg-red-50",
        link: "text-[#0071e3] hover:underline",
        browseCard: isDark ? "bg-[#1a2332] border-gray-800" : "bg-gradient-to-br from-blue-50 to-gray-50 border-gray-200",
        browseBtn: isDark ? "bg-[#141e2e] border-gray-700 text-gray-300 hover:text-white" : "bg-white border-gray-200 text-gray-700 hover:text-gray-900 shadow-sm",
        disclaimer: isDark ? "bg-[#141e2e] border-gray-800 text-gray-500" : "bg-gray-50 border-gray-200 text-gray-400",
        trustBadge: isDark ? "text-gray-600" : "text-gray-300",
        label: isDark ? "text-gray-500" : "text-gray-400",
        codeBadge: isDark ? "bg-[#0071e3]/20 text-[#4da3ff]" : "bg-[#0071e3]/10 text-[#0071e3]",
        hr: isDark ? "border-gray-800" : "border-gray-200",
    };

    // ── Item count label ──
    const itemCountLabel = t.itemCount.replace("{{count}}", String(cart.length));

    // ═══════════════════════════════════════════
    // EMPTY CART STATE
    // ═══════════════════════════════════════════
    if (cart.length === 0) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center px-6 pt-20" dir={dir}>
                <div className="flex flex-col items-center text-center max-w-md">
                    {/* Empty Icon */}
                    <div className={`mb-8 flex h-24 w-24 items-center justify-center rounded-full ${isDark ? "bg-[#1a2332]" : "bg-gray-100"}`}>
                        <svg
                            className={`h-10 w-10 ${isDark ? "text-gray-700" : "text-gray-300"}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                        </svg>
                    </div>

                    <h2 className={`font-serif text-2xl font-bold mb-2 ${c.text}`}>
                        {t.emptyTitle}
                    </h2>
                    <p className={`text-sm mb-8 leading-relaxed ${c.textMuted}`}>
                        {t.emptySubtitle}
                    </p>

                    <Link
                        to="/catalogue"
                        className="group relative overflow-hidden rounded-full bg-[#0071e3] px-10 py-4 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:bg-[#0060c0] active:scale-95"
                    >
                        {t.returnToCatalog}
                    </Link>
                </div>
            </div>
        );
    }

    // ═══════════════════════════════════════════
    // POPULATED CART
    // ═══════════════════════════════════════════
    return (
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-12 pt-32 min-h-screen transition-colors duration-300 pb-24`} dir={dir}>
            {/* Breadcrumb */}
            <nav className={`text-sm font-medium mb-6 sm:mb-10 ${c.textFaint}`} aria-label="Breadcrumb">
                <Link to="/catalogue" className={`${c.link} transition-colors`}>
                    {t.breadcrumbCatalog}
                </Link>
                <span className="mx-2">{dir === "rtl" ? "←" : "›"}</span>
                <span className={c.textMuted}>{t.breadcrumbInquiry}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16">
                {/* ═══════ LEFT: Cart Items ═══════ */}
                <div className="lg:col-span-2 flex flex-col gap-6 sm:gap-10">
                    <div>
                        <h1 className={`font-serif text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 ${c.text}`}>
                            {t.title}
                        </h1>
                        <p className={`text-sm leading-relaxed max-w-xl ${c.textMuted}`}>
                            {t.subtitle}
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 lg:hidden">
                        {cart.map((item, index) => (
                            <div key={item.product_id || index} className={`rounded-2xl border p-4 ${c.card} ${c.cardShadow}`}>
                                <div className="flex gap-3">
                                    <div className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl ${c.imgPlaceholder}`}>
                                        {getItemImage(item) ? (
                                            <img src={getItemImage(item)} alt={item.name} className="h-full w-full object-cover" loading="lazy" />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center"><span className={`text-xs ${c.textVeryFaint}`}>—</span></div>
                                        )}
                                    </div>
                                    <div className="flex-grow min-w-0">
                                        <p className={`font-serif font-bold text-sm truncate ${c.text}`}>{item.name}</p>
                                        <span className={`inline-block rounded-md px-2 py-0.5 font-mono text-[10px] font-bold mt-1 ${c.codeBadge}`}>{getItemCode(item)}</span>
                                        {getItemSpecsLines(item).line1 && <p className={`text-[11px] mt-1 ${c.textFaint}`}>{getItemSpecsLines(item).line1}</p>}
                                    </div>
                                    <button onClick={() => removeItem(index)} className={`shrink-0 h-8 w-8 flex items-center justify-center rounded-full transition-all ${c.removeBtn}`} aria-label="Remove item">
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>
                                <div className="flex items-center justify-end mt-3 pt-3 border-t" style={{ borderColor: isDark ? '#1f2937' : '#e5e7eb' }}>
                                    <div className={`inline-flex items-center rounded-full border overflow-hidden ${c.qtyBg}`}>
                                        <button onClick={() => updateQty(index, -1)} className={`flex h-8 w-8 items-center justify-center text-sm transition-colors ${c.qtyBtn}`}>−</button>
                                        <input type="number" value={item.qty || 1} onChange={(e) => setQty(index, e.target.value)} min={1} className={`h-8 w-10 bg-transparent text-center text-sm font-bold border-none outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${c.qtyInput}`} />
                                        <button onClick={() => updateQty(index, 1)} className={`flex h-8 w-8 items-center justify-center text-sm transition-colors ${c.qtyBtn}`}>+</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={`hidden lg:block rounded-3xl border overflow-hidden ${c.card} ${c.cardShadow}`}>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className={`border-b ${c.rowBorder}`}>
                                    <th className={`py-4 px-6 ${dir === "rtl" ? "text-right" : "text-left"} text-[10px] font-bold uppercase tracking-widest ${c.textFaint}`}>{t.tableProduct}</th>
                                    <th className={`py-4 px-6 ${dir === "rtl" ? "text-right" : "text-left"} text-[10px] font-bold uppercase tracking-widest ${c.textFaint}`}>{t.tableCode}</th>
                                    <th className={`py-4 px-6 ${dir === "rtl" ? "text-right" : "text-left"} text-[10px] font-bold uppercase tracking-widest ${c.textFaint}`}>{t.tableSpecs}</th>
                                    <th className={`py-4 px-6 text-center text-[10px] font-bold uppercase tracking-widest ${c.textFaint}`}>{t.tableQty}</th>
                                    <th className={`py-4 px-6 text-center text-[10px] font-bold uppercase tracking-widest ${c.textFaint}`}>{t.tableAction}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cart.map((item, index) => (
                                    <tr key={item.product_id || index} className={`border-b last:border-0 transition-colors ${c.rowBorder} ${c.rowHover}`}>
                                        <td className="py-5 px-6">
                                            <div className="flex items-center gap-4">
                                                <div className={`h-14 w-14 shrink-0 overflow-hidden rounded-2xl ${c.imgPlaceholder}`}>
                                                    {getItemImage(item) ? (
                                                        <img src={getItemImage(item)} alt={item.name} className="h-full w-full object-cover" loading="lazy" />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center"><span className={`text-xs ${c.textVeryFaint}`}>—</span></div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className={`font-serif font-bold text-sm ${c.text}`}>{item.name}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-5 px-6">
                                            <span className={`inline-block rounded-lg px-3 py-1 font-mono text-[11px] font-bold ${c.codeBadge}`}>{getItemCode(item)}</span>
                                        </td>
                                        <td className="py-5 px-6">
                                            {(() => {
                                                const specs = getItemSpecsLines(item);
                                                return (
                                                    <div>
                                                        <p className={`text-xs font-medium ${c.textMuted}`}>{specs.line1}</p>
                                                        {specs.line2 && <p className={`text-[11px] mt-0.5 ${c.textFaint}`}>{specs.line2}</p>}
                                                    </div>
                                                );
                                            })()}
                                        </td>
                                        <td className="py-5 px-6">
                                            <div className="flex items-center justify-center">
                                                <div className={`inline-flex items-center rounded-full border overflow-hidden ${c.qtyBg}`}>
                                                    <button onClick={() => updateQty(index, -1)} className={`flex h-9 w-9 items-center justify-center transition-colors ${c.qtyBtn}`}>−</button>
                                                    <input type="number" value={item.qty || 1} onChange={(e) => setQty(index, e.target.value)} min={1} className={`h-9 w-12 bg-transparent text-center text-sm font-bold border-none outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${c.qtyInput}`} />
                                                    <button onClick={() => updateQty(index, 1)} className={`flex h-9 w-9 items-center justify-center transition-colors ${c.qtyBtn}`}>+</button>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-5 px-6 text-center">
                                            <button onClick={() => removeItem(index)} className={`inline-flex h-9 w-9 items-center justify-center rounded-full transition-all ${c.removeBtn}`}>
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className={`rounded-2xl sm:rounded-3xl p-5 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 border ${c.browseCard}`}>
                        <div>
                            <h3 className={`font-serif font-bold text-lg mb-1 ${c.text}`}>{t.continueBrowsingTitle}</h3>
                            <p className={`text-sm ${c.textMuted}`}>{t.continueBrowsingDesc}</p>
                        </div>
                        <Link to="/catalogue" className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold border transition-all shrink-0 ${c.browseBtn}`}>
                            {t.viewCatalog}
                            <span className="text-lg">{lang === "ar" ? "←" : "→"}</span>
                        </Link>
                    </div>
                </div>

                {/* ═══════ RIGHT: Inquiry Summary ═══════ */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24">
                        <div className={`rounded-2xl sm:rounded-3xl border p-5 sm:p-8 flex flex-col gap-6 sm:gap-8 ${c.card} ${c.cardShadow}`}>
                            <div className="flex items-center justify-between">
                                <h3 className={`font-serif text-xl font-bold ${c.text}`}>{t.inquirySummary}</h3>
                                <span className={`inline-block rounded-full px-3 py-1 text-[11px] font-bold ${c.codeBadge}`}>{itemCountLabel}</span>
                            </div>

                            <p className={`text-sm ${c.textFaint}`}>{t.completeDetails}</p>
                            <hr className={c.hr} />

                            <div className="flex flex-col gap-5">
                                <div className="flex flex-col gap-1.5">
                                    <label htmlFor="buyerName" className={`text-[11px] font-bold uppercase tracking-widest ${c.label}`}>{t.buyerName}</label>
                                    <input id="buyerName" type="text" value={buyerName} onChange={(e) => setBuyerName(e.target.value)} placeholder={t.namePlaceholder} className={`w-full rounded-2xl border px-4 py-3 text-sm font-medium outline-none transition-colors ${c.input}`} />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label htmlFor="region" className={`text-[11px] font-bold uppercase tracking-widest ${c.label}`}>{t.destinationRegion}</label>
                                    <select id="region" value={region} onChange={(e) => setRegion(e.target.value)} className={`w-full rounded-2xl border px-4 py-3 text-sm font-medium outline-none transition-colors ${c.input}`}>
                                        <option value="">{t.selectRegion}</option>
                                        {REGIONS.map((r) => <option key={r.value} value={r.value}>{(t as any)[r.labelKey]}</option>)}
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label htmlFor="city" className={`text-[11px] font-bold uppercase tracking-widest ${c.label}`}>{t.cityPort}</label>
                                    <input id="city" type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder={t.cityPlaceholder} className={`w-full rounded-2xl border px-4 py-3 text-sm font-medium outline-none transition-colors ${c.input}`} />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label htmlFor="notes" className={`text-[11px] font-bold uppercase tracking-widest ${c.label}`}>{t.buyerNotes}</label>
                                    <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={t.notesPlaceholder} rows={4} className={`w-full rounded-2xl border px-4 py-3 text-sm font-medium resize-none outline-none transition-colors ${c.input}`} />
                                </div>
                            </div>

                            {formError && <p className={`text-xs font-medium rounded-xl px-4 py-3 ${isDark ? "text-red-400 bg-red-900/30" : "text-red-500 bg-red-50"}`}>{formError}</p>}

                            <hr className={c.hr} />

                            <button onClick={handleSendWhatsApp} className="group relative w-full overflow-hidden rounded-full bg-[#25D366] p-5 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl flex items-center justify-center gap-3">
                                <svg className="h-5 w-5 relative z-10" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.79 23.789l4.89-1.56A11.946 11.946 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818c-2.168 0-4.19-.617-5.908-1.682l-.424-.252-2.905.928.775-2.834-.277-.44A9.784 9.784 0 012.182 12c0-5.418 4.4-9.818 9.818-9.818S21.818 6.582 21.818 12s-4.4 9.818-9.818 9.818z" />
                                </svg>
                                <span className="relative z-10">{t.sendWhatsApp}</span>
                                <div className="absolute inset-0 z-0 bg-[#128C7E] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                            </button>

                            <div className={`rounded-2xl p-4 border ${c.disclaimer}`}>
                                <p className="text-[11px] text-center leading-relaxed">
                                    {t.disclaimer} <a href="#" className={`underline ${c.link}`}>{t.termsOfService}</a>
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-center gap-8">
                            <div className={`flex items-center gap-1.5 ${c.trustBadge}`}>
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                <span className="text-[11px] font-medium">{t.sslSecure}</span>
                            </div>
                            <div className={`flex items-center gap-1.5 ${c.trustBadge}`}>
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                                <span className="text-[11px] font-medium">{t.verifiedMfg}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
