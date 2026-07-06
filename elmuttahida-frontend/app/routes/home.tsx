import { Link } from "react-router";
import type { Route } from "./+types/home";
import { useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "El Muttahida | Exquisite Egyptian Craftsmanship" },
    {
      name: "description",
      content:
        "Premium Egyptian handcrafted vases for global spaces. Sourced from Nile clay, blending ancient tradition with modern design.",
    },
  ];
}

export default function Home() {
  const { lang, dir } = useContext(LanguageContext);
  const isArabic = lang === "ar";

  const t = {
    premium: isArabic ? "سيراميك فاخر" : "Premium Ceramics",
    heroTitle: isArabic ? (
      <>حرفية مصرية <br /><span className="italic">رائعة</span> <br />للمساحات العالمية</>
    ) : (
      <>Exquisite Egyptian <br /> <span className="italic">Craftsmanship</span> for <br /> Global Spaces</>
    ),
    heroDesc: isArabic ? "مزهريات مصقولة يدوياً تمزج بين تقاليد صناعة الفخار القديمة مع التصميم الحديث، مستخرجة مباشرة من طمي النيل. مشهورة بمتانتها وقصتها الغنية بالمعادن على مر العصور." : "Hand-finished vases that blend ancient pottery traditions with contemporary minimalist design. Sourced directly from Nile clay, renowned for its durability and rich, mineral-infused story of millennia.",
    feelQuality: isArabic ? "تصفح الكتالوج" : "Feel the Quality",
    customInquiry: isArabic ? "طلب خاص" : "Custom Inquiries",
    trustReview: isArabic ? "4.8/5 ردود إيجابية من الموزعين العالميين B2B" : "4.8/5 Positive Feedback from Global B2B Distributors",
    trustExport: isArabic ? "تصدير إلى أكثر من 74 دولة" : "Exporting to 74+ Countries",
    trustIso: isArabic ? "حاصلون على شهادة الأيزو 9001" : "ISO 9001 Certified",
    whyChooseTitle: isArabic ? "لماذا تختارنا" : "Why Choose Us",
    diffTitle: isArabic ? "ميزة المتحدة" : "The El Muttahida Difference",
    diffAuthentic: isArabic ? "طين مصري أصيل" : "Authentic Egyptian Clay",
    diffAuthenticDesc: isArabic ? "مزهرياتنا مصدرها من رواسب دلتا النيل الممتازة، مشهورة بمتانتها وملمسها الترابي الغني الذي يحكي قصة آلاف السنين." : "Our vases are sourced from premium Nile Delta deposits, renowned for their durability and rich, earthy textures that tell a story of millennia.",
    diffBespoke: isArabic ? "تصنيع حسب الطلب" : "Bespoke Manufacturing",
    diffBespokeDesc: isArabic ? "من المواصفات المخصصة إلى التشطيبات الزجاجية، مرونتنا في التصنيع تسمح بإنشاء خطوط حصرية مصممة لجمالية علامتك التجارية." : "From custom specifications to specific glaze finishes, our manufacturing flexibility allows us to create exclusive lines tailored to your brand aesthetic.",
    diffLogistics: isArabic ? "لوجستيات عالمية محسنة" : "Optimized Global Logistics",
    diffLogisticsDesc: isArabic ? "تضمن البنية التحتية وشراكات الشحن الاستراتيجية تسليمًا سريعًا وفعالًا من حيث التكلفة إلى أوروبا وأمريكا الشمالية وآسيا." : "Strategic partnerships and improved logistics ensure fast, cost-effective delivery to Europe, North America, Asia, and beyond.",
    colTitle: isArabic ? "مجموعات منتقاة" : "Curated Collections",
    colDesc: isArabic ? "اكتشف أنماط التصميم المتميزة لدينا." : "Discover our distinct design languages.",
    colViewAll: isArabic ? "عرض جميع المجموعات ←" : "View All Collections &rarr;",

    // Legacy Tags and Fields for the Curated array
    newArrivals: isArabic ? "الوصول الجديد" : "New Arrivals",
    modernClay: isArabic ? "طين حديث" : "Modern Clay",
    explore: isArabic ? "استكشاف المجموعة" : "Explore Collection",
    heritageGold: isArabic ? "ذهب التراث" : "Royal Heritage",
    signature: isArabic ? "سلسلة مميزة" : "Signature Series",
    minimalistBlack: isArabic ? "أسود بسيط" : "Minimalist Black",
    limitedEdition: isArabic ? "إصدار محدود" : "Limited Edition",

    // Featured Vases Legacy Area
    featuredTitle: isArabic ? "مزهريات مميزة" : "Featured Vases",
    minimalStone: isArabic ? "مزهرية حجر بسيطة" : "Minimal Stone Vase",
    sculptedCurve: isArabic ? "المنحنى المنحوت" : "Sculpted Curve",
    nileDelta: isArabic ? "وعاء دلتا النيل" : "Nile Delta Bowl",
    terraRustic: isArabic ? "تيرا ريفي" : "Terra Rustic",

    elevateTitle: isArabic ? "شريك معنا" : "Partner with us",
    elevateHead: isArabic ? "جاهز لرفع مستوى مخزونك؟" : "Ready to elevate your inventory?",
    elevateDesc: isArabic ? "انضم إلى أكثر من 500 موزع يعرضون حرفيتنا المصرية الممتازة. قم بتنزيل الكتالوج الخاص بنا أو ابدأ محادثة معنا اليوم." : "Join over 500 distributors showcasing our premium Egyptian craftsmanship. Download our catalog or start a conversation today.",
    elevateCTA1: isArabic ? "طلب الوصول للجملة" : "Request Wholesale Access",
    elevateCTA2: isArabic ? "تصفح الكتالوج" : "Browse Our Catalogue",

    // Footer
    footerDesc: isArabic ? "الاحتفال بحرفية السيراميك المصرية ذات الجاذبية العالمية. مزهريات مصنوعة يدويًا لتوزيع الجملة الممتاز." : "Celebrating Egyptian ceramic artistry with global appeal. Handcrafted vases for premium wholesale distribution.",
    shop: isArabic ? "تسوق" : "Shop",
    allProducts: isArabic ? "جميع المنتجات" : "All Products",
    bestSellers: isArabic ? "الأكثر مبيعًا" : "Best Sellers",
    catalogDownload: isArabic ? "تنزيل الكتالوج" : "Catalog Download",
    company: isArabic ? "الشركة" : "Company",
    aboutUs: isArabic ? "عن المتحدة" : "About El Muttahida",
    manufacturing: isArabic ? "عملية التصنيع" : "Manufacturing Process",
    sustainability: isArabic ? "الاستدامة" : "Sustainability",
    careers: isArabic ? "الوظائف" : "Careers",
    support: isArabic ? "الدعم" : "Support",
    contactUs: isArabic ? "اتصل بنا" : "Contact Us",
    shippingLogistics: isArabic ? "الشحن واللوجستيات" : "Shipping & Logistics",
    wholesalePolicy: isArabic ? "سياسة الجملة" : "Wholesale Policy",
    faq: isArabic ? "الأسئلة الشائعة" : "FAQ",
    copyright: isArabic ? "© 2026 المتحدة. جميع الحقوق محفوظة." : "© 2026 El Muttahida. All rights reserved.",
    privacyPolicy: isArabic ? "سياسة الخصوصية" : "Privacy Policy",
    termsService: isArabic ? "شروط الخدمة" : "Terms of Service",
  };

  return (
    <div className="overflow-x-hidden" dir={dir}>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col justify-center pt-32 pb-32">
        <div className="absolute inset-0 z-0">
          <img src="/assets/hero.png" alt="Premium Vases Showcase" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <div className="max-w-2xl space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
            <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-widest rounded-full">
              {t.premium}
            </span>
            <h1 className="text-6xl md:text-8xl font-serif text-white leading-[1.1] tracking-tight">
              {t.heroTitle}
            </h1>
            <p className="text-xl text-gray-200 leading-relaxed font-light">
              {t.heroDesc}
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link to="/catalogue" className="px-8 py-4 bg-primary text-secondary font-bold rounded-full hover:bg-primary-dark transition-all shadow-xl hover:shadow-primary/20 hover:-translate-y-1">
                {t.feelQuality}
              </Link>
              <Link to="/products/custom-finishes" className="px-8 py-4 bg-transparent border border-white/30 text-white font-bold rounded-full hover:bg-white/10 backdrop-blur-sm transition-all">
                {t.customInquiry}
              </Link>
            </div>
          </div>
        </div>

        {/* Trust Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-secondary/80 backdrop-blur-md border-t border-white/5 py-4">
          <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-between items-center gap-8 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">
            <div className="flex items-center gap-3">
              <span className="text-primary text-xl -mt-1">★★★★★</span>
              <span>{t.trustReview}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-primary text-xl -mt-1">🌍</span>
              <span>{t.trustExport}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-primary text-xl -mt-1">✅</span>
              <span>{t.trustIso}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Difference Section */}
      <section className="py-32 bg-white dark:bg-black" id="about">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary">
              {t.whyChooseTitle}
            </h4>
            <h2 className="text-4xl md:text-5xl font-serif text-secondary dark:text-white">
              {t.diffTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              {
                title: t.diffAuthentic,
                desc: t.diffAuthenticDesc,
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                ),
              },
              {
                title: t.diffBespoke,
                desc: t.diffBespokeDesc,
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                ),
              },
              {
                title: t.diffLogistics,
                desc: t.diffLogisticsDesc,
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                ),
              },
            ].map((item) => (
              <div key={item.title} className="text-center space-y-6 group">
                <div className="w-16 h-16 mx-auto rounded-full bg-surface dark:bg-gray-900 flex items-center justify-center text-primary-dark group-hover:bg-primary group-hover:text-white transition-all duration-500">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {item.icon}
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-secondary dark:text-white">{item.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Curated Collections */}
      <section className="py-32 bg-surface dark:bg-gray-900/50" id="collections">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-16">
            <div className="space-y-4 text-left">
              <h2 className="text-4xl md:text-5xl font-serif text-secondary dark:text-white">{t.colTitle}</h2>
              <p className="text-gray-500 text-lg">{t.colDesc}</p>
            </div>
            <Link to="/catalogue" className="text-sm font-bold uppercase tracking-widest text-primary hover:text-primary-dark underline underline-offset-8">
              {t.colViewAll}
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: t.modernClay,
                tag: t.newArrivals,
                image: "/assets/ceramic.png",
              },
              {
                title: t.heritageGold,
                tag: t.signature,
                image: "/assets/hero.png",
              },
              {
                title: t.minimalistBlack,
                tag: t.limitedEdition,
                image: "/assets/glass.png",
              },
            ].map((col) => (
              <Link key={col.title} to="/catalogue" className="group relative h-[600px] overflow-hidden rounded-3xl">
                <img src={col.image} alt={col.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-secondary/20 to-transparent" />
                <div className="absolute bottom-10 left-10 space-y-4">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">{col.tag}</span>
                  <h3 className="text-3xl font-serif text-white">{col.title}</h3>
                  <span className="text-sm font-medium text-white/80 group-hover:text-white flex items-center gap-2">
                    {t.explore} <span className="translate-x-0 group-hover:translate-x-2 transition-transform">&rarr;</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Legacy Featured Vases -> Styled to match home.tsx */}
      <section className="py-24 bg-white dark:bg-black text-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-serif text-center mb-16 text-secondary dark:text-white">
            {t.featuredTitle}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {
                img: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&h=500&fit=crop",
                name: t.minimalStone,
              },
              {
                img: "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=400&h=500&fit=crop",
                name: t.sculptedCurve,
              },
              {
                img: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=400&h=500&fit=crop",
                name: t.nileDelta,
              },
              {
                img: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=400&h=500&fit=crop",
                name: t.terraRustic,
              },
            ].map((item, i) => (
              <Link key={i} to="/catalogue" className="group rounded-2xl overflow-hidden block">
                <div className="aspect-[4/5] overflow-hidden rounded-2xl">
                  <img
                    loading="lazy"
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    src={item.img}
                  />
                </div>
                <h3 className="mt-5 text-xl font-serif text-center text-secondary dark:text-white">
                  {item.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Ready to Elevate CTA */}
      <section className="py-40 bg-surface dark:bg-gray-900/50 text-center px-6">
        <div className="max-w-3xl mx-auto space-y-12">
          <h4 className="text-xs font-bold uppercase tracking-widest text-primary">{t.elevateTitle}</h4>
          <h2 className="text-5xl md:text-7xl font-serif text-secondary dark:text-white leading-tight">
            {t.elevateHead}
          </h2>
          <p className="text-xl text-gray-500 dark:text-gray-400 font-light">
            {t.elevateDesc}
          </p>
          <div className="flex flex-wrap justify-center gap-6 pt-6">
            <button
              onClick={() => {
                const msg = lang === "ar"
                  ? "مرحبًا، أود الاستفسار عن الوصول للجملة وأسعار الجملة لمنتجاتكم. يرجى إرسال التفاصيل."
                  : "Hello, I would like to inquire about wholesale access and bulk pricing for your products. Please send me the details.";
                window.open(
                  `https://wa.me/201065583355?text=${encodeURIComponent(msg)}`,
                  "_blank"
                );
              }}
              className="px-10 py-5 bg-[#25D366] text-white font-bold rounded-full hover:scale-105 active:scale-100 transition-all shadow-xl hover:bg-[#128C7E]"
            >
              <svg className="h-5 w-5 inline-block mr-2 -mt-0.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.79 23.789l4.89-1.56A11.946 11.946 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818c-2.168 0-4.19-.617-5.908-1.682l-.424-.252-2.905.928.775-2.834-.277-.44A9.784 9.784 0 012.182 12c0-5.418 4.4-9.818 9.818-9.818S21.818 6.582 21.818 12s-4.4 9.818-9.818 9.818z" />
              </svg>
              {t.elevateCTA1}
            </button>
            <Link to="/catalogue" className="px-10 py-5 bg-transparent border border-gray-200 dark:border-gray-800 text-secondary dark:text-white font-bold rounded-full hover:bg-white dark:hover:bg-gray-900 transition-all shadow-sm">
              {t.elevateCTA2}
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
