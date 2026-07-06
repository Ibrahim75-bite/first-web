import { Link } from "react-router";
import { useContext } from "react";
import type { Route } from "./+types/blog.$slug";
import { LanguageContext } from "../context/LanguageContext";

export async function loader({ params }: Route.LoaderArgs) {
    return {
        post: {
            slug: params.slug,
            title: "Shipping Routes and Customs Considerations for Importing Wholesale B2B Vases",
            titleAr: "طرق الشحن واعتبارات الجمارك لاستيراد مزهريات B2B بالجملة",
            content: `When importing wholesale ceramic and glass vases internationally, the single most important factor is correctly classifying your shipment under the Harmonized System (HS). Ceramic vases typically fall under HS code 6913.90 (ornamental ceramic articles), while glass vases are classified under 7013.99. Misclassification can result in shipment holds, unexpected duties of 5–25%, and costly delays at port — issues that directly erode your B2B margins.

Beyond tariff codes, packaging is critical for fragile goods. Each vase must be individually wrapped in high-density foam, separated by corrugated dividers, and packed in double-wall cartons. For ocean freight (FCL or LCL), palletizing with corner protectors and stretch wrap is essential. At El-Muttahida, we pre-package all wholesale orders to ISTA 3A standards to minimize breakage during transit.

Choosing the right Incoterm defines who bears the customs burden. Most of our B2B clients opt for FOB (Free on Board) from our nearest port, which means we handle export customs clearance while the buyer manages import duties and last-mile logistics. For first-time importers, we recommend CIF (Cost, Insurance, and Freight) to simplify the process — we arrange freight, marine insurance, and deliver to your destination port.

Common shipping routes for our vases include the Mediterranean corridor to Southern Europe, direct container services to the US East Coast via the Suez Canal, and overland truck freight to Middle Eastern and North African markets. Transit times range from 7 days (regional) to 35 days (transoceanic). We work with vetted freight forwarders who specialize in fragile goods and provide real-time container tracking.

For customs clearance, ensure you have: a commercial invoice with itemized unit prices, a packing list with gross and net weights, a certificate of origin, and any required phytosanitary certificates. Some markets (notably Australia and New Zealand) require additional biosecurity declarations for clay-based products. Your customs broker should be briefed on the fragile nature of the goods to avoid rough handling during inspection.`,
            contentAr: `عند استيراد المزهريات الخزفية والزجاجية دوليًا، العامل الأهم هو تصنيف شحنتك بشكل صحيح وفقًا للنظام المنسق (HS). تندرج المزهريات الخزفية عادةً تحت رمز 6913.90 (تحف خزفية للزينة)، بينما يصنف الزجاج تحت 7013.99. التصنيف الخاطئ قد يؤدي إلى احتجاز الشحنة، رسوم إضافية غير متوقعة، وتأخيرات مكلفة في الميناء.

إلى جانب أكواد التعريفة، التغليف أمر بالغ الأهمية للبضائع الهشة. يجب تغليف كل مزهرية بشكل فردي برغوة عالية الكثافة، وفصلها بفواصل مموجة، وتعبئتها في كراتين مزدوجة الجدار. في حالة الشحن البحري، يعد وضع البضائع على منصات، مع حماة للزوايا وتغليف مطاطي، أمراً أساسياً. في المتحدة، نحزم جميع طلبات الجملة وفقاً لمعايير ISTA 3A لتقليل الكسر أثناء النقل.

اختيار Incoterm المناسب يحدد من يتحمل عبء الجمارك. يختار معظم عملائنا من فئة B2B خيار FOB من أقرب ميناء لدينا. للعملاء الجدد، نوصي بـ CIF لتبسيط العملية — حيث نرتب نحن الشحن، التأمين البحري، والتسليم إلى ميناء الوجهة الخاص بك.

طرق الشحن الشائعة لمزهرياتنا تشمل ممر البحر الأبيض المتوسط إلى جنوب أوروبا، خدمات الحاويات المباشرة إلى الساحل الشرقي للولايات المتحدة، والشحن البري إلى أسواق الشرق الأوسط وشمال أفريقيا. تتراوح أوقات النقل من 7 أيام إلى 35 يوماً. نحن نعمل مع وكلاء شحن معتمدين متخصصين في البضائع الهشة لتوفير تتبع الحاويات.

للتخليص الجمركي، تأكد من توفر: فاتورة تجارية بأسعار الوحدات، قائمة تعبئة بالأوزان الإجمالية والصافية، شهادة منشأ، وأي شهادات صحية مطلوبة.`,
            category: "International Shipping",
            date: "2026-04-09",
            author: {
                name: "Ahmed El-Masry",
                nameAr: "أحمد المصري",
                role: "Head of International Logistics",
                roleAr: "رئيس اللوجستيات الدولية",
                company: "El-Muttahida",
                companyAr: "المتحدة",
                avatar: "https://i.pravatar.cc/150?u=ahmed",
            },
            image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?q=80&w=1000&auto=format&fit=crop",
        },
    };
}

