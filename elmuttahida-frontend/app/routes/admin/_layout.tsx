import { Outlet, Link, useLocation } from "react-router";
import { useState, useEffect, useContext } from "react";
import { LanguageContext } from "../../context/LanguageContext";

export default function AdminLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { lang, setLang, dir } = useContext(LanguageContext);
  const isAr = lang === "ar";

  // Notifications state for new orders / inquiries
  const [newOrdersCount, setNewOrdersCount] = useState(() => {
    if (typeof window !== "undefined") {
      const savedCount = localStorage.getItem("new_orders_count");
      return savedCount !== null ? parseInt(savedCount, 10) : 3;
    }
    return 3;
  });

  // Clear new orders notification when viewing the orders list
  useEffect(() => {
    if (location.pathname === "/admin/orders") {
      setNewOrdersCount(0);
      if (typeof window !== "undefined") {
        localStorage.setItem("new_orders_count", "0");
      }
    }
  }, [location.pathname]);

  const navigation = [
    { 
      name: isAr ? 'لوحة التحكم' : 'Dashboard', 
      href: '/admin', 
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
      badge: null
    },
    { 
      name: isAr ? 'المنتجات' : 'Products', 
      href: '/admin/products', 
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      badge: null
    },
    { 
      name: isAr ? 'الاستفسارات والطلبات' : 'Inquiries', 
      href: '/admin/orders', 
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      badge: 'new'
    },
    { 
      name: isAr ? 'الفئات' : 'Categories', 
      href: '/admin/categories', 
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      ),
      badge: null
    },
    { 
      name: isAr ? 'الإعدادات' : 'Settings', 
      href: '/admin/settings', 
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      badge: null
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fc] dark:bg-[#101622] text-slate-900 dark:text-white font-sans antialiased" dir={dir}>
      
      {/* Mobile Sidebar Backdrop & Drawer */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`} role="dialog" aria-modal="true">
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setSidebarOpen(false)}></div>
        
        <div className={`fixed inset-y-0 z-50 w-64 bg-white dark:bg-[#1a2234] p-5 shadow-2xl transition-transform border-slate-200 dark:border-slate-800 ${
          dir === 'rtl' ? 'right-0 border-l' : 'left-0 border-r'
        }`}>
          {/* Logo & Close Button */}
          <div className="flex items-center justify-between pb-6 mb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 overflow-hidden rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900/50 p-1 flex items-center justify-center">
                <div className="h-7 w-7 rounded-full bg-[#1152d4] flex items-center justify-center text-white font-black text-xs">
                  EM
                </div>
              </div>
              <div className="flex flex-col">
                <h1 className="text-base font-bold leading-tight text-slate-900 dark:text-white">El Muttahida</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Admin Portal</p>
              </div>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)} 
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Close Sidebar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>

          {/* Language Switcher */}
          <button 
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            className="w-full flex items-center justify-between px-3.5 py-2.5 mb-6 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 hover:border-[#1152d4] rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all"
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#1152d4]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg>
              {lang === 'ar' ? 'اللغة: العربية' : 'Language: English'}
            </span>
            <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-[#1152d4] dark:text-blue-300 font-bold text-[11px]">
              {lang === 'ar' ? 'EN' : 'عربي'}
            </span>
          </button>

          {/* Navigation Items */}
          <nav className="space-y-1.5">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href || (item.href !== '/admin' && location.pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 text-sm font-medium rounded-xl transition-colors ${
                    isActive 
                      ? 'bg-[#1152d4]/10 text-[#1152d4] dark:bg-[#1152d4]/20 dark:text-blue-300 font-semibold' 
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-[#1152d4] dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}>
                      {item.icon}
                    </span>
                    <span>{item.name}</span>
                  </div>
                  {item.badge === 'new' && newOrdersCount > 0 && (
                    <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold rounded-full bg-red-500 text-white animate-pulse">
                      {newOrdersCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className={`hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col bg-white dark:bg-[#1a2234] z-30 transition-all shadow-sm ${
        dir === 'rtl' ? 'right-0 border-l border-slate-200 dark:border-slate-800' : 'left-0 border-r border-slate-200 dark:border-slate-800'
      }`}>
        <div className="flex flex-col flex-1 p-5 overflow-y-auto">
          
          {/* Logo & Brand Header */}
          <div className="flex items-center gap-3 px-2 pb-6 border-b border-slate-100 dark:border-slate-800 mb-6">
            <div className="h-10 w-10 overflow-hidden rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900/50 p-1 flex items-center justify-center shrink-0 shadow-sm">
              <div className="h-8 w-8 rounded-full bg-[#1152d4] flex items-center justify-center text-white font-black text-xs tracking-wider">
                EM
              </div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-base font-bold leading-tight text-slate-900 dark:text-white">El Muttahida</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Admin Portal</p>
            </div>
          </div>

          {/* Navigation links */}
          <nav className="flex-1 space-y-1">
            <div className="px-3 text-[11px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase mb-2">
              {isAr ? 'القائمة الرئيسية' : 'Main Menu'}
            </div>
            {navigation.map((item) => {
              const isActive = location.pathname === item.href || (item.href !== '/admin' && location.pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-[#1152d4]/10 text-[#1152d4] dark:bg-[#1152d4]/20 dark:text-blue-300 font-semibold shadow-xs' 
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-[#1152d4] dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}>
                      {item.icon}
                    </span>
                    <span>{item.name}</span>
                  </div>
                  {item.badge === 'new' && newOrdersCount > 0 && (
                    <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold rounded-full bg-red-500 text-white animate-pulse">
                      {newOrdersCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Area: Language Switcher & Admin User Profile */}
          <div className="pt-4 mt-auto border-t border-slate-100 dark:border-slate-800 space-y-3">
            
            {/* Language Switcher */}
            <button 
              onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
              className="w-full flex items-center justify-between px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 hover:border-[#1152d4] rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all"
            >
              <span className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5 text-[#1152d4]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg>
                {lang === 'ar' ? 'العربية' : 'English'}
              </span>
              <span className="px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-[#1152d4] dark:text-blue-300 font-bold text-[10px]">
                {lang === 'ar' ? 'EN' : 'عربي'}
              </span>
            </button>

            {/* Admin User Card */}
            <div className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300 shrink-0">
                AD
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                  {isAr ? 'مدير النظام' : 'Admin User'}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {isAr ? 'مشرف عام' : 'View Profile'}
                </p>
              </div>
            </div>

          </div>

        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`flex flex-col flex-1 min-h-screen transition-all ${
        dir === 'rtl' ? 'lg:pr-64' : 'lg:pl-64'
      }`}>
        
        {/* Top Header Bar */}
        <header className="sticky top-0 z-20 flex items-center justify-between h-16 px-4 md:px-8 bg-white/90 dark:bg-[#1a2234]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
          
          <div className="flex items-center gap-4">
            {/* Mobile Hamburger Menu Toggle */}
            <button
              type="button"
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </button>

            {/* Search Inquiries / Products Bar */}
            <div className="relative hidden sm:block w-64 md:w-80">
              <div className={`absolute inset-y-0 flex items-center pointer-events-none text-slate-400 ${
                dir === 'rtl' ? 'right-3' : 'left-3'
              }`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <input
                type="text"
                placeholder={isAr ? "بحث في الاستفسارات والمنتجات..." : "Search inquiries or products..."}
                className={`w-full py-1.5 text-xs bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-[#1152d4] focus:ring-1 focus:ring-[#1152d4] transition-all ${
                  dir === 'rtl' ? 'pr-9 pl-3' : 'pl-9 pr-3'
                }`}
              />
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2 md:gap-3">
            
            {/* Quick Language Toggle */}
            <button
              onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-colors"
              title={isAr ? "Switch to English" : "التبديل إلى العربية"}
            >
              {lang === 'ar' ? 'English' : 'عربي'}
            </button>

            {/* Notifications Button */}
            <Link
              to="/admin/orders"
              className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Notifications"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              {newOrdersCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              )}
            </Link>

            {/* Settings Link */}
            <Link
              to="/admin/settings"
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Settings"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </Link>

            {/* Visit Storefront Link */}
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 hover:bg-blue-100 text-[#1152d4] dark:bg-blue-950/60 dark:hover:bg-blue-900/60 dark:text-blue-300 border border-blue-200 dark:border-blue-900 transition-colors"
            >
              <span>{isAr ? 'عرض المتجر' : 'Storefront'}</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </Link>

          </div>

        </header>

        {/* Dynamic Nested Page Content */}
        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>

      </div>

    </div>
  );
}
