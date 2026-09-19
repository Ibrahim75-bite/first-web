import type { Route } from "./+types/sustainability";
import { Link } from "react-router";
import { useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";

export const meta: Route.MetaFunction = () => [
    { title: "Sustainability & Eco-Commitment | El-Muttahida" },
    {
        name: "description",
        content: "Learn how El-Muttahida champions sustainable Egyptian ceramics: biodegradable Nile clay, solar curing, and plastic-free packaging.",
    },
];

export default function Sustainability() {
    const { lang, dir } = useContext(LanguageContext);
    const isArabic = lang === "ar";

    const initiatives = [
        {
            title: isArabic ? "طمي نقي 100% قابل للتحلل" : "100% Biodegradable Natural Clay",
            desc: isArabic
                ? "جميع منتجاتنا مصنوعة من طمي طبيعي مأخوذ من دلتا ووادي النيل خالٍ تمامًا من الرصاص، الملدنات البتروكيماوية، أو المركبات العضوية المتطايرة (VOCs)."
                : "Our clay bodies are derived exclusively from natural alluvial sediments. Completely free of lead, cadmium, or petrochemical stabilizers, our pottery can return to the earth naturally.",
            icon: "🌱",
        },
        {
            title: isArabic ? "التجفيف الشمسي الموفر للطاقة" : "Solar-Assisted Curing Yards",
            desc: isArabic
                ? "نعتمد على شمس مصر الساطعة لتجفيف المزهريات في ساحات مهواة طبيعيًا قبل الحرق، مما يقلل من استهلاك طاقة الوقود بنسبة تزيد عن 40%."
                : "We harness Egypt's abundant solar radiance in naturally ventilated shaded curing yards, eliminating artificial pre-heating and cutting fossil energy consumption by over 40%.",
            icon: "☀️",
        },
        {
            title: isArabic ? "تغليف كرتوني خالٍ من البلاستيك" : "Zero-Plastic Export Packaging",
            desc: isArabic
                ? "استبدلنا فقاعات البلاستيك بغلاف كرتوني مضلع من أوراق معاد تدويرها قابلة للتحلل الحيوي بالكامل، مع طبالي خشبية مستدامة معالجة بيئيًا."
                : "We replaced traditional bubble wraps with biodegradable honeycomb kraft paper buffers and recyclable heavy-duty cardboard, cutting single-use plastics from our export chain.",
            icon: "📦",
        },
        {
            title: isArabic ? "تمكين المجتمع الحرفي والأجور العادلة" : "Artisan Equity & Craft Preservation",
            desc: isArabic
                ? "نوفر لخزافي قنا والفسطاط بيئة عمل آمنة وصحية مع أجور عادلة تتجاوز متوسطات السوق وتأمين صحي، مع برامج لتدريب الشباب على حرفة الخزف الأصيلة."
                : "We invest in the generational heritage of Upper Egyptian and Cairo pottery villages, paying well above statutory living wages, funding healthcare, and apprenticing local youth.",
            icon: "🤝",
        },
    ];

    return (
        <main className="min-h-screen py-28 sm:py-36 px-4 sm:px-6 lg:px-8 bg-surface dark:bg-gray-950 text-secondary dark:text-white transition-colors" dir={dir}>
            <div className="max-w-6xl mx-auto space-y-16 sm:space-y-24">
                
                {/* Hero Header */}
                <div className="text-center max-w-3xl mx-auto space-y-4 sm:space-y-6">
                    <span className="inline-block px-4 py-1 bg-green-500/20 text-green-700 dark:text-green-400 text-xs font-bold uppercase tracking-widest rounded-full">
                        {isArabic ? "الاستدامة والمسؤولية البيئية" : "Ecological Responsibility"}
                    </span>
                    <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-black tracking-tight leading-tight">
                        {isArabic ? "فخار يحترم الأرض والبيئة" : "Crafted in Harmony with Nature"}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-base sm:text-xl font-light leading-relaxed">
                        {isArabic
                            ? "نؤمن بأن الفخار الحقيقي يولد من الأرض ويعود إليها دون أن يترك أثرًا بيئيًا ضارًا. تعرف على معاييرنا البيئية الصارمة."
                            : "Pottery was humanity's original non-toxic vessel. At El-Muttahida, we ensure that ancient wisdom meets contemporary environmental accountability."}
                    </p>
                </div>

                {/* Initiatives Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
                    {initiatives.map((item, idx) => (
                        <div
                            key={idx}
                            className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-850 shadow-sm space-y-4 ltr:text-left rtl:text-right hover:shadow-md transition-shadow"
                        >
                            <div className="h-14 w-14 rounded-2xl bg-green-500/10 text-green-600 dark:text-green-400 flex items-center justify-center text-3xl">
                                {item.icon}
                            </div>
                            <h3 className="text-2xl font-serif font-bold text-gray-950 dark:text-white">
                                {item.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base leading-relaxed font-light">
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Banner CTA */}
                <div className="p-8 sm:p-12 rounded-3xl bg-gray-900 text-white text-center space-y-6">
                    <h2 className="text-3xl sm:text-4xl font-serif font-bold">
                        {isArabic ? "شريك مسؤول لتوريدات الجملة الفاخرة" : "Sustainable Sourcing for Discerning Retailers"}
                    </h2>
                    <p className="text-gray-300 max-w-xl mx-auto text-sm sm:text-base font-light">
                        {isArabic
                            ? "انضم إلى العلامات التجارية التي تضع الاستدامة والمصداقية في مقدمة اختياراتها."
                            : "Align your brand with authentic, certified eco-conscious Egyptian pottery. Download our wholesale catalog today."}
                    </p>
                    <Link to="/catalogue" className="inline-block px-8 py-3.5 bg-primary text-secondary font-bold rounded-full hover:bg-primary-dark transition-all">
                        {isArabic ? "تصفح المنتجات" : "View Sustainable Collections"}
                    </Link>
                </div>

            </div>
        </main>
    );
}
