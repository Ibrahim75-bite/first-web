import { useContext } from "react";
import { Link } from "react-router-dom";
import { LanguageContext } from "../context/LanguageContext";
import { ThemeContext } from "../context/ThemeContext";

// ── Bilingual labels ──
const labels = {
  en: {
    heroTitle: "Exquisite Egyptian Craftsmanship for Global Spaces",
    heroDesc: "Hand-sourced vases that blend ancient pottery traditions with contemporary design. Sourced directly from Nile clay, renowned for its durability and rich, mineral-infused story of millennia.",
    heroCta: "Feel the Quality",
    trustFeedback: "4.8/5 Positive Feedback from Global B2B Distributors",
    trustExporting: "Exporting to 74+ Countries",
    trustCertified: "ISO 9001 Certified",
    differenceTitle: "The El Muttahida Difference",
    authenticTitle: "Authentic Egyptian Clay",
    authenticDesc: "Our vases are sourced from premium Nile Delta deposits, renowned for their durability and rich, mineral-infused story of millennia.",
    bespokeTitle: "Bespoke Manufacturing",
    bespokeDesc: "From custom specifications to graphic designs, our manufacturing flexibility allows us to create exclusive lines tailored to your brand aesthetic.",
    globalTitle: "Optimized Global Logistics",
    globalDesc: "Strategic partnerships ensure fast, cost-effective delivery to Europe, North America, Asia, and beyond.",
    collectionsTitle: "Curated Collections",
    viewAll: "View All Collections",
    newArrivals: "New Arrivals",
    modernClay: "Modern Clay",
    explore: "Explore Collection",
    heritageGold: "Heritage Gold",
    signature: "Signature Series",
    minimalistBlack: "Minimalist Black",
    limitedEdition: "Limited Edition",
    featuredTitle: "Featured Vases",
    minimalStone: "Minimal Stone Vase",
    sculptedCurve: "Sculpted Curve",
    nileDelta: "Nile Delta Bowl",
    terraRustic: "Terra Rustic",

    partnerTitle: "Ready to elevate your inventory?",
    partnerDesc: "Join over 500 distributors showcasing our premium Egyptian craftsmanship. Browse our full catalogue or start a conversation today.",
    requestAccess: "Request Wholesale Access",
    browseCatalogue: "Browse Our Catalogue",
    footerDesc: "Celebrating Egyptian ceramic artistry with global appeal. Handcrafted vases for premium wholesale distribution.",
    shop: "Shop",
    allProducts: "All Products",
    bestSellers: "Best Sellers",
    catalogDownload: "Catalog Download",
    company: "Company",
    aboutUs: "About El Muttahida",
    manufacturing: "Manufacturing Process",
    sustainability: "Sustainability",
    careers: "Careers",
    support: "Support",
    contactUs: "Contact Us",
    shippingLogistics: "Shipping & Logistics",
    wholesalePolicy: "Wholesale Policy",
    faq: "FAQ",
    copyright: "© 2026 El Muttahida. All rights reserved.",
    privacyPolicy: "Privacy Policy",
    termsService: "Terms of Service",
  },
  ar: {
    heroTitle: "حرفية مصرية رائعة للمساحات العالمية",
    heroDesc: "مزهريات مصنوعة يدويًا مصدرها من طين النيل، تجمع بين التقاليد القديمة والتصميم المعاصر. مشهورة بمتانتها وقصتها الغنية بالمعادن على مر العصور.",
    heroCta: "اشعر بالجودة",
    trustFeedback: "4.8/5 ردود إيجابية من الموزعين العالميين B2B",
    trustExporting: "تصدير إلى أكثر من 74 دولة",
    trustCertified: "معتمد ISO 9001",
    differenceTitle: "الفرق في المتحدة",
    authenticTitle: "طين مصري أصيل",
    authenticDesc: "مزهرياتنا مصدرها من رواسب دلتا النيل الممتازة، مشهورة بمتانتها وقصتها الغنية بالمعادن على مر العصور.",
    bespokeTitle: "تصنيع حسب الطلب",
    bespokeDesc: "من المواصفات المخصصة إلى التصاميم الجرافيكية، مرونتنا في التصنيع تسمح بإنشاء خطوط حصرية مصممة لجمالية علامتك التجارية.",
    globalTitle: "لوجستيات عالمية محسنة",
    globalDesc: "شراكات استراتيجية تضمن تسليمًا سريعًا وفعالًا من حيث التكلفة إلى أوروبا وأمريكا الشمالية وآسيا وما بعدها.",
    collectionsTitle: "مجموعات منتقاة",
    viewAll: "عرض جميع المجموعات",
    newArrivals: "الوصول الجديد",
    modernClay: "طين حديث",
    explore: "استكشاف المجموعة",
    heritageGold: "ذهب التراث",
    signature: "سلسلة مميزة",
    minimalistBlack: "أسود بسيط",
    limitedEdition: "إصدار محدود",
    featuredTitle: "مزهريات مميزة",
    minimalStone: "مزهرية حجر بسيطة",
    sculptedCurve: "المنحنى المنحوت",
    nileDelta: "وعاء دلتا النيل",
    terraRustic: "تيرا ريفي",

    partnerTitle: "جاهز لرفع مستوى مخزونك؟",
    partnerDesc: "انضم إلى أكثر من 500 موزع يعرضون حرفيتنا المصرية الممتازة. تصفح كتالوجنا الكامل أو ابدأ محادثة اليوم.",
    requestAccess: "طلب الوصول للجملة",
    browseCatalogue: "تصفح الكتالوج",
    footerDesc: "الاحتفال بحرفية السيراميك المصرية ذات الجاذبية العالمية. مزهريات مصنوعة يدويًا لتوزيع الجملة الممتاز.",
    shop: "تسوق",
    allProducts: "جميع المنتجات",
    bestSellers: "الأكثر مبيعًا",
    catalogDownload: "تنزيل الكتالوج",
    company: "الشركة",
    aboutUs: "عن المتحدة",
    manufacturing: "عملية التصنيع",
    sustainability: "الاستدامة",
    careers: "الوظائف",
    support: "الدعم",
    contactUs: "اتصل بنا",
    shippingLogistics: "الشحن واللوجستيات",
    wholesalePolicy: "سياسة الجملة",
    faq: "الأسئلة الشائعة",
    copyright: "© 2026 المتحدة. جميع الحقوق محفوظة.",
    privacyPolicy: "سياسة الخصوصية",
    termsService: "شروط الخدمة",
  },
};

