import type { Route } from "./+types/about";
import { Link } from "react-router";
import { useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";

export const meta: Route.MetaFunction = () => [
    { title: "About Us | El-Muttahida" },
    {
        name: "description",
        content: "Discover the heritage, master potters, and global vision of El-Muttahida — Egypt's premier handcrafted ceramics exporter.",
    },
];

export default function About() {
    const { lang, dir } = useContext(LanguageContext);
    const isArabic = lang === "ar";

    return (
        <main className="min-h-screen py-28 sm:py-36 px-4 sm:px-6 lg:px-8 bg-surface dark:bg-gray-950 text-secondary dark:text-white transition-colors" dir={dir}>
            <div className="max-w-6xl mx-auto space-y-16 sm:space-y-24">
                
                {/* Hero Header */}
                <div className="text-center max-w-3xl mx-auto space-y-4 sm:space-y-6">
                    <span className="inline-block px-4 py-1 bg-primary/20 text-primary-dark dark:text-primary text-xs font-bold uppercase tracking-widest rounded-full">
                        {isArabic ? "تراث الخزف المصري العريق" : "Heritage & Master Pottery"}
                    </span>
                    <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-black tracking-tight leading-tight">
                        {isArabic ? "قصة المتحدة للفخار والخزف" : "The El-Muttahida Story"}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-base sm:text-xl font-light leading-relaxed">
                        {isArabic
                            ? "من طمي النيل المبارك وعبر أجيال من الخزافين المصريين، نصنع مزهريات سيراميك فريدة تلهم مهندسي الديكور والموزعين في أكثر من 74 دولة."
                            : "Forged from Nile River Delta clay and honed across generations of Egyptian master artisans, we create architectural pottery that elevates prestigious retail and interior spaces worldwide."}
                    </p>
                </div>

                {/* Imagery & Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center">
                    <div className="relative h-[400px] sm:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                        <img
                            src="/assets/hero.png"
                            alt="Pottery Craftsmanship"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                        <div className="absolute bottom-6 sm:bottom-8 ltr:left-6 sm:ltr:left-8 rtl:right-6 sm:rtl:right-8 text-white">
                            <span className="text-xs uppercase tracking-widest text-primary font-bold block mb-1">
                                {isArabic ? "ورش العمل والحرف اليدوية" : "Artisan Studio"}
                            </span>
                            <h3 className="text-2xl font-serif font-bold">
                                {isArabic ? "أصالة الصناعة اليدوية المصرية" : "Authentic Hand-Turned Nile Clay"}
                            </h3>
                        </div>
                    </div>

                    <div className="space-y-6 sm:space-y-8 ltr:text-left rtl:text-right">
                        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 dark:text-white">
                            {isArabic ? "رؤيتنا: الجمع بين عراقة الماضي وبساطة الحاضر" : "Our Vision: Ancient Roots, Modern Aesthetic"}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base leading-relaxed">
                            {isArabic
                                ? "تأسست شركة المتحدة برؤية واضحة: إحياء الفنون الخزفية المصرية التاريخية وتقديمها للعالم وفق أرقى معايير الجودة المعمارية والتصميم المودرن. ننتقي رواسب الطمي الغنية بالمعادن من وادي النيل ونمزجها مع تقنيات حرق الأفران المتقدمة والتشطيبات الحصرية."
                                : "El-Muttahida was founded with a singular conviction: to share Egypt's millennia-old ceramic mastery with the contemporary design world. We harvest mineral-rich alluvial clays, hand-throw every vessel, and employ eco-friendly firing methods to deliver museum-quality durability for hospitality, residential, and boutique retail clients."}
                        </p>
                        
                        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                            <div>
                                <span className="block text-2xl sm:text-4xl font-black font-serif text-primary">74+</span>
                                <span className="text-xs text-gray-500 uppercase tracking-wider">{isArabic ? "دولة نصدر لها" : "Export Markets"}</span>
                            </div>
                            <div>
                                <span className="block text-2xl sm:text-4xl font-black font-serif text-primary">500+</span>
                                <span className="text-xs text-gray-500 uppercase tracking-wider">{isArabic ? "شريك وموزع" : "B2B Partners"}</span>
                            </div>
                            <div>
                                <span className="block text-2xl sm:text-4xl font-black font-serif text-primary">100%</span>
                                <span className="text-xs text-gray-500 uppercase tracking-wider">{isArabic ? "طمي طبيعي نقي" : "Natural Nile Clay"}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Company Values */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                    <div className="p-8 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-850 shadow-sm space-y-4 ltr:text-left rtl:text-right">
                        <div className="h-12 w-12 rounded-xl bg-primary/20 text-primary-dark dark:text-primary flex items-center justify-center text-2xl">
                            🏺
                        </div>
                        <h3 className="text-xl font-bold font-serif">{isArabic ? "حرفية متوارثة" : "Living Heritage"}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                            {isArabic
                                ? "يعمل خبراؤنا الخزافون بأساليب متوارثة مع تدريب مستمر على أدق تفاصيل التشكيل والنقش والتعتيق."
                                : "Our potters bring generational know-how, perfecting wheel balance and artistic texturing that cannot be replicated by factory machines."}
                        </p>
                    </div>

                    <div className="p-8 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-850 shadow-sm space-y-4 ltr:text-left rtl:text-right">
                        <div className="h-12 w-12 rounded-xl bg-primary/20 text-primary-dark dark:text-primary flex items-center justify-center text-2xl">
                            🌿
                        </div>
                        <h3 className="text-xl font-bold font-serif">{isArabic ? "طين نقي ومستدام" : "Eco Sourcing"}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                            {isArabic
                                ? "نلتزم بنسبة 100% بمواد خام طبيعية قابلة للتحلل بدون أية ملدنات كيميائية ضارة أو طلاءات سامة."
                                : "Every vessel is 100% non-toxic, non-plastic, and fully biodegradable, sourcing sustainable clays from agricultural canal sediment."}
                        </p>
                    </div>

                    <div className="p-8 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-850 shadow-sm space-y-4 ltr:text-left rtl:text-right">
                        <div className="h-12 w-12 rounded-xl bg-primary/20 text-primary-dark dark:text-primary flex items-center justify-center text-2xl">
                            🚢
                        </div>
                        <h3 className="text-xl font-bold font-serif">{isArabic ? "تصدير عالمي محمي" : "Certified Freight"}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                            {isArabic
                                ? "تغليف معتمد لاختبارات السقوط وشحن آمن عبر طبالي مبخرة تضمن وصول المزهريات سالمة لأي مكان في العالم."
                                : "Drop-tested packaging and ISPM-15 export pallets ensure seamless ocean and air logistics with near-zero breakage rates."}
                        </p>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="p-8 sm:p-14 rounded-3xl bg-secondary dark:bg-gray-900 text-white text-center space-y-6">
                    <h2 className="text-3xl sm:text-4xl font-serif font-bold">
                        {isArabic ? "هل ترغب في التعاون التجاري معنا؟" : "Ready to Distribute Our Collections?"}
                    </h2>
                    <p className="text-gray-300 max-w-xl mx-auto text-sm sm:text-base">
                        {isArabic
                            ? "نوفر للموزعين والمتاجر كتالوجات مخصصة بأسعار الجملة، مع إمكانية إنتاج تصاميم حصرية."
                            : "We partner with high-end retailers, interior designers, and hotel developers. Explore our catalogue or get in touch today."}
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 pt-2">
                        <Link to="/catalogue" className="px-8 py-3.5 bg-primary text-secondary font-bold rounded-full hover:bg-primary-dark transition-all">
                            {isArabic ? "استعراض الكتالوج" : "Explore Catalogue"}
                        </Link>
                        <Link to="/contact" className="px-8 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-full transition-all">
                            {isArabic ? "تواصل معنا" : "Contact Our Team"}
                        </Link>
                    </div>
                </div>

            </div>
        </main>
    );
}
