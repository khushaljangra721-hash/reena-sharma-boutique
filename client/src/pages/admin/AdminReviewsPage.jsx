import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { getApiUrl } from '../../utils/api';
import {
  Star,
  Trash2,
  CheckCircle,
  ShieldCheck,
  Search,
  Filter,
  User,
  MapPin,
  ThumbsUp,
  MessageSquare
} from 'lucide-react';

export const AdminReviewsPage = () => {
  const { authHeaders } = useAdminAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch(getApiUrl('/api/reviews/admin'), { headers: authHeaders });
      const data = await res.json();
      if (data.success) {
        setReviews(data.reviews || []);
      }
    } catch (err) {
      console.error('Error fetching admin reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this customer review?')) return;
    try {
      const res = await fetch(getApiUrl(`/api/reviews/${id}`), {
        method: 'DELETE',
        headers: authHeaders,
      });
      const data = await res.json();
      if (data.success) {
        setReviews((prev) => prev.filter((r) => r.id !== id));
      }
    } catch (err) {
      console.error('Error deleting review:', err);
    }
  };

  const filtered = reviews.filter((r) =>
    (r.userName || '').toLowerCase().includes(search.toLowerCase()) ||
    (r.productName || '').toLowerCase().includes(search.toLowerCase()) ||
    (r.comment || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-800 flex items-center gap-2">
            <Star className="w-6 h-6 text-gold-500 fill-gold-500" />
            <span>Customer Ratings & Reviews</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage Flipkart-style customer reviews, ratings and in-store buyer feedbacks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search reviews..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-burgundy-900"
            />
          </div>
        </div>
      </div>

      {/* Reviews Table / Grid */}
      {loading ? (
        <div className="p-8 text-center text-slate-500">Loading reviews...</div>
      ) : filtered.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
          No customer reviews found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((rev) => (
            <div
              key={rev.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 bg-emerald-700 text-white font-black text-xs px-2 py-0.5 rounded">
                    <span>{rev.rating}</span>
                    <Star className="w-3 h-3 fill-white text-white" />
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {new Date(rev.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>

                <h3 className="font-serif font-bold text-sm text-slate-800 mt-2">
                  {rev.title || 'Customer Review'}
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  "{rev.comment}"
                </p>

                <div className="mt-2 text-[11px] font-bold text-gold-700">
                  Product: {rev.productName || 'Boutique Item'}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <div className="w-6 h-6 rounded-full bg-burgundy-900 text-gold-200 text-[10px] font-bold flex items-center justify-center">
                    {rev.userName?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <span className="font-bold">{rev.userName}</span>
                    {rev.userLocation && <span className="text-slate-400 text-[10px] block">{rev.userLocation}</span>}
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(rev.id)}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete Review"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
