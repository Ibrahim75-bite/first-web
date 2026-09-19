import type { Route } from "./+types/terms";
import { Link } from "react-router";
import { useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";

export const meta: Route.MetaFunction = () => [
    { title: "Terms of Service | El-Muttahida" },
    {
        name: "description",
        content:
            "Commercial terms of service for El-Muttahida Egyptian Handmade Ceramics and B2B Wholesale.",
    },
];

export default function TermsOfService() {
    const { lang, dir } = useContext(LanguageContext);
    const isArabic = lang === "ar";

    return (
        <main className="min-h-screen py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-950 transition-colors" dir={dir}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebPage",
                        name: "El-Muttahida Terms of Service",
                        url: "https://elmuttahida.com/terms",
                    }),
                }}
            />

            <div className="max-w-4xl mx-auto">
                <nav className="mb-6 sm:mb-8">
                    <Link
                        to="/"
                        className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium text-sm inline-flex items-center gap-2"
                    >
                        <span>{isArabic ? "→" : "←"}</span>
                        <span>{isArabic ? "العودة للرئيسية" : "Back to Home"}</span>
                    </Link>
                </nav>

                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200/80 dark:border-gray-800 p-6 sm:p-12 backdrop-blur-sm">
                    <header className="mb-10 sm:mb-12 border-b border-gray-200 dark:border-gray-800 pb-6 sm:pb-8 ltr:text-left rtl:text-right">
                        <span className="inline-block px-3 py-1 bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 text-xs font-bold rounded-full mb-3 uppercase tracking-wider">
                            {isArabic ? "الشروط التجارية والقانونية" : "Commercial & Legal Terms"}
                        </span>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-950 dark:text-white tracking-tight mb-3 font-serif">
                            {isArabic ? "شروط الخدمة والتعامل التجاري" : "Terms of Service"}
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                            {isArabic ? "آخر تحديث: أبريل 2026 | سارية لجميع اتفاقيات التوريد والبيع بالجملة" : "Last Updated: April 2026 | Governs all B2B wholesale orders and supply contracts"}
                        </p>
                    </header>

                    <div className="space-y-8 sm:space-y-10 text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base ltr:text-left rtl:text-right">
                        
                        {/* 1. Scope & Acceptance */}
                        <section className="space-y-3">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-950 dark:text-white flex items-center gap-3">
                                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 text-sm font-black">1</span>
                                <span>{isArabic ? "نطاق الاتفاقية وقبول الشروط" : "Scope of Agreement & Acceptance"}</span>
                            </h2>
                            <p>
                                {isArabic
                                    ? "تنطبق هذه الشروط والأحكام على كافة المعاملات التجارية، عروض الأسعار، طلبات التوريد بالجملة، والخدمات المصنعية المبرمة مع شركة المتحدة للفنون الخزفية. يُعد تقديم طلب شراء أو اعتماد فاتورة أولية (Pro-forma Invoice) موافقة صريحة وكاملة على هذه الشروط."
                                    : "These Terms of Service govern all business-to-business transactions, price quotations, wholesale purchase orders, and bespoke pottery manufacturing provided by El-Muttahida. Placing an inquiry, issuing a purchase order, or approving a Pro-Forma Invoice constitutes binding agreement to these Terms."}
                            </p>
                        </section>

                        {/* 2. Commercial Wholesale & Minimum Order Quantities (MOQ) */}
                        <section className="space-y-3">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-950 dark:text-white flex items-center gap-3">
                                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 text-sm font-black">2</span>
                                <span>{isArabic ? "الحد الأدنى للطلبات والأسعار (MOQ)" : "Minimum Order Quantities (MOQ) & Pricing"}</span>
                            </h2>
                            <p>
                                {isArabic
                                    ? "نعمل بنموذج البيع بالجملة المباشر من المصنع (B2B). يخضع كل تصميم لمزهرية لحد أدنى للطلب (MOQ) يوضح في عرض السعر الرسمي (يبدأ عادة من 20 إلى 50 قطعة لكل موديل). الأسعار المقدمة تعتمد على حجم الطلب الإجمالي، نوع الطلاء، ونظام الشحن المعتمد وتظل صالحة لمدة 30 يومًا من تاريخ الإصدار."
                                    : "El-Muttahida operates as a direct B2B manufacturer. Each vase design carries a Minimum Order Quantity (MOQ) specified in our formal quotation (typically 20–50 pieces per SKU). Quotations are calibrated based on production volume, custom finish complexity, and selected shipping terms, valid for 30 calendar days."}
                            </p>
                        </section>

                        {/* 3. Handmade Tolerances & Artisanal Nature */}
                        <section className="space-y-3">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-950 dark:text-white flex items-center gap-3">
                                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 text-sm font-black">3</span>
                                <span>{isArabic ? "طبيعة الفخار اليدوي والتفاوت الحرفي" : "Artisanal Tolerances & Handmade Characteristics"}</span>
                            </h2>
                            <p>
                                {isArabic
                                    ? "يتم تشكيل وصقل مزهرياتنا يدويًا من طمي النيل الطبيعي وتُحرق في أفران الفخار التقليدية. لذلك، فإن الاختلافات الطفيفة في درجات التعتيق، تموجات اللون، أو الأبعاد في حدود (±3% إلى ±5%) تُعد سمات أصلية تعبر عن قيمة الصنعة اليدوية ولا تُعتبر عيوبًا مصنعية."
                                    : "Our ceramics are individually shaped and hand-finished from authentic Nile clay and fired in artisan kilns. Slight variations in organic glaze pigmentation, surface texture, and dimensional variances within ±3% to ±5% are natural hallmarks of master craftsmanship and do not constitute manufacturing defects."}
                            </p>
                        </section>

                        {/* 4. Custom Finishes & Pre-Production Samples */}
                        <section className="space-y-3">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-950 dark:text-white flex items-center gap-3">
                                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 text-sm font-black">4</span>
                                <span>{isArabic ? "التشطيبات الخاصة وعينات الإنتاج" : "Custom Finishes & Sample Approvals"}</span>
                            </h2>
                            <p>
                                {isArabic
                                    ? "للطلبيات التي تتطلب تشطيبات زجاجية مخصصة أو ألوان حصرية لعلامات تجارية، نقوم بإنتاج عينة تجريبية (Golden Sample) للاعتماد قبل بدء خط الإنتاج الكامل. بعد اعتماد العينة خطيًا أو عبر واتساب، يتم تطبيق المعيار المتفق عليه على كامل كمية الدفعة."
                                    : "For projects requiring bespoke color palettes, glazes, or engraved branding, a pre-production 'Golden Sample' is fabricated for client sign-off. Full-scale batch production commences only upon written confirmation of the physical sample or photo approval."}
                            </p>
                        </section>

                        {/* 5. Payment Terms & Invoicing */}
                        <section className="space-y-3">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-950 dark:text-white flex items-center gap-3">
                                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 text-sm font-black">5</span>
                                <span>{isArabic ? "شروط السداد والفواتير" : "Payment Terms & Invoicing"}</span>
                            </h2>
                            <p>
                                {isArabic
                                    ? "تتم المعاملات التجارية عبر التحويلات البنكية الرسمية (T/T Wire Transfer) أو خطابات الاعتماد المستندي غير القابلة للإلغاء (L/C at sight) للطلبيات الكبيرة. الشروط القياسية: 50% دفعة مقدمة عند تأكيد الطلب وبدء التصنيع، و50% الرصيد المتبقي قبل الشحن أو مقابل تسليم بوليصة الشحن (B/L)."
                                    : "Commercial transactions are settled via bank wire transfer (T/T) or confirmed Irrevocable Letters of Credit (L/C at sight) for container volumes. Standard payment terms are 50% advance deposit upon order placement to initiate manufacturing, with the remaining 50% balance due prior to dispatch or against Bill of Lading documentation."}
                            </p>
                        </section>

                        {/* 6. Packaging, Palletization & International Shipping */}
                        <section className="space-y-3">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-950 dark:text-white flex items-center gap-3">
                                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 text-sm font-black">6</span>
                                <span>{isArabic ? "التعبئة والتغليف وشروط الشحن (Incoterms)" : "Packaging, Palletization & Export Incoterms"}</span>
                            </h2>
                            <p>
                                {isArabic
                                    ? "تُغلف كل مزهرية بغلاف فقاعي مضاد للصدمات مع كرتون مزدوج الجدار، وتُرص البضائع على طبالي خشبية معالجة حراريًا ومبخرة بشهادة ISPM-15 الرسمية. ندعم شروط الشحن الدولية القياسية (EXW المصنع، FOB ميناء الإسكندرية / دمياط، CIF لميناء المشتري، وDDP لبعض الوجهات المحددة)."
                                    : "All items are packed with drop-tested multi-layer impact cushioning inside 5-ply double-wall cartons, loaded onto ISPM-15 certified heat-treated fumigated wooden pallets. We support standard Incoterms including EXW (Factory), FOB (Alexandria / Damietta), CIF (Destination Port), and DDP by special arrangement."}
                            </p>
                        </section>

                        {/* 7. Inspection, Damage Claims & Remedies */}
                        <section className="space-y-3">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-950 dark:text-white flex items-center gap-3">
                                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 text-sm font-black">7</span>
                                <span>{isArabic ? "الفحص، مطالبات الكسر والتعويض" : "Cargo Inspection, Breakage Claims & Remedies"}</span>
                            </h2>
                            <p>
                                {isArabic
                                    ? "يجب على المشتري فحص الشحنة فور وصولها. في حال حدوث كسر أثناء الشحن البحري أو الجوي، يجب تقديم إشعار كتابي مرفق بصور واضحة خلال 7 أيام عمل من تاريخ الاستلام. تقدم الشركة تعويضًا فوريًا عبر رصيد خصم في الشحنة التالية أو إعادة تصنيع القطع البديلة مجانًا."
                                    : "Buyers must inspect received pallets upon arrival. In the rare event of transit breakage, written notice with clear photographic evidence must be submitted within 7 business days of delivery. El-Muttahida will provide immediate credit adjustment against future orders or complimentary re-fabrication of affected pieces."}
                            </p>
                        </section>

                        {/* 8. Intellectual Property & Governing Law */}
                        <section className="space-y-3">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-950 dark:text-white flex items-center gap-3">
                                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 text-sm font-black">8</span>
                                <span>{isArabic ? "الملكية الفكرية وفض النزاعات" : "Intellectual Property & Governing Law"}</span>
                            </h2>
                            <p>
                                {isArabic
                                    ? "جميع تصاميم المزهريات الأصلية وصور المنتجات والعلامة التجارية 'EL MUTTAHIDA' هي ملكية حصرية للشركة ومحمية بقوانين الملكية الفكرية. تخضع كافة الاتفاقيات لقوانين جمهورية مصر العربية والاتفاقيات الدولية للتجارة، وتختص محاكم القاهرة الاقتصادية بفض أي نزاع قد ينشأ."
                                    : "All original pottery sculpts, product photography, and the 'EL MUTTAHIDA' trademark are the exclusive intellectual property of the company. Contracts are governed by the laws of the Arab Republic of Egypt, with commercial disputes subject to the jurisdiction of the Cairo Commercial Court or agreed international arbitration."}
                            </p>
                        </section>

                    </div>
                </div>
            </div>
        </main>
    );
}
