import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useBoutique } from '../../context/BoutiqueContext';
import { FolderTree, PlusCircle, Edit2, Trash2, X, Save, Image as ImageIcon, CheckCircle } from 'lucide-react';

export const AdminCategoriesPage = () => {
  const { authHeaders } = useAdminAuth();
  const { refreshData } = useBoutique();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState(null);

  // Modal Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [sortOrder, setSortOrder] = useState('0');
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchCats = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/categories?includeInactive=true');
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories || []);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCats();
  }, []);

  const openAddModal = () => {
    setEditingCat(null);
    setName('');
    setDescription('');
    setImage('https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80');
    setSortOrder('0');
    setIsActive(true);
    setModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCat(cat);
    setName(cat.name || '');
    setDescription(cat.description || '');
    setImage(cat.image || '');
    setSortOrder(String(cat.sortOrder || 0));
    setIsActive(cat.isActive !== false);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    try {
      const payload = {
        name: name.trim(),
        description: description.trim(),
        image: image.trim(),
        sortOrder: Number(sortOrder),
        isActive,
      };

      const url = editingCat ? `/api/categories/${editingCat.id}` : '/api/categories';
      const method = editingCat ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setModalOpen(false);
        fetchCats();
        refreshData();
      } else {
        alert(data.message || 'Error saving category');
      }
    } catch (err) {
      console.error('Error saving category:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        headers: authHeaders,
      });
      const data = await res.json();
      if (data.success) {
        fetchCats();
        refreshData();
      }
    } catch (err) {
      console.error('Error deleting category:', err);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FolderTree className="w-6 h-6 text-burgundy-900" />
            <span>Category Management</span>
          </h2>
          <p className="text-xs text-slate-500">
            Organize catalog sections: Bridal Wear, Shararas, Kurtas, Hoodies, Co-ord sets, etc.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-gold-gradient text-burgundy-950 font-bold px-4 py-2.5 rounded-xl text-xs shadow flex items-center gap-2 transition-transform active:scale-95 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between"
          >
            <div className="relative aspect-[16/9] bg-slate-100 overflow-hidden">
              <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
              <div className="absolute top-2 right-2 flex items-center gap-1">
                <span className="bg-black/75 text-gold-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {cat.productCount || 0} Outfits
                </span>
              </div>
            </div>

            <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-serif font-bold text-sm text-slate-900">{cat.name}</h4>
                <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{cat.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-mono">Order: {cat.sortOrder || 0}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(cat)}
                    className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-serif font-bold text-base text-slate-900">
                {editingCat ? 'Edit Category' : 'Add New Category'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sharara Suits"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Brief description for category banner..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Sort Order</label>
                  <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="w-4 h-4 rounded text-burgundy-900"
                    />
                    <span>Active Live</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-gold-gradient text-burgundy-950 px-5 py-2 rounded-xl text-xs font-bold shadow-md"
                >
                  {saving ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
