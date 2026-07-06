import { Link } from "react-router";
import { useState, useEffect } from "react";

export default function AdminProductsList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then(res => res.json())
      .then(data => {
        setProducts(data.data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Products Catalog</h1>
        <Link 
          to="/admin/products/new" 
          className="bg-amber-500 hover:bg-amber-600 text-black font-semibold py-2 px-4 rounded-xl transition-colors"
        >
          Add New Product
        </Link>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-neutral-400">
            <thead className="bg-neutral-950/50 text-neutral-300 border-b border-neutral-800">
              <tr>
                <th scope="col" className="px-6 py-4 font-medium">SKU</th>
                <th scope="col" className="px-6 py-4 font-medium">Name (EN)</th>
                <th scope="col" className="px-6 py-4 font-medium">Price</th>
                <th scope="col" className="px-6 py-4 font-medium">Stock</th>
                <th scope="col" className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-neutral-500">
                    Loading products...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-neutral-500">
                    No products found. Create one to get started.
                  </td>
                </tr>
              ) : (
                products.map((product: any) => (
                  <tr key={product.id} className="border-b border-neutral-800/50 hover:bg-neutral-800/20 transition-colors">
                    <td className="px-6 py-4 font-mono text-neutral-300">{product.sku}</td>
                    <td className="px-6 py-4 text-white font-medium">{product.name}</td>
                    <td className="px-6 py-4">${product.base_price}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400">
                        In Stock
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link to={`/admin/products/${product.id}`} className="text-amber-500 hover:text-amber-400 font-medium">
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
