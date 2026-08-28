import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Tag, PlusCircle, Edit2, Trash2, X, Save, Calendar, CheckCircle } from 'lucide-react';

export const AdminOffersPage = () => {
  const { authHeaders } = useAdminAuth();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);

  // Form State
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [discount, setDiscount] = useState('');
  const [code, setCode] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [badgeText, setBadgeText] = useState('');
  const [bannerImage, setBannerImage] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/offers');
      const data = await res.json();
      if (data.success) {
        setOffers(data.offers || []);
      }
    } catch (err) {
      console.error('Error fetching offers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const openAddModal = () => {
    setEditingOffer(null);
    setTitle('');
    setSubtitle('');
    setDiscount('20');
    setCode('FESTIVE20');
    setStartDate('2026-08-01');
    setEndDate('2026-09-30');
    setBadgeText('20% OFF');
    setBannerImage('https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=80');
    setIsActive(true);
    setModalOpen(true);
  };

  const openEditModal = (offer) => {
    setEditingOffer(offer);
    setTitle(offer.title || '');
    setSubtitle(offer.subtitle || '');
    setDiscount(String(offer.discount || ''));
    setCode(offer.code || '');
    setStartDate(offer.startDate || '');
    setEndDate(offer.endDate || '');
    setBadgeText(offer.badgeText || '');
    setBannerImage(offer.bannerImage || '');
    setIsActive(offer.isActive !== false);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        subtitle: subtitle.trim(),
        discount: Number(discount),
        code: code.trim(),
        startDate,
        endDate,
        badgeText: badgeText.trim() || `${discount}% OFF`,
        bannerImage: bannerImage.trim(),
        isActive,
      };

      const url = editingOffer ? `/api/offers/${editingOffer.id}` : '/api/offers';
      const method = editingOffer ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setModalOpen(false);
        fetchOffers();
      } else {
        alert(data.message || 'Error saving offer');
      }
    } catch (err) {
      console.error('Error saving offer:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this offer?')) return;
    try {
      const res = await fetch(`/api/offers/${id}`, {
        method: 'DELETE',
        headers: authHeaders,
      });
      const data = await res.json();
      if (data.success) {
        fetchOffers();
      }
    } catch (err) {
      console.error('Error deleting offer:', err);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Tag className="w-6 h-6 text-burgundy-900" />
            <span>Special Offers & Promo Management</span>
          </h2>
          <p className="text-xs text-slate-500">
            Create festive discounts, discount codes, offer banners, and expiry dates.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-gold-gradient text-burgundy-950 font-bold px-4 py-2.5 rounded-xl text-xs shadow flex items-center gap-2 transition-transform active:scale-95 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create New Offer</span>
        </button>
      </div>

      {/* Offers Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {offer.badgeText || `${offer.discount}% OFF`}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    offer.isActive !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {offer.isActive !== false ? 'Active' : 'Disabled'}
                </span>
              </div>

              <h4 className="font-serif font-bold text-base text-slate-900 leading-snug">
                {offer.title}
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">{offer.subtitle}</p>

              {offer.code && (
                <div className="p-2 bg-slate-50 rounded-lg border border-dashed border-slate-300 font-mono text-xs text-slate-700">
                  Code: <strong className="text-burgundy-950">{offer.code}</strong>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400">
                {offer.endDate ? `Ends: ${offer.endDate}` : 'Ongoing'}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openEditModal(offer)}
                  className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(offer.id)}
                  className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
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
                {editingOffer ? 'Edit Promo Offer' : 'Create New Offer'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Offer Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bridal Collection Festive Offer"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Offer Subtitle</label>
                <input
                  type="text"
                  placeholder="e.g. Get up to 25% OFF on bridal lehengas and blouses"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Discount % *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="100"
                    placeholder="25"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Promo Code</label>
                  <input
                    type="text"
                    placeholder="BRIDAL25"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Badge Text</label>
                <input
                  type="text"
                  placeholder="e.g. Up to 25% OFF"
                  value={badgeText}
                  onChange={(e) => setBadgeText(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none"
                />
              </div>

              <div className="flex items-center pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 rounded text-burgundy-900"
                  />
                  <span>Active & Display on Website</span>
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
                  {saving ? 'Saving...' : 'Save Offer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
