import type { Route } from "./+types/privacy-policy";
import { Link } from "react-router";
import { useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";

export const meta: Route.MetaFunction = () => [
    { title: "Privacy Policy | El-Muttahida" },
    {
        name: "description",
        content:
            "Privacy policy for El-Muttahida — Egyptian Handcrafted Pottery & B2B Wholesale.",
    },
];

export default function PrivacyPolicy() {
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
                        additionalType: "https://schema.org/PrivacyPolicy",
                        name: "El-Muttahida Privacy Policy",
                        url: "https://elmuttahida.com/privacy-policy",
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
                        <span className="inline-block px-3 py-1 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-full mb-3 uppercase tracking-wider">
                            {isArabic ? "الخصوصية وحماية البيانات" : "Privacy & Data Protection"}
                        </span>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-950 dark:text-white tracking-tight mb-3 font-serif">
                            {isArabic ? "سياسة الخصوصية" : "Privacy Policy"}
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                            {isArabic ? "آخر تحديث: أبريل 2026 | سارية لجميع الشركاء والموزعين التجاريين" : "Last Updated: April 2026 | Applicable to all commercial partners & distributors"}
                        </p>
                    </header>

                    <div className="space-y-8 sm:space-y-10 text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base ltr:text-left rtl:text-right">
                        {/* 1. Introduction */}
                        <section className="space-y-3">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-950 dark:text-white flex items-center gap-3">
                                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 text-sm font-black">1</span>
                                <span>{isArabic ? "المقدمة ونطاق العمل" : "Introduction & Scope"}</span>
                            </h2>
                            <p>
                                {isArabic
                                    ? "مرحبًا بكم في شركة المتحدة للفنون الخزفية وصناعة الفخار المصري الأصيل. تلتزم الشركة بأعلى معايير حماية وخصوصية البيانات التجارية والشخصية لعملائنا وشركاء التوزيع والبيع بالجملة حول العالم. توضح هذه السياسة كيفية جمع البيانات، استخدامها، تخزينها، وحمايتها أثناء تصفح الموقع أو إجراء الاستفسارات وطلبات التوريد."
                                    : "Welcome to El-Muttahida, manufacturers of handcrafted Egyptian ceramic and Nile clay pottery for global B2B wholesale distribution. We are committed to protecting the privacy and security of your business and personal data. This Privacy Policy details our practices concerning data collection, processing, and storage across our digital platform, WhatsApp communications, and direct commercial contracts."}
                            </p>
                        </section>

                        {/* 2. Information We Collect */}
                        <section className="space-y-3">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-950 dark:text-white flex items-center gap-3">
                                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 text-sm font-black">2</span>
                                <span>{isArabic ? "البيانات التي نقوم بجمعها" : "Information We Collect"}</span>
                            </h2>
                            <p>
                                {isArabic
                                    ? "نجمع فقط المعلومات الضرورية لمعالجة استفسارات التوريد بالجملة وتنفيذ الشحن والخدمات التجارية:"
                                    : "We only collect information strictly required to facilitate B2B wholesale inquiries, export transactions, and order fulfillment:"}
                            </p>
                            <ul className="list-disc ltr:pl-6 rtl:pr-6 space-y-2 marker:text-indigo-600 dark:marker:text-indigo-400">
                                <li>
                                    <strong>{isArabic ? "بيانات الشركة والتواصل: " : "Company & Contact Information: "}</strong>
                                    {isArabic
                                        ? "اسم الشركة، الشخص المسؤول، البريد الإلكتروني التجاري، رقم الهاتف/واتساب، وعنوان الشحن والتسليم وميناء الوصول."
                                        : "Company name, primary contact person, business email, telephone/WhatsApp number, delivery address, and destination port."}
                                </li>
                                <li>
                                    <strong>{isArabic ? "تفاصيل الطلب والتشطيب المخصص: " : "Order & Custom Specifications: "}</strong>
                                    {isArabic
                                        ? "أرقام الموديلات (SKU)، الكميات المطلوبة، أبعاد المزهرية، متطلبات الطلاء أو الحفر الخاص، والوثائق الفنية المتبادلة."
                                        : "SKU numbers, requested quantities, vase dimensions, bespoke finish/glaze choices, logo engraving specifications, and technical quotation history."}
                                </li>
                                <li>
                                    <strong>{isArabic ? "المعاملات والتراخيص التجارية: " : "Commercial Compliance & Billing: "}</strong>
                                    {isArabic
                                        ? "الرقم الضريبي أو السجل التجاري للشحنات الدولية، والفواتير الأولية المعتمدة."
                                        : "VAT/Tax identification numbers, commercial registration for international customs clearance, and pro-forma invoice records."}
                                </li>
                            </ul>
                        </section>

                        {/* 3. WhatsApp Inquiries & Direct Communications */}
                        <section className="p-5 sm:p-6 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 space-y-3">
                            <h2 className="text-lg sm:text-xl font-bold text-gray-950 dark:text-white flex items-center gap-2.5">
                                <span className="text-green-500">💬</span>
                                <span>{isArabic ? "التواصل واستفسارات التشطيبات عبر واتساب" : "WhatsApp Inquiries & Direct Communication"}</span>
                            </h2>
                            <p className="text-sm leading-relaxed">
                                {isArabic
                                    ? "نظرًا للطبيعة اليدوية والحرفية لمنتجاتنا وطلبات التشطيب الخاصة، يتم استكمال جزء أساسي من استفسارات الجملة وتبادل عينات الألوان والتشطيبات عبر خدمة واتساب الرسمية. تخضع البيانات المتبادلة لسياسة خصوصية منصة Meta، ونحتفظ بسجلات المحادثات والمواصفات الفنية بشكل آمن حصريًا لغرض ضمان الجودة وإتمام دورة الإنتاج والشحن."
                                    : "Due to the bespoke craftsmanship of our pottery and custom glazes, quotation reviews and finish samples are frequently coordinated via our official WhatsApp channel (+201065583355). Conversations and reference media are securely handled solely for order verification, quality assurance, and production matching."}
                            </p>
                        </section>

                        {/* 4. Data Processing & Export Logistics */}
                        <section className="space-y-3">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-950 dark:text-white flex items-center gap-3">
                                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 text-sm font-black">3</span>
                                <span>{isArabic ? "الشحن الدولي واللوجستيات الجمركية" : "Export Shipping & Customs Data Sharing"}</span>
                            </h2>
                            <p>
                                {isArabic
                                    ? "بالنسبة للشحنات المصدرة إلى الخارج (أوروبا، الخليج العربي، أمريكا الشمالية وغيرها)، نقوم بمشاركة المستندات والبيانات اللوجستية اللازمة (مثل بوليصة الشحن، الفاتورة التجارية، شهادة المنشأ المصرية، وشهادة تبخير خشب الطبالي ISPM-15) مع خطوط الملاحة ووكلاء الشحن المعتمدين وسلطات الجمارك المعنية لإتمام التخليص."
                                    : "For export shipments to Europe, the GCC, North America, and beyond, necessary documentation (Bill of Lading, Commercial Invoice, Egyptian Certificate of Origin, and ISPM-15 Phytosanitary Pallet Certificates) is securely shared with accredited freight forwarders and customs authorities for clearance."}
                            </p>
                        </section>

                        {/* 5. Data Security & Storage */}
                        <section className="space-y-3">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-950 dark:text-white flex items-center gap-3">
                                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 text-sm font-black">4</span>
                                <span>{isArabic ? "أمان البيانات والتخزين" : "Data Security & Retention"}</span>
                            </h2>
                            <p>
                                {isArabic
                                    ? "نطبق بروتوكولات تشفير متقدمة (TLS/SSL) لجميع البيانات المنقولة عبر خوادمنا. لا نقوم ببيع أو تأجير أي بيانات تجارية لأطراف ثالثة لأغراض دعائية على الإطلاق. تُحفظ سجلات المعاملات وفقًا للمدد القانونية المنصوص عليها في الأنظمة المحاسبية والتجارية الرسمية."
                                    : "We enforce industry-standard encryption protocols (TLS/SSL) across our infrastructure. We never sell, lease, or monetize your business data. Commercial transaction records are retained in compliance with statutory export, tax, and accounting standards."}
                            </p>
                        </section>

                        {/* 6. Partner Rights */}
                        <section className="space-y-3">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-950 dark:text-white flex items-center gap-3">
                                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 text-sm font-black">5</span>
                                <span>{isArabic ? "حقوق الشركاء والمشترين" : "Your Rights & Access"}</span>
                            </h2>
                            <p>
                                {isArabic
                                    ? "يحق لجميع ممثلي الشركات والموزعين طلب الاطلاع على بياناتهم المسجلة لدينا، أو طلب تعديلها أو تصحيحها، أو طلب إزالتها في حال انتهاء العلاقة التجارية، ما لم تكن هناك متطلبات قانونية تلزمنا بالاحتفاظ بها. يمكنكم التواصل معنا عبر القنوات الموضحة أدناه لتنفيذ أي طلب."
                                    : "Authorized buyer representatives have the right to request access, correction, or deletion of their registered contact and account information. To exercise your rights, please reach out directly to our compliance officer."}
                            </p>
                        </section>

                        {/* 7. Contact Us */}
                        <section className="p-5 sm:p-6 rounded-xl bg-gray-50 dark:bg-gray-850 border border-gray-200 dark:border-gray-800 space-y-3">
                            <h2 className="text-lg sm:text-xl font-bold text-gray-950 dark:text-white">
                                {isArabic ? "التواصل والاستفسارات القانونية" : "Contact Information"}
                            </h2>
                            <p className="text-sm">
                                {isArabic
                                    ? "إذا كانت لديكم أية استفسارات بخصوص سياسة الخصوصية أو معالجة البيانات، يسعدنا تواصلكم عبر البريد الإلكتروني: privacy@elmuttahida.com أو عبر الواتساب التجاري الرسمي: 201065583355+"
                                    : "For inquiries regarding our data privacy compliance, please email us at privacy@elmuttahida.com or contact our official export desk on WhatsApp at +201065583355."}
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    );
}
