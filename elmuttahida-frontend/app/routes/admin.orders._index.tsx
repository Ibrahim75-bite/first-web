import { useState, useContext } from "react";
import { Link } from "react-router";
import { LanguageContext } from "../context/LanguageContext";

interface InquiryItem {
  name: string;
  sku: string;
  qty: number;
  price: number;
  color: string;
  colorHex: string;
  size: string;
  image: string;
}

interface OrderNote {
  id: string;
  author: string;
  role: string;
  time: string;
  text: string;
  isImportant?: boolean;
}

interface Reminder {
  id: string;
  title: string;
  due: string;
  completed: boolean;
  status: "pending" | "completed";
}

interface Inquiry {
  id: string;
  company: string;
  partnerType: string;
  location: string;
  customer: string;
  email: string;
  phone: string;
  whatsapp: string;
  date: string;
  status: "in_progress" | "pending" | "responded" | "completed";
  items: InquiryItem[];
  notes: OrderNote[];
  reminders: Reminder[];
}

export default function AdminOrders() {
  const { lang, dir } = useContext(LanguageContext);
  const isAr = lang === "ar";

  const t = {
    breadcrumbRoot: isAr ? "الاستفسارات" : "Inquiries",
    openWhatsApp: isAr ? "فتح محادثة واتساب" : "Open WhatsApp Chat",
    
    // Statuses
    inProgress: isAr ? "قيد المعالجة" : "In Progress",
    pending: isAr ? "قيد الانتظار" : "Pending",
    responded: isAr ? "تم الرد" : "Responded",
    completed: isAr ? "مكتمل" : "Completed",

    // Customer Card
    contactPerson: isAr ? "الشخص المسؤول" : "Contact Person",
    emailAddress: isAr ? "البريد الإلكتروني" : "Email Address",
    phoneNumber: isAr ? "رقم الهاتف" : "Phone Number",

    // Requested Products
    requestedProducts: isAr ? "المنتجات المطلوبة" : "Requested Products",
    totalItems: isAr ? "إجمالي القطع" : "Total Items",
    colImage: isAr ? "الصورة" : "Image",
    colDetails: isAr ? "تفاصيل المنتج" : "Product Details",
    colColor: isAr ? "اللون / اللمسة" : "Color",
    colSize: isAr ? "المقاس" : "Size",
    colQty: isAr ? "الكمية" : "Qty",

    // Notes
    orderNotes: isAr ? "ملاحظات الفريق" : "Order Notes",
    addNotePlaceholder: isAr ? "أضف ملاحظة خاصة حول هذا الاستفسار..." : "Add a private note about this order...",
    send: isAr ? "إرسال" : "Send",

    // Reminders
    reminders: isAr ? "التذكيرات والمهام" : "Reminders",
    viewAll: isAr ? "عرض الكل" : "View All",
    due: isAr ? "الموعد" : "Due",
    setNewReminder: isAr ? "إضافة تذكير جديد" : "Set New Reminder",
    reminderPlaceholder: isAr ? "عنوان التذكير..." : "Reminder title...",
    add: isAr ? "إضافة" : "Add",

    // Selectors
    inquirySelector: isAr ? "قائمة الاستفسارات النشطة" : "Inquiry Stream",
    filterAll: isAr ? "الكل" : "All",
    filterPending: isAr ? "معلق" : "Pending",
    filterResponded: isAr ? "تم الرد" : "Responded",
    markStatus: isAr ? "تغيير حالة الاستفسار:" : "Change Status:",
  };

  const initialInquiries: Inquiry[] = [
    {
      id: "INV-2024-001",
      company: "Acme Decorators Ltd.",
      partnerType: isAr ? "شريك توريد وتصميم داخلي" : "Design & Retail Partner",
      location: "Lyon, France",
      customer: "Jane Doe",
      email: "jane@acmedecor.com",
      phone: "+33 4 72 00 00 00",
      whatsapp: "33472000000",
      date: "2026-09-18",
      status: "in_progress",
      items: [
        {
          name: isAr ? "مزهرية سيراميك في-09" : "Ceramic Vase V-09",
          sku: "CVS-BL-09",
          qty: 50,
          price: 49.00,
          color: isAr ? "أزرق ملكي (كوبالت)" : "Cobalt Blue",
          colorHex: "#1d4ed8",
          size: isAr ? "كبير (45 سم)" : "Large (45cm)",
          image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=200"
        },
        {
          name: isAr ? "وعاء زجاجي بلمسة نيلية جي-22" : "Glass Vase G-22",
          sku: "GVS-CL-22",
          qty: 120,
          price: 32.00,
          color: isAr ? "شفاف نقي" : "Clear",
          colorHex: "#cbd5e1",
          size: isAr ? "وسط (30 سم)" : "Medium (30cm)",
          image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=200"
        }
      ],
      notes: [
        {
          id: "n-1",
          author: "Sarah Miller",
          role: "Export Manager",
          time: isAr ? "أمس" : "Yesterday",
          text: isAr ? "تم الاتصال بالعميل لمناقشة تفضيلات الشحن الجوي عبر DHL. جاري تحديث عرض السعر والتأمين." : "Called customer regarding shipping preferences. They requested expedited shipping via DHL. Updated quote pending.",
          isImportant: true
        },
        {
          id: "n-2",
          author: "John Doe",
          role: "Inventory Lead",
          time: isAr ? "منذ ساعتين" : "2h ago",
          text: isAr ? "تم تأكيد توفر مخزون المزهريات الزرقاء في المستودع الرئيسي B (60 قطعة جاهزة للتعبئة)." : "Verified stock availability for the Cobalt Blue vases. We have 60 units in warehouse B."
        }
      ],
      reminders: [
        {
          id: "r-1",
          title: isAr ? "متابعة عرض أسعار الشحن والتخليص" : "Follow up on shipping quote",
          due: isAr ? "24 أكتوبر، 2:00 م" : "Oct 24, 2:00 PM",
          completed: false,
          status: "pending"
        },
        {
          id: "r-2",
          title: isAr ? "فحص سلامة طرود المستودع" : "Check warehouse inventory packaging",
          due: isAr ? "22 أكتوبر" : "Oct 22",
          completed: true,
          status: "completed"
        }
      ]
    },
    {
      id: "INV-2024-002",
      company: "Al-Fahad Hospitality Group",
      partnerType: isAr ? "مشاريع فنادق ومنتجعات" : "Hotel & Resort Procurement",
      location: "Riyadh, Saudi Arabia",
      customer: "Sarah Al-Fahad",
      email: "sarah.fahad@alfahad.sa",
      phone: "+966 50 123 4567",
      whatsapp: "966501234567",
      date: "2026-09-17",
      status: "responded",
      items: [
        {
          name: isAr ? "طقم أمفورا كلاسيك مذهب" : "Classic Porcelain Amphora",
          sku: "U0002-PN05",
          qty: 65,
          price: 65.00,
          color: isAr ? "عاجي وذهبي" : "Ivory & Gold",
          colorHex: "#eab308",
          size: isAr ? "كبير (55 سم)" : "Large (55cm)",
          image: "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=200"
        }
      ],
      notes: [
        {
          id: "n-3",
          author: "Ibrahim Mamdouh",
          role: "B2B Sales",
          time: isAr ? "منذ 4 ساعات" : "4h ago",
          text: isAr ? "تم إرسال الكتالوج المطبوع وشهادات فحص الجودة ISO عبر البريد الإلكتروني." : "Sent formal quotation and ISO 9001 quality certificates via email."
        }
      ],
      reminders: [
        {
          id: "r-3",
          title: isAr ? "تأكيد دفعة الإيداع والتحويل البنكي" : "Confirm wire transfer deposit",
          due: isAr ? "26 أكتوبر، 11:00 ص" : "Oct 26, 11:00 AM",
          completed: false,
          status: "pending"
        }
      ]
    },
    {
      id: "INV-2024-003",
      company: "Nile Grand Heritage Showroom",
      partnerType: isAr ? "معرض وتوزيع فاخر" : "Luxury Furniture Showroom",
      location: "Cairo, Egypt",
      customer: "Khaled Youssef",
      email: "k.youssef@nilegrand.eg",
      phone: "+20 122 345 6789",
      whatsapp: "201223456789",
      date: "2026-09-15",
      status: "completed",
      items: [
        {
          name: isAr ? "طقم دونات سيراميك منقط فاخر" : "Speckled Gold Donut Vase Set",
          sku: "U0002-PN05-SET",
          qty: 80,
          price: 120.00,
          color: isAr ? "طمي طبيعي منقط" : "Speckled Matte",
          colorHex: "#a8a29e",
          size: isAr ? "طقم 3 قطع" : "Set of 3",
          image: "https://images.unsplash.com/photo-1590736969955-71cc94801759?w=200"
        }
      ],
      notes: [
        {
          id: "n-4",
          author: "Tarek Badr",
          role: "Operations",
          time: isAr ? "منذ 3 أيام" : "3 days ago",
          text: isAr ? "تم الانتهاء من التغليف على منصات خشبية معالجة حرارياً وتم تسليم الشحنة لشركة النقل." : "Completed ISPM-15 wooden pallet crating and released to carrier."
        }
      ],
      reminders: []
    }
  ];

  const [inquiries, setInquiries] = useState<Inquiry[]>(initialInquiries);
  const [selectedId, setSelectedId] = useState<string>("INV-2024-001");
  const [newNote, setNewNote] = useState("");
  const [newReminderTitle, setNewReminderTitle] = useState("");
  const [newReminderDate, setNewReminderDate] = useState("");
  const [newReminderTime, setNewReminderTime] = useState("");

  const activeInquiry = inquiries.find(i => i.id === selectedId) || inquiries[0];

  const totalItemsCount = activeInquiry.items.reduce((acc, item) => acc + item.qty, 0);

  // Add order note
  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    const noteObj: OrderNote = {
      id: `note-${Date.now()}`,
      author: isAr ? "مدير النظام" : "Admin User",
      role: "Staff",
      time: isAr ? "الآن" : "Just now",
      text: newNote.trim()
    };

    setInquiries(prev => prev.map(inq => {
      if (inq.id === activeInquiry.id) {
        return { ...inq, notes: [noteObj, ...inq.notes] };
      }
      return inq;
    }));

    setNewNote("");
  };

  // Add reminder
  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReminderTitle.trim()) return;

    const reminderObj: Reminder = {
      id: `rem-${Date.now()}`,
      title: newReminderTitle.trim(),
      due: newReminderDate ? `${newReminderDate} ${newReminderTime || ''}` : (isAr ? "قريباً" : "Upcoming"),
      completed: false,
      status: "pending"
    };

    setInquiries(prev => prev.map(inq => {
      if (inq.id === activeInquiry.id) {
        return { ...inq, reminders: [...inq.reminders, reminderObj] };
      }
      return inq;
    }));

    setNewReminderTitle("");
    setNewReminderDate("");
    setNewReminderTime("");
  };

  // Toggle reminder status
  const handleToggleReminder = (remId: string) => {
    setInquiries(prev => prev.map(inq => {
      if (inq.id === activeInquiry.id) {
        return {
          ...inq,
          reminders: inq.reminders.map(r => r.id === remId ? { ...r, completed: !r.completed } : r)
        };
      }
      return inq;
    }));
  };

  // Update inquiry status
  const handleUpdateStatus = (newStatus: Inquiry["status"]) => {
    setInquiries(prev => prev.map(inq => inq.id === activeInquiry.id ? { ...inq, status: newStatus } : inq));
  };

  const getStatusBadge = (status: Inquiry["status"]) => {
    switch (status) {
      case "in_progress":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200 border border-amber-200 dark:border-amber-800">
            <span className="size-2 rounded-full bg-amber-500 animate-pulse"></span>
            {t.inProgress}
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200 border border-blue-200 dark:border-blue-800">
            <span className="size-2 rounded-full bg-[#1152d4]"></span>
            {t.pending}
          </span>
        );
      case "responded":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200 border border-purple-200 dark:border-purple-800">
            <span className="size-2 rounded-full bg-purple-500"></span>
            {t.responded}
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800">
            <span className="size-2 rounded-full bg-emerald-500"></span>
            {t.completed}
          </span>
        );
    }
  };

  return (
    <div dir={dir} className="max-w-[1440px] mx-auto space-y-6">
      
      {/* Inquiry Selector Pills / Tabs */}
      <div className="flex items-center justify-between gap-4 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 ltr:mr-2 rtl:ml-2">
            {t.inquirySelector}:
          </span>
          {inquiries.map((inq) => (
            <button
              key={inq.id}
              onClick={() => setSelectedId(inq.id)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                inq.id === activeInquiry.id
                  ? 'bg-[#1152d4] text-white shadow-xs'
                  : 'bg-white dark:bg-[#1a2234] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-[#1152d4]'
              }`}
            >
              <span>{inq.id}</span>
              <span className="opacity-75 font-normal">({inq.company.split(' ')[0]})</span>
            </button>
          ))}
        </div>

        {/* Change Status Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 hidden sm:inline">
            {t.markStatus}
          </span>
          <select
            value={activeInquiry.status}
            onChange={(e) => handleUpdateStatus(e.target.value as any)}
            className="text-xs font-bold bg-white dark:bg-[#1a2234] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#1152d4] cursor-pointer"
          >
            <option value="in_progress">{t.inProgress}</option>
            <option value="pending">{t.pending}</option>
            <option value="responded">{t.responded}</option>
            <option value="completed">{t.completed}</option>
          </select>
        </div>
      </div>

      {/* Stitch Inquiry Detail View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
            <Link to="/admin" className="hover:text-[#1152d4] transition-colors">{t.breadcrumbRoot}</Link>
            <span className="text-slate-300 dark:text-slate-600">/</span>
            <span className="text-slate-900 dark:text-white font-bold">{`Inquiry #${activeInquiry.id}`}</span>
          </nav>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {`Inquiry #${activeInquiry.id}`}
            </h1>
            {getStatusBadge(activeInquiry.status)}
          </div>
        </div>

        {/* Action Button: WhatsApp Direct Chat */}
        <div className="flex items-center gap-3">
          <a
            href={`https://wa.me/${activeInquiry.whatsapp}?text=${encodeURIComponent(`Hello ${activeInquiry.customer}, regarding your wholesale inquiry #${activeInquiry.id} with El Muttahida:`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#25D366] hover:bg-[#1ebd59] text-white font-bold text-xs shadow-sm transition-all"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
            <span>{t.openWhatsApp}</span>
          </a>
        </div>
      </div>

      {/* Main Grid: 8 Columns Left (Details) + 4 Columns Right (Notes/Reminders) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Customer Profile Card */}
          <div className="bg-white dark:bg-[#1a2234] rounded-xl shadow-xs border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="size-14 rounded-full bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-lg font-black text-[#1152d4] dark:text-blue-300 border border-blue-100 dark:border-blue-900/50 shrink-0">
                  {activeInquiry.company.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {activeInquiry.company}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                    {activeInquiry.partnerType}
                  </p>
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700/80 font-medium">
                <svg className="w-3.5 h-3.5 text-[#1152d4]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <span>{activeInquiry.location}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-6 bg-slate-50/50 dark:bg-slate-900/20">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                  {t.contactPerson}
                </p>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  {activeInquiry.customer}
                </p>
              </div>

              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                  {t.emailAddress}
                </p>
                <a href={`mailto:${activeInquiry.email}`} className="text-xs font-medium text-[#1152d4] hover:underline dark:text-blue-400 truncate block">
                  {activeInquiry.email}
                </a>
              </div>

              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                  {t.phoneNumber}
                </p>
                <p className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300">
                  {activeInquiry.phone}
                </p>
              </div>
            </div>
          </div>

          {/* Requested Products Table Card */}
          <div className="bg-white dark:bg-[#1a2234] rounded-xl shadow-xs border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col flex-1">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/40 dark:bg-slate-900/40">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {t.requestedProducts}
              </h3>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
                {`${t.totalItems}: ${totalItemsCount}`}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold">
                  <tr>
                    <th className={`px-6 py-3.5 w-16 ${isAr ? 'text-right' : 'text-left'}`}>{t.colImage}</th>
                    <th className={`px-6 py-3.5 ${isAr ? 'text-right' : 'text-left'}`}>{t.colDetails}</th>
                    <th className={`px-6 py-3.5 ${isAr ? 'text-right' : 'text-left'}`}>{t.colColor}</th>
                    <th className={`px-6 py-3.5 ${isAr ? 'text-right' : 'text-left'}`}>{t.colSize}</th>
                    <th className={`px-6 py-3.5 ${isAr ? 'text-left' : 'text-right'}`}>{t.colQty}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {activeInquiry.items.map((item, index) => (
                    <tr key={index} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="size-12 rounded-lg object-cover bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900 dark:text-white">
                          {item.name}
                        </p>
                        <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                          SKU: {item.sku}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span
                            className="size-3 rounded-full border border-slate-200 dark:border-slate-600 shadow-xs"
                            style={{ backgroundColor: item.colorHex }}
                          ></span>
                          <span className="text-slate-700 dark:text-slate-300 font-medium">
                            {item.color}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-medium">
                        {item.size}
                      </td>
                      <td className={`px-6 py-4 font-black text-slate-900 dark:text-white text-sm font-mono ${
                        isAr ? 'text-left' : 'text-right'
                      }`}>
                        {item.qty}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right Column (4 cols): Order Notes & Reminders */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Order Notes Box */}
          <div className="bg-white dark:bg-[#1a2234] rounded-xl shadow-xs border border-slate-200 dark:border-slate-800 flex flex-col min-h-[380px]">
            <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 rounded-t-xl flex items-center gap-2">
              <svg className="w-4 h-4 text-[#1152d4]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                {t.orderNotes}
              </h3>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-3 overflow-y-auto max-h-[260px] pr-1">
                {activeInquiry.notes.map((note) => (
                  <div
                    key={note.id}
                    className={`p-3 rounded-lg border text-xs leading-relaxed ${
                      note.isImportant
                        ? 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50 text-amber-900 dark:text-amber-200'
                        : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold">{note.author}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{note.time}</span>
                    </div>
                    <p className="mt-0.5">{note.text}</p>
                  </div>
                ))}
              </div>

              {/* Add Note Input Form */}
              <form onSubmit={handleAddNote} className="pt-2 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder={t.addNotePlaceholder}
                  className="flex-1 text-xs py-2 px-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#1152d4]"
                />
                <button
                  type="submit"
                  disabled={!newNote.trim()}
                  className="px-3 py-2 bg-[#1152d4] hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                </button>
              </form>
            </div>
          </div>

          {/* Reminders Card */}
          <div className="bg-white dark:bg-[#1a2234] rounded-xl shadow-xs border border-slate-200 dark:border-slate-800 flex flex-col">
            <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/60 dark:bg-slate-800/40 rounded-t-xl">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                  {t.reminders}
                </h3>
              </div>
            </div>

            <div className="p-4 space-y-3">
              {activeInquiry.reminders.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-3">
                  {isAr ? "لا توجد تذكيرات محددة لهذا الاستفسار." : "No reminders set for this inquiry."}
                </p>
              ) : (
                activeInquiry.reminders.map((rem) => (
                  <div
                    key={rem.id}
                    className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                      rem.completed
                        ? 'bg-slate-50/60 dark:bg-slate-900/30 border-slate-100 dark:border-slate-800 opacity-60'
                        : 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/40'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={rem.completed}
                      onChange={() => handleToggleReminder(rem.id)}
                      className="mt-0.5 size-4 rounded border-slate-300 text-[#1152d4] focus:ring-[#1152d4] cursor-pointer"
                    />
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-semibold ${
                        rem.completed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'
                      }`}>
                        {rem.title}
                      </p>
                      <p className="text-[10px] text-amber-600 dark:text-amber-400 font-medium mt-0.5 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        <span>{`${t.due}: ${rem.due}`}</span>
                      </p>
                    </div>
                  </div>
                ))
              )}

              {/* Set New Reminder Form */}
              <form onSubmit={handleAddReminder} className="pt-3 border-t border-dashed border-slate-200 dark:border-slate-800 space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {t.setNewReminder}
                </p>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={newReminderDate}
                    onChange={(e) => setNewReminderDate(e.target.value)}
                    className="flex-1 text-[11px] py-1.5 px-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200"
                  />
                  <input
                    type="time"
                    value={newReminderTime}
                    onChange={(e) => setNewReminderTime(e.target.value)}
                    className="w-20 text-[11px] py-1.5 px-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200"
                  />
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newReminderTitle}
                    onChange={(e) => setNewReminderTitle(e.target.value)}
                    placeholder={t.reminderPlaceholder}
                    className="flex-1 text-xs py-1.5 px-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400"
                  />
                  <button
                    type="submit"
                    disabled={!newReminderTitle.trim()}
                    className="px-3 py-1.5 bg-[#1152d4] hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold"
                  >
                    +
                  </button>
                </div>
              </form>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
