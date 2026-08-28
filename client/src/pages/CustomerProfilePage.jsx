import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useBoutique } from '../context/BoutiqueContext';
import { ProductCard } from '../components/ProductCard';
import confetti from 'canvas-confetti';
import {
  User,
  Scissors,
  ShoppingBag,
  Heart,
  Save,
  LogOut,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  Sparkles,
  MessageCircle,
  Clock,
  ChevronRight
} from 'lucide-react';

export const CustomerProfilePage = () => {
  const {
    customer,
    customerOrders,
    customerLogout,
    updateCustomerProfile,
    updateCustomerMeasurements,
    wishlist,
    setAuthModalOpen,
    openWhatsApp
  } = useBoutique();

  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('measurements'); // 'measurements', 'orders', 'wishlist', 'profile'
  
  // Measurements state
  const [measurements, setMeasurements] = useState({
    bust: customer?.measurements?.bust || '',
    waist: customer?.measurements?.waist || '',
    hip: customer?.measurements?.hip || '',
    kurtiLength: customer?.measurements?.kurtiLength || '',
    salwarLength: customer?.measurements?.salwarLength || '',
    shoulder: customer?.measurements?.shoulder || '',
    armhole: customer?.measurements?.armhole || '',
    sleeve: customer?.measurements?.sleeve || '',
    neckFront: customer?.measurements?.neckFront || '',
    neckBack: customer?.measurements?.neckBack || '',
  });

  // Profile details state
  const [name, setName] = useState(customer?.name || '');
  const [email, setEmail] = useState(customer?.email || '');
  const [city, setCity] = useState(customer?.city || '');
  const [address, setAddress] = useState(customer?.address || '');

  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  if (!customer) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-gold-100 text-burgundy-950 flex items-center justify-center mx-auto shadow-inner border-2 border-gold-300">
          <User className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-burgundy-950">
          कृपया पहले लॉगिन करें (Customer Login Required)
        </h2>
        <p className="text-xs sm:text-sm text-charcoal-muted max-w-sm mx-auto">
          अपना नाप कार्ड (Measurements), आर्डर्स और विशलिस्ट देखने के लिए अपने खाते में लॉगिन करें।
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <button
            onClick={() => setAuthModalOpen(true)}
            className="bg-burgundy-900 hover:bg-burgundy-950 text-gold-200 font-bold px-8 py-3 rounded-full text-xs sm:text-sm shadow-md transition-transform active:scale-95"
          >
            लॉगिन या साइन अप करें
          </button>
          <Link
            to="/"
            className="border border-boutique-300 text-charcoal font-bold px-6 py-3 rounded-full text-xs sm:text-sm hover:bg-boutique-100"
          >
            होमपेज पर जाएं
          </Link>
        </div>
      </div>
    );
  }

  const handleMeasurementsSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg('');

    const res = await updateCustomerMeasurements(measurements);
    setSaving(false);
    if (res.success) {
      try {
        confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
      } catch (e) {}
      setStatusMsg('✅ नाप सफलतापूर्वक सुरक्षित हो गया!');
      setTimeout(() => setStatusMsg(''), 4000);
    } else {
      setStatusMsg(`❌ ${res.message}`);
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg('');

    const res = await updateCustomerProfile({ name, email, city, address });
    setSaving(false);
    if (res.success) {
      setStatusMsg('✅ प्रोफाइल सफलतापूर्वक अपडेट हो गई!');
      setTimeout(() => setStatusMsg(''), 4000);
    } else {
      setStatusMsg(`❌ ${res.message}`);
    }
  };

  const handleLogout = () => {
    customerLogout();
    navigate('/');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Customer Header Banner */}
      <div className="bg-gradient-to-r from-burgundy-950 via-burgundy-900 to-burgundy-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-gold-400/50 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="w-16 h-16 rounded-2xl bg-gold-400 text-burgundy-950 flex items-center justify-center font-serif text-2xl font-black shadow-lg shrink-0 border-2 border-white">
            {customer.name?.charAt(0)?.toUpperCase() || 'R'}
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 bg-gold-500/20 text-gold-300 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border border-gold-400/30">
              <Sparkles className="w-3 h-3 text-gold-400" />
              <span>प्रिविलेज ग्राहक (Boutique Customer)</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
              राम राम, {customer.name} जी!
            </h1>
            <p className="text-xs text-boutique-200 flex flex-wrap items-center gap-3 mt-1 justify-center md:justify-start">
              <span>📱 +91 {customer.phone}</span>
              <span>•</span>
              <span>📍 {customer.city || 'हरियाणा'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => openWhatsApp({ customMessage: `राम राम रीना जी! मैं ${customer.name} (+91 ${customer.phone}) बोल रहा/रही हूँ। मुझे सिलाई के बारे में जानकारी चाहिए।` })}
            className="bg-[#25D366] hover:bg-[#20ba59] text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow flex items-center gap-1.5 transition-transform active:scale-95"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp चैट</span>
          </button>
          <button
            onClick={handleLogout}
            className="bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-2.5 rounded-xl text-xs sm:text-sm border border-white/30 flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>लॉगआउट</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gold-200">
        <button
          onClick={() => setActiveTab('measurements')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'measurements'
              ? 'bg-burgundy-900 text-gold-200 shadow'
              : 'bg-white text-charcoal hover:bg-gold-50 border border-gold-200'
          }`}
        >
          <Scissors className="w-4 h-4" />
          <span>📐 मेरा नाप कार्ड (Measurements)</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'orders'
              ? 'bg-burgundy-900 text-gold-200 shadow'
              : 'bg-white text-charcoal hover:bg-gold-50 border border-gold-200'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>🛍️ मेरी पूछताछ व ऑर्डर्स ({customerOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('wishlist')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'wishlist'
              ? 'bg-burgundy-900 text-gold-200 shadow'
              : 'bg-white text-charcoal hover:bg-gold-50 border border-gold-200'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>❤️ पसंदीदा कपड़े ({wishlist.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'profile'
              ? 'bg-burgundy-900 text-gold-200 shadow'
              : 'bg-white text-charcoal hover:bg-gold-50 border border-gold-200'
          }`}
        >
          <User className="w-4 h-4" />
          <span>👤 प्रोफाइल विवरण</span>
        </button>
      </div>

      {statusMsg && (
        <div className="p-3.5 rounded-2xl bg-gold-100 text-burgundy-950 font-bold text-xs sm:text-sm border border-gold-400 text-center animate-in fade-in">
          {statusMsg}
        </div>
      )}

      {/* TAB 1: MEASUREMENTS CARD */}
      {activeTab === 'measurements' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-luxury border-2 border-gold-300 space-y-6">
          <div className="border-b border-gold-200 pb-4">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-gold-700 bg-gold-100 px-3 py-0.5 rounded-full border border-gold-300 mb-1">
              <span>📐 100% परफेक्ट फिटिंग गारंटी</span>
            </div>
            <h3 className="font-serif font-bold text-xl sm:text-2xl text-burgundy-950">
              मेरा स्थायी नाप कार्ड (My Saved Body Measurements)
            </h3>
            <p className="text-xs sm:text-sm text-charcoal-muted mt-1">
              यहाँ अपना नाप (इंच में) एक बार भरें। जब भी आप WhatsApp पर कोई सूट या ब्लाउज ऑर्डर करेंगे, तो आपका नाप आटोमैटिक रीना शर्मा को मिल जाएगा!
            </p>
          </div>

          <form onSubmit={handleMeasurementsSave} className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              
              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">
                  1. चेस्ट / बस्ट (Bust)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="उदा. 36"
                    value={measurements.bust}
                    onChange={(e) => setMeasurements({ ...measurements, bust: e.target.value })}
                    className="w-full p-2.5 text-sm rounded-xl border border-boutique-300 focus:ring-2 focus:ring-burgundy-900 font-bold"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-charcoal-muted">इंच</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">
                  2. कमर (Waist)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="उदा. 32"
                    value={measurements.waist}
                    onChange={(e) => setMeasurements({ ...measurements, waist: e.target.value })}
                    className="w-full p-2.5 text-sm rounded-xl border border-boutique-300 focus:ring-2 focus:ring-burgundy-900 font-bold"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-charcoal-muted">इंच</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">
                  3. हिप (Hip)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="उदा. 38"
                    value={measurements.hip}
                    onChange={(e) => setMeasurements({ ...measurements, hip: e.target.value })}
                    className="w-full p-2.5 text-sm rounded-xl border border-boutique-300 focus:ring-2 focus:ring-burgundy-900 font-bold"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-charcoal-muted">इंच</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">
                  4. कुर्ती लंबाई (Length)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="उदा. 42"
                    value={measurements.kurtiLength}
                    onChange={(e) => setMeasurements({ ...measurements, kurtiLength: e.target.value })}
                    className="w-full p-2.5 text-sm rounded-xl border border-boutique-300 focus:ring-2 focus:ring-burgundy-900 font-bold"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-charcoal-muted">इंच</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">
                  5. सलवार/पैंट लंबाई
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="उदा. 38"
                    value={measurements.salwarLength}
                    onChange={(e) => setMeasurements({ ...measurements, salwarLength: e.target.value })}
                    className="w-full p-2.5 text-sm rounded-xl border border-boutique-300 focus:ring-2 focus:ring-burgundy-900 font-bold"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-charcoal-muted">इंच</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">
                  6. तीरा / शोल्डर (Shoulder)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="उदा. 14.5"
                    value={measurements.shoulder}
                    onChange={(e) => setMeasurements({ ...measurements, shoulder: e.target.value })}
                    className="w-full p-2.5 text-sm rounded-xl border border-boutique-300 focus:ring-2 focus:ring-burgundy-900 font-bold"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-charcoal-muted">इंच</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">
                  7. आर्महोल (Armhole)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="उदा. 16"
                    value={measurements.armhole}
                    onChange={(e) => setMeasurements({ ...measurements, armhole: e.target.value })}
                    className="w-full p-2.5 text-sm rounded-xl border border-boutique-300 focus:ring-2 focus:ring-burgundy-900 font-bold"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-charcoal-muted">इंच</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">
                  8. बाजू लंबाई (Sleeve Length)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="उदा. 18"
                    value={measurements.sleeve}
                    onChange={(e) => setMeasurements({ ...measurements, sleeve: e.target.value })}
                    className="w-full p-2.5 text-sm rounded-xl border border-boutique-300 focus:ring-2 focus:ring-burgundy-900 font-bold"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-charcoal-muted">इंच</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">
                  9. आगे का गला (Front Neck)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="उदा. 6.5"
                    value={measurements.neckFront}
                    onChange={(e) => setMeasurements({ ...measurements, neckFront: e.target.value })}
                    className="w-full p-2.5 text-sm rounded-xl border border-boutique-300 focus:ring-2 focus:ring-burgundy-900 font-bold"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-charcoal-muted">इंच</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">
                  10. पीछे का गला (Back Neck)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="उदा. 8"
                    value={measurements.neckBack}
                    onChange={(e) => setMeasurements({ ...measurements, neckBack: e.target.value })}
                    className="w-full p-2.5 text-sm rounded-xl border border-boutique-300 focus:ring-2 focus:ring-burgundy-900 font-bold"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-charcoal-muted">इंच</span>
                </div>
              </div>

            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gold-200">
              <p className="text-xs text-charcoal-muted">
                💡 <span className="font-bold">टिप:</span> अगर किसी नाप में संकोच हो तो WhatsApp पर वीडियो कॉल से भी नाप ले सकते हैं।
              </p>

              <button
                type="submit"
                disabled={saving}
                className="bg-burgundy-900 hover:bg-burgundy-950 text-gold-200 font-bold px-8 py-3 rounded-2xl text-xs sm:text-sm shadow-lg flex items-center gap-2 transition-transform active:scale-95 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'नाप सेव हो रहा है...' : 'नाप सुरक्षित करें (Save Measurements)'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: MY ORDERS & ENQUIRIES */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-luxury border-2 border-gold-300 space-y-6">
          <div className="border-b border-gold-200 pb-4">
            <h3 className="font-serif font-bold text-xl sm:text-2xl text-burgundy-950">
              मेरी पूछताछ व ऑर्डर्स (My Inquiries & Orders)
            </h3>
            <p className="text-xs sm:text-sm text-charcoal-muted mt-1">
              वेबसाइट से आपके द्वारा भेजे गए सभी व्हाट्सऐप ऑर्डर्स की हिस्ट्री।
            </p>
          </div>

          {customerOrders.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <ShoppingBag className="w-12 h-12 text-gold-500 mx-auto" />
              <h4 className="font-serif font-bold text-base text-burgundy-950">
                अभी तक कोई ऑर्डर या पूछताछ नहीं है
              </h4>
              <p className="text-xs text-charcoal-muted">
                कैटलॉग में मनपसंद डिजाइन देखें और "Order on WhatsApp" दबाएं।
              </p>
              <Link
                to="/shop"
                className="inline-block bg-burgundy-900 text-gold-200 font-bold px-6 py-2.5 rounded-full text-xs shadow mt-2"
              >
                कैटलॉग देखें →
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {customerOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-4 sm:p-5 rounded-2xl border-2 border-gold-200 bg-cream flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-burgundy-950">{ord.productName || 'Custom Outfit'}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-gold-200 text-burgundy-900 border border-gold-400">
                        {ord.status || 'New'}
                      </span>
                    </div>
                    {ord.message && (
                      <p className="text-xs text-charcoal-muted line-clamp-2">
                        "{ord.message}"
                      </p>
                    )}
                    <span className="text-[10px] text-charcoal-muted block">
                      🕒 {new Date(ord.createdAt).toLocaleDateString('hi-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>

                  <button
                    onClick={() => openWhatsApp({ customMessage: `राम राम रीना जी! मेरे ऑर्डर (${ord.productName}) का स्टेटस क्या है?` })}
                    className="bg-[#25D366] hover:bg-[#20ba59] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shrink-0"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp स्टेटस पूछें</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: WISHLIST */}
      {activeTab === 'wishlist' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-xl sm:text-2xl text-burgundy-950">
              पसंदीदा कपड़े (Saved Wishlist - {wishlist.length})
            </h3>
            <Link to="/shop" className="text-xs font-bold text-burgundy-900 hover:underline">
              और डिज़ाइन्स देखें →
            </Link>
          </div>

          {wishlist.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center space-y-3 border-2 border-gold-300">
              <Heart className="w-12 h-12 text-gold-500 mx-auto" />
              <h4 className="font-serif font-bold text-base text-burgundy-950">
                आपकी विशलिस्ट अभी खाली है
              </h4>
              <p className="text-xs text-charcoal-muted">
                ड्रेसेस पर बने दिल (❤️) आइकन पर क्लिक करके अपने फेवरेट डिजाइन सेव करें।
              </p>
              <Link
                to="/shop"
                className="inline-block bg-burgundy-900 text-gold-200 font-bold px-6 py-2.5 rounded-full text-xs shadow mt-2"
              >
                कलेक्शन देखें
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {wishlist.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: PROFILE DETAILS */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-luxury border-2 border-gold-300 space-y-6 max-w-2xl">
          <div className="border-b border-gold-200 pb-4">
            <h3 className="font-serif font-bold text-xl sm:text-2xl text-burgundy-950">
              प्रोफाइल विवरण (Edit Profile)
            </h3>
          </div>

          <form onSubmit={handleProfileSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-charcoal mb-1">
                पूरा नाम (Full Name) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 text-sm rounded-xl border border-boutique-300 focus:ring-2 focus:ring-burgundy-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal mb-1">
                ईमेल (Email Address)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 text-sm rounded-xl border border-boutique-300 focus:ring-2 focus:ring-burgundy-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal mb-1">
                शहर / गांव (City / Town)
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-2.5 text-sm rounded-xl border border-boutique-300 focus:ring-2 focus:ring-burgundy-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal mb-1">
                डिलीवरी पता (Home Address)
              </label>
              <textarea
                rows={3}
                placeholder="घर का पता, गली/मोहल्ला, लैंडमार्क..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2.5 text-sm rounded-xl border border-boutique-300 focus:ring-2 focus:ring-burgundy-900"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="bg-burgundy-900 hover:bg-burgundy-950 text-gold-200 font-bold px-8 py-3 rounded-2xl text-xs sm:text-sm shadow-md transition-transform active:scale-95 disabled:opacity-50 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'सेव हो रहा है...' : 'प्रोफाइल अपडेट करें (Save Profile)'}</span>
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
