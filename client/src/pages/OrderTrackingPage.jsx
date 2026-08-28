import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBoutique } from '../context/BoutiqueContext';
import { getApiUrl } from '../utils/api';
import {
  Search,
  CheckCircle2,
  Clock,
  Scissors,
  Sparkles,
  MapPin,
  MessageCircle,
  Phone,
  Calendar,
  AlertCircle,
  ShoppingBag,
  ArrowRight
} from 'lucide-react';

export const OrderTrackingPage = () => {
  const { openWhatsApp, settings } = useBoutique();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [orders, setOrders] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(getApiUrl(`/api/tracking/search?q=${encodeURIComponent(query.trim())}`));
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error('Error searching order:', err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Steps definition for stitching journey
  const stages = [
    { key: 'order_booked', label: '1. Order Booked & Measurement Taken', desc: 'Fabric received and custom measurements recorded.' },
    { key: 'cutting_done', label: '2. Pattern & Fabric Cutting', desc: 'Masterji has completed precision cutting as per measurements.' },
    { key: 'stitching_in_progress', label: '3. Stitching & Handwork', desc: 'Silwayi, lining and lace/latkan craftsmanship in progress.' },
    { key: 'finishing_check', label: '4. Finishing & Steam Ironing', desc: 'Quality inspection and steam pressing underway.' },
    { key: 'ready_for_pickup', label: '5. Ready for In-Store Trial & Pickup! 🎉', desc: 'Aapka suit taiyar hai! Aap boutique aakar trial le sakte hain.' },
  ];

  const getStageIndex = (stageKey) => {
    switch (stageKey) {
      case 'order_booked': return 0;
      case 'cutting_done': return 1;
      case 'stitching_in_progress': return 2;
      case 'finishing_check': return 3;
      case 'ready_for_pickup':
      case 'completed': return 4;
      default: return 0;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-gold-200 text-burgundy-950 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          <Scissors className="w-3.5 h-3.5 text-gold-800" />
          <span>Live Stitching Tracker</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-burgundy-950">
          अपने सूट / लहंगे का लाइव स्टेटस चेक करें
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-muted max-w-xl mx-auto">
          अपना मोबाइल नंबर या Order Receipt ID (उदा. 9876543210 या RSB-101) दर्ज करें
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSearch} className="max-w-xl mx-auto flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gold-600" />
          <input
            type="text"
            required
            placeholder="मोबाइल नंबर या Order ID डालें..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl border-2 border-gold-300 focus:outline-none focus:border-burgundy-900 text-sm shadow-sm"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-burgundy-900 hover:bg-burgundy-950 text-gold-200 px-6 py-3 rounded-2xl font-bold text-sm shadow-md transition-transform active:scale-95 shrink-0"
        >
          {loading ? 'खोज रहे हैं...' : 'स्टेटस देखें'}
        </button>
      </form>

      {/* Results */}
      {searched && (
        <div className="space-y-6">
          {orders.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border-2 border-gold-200 shadow-sm space-y-3">
              <AlertCircle className="w-10 h-10 text-amber-600 mx-auto" />
              <h3 className="font-serif font-bold text-lg text-burgundy-950">कोई एक्टिव ऑर्डर नहीं मिला</h3>
              <p className="text-xs text-charcoal-muted max-w-md mx-auto">
                कृपया सही मोबाइल नंबर जांचें। यदि आपने हाल ही में नाप दिया है तो आप सीधे WhatsApp पर संपर्क कर सकते हैं।
              </p>
              <button
                onClick={() => openWhatsApp({ customMessage: `नमस्ते रीना शर्मा बुटीक, मुझे मेरे सूट का स्टेटस जानना है। मेरा नंबर ${query} है।` })}
                className="bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow inline-flex items-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp पर पूछें</span>
              </button>
            </div>
          ) : (
            orders.map((ord) => {
              const currentStep = getStageIndex(ord.stage);

              return (
                <div
                  key={ord.id}
                  className="bg-white rounded-3xl border-2 border-gold-300 shadow-lg p-6 sm:p-8 space-y-6"
                >
                  {/* Order Top Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gold-200 pb-4">
                    <div>
                      <span className="text-[11px] font-mono font-bold bg-burgundy-900 text-gold-200 px-2.5 py-1 rounded-md">
                        {ord.orderId || 'RSB-ORDER'}
                      </span>
                      <h2 className="font-serif text-xl sm:text-2xl font-bold text-burgundy-950 mt-1">
                        {ord.itemDescription}
                      </h2>
                      <p className="text-xs text-charcoal-muted">
                        ग्राहक: <strong>{ord.customerName}</strong> ({ord.phone})
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-charcoal-muted block">अनुमानित रेडी डेट</span>
                      <span className="font-serif font-bold text-sm sm:text-base text-burgundy-900 flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-gold-600" />
                        {ord.expectedDate ? new Date(ord.expectedDate).toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Ready in 2-3 Days'}
                      </span>
                    </div>
                  </div>

                  {/* 5-Step Visual Stepper */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gold-800">
                      सिलाई की प्रगति (Live Progress):
                    </h3>

                    <div className="space-y-4">
                      {stages.map((stage, idx) => {
                        const isDone = idx < currentStep;
                        const isCurrent = idx === currentStep;
                        const isPending = idx > currentStep;

                        return (
                          <div
                            key={stage.key}
                            className={`flex items-start gap-4 p-3.5 rounded-2xl transition-all ${
                              isCurrent
                                ? 'bg-gold-50 border-2 border-gold-400 shadow-sm'
                                : isDone
                                ? 'bg-emerald-50/60 border border-emerald-200'
                                : 'bg-slate-50/60 border border-slate-200 opacity-60'
                            }`}
                          >
                            <div className="mt-0.5">
                              {isDone && (
                                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow">
                                  <CheckCircle2 className="w-4 h-4" />
                                </div>
                              )}
                              {isCurrent && (
                                <div className="w-6 h-6 rounded-full bg-gold-500 text-burgundy-950 flex items-center justify-center font-bold text-xs shadow animate-bounce">
                                  ⚡
                                </div>
                              )}
                              {isPending && (
                                <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-bold">
                                  {idx + 1}
                                </div>
                              )}
                            </div>

                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className={`text-xs sm:text-sm font-bold ${
                                  isCurrent ? 'text-burgundy-950 font-black' : isDone ? 'text-emerald-900' : 'text-slate-600'
                                }`}>
                                  {stage.label}
                                </span>
                                {isCurrent && (
                                  <span className="text-[10px] bg-gold-400 text-burgundy-950 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                    Current Stage
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-charcoal-muted mt-0.5">{stage.desc}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Masterji Notes (if any) */}
                  {ord.masterNotes && (
                    <div className="p-3.5 rounded-xl bg-boutique-100 border border-gold-300 text-xs space-y-1">
                      <span className="font-bold text-burgundy-950 flex items-center gap-1.5">
                        <Scissors className="w-3.5 h-3.5 text-gold-600" />
                        Masterji Note / फिनिशिंग विवरण:
                      </span>
                      <p className="text-charcoal-soft italic">{ord.masterNotes}</p>
                    </div>
                  )}

                  {/* Boutique In-Store Pickup Details */}
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-amber-950">
                      <MapPin className="w-5 h-5 text-amber-700 shrink-0" />
                      <div>
                        <strong>रीना शर्मा बुटीक पर ट्रायल:</strong>
                        <p className="text-[11px] text-amber-900">समय: 11:00 AM - 8:00 PM • महेंद्रगढ़, हरियाणा</p>
                      </div>
                    </div>

                    <button
                      onClick={() => openWhatsApp({ customMessage: `नमस्ते! मैं मेरे ऑर्डर ${ord.orderId} (${ord.itemDescription}) के ट्रायल के लिए कब आ सकती हूँ?` })}
                      className="bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs px-4 py-2 rounded-xl shadow flex items-center gap-1.5"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>WhatsApp ट्रायल सहायता</span>
                    </button>
                  </div>

                </div>
              );
            })
          )}
        </div>
      )}

      {/* Helper Box */}
      <div className="bg-white p-6 rounded-3xl border border-gold-200 shadow-sm text-center space-y-3">
        <h3 className="font-serif font-bold text-base text-burgundy-950">
          नया सूट या लहंगा सिलवाना चाहते हैं?
        </h3>
        <p className="text-xs text-charcoal-muted max-w-md mx-auto">
          हमारे पास फैब्रिक लेकर आएं या अपना पसंदीदा डिज़ाइन WhatsApp पर भेजकर कोटेशन प्राप्त करें।
        </p>
        <div className="flex justify-center gap-3">
          <Link
            to="/custom-designs"
            className="bg-burgundy-900 hover:bg-burgundy-950 text-gold-200 text-xs font-bold px-4 py-2 rounded-xl shadow flex items-center gap-1.5"
          >
            <Scissors className="w-3.5 h-3.5" />
            <span>कस्टम सिलाई सेवा</span>
          </Link>
          <Link
            to="/shop"
            className="bg-gold-500 hover:bg-gold-600 text-burgundy-950 text-xs font-bold px-4 py-2 rounded-xl shadow flex items-center gap-1.5"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>रेडीमेड कैटलॉग देखें</span>
          </Link>
        </div>
      </div>

    </div>
  );
};
