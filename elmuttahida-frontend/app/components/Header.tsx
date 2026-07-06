import { Link, useLocation } from "react-router";
import { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { LanguageContext } from "../context/LanguageContext";

export function Header() {
    const location = useLocation();
    const isHome = location.pathname === "/";
    const [isScrolled, setIsScrolled] = useState(false);
    const { theme, toggleTheme } = useContext(ThemeContext);
    const { lang, setLang } = useContext(LanguageContext);
    const [cartCount, setCartCount] = useState(0);

    const toggleLanguage = () => setLang(lang === "en" ? "ar" : "en");

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
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("cartUpdated", updateCartCount);
            window.removeEventListener("storage", updateCartCount);
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const t = {
        collections: lang === "ar" ? "المجموعات" : "Collections",
        catalogue: lang === "ar" ? "الكتالوج" : "Catalogue",
        blog: lang === "ar" ? "المدونة" : "Blog",
        aboutUs: lang === "ar" ? "معلومات عنا" : "About Us",
        inquire: lang === "ar" ? "استفسار" : "Inquire"
    };

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
                ? "bg-white/80 dark:bg-gray-950/80 backdrop-blur-md shadow-sm py-4"
                : "bg-transparent py-6"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 group">
                    <span className={`text-2xl font-black tracking-tighter transition-colors group-hover:text-indigo-600 ${isScrolled ? "text-gray-900 dark:text-white" : (isHome ? "text-white" : "text-gray-900 dark:text-white")
                        }`}>
                        EL MUTTAHIDA
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    {[
                        { name: t.collections, href: "/#collections" },
                        { name: t.catalogue, href: "/catalogue" },
                        { name: t.blog, href: "/blog" },
                        { name: t.aboutUs, href: "/#about" },
                    ].map((item) => (
                        <Link
                            key={item.href}
                            to={item.href}
                            className={`text-sm font-medium tracking-wide transition-colors ${isScrolled
                                ? "text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                                : (isHome ? "text-gray-200 hover:text-white" : "text-gray-700 dark:text-gray-200 hover:text-indigo-600 hover:dark:text-indigo-400")
                                }`}
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className={`p-2 rounded-full transition-colors ${isScrolled
                            ? "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                            : (isHome ? "text-white hover:bg-white/10" : "text-gray-700 dark:text-gray-200 hover:bg-black/10 dark:hover:bg-white/10")
                            }`}
                        aria-label="Toggle Theme"
                    >
                        {theme === 'dark' ? (
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        ) : (
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            </svg>
                        )}
                    </button>

                    {/* Language Toggle */}
                    <button
                        onClick={toggleLanguage}
                        className={`font-semibold text-sm px-2 py-1 transition-colors ${isScrolled
                            ? "text-gray-600 dark:text-gray-400 hover:text-indigo-600"
                            : (isHome ? "text-white" : "text-gray-700 dark:text-gray-200 hover:text-indigo-600")
                            }`}
                    >
                        {lang === "en" ? "عربي" : "EN"}
                    </button>

                    {/* Cart Icon */}
                    <Link
                        to="/cart"
                        className={`relative p-2 rounded-full transition-colors ${isScrolled
                            ? "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                            : (isHome ? "text-white hover:bg-white/10" : "text-gray-700 dark:text-gray-200 hover:bg-black/10 dark:hover:bg-white/10")
                            }`}
                        aria-label="Cart"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    <Link
                        to="/products/custom-finishes"
                        className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-widest rounded-full transition-all shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-0.5 whitespace-nowrap"
                    >
                        {t.inquire}
                    </Link>
                </div>
            </div>
        </nav>
    );
}
