import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useBoutique } from '../../context/BoutiqueContext';
import {
  MessageSquare,
  MessageCircle,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Trash2,
  ExternalLink,
  Phone,
  User,
  Scissors,
  Save,
  RotateCcw
} from 'lucide-react';

export const AdminEnquiriesPage = () => {
  const { authHeaders } = useAdminAuth();
  const { formatPrice } = useBoutique();

  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (search.trim()) params.append('search', search.trim());

      const res = await fetch(`/api/enquiries?${params.toString()}`, {
        headers: authHeaders,
      });
      const data = await res.json();
      if (data.success) {
        setEnquiries(data.enquiries || []);
      }
    } catch (err) {
      console.error('Error fetching enquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchEnquiries();
  };

  const updateStatus = async (id, newStatus, currentNotes) => {
    try {
      const res = await fetch(`/api/enquiries/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body: JSON.stringify({ status: newStatus, adminNotes: currentNotes }),
      });
      const data = await res.json();
      if (data.success) {
        setEnquiries((prev) =>
          prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
        );
      }
    } catch (err) {
      console.error('Error updating enquiry status:', err);
    }
  };

  const updateNotes = async (id, notes, currentStatus) => {
    try {
      await fetch(`/api/enquiries/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body: JSON.stringify({ status: currentStatus, adminNotes: notes }),
      });
    } catch (err) {
      console.error('Error saving admin notes:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this customer enquiry?')) return;
    try {
      const res = await fetch(`/api/enquiries/${id}`, {
        method: 'DELETE',
        headers: authHeaders,
      });
      const data = await res.json();
      if (data.success) {
        setEnquiries((prev) => prev.filter((e) => e.id !== id));
      }
    } catch (err) {
      console.error('Error deleting enquiry:', err);
    }
  };

  const openWhatsAppChat = (enquiry) => {
    const cleanPhone = (enquiry.phone || '').replace(/[^0-9]/g, '');
    const message = `Hello ${enquiry.customerName || 'there'} 👋\n\nThank you for reaching out to Reena Sharma Boutique regarding: ${enquiry.productName || 'your inquiry'}.\n\nHow can we help with your measurements, fabric choices or delivery?`;
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-emerald-600" />
            <span>Customer WhatsApp Orders & Enquiries CRM</span>
          </h2>
          <p className="text-xs text-slate-500">
            Track customer requests, manage order pipelines (New → Contacted → Confirmed → Completed), and reply on WhatsApp.
          </p>
        </div>

        <button
          onClick={fetchEnquiries}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Refresh Enquiries</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by customer, phone, outfit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-burgundy-900"
          />
        </form>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {[
            { label: 'All', value: 'all' },
            { label: 'New', value: 'new' },
            { label: 'Contacted', value: 'contacted' },
            { label: 'Confirmed', value: 'confirmed' },
            { label: 'Completed', value: 'completed' },
            { label: 'Cancelled', value: 'cancelled' },
          ].map((status) => (
            <button
              key={status.value}
              onClick={() => setStatusFilter(status.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                statusFilter === status.value
                  ? 'bg-burgundy-900 text-gold-200'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>

      {/* Enquiries List */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-20 text-center space-y-3 bg-white rounded-2xl border border-slate-200">
            <div className="w-10 h-10 border-4 border-burgundy-900 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-500">Loading customer enquiries...</p>
          </div>
        ) : enquiries.length === 0 ? (
          <div className="p-12 text-center space-y-3 bg-white rounded-2xl border border-slate-200">
            <MessageSquare className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="font-serif font-bold text-base text-slate-800">No enquiries found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No customer requests matching the current status filter.
            </p>
          </div>
        ) : (
          enquiries.map((enq) => (
            <div
              key={enq.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 hover:border-slate-300 transition-colors"
            >
              {/* Top Row: Customer Info & Status Selector */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-burgundy-50 text-burgundy-900 font-bold flex items-center justify-center text-xs shrink-0">
                    {enq.customerName?.charAt(0) || 'C'}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                      <span>{enq.customerName}</span>
                      <span className="font-mono text-xs text-slate-500 font-normal">
                        ({enq.phone})
                      </span>
                    </h4>
                    <span className="text-[11px] text-slate-400">
                      Received on: {new Date(enq.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Status Dropdown */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-slate-500">Status:</span>
                    <select
                      value={enq.status || 'new'}
                      onChange={(e) => updateStatus(enq.id, e.target.value, enq.adminNotes)}
                      className={`text-xs font-bold rounded-xl px-3 py-1.5 border focus:outline-none ${
                        enq.status === 'new'
                          ? 'bg-amber-50 text-amber-800 border-amber-300'
                          : enq.status === 'contacted'
                          ? 'bg-blue-50 text-blue-800 border-blue-300'
                          : enq.status === 'confirmed'
                          ? 'bg-purple-50 text-purple-800 border-purple-300'
                          : enq.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-red-50 text-red-800 border-red-300'
                      }`}
                    >
                      <option value="new">New Inquiry</option>
                      <option value="contacted">Contacted on WhatsApp</option>
                      <option value="confirmed">Order Confirmed</option>
                      <option value="completed">Completed & Dispatched</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  {/* 1-Click WhatsApp Reply CTA */}
                  <button
                    onClick={() => openWhatsAppChat(enq)}
                    className="bg-[#25D366] hover:bg-[#20ba59] text-white px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp Chat</span>
                  </button>

                  <button
                    onClick={() => handleDelete(enq.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                    title="Delete inquiry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Garment Details & Customer Message */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl space-y-1 border border-slate-200/80">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    Product / Outfit Details
                  </span>
                  <div className="font-bold text-slate-900 text-sm">{enq.productName}</div>
                  <div className="flex flex-wrap gap-2 text-slate-600 pt-1">
                    {enq.productPrice && <span>Price: {formatPrice(enq.productPrice)}</span>}
                    {enq.productSku && enq.productSku !== 'N/A' && <span>• SKU: {enq.productSku}</span>}
                    {enq.size && <span>• Size: {enq.size}</span>}
                    {enq.color && <span>• Color: {enq.color}</span>}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl space-y-1 border border-slate-200/80">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    Customer Message & Notes
                  </span>
                  <p className="text-slate-700 leading-relaxed italic">
                    {enq.message ? `"${enq.message}"` : 'No custom message added.'}
                  </p>
                </div>
              </div>

              {/* Admin Internal Notes */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[11px] font-bold text-slate-500 shrink-0">Admin Notes:</span>
                <input
                  type="text"
                  placeholder="e.g. Fitting appointment scheduled for Saturday / Advance token received..."
                  defaultValue={enq.adminNotes || ''}
                  onBlur={(e) => updateNotes(enq.id, e.target.value, enq.status)}
                  className="w-full text-xs p-1.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:bg-white"
                />
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};
