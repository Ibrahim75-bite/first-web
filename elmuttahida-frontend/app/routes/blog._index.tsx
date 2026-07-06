import { Link } from "react-router";
import { useContext } from "react";
import type { Route } from "./+types/blog._index";
import { LanguageContext } from "../context/LanguageContext";

export const meta: Route.MetaFunction = () => [
    { title: "Blog | El-Muttahida — B2B Vase Insights" },
    {
        name: "description",
        content:
            "Expert insights on B2B wholesale vase manufacturing, international shipping, customs, and custom finishes.",
    },
];

export async function loader() {
    return {
        posts: [
            {
                id: "1",
                slug: "shipping-routes-and-customs-for-importing-wholesale-b2b-vases",
                title: "Shipping Routes and Customs Considerations for Importing Wholesale B2B Vases",
                titleAr: "طرق الشحن واعتبارات الجمارك لاستيراد مزهريات B2B بالجملة",
                excerpt: "Navigate HS codes, Incoterms, and fragile goods packaging standards to streamline your international vase imports.",
                excerptAr: "تنقل عبر رموز الجمارك ومعايير تغليف البضائع الهشة لتسهيل استيراد المزهريات الدولي الخاص بك.",
                category: "International Shipping",
                date: "2026-04-09",
                author: {
                    name: "Ahmed El-Masry",
                    nameAr: "أحمد المصري",
                    avatar: "https://i.pravatar.cc/150?u=ahmed",
                },
                image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?q=80&w=1000&auto=format&fit=crop",
            },
            {
                id: "2",
                slug: "how-to-request-custom-b2b-vase-finishes-via-whatsapp",
                title: "How to Request Custom B2B Vase Finishes via WhatsApp",
                titleAr: "كيفية طلب تشطيبات مزهريات مخصصة لـ B2B عبر الواتساب",
                excerpt: "A step-by-step guide for B2B buyers on submitting reference images, specifying glazes, and negotiating custom finish pricing through our WhatsApp channel.",
                excerptAr: "دليل خطوة بخطوة لمشتري B2B حول تقديم الصور المرجعية وتحديد التشطيبات الزجاجية عبر قناة الواتساب الخاصة بنا.",
                category: "Custom Finishes",
                date: "2026-03-22",
                author: {
                    name: "Fatima Khalil",
                    nameAr: "فاطمة خليل",
                    avatar: "https://i.pravatar.cc/150?u=fatima",
                },
                image: "https://images.unsplash.com/photo-1613589812450-48e0259e2182?q=80&w=1000&auto=format&fit=crop",
            },
            {
                id: "3",
                slug: "understanding-ceramic-durability-in-international-freight",
                title: "Understanding Ceramic Durability in International Freight",
                titleAr: "فهم متانة الخزف في الشحن الدولي",
                excerpt: "Learn how ceramic firing temperatures, wall thickness, and packaging design affect breakage rates during long-haul ocean and air freight.",
                excerptAr: "تعرف على كيفية تأثير درجات حرارة الحرق وسماكة الجدار وتصميم التغليف على معدلات الكسر أثناء الشحن الجوي والبحري.",
                category: "Materials & Quality",
                date: "2026-03-08",
                author: {
                    name: "Omar Badr",
                    nameAr: "عمر بدر",
                    avatar: "https://i.pravatar.cc/150?u=omar",
                },
                image: "https://images.unsplash.com/photo-1581428982868-e410dd147b9d?q=80&w=1000&auto=format&fit=crop",
            },
        ],
    };
}

const catsDict: Record<string, string> = {
    "International Shipping": "الشحن الدولي",
    "Custom Finishes": "تشطيبات مخصصة",
    "Materials & Quality": "المواد والجودة",
    "B2B Ordering": "طلبات B2B",
};

