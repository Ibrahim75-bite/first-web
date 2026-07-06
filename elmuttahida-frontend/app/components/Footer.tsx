import { Link } from "react-router";
import { useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";

export function Footer() {
    const { lang } = useContext(LanguageContext);
    const isArabic = lang === "ar";

    const t = {
        desc: isArabic
            ? "نمزج تقاليد السيراميك المصرية العريقة مع التصميم المعاصر البسيط. نوفر لمتاجر التجزئة العالمية مزهريات يدوية الصنع ممتازة."
            : "Exquisite Egyptian pottery traditions blended with contemporary minimalist design. Supplying global retailers with premium handmade vases.",
        shop: isArabic ? "تسوق" : "Shop",
        allProducts: isArabic ? "جميع المنتجات" : "All Products",
        newArrivals: isArabic ? "الوصول الجديد" : "New Arrivals",
        bestSellers: isArabic ? "الأكثر مبيعًا" : "Best Sellers",
        customFinishes: isArabic ? "تشطيبات مخصصة" : "Custom Finishes",
        company: isArabic ? "الشركة" : "Company",
        aboutUs: isArabic ? "عن المتحدة" : "About El Muttahida",
        manufacturing: isArabic ? "عملية التصنيع" : "Manufacturing Process",
        sustainability: isArabic ? "الاستدامة" : "Sustainability",
        careers: isArabic ? "الوظائف" : "Careers",
        support: isArabic ? "الدعم" : "Support",
        contactUs: isArabic ? "اتصل بنا" : "Contact Us",
        shipping: isArabic ? "الشحن واللوجستيات" : "Shipping & Logistics",
        wholesalePolicy: isArabic ? "سياسة الجملة" : "Wholesale Policy",
        faq: isArabic ? "الأسئلة الشائعة" : "FAQ",
        copyright: isArabic
            ? "© 2026 شركة المتحدة للفنون المصرية المسجلة. جميع الحقوق محفوظة."
            : "© 2026 El Muttahida. All rights reserved. Registered Egyptian Art Company.",
        privacyPolicy: isArabic ? "سياسة الخصوصية" : "Privacy Policy",
        termsService: isArabic ? "شروط الخدمة" : "Terms of Service",
    };

    return (
        <footer className="bg-gray-950 text-white pt-20 pb-10 border-t border-gray-900">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">

                {/* Brand & Social Links */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-black tracking-tighter uppercase font-serif">
                        EL MUTTAHIDA
                    </h2>
                    <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                        {t.desc}
                    </p>
                    <div className="flex gap-4">
                        <a
                            href="https://www.instagram.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full border border-gray-800 flex items-center justify-center hover:bg-white hover:text-black transition-all"
                        >
                            <span className="sr-only">Instagram</span>
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858-.182-.466-.398-.8-.748-1.15-.35-.35-.683-.566-1.15-.748-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16.4a4.4 4.4 0 110-8.8 4.4 4.4 0 010 8.8zm6.487-11.591a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z" clipRule="evenodd" />
                            </svg>
                        </a>
                        <a
                            href="https://wa.me/201065583355"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full border border-gray-800 flex items-center justify-center hover:bg-white hover:text-black transition-all"
                        >
                            <span className="sr-only">WhatsApp</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                            </svg>
                        </a>
                    </div>
                </div>

                {/* Shop */}
                <div>
                    <h3 className="text-white font-bold mb-6 text-sm tracking-wider uppercase">{t.shop}</h3>
                    <ul className="space-y-4 text-gray-500 text-sm">
                        <li><Link to="/catalogue" className="hover:text-white transition-colors">{t.allProducts}</Link></li>
                        <li><Link to="/catalogue" className="hover:text-white transition-colors">{t.newArrivals}</Link></li>
                        <li><Link to="/catalogue" className="hover:text-white transition-colors">{t.bestSellers}</Link></li>
                        <li><Link to="/products/custom-finishes" className="hover:text-white transition-colors">{t.customFinishes}</Link></li>
                    </ul>
                </div>

                {/* Company */}
                <div>
                    <h3 className="text-white font-bold mb-6 text-sm tracking-wider uppercase">{t.company}</h3>
                    <ul className="space-y-4 text-gray-500 text-sm">
                        <li><Link to="/#about" className="hover:text-white transition-colors">{t.aboutUs}</Link></li>
                        <li><Link to="/blog" className="hover:text-white transition-colors">{t.manufacturing}</Link></li>
                        <li><Link to="/blog" className="hover:text-white transition-colors">{t.sustainability}</Link></li>
                        <li><Link to="#" className="hover:text-white transition-colors">{t.careers}</Link></li>
                    </ul>
                </div>

                {/* Support */}
                <div>
                    <h3 className="text-white font-bold mb-6 text-sm tracking-wider uppercase">{t.support}</h3>
                    <ul className="space-y-4 text-gray-500 text-sm">
                        <li><Link to="/products/custom-finishes" className="hover:text-white transition-colors">{t.contactUs}</Link></li>
                        <li><Link to="/blog" className="hover:text-white transition-colors">{t.shipping}</Link></li>
                        <li><Link to="/privacy-policy" className="hover:text-white transition-colors">{t.wholesalePolicy}</Link></li>
                        <li><Link to="#" className="hover:text-white transition-colors">{t.faq}</Link></li>
                    </ul>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="max-w-7xl mx-auto px-6 pt-10 border-t border-gray-900 flex flex-col md:flex-row justify-between items-center gap-6">
                <p className="text-gray-600 text-xs">{t.copyright}</p>
                <div className="flex gap-8 text-xs text-gray-600">
                    <Link to="/privacy-policy" className="hover:text-white transition-colors">{t.privacyPolicy}</Link>
                    <Link to="#" className="hover:text-white transition-colors">{t.termsService}</Link>
                </div>
            </div>
        </footer>
    );
}