// ── Hero Background Image ──
const HERO_BG = "https://lh3.googleusercontent.com/aida-public/AB6AXuANNKo9s3-8VHe8JHAhwZeuuD8to95-W5KAB6uZ78cjcw8_aiFMooUbN9cBB9PAxrkvzDHiTa3OKLH2Zc9hb4gAO72fOxA6QjFbeHK58vaMlzqTRAmOlvypIJmTun3vlqZh69KcP3oY_ZxBGlLgcLjYiGxi2EixKPxu6BrFHbBA-aMFtRvPy-TiveGXKIHIyAThTS7EwStWY8-wT5V9K4mWgKqkKPRsW4SHO1gVZeNwJ_4sSEijSXfca4APNgRj4VjKQzza-RdpIYCT";

export default function Home() {
  const { lang } = useContext(LanguageContext);
  const { theme } = useContext(ThemeContext);
  const t = labels[lang] || labels.en;
  const isDark = theme === "dark";

  return (
    <div className="flex flex-col">
      {/* ═══════════ HERO ═══════════ */}
      <section className="relative h-[60vh] sm:h-[75vh] md:h-[85vh] w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${HERO_BG}')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20" />
        </div>
        <div className="relative h-full max-w-[1440px] mx-auto px-4 sm:px-6 flex items-center">
          <div className="max-w-2xl text-white">
            <h1
              className="text-3xl sm:text-5xl md:text-7xl font-bold leading-tight mb-3 sm:mb-4"
              style={{
                fontFamily: "'Playfair Display', serif",
                textShadow: "0 2px 4px rgba(0,0,0,0.5)",
              }}
            >
              {t.heroTitle}
            </h1>
            <p className="text-sm sm:text-lg md:text-xl leading-relaxed mb-6 sm:mb-8 max-w-xl opacity-90">
              {t.heroDesc}
            </p>
            <Link
              to="/catalogue"
              className="inline-flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-4 bg-[#c4a484] text-[#1a1a1a] font-semibold text-base sm:text-lg tracking-wide hover:bg-[#a38666] transition-colors rounded-md"
            >
              {t.heroCta}
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════ TRUST BAR ═══════════ */}
      <section className={`py-8 sm:py-12 transition-colors duration-300 ${isDark ? "bg-[#0d1320]" : "bg-white"}`}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row flex-wrap justify-between gap-4 sm:gap-6 text-center text-xs sm:text-sm font-medium">
          {[
            { icon: "⭐", text: t.trustFeedback },
            { icon: "🌍", text: t.trustExporting },
            { icon: "✅", text: t.trustCertified },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-[#c4a484] text-2xl">{item.icon}</span>
              <p className={isDark ? "text-gray-300" : "text-gray-800"}>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ DIFFERENCE ═══════════ */}
      <section className={`py-12 sm:py-20 transition-colors duration-300 ${isDark ? "bg-[#101622]" : "bg-[#f9f8f6]"}`}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
          <h2
            className={`text-2xl sm:text-4xl font-bold text-center mb-10 sm:mb-16 ${isDark ? "text-white" : "text-[#1a1a1a]"}`}
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t.differenceTitle}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12">
            {[
              { icon: "🌿", title: t.authenticTitle, desc: t.authenticDesc },
              { icon: "🛠️", title: t.bespokeTitle, desc: t.bespokeDesc },
              { icon: "🚢", title: t.globalTitle, desc: t.globalDesc },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <span className="text-5xl mb-4 block text-[#c4a484]">{item.icon}</span>
                <h3
                  className={`text-2xl font-semibold mb-4 ${isDark ? "text-white" : "text-[#1a1a1a]"}`}
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {item.title}
                </h3>
                <p className={isDark ? "text-gray-400" : "text-gray-600"}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ COLLECTIONS ═══════════ */}
      <section className={`py-12 sm:py-20 transition-colors duration-300 ${isDark ? "bg-[#0d1320]" : "bg-white"}`}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-12 gap-4">
            <h2
              className={`text-2xl sm:text-4xl font-bold ${isDark ? "text-white" : "text-[#1a1a1a]"}`}
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {t.collectionsTitle}
            </h2>
            <Link
              to="/catalogue"
              className="text-[#c4a484] hover:underline flex items-center gap-1 text-sm font-medium"
            >
              {t.viewAll} <span>→</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                img: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=600&h=400&fit=crop",
                tag: t.newArrivals,
                title: t.modernClay,
              },
              {
                img: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=600&h=400&fit=crop",
                tag: t.signature,
                title: t.heritageGold,
              },
              {
                img: "https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=600&h=400&fit=crop",
                tag: t.limitedEdition,
                title: t.minimalistBlack,
              },
            ].map((col, i) => (
              <Link
                key={i}
                to="/catalogue"
                className="relative rounded-xl overflow-hidden group h-80"
              >
                <img
                  loading="lazy"
                  alt={col.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  src={col.img}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <p className="text-sm uppercase tracking-wide opacity-80">{col.tag}</p>
                  <h3 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {col.title}
                  </h3>
                  <span className="mt-2 inline-block text-sm hover:underline">{t.explore}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ FEATURED ═══════════ */}
      <section className="py-12 sm:py-20 bg-[#0a0a0a] text-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
          <h2
            className="text-2xl sm:text-4xl font-bold text-center mb-10 sm:mb-16"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t.featuredTitle}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
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
              <Link key={i} to="/catalogue" className="group">
                <img
                  loading="lazy"
                  alt={item.name}
                  className="w-full h-80 object-cover rounded-xl group-hover:shadow-xl transition-shadow"
                  src={item.img}
                />
                <h3 className="mt-4 text-lg font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {item.name}
                </h3>

              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ CTA / PARTNER ═══════════ */}
      <section className={`py-12 sm:py-20 text-center transition-colors duration-300 ${isDark ? "bg-[#101622]" : "bg-[#f9f8f6]"}`}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
          <h2
            className={`text-2xl sm:text-4xl font-bold mb-4 sm:mb-6 ${isDark ? "text-white" : "text-[#1a1a1a]"}`}
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t.partnerTitle}
          </h2>
          <p className={`text-sm sm:text-lg max-w-2xl mx-auto mb-6 sm:mb-8 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            {t.partnerDesc}
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
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
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#25D366] text-white font-semibold hover:bg-[#128C7E] transition-colors rounded-md"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.79 23.789l4.89-1.56A11.946 11.946 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818c-2.168 0-4.19-.617-5.908-1.682l-.424-.252-2.905.928.775-2.834-.277-.44A9.784 9.784 0 012.182 12c0-5.418 4.4-9.818 9.818-9.818S21.818 6.582 21.818 12s-4.4 9.818-9.818 9.818z" />
              </svg>
              {t.requestAccess}
            </button>
            <Link
              to="/catalogue"
              className={`px-8 py-4 border font-semibold transition-colors rounded-md ${isDark
                ? "border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                : "border-[#1a1a1a] text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white"
                }`}
            >
              {t.browseCatalogue}
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="bg-[#0a0a0a] text-gray-400 py-10 sm:py-16" role="contentinfo">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-8 sm:gap-12">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-xl font-bold text-white tracking-wide uppercase" style={{ fontFamily: "'Playfair Display', serif" }}>
                El Muttahida
              </span>
            </div>
            <p className="text-sm mb-6">{t.footerDesc}</p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider mb-6 text-sm">{t.shop}</h4>
            <ul className="space-y-4 text-sm">
              <li><Link className="hover:text-white transition-colors" to="/catalogue">{t.allProducts}</Link></li>
              <li><Link className="hover:text-white transition-colors" to="/catalogue">{t.newArrivals}</Link></li>
              <li><Link className="hover:text-white transition-colors" to="/catalogue">{t.bestSellers}</Link></li>
              <li><Link className="hover:text-white transition-colors" to="/catalogue">{t.catalogDownload}</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider mb-6 text-sm">{t.company}</h4>
            <ul className="space-y-4 text-sm">
              <li><span className="hover:text-white transition-colors cursor-pointer">{t.aboutUs}</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">{t.manufacturing}</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">{t.sustainability}</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">{t.careers}</span></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider mb-6 text-sm">{t.support}</h4>
            <ul className="space-y-4 text-sm">
              <li><span className="hover:text-white transition-colors cursor-pointer">{t.contactUs}</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">{t.shippingLogistics}</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">{t.wholesalePolicy}</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">{t.faq}</span></li>
            </ul>
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-4 mt-8 sm:mt-12">
          <p>{t.copyright}</p>
          <nav className="flex gap-6" aria-label="Footer navigation">
            <span className="hover:text-white transition-colors cursor-pointer">{t.privacyPolicy}</span>
            <span className="hover:text-white transition-colors cursor-pointer">{t.termsService}</span>
          </nav>
        </div>
      </footer>
    </div>
  );
}