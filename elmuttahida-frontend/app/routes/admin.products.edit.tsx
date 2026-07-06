import { useParams, Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";

export default function AdminProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    sku: "",
    base_price: "",
    status: "active",
    // English Content
    name_en: "",
    description_en: "",
    // Arabic Content
    name_ar: "",
    description_ar: "",
  });

  useEffect(() => {
    // Mocking initial data for the dashboard UI demonstration
    setTimeout(() => {
      setFormData({
        sku: "U0002-PN05",
        base_price: "499.00",
        status: "active",
        name_en: "Classic Porcelain Vase",
        description_en: "A beautiful hand-crafted porcelain vase with golden trim.",
        name_ar: "مزهرية بورسلين كلاسيكية",
        description_ar: "مزهرية بورسلين جميلة مصنوعة يدوياً مع حواف ذهبية.",
      });
      setLoading(false);
    }, 500);
  }, [id]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSaving(true);
    
    // Simulate save
    setTimeout(() => {
      setSaving(false);
      navigate("/admin/products");
    }, 1000);
  };

  if (loading) {
    return <div className="text-neutral-400">Loading product details...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link to="/admin/products" className="text-neutral-400 hover:text-white mb-2 inline-flex items-center text-sm transition-colors">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to Products
          </Link>
          <h1 className="text-3xl font-bold text-white">Edit Product</h1>
        </div>
        <button 
          onClick={handleSubmit}
          disabled={saving}
          className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-black font-semibold py-2 px-6 rounded-xl transition-colors flex items-center"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Form */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Core Information</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">SKU</label>
                <input 
                  type="text" 
                  name="sku" 
                  value={formData.sku} 
                  onChange={handleChange}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">Base Price ($)</label>
                <input 
                  type="number" 
                  name="base_price" 
                  value={formData.base_price} 
                  onChange={handleChange}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Bilingual Content */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Localization Content</h2>
            
            <div className="space-y-8">
              {/* English Section */}
              <div className="p-5 border border-neutral-800/80 rounded-xl bg-neutral-950/50">
                <div className="flex items-center mb-4">
                  <span className="bg-blue-500/10 text-blue-400 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">English</span>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">Product Name</label>
                    <input 
                      type="text" 
                      name="name_en" 
                      value={formData.name_en} 
                      onChange={handleChange}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">Description</label>
                    <textarea 
                      name="description_en" 
                      value={formData.description_en} 
                      onChange={handleChange}
                      rows={4}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Arabic Section */}
              <div className="p-5 border border-neutral-800/80 rounded-xl bg-neutral-950/50" dir="rtl">
                <div className="flex items-center mb-4">
                  <span className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">العربية</span>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">اسم المنتج</label>
                    <input 
                      type="text" 
                      name="name_ar" 
                      value={formData.name_ar} 
                      onChange={handleChange}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">الوصف</label>
                    <textarea 
                      name="description_ar" 
                      value={formData.description_ar} 
                      onChange={handleChange}
                      rows={4}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Sidebar settings */}
        <div className="space-y-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Status</h2>
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">Visibility</label>
              <select 
                name="status" 
                value={formData.status} 
                onChange={handleChange}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
              >
                <option value="active">Active (Published)</option>
                <option value="draft">Draft (Hidden)</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
