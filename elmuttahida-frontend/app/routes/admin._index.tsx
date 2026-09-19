import { useState, useEffect, useContext } from "react";
import { Link } from "react-router";
import { LanguageContext } from "../context/LanguageContext";

export default function AdminDashboard() {
  const { lang, dir } = useContext(LanguageContext);
  const isAr = lang === "ar";

  const [dateRange, setDateRange] = useState("30");
  const [productCount, setProductCount] = useState<number | string>(124);

  useEffect(() => {
    // Attempt to load real product count if backend is online
    const apiUrl = typeof window !== "undefined" && (window as any).ENV?.VITE_API_URL 
      ? (window as any).ENV.VITE_API_URL 
      : "http://localhost:5000";

    fetch(`${apiUrl}/api/products`)
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.data) && data.data.length > 0) {
          setProductCount(data.data.length);
        }
      })
      .catch(() => {
        // Fallback to default catalog count
        setProductCount(124);
      });
  }, []);

  const t = {
    title: isAr ? "نظرة عامة على لوحة التحكم" : "Dashboard Overview",
    subtitle: isAr ? "مرحباً بعودتك، إليك ملخص نشاط واستفسارات اليوم." : "Welcome back, here's what's happening today.",
    last30Days: isAr ? "آخر 30 يوماً" : "Last 30 Days",
    last7Days: isAr ? "آخر 7 أيام" : "Last 7 Days",
    last90Days: isAr ? "آخر 3 أشهر" : "Last 90 Days",
    exportReport: isAr ? "تصدير التقرير" : "Export Report",
    
    // KPI Cards
    activeInquiries: isAr ? "إجمالي الاستفسارات النشطة" : "Total Active Inquiries",
    totalProducts: isAr ? "إجمالي المنتجات" : "Total Products",
    avgDemand: isAr ? "متوسط الطلب الشهري" : "Avg. Monthly Demand",
    vsLastMonth: isAr ? "مقارنة بالشهر السابق" : "vs last month",
    noChange: isAr ? "لا يوجد تغيير" : "No change",
    units: isAr ? "قطعة" : "Units",

    // Geographic Distribution
    geoTitle: isAr ? "التوزيع الجغرافي للاستفسارات" : "Geographic Distribution",
    geoSubtitle: isAr ? "الاستفسارات بحسب المنطقة الجغرافية (آخر 30 يوماً)" : "Inquiries by region (Last 30 Days)",
    viewReport: isAr ? "عرض التقرير المفصل" : "View Report",
    mea: isAr ? "الشرق الأوسط وأفريقيا" : "MEA",
    europe: isAr ? "أوروبا" : "Europe",
    asia: isAr ? "آسيا" : "Asia",
    other: isAr ? "باقي المناطق" : "Other",

    // Channels
    inquirySource: isAr ? "مصادر الاستفسارات" : "Inquiry Source",
    channelBreakdown: isAr ? "توزيع قنوات التواصل B2B" : "Channel breakdown",
    whatsapp: isAr ? "واتساب (مباشر)" : "WhatsApp",
    email: isAr ? "نموذج الموقع والبريد" : "Email",
    totalInquiries: isAr ? "إجمالي" : "TOTAL",

    // Most Requested Products
    topProductsTitle: isAr ? "المنتجات الأكثر طلباً واستفساراً" : "Most Requested Products",
    topProductsSubtitle: isAr ? "القطع الأعلى أداءً واهتماماً من المستوردين" : "Top performing inventory items",
    colProduct: isAr ? "تفاصيل المنتج" : "Product Details",
    colCategory: isAr ? "الفئة" : "Category",
    colStatus: isAr ? "حالة التوفر" : "Stock Status",
    colCount: isAr ? "عدد الاستفسارات" : "Inquiry Count",
    colActions: isAr ? "العمليات" : "Actions",
    inStock: isAr ? "متوفر بالمستودع" : "In Stock",
    viewDetails: isAr ? "عرض التفاصيل" : "View Details",
  };

  const topProducts = [
    {
      id: 1,
      name: isAr ? "طقم مزهريات سيراميك منقط بلمسة ذهبية" : "Speckled Gold Donut Vase Set",
      sku: "U0002-PN05-SET",
      category: isAr ? "سيراميك وفخار" : "Ceramics",
      inquiries: 184,
      image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=200",
      inStock: true
    },
    {
      id: 2,
      name: isAr ? "مزهرية أمفورا بورسلين تقليدية" : "Classic Porcelain Amphora Vase",
      sku: "U0002-PN05",
      category: isAr ? "بورسلين يدوي" : "Porcelain",
      inquiries: 154,
      image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=200",
      inStock: true
    },
    {
      id: 3,
      name: isAr ? "وعاء طمي النيل المنحوت يدوياً" : "Hand-Carved Nile Clay Vessel",
      sku: "U0003-NV12",
      category: isAr ? "فخار تراثي" : "Terracotta",
      inquiries: 98,
      image: "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=200",
      inStock: true
    },
    {
      id: 4,
      name: isAr ? "مزهرية مضلعة كوزميك زرقاء" : "Artisanal Cobalt Ribbed Vase",
      sku: "U0004-CB09",
      category: isAr ? "سيراميك مصقول" : "Glazed Clay",
      inquiries: 86,
      image: "https://images.unsplash.com/photo-1590736969955-71cc94801759?w=200",
      inStock: true
    }
  ];

  return (
    <div dir={dir} className="space-y-8">
      
      {/* Stitch Header Bar */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t.title}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Time Range Filter */}
          <div className="relative">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="appearance-none flex items-center gap-2 rounded-lg border border-slate-200 bg-white py-2 px-4 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 focus:outline-none focus:ring-1 focus:ring-[#1152d4] transition-all cursor-pointer ltr:pr-8 rtl:pl-8"
            >
              <option value="7">{t.last7Days}</option>
              <option value="30">{t.last30Days}</option>
              <option value="90">{t.last90Days}</option>
            </select>
            <div className={`absolute top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 ${
              isAr ? 'left-2.5' : 'right-2.5'
            }`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>

          {/* Export Report Action */}
          <button 
            onClick={() => alert(isAr ? "تم تجهيز تقرير النشاط للتحميل بنجاح!" : "Analytics report generated and ready for download!")}
            className="flex items-center justify-center gap-2 rounded-lg bg-[#1152d4] px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-blue-500/20 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-[#1152d4] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            <span>{t.exportReport}</span>
          </button>
        </div>
      </header>

      {/* Stitch 3 KPI Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Card 1: Active Inquiries */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-[#1a2234]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {t.activeInquiries}
              </p>
              <h3 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                1,248
              </h3>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#1152d4] dark:bg-blue-900/30 dark:text-blue-300 shadow-xs">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              12%
            </span>
            <span className="text-xs text-slate-400">
              {t.vsLastMonth}
            </span>
          </div>
        </div>

        {/* Card 2: Total Products */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-[#1a2234]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {t.totalProducts}
              </p>
              <h3 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {productCount}
              </h3>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#1152d4] dark:bg-blue-900/30 dark:text-blue-300 shadow-xs">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
              0%
            </span>
            <span className="text-xs text-slate-400">
              {t.noChange}
            </span>
          </div>
        </div>

        {/* Card 3: Avg. Monthly Demand */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-[#1a2234]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {t.avgDemand}
              </p>
              <h3 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                320 <span className="text-lg font-medium text-slate-400">{t.units}</span>
              </h3>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#1152d4] dark:bg-blue-900/30 dark:text-blue-300 shadow-xs">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              5.2%
            </span>
            <span className="text-xs text-slate-400">
              {t.vsLastMonth}
            </span>
          </div>
        </div>

      </div>

      {/* Middle Row: Geographic Distribution & Channel Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Card: Geographic Distribution (2/3 cols) */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-[#1a2234] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {t.geoTitle}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {t.geoSubtitle}
              </p>
            </div>
            <Link to="/admin/orders" className="text-xs font-bold text-[#1152d4] hover:underline dark:text-blue-400">
              {t.viewReport}
            </Link>
          </div>

          {/* Interactive World Map SVG View */}
          <div className="relative min-h-[220px] sm:min-h-[260px] w-full overflow-hidden rounded-xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80 flex items-center justify-center p-4">
            <svg className="w-full h-full text-slate-200 dark:text-slate-700/60 fill-current max-h-[240px]" viewBox="0 0 1000 500">
              {/* Stylized continent vectors */}
              <path d="M162,106c0,0-23,8-26,11s-9,15-9,15l-13,6l-8-1l-9,11c0,0-5,16-2,19s14,2,14,2l8,12l15,4l12-8l12,5l4,14l15,5l16-6l7-18l-3-15l-11-14L162,106z M276,141l-10-5l-14,6l-5,14l6,11l13,6l14-5l6-15L276,141z M450,120l-15,10l-6,18l8,14l16,5l15-8l5-16l-8-12L450,120z M620,130l-12,8l-4,15l7,12l14,4l13-9l3-15l-10-10L620,130z M780,110l-14,9l-5,16l9,13l16,4l14-10l4-16l-11-11L780,110z" opacity="0.6"></path>
              {/* Pulsing Hotspots */}
              <circle className="text-[#1152d4]/30 fill-current animate-ping" cx="530" cy="180" r="16"></circle>
              <circle className="text-[#1152d4] fill-current" cx="530" cy="180" r="6"></circle>
              
              <circle className="text-[#1152d4]/30 fill-current animate-ping" cx="480" cy="140" r="12"></circle>
              <circle className="text-[#1152d4] fill-current" cx="480" cy="140" r="5"></circle>

              <circle className="text-[#1152d4]/30 fill-current animate-ping" cx="650" cy="220" r="10"></circle>
              <circle className="text-[#1152d4] fill-current" cx="650" cy="220" r="5"></circle>

              <circle className="text-[#1152d4]/30 fill-current animate-ping" cx="220" cy="160" r="10"></circle>
              <circle className="text-[#1152d4] fill-current" cx="220" cy="160" r="5"></circle>
            </svg>

            {/* Hotspot Floating Tooltip */}
            <div className="absolute top-[28%] left-[53%] -translate-x-1/2 bg-slate-900 text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-lg dark:bg-white dark:text-slate-900 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1152d4]"></span>
              <span>MEA: 450 Inquiries</span>
            </div>
          </div>

          {/* Region Progress Bars */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {t.mea}
              </span>
              <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full rounded-full bg-[#1152d4]" style={{ width: "45%" }}></div>
              </div>
              <span className="text-sm font-extrabold text-slate-900 dark:text-white">45%</span>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {t.europe}
              </span>
              <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full rounded-full bg-[#1152d4]/80" style={{ width: "30%" }}></div>
              </div>
              <span className="text-sm font-extrabold text-slate-900 dark:text-white">30%</span>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {t.asia}
              </span>
              <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full rounded-full bg-[#1152d4]/50" style={{ width: "15%" }}></div>
              </div>
              <span className="text-sm font-extrabold text-slate-900 dark:text-white">15%</span>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {t.other}
              </span>
              <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full rounded-full bg-slate-300 dark:bg-slate-600" style={{ width: "10%" }}></div>
              </div>
              <span className="text-sm font-extrabold text-slate-900 dark:text-white">10%</span>
            </div>
          </div>

        </div>

        {/* Right Card: Inquiry Source Channel Breakdown (1/3 col) */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-[#1a2234] flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {t.inquirySource}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t.channelBreakdown}
            </p>
          </div>

          {/* Stylized Donut Chart Container */}
          <div className="my-6 flex items-center justify-center">
            <div className="relative flex items-center justify-center size-44">
              {/* Circular SVG Donut */}
              <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                {/* Background Ring */}
                <path
                  className="text-slate-100 dark:text-slate-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                {/* Email Segment (35%) */}
                <path
                  className="text-slate-300 dark:text-slate-600"
                  strokeDasharray="100, 100"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                {/* WhatsApp Segment (65%) */}
                <path
                  className="text-[#1152d4]"
                  strokeDasharray="65, 100"
                  strokeWidth="3.8"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>

              {/* Center Counter */}
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-black text-slate-900 dark:text-white leading-none">
                  1.2k
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                  {t.totalInquiries}
                </span>
              </div>
            </div>
          </div>

          {/* Legend Items */}
          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300">
                <span className="size-2.5 rounded-full bg-[#1152d4]"></span>
                <span>{t.whatsapp}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 dark:text-white">65%</span>
                <span className="text-slate-400 font-mono text-[11px]">(811)</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300">
                <span className="size-2.5 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                <span>{t.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 dark:text-white">35%</span>
                <span className="text-slate-400 font-mono text-[11px]">(437)</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Bottom Card: Most Requested Products Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-[#1a2234] overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {t.topProductsTitle}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t.topProductsSubtitle}
            </p>
          </div>
          <Link
            to="/admin/products"
            className="text-xs font-bold text-[#1152d4] hover:underline dark:text-blue-400"
          >
            {isAr ? "عرض جميع المنتجات ←" : "View All Products →"}
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50/80 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className={`py-3.5 px-6 ${isAr ? 'text-right' : 'text-left'}`}>{t.colProduct}</th>
                <th className={`py-3.5 px-6 ${isAr ? 'text-right' : 'text-left'}`}>{t.colCategory}</th>
                <th className={`py-3.5 px-6 ${isAr ? 'text-right' : 'text-left'}`}>{t.colStatus}</th>
                <th className={`py-3.5 px-6 ${isAr ? 'text-right' : 'text-left'}`}>{t.colCount}</th>
                <th className={`py-3.5 px-6 ${isAr ? 'text-left' : 'text-right'}`}>{t.colActions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {topProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="size-10 rounded-lg object-contain p-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0"
                      />
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white text-xs">
                          {p.name}
                        </p>
                        <p className="font-mono text-[11px] text-slate-400 mt-0.5">
                          {p.sku}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-medium text-slate-600 dark:text-slate-300">
                    {p.category}
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
                      <span className="size-1.5 rounded-full bg-emerald-500"></span>
                      {t.inStock}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-bold text-slate-900 dark:text-white font-mono text-sm">
                    {p.inquiries}
                  </td>
                  <td className={`py-4 px-6 ${isAr ? 'text-left' : 'text-right'}`}>
                    <Link
                      to="/admin/products"
                      className="inline-flex items-center justify-center p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title={t.viewDetails}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
