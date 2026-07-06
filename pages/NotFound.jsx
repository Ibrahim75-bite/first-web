import { useContext } from "react";
import { Link } from "react-router-dom";
import { LanguageContext } from "../context/LanguageContext";
import { ThemeContext } from "../context/ThemeContext";

const labels = {
    en: {
        code: "404",
        title: "Page Not Found",
        desc: "The page you're looking for doesn't exist or has been moved.",
        home: "Back to Home",
        catalogue: "Browse Catalogue",
    },
    ar: {
        code: "404",
        title: "الصفحة غير موجودة",
        desc: "الصفحة التي تبحث عنها غير موجودة أو تم نقلها.",
        home: "العودة للرئيسية",
        catalogue: "تصفح الكتالوج",
    },
};

export default function NotFound() {
    const { lang } = useContext(LanguageContext);
    const { theme } = useContext(ThemeContext);
    const t = labels[lang] || labels.en;
    const isDark = theme === "dark";

    return (
        <div className="flex min-h-[80vh] items-center justify-center px-6">
            <div className="text-center max-w-lg">
                {/* Big 404 */}
                <div className="relative mb-8">
                    <span
                        className={`block text-[10rem] sm:text-[14rem] font-black leading-none select-none ${isDark ? "text-gray-800" : "text-gray-100"
                            }`}
                        style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                        {t.code}
                    </span>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div
                            className={`h-24 w-24 sm:h-32 sm:w-32 rounded-full flex items-center justify-center ${isDark ? "bg-[#1a2332]" : "bg-white shadow-lg"
                                }`}
                        >
                            <svg
                                className={`h-12 w-12 sm:h-16 sm:w-16 ${isDark ? "text-gray-600" : "text-gray-300"
                                    }`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={1.5}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Title */}
                <h1
                    className={`text-2xl sm:text-3xl font-bold mb-3 ${isDark ? "text-white" : "text-gray-900"
                        }`}
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                    {t.title}
                </h1>

                {/* Description */}
                <p
                    className={`text-sm sm:text-base mb-8 ${isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                >
                    {t.desc}
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#0071e3] text-white text-sm font-semibold rounded-full hover:bg-[#0060c0] transition-colors shadow-lg shadow-blue-500/25"
                    >
                        <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                            />
                        </svg>
                        {t.home}
                    </Link>
                    <Link
                        to="/catalogue"
                        className={`inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-full border transition-colors ${isDark
                                ? "border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                                : "border-gray-300 text-gray-700 hover:bg-gray-100"
                            }`}
                    >
                        {t.catalogue}
                        <span>{lang === "ar" ? "←" : "→"}</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