export const meta: Route.MetaFunction = ({ data }) => {
    return [
        { title: `${data?.post?.title} | El-Muttahida Blog` },
        {
            name: "description",
            content: "Navigate HS codes, Incoterms, and fragile goods packaging standards for international B2B vase imports.",
        },
    ];
};

const catsDict: Record<string, string> = {
    "International Shipping": "الشحن الدولي",
    "Custom Finishes": "تشطيبات مخصصة",
    "Materials & Quality": "المواد والجودة",
    "B2B Ordering": "طلبات B2B",
};

export default function BlogPost({ loaderData }: Route.ComponentProps) {
    const { post } = loaderData;
    const { lang, dir } = useContext(LanguageContext);
    const isArabic = lang === "ar";

    const title = isArabic ? post.titleAr : post.title;
    const content = isArabic ? post.contentAr : post.content;
    const paragraphs = content.split("\n\n");

    const t = {
        home: isArabic ? "الرئيسية" : "Home",
        blog: isArabic ? "المدونة" : "Blog",
        related: isArabic ? "مجموعات المزهريات ذات الصلة" : "Related Vase Collections",
        catalogueTitle: isArabic ? "كتالوج مزهريات الجملة" : "Wholesale Vase Catalogue",
        catalogueDesc: isArabic ? "تصفح مجموعتنا الكاملة لـ B2B" : "Browse our full B2B collection",
        customTitle: isArabic ? "خيارات التشطيب المخصصة" : "Custom Finish Options",
        customDesc: isArabic ? "اطلب طلاء وتشطيبات مخصصة عبر واتساب" : "Request bespoke glazes & finishes via WhatsApp",
        aboutAuthor: isArabic ? "عن الكاتب" : "About the Author",
        authorExp: isArabic
            ? `مع أكثر من 15 عامًا من الخبرة في الخدمات اللوجستية الخزفية الدولية، يشرف ${post.author.nameAr} على جميع عمليات الشحن في ${post.author.companyAr}.`
            : `With over 15 years of experience in international ceramics logistics, ${post.author.name} oversees all shipping operations at ${post.author.company}.`,
        sharePost: isArabic ? "شارك هذا المقال" : "Share this post",
        needBulk: isArabic ? "بحاجة لطلب جملة؟" : "Need a Bulk Order?",
        supplyB2b: isArabic ? "نقوم بتوريد مزهريات B2B بتشطيبات مخصصة حول العالم." : "We supply B2B vases with custom finishes worldwide.",
        reqQuote: isArabic ? "اطلب عرض سعر" : "Request a Quote"
    };

    return (
        <main className="min-h-screen py-16 bg-white dark:bg-gray-950" dir={dir}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify([
                        {
                            "@context": "https://schema.org",
                            "@type": "BlogPosting",
                            headline: title,
                            image: post.image,
                            author: {
                                "@type": "Person",
                                name: isArabic ? post.author.nameAr : post.author.name,
                                jobTitle: isArabic ? post.author.roleAr : post.author.role,
                            },
                            publisher: {
                                "@type": "Organization",
                                name: "El-Muttahida",
                                logo: {
                                    "@type": "ImageObject",
                                    url: "https://elmuttahida.com/logo.png",
                                },
                            },
                            datePublished: post.date,
                            articleSection: post.category,
                        },
                        {
                            "@context": "https://schema.org",
                            "@type": "BreadcrumbList",
                            itemListElement: [
                                {
                                    "@type": "ListItem",
                                    position: 1,
                                    name: "Home",
                                    item: "https://elmuttahida.com/",
                                },
                                {
                                    "@type": "ListItem",
                                    position: 2,
                                    name: "Blog",
                                    item: "https://elmuttahida.com/blog",
                                },
                                { "@type": "ListItem", position: 3, name: title },
                            ],
                        },
                    ]),
                }}
            />

            <article className="max-w-5xl mx-auto px-6 sm:px-12 pt-12">
                <nav className="mb-8" aria-label="Breadcrumb">
                    <ol className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                        <li>
                            <Link to="/" className="hover:text-indigo-600 transition-colors">
                                {t.home}
                            </Link>
                        </li>
                        <li>
                            <span className="mx-2">/</span>
                        </li>
                        <li>
                            <Link
                                to="/blog"
                                className="hover:text-indigo-600 transition-colors"
                            >
                                {t.blog}
                            </Link>
                        </li>
                        <li>
                            <span className="mx-2">/</span>
                        </li>
                        <li className="text-gray-900 dark:text-gray-300 font-medium truncate max-w-xs">
                            {title}
                        </li>
                    </ol>
                </nav>

                <header className="mb-12">
                    <span className="inline-block px-3 py-1 mb-4 text-xs font-bold bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full uppercase tracking-wider">
                        {isArabic ? catsDict[post.category] : post.category}
                    </span>
                    <h1 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white leading-tight mb-6">
                        {title}
                    </h1>
                    <div className="flex items-center gap-4">
                        <img
                            src={post.author.avatar}
                            alt={isArabic ? post.author.nameAr : post.author.name}
                            className="w-12 h-12 rounded-full border-2 border-indigo-100 dark:border-indigo-900"
                        />
                        <div>
                            <p className="text-base font-bold text-gray-900 dark:text-white">
                                {isArabic ? post.author.nameAr : post.author.name}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {isArabic ? post.author.roleAr : post.author.role}, {isArabic ? post.author.companyAr : post.author.company}
                            </p>
                        </div>
                        <div className={`text-sm text-gray-500 dark:text-gray-400 ${dir === "rtl" ? "mr-auto" : "ml-auto"}`}>
                            <time dateTime={post.date}>
                                {new Date(post.date).toLocaleDateString(isArabic ? "ar-EG" : "en-US", {
                                    month: "long",
                                    day: "numeric",
                                    year: "numeric",
                                })}
                            </time>
                        </div>
                    </div>
                </header>

                <div className="aspect-[21/9] w-full rounded-3xl overflow-hidden mb-12 shadow-xl border border-gray-100 dark:border-gray-800">
                    <img
                        src={post.image}
                        alt={title}
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    <div className="lg:w-3/4">
                        <section className="space-y-6 text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                            <p className="text-xl text-gray-900 dark:text-gray-200 font-medium">
                                {paragraphs[0]}
                            </p>
                            {paragraphs.slice(1).map((paragraph, idx) => (
                                <p key={idx}>{paragraph}</p>
                            ))}
                        </section>

                        <div className="mt-16 pt-12 border-t border-gray-200 dark:border-gray-800">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                {t.related}
                            </h3>
                            <div className="grid sm:grid-cols-2 gap-6">
                                <Link
                                    to="/products/vases"
                                    className="group p-6 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all duration-300 flex items-center justify-between hover:shadow-lg hover:-translate-y-0.5"
                                >
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                                            {t.catalogueTitle}
                                        </h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            {t.catalogueDesc}
                                        </p>
                                    </div>
                                    <span className={`text-indigo-500 transition-transform text-xl ${dir === "rtl" ? "group-hover:-translate-x-1" : "group-hover:translate-x-1"}`}>
                                        {dir === "rtl" ? "←" : "→"}
                                    </span>
                                </Link>
                                <Link
                                    to="/products/custom-finishes"
                                    className="group p-6 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all duration-300 flex items-center justify-between hover:shadow-lg hover:-translate-y-0.5"
                                >
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                                            {t.customTitle}
                                        </h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            {t.customDesc}
                                        </p>
                                    </div>
                                    <span className={`text-indigo-500 transition-transform text-xl ${dir === "rtl" ? "group-hover:-translate-x-1" : "group-hover:translate-x-1"}`}>
                                        {dir === "rtl" ? "←" : "→"}
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <aside className="lg:w-1/4">
                        <div className="sticky top-24 space-y-8">
                            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">
                                    {t.aboutAuthor}
                                </h4>
                                <div className="flex items-center gap-3 mb-3">
                                    <img
                                        src={post.author.avatar}
                                        alt={isArabic ? post.author.nameAr : post.author.name}
                                        className="w-10 h-10 rounded-full"
                                    />
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-white text-sm">
                                            {isArabic ? post.author.nameAr : post.author.name}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {isArabic ? post.author.roleAr : post.author.role}
                                        </p>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {t.authorExp}
                                </p>
                            </div>

                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">
                                    {t.sharePost}
                                </h4>
                                <div className="flex gap-3">
                                    <button className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                        In
                                    </button>
                                    <button className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                        Tw
                                    </button>
                                </div>
                            </div>

                            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-900/50">
                                <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                                    {t.needBulk}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                    {t.supplyB2b}
                                </p>
                                <Link
                                    to="/products/custom-finishes"
                                    className="block text-center bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold py-2.5 px-4 rounded-full transition-colors shadow-sm hover:shadow-md"
                                >
                                    {t.reqQuote}
                                </Link>
                            </div>
                        </div>
                    </aside>
                </div>
            </article>
        </main>
    );
}
