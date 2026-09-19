import type { Route } from "./+types/custom-finishes";
import { Link } from "react-router";
import { useContext, useState } from "react";
import { LanguageContext } from "../context/LanguageContext";

export const meta: Route.MetaFunction = () => [
    { title: "Custom Finishes & Bespoke Manufacturing | El-Muttahida" },
    {
        name: "description",
        content: "Commission bespoke vase glazes, architectural dimensions, and private-label ceramic branding with El-Muttahida.",
    },
];

export default function CustomFinishes() {
    const { lang, dir } = useContext(LanguageContext);
    const isArabic = lang === "ar";
    const [selectedFinish, setSelectedFinish] = useState<string>("Matte Terra");

    const finishes = [
        {
            id: "matte-terra",
            name: isArabic ? "تيرا ريفي طبيعي غير مصقول" : "Raw Matte Terra",
            tag: isArabic ? "ملمس ترابي خام" : "Organic Mineral Texture",
            desc: isArabic
                ? "ملمس خشن طبيعي يبرز المعادن والغرين الأصلي في طمي النيل، بدون طبقة زجاجية، بلمسة ناعمة دافئة تناسب الديكورات المينيمالية والمعاصرة."
                : "Unfinished earthy tactile texture revealing the rich silt minerals of the Nile Delta. Ideal for wabi-sabi, Scandinavian, and contemporary organic spaces.",
            image: "/assets/ceramic.png",
        },
        {
            id: "royal-glaze",
            name: isArabic ? "تزجيج ملكي أزرق نايلي" : "Royal Nile Cobalt Glaze",
            tag: isArabic ? "زجاجي لامع متعدد الأبعاد" : "Deep Multidimensional Gloss",
            desc: isArabic
                ? "طبقة زجاجية عميقة تمزج بين أكسيد الكوبالت وأكاسيد النحاس لحرق مزدوج ينتج عنه تدرجات زرقة النيل الملكية المستخدمة تاريخيًا في قصور مصر."
                : "A rich, saturated cobalt and copper oxide glaze fired at 1,120°C to achieve a deep watery vitrified sheen inspired by ancient pharaonic pottery.",
            image: "/assets/hero.png",
        },
        {
            id: "matte-black",
            name: isArabic ? "أسود بركاني مطفي عميق" : "Obsidian Volcanic Matte",
            tag: isArabic ? "أناقة درامية حديثة" : "Architectural Charcoal Finish",
            desc: isArabic
                ? "تشطيب أسود فحمي غير عاكس للضوء مع حبيبات دقيقة ناعمة، يمنح المزهرية وزنًا بصريًا فخمًا للمداخل والصالات والمطاعم الفاخرة."
                : "An ultra-matte non-reflective basalt finish with micro-textured grain. Commands dramatic architectural presence in luxury hotel lobbies and upscale retail.",
            image: "/assets/glass.png",
        },
        {
            id: "gold-accent",
            name: isArabic ? "تعتيق تراثي بحواف ذهبية" : "Royal Heritage with Gold Accent",
            tag: isArabic ? "لمسات مذهبة يدويًا" : "Hand-Applied Mineral Gilding",
            desc: isArabic
                ? "طلاء يدوي رقيق لأعناق وحواف المزهريات بماء الذهب والمعادن الثمينة بعد الحرق النهائي، لإنتاج قطع فنية ذات قيمة اقتنائية استثنائية."
                : "Intricate 24k gold leaf and bronze mineral patinas hand-burnished along the vase rim and sculpted shoulders, creating museum-worthy collector pieces.",
            image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&h=700&fit=crop",
        },
    ];

    const capabilities = [
        {
            title: isArabic ? "مقاسات معمارية ضخمة (حتى 150 سم)" : "Architectural Scale (Up to 150 cm)",
            desc: isArabic
                ? "نمتلك أفرانًا عملاقة وخزافين قادرين على سحب مزهريات أرضية ضخمة للمداخل والفنادق الفاخرة."
                : "Our specialized kiln chambers permit grand-format statement urns and floor vessels scaling up to 1.5 meters in height.",
            icon: "📐",
        },
        {
            title: isArabic ? "حفر الشعار والعلامة التجارية (Private Label)" : "Debossed Private-Label Branding",
            desc: isArabic
                ? "نقوم بنقش أو ختم شعار متجرك أو علامتك التجارية بدقة على قاعدة المزهرية قبل الحرق لتعزيز قيمة براندك."
                : "Permanently stamp your brand mark, monogram, or bespoke edition numbering directly into the wet clay base before bisque firing.",
            icon: "🏷️",
        },
        {
            title: isArabic ? "مطابقة درجات ألوان بانتون الحصرية" : "Custom Pantone Color Formulation",
            desc: isArabic
                ? "يقوم كيميائيو الخزف لدينا بمطابقة خلطات الأكاسيد الطبيعية لإنتاج درجات ألوان متوافقة تمامًا مع هوية علامتك التجارية."
                : "Our in-house glaze chemists blend custom natural mineral batches to match client brand identity palettes and project specifications.",
            icon: "🎨",
        },
    ];

    const handleInquireWhatsApp = () => {
        const msg = isArabic
            ? `مرحبًا، أود الاستفسار عن خدمة التشطيبات والتصنيع الخاص للمزهريات (النوع المختار: ${selectedFinish}). يرجى إرسال تفاصيل التخصيص والحد الأدنى للكميات.`
            : `Hello, I am interested in commissioning custom ceramic finishes (Selected: ${selectedFinish}). Please share custom manufacturing MOQ and pricing options.`;
        window.open(`https://wa.me/201065583355?text=${encodeURIComponent(msg)}`, "_blank");
    };

    return (
        <main className="min-h-screen py-28 sm:py-36 px-4 sm:px-6 lg:px-8 bg-surface dark:bg-gray-950 text-secondary dark:text-white transition-colors" dir={dir}>
            <div className="max-w-6xl mx-auto space-y-16 sm:space-y-24">
                
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto space-y-4 sm:space-y-6">
                    <span className="inline-block px-4 py-1 bg-primary/20 text-primary-dark dark:text-primary text-xs font-bold uppercase tracking-widest rounded-full">
                        {isArabic ? "التصنيع المخصص والعلامات الخاصة" : "Bespoke Ceramic Atelier"}
                    </span>
                    <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-black tracking-tight leading-tight">
                        {isArabic ? "تشطيبات وتصاميم حسب الطلب" : "Custom Finishes & Sizing"}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-base sm:text-xl font-light leading-relaxed">
                        {isArabic
                            ? "من الفنادق الفاخرة إلى سلاسل المتاجر المرموقة، نصنع خطوط إنتاج حصرية بمقاسات وألوان ونقوش مطابقة تمامًا لرؤيتك التصميمية."
                            : "From bespoke glazes to private-label studio stamping, our artisans partner with architects, retailers, and developers to bring custom concepts into ceramic reality."}
                    </p>
                </div>

                {/* Finishes Showcase Grid */}
                <div className="space-y-6">
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl sm:text-3xl font-serif font-bold">
                            {isArabic ? "معرض التشطيبات والطلاءات المتاحة" : "Signature Finish Varieties"}
                        </h2>
                        <p className="text-sm text-gray-500">
                            {isArabic ? "اختر أحد التشطيبات للبدء في الاستفسار أو طلب العينات" : "Explore our proprietary hand-dipped and air-patinated glaze techniques"}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {finishes.map((f) => (
                            <div
                                key={f.id}
                                onClick={() => setSelectedFinish(f.name)}
                                className={`group rounded-3xl overflow-hidden bg-white dark:bg-gray-900 border transition-all cursor-pointer shadow-sm hover:shadow-xl ${
                                    selectedFinish === f.name
                                        ? "border-primary ring-2 ring-primary/30"
                                        : "border-gray-150 dark:border-gray-850 hover:border-primary/50"
                                }`}
                            >
                                <div className="h-64 sm:h-72 overflow-hidden relative">
                                    <img
                                        src={f.image}
                                        alt={f.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                    <div className="absolute bottom-4 ltr:left-4 rtl:right-4 text-white">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary block">
                                            {f.tag}
                                        </span>
                                        <h3 className="text-lg font-serif font-bold">
                                            {f.name}
                                        </h3>
                                    </div>
                                </div>
                                <div className="p-5 ltr:text-left rtl:text-right space-y-3">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-light">
                                        {f.desc}
                                    </p>
                                    <div className="pt-2 flex items-center justify-between text-xs font-bold text-primary">
                                        <span>{isArabic ? "اختر هذا التشطيب" : "Select Finish"}</span>
                                        <span>{selectedFinish === f.name ? "✓" : "+"}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Custom Capabilities */}
                <div className="space-y-6">
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-center">
                        {isArabic ? "إمكانيات التخصيص لشركاء الجملة" : "Bespoke Manufacturing Capabilities"}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                        {capabilities.map((c, i) => (
                            <div
                                key={i}
                                className="p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-850 shadow-sm space-y-3 ltr:text-left rtl:text-right"
                            >
                                <span className="text-3xl block">{c.icon}</span>
                                <h3 className="text-xl font-bold font-serif text-primary">
                                    {c.title}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-light">
                                    {c.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bespoke Inquiry CTA Card */}
                <div className="p-8 sm:p-14 rounded-3xl bg-secondary dark:bg-gray-900 text-white text-center space-y-6">
                    <span className="inline-block px-4 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
                        {isArabic ? `التشطيب المحدد: ${selectedFinish}` : `Selected Finish: ${selectedFinish}`}
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-serif font-bold">
                        {isArabic ? "جاهز لبدء تصنيع تشكيلة حصرية؟" : "Ready to Prototype Your Custom Line?"}
                    </h2>
                    <p className="text-gray-300 max-w-xl mx-auto text-sm sm:text-base font-light">
                        {isArabic
                            ? "أرسل لنا متطلبات مشروعك، الأبعاد المستهدفة، أو رسومات التصميم لنبدأ في إنتاج العينة التجريبية."
                            : "Connect directly with our master studio team to review specs, request pre-production samples, and confirm production slots."}
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 pt-2">
                        <button
                            onClick={handleInquireWhatsApp}
                            className="px-8 py-3.5 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold rounded-full transition-all shadow-lg flex items-center gap-2"
                        >
                            <span>💬</span>
                            <span>{isArabic ? "طلب تسعير تشطيب خاص عبر واتساب" : "Inquire for Custom Finish via WhatsApp"}</span>
                        </button>
                        <Link to="/catalogue" className="px-8 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-full transition-all">
                            {isArabic ? "تصفح الكتالوج القياسي" : "Browse Standard Catalogue"}
                        </Link>
                    </div>
                </div>

            </div>
        </main>
    );
}
