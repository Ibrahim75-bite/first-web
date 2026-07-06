import type { Route } from "./+types/privacy-policy";
import { Link } from "react-router";

export const meta: Route.MetaFunction = () => [
    { title: "Privacy Policy | El-Muttahida" },
    {
        name: "description",
        content:
            "Privacy policy for El-Muttahida — B2B wholesale vase manufacturer.",
    },
];

export default function PrivacyPolicy() {
    return (
        <main className="min-h-screen py-20 px-6 sm:px-12 bg-gray-50 dark:bg-gray-950">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebPage",
                        additionalType: "https://schema.org/PrivacyPolicy",
                        name: "El-Muttahida Privacy Policy",
                        url: "https://elmuttahida.com/privacy-policy",
                    }),
                }}
            />

            <div className="max-w-4xl mx-auto">
                <nav className="mb-8">
                    <Link
                        to="/"
                        className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium text-sm flex items-center gap-2"
                    >
                        &larr; Back to Home
                    </Link>
                </nav>

                <div className="bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-8 sm:p-12 backdrop-blur-sm">
                    <header className="mb-12 border-b border-gray-200 dark:border-gray-800 pb-8">
                        <h1 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-4">
                            Privacy Policy
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400">
                            Last Updated: April 9, 2026
                        </p>
                    </header>

                    <div className="space-y-10 text-gray-700 dark:text-gray-300 leading-relaxed">
                        {/* 1. Introduction */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                1. Introduction
                            </h2>
                            <p>
                                Welcome to El-Muttahida. We are a B2B wholesale vase
                                manufacturer. This Privacy Policy details how we collect, use,
                                store, and protect personal and business data when you interact
                                with our services — whether through our website, WhatsApp
                                communications, or direct business engagements.
                            </p>
                        </section>

                        {/* 2. Information We Collect */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                2. Information We Collect
                            </h2>
                            <p>
                                We collect information necessary to process B2B transactions and
                                provide our manufacturing services:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 mt-4 marker:text-indigo-500">
                                <li>
                                    <strong>Account &amp; Business Data:</strong> Company name,
                                    contact person, email address, phone number, tax
                                    identification numbers, and shipping addresses.
                                </li>
                                <li>
                                    <strong>Order Data:</strong> Purchase orders, product
                                    specifications, custom finish requirements, quantities, and
                                    invoicing details.
                                </li>
                                <li>
                                    <strong>Session Data:</strong> We utilize JWT (JSON Web
                                    Tokens) for secure session authentication on our platform.
                                    These are not tracking cookies.
                                </li>
                            </ul>
                        </section>

                        {/* 3. WhatsApp Communications */}
                        <div className="bg-indigo-50 dark:bg-indigo-950/30 p-6 rounded-xl border border-indigo-100 dark:border-indigo-900/50">
                            <div className="flex items-start gap-3 mb-3">
                                <span className="shrink-0 bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded uppercase tracking-wide">
                                    ⚠️ Legal Review Required
                                </span>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white m-0">
                                    3. WhatsApp Communications &amp; Custom Finish Inquiries
                                </h2>
                            </div>
                            <p className="text-sm mt-2">
                                A significant portion of our B2B custom finish inquiries are
                                handled via WhatsApp. This includes the exchange of reference
                                images, finish samples, color specifications, and pricing
                                discussions. Data shared through WhatsApp is subject to Meta
                                Platforms' own privacy policy. We retain WhatsApp conversation
                                logs and shared media solely for order fulfillment and quality
                                assurance purposes.{" "}
                                <strong>
                                    [LEGAL TEAM: Define exact WhatsApp data retention period and
                                    deletion policy]
                                </strong>
                            </p>
                        </div>

                        {/* 4. Pricing & Financial Data */}
                        <div className="bg-indigo-50 dark:bg-indigo-950/30 p-6 rounded-xl border border-indigo-100 dark:border-indigo-900/50">
                            <div className="flex items-start gap-3 mb-3">
                                <span className="shrink-0 bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded uppercase tracking-wide">
                                    ⚠️ Legal Review Required
                                </span>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white m-0">
                                    4. Pricing Variability &amp; Financial Data
                                </h2>
                            </div>
                            <p className="text-sm mt-2">
                                Due to the bespoke nature of our vase manufacturing — including
                                custom glazes, hand-painted finishes, and variable material
                                costs — pricing is negotiated on a per-order basis. We store
                                pricing data, quotation history, and payment records securely.
                                This data is used exclusively for invoicing, accounting, and
                                dispute resolution.{" "}
                                <strong>
                                    [LEGAL TEAM: Confirm whether quoted prices constitute binding
                                    offers under applicable trade law]
                                </strong>
                            </p>
                        </div>

                        {/* 5. International Shipping & Customs */}
                        <div className="bg-indigo-50 dark:bg-indigo-950/30 p-6 rounded-xl border border-indigo-100 dark:border-indigo-900/50">
                            <div className="flex items-start gap-3 mb-3">
                                <span className="shrink-0 bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded uppercase tracking-wide">
                                    ⚠️ Legal Review Required
                                </span>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white m-0">
                                    5. International Shipping &amp; Customs Responsibilities
                                </h2>
                            </div>
                            <p className="text-sm mt-2">
                                For international orders, we share necessary business data
                                (company name, addresses, order contents, HS codes, declared
                                values) with freight forwarders, customs brokers, and relevant
                                regulatory authorities. The division of customs duties, import
                                taxes, and clearance responsibilities between El-Muttahida and
                                the buyer is defined in each individual purchase agreement.{" "}
                                <strong>
                                    [LEGAL TEAM: Define default Incoterms and liability boundaries
                                    for fragile goods]
                                </strong>
                            </p>
                        </div>

                        {/* 6. Cookies & Analytics */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                6. Cookies &amp; Analytics
                            </h2>
                            <p>
                                We use Vercel Speed Insights to measure website performance.
                                This tool collects anonymized, aggregated performance metrics
                                and does not track individual users. Our JWT-based
                                authentication does not rely on third-party tracking cookies.
                            </p>
                        </section>

                        {/* 7. Data Sharing */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                7. Data Sharing &amp; Third Parties
                            </h2>
                            <p>
                                We do not sell your personal or business data. We share data
                                only with: payment processors for transaction settlement,
                                freight forwarders for shipment logistics, and cloud
                                infrastructure providers for hosting. All third-party partners
                                are contractually bound to protect your data.
                            </p>
                        </section>

                        {/* 8. Your Rights */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                8. Your Rights
                            </h2>
                            <p>
                                In accordance with applicable data protection regulations
                                (including GDPR where applicable), you have the right to
                                access, rectify, or request deletion of your personal data. To
                                exercise these rights, please contact us directly.
                            </p>
                        </section>

                        {/* 9. Contact */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                9. Contact Information
                            </h2>
                            <p>
                                If you have questions about this Privacy Policy or wish to
                                exercise your data rights, please contact our compliance team
                                via email or WhatsApp.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    );
}
