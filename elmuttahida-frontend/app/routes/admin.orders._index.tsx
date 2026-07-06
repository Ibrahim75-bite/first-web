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
  };

  const [orders] = useState([
    { id: "ORD-9821", customer: "Ahmed Mansour", date: "2026-07-06", status: "pending", total: "$1,497.00" },
    { id: "ORD-9784", customer: "Sarah Al-Fahad", date: "2026-07-05", status: "responded", total: "$499.00" },
    { id: "ORD-9632", customer: "Khaled Youssef", date: "2026-07-01", status: "completed", total: "$2,890.00" },
  ]);

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
                    {order.total}
                  </td>
                  <td className={`px-6 py-4 ${isAr ? 'text-left' : 'text-right'}`}>
                    <button className="text-amber-500 hover:text-amber-400 font-medium">{t.view}</button>
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
