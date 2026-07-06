export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
          <h3 className="text-neutral-400 text-sm font-medium mb-2">Total Products</h3>
          <p className="text-3xl font-bold text-white">124</p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
          <h3 className="text-neutral-400 text-sm font-medium mb-2">Active Inquiries</h3>
          <p className="text-3xl font-bold text-white">12</p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
          <h3 className="text-neutral-400 text-sm font-medium mb-2">System Health</h3>
          <p className="text-3xl font-bold text-emerald-400">99.9%</p>
        </div>
      </div>
    </div>
  );
}
