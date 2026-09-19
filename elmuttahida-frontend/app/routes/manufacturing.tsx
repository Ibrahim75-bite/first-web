import type { Route } from "./+types/manufacturing";
import { Link } from "react-router";
import { useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";

export const meta: Route.MetaFunction = () => [
    { title: "Manufacturing Process | El-Muttahida" },
    {
        name: "description",
        content: "Discover our 5-step master pottery manufacturing process: from Nile clay extraction to kiln firing and artisanal finishing.",
    },
];

export default function Manufacturing() {
    const { lang, dir } = useContext(LanguageContext);
    const isArabic = lang === "ar";

    const steps = [
        {
            num: "01",
            title: isArabic ? "استخراج الطمي وتصفيته" : "Nile Clay Harvesting & Slurry Refining",
            desc: isArabic
                ? "نستخرج طمي النيل الغني بالمعادن من رواسب وادي النيل، ونقوم بغربلته وتصفيته في أحواض مائية لإزالة الشوائب للحصول على قوام طيني متجانس فائق النقاء."
                : "Alluvial clay is sustainably harvested from Nile sediment basins and washed in settling tanks to remove organic gravel, producing a plastic, mineral-rich ceramic dough.",
            icon: "🏺",
        },
        {
            num: "02",
            title: isArabic ? "التشكيل على الدولاب الخزفي" : "Wheel-Throwing & Sculptural Shaping",
            desc: isArabic
                ? "يقوم الحرفيون المحترفون بتشكيل كل مزهرية يدويًا على دواليب الخزف التقليدية مع ضبط النسب الهندسية وسماكة الجدران لضمان التوازن المثالي."
                : "Master potters center each batch on traditional potter's wheels, pulling the walls to calibrated architectural thicknesses to achieve balanced symmetry and structural integrity.",
            icon: "🌀",
        },
        {
            num: "03",
            title: isArabic ? "التجفيف الطبيعي وحرق البسكويت (1050° م)" : "Solar Curing & Bisque Firing (1,050°C)",
            desc: isArabic
                ? "تُجفف القطع ببطء في ساحات التجفيف المشمسة لتجنب التشققات، ثم تُدخل أفران الحرق الأولى عند درجة حرارة 1050 مئوية لتتحول إلى سيراميك متماسك عالي الصلابة."
                : "Greenware vessels dry slowly under controlled solar sheds before entering computerized gas kilns for a 14-hour bisque firing at 1,050°C, transforming raw clay into durable ceramic stone.",
            icon: "🔥",
        },
        {
            num: "04",
            title: isArabic ? "التزجيج والتشطيبات الحرفية الخاصة" : "Artisanal Glazing & Mineral Patinas",
            desc: isArabic
                ? "تُغطى المزهريات بخلطات زجاجية ومعدنية حصرية، من المطفي الترابي (Matte Terra) إلى الزجاج اللامع والنقوش المحفورة يدويًا، مع حرق ثانٍ لتثبيت اللون."
                : "Specialized glazes formulated from copper, cobalt, and iron oxides are hand-dipped or air-sprayed, followed by a secondary glaze firing that bonds pigments indelibly to the clay body.",
            icon: "✨",
        },
        {
            num: "05",
            title: isArabic ? "الفحص الصوتي والتغليف للتصدير" : "Acoustic Resonance QA & Pallet Packing",
            desc: isArabic
                ? "تخضع كل قطعة لاختبار الرنين الصوتي للتأكد من خلوها من أي شروخ دقيقة داخلية، ثم تُغلف برغوة ممتصة للصدمات وتُرص على طبالي خشبية مبخرة معتمدة للشحن الدولي."
                : "Every piece undergoes an acoustic resonance test to detect microscopic stress fissures. Approved vessels are nested in honeycomb impact cartons and strapped onto ISPM-15 export pallets.",
            icon: "📦",
        },
    ];

    return (
        <main className="min-h-screen py-28 sm:py-36 px-4 sm:px-6 lg:px-8 bg-surface dark:bg-gray-950 text-secondary dark:text-white transition-colors" dir={dir}>
            <div className="max-w-6xl mx-auto space-y-16 sm:space-y-24">
                
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto space-y-4 sm:space-y-6">
                    <span className="inline-block px-4 py-1 bg-primary/20 text-primary-dark dark:text-primary text-xs font-bold uppercase tracking-widest rounded-full">
                        {isArabic ? "دقة التصنيع ومطابقة الجودة" : "Craftsmanship & Industrial Rigor"}
                    </span>
                    <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-black tracking-tight leading-tight">
                        {isArabic ? "مراحل تصنيع الفخار والخزف" : "Our Manufacturing Process"}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-base sm:text-xl font-light leading-relaxed">
                        {isArabic
                            ? "اكتشف الخطوات الدقيقة التي تمر بها كل مزهرية من لحظة استخراج الطمي الطبيعي وحتى خروجها كقطعة فنية معتمدة للتصدير."
                            : "From raw Egyptian river mud to high-fired architectural artifacts: how our artisans balance ancient wheel-turning with modern export standards."}
                    </p>
                </div>

                {/* Steps Timeline */}
                <div className="space-y-8 sm:space-y-12">
                    {steps.map((step) => (
                        <div
                            key={step.num}
                            className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-850 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 sm:gap-10 hover:border-primary/40 transition-all ltr:text-left rtl:text-right"
                        >
                            <div className="flex items-center gap-4 sm:gap-6 flex-shrink-0">
                                <span className="text-3xl sm:text-5xl font-black font-serif text-primary/30 dark:text-primary/40">
                                    {step.num}
                                </span>
                                <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-primary/10 text-primary-dark dark:text-primary flex items-center justify-center text-3xl">
                                    {step.icon}
                                </div>
                            </div>
                            <div className="flex-1 space-y-2 sm:space-y-3">
                                <h3 className="text-xl sm:text-2xl font-bold font-serif text-gray-950 dark:text-white">
                                    {step.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base leading-relaxed font-light">
                                    {step.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="p-8 sm:p-12 rounded-3xl bg-primary text-secondary text-center space-y-6">
                    <h2 className="text-3xl sm:text-4xl font-serif font-bold">
                        {isArabic ? "هل تحتاج إلى تشطيب أو تصميم مخصص؟" : "Need Custom Sizing or Custom Glazes?"}
                    </h2>
                    <p className="text-secondary/80 max-w-xl mx-auto text-sm sm:text-base">
                        {isArabic
                            ? "نوفر للعلامات التجارية والشركات إمكانية ابتكار درجات ألوان خاصة وحفر شعارات على الفخار."
                            : "Our production facility can accommodate bespoke hospitality lines, custom dimensions, and branded stamping."}
                    </p>
                    <Link to="/products/custom-finishes" className="inline-block px-8 py-3.5 bg-secondary text-white font-bold rounded-full hover:bg-black transition-all">
                        {isArabic ? "استكشف التشطيبات الخاصة" : "Explore Custom Finishes"}
                    </Link>
                </div>

            </div>
        </main>
    );
}
