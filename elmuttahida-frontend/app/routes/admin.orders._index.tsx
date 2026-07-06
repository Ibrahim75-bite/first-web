import { useState, useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";

export default function AdminOrders() {
  const { lang, dir } = useContext(LanguageContext);
  const isAr = lang === "ar";

  const t = {
    title: isAr ? "إدارة الطلبات والاستفسارات" : "Orders & Inquiries",
    orderId: isAr ? "رقم الطلب" : "Order ID",
    customer: isAr ? "العميل" : "Customer",
    date: isAr ? "التاريخ" : "Date",
    status: isAr ? "الحالة" : "Status",
    total: isAr ? "الإجمالي" : "Total",
    actions: isAr ? "العمليات" : "Actions",
    view: isAr ? "عرض التفاصيل" : "View Details",
    pending: isAr ? "قيد الانتظار" : "Pending",
    completed: isAr ? "مكتمل" : "Completed",
    responded: isAr ? "تم الرد" : "Responded",
    // Modal Translations
    modalTitle: isAr ? "تفاصيل الطلب / الاستفسار" : "Inquiry / Order Details",
    customerInfo: isAr ? "بيانات العميل" : "Customer Info",
    email: isAr ? "البريد الإلكتروني" : "Email",
    phone: isAr ? "الهاتف" : "Phone",
    notes: isAr ? "ملاحظات العميل" : "Customer Notes",
    items: isAr ? "المنتجات المطلوبة" : "Requested Products",
    itemName: isAr ? "المنتج" : "Item",
    qty: isAr ? "الكمية" : "Qty",
    price: isAr ? "السعر" : "Price",
    totalPrice: isAr ? "الإجمالي" : "Total",
    whatsappChat: isAr ? "التواصل عبر الواتساب" : "Contact via WhatsApp",
    markResponded: isAr ? "تحديد كـ تم الرد" : "Mark as Responded",
    markCompleted: isAr ? "تحديد كـ مكتمل" : "Mark as Completed",
    close: isAr ? "إغلاق" : "Close",
    noNotes: isAr ? "لا توجد ملاحظات إضافية" : "No additional notes",
  };

  const [orders, setOrders] = useState([
    { 
      id: "ORD-9821", 
      customer: "Ahmed Mansour", 
      email: "ahmed.mansour@gmail.com",
      phone: "+201009876543",
      whatsapp: "201009876543",
      date: "2026-07-06", 
      status: "pending", 
      total: 1497.00,
      items: [
        { name: isAr ? "طقم مزهريات سيراميك منقط بلمسة ذهبية" : "Speckled Gold Donut Vase Set", sku: "U0002-PN05-SET", qty: 3, price: 499.00 }
      ],
      notes: isAr ? "يرجى شحن البضاعة بحذر شديد لأنها قابلة للكسر." : "Please pack securely. Items are fragile glass/ceramic."
    },
    { 
      id: "ORD-9784", 
      customer: "Sarah Al-Fahad", 
      email: "sarah.fahad@yahoo.com",
      phone: "+966501234567",
      whatsapp: "966501234567",
      date: "2026-07-05", 
      status: "responded", 
      total: 499.00,
      items: [
        { name: isAr ? "مزهرية بورسلين كلاسيكية" : "Classic Porcelain Vase", sku: "U0002-PN05", qty: 1, price: 499.00 }
      ],
      notes: ""
    },
    { 
      id: "ORD-9632", 
      customer: "Khaled Youssef", 
      email: "k.youssef@company.eg",
      phone: "+201223456789",
      whatsapp: "201223456789",
      date: "2026-07-01", 
      status: "completed", 
      total: 2890.00,
      items: [
        { name: isAr ? "طقم مزهريات سيراميك منقط بلمسة ذهبية" : "Speckled Gold Donut Vase Set", sku: "U0002-PN05-SET", qty: 4, price: 499.00 },
        { name: isAr ? "مزهرية بورسلين كلاسيكية" : "Classic Porcelain Vase", sku: "U0002-PN05", qty: 2, price: 447.00 }
      ],
      notes: isAr ? "طلب عاجل لمعرض الفندق الجديد" : "Urgent delivery requested for the new hotel showroom"
    }
  ]);

  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const formatPrice = (price: number) => {
    const savedCurrency = localStorage.getItem("currency") || "USD ($)";
    if (savedCurrency.includes("EGP")) {
      return isAr ? `${price.toLocaleString()} ج.م` : `EGP ${price.toLocaleString()}`;
    } else if (savedCurrency.includes("EUR")) {
      return `€${price.toLocaleString()}`;
    } else {
      return `$${price.toLocaleString()}`;
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    const updated = orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
    setOrders(updated);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  return (
    <div dir={dir}>
      <h1 className="text-3xl font-bold text-white mb-8">{t.title}</h1>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-neutral-400">
            <thead className="bg-neutral-950/50 text-neutral-300 border-b border-neutral-800">
              <tr>
                <th scope="col" className={`px-6 py-4 font-medium ${isAr ? 'text-right' : 'text-left'}`}>{t.orderId}</th>
                <th scope="col" className={`px-6 py-4 font-medium ${isAr ? 'text-right' : 'text-left'}`}>{t.customer}</th>
                <th scope="col" className={`px-6 py-4 font-medium ${isAr ? 'text-right' : 'text-left'}`}>{t.date}</th>
                <th scope="col" className={`px-6 py-4 font-medium ${isAr ? 'text-right' : 'text-left'}`}>{t.status}</th>
                <th scope="col" className={`px-6 py-4 font-medium ${isAr ? 'text-right' : 'text-left'}`}>{t.total}</th>
                <th scope="col" className={`px-6 py-4 font-medium ${isAr ? 'text-left' : 'text-right'}`}>{t.actions}</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-neutral-800/50 hover:bg-neutral-800/20 transition-colors">
                  <td className={`px-6 py-4 font-mono text-white font-medium ${isAr ? 'text-right' : 'text-left'}`}>
                    {order.id}
                  </td>
                  <td className={`px-6 py-4 ${isAr ? 'text-right' : 'text-left'}`}>{order.customer}</td>
                  <td className={`px-6 py-4 ${isAr ? 'text-right' : 'text-left'}`}>{order.date}</td>
                  <td className={`px-6 py-4 ${isAr ? 'text-right' : 'text-left'}`}>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
                      order.status === 'responded' ? 'bg-blue-500/10 text-blue-400' :
                      'bg-amber-500/10 text-amber-400'
                    }`}>
                      {order.status === 'completed' ? t.completed :
                       order.status === 'responded' ? t.responded : t.pending}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-white font-medium ${isAr ? 'text-right' : 'text-left'}`}>
                    {formatPrice(order.total)}
                  </td>
                  <td className={`px-6 py-4 ${isAr ? 'text-left' : 'text-right'}`}>
                    <button 
                      onClick={() => setSelectedOrder(order)}
                      className="text-amber-500 hover:text-amber-400 font-medium transition-colors"
                    >
                      {t.view}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-neutral-900 border border-neutral-800 w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex justify-between items-center bg-neutral-950 p-6 border-b border-neutral-800">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-bold text-white">{t.modalTitle}</h2>
                <span className="font-mono text-neutral-400">#{selectedOrder.id}</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  selectedOrder.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
                  selectedOrder.status === 'responded' ? 'bg-blue-500/10 text-blue-400' :
                  'bg-amber-500/10 text-amber-400'
                }`}>
                  {selectedOrder.status === 'completed' ? t.completed :
                   selectedOrder.status === 'responded' ? t.responded : t.pending}
                </span>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[70vh] overflow-y-auto">
              {/* Left Column: Customer details */}
              <div className="space-y-6">
                <div className="bg-neutral-950/40 border border-neutral-800/80 rounded-xl p-5">
                  <h3 className="text-white font-bold text-base mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {t.customerInfo}
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">{t.customer}:</span>
                      <span className="text-white font-medium">{selectedOrder.customer}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">{t.email}:</span>
                      <span className="text-white font-medium">{selectedOrder.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">{t.phone}:</span>
                      <span className="text-white font-medium" dir="ltr">{selectedOrder.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">{t.date}:</span>
                      <span className="text-white font-medium">{selectedOrder.date}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-neutral-950/40 border border-neutral-800/80 rounded-xl p-5">
                  <h3 className="text-white font-bold text-base mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    {t.notes}
                  </h3>
                  <p className="text-sm text-neutral-300 leading-relaxed italic bg-neutral-950/30 p-3 rounded-lg border border-neutral-800/50">
                    {selectedOrder.notes || t.noNotes}
                  </p>
                </div>
              </div>

              {/* Right Column: Ordered Items */}
              <div className="flex flex-col">
                <div className="bg-neutral-950/40 border border-neutral-800/80 rounded-xl overflow-hidden flex-1">
                  <div className="p-4 bg-neutral-950/80 border-b border-neutral-800">
                    <h3 className="text-white font-bold text-base flex items-center gap-2">
                      <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      {t.items}
                    </h3>
                  </div>
                  <div className="divide-y divide-neutral-800/50 max-h-[300px] overflow-y-auto">
                    {selectedOrder.items.map((item: any, i: number) => (
                      <div key={i} className="p-4 flex justify-between items-center text-sm gap-4">
                        <div>
                          <p className="text-white font-medium">{item.name}</p>
                          <p className="text-xs text-neutral-500 font-mono mt-1">SKU: {item.sku}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-white font-medium">{item.qty} × {formatPrice(item.price)}</p>
                          <p className="text-xs text-neutral-400 mt-1">{formatPrice(item.qty * item.price)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 bg-neutral-950/60 border-t border-neutral-800 flex justify-between items-center font-bold text-white text-base">
                    <span>{t.totalPrice}</span>
                    <span>{formatPrice(selectedOrder.total)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="bg-neutral-950 p-6 border-t border-neutral-800 flex flex-wrap gap-3 justify-end">
              {/* WhatsApp B2B Link */}
              <a 
                href={`https://wa.me/${selectedOrder.whatsapp}?text=${encodeURIComponent(
                  isAr 
                    ? `مرحباً ${selectedOrder.customer}، نقوم بالرد على استفسارك رقم ${selectedOrder.id} بخصوص طاقم المزهريات...` 
                    : `Hello ${selectedOrder.customer}, this is Elmuttahida regarding your B2B Inquiry #${selectedOrder.id}...`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="bg-[#25D366] hover:bg-[#20ba5a] text-neutral-950 font-bold py-2 px-4 rounded-xl transition-colors inline-flex items-center gap-2"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.967C16.59 1.973 14.113.95 11.488.95c-5.437 0-9.862 4.371-9.866 9.8.001 1.947.518 3.848 1.503 5.539L2.1 21.841l5.547-1.447z" />
                </svg>
                {t.whatsappChat}
              </a>

              {selectedOrder.status === 'pending' && (
                <button 
                  onClick={() => updateOrderStatus(selectedOrder.id, 'responded')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl transition-colors"
                >
                  {t.markResponded}
                </button>
              )}

              {selectedOrder.status !== 'completed' && (
                <button 
                  onClick={() => updateOrderStatus(selectedOrder.id, 'completed')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-xl transition-colors"
                >
                  {t.markCompleted}
                </button>
              )}

              <button 
                onClick={() => setSelectedOrder(null)}
                className="bg-neutral-800 hover:bg-neutral-700 text-white font-semibold py-2 px-4 rounded-xl transition-colors"
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