export default function BlogHub({ loaderData }: Route.ComponentProps) {
    const { posts } = loaderData;
    const { lang, dir } = useContext(LanguageContext);
    const isArabic = lang === "ar";

    const t = {
        title1: isArabic ? "مدونة" : "The Vase",
        title2: isArabic ? " المزهريات" : " Journal",
        desc: isArabic
            ? "رؤى خبراء حول تصنيع المزهريات بالجملة، الشحن الدولي، تفاصيل الجمارك، والتشطيبات المخصصة."
            : "Expert insights on B2B wholesale vase manufacturing, international shipping compliance, and custom finish techniques.",
        categories: isArabic ? "التصنيفات" : "Categories",
        newsletter: isArabic ? "اشترك في نشرتنا" : "Join our Newsletter",
        newsletterDesc: isArabic ? "احصل على أحدث الرؤى وإعلانات المنتجات." : "Get the latest B2B insights and product announcements.",
        emailPlaceholder: isArabic ? "البريد الإلكتروني للعمل" : "Business email",
        subscribe: isArabic ? "اشتراك" : "Subscribe",
    };

    return (
        <main className="min-h-screen py-20 px-6 sm:px-12 bg-white dark:bg-gray-950" dir={dir}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Blog",
                        name: "El-Muttahida B2B Vase Blog",
                        url: "https://elmuttahida.com/blog",
                    }),
                }}
            />

            <div className="max-w-7xl mx-auto">
                <header className="mb-16 text-center">
                    <h1 className="text-5xl sm:text-6xl font-black text-gray-900 dark:text-white tracking-tight mb-6 flex justify-center items-center gap-4">
                        {t.title1}
                        <span className="text-indigo-600 dark:text-indigo-400">
                            {t.title2}
                        </span>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        {t.desc}
                    </p>
                </header>

                <div className="flex flex-col lg:flex-row gap-12">
                    <div className="lg:w-3/4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {posts.map((post) => (
                                <article
                                    key={post.id}
                                    className="group bg-white dark:bg-gray-900 rounded-2xl shadow-md hover:shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden transition-all duration-300 hover:-translate-y-1"
                                >
                                    <Link to={`/blog/${post.slug}`} className="block">
                                        <div className="aspect-[16/9] overflow-hidden bg-gray-100 dark:bg-gray-800">
                                            <img
                                                src={post.image}
                                                alt={post.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                loading="lazy"
                                            />
                                        </div>
                                        <div className="p-6">
                                            <div className="flex items-center gap-4 mb-4">
                                                <span className="text-xs font-bold px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full uppercase tracking-wider whitespace-nowrap">
                                                    {isArabic ? catsDict[post.category] : post.category}
                                                </span>
                                                <time className="text-sm text-gray-500 dark:text-gray-400">
                                                    {new Date(post.date).toLocaleDateString(isArabic ? "ar-EG" : "en-US", {
                                                        month: "short",
                                                        day: "numeric",
                                                        year: "numeric",
                                                    })}
                                                </time>
                                            </div>
                                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                {isArabic ? post.titleAr : post.title}
                                            </h2>
                                            <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-2">
                                                {isArabic ? post.excerptAr : post.excerpt}
                                            </p>

                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={post.author.avatar}
                                                    alt={isArabic ? post.author.nameAr : post.author.name}
                                                    className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700"
                                                />
                                                <span className="text-sm font-medium text-gray-900 dark:text-gray-200">
                                                    {isArabic ? post.author.nameAr : post.author.name}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                </article>
                            ))}
                        </div>
                    </div>

                    <aside className="lg:w-1/4 space-y-8">
                        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                                {t.categories}
                            </h3>
                            <ul className="space-y-3">
                                {[
                                    "International Shipping",
                                    "Custom Finishes",
                                    "Materials & Quality",
                                    "B2B Ordering",
                                ].map((cat) => (
                                    <li key={cat}>
                                        <Link
                                            to="#"
                                            className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                        >
                                            {isArabic ? catsDict[cat] : cat}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-lg">
                            <h3 className="text-lg font-bold mb-2">{t.newsletter}</h3>
                            <p className="text-indigo-100 text-sm mb-4">
                                {t.newsletterDesc}
                            </p>
                            <form className="space-y-3">
                                <input
                                    type="email"
                                    placeholder={t.emailPlaceholder}
                                    className={`w-full bg-white/10 border border-white/20 rounded-full py-2.5 px-4 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm ${dir === "rtl" ? "text-right" : "text-left"}`}
                                />
                                <button
                                    type="button"
                                    className="w-full bg-white text-indigo-900 font-bold py-2.5 rounded-full text-sm hover:bg-gray-50 transition-colors"
                                >
                                    {t.subscribe}
                                </button>
                            </form>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}
