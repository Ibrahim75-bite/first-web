import { createContext, useState, useEffect, type ReactNode } from "react";

type Language = "en" | "ar";

interface LanguageContextType {
    lang: Language;
    setLang: (lang: Language) => void;
    dir: "ltr" | "rtl";
}

export const LanguageContext = createContext<LanguageContextType>({
    lang: "en",
    setLang: () => { },
    dir: "ltr",
});

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [lang, setLangState] = useState<Language>("en");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("elmuttahida_lang") as Language;
        if (saved === "ar" || saved === "en") {
            setLangState(saved);
        } else {
            // Default to English if no preference
            setLangState("en");
        }
        setMounted(true);
    }, []);

    const setLang = (newLang: Language) => {
        setLangState(newLang);
        localStorage.setItem("elmuttahida_lang", newLang);
    };

    const dir = lang === "ar" ? "rtl" : "ltr";

    // Prevent hydration mismatch by rendering default initially
    if (!mounted) {
        return (
            <LanguageContext.Provider value={{ lang: "en", setLang, dir: "ltr" }}>
                {children}
            </LanguageContext.Provider>
        );
    }

    return (
        <LanguageContext.Provider value={{ lang, setLang, dir }}>
            <div dir={dir} className={lang === "ar" ? "font-arabic" : "font-sans"}>
                {children}
            </div>
        </LanguageContext.Provider>
    );
}
