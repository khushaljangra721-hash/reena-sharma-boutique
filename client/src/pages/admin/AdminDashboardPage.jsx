import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useBoutique } from '../../context/BoutiqueContext';
import {
  Package,
  MessageSquare,
  Sparkles,
  Tag,
  PlusCircle,
  FolderTree,
  Image as ImageIcon,
  Settings,
  ArrowUpRight,
  Clock,
  CheckCircle,
  MessageCircle,
  ExternalLink,
  Crown
} from 'lucide-react';

export const AdminDashboardPage = () => {
  const { authHeaders } = useAdminAuth();
  const { formatPrice } = useBoutique();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats', { headers: authHeaders });
      const data = await res.json();
      if (data.success && data.stats) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Error fetching admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const openWhatsAppReply = (enquiry) => {
    const cleanPhone = (enquiry.phone || '').replace(/[^0-9]/g, '');
    const message = `Hello ${enquiry.customerName || 'there'} 👋\n\nThank you for reaching out to Reena Sharma Boutique regarding ${enquiry.productName || 'your enquiry'}. How can we assist you today?`;
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-burgundy-900 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-semibold text-slate-500">Loading Dashboard Intelligence...</p>
      </div>
    );
  }

  const p = stats?.products || {};
  const e = stats?.enquiries || {};

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-burgundy-950 via-burgundy-900 to-burgundy-950 text-white rounded-2xl p-6 sm:p-8 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-gold-500/20">
        <div className="space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-widest text-gold-300">
            Store Owner Dashboard
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Welcome to Reena Sharma Boutique Admin
          </h2>
          <p className="text-xs text-boutique-200">
            Manage your boutique products, WhatsApp enquiries, banners, and discounts without writing code.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/admin/products/new"
            className="bg-gold-gradient hover:opacity-95 text-burgundy-950 font-bold px-4 py-2.5 rounded-xl text-xs shadow flex items-center gap-1.5 transition-transform active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Outfit</span>
          </Link>
          <Link
            to="/admin/enquiries"
            className="bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-2.5 rounded-xl text-xs backdrop-blur-sm transition-colors flex items-center gap-1.5"
          >
            <MessageSquare className="w-4 h-4" />
            <span>View Enquiries</span>
          </Link>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Total Products */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Products</span>
            <div className="w-9 h-9 rounded-xl bg-burgundy-50 text-burgundy-900 flex items-center justify-center">
              <Package className="w-5 h-5 text-burgundy-800" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">{p.total || 0}</span>
            <span className="text-xs text-emerald-600 font-semibold">{p.active || 0} Active</span>
          </div>
          <div className="text-[11px] text-slate-400">
            {p.featured || 0} Featured • {p.newArrivals || 0} New In
          </div>
        </div>

        {/* WhatsApp Enquiries */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Enquiries</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">{e.total || 0}</span>
            <span className="text-xs text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-full">
              {e.new || 0} New
            </span>
          </div>
          <div className="text-[11px] text-slate-400">
            {e.confirmed || 0} Confirmed • {e.completed || 0} Completed
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Categories</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <FolderTree className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">{stats?.categoriesCount || 0}</span>
            <span className="text-xs text-slate-500">Live Sections</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Bridal, Blouses, Shararas, Hoodies...
          </div>
        </div>

        {/* Offers & Banners */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Promos</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <Tag className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">{stats?.offersCount || 0}</span>
            <span className="text-xs text-purple-600 font-semibold">{stats?.bannersCount || 0} Slides</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Festive Discounts & Banners
          </div>
        </div>

      </div>

      {/* Quick Action Navigation Grid */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Quick Administrative Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          <Link
            to="/admin/products/new"
            className="p-3 rounded-xl bg-slate-50 hover:bg-burgundy-50 hover:text-burgundy-950 text-slate-700 text-xs font-semibold text-center border border-slate-200 transition-colors flex flex-col items-center gap-1.5"
          >
            <PlusCircle className="w-5 h-5 text-gold-600" />
            <span>Add Outfit</span>
          </Link>
          <Link
            to="/admin/products"
            className="p-3 rounded-xl bg-slate-50 hover:bg-burgundy-50 hover:text-burgundy-950 text-slate-700 text-xs font-semibold text-center border border-slate-200 transition-colors flex flex-col items-center gap-1.5"
          >
            <Package className="w-5 h-5 text-gold-600" />
            <span>All Products</span>
          </Link>
          <Link
            to="/admin/enquiries"
            className="p-3 rounded-xl bg-slate-50 hover:bg-burgundy-50 hover:text-burgundy-950 text-slate-700 text-xs font-semibold text-center border border-slate-200 transition-colors flex flex-col items-center gap-1.5"
          >
            <MessageSquare className="w-5 h-5 text-gold-600" />
            <span>WhatsApp CRM</span>
          </Link>
          <Link
            to="/admin/offers"
            className="p-3 rounded-xl bg-slate-50 hover:bg-burgundy-50 hover:text-burgundy-950 text-slate-700 text-xs font-semibold text-center border border-slate-200 transition-colors flex flex-col items-center gap-1.5"
          >
            <Tag className="w-5 h-5 text-gold-600" />
            <span>Offers & Sales</span>
          </Link>
          <Link
            to="/admin/banners"
            className="p-3 rounded-xl bg-slate-50 hover:bg-burgundy-50 hover:text-burgundy-950 text-slate-700 text-xs font-semibold text-center border border-slate-200 transition-colors flex flex-col items-center gap-1.5"
          >
            <ImageIcon className="w-5 h-5 text-gold-600" />
            <span>Hero Slider</span>
          </Link>
          <Link
            to="/admin/settings"
            className="p-3 rounded-xl bg-slate-50 hover:bg-burgundy-50 hover:text-burgundy-950 text-slate-700 text-xs font-semibold text-center border border-slate-200 transition-colors flex flex-col items-center gap-1.5"
          >
            <Settings className="w-5 h-5 text-gold-600" />
            <span>Site Settings</span>
          </Link>
        </div>
      </div>

      {/* Main Content Grid: Recent Enquiries + Recent Products */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recent Enquiries (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-base text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>Recent WhatsApp Enquiries & Orders</span>
            </h3>
            <Link to="/admin/enquiries" className="text-xs text-burgundy-900 font-bold hover:underline">
              View All ({e.total || 0}) →
            </Link>
          </div>

          <div className="space-y-3">
            {(stats?.recentEnquiries || []).length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No enquiries recorded yet.</p>
            ) : (
              (stats?.recentEnquiries || []).map((enq) => (
                <div
                  key={enq.id}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">{enq.customerName}</span>
                      <span className="text-[10px] text-slate-500 font-mono">({enq.phone})</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                          enq.status === 'new'
                            ? 'bg-amber-100 text-amber-800'
                            : enq.status === 'confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {enq.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-1">
                      👗 {enq.productName} {enq.size && `• Size: ${enq.size}`}
                    </p>
                  </div>

                  <button
                    onClick={() => openWhatsAppReply(enq)}
                    className="bg-[#25D366] hover:bg-[#20ba59] text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 shrink-0 shadow-sm"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Products (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-base text-slate-900 flex items-center gap-2">
              <Package className="w-4 h-4 text-burgundy-900" />
              <span>Recently Added Outfits</span>
            </h3>
            <Link to="/admin/products" className="text-xs text-burgundy-900 font-bold hover:underline">
              Manage →
            </Link>
          </div>

          <div className="space-y-3">
            {(stats?.recentProducts || []).map((prod) => (
              <div
                key={prod.id}
                className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200"
              >
                <img
                  src={prod.images?.[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=200&q=80'}
                  alt={prod.name}
                  className="w-12 h-14 object-cover rounded-lg shrink-0 border border-slate-300"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] uppercase font-bold text-gold-700 block">
                    {prod.category}
                  </span>
                  <h4 className="font-semibold text-xs text-slate-900 truncate">
                    {prod.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-bold text-burgundy-900">
                      {formatPrice(prod.salePrice || prod.originalPrice)}
                    </span>
                    {prod.discount > 0 && (
                      <span className="text-[10px] text-green-700 bg-green-100 px-1.5 py-0.2 rounded font-bold">
                        {prod.discount}% OFF
                      </span>
                    )}
                  </div>
                </div>
                <Link
                  to={`/admin/products/edit/${prod.id}`}
                  className="text-xs text-slate-600 hover:text-burgundy-900 font-medium px-2.5 py-1 bg-white rounded-lg border border-slate-200"
                >
                  Edit
                </Link>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
