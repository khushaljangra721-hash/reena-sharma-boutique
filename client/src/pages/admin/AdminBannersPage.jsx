import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Image as ImageIcon, PlusCircle, Edit2, Trash2, X, Save } from 'lucide-react';

export const AdminBannersPage = () => {
  const { authHeaders } = useAdminAuth();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);

  // Form
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [highlight, setHighlight] = useState('');
  const [image, setImage] = useState('');
  const [ctaText, setCtaText] = useState('Explore Collection');
  const [ctaLink, setCtaLink] = useState('/shop');
  const [badge, setBadge] = useState('Boutique Exclusive');
  const [sortOrder, setSortOrder] = useState('0');
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/banners');
      const data = await res.json();
      if (data.success) {
        setBanners(data.banners || []);
      }
    } catch (err) {
      console.error('Error fetching banners:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const openAddModal = () => {
    setEditingBanner(null);
    setTitle('');
    setSubtitle('');
    setHighlight('Made for You in Mahendragarh, Haryana');
    setImage('https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1800&q=85');
    setCtaText('Explore Collection');
    setCtaLink('/shop');
    setBadge('New Season');
    setSortOrder('0');
    setIsActive(true);
    setModalOpen(true);
  };

  const openEditModal = (b) => {
    setEditingBanner(b);
    setTitle(b.title || '');
    setSubtitle(b.subtitle || '');
    setHighlight(b.highlight || '');
    setImage(b.image || '');
    setCtaText(b.ctaText || 'Explore Collection');
    setCtaLink(b.ctaLink || '/shop');
    setBadge(b.badge || '');
    setSortOrder(String(b.sortOrder || 0));
    setIsActive(b.isActive !== false);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !image.trim()) return;

    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        subtitle: subtitle.trim(),
        highlight: highlight.trim(),
        image: image.trim(),
        ctaText: ctaText.trim(),
        ctaLink: ctaLink.trim(),
        badge: badge.trim(),
        sortOrder: Number(sortOrder),
        isActive,
      };

      const url = editingBanner ? `/api/banners/${editingBanner.id}` : '/api/banners';
      const method = editingBanner ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setModalOpen(false);
        fetchBanners();
      }
    } catch (err) {
      console.error('Error saving banner:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this banner?')) return;
    try {
      const res = await fetch(`/api/banners/${id}`, {
        method: 'DELETE',
        headers: authHeaders,
      });
      const data = await res.json();
      if (data.success) {
        fetchBanners();
      }
    } catch (err) {
      console.error('Error deleting banner:', err);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-burgundy-900" />
            <span>Homepage Hero Banner Management</span>
          </h2>
          <p className="text-xs text-slate-500">
            Control the large slider on the homepage without touching code.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-gold-gradient text-burgundy-950 font-bold px-4 py-2.5 rounded-xl text-xs shadow flex items-center gap-2 transition-transform active:scale-95 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Slide</span>
        </button>
      </div>

      {/* Banners List */}
      <div className="space-y-4">
        {banners.map((b) => (
          <div
            key={b.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div className="flex items-center gap-4 w-full md:w-auto">
              <img
                src={b.image}
                alt={b.title}
                className="w-28 h-20 object-cover rounded-xl border border-slate-200 shrink-0"
              />
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold bg-gold-100 text-gold-800 px-2 py-0.5 rounded-full">
                    {b.badge || 'Banner'}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Order: {b.sortOrder || 0}</span>
                </div>
                <h4 className="font-serif font-bold text-sm text-slate-900 truncate max-w-md">
                  {b.title}
                </h4>
                <p className="text-xs text-slate-500 line-clamp-1">{b.subtitle}</p>
                <div className="text-[11px] text-burgundy-900 font-semibold">
                  CTA: "{b.ctaText}" → {b.ctaLink}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-auto">
              <button
                onClick={() => openEditModal(b)}
                className="p-2 rounded-xl text-blue-600 hover:bg-blue-50 border border-slate-200 text-xs font-semibold flex items-center gap-1"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDelete(b.id)}
                className="p-2 rounded-xl text-red-600 hover:bg-red-50 border border-slate-200 text-xs font-semibold flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-serif font-bold text-base text-slate-900">
                {editingBanner ? 'Edit Hero Slide' : 'Add New Hero Slide'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Banner Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Modern Designs. Elegant Styles."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subtitle</label>
                <input
                  type="text"
                  placeholder="e.g. Handcrafted Bridal Lehengas & Custom Tailoring"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Highlight / Location Note</label>
                <input
                  type="text"
                  placeholder="e.g. Made for You in Mahendragarh, Haryana"
                  value={highlight}
                  onChange={(e) => setHighlight(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Image URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">CTA Button Text</label>
                  <input
                    type="text"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">CTA Link Destination</label>
                  <input
                    type="text"
                    value={ctaLink}
                    onChange={(e) => setCtaLink(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Top Badge Text</label>
                  <input
                    type="text"
                    placeholder="Boutique Exclusive"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Slide Sort Order</label>
                  <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center pt-2">
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

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
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
                  {saving ? 'Saving...' : 'Save Slide'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
