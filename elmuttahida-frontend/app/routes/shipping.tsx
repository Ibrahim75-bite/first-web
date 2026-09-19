import type { Route } from "./+types/shipping";
import { Link } from "react-router";
import { useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";

export const meta: Route.MetaFunction = () => [
    { title: "Worldwide Shipping & Logistics | El-Muttahida" },
    {
        name: "description",
        content: "Learn about El-Muttahida export logistics: container freight, ISPM-15 fumigated pallets, transit times, and supported Incoterms.",
    },
];

export default function Shipping() {
    const { lang, dir } = useContext(LanguageContext);
    const isArabic = lang === "ar";

    const transitTimes = [
        {
            region: isArabic ? "الخليج العربي والشرق الأوسط" : "GCC & Middle East",
            port: isArabic ? "دبي، جدة، الدوحة، الكويت" : "Dubai, Jeddah, Dammam, Doha",
            time: isArabic ? "5 - 8 أيام عمل" : "5 – 8 Days",
            icon: "🌊",
        },
        {
            region: isArabic ? "جنوب وغرب أوروبا" : "Southern & Western Europe",
            port: isArabic ? "مرسيليا، فالنسيا، جنوة، هامبورغ" : "Marseille, Valencia, Genoa, Hamburg",
            time: isArabic ? "7 - 12 يوم عمل" : "7 – 12 Days",
            icon: "🚢",
        },
        {
            region: isArabic ? "أمريكا الشمالية (الساحل الشرقي)" : "North America (East Coast)",
            port: isArabic ? "نيويورك، نيوجيرسي، سافانا" : "New York, Savannah, Montreal",
            time: isArabic ? "18 - 24 يوم عمل" : "18 – 24 Days",
            icon: "🌐",
        },
        {
            region: isArabic ? "عينات جوية سريعة (عالميًا)" : "Air Cargo Samples (Global)",
            port: isArabic ? "عبر DHL / FedEx للعينات" : "Door-to-door express courier",
            time: isArabic ? "3 - 5 أيام عمل" : "3 – 5 Days",
            icon: "✈️",
        },
    ];

    const specs = [
        {
            title: isArabic ? "طبالي خشبية مبخرة ISPM-15" : "ISPM-15 Certified Palletization",
            desc: isArabic
                ? "تُرص جميع الصناديق على طبالي خشبية معالجة حراريًا ومبخرة بشهادات دولية رسمية مقبولة لدى كافة الموانئ الأوروبية والأمريكية والخليجية."
                : "Treated wooden pallets stamped with official IPPC phytosanitary seals guarantee frictionless customs clearance in the US, EU, and Arab states.",
        },
        {
            title: isArabic ? "كرتون مزدوج الجدار واختبارات السقوط" : "Drop-Tested Double-Wall Cartons",
            desc: isArabic
                ? "كل مزهرية محمية بطبقات رغوية ممتصة للصدمات مع كرتون قوي (5-ply) خضع لاختبار السقوط من ارتفاع 1.2 متر لضمان وصولها سليمة."
                : "Heavy-duty 5-ply cartons with custom honeycomb foam sleeves undergo standardized drop tests from 1.2m to ensure near-zero transit breakage.",
        },
        {
            title: isArabic ? "دعم شروط التجارة الدولية (Incoterms)" : "Global Incoterms Supported",
            desc: isArabic
                ? "نوفر مرونة كاملة للعملاء: تسليم أرض المصنع (EXW)، ظهر السفينة في الإسكندرية ودمياط (FOB)، الشحن والتأمين (CIF)، والتخليص الكامل (DDP)."
                : "We accommodate EXW (Factory Cairo), FOB (Alexandria / Damietta ports), CIF (Buyer's port), and DDP depending on volume and contract terms.",
        },
    ];

    return (
        <main className="min-h-screen py-28 sm:py-36 px-4 sm:px-6 lg:px-8 bg-surface dark:bg-gray-950 text-secondary dark:text-white transition-colors" dir={dir}>
            <div className="max-w-6xl mx-auto space-y-16 sm:space-y-24">
                
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto space-y-4 sm:space-y-6">
                    <span className="inline-block px-4 py-1 bg-primary/20 text-primary-dark dark:text-primary text-xs font-bold uppercase tracking-widest rounded-full">
                        {isArabic ? "سلاسل الإمداد والشحن الدولي" : "Global Freight & Logistics"}
                    </span>
                    <h1 className="text-4xl sm:text-6xl font-serif font-black tracking-tight leading-tight">
                        {isArabic ? "الشحن الدولي واللوجستيات" : "Export Shipping & Logistics"}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-base sm:text-xl font-light leading-relaxed">
                        {isArabic
                            ? "نصدر الفخار المصري لشركائنا في أكثر من 74 دولة عبر شبكة خطوط ملاحية سريعة وتغليف هندسي مضاد للكسر."
                            : "Reliable, transparent ocean and air freight infrastructure connecting Egyptian kiln craft directly to commercial loading docks across 74+ countries."}
                    </p>
                </div>

                {/* Transit Times Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {transitTimes.map((item, idx) => (
                        <div
                            key={idx}
                            className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-850 shadow-sm space-y-3 ltr:text-left rtl:text-right"
                        >
                            <span className="text-3xl block">{item.icon}</span>
                            <h3 className="text-lg font-bold font-serif text-gray-950 dark:text-white">
                                {item.region}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {item.port}
                            </p>
                            <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
                                <span className="text-xs font-bold text-primary block">
                                    {isArabic ? "متوسط مدة الإبحار:" : "Est. Transit Time:"}
                                </span>
                                <span className="text-base font-black font-serif text-gray-900 dark:text-white">
                                    {item.time}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Packaging & Incoterms Specs */}
                <div className="space-y-6">
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-center">
                        {isArabic ? "معايير التعبئة وحماية الشحنات" : "Packaging Security & Documentation"}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                        {specs.map((spec, i) => (
                            <div
                                key={i}
                                className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-850 shadow-sm space-y-3 ltr:text-left rtl:text-right"
                            >
                                <h3 className="text-xl font-bold font-serif text-primary">
                                    {spec.title}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-light">
                                    {spec.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Freight Consultation CTA */}
                <div className="p-8 sm:p-12 rounded-3xl bg-gray-900 text-white text-center space-y-6">
                    <h2 className="text-3xl sm:text-4xl font-serif font-bold">
                        {isArabic ? "هل ترغب في حساب تكلفة الشحن لمينائك؟" : "Request a Freight Calculation to Your Port"}
                    </h2>
                    <p className="text-gray-300 max-w-xl mx-auto text-sm sm:text-base font-light">
                        {isArabic
                            ? "أرسل لنا رقم الميناء والكمية التقريبية وسيقوم فريق اللوجستيات بتقديم عرض أسعار يشمل تكلفة الشحن والتأمين."
                            : "Share your target destination port and container volume to receive a landed cost analysis within 24 hours."}
                    </p>
                    <a
                        href="https://wa.me/201065583355?text=Hello%2C%20I%20would%20like%20a%20freight%20quote%20for%20my%20destination%20port"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-8 py-3.5 bg-primary text-secondary font-bold rounded-full hover:bg-primary-dark transition-all"
                    >
                        {isArabic ? "طلب تسعير الشحن عبر واتساب" : "Request Freight Quote via WhatsApp"}
                    </a>
                </div>

            </div>
        </main>
    );
}
