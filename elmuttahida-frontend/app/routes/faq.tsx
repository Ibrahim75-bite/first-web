import type { Route } from "./+types/faq";
import { Link } from "react-router";
import { useContext, useState } from "react";
import { LanguageContext } from "../context/LanguageContext";

export const meta: Route.MetaFunction = () => [
    { title: "Frequently Asked Questions | El-Muttahida" },
    {
        name: "description",
        content: "Answers to common questions regarding wholesale ceramics ordering, shipping, custom finishes, and breakage guarantees at El-Muttahida.",
    },
];

export default function FAQ() {
    const { lang, dir } = useContext(LanguageContext);
    const isArabic = lang === "ar";
    const [openIdx, setOpenIdx] = useState<number | null>(0);

    const toggleAccordion = (idx: number) => {
        setOpenIdx(openIdx === idx ? null : idx);
    };

    const faqs = [
        {
            q: isArabic ? "ما هو الحد الأدنى للطلب (MOQ) للمزهريات؟" : "What is the Minimum Order Quantity (MOQ) for wholesale orders?",
            a: isArabic
                ? "يبدأ الحد الأدنى للطلب القياسي من 20 قطعة لكل موديل أو لون، مع حد أدنى إجمالي للشحنة قدره 100 قطعة لتمكين التجهيز على طبالي خشبية آمنة وموفرة في الشحن."
                : "Our standard MOQ starts at 20 pieces per design/glaze variant, with a consolidated shipment threshold of 100 pieces to ensure cost-effective palletization.",
        },
        {
            q: isArabic ? "هل يمكن تصنيع مقاسات خاصة أو حفر شعار علامتنا التجارية؟" : "Can you fabricate custom dimensions or stamp our private-label brand?",
            a: isArabic
                ? "نعم، نقدم خدمة التشطيب والتصنيع الحصري (Bespoke Manufacturing). يمكننا حفر شعاركم في قاعدة الفخار وتعديل الارتفاع والأقطار وإنتاج ألوان حصرية لعلامتكم."
                : "Yes, our master potters execute bespoke private-label orders, including debossed maker's marks, custom neck apertures, and exclusive Pantone-matched glaze formulas.",
        },
        {
            q: isArabic ? "كيف تضمنون وصول الفخار سليمًا دون كسر أثناء الشحن البحري؟" : "How do you protect fragile ceramic vases during long ocean transit?",
            a: isArabic
                ? "نستخدم كرتون مزدوج عالي القوة (5-ply) مع أغلفة رغوية ممتصة للصدمات خضعت لاختبارات السقوط، وتُرص الصناديق على طبالي خشبية مبخرة بشهادة ISPM-15 ومربوطة بأحزمة فولاذية وغلاف بلاستيكي محكم."
                : "Each piece is cradled in engineered impact honeycomb sleeves inside 5-ply cartons, banded onto ISPM-15 heat-treated export pallets with edge protectors and shrink wrap.",
        },
        {
            q: isArabic ? "ماذا يحدث في حال حدوث كسر أثناء الشحن؟" : "What is your replacement policy if items are damaged in transit?",
            a: isArabic
                ? "في حال وصول أي قطعة متضررة، يكفي إرسال صور واضحة خلال 7 أيام من الاستلام. نقوم بتعويضكم الفوري عبر رصيد خصم مالي أو إعادة تصنيع القطع وشحنها مجانًا."
                : "In the rare event of damage, notify us with photographic proof within 7 days of delivery. We provide an immediate invoice credit or free expedited remanufacture.",
        },
        {
            q: isArabic ? "هل يمكن طلب عينات مادية قبل اعتماد الطلبية الكبيرة؟" : "Can we order physical sample pieces before placing a container order?",
            a: isArabic
                ? "نعم، نوفر خدمة شحن العينات الجوية السريعة عبر DHL/FedEx (3-5 أيام). وتُخصم تكلفة العينة بالكامل من قيمة أول طلبية تجارية تقوم بتأكيدها."
                : "Absolutely. We ship pre-production finish samples via DHL/FedEx door-to-door. 100% of the sample cost is deducted from your subsequent wholesale purchase order.",
        },
        {
            q: isArabic ? "ما هي شروط الدفع المعتمدة؟" : "What are your accepted commercial payment terms?",
            a: isArabic
                ? "نقبل التحويلات البنكية المباشرة (T/T) بشروط قياسية: 50% دفعة مقدمة لبدء التصنيع و50% قبل الشحن أو مقابل بوليصة الشحن، كما نقبل خطابات الاعتماد (L/C) للحاويات الكبيرة."
                : "We accept bank wire transfers (T/T) structured as a 50% advance deposit with the remaining 50% due prior to dispatch or against B/L, alongside confirmed Irrevocable Letters of Credit.",
        },
        {
            q: isArabic ? "هل طمي النيل المستخدم آمن وخالٍ من المواد السامة؟" : "Are your ceramics and glazes certified non-toxic?",
            a: isArabic
                ? "نعم، نستخدم طمي النيل الطبيعي بنسبة 100%، وخالي تمامًا من الرصاص والكادميوم، ومناسب لديكورات المنازل والفنادق والمطاعم الراقية."
                : "Yes, our clay is 100% natural and our kiln glazes are formulated completely lead-free and cadmium-free, meeting international safety and eco standards.",
        },
    ];

    return (
        <main className="min-h-screen py-28 sm:py-36 px-4 sm:px-6 lg:px-8 bg-surface dark:bg-gray-950 text-secondary dark:text-white transition-colors" dir={dir}>
            <div className="max-w-4xl mx-auto space-y-16 sm:space-y-24">
                
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto space-y-4 sm:space-y-6">
                    <span className="inline-block px-4 py-1 bg-primary/20 text-primary-dark dark:text-primary text-xs font-bold uppercase tracking-widest rounded-full">
                        {isArabic ? "مركز المساعدة والاستفسارات" : "Support & Common Questions"}
                    </span>
                    <h1 className="text-4xl sm:text-6xl font-serif font-black tracking-tight leading-tight">
                        {isArabic ? "الأسئلة الشائعة" : "Frequently Asked Questions"}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-base sm:text-xl font-light leading-relaxed">
                        {isArabic
                            ? "إجابات مفصلة حول كل ما يتعلق بطلبيات الجملة، الشحن الدولي، التخصيص، وسياسات الضمان."
                            : "Clear, transparent answers on commercial terms, shipping logistics, custom glazes, and quality guarantees."}
                    </p>
                </div>

                {/* FAQ Accordion */}
                <div className="space-y-4 ltr:text-left rtl:text-right">
                    {faqs.map((faq, idx) => {
                        const isOpen = openIdx === idx;
                        return (
                            <div
                                key={idx}
                                className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-850 overflow-hidden shadow-sm transition-all"
                            >
                                <button
                                    onClick={() => toggleAccordion(idx)}
                                    className="w-full flex items-center justify-between p-6 sm:p-7 text-left rtl:text-right font-serif font-bold text-lg sm:text-xl text-gray-900 dark:text-white hover:text-primary transition-colors gap-4"
                                >
                                    <span>{faq.q}</span>
                                    <span className={`h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-sm font-black flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 bg-primary text-secondary" : ""}`}>
                                        ↓
                                    </span>
                                </button>
                                {isOpen && (
                                    <div className="px-6 pb-7 text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed border-t border-gray-100 dark:border-gray-850 pt-4 font-light">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Still Have Questions CTA */}
                <div className="p-8 sm:p-12 rounded-3xl bg-secondary dark:bg-gray-900 text-white text-center space-y-5">
                    <h3 className="text-2xl sm:text-3xl font-serif font-bold">
                        {isArabic ? "هل لديك استفسار آخر لم تجد إجابته؟" : "Have Another Question?"}
                    </h3>
                    <p className="text-gray-300 max-w-lg mx-auto text-sm sm:text-base font-light">
                        {isArabic
                            ? "تواصل مباشرة مع خبير التصدير لدينا وسنرد على كافة التفاصيل فورًا."
                            : "Our export specialists are available on WhatsApp and email to assist your project planning."}
                    </p>
                    <a
                        href="https://wa.me/201065583355"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-8 py-3.5 bg-primary text-secondary font-bold rounded-full hover:bg-primary-dark transition-all"
                    >
                        {isArabic ? "محادثة فورية على واتساب" : "Chat Directly on WhatsApp"}
                    </a>
                </div>

            </div>
        </main>
    );
}
