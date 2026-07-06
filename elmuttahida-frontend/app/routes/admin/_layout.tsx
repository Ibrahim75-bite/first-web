import { Outlet, Link, useLocation } from "react-router";
import { useState, useEffect, useContext } from "react";
import { LanguageContext } from "../../context/LanguageContext";

export default function AdminLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { lang, setLang, dir } = useContext(LanguageContext);

  // Notifications state for new orders
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
      localStorage.setItem("new_orders_count", "0");
    }
  }, [location.pathname]);

  const navigation = [
    { 
      name: lang === 'ar' ? 'لوحة التحكم' : 'Dashboard', 
      href: '/admin', 
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
      badge: null
    },
    { 
      name: lang === 'ar' ? 'المنتجات' : 'Products', 
      href: '/admin/products', 
      icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
      badge: null
    },
    { 
      name: lang === 'ar' ? 'الفئات' : 'Categories', 
      href: '/admin/categories', 
      icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z',
      badge: null
    },
    { 
      name: lang === 'ar' ? 'الطلبات' : 'Orders', 
      href: '/admin/orders', 
      icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z',
      badge: 'new'
    },
    { 
      name: lang === 'ar' ? 'الإعدادات' : 'Settings', 
      href: '/admin/settings', 
      icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
      badge: null
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 font-sans" dir={dir}>
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? '' : 'hidden'}`} role="dialog" aria-modal="true">
        <div className="fixed inset-0 bg-neutral-900/80 backdrop-blur-sm" aria-hidden="true" onClick={() => setSidebarOpen(false)}></div>
        <div className={`fixed inset-y-0 z-40 w-64 bg-neutral-950 p-6 overflow-y-auto border-neutral-800 transition-transform ${
          dir === 'rtl' ? 'right-0 border-l' : 'left-0 border-r'
        }`}>
          <div className="flex items-center justify-between mb-8">
            <span className="text-2xl font-bold tracking-tighter text-white">EL MUTTAHIDA<span className="text-amber-500">.</span></span>
            <button onClick={() => setSidebarOpen(false)} className="text-neutral-400 hover:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>

          {/* Language Switcher for Mobile */}
          <div className="mb-6">
            <button 
              onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
              className="w-full flex items-center justify-between px-4 py-2.5 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-xl text-xs font-semibold text-neutral-300 transition-all"
            >
              <span>{lang === 'ar' ? 'اللغة: العربية' : 'Language: English'}</span>
              <span className="text-amber-500 font-bold">{lang === 'ar' ? 'EN' : 'العربية'}</span>
            </button>
          </div>

          <nav className="space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    isActive 
                      ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' 
                      : 'text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200'
                  }`}
                >
                  <svg className={`h-5 w-5 ${dir === 'rtl' ? 'ml-3' : 'mr-3'} ${isActive ? 'text-amber-500' : 'text-neutral-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                  </svg>
                  <span className="flex-grow">{item.name}</span>
                  {item.badge === 'new' && newOrdersCount > 0 && (
                    <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-neutral-950 text-xs font-bold animate-pulse shrink-0">
                      {newOrdersCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className={`hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col bg-neutral-950 shadow-2xl ${
        dir === 'rtl' ? 'right-0 border-l border-neutral-800/60' : 'left-0 border-r border-neutral-800/60'
      }`}>
        <div className="flex flex-col flex-grow pt-8 pb-4 overflow-y-auto">
          <div className="flex items-center shrink-0 px-8 mb-10">
             <span className="text-3xl font-bold tracking-tighter text-white font-serif">EL MUTTAHIDA<span className="text-amber-500">.</span></span>
          </div>

          {/* Language Switcher for Desktop Sidebar */}
          <div className="px-6 mb-6">
            <button 
              onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
              className="w-full flex items-center justify-between px-4 py-2.5 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-xl text-xs font-semibold text-neutral-300 transition-all"
            >
              <span>{lang === 'ar' ? 'اللغة: العربية' : 'Language: English'}</span>
              <span className="text-amber-500 font-bold">{lang === 'ar' ? 'EN' : 'العربية'}</span>
            </button>
          </div>

          <nav className="flex-1 px-4 space-y-2">
            <div className="px-4 text-xs font-semibold tracking-wider text-neutral-500 uppercase mb-4">
              {lang === 'ar' ? 'مركز الإدارة' : 'Enterprise Hub'}
            </div>
            {navigation.map((item) => {
              const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-4 py-3.5 text-sm font-medium rounded-2xl transition-all duration-300 ${
                    isActive 
                      ? 'bg-gradient-to-r from-amber-500/10 to-transparent text-amber-400 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.05)]' 
                      : 'text-neutral-400 hover:bg-neutral-900/80 hover:text-neutral-200 border border-transparent'
                  }`}
                >
                  <svg className={`h-5 w-5 transition-colors ${dir === 'rtl' ? 'ml-4' : 'mr-4'} ${isActive ? 'text-amber-400' : 'text-neutral-600 group-hover:text-neutral-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                  </svg>
                  <span className="flex-grow">{item.name}</span>
                  {item.badge === 'new' && newOrdersCount > 0 && (
                    <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-neutral-950 text-xs font-bold animate-pulse shrink-0">
                      {newOrdersCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
          
          <div className="px-4 mt-8">
             <div className="p-4 bg-neutral-900/50 border border-neutral-800 rounded-2xl">
                <div className="flex items-center">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black font-bold text-sm shrink-0">
                        {lang === 'ar' ? 'مد' : 'AD'}
                    </div>
                    <div className={dir === 'rtl' ? 'mr-3' : 'ml-3'}>
                        <p className="text-sm font-medium text-white">{lang === 'ar' ? 'مدير النظام' : 'Admin User'}</p>
                        <p className="text-xs font-medium text-neutral-500">{lang === 'ar' ? 'مسؤول عام' : 'Super Administrator'}</p>
                    </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className={`flex flex-col flex-1 ${
        dir === 'rtl' ? 'lg:pr-72' : 'lg:pl-72'
      }`}>
        <div className="sticky top-0 z-10 flex shrink-0 h-20 bg-neutral-950/80 backdrop-blur-xl border-b border-neutral-800/60 lg:hidden">
          <button
            type="button"
            className={`px-4 text-neutral-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-500 lg:hidden ${
              dir === 'rtl' ? 'border-l border-neutral-800' : 'border-r border-neutral-800'
            }`}
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </button>
          <div className="flex justify-between flex-1 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-1 items-center">
               <span className="text-xl font-bold tracking-tighter text-white font-serif">EL MUTTAHIDA<span className="text-amber-500">.</span></span>
            </div>
          </div>
        </div>

        <main className="flex-1 pb-12">
          <div className="py-8 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
