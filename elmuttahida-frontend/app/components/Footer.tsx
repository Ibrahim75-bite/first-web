import { Link, useLocation } from "react-router";
import { useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";

export function Footer() {
    const location = useLocation();
    if (location.pathname.startsWith("/admin")) {
        return null;
    }
    const { lang, dir } = useContext(LanguageContext);
    const isArabic = lang === "ar";

    const t = {
        desc: isArabic
            ? "نمزج تقاليد السيراميك المصرية العريقة مع التصميم المعاصر البسيط. نوفر لمتاجر التجزئة ومصممي الديكور حول العالم مزهريات فخار يدوية الصنع ممتازة."
            : "Exquisite Egyptian pottery traditions blended with contemporary minimalist design. Supplying global retailers and interior designers with premium handmade vases.",
        shop: isArabic ? "تسوق" : "Shop",
        allProducts: isArabic ? "جميع المنتجات" : "All Products",
        newArrivals: isArabic ? "الوصول الجديد" : "New Arrivals",
        bestSellers: isArabic ? "الأكثر مبيعًا" : "Best Sellers",
        customFinishes: isArabic ? "تشطيبات مخصصة" : "Custom Finishes",
        company: isArabic ? "الشركة" : "Company",
        aboutUs: isArabic ? "عن المتحدة" : "About El-Muttahida",
        manufacturing: isArabic ? "عملية التصنيع" : "Manufacturing Process",
        sustainability: isArabic ? "الاستدامة" : "Sustainability",
        careers: isArabic ? "الوظائف" : "Careers",
        support: isArabic ? "الدعم والتصدير" : "Support & Export",
        contactUs: isArabic ? "اتصل بنا" : "Contact Us",
        shipping: isArabic ? "الشحن واللوجستيات" : "Shipping & Logistics",
        wholesalePolicy: isArabic ? "سياسة الجملة" : "Wholesale Policy",
        faq: isArabic ? "الأسئلة الشائعة" : "FAQ",
        copyright: isArabic
            ? "© 2026 شركة المتحدة للفنون المصرية المسجلة. جميع الحقوق محفوظة."
            : "© 2026 El-Muttahida. All rights reserved. Registered Egyptian Art & Ceramics Company.",
        privacyPolicy: isArabic ? "سياسة الخصوصية" : "Privacy Policy",
        termsService: isArabic ? "شروط الخدمة" : "Terms of Service",
    };

    return (
        <footer className="bg-gray-950 text-white pt-16 sm:pt-20 pb-10 border-t border-gray-900 transition-colors" dir={dir}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 sm:gap-12 mb-16 sm:mb-20 ltr:text-left rtl:text-right">

                {/* Brand & Social Links */}
                <div className="space-y-5">
                    <h2 className="text-2xl font-black tracking-tighter uppercase font-serif">
                        EL MUTTAHIDA
                    </h2>
                    <p className="text-gray-400 text-sm leading-relaxed max-w-xs font-light">
                        {t.desc}
                    </p>
                    <div className="flex gap-3 pt-2">
                        <a
                            href="https://wa.me/201065583355"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full border border-gray-800 flex items-center justify-center hover:bg-[#25D366] hover:border-[#25D366] hover:text-white text-gray-400 transition-all"
                            aria-label="WhatsApp"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
                            </svg>
                        </a>
                        <a
                            href="https://www.instagram.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full border border-gray-800 flex items-center justify-center hover:bg-white hover:text-black text-gray-400 transition-all"
                            aria-label="Instagram"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858-.182-.466-.398-.8-.748-1.15-.35-.35-.683-.566-1.15-.748-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16.4a4.4 4.4 0 110-8.8 4.4 4.4 0 010 8.8zm6.487-11.591a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z" clipRule="evenodd" />
                            </svg>
                        </a>
                    </div>
                </div>

                {/* Shop */}
                <div>
                    <h3 className="text-white font-bold mb-5 text-sm tracking-wider uppercase">{t.shop}</h3>
                    <ul className="space-y-3.5 text-gray-400 text-sm font-light">
                        <li><Link to="/catalogue" className="hover:text-primary transition-colors">{t.allProducts}</Link></li>
                        <li><Link to="/catalogue" className="hover:text-primary transition-colors">{t.newArrivals}</Link></li>
                        <li><Link to="/catalogue" className="hover:text-primary transition-colors">{t.bestSellers}</Link></li>
                        <li><Link to="/products/custom-finishes" className="hover:text-primary transition-colors">{t.customFinishes}</Link></li>
                    </ul>
                </div>

                {/* Company */}
                <div>
                    <h3 className="text-white font-bold mb-5 text-sm tracking-wider uppercase">{t.company}</h3>
                    <ul className="space-y-3.5 text-gray-400 text-sm font-light">
                        <li><Link to="/about" className="hover:text-primary transition-colors">{t.aboutUs}</Link></li>
                        <li><Link to="/manufacturing" className="hover:text-primary transition-colors">{t.manufacturing}</Link></li>
                        <li><Link to="/sustainability" className="hover:text-primary transition-colors">{t.sustainability}</Link></li>
                        <li><Link to="/careers" className="hover:text-primary transition-colors">{t.careers}</Link></li>
                    </ul>
                </div>

                {/* Support & Export */}
                <div>
                    <h3 className="text-white font-bold mb-5 text-sm tracking-wider uppercase">{t.support}</h3>
                    <ul className="space-y-3.5 text-gray-400 text-sm font-light">
                        <li><Link to="/contact" className="hover:text-primary transition-colors">{t.contactUs}</Link></li>
                        <li><Link to="/shipping" className="hover:text-primary transition-colors">{t.shipping}</Link></li>
                        <li><Link to="/wholesale" className="hover:text-primary transition-colors">{t.wholesalePolicy}</Link></li>
                        <li><Link to="/faq" className="hover:text-primary transition-colors">{t.faq}</Link></li>
                    </ul>
                </div>
            </div>

            {/* Bottom Legal bar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 border-t border-gray-900 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500 font-light ltr:text-left rtl:text-right">
                <p>{t.copyright}</p>
                <div className="flex gap-6 sm:gap-8">
                    <Link to="/privacy-policy" className="hover:text-white transition-colors">{t.privacyPolicy}</Link>
                    <Link to="/terms" className="hover:text-white transition-colors">{t.termsService}</Link>
                </div>
            </div>
        </footer>
    );
}
