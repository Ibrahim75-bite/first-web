import type { Route } from "./+types/contact";
import { Link } from "react-router";
import { useContext, useState } from "react";
import { LanguageContext } from "../context/LanguageContext";

export const meta: Route.MetaFunction = () => [
    { title: "Contact Us & B2B Inquiries | El-Muttahida" },
    {
        name: "description",
        content: "Connect with the El-Muttahida export desk. Request wholesale pricing, schedule studio visits, or chat directly via WhatsApp.",
    },
];

export default function Contact() {
    const { lang, dir } = useContext(LanguageContext);
    const isArabic = lang === "ar";
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        company: "",
        email: "",
        country: "",
        message: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Construct WhatsApp link with formatted inquiry
        const text = isArabic
            ? `استفسار جديد من الموقع:\nالاسم: ${formData.name}\nالشركة: ${formData.company}\nالدولة: ${formData.country}\nالبريد: ${formData.email}\nالرسالة: ${formData.message}`
            : `New Website Inquiry:\nName: ${formData.name}\nCompany: ${formData.company}\nCountry: ${formData.country}\nEmail: ${formData.email}\nMessage: ${formData.message}`;

        window.open(`https://wa.me/201065583355?text=${encodeURIComponent(text)}`, "_blank");
        setSubmitted(true);
    };

    return (
        <main className="min-h-screen py-28 sm:py-36 px-4 sm:px-6 lg:px-8 bg-surface dark:bg-gray-950 text-secondary dark:text-white transition-colors" dir={dir}>
            <div className="max-w-6xl mx-auto space-y-16 sm:space-y-24">
                
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto space-y-4 sm:space-y-6">
                    <span className="inline-block px-4 py-1 bg-primary/20 text-primary-dark dark:text-primary text-xs font-bold uppercase tracking-widest rounded-full">
                        {isArabic ? "تواصل مع فريق التصدير" : "Direct Export Desk"}
                    </span>
                    <h1 className="text-4xl sm:text-6xl font-serif font-black tracking-tight leading-tight">
                        {isArabic ? "اتصل بنا وتواصل مباشرة" : "Get in Touch with Our Team"}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-base sm:text-xl font-light leading-relaxed">
                        {isArabic
                            ? "يسعدنا الرد على استفسارات الموزعين، مصممي الديكور، ومستوردي الخزف حول العالم. تواصل معنا عبر واتساب أو البريد."
                            : "Whether you are planning a container-load order, requesting samples, or commissioning bespoke vase finishes, we respond within 24 hours."}
                    </p>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-14 items-start">
                    
                    {/* Contact Info Cards (5 cols) */}
                    <div className="lg:col-span-5 space-y-6 ltr:text-left rtl:text-right">
                        
                        {/* WhatsApp Fast Card */}
                        <div className="p-6 sm:p-8 rounded-3xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900/50 space-y-4">
                            <div className="flex items-center gap-3">
                                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500 text-white text-xl">
                                    💬
                                </span>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-950 dark:text-white font-serif">
                                        {isArabic ? "محادثة فورية عبر واتساب" : "Instant WhatsApp Support"}
                                    </h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {isArabic ? "متاح 7 أيام في الأسبوع" : "Available 7 days / week"}
                                    </p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                {isArabic
                                    ? "أسرع طريقة للحصول على صور فورية للمنتجات وعروض أسعار الجملة للطلبيات العاجلة."
                                    : "The fastest channel for catalog updates, real-time kiln sample photos, and expedited container quotes."}
                            </p>
                            <a
                                href="https://wa.me/201065583355"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#128C7E] text-white font-bold text-sm transition-colors shadow-md"
                            >
                                <span>{isArabic ? "تحدث معنا الآن (+201065583355)" : "Chat on WhatsApp (+201065583355)"}</span>
                            </a>
                        </div>

                        {/* Email & Details */}
                        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-850 shadow-sm space-y-5">
                            <div>
                                <span className="text-xs font-bold uppercase tracking-wider text-primary block mb-1">
                                    {isArabic ? "البريد الإلكتروني للتصدير" : "Export Sales Desk"}
                                </span>
                                <a href="mailto:export@elmuttahida.com" className="text-lg font-bold hover:text-primary transition-colors">
                                    export@elmuttahida.com
                                </a>
                            </div>

                            <div>
                                <span className="text-xs font-bold uppercase tracking-wider text-primary block mb-1">
                                    {isArabic ? "المقر والمكتب التجاري" : "Cairo Commercial Office"}
                                </span>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {isArabic ? "القاهرة، جمهورية مصر العربية" : "Cairo, Arab Republic of Egypt"}
                                </p>
                            </div>

                            <div>
                                <span className="text-xs font-bold uppercase tracking-wider text-primary block mb-1">
                                    {isArabic ? "ورش العمل والأفران" : "Artisan Production Facilities"}
                                </span>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {isArabic ? "قرية الفسطاط للخزف، القاهرة / استوديوهات قنا وادي النيل" : "Al-Fustat Traditional Pottery Quarter / Upper Egypt Kiln Studios"}
                                </p>
                            </div>

                            <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                                <span className="text-xs text-gray-400">
                                    {isArabic ? "مواعيد العمل: الأحد - الخميس (9:00 ص - 6:00 م توقيت القاهرة)" : "Hours: Sunday – Thursday (9:00 AM – 6:00 PM EET)"}
                                </span>
                            </div>
                        </div>

                    </div>

                    {/* Contact Form (7 cols) */}
                    <div className="lg:col-span-7 p-8 sm:p-12 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-850 shadow-lg ltr:text-left rtl:text-right">
                        <h2 className="text-2xl sm:text-3xl font-serif font-bold mb-2 text-gray-950 dark:text-white">
                            {isArabic ? "إرسال طلب استفسار أو تسعير" : "Send a Direct Inquiry"}
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
                            {isArabic
                                ? "املأ البيانات أدناه وسيتواصل معك مدير التصدير المسؤول مع إرفاق الكتالوج وقائمة الأسعار."
                                : "Fill in your specifications below and our commercial director will connect with customized wholesale terms."}
                        </p>

                        {submitted ? (
                            <div className="p-8 rounded-2xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 text-center space-y-4">
                                <span className="text-4xl">✅</span>
                                <h3 className="text-xl font-bold text-green-800 dark:text-green-300 font-serif">
                                    {isArabic ? "تم استلام استفسارك بنجاح!" : "Inquiry Prepared Successfully!"}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {isArabic
                                        ? "تم فتح محادثة الواتساب المجهزة برسالتك. سيتولى فريقنا متابعتك خلال دقائق."
                                        : "Your WhatsApp message has been launched. We look forward to fulfilling your pottery requirements."}
                                </p>
                                <button
                                    onClick={() => setSubmitted(false)}
                                    className="px-6 py-2 rounded-full border border-gray-300 dark:border-gray-700 text-xs font-bold"
                                >
                                    {isArabic ? "إرسال رسالة أخرى" : "Send Another Inquiry"}
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
                                            {isArabic ? "الاسم الكامل *" : "Full Name *"}
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder={isArabic ? "مثال: أحمد مصطفى" : "e.g. John Doe"}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-850 text-gray-900 dark:text-white text-sm focus:border-primary focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
                                            {isArabic ? "اسم الشركة / المؤسسة *" : "Company Name *"}
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.company}
                                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                            placeholder={isArabic ? "مثال: سيراميك الخليج" : "e.g. Acme Imports Ltd"}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-850 text-gray-900 dark:text-white text-sm focus:border-primary focus:outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
                                            {isArabic ? "البريد الإلكتروني *" : "Business Email *"}
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="name@company.com"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-850 text-gray-900 dark:text-white text-sm focus:border-primary focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
                                            {isArabic ? "دولة الوصول / الشحن *" : "Destination Country *"}
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.country}
                                            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                            placeholder={isArabic ? "مثال: المملكة العربية السعودية، فرنسا" : "e.g. United Kingdom, UAE"}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-850 text-gray-900 dark:text-white text-sm focus:border-primary focus:outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
                                        {isArabic ? "تفاصيل الطلب أو الموديلات المطلوبة *" : "Inquiry Details & Target Volumes *"}
                                    </label>
                                    <textarea
                                        rows={4}
                                        required
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        placeholder={isArabic ? "اذكر الموديلات المطلوبة، الكميات التقريبية، وأي تشطيبات خاصة..." : "Mention desired vase models, estimated piece count, custom finishes..."}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-850 text-gray-900 dark:text-white text-sm focus:border-primary focus:outline-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-4 px-6 bg-primary hover:bg-primary-dark text-secondary font-bold text-sm uppercase tracking-wider rounded-xl transition-all shadow-lg hover:shadow-primary/20"
                                >
                                    {isArabic ? "إرسال الاستفسار عبر واتساب" : "Send Inquiry via WhatsApp"}
                                </button>
                            </form>
                        )}
                    </div>

                </div>

            </div>
        </main>
    );
}
