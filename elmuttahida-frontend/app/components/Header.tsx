import { Link, useLocation } from "react-router";
import { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { LanguageContext } from "../context/LanguageContext";

export function Header() {
    const location = useLocation();
    if (location.pathname.startsWith("/admin")) {
        return null;
    }
    const isHome = location.pathname === "/";
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { theme, toggleTheme } = useContext(ThemeContext);
    const { lang, setLang } = useContext(LanguageContext);
    const [cartCount, setCartCount] = useState(0);

    const isArabic = lang === "ar";
    const toggleLanguage = () => setLang(lang === "en" ? "ar" : "en");

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isMobileMenuOpen]);

    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setIsMobileMenuOpen(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Cart count & scroll listener
    useEffect(() => {
        const updateCartCount = () => {
            try {
                const cart = JSON.parse(localStorage.getItem("elmuttahida_inquiryCart") || "[]");
                setCartCount(cart.length);
            } catch (e) {
                setCartCount(0);
            }
        };

        updateCartCount();
        window.addEventListener("cartUpdated", updateCartCount);
        window.addEventListener("storage", updateCartCount);

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 30);
        };
        handleScroll();
        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("cartUpdated", updateCartCount);
            window.removeEventListener("storage", updateCartCount);
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const t = {
        collections: isArabic ? "المجموعات" : "Collections",
        catalogue: isArabic ? "الكتالوج" : "Catalogue",
        customFinishes: isArabic ? "تشطيبات مخصصة" : "Custom Finishes",
        blog: isArabic ? "المدونة" : "Blog",
        aboutUs: isArabic ? "عن الشركة" : "About Us",
        inquire: isArabic ? "طلب خاص" : "B2B Inquiry",
        cart: isArabic ? "سلة الاستفسارات" : "Inquiry Cart",
        menu: isArabic ? "القائمة" : "Menu",
        close: isArabic ? "إغلاق" : "Close",
        themeName: isArabic ? (theme === "dark" ? "الوضع النهاري" : "الوضع الليلي") : (theme === "dark" ? "Light Mode" : "Dark Mode"),
        languageName: isArabic ? "English" : "العربية",
        contactWhatsApp: isArabic ? "تواصل معنا عبر واتساب" : "Chat on WhatsApp",
        tagline: isArabic ? "خزف وفخار مصري أصيل للمساحات العالمية" : "Authentic Egyptian pottery for global spaces",
        emptyCart: isArabic ? "السلة فارغة" : "Cart is empty",
        itemsInCart: isArabic ? `لديك ${cartCount} منتجات في السلة` : `${cartCount} items in inquiry cart`,
    };

    const navLinks = [
        { name: t.collections, href: "/#collections" },
        { name: t.catalogue, href: "/catalogue" },
        { name: t.customFinishes, href: "/products/custom-finishes" },
        { name: t.blog, href: "/blog" },
        { name: t.aboutUs, href: "/#about" },
    ];

    // Header styling based on page and scroll
    const isSolidNavbar = isScrolled || !isHome;
    const navBg = isSolidNavbar
        ? "bg-white/90 dark:bg-gray-950/90 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-gray-850 py-3 sm:py-4"
        : "bg-transparent py-4 sm:py-6";

    const textColor = isSolidNavbar
        ? "text-gray-900 dark:text-white"
        : (isHome ? "text-white" : "text-gray-900 dark:text-white");

    const linkColor = isSolidNavbar
        ? "text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400"
        : (isHome ? "text-gray-100 hover:text-white" : "text-gray-700 dark:text-gray-200 hover:text-indigo-600");

    const iconBtnHover = isSolidNavbar
        ? "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
        : (isHome ? "text-white hover:bg-white/15" : "text-gray-700 dark:text-gray-200 hover:bg-black/5 dark:hover:bg-white/10");

    return (
        <>
            <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${navBg}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4">
                    
                    {/* Brand Logo */}
                    <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
                        <span className={`text-lg sm:text-xl lg:text-2xl font-black tracking-tight uppercase font-serif transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-400 ${textColor}`}>
                            EL MUTTAHIDA
                        </span>
                    </Link>

                    {/* Desktop Navigation Links (>= lg, 1024px+) */}
                    <nav className="hidden lg:flex items-center gap-6 xl:gap-8" aria-label="Main Navigation">
                        {navLinks.map((item) => (
                            <Link
                                key={item.href}
                                to={item.href}
                                className={`text-sm font-medium tracking-wide transition-colors relative py-1 hover:-translate-y-0.5 transform duration-150 ${linkColor}`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Right-Side Action Controls */}
                    <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
                        
                        {/* Theme Toggle Button */}
                        <button
                            onClick={toggleTheme}
                            className={`p-2 rounded-full transition-all flex items-center justify-center ${iconBtnHover}`}
                            aria-label="Toggle Dark/Light Theme"
                            title={t.themeName}
                        >
                            {theme === "dark" ? (
                                <svg className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            ) : (
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                            )}
                        </button>

                        {/* Language Toggle Button */}
                        <button
                            onClick={toggleLanguage}
                            className={`px-2.5 py-1 text-xs font-bold rounded-full border transition-all ${
                                isSolidNavbar
                                    ? "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-indigo-500 hover:text-indigo-600"
                                    : (isHome ? "border-white/30 text-white hover:bg-white/20" : "border-gray-300 text-gray-800 hover:border-indigo-500")
                            }`}
                            aria-label="Switch Language"
                        >
                            {lang === "en" ? "عربي" : "EN"}
                        </button>

                        {/* Cart Button */}
                        <Link
                            to="/cart"
                            className={`relative p-2 rounded-full transition-all flex items-center justify-center ${iconBtnHover}`}
                            aria-label="View Inquiry Cart"
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {cartCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-gray-950 animate-pulse">
                                    {cartCount > 9 ? "9+" : cartCount}
                                </span>
                            )}
                        </Link>

                        {/* Desktop-only Inquire CTA (hidden below lg) */}
                        <Link
                            to="/products/custom-finishes"
                            className="hidden lg:inline-flex items-center px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-widest rounded-full transition-all shadow-md hover:shadow-indigo-500/25 hover:-translate-y-0.5 whitespace-nowrap"
                        >
                            {t.inquire}
                        </Link>

                        {/* Mobile & Tablet Hamburger Toggle (< lg) */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className={`lg:hidden p-2 rounded-xl transition-all flex items-center justify-center ${iconBtnHover}`}
                            aria-label={isMobileMenuOpen ? t.close : t.menu}
                            aria-expanded={isMobileMenuOpen}
                        >
                            {isMobileMenuOpen ? (
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>

                    </div>
                </div>
            </header>

            {/* Mobile / Tablet Navigation Drawer Overlay */}
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 lg:hidden ${
                    isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
                aria-hidden="true"
            />

            {/* Mobile / Tablet Slide-out Drawer Panel */}
            <aside
                className={`fixed top-0 bottom-0 z-50 w-[85vw] max-w-md bg-white dark:bg-gray-950 shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-out lg:hidden ${
                    isArabic ? "left-0" : "right-0"
                } ${
                    isMobileMenuOpen
                        ? "translate-x-0"
                        : (isArabic ? "-translate-x-full" : "translate-x-full")
                }`}
                dir={isArabic ? "rtl" : "ltr"}
                aria-label="Mobile Navigation Menu"
            >
                {/* Drawer Header */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-850 flex items-center justify-between">
                    <Link
                        to="/"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-2"
                    >
                        <span className="text-lg font-black tracking-tight uppercase font-serif text-gray-950 dark:text-white">
                            EL MUTTAHIDA
                        </span>
                    </Link>
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="p-2 rounded-full text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-850 transition-colors"
                        aria-label={t.close}
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Drawer Navigation Links */}
                <div className="p-6 overflow-y-auto flex-1 space-y-2">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3 px-3">
                        {t.menu}
                    </p>
                    {navLinks.map((item) => (
                        <Link
                            key={item.href}
                            to={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center justify-between px-3 py-3 rounded-xl text-base font-medium text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                        >
                            <span>{item.name}</span>
                            <span className="text-gray-400 dark:text-gray-600 text-sm">
                                {isArabic ? "←" : "→"}
                            </span>
                        </Link>
                    ))}

                    {/* Cart in Mobile Drawer */}
                    <Link
                        to="/cart"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center justify-between px-3 py-3 rounded-xl text-base font-medium text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mt-2"
                    >
                        <div className="flex items-center gap-3">
                            <svg className="h-5 w-5 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span>{t.cart}</span>
                        </div>
                        {cartCount > 0 ? (
                            <span className="px-2 py-0.5 text-xs font-bold bg-red-500 text-white rounded-full">
                                {cartCount}
                            </span>
                        ) : (
                            <span className="text-xs text-gray-400">0</span>
                        )}
                    </Link>

                    {/* Primary B2B Action Button */}
                    <div className="pt-6 pb-2">
                        <Link
                            to="/products/custom-finishes"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm tracking-wide transition-all shadow-md shadow-indigo-500/20"
                        >
                            <span>{t.inquire}</span>
                            <span>{isArabic ? "←" : "→"}</span>
                        </Link>
                    </div>

                    {/* WhatsApp Fast Link */}
                    <a
                        href="https://wa.me/201065583355"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-200 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                    >
                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
                        </svg>
                        <span>{t.contactWhatsApp}</span>
                    </a>
                </div>

                {/* Drawer Footer Settings */}
                <div className="p-6 border-t border-gray-100 dark:border-gray-850 bg-gray-50/50 dark:bg-gray-900/40 space-y-4">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400 font-medium">
                            {isArabic ? "المظهر" : "Appearance"}
                        </span>
                        <button
                            onClick={toggleTheme}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            {theme === "dark" ? (
                                <>
                                    <svg className="h-4 w-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                    <span>Light</span>
                                </>
                            ) : (
                                <>
                                    <svg className="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                    </svg>
                                    <span>Dark</span>
                                </>
                            )}
                        </button>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400 font-medium">
                            {isArabic ? "اللغة" : "Language"}
                        </span>
                        <button
                            onClick={toggleLanguage}
                            className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            {t.languageName}
                        </button>
                    </div>

                    <p className="text-[11px] text-gray-400 dark:text-gray-600 text-center pt-2">
                        {t.tagline}
                    </p>
                </div>
            </aside>
        </>
    );
}
