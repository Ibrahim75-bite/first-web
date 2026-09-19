import type { Route } from "./+types/careers";
import { Link } from "react-router";
import { useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";

export const meta: Route.MetaFunction = () => [
    { title: "Careers & Join Our Craft | El-Muttahida" },
    {
        name: "description",
        content: "Explore career opportunities at El-Muttahida: master pottery, international export sales, and ceramics quality control.",
    },
];

export default function Careers() {
    const { lang, dir } = useContext(LanguageContext);
    const isArabic = lang === "ar";

    const jobs = [
        {
            title: isArabic ? "مسؤول مبيعات التصدير الدولي (B2B Export Executive)" : "International B2B Export Sales Executive",
            dept: isArabic ? "إدارة التصدير والمبيعات" : "Export & Commercial Desk",
            type: isArabic ? "دوام كامل (القاهرة / هجين)" : "Full-time (Cairo / Hybrid)",
            desc: isArabic
                ? "إدارة العلاقات مع الموزعين في أوروبا والخليج وأمريكا الشمالية، ومتابعة عروض أسعار الشحنات والحاويات وإغلاق الصفقات التجارية."
                : "Manage wholesale distributor relationships across Europe, GCC, and the Americas. Prepare container-load quotations and drive trade expansion.",
        },
        {
            title: isArabic ? "خبير تشكيل ودواليب فخار (Master Ceramic Artisan)" : "Master Ceramic Potter / Wheel Artisan",
            dept: isArabic ? "ورش الإنتاج والحرف اليدوية" : "Production & Kiln Studios",
            type: isArabic ? "دوام كامل (القاهرة / قنا)" : "Full-time (Cairo / Qena)",
            desc: isArabic
                ? "خبرة لا تقل عن 5 سنوات في التشكيل اليدوي على الدولاب وسحب جدران المزهريات الكبيرة بدقة هندسية عالية ومعايير تصديرية."
                : "Minimum 5 years of wheel-throwing experience pulling large-format vessels, calibrated architectural wall tolerances, and bespoke glazes.",
        },
        {
            title: isArabic ? "أخصائي لوجستيات شحن وتخليص جمركي (Freight & Logistics Specialist)" : "Export Logistics & Forwarding Specialist",
            dept: isArabic ? "سلاسل الإمداد والشحن البحري" : "Supply Chain & Ocean Freight",
            type: isArabic ? "دوام كامل (القاهرة / الإسكندرية)" : "Full-time (Cairo / Alexandria)",
            desc: isArabic
                ? "متابعة حجوزات الحاويات (FOB/CIF)، إصدار شهادات المنشأ المصرية، وتوثيق شهادات تبخير الطبالي والتخليص الجمركي الفوري."
                : "Oversee ocean freight bookings (20ft/40ft HQ), coordinate ISPM-15 phytosanitary documentation, bills of lading, and port customs clearance.",
        },
    ];

    return (
        <main className="min-h-screen py-28 sm:py-36 px-4 sm:px-6 lg:px-8 bg-surface dark:bg-gray-950 text-secondary dark:text-white transition-colors" dir={dir}>
            <div className="max-w-5xl mx-auto space-y-16 sm:space-y-24">
                
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto space-y-4 sm:space-y-6">
                    <span className="inline-block px-4 py-1 bg-primary/20 text-primary-dark dark:text-primary text-xs font-bold uppercase tracking-widest rounded-full">
                        {isArabic ? "انضم لفريق العمل" : "Work With Us"}
                    </span>
                    <h1 className="text-4xl sm:text-6xl font-serif font-black tracking-tight leading-tight">
                        {isArabic ? "الوظائف وفرص الانضمام" : "Careers at El-Muttahida"}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-base sm:text-xl font-light leading-relaxed">
                        {isArabic
                            ? "نبحث دائمًا عن الشغوفين بالحرفية المصرية العريقة والتميز في التجارة الدولية. ساهم معنا في تصدير الجمال للعالم."
                            : "Be part of an ambitious Egyptian brand bringing timeless handcrafted heritage to the world's most prestigious commercial spaces."}
                    </p>
                </div>

                {/* Job List */}
                <div className="space-y-6">
                    {jobs.map((job, idx) => (
                        <div
                            key={idx}
                            className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-850 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-primary/40 transition-all ltr:text-left rtl:text-right"
                        >
                            <div className="space-y-2 flex-1">
                                <div className="flex flex-wrap gap-2 text-xs font-semibold text-primary">
                                    <span className="px-2.5 py-0.5 rounded-full bg-primary/10">{job.dept}</span>
                                    <span className="px-2.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">{job.type}</span>
                                </div>
                                <h3 className="text-xl sm:text-2xl font-bold font-serif text-gray-950 dark:text-white">
                                    {job.title}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 font-light leading-relaxed">
                                    {job.desc}
                                </p>
                            </div>
                            <div className="flex-shrink-0">
                                <a
                                    href={`mailto:careers@elmuttahida.com?subject=Application:%20${encodeURIComponent(job.title)}`}
                                    className="inline-block px-6 py-3 bg-secondary dark:bg-gray-800 text-white hover:bg-primary hover:text-secondary text-xs font-bold uppercase tracking-wider rounded-full transition-all"
                                >
                                    {isArabic ? "قدّم الآن" : "Apply Now"}
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Open Inquiries Card */}
                <div className="p-8 sm:p-12 rounded-3xl bg-gray-900 text-white text-center space-y-4">
                    <h3 className="text-2xl font-serif font-bold">
                        {isArabic ? "لم تجد الوظيفة المناسبة؟" : "Don't See Your Exact Role?"}
                    </h3>
                    <p className="text-gray-300 max-w-lg mx-auto text-sm font-light">
                        {isArabic
                            ? "أرسل سيرتك الذاتية أو ملف أعمالك الحرفية إلى: careers@elmuttahida.com وسنتواصل معك عند توفر فرص جديدة."
                            : "We always welcome exceptional potters, glaze chemists, and international sales directors. Send your CV or portfolio to careers@elmuttahida.com."}
                    </p>
                </div>

            </div>
        </main>
    );
}
