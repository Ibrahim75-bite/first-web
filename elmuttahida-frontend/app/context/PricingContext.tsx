import { createContext, useState, useEffect, type ReactNode } from "react";

interface PricingContextType {
    showPrices: boolean;
    setShowPrices: (show: boolean) => void;
    togglePrices: () => void;
}

export const PricingContext = createContext<PricingContextType>({
    showPrices: false,
    setShowPrices: () => { },
    togglePrices: () => { },
});

export function PricingProvider({ children }: { children: ReactNode }) {
    // Default is false (prices hidden by default for B2B wholesale / RFQ mode)
    const [showPrices, setShowPricesState] = useState<boolean>(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("elmuttahida_show_prices");
        if (saved !== null) {
            setShowPricesState(saved === "true");
        } else {
            // Default to false as required
            setShowPricesState(false);
            localStorage.setItem("elmuttahida_show_prices", "false");
        }
        setMounted(true);

        const handleStorage = (e: StorageEvent) => {
            if (e.key === "elmuttahida_show_prices" && e.newValue !== null) {
                setShowPricesState(e.newValue === "true");
            }
        };
        window.addEventListener("storage", handleStorage);
        return () => window.removeEventListener("storage", handleStorage);
    }, []);

    const setShowPrices = (show: boolean) => {
        setShowPricesState(show);
        localStorage.setItem("elmuttahida_show_prices", show ? "true" : "false");
    };

    const togglePrices = () => {
        setShowPrices(!showPrices);
    };

    return (
        <PricingContext.Provider value={{ showPrices, setShowPrices, togglePrices }}>
            {children}
        </PricingContext.Provider>
    );
}
