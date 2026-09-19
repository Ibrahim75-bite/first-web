import type { Route } from "./+types/wholesale";
import { Link } from "react-router";
import { useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";

export const meta: Route.MetaFunction = () => [
    { title: "Wholesale & B2B Purchasing Policy | El-Muttahida" },
    {
        name: "description",
        content: "Discover our B2B wholesale policy: MOQ terms, sample requests, volume discounts, lead times, and private label manufacturing.",
    },
];

export default function Wholesale() {
    const { lang, dir } = useContext(LanguageContext);
    const isArabic = lang === "ar";

    const policies = [
        {
            title: isArabic ? "الحد الأدنى للطلبات (MOQ)" : "Minimum Order Quantities (MOQ)",
            desc: isArabic
                ? "يبدأ الحد الأدنى للطلبيات القياسية من 20 قطعة لكل موديل، مع حد أدنى إجمالي للشحنة الواحدة قدره 100 قطعة لتبرير تكلفة التجهيز والشحن."
                : "Standard production runs require an MOQ of 20 pieces per SKU, with a consolidated shipment minimum of 100 total units for pallet freight optimization.",
        },
        {
            title: isArabic ? "سياسة طلب العينات التجريبية" : "Sample Program & Reimbursement",
            desc: isArabic
                ? "نوفر عينات مادية قبل الإنتاج الكامل للتحقق من جودة الطمي والطلاء. يتم خصم قيمة العينات بالكامل من الفاتورة النهائية للطلبية الأولى."
                : "Pre-production samples are available via express courier. The sample fee is fully credited back against your first commercial container or pallet purchase order.",
        },
        {
            title: isArabic ? "خصومات الكميات الكبيرة والحاويات" : "Tiered Volume Discounts",
            desc: isArabic
                ? "نقدم أسعارًا تفضيلية تصاعدية تبدأ من نصف حاوية (LCL)، حاوية 20 قدم كاملة (FCL)، وحاويات 40 قدم مع عقود توريد سنوية ميسرة."
                : "We provide tiered volume pricing for half-container (LCL), 20ft FCL, and 40ft HQ loads, alongside quarterly recurring distributor contracts.",
        },
        {
            title: isArabic ? "المدد الزمنية للإنتاج والتسليم" : "Production Lead Times",
            desc: isArabic
                ? "تتراوح مدة الإنتاج القياسية بين 2 إلى 4 أسابيع للطلبيات المتوسطة، و4 إلى 6 أسابيع للتشطيبات المخصصة ذات الأحجام الكبيرة."
                : "Standard lead times range from 2 to 4 weeks for pallet-scale orders, and 4 to 6 weeks for full container loads requiring custom glazes.",
        },
    ];

    return (
        <main className="min-h-screen py-28 sm:py-36 px-4 sm:px-6 lg:px-8 bg-surface dark:bg-gray-950 text-secondary dark:text-white transition-colors" dir={dir}>
            <div className="max-w-6xl mx-auto space-y-16 sm:space-y-24">
                
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto space-y-4 sm:space-y-6">
                    <span className="inline-block px-4 py-1 bg-primary/20 text-primary-dark dark:text-primary text-xs font-bold uppercase tracking-widest rounded-full">
                        {isArabic ? "برنامج التوريد والبيع بالجملة" : "B2B Commercial Terms"}
                    </span>
                    <h1 className="text-4xl sm:text-6xl font-serif font-black tracking-tight leading-tight">
                        {isArabic ? "سياسة البيع بالجملة والتوزيع" : "Wholesale Purchasing Policy"}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-base sm:text-xl font-light leading-relaxed">
                        {isArabic
                            ? "كل ما يهم المستوردين والموزعين حول شروط التوريد، الحدود الدنيا، وعقود التصنيع المباشر من المصنع."
                            : "Transparent, reliable wholesale conditions crafted to empower retailers, hospitality buyers, and interior architecture studios worldwide."}
                    </p>
                </div>

                {/* Policies Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
                    {policies.map((p, idx) => (
                        <div
                            key={idx}
                            className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-850 shadow-sm space-y-3 ltr:text-left rtl:text-right"
                        >
                            <h3 className="text-xl sm:text-2xl font-bold font-serif text-primary">
                                {p.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base leading-relaxed font-light">
                                {p.desc}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Action Card */}
                <div className="p-8 sm:p-14 rounded-3xl bg-secondary dark:bg-gray-900 text-white text-center space-y-6">
                    <h2 className="text-3xl sm:text-4xl font-serif font-bold">
                        {isArabic ? "ابدأ طلبك بالجملة اليوم" : "Request Wholesale Access & Pricing"}
                    </h2>
                    <p className="text-gray-300 max-w-xl mx-auto text-sm sm:text-base font-light">
                        {isArabic
                            ? "تواصل مع مدير التصدير للحصول على ملف الكتالوج الكامل وقائمة أسعار الجملة بصيغة PDF."
                            : "Connect with our export desk to receive our wholesale price list and high-resolution line sheets."}
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 pt-2">
                        <Link to="/catalogue" className="px-8 py-3.5 bg-primary text-secondary font-bold rounded-full hover:bg-primary-dark transition-all">
                            {isArabic ? "تصفح الكتالوج" : "Browse Catalogue"}
                        </Link>
                        <a
                            href="https://wa.me/201065583355?text=Hello%2C%20I%20would%20like%20to%20request%20the%20wholesale%20price%20sheet"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-8 py-3.5 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold rounded-full transition-all"
                        >
                            {isArabic ? "طلب قائمة الأسعار عبر واتساب" : "Request Price Sheet via WhatsApp"}
                        </a>
                    </div>
                </div>

            </div>
        </main>
    );
}
