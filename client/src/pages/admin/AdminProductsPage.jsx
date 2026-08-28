import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useBoutique } from '../../context/BoutiqueContext';
import { getImageUrl } from '../../utils/api';
import {
  Package,
  PlusCircle,
  Search,
  Filter,
  Edit2,
  Trash2,
  Sparkles,
  Tag,
  Flame,
  CheckCircle,
  XCircle,
  ExternalLink,
  Eye,
  RotateCcw
} from 'lucide-react';

export const AdminProductsPage = () => {
  const { authHeaders } = useAdminAuth();
  const { categories, formatPrice } = useBoutique();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ includeInactive: 'true', limit: '100' });
      if (search) params.append('search', search);
      if (selectedCat !== 'all') params.append('category', selectedCat);

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error('Error fetching admin products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCat]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const toggleField = async (productId, field) => {
    try {
      const res = await fetch(`/api/products/${productId}/toggle`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify({ field }),
      });
      const data = await res.json();
      if (data.success && data.product) {
        setProducts((prev) =>
          prev.map((p) => (p.id === productId ? data.product : p))
        );
      }
    } catch (err) {
      console.error(`Error toggling ${field}:`, err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: authHeaders,
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        setDeleteConfirmId(null);
      } else {
        alert(data.message || 'Failed to delete product');
      }
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Package className="w-6 h-6 text-burgundy-900" />
            <span>Product Catalog Management</span>
          </h2>
          <p className="text-xs text-slate-500">
            Add, update pricing, discount %, images, category, and quick status toggles.
          </p>
        </div>

        <Link
          to="/admin/products/new"
          className="bg-gold-gradient hover:opacity-95 text-burgundy-950 font-bold px-4 py-2.5 rounded-xl text-xs shadow flex items-center gap-2 transition-transform active:scale-95 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, SKU, fabric..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-burgundy-900"
          />
        </form>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          <button
            onClick={fetchProducts}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            title="Refresh List"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-burgundy-900 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-500">Loading boutique products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Package className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="font-serif font-bold text-base text-slate-800">No products found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No outfits match your search criteria. Add a new garment to your boutique catalog!
            </p>
            <Link
              to="/admin/products/new"
              className="inline-block bg-burgundy-900 text-gold-200 px-4 py-2 rounded-xl text-xs font-bold"
            >
              Add First Outfit
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider">
                <tr>
                  <th className="p-3.5">Product & SKU</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Price & Discount</th>
                  <th className="p-3.5">Stock</th>
                  <th className="p-3.5 text-center">Quick Toggles</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {products.map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-50/70 transition-colors">
                    
                    {/* Image & Title */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={getImageUrl(prod.images?.[0])}
                          alt={prod.name}
                          className="w-12 h-14 object-cover rounded-lg shrink-0 border border-slate-300"
                        />
                        <div className="min-w-0">
                          <Link
                            to={`/product/${prod.slug}`}
                            target="_blank"
                            className="font-bold text-slate-900 hover:text-burgundy-900 block truncate max-w-xs"
                          >
                            {prod.name}
                          </Link>
                          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                            <span className="font-mono bg-slate-100 px-1.5 py-0.2 rounded">{prod.sku || 'N/A'}</span>
                            <span>• {Array.isArray(prod.sizes) ? `${prod.sizes.length} sizes` : 'Standard'}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="p-3.5">
                      <span className="font-semibold text-slate-700">{prod.category}</span>
                    </td>

                    {/* Price */}
                    <td className="p-3.5">
                      <div className="font-bold text-burgundy-900">
                        {formatPrice(prod.salePrice || prod.originalPrice)}
                      </div>
                      {prod.originalPrice > prod.salePrice && (
                        <div className="text-[11px] text-slate-400 line-through">
                          {formatPrice(prod.originalPrice)}
                        </div>
                      )}
                      {prod.discount > 0 && (
                        <span className="inline-block text-[10px] text-green-700 bg-green-50 px-1.5 py-0.2 rounded border border-green-200 font-bold mt-0.5">
                          {prod.discount}% OFF
                        </span>
                      )}
                    </td>

                    {/* Stock Status */}
                    <td className="p-3.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                          prod.stockStatus === 'in_stock'
                            ? 'bg-emerald-100 text-emerald-800'
                            : prod.stockStatus === 'made_to_order'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {prod.stockStatus?.replace('_', ' ') || 'In Stock'}
                      </span>
                    </td>

                    {/* Quick Toggles */}
                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => toggleField(prod.id, 'isActive')}
                          className={`p-1.5 rounded-lg text-[10px] font-bold transition-colors ${
                            prod.isActive !== false
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-slate-200 text-slate-500 hover:bg-slate-300'
                          }`}
                          title="Toggle Active on Website"
                        >
                          {prod.isActive !== false ? 'Active' : 'Hidden'}
                        </button>

                        <button
                          onClick={() => toggleField(prod.id, 'isFeatured')}
                          className={`p-1.5 rounded-lg text-[10px] font-bold transition-colors ${
                            prod.isFeatured
                              ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                              : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                          }`}
                          title="Toggle Featured"
                        >
                          ★ Feat
                        </button>

                        <button
                          onClick={() => toggleField(prod.id, 'isOnOffer')}
                          className={`p-1.5 rounded-lg text-[10px] font-bold transition-colors ${
                            prod.isOnOffer
                              ? 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                              : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                          }`}
                          title="Toggle On Offer"
                        >
                          % Offer
                        </button>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/product/${prod.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                          title="View on site"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>

                        <Link
                          to={`/admin/products/edit/${prod.id}`}
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50"
                          title="Edit Outfit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>

                        <button
                          onClick={() => setDeleteConfirmId(prod.id)}
                          className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                          title="Delete Outfit"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="font-serif font-bold text-lg text-slate-900">Delete this Outfit?</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Are you sure you want to permanently remove this garment from your boutique catalog? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-sm"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
