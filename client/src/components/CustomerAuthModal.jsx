import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useBoutique } from '../context/BoutiqueContext';
import { useAdminAuth } from '../context/AdminAuthContext';
import {
  X,
  User,
  Phone,
  Lock,
  MapPin,
  Mail,
  Sparkles,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export const CustomerAuthModal = () => {
  const {
    authModalOpen,
    setAuthModalOpen,
    authModalMode,
    customerLogin,
    customerRegister
  } = useBoutique();

  const { login: adminLogin } = useAdminAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState(authModalMode || 'login'); // Strictly 'login' or 'register'
  const [identifier, setIdentifier] = useState(''); // phone or email for login
  const [password, setPassword] = useState('');
  
  // Register fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Mahendragarh');
  const [address, setAddress] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!authModalOpen) return null;

  // Seamless Dual Login (Customer or Admin completely invisible & automatic)
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const input = identifier.trim();

    // 1. If input is admin email, quietly authenticate as admin and redirect to /admin
    if (input.toLowerCase() === 'admin@reenasharma.com' || input.includes('@reenasharma.com')) {
      try {
        await adminLogin(input, password);
        setLoading(false);
        setAuthModalOpen(false);
        navigate('/admin');
        return;
      } catch (adminErr) {
        setLoading(false);
        setError('गलत ईमेल या पासवर्ड');
        return;
      }
    }

    // 2. Try Customer Login
    const res = await customerLogin(input, password);
    if (res.success) {
      setLoading(false);
      setAuthModalOpen(false);
      return;
    }

    // 3. Stealth Fallback: If customer login failed but input contains '@', check if it's admin credentials
    if (input.includes('@')) {
      try {
        await adminLogin(input, password);
        setLoading(false);
        setAuthModalOpen(false);
        navigate('/admin');
        return;
      } catch (err) {
        // Both failed
      }
    }

    setLoading(false);
    setError(res.message || 'गलत मोबाइल नंबर या पासवर्ड');
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (phone.replace(/\D/g, '').length < 10) {
      setError('कृपया 10 अंकों का सही मोबाइल नंबर दर्ज करें');
      return;
    }

    if (regPassword.length < 4) {
      setError('पासवर्ड कम से कम 4 अक्षरों का होना चाहिए');
      return;
    }

    setLoading(true);
    const res = await customerRegister({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      password: regPassword,
      city: city.trim(),
      address: address.trim(),
    });
    setLoading(false);
    if (!res.success) {
      setError(res.message);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999999] flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={() => setAuthModalOpen(false)}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl border-2 border-gold-400 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-burgundy-950 via-burgundy-900 to-burgundy-950 p-5 text-white relative">
          <button
            onClick={() => setAuthModalOpen(false)}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <span className="bg-gold-400 text-burgundy-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
              🌸 रीना शर्मा बुटीक
            </span>
          </div>

          <h3 className="font-serif text-xl sm:text-2xl font-bold mt-1 text-gold-200">
            {mode === 'login' ? 'ग्राहक लॉगिन (Login)' : 'नया खाता बनाएं (Sign Up)'}
          </h3>
          <p className="text-xs text-boutique-200 mt-0.5">
            {mode === 'login'
              ? 'अपना नाप, आर्डर्स और विशलिस्ट देखने के लिए लॉगिन करें'
              : 'एक बार खाता बनाएं और बिना बार-बार नाप दिए आसानी से ऑर्डर करें'}
          </p>

          {/* Only 2 Customer Tabs (No Admin button visible to public) */}
          <div className="grid grid-cols-2 gap-1 bg-burgundy-900/80 p-1 rounded-xl mt-4 border border-gold-500/30 text-center">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError('');
              }}
              className={`py-2 rounded-lg text-xs font-bold transition-all ${
                mode === 'login'
                  ? 'bg-gold-400 text-burgundy-950 shadow'
                  : 'text-boutique-200 hover:text-white'
              }`}
            >
              लॉगिन (Login)
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setError('');
              }}
              className={`py-2 rounded-lg text-xs font-bold transition-all ${
                mode === 'register'
                  ? 'bg-gold-400 text-burgundy-950 shadow'
                  : 'text-boutique-200 hover:text-white'
              }`}
            >
              नया खाता (Sign Up)
            </button>
          </div>
        </div>

        {/* Modal Form Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-xl text-xs font-semibold border border-red-200 flex items-center gap-2">
              <span className="shrink-0 font-bold">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {mode === 'login' ? (
            /* CLEAN LOGIN FORM */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">
                  मोबाइल नंबर या ईमेल <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gold-600 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="उदा. 9812345678"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-boutique-300 focus:outline-none focus:ring-2 focus:ring-burgundy-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">
                  पासवर्ड (Password) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gold-600 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-boutique-300 focus:outline-none focus:ring-2 focus:ring-burgundy-900"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-burgundy-900 hover:bg-burgundy-950 text-gold-200 py-3 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-transform active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span>{loading ? 'लॉगिन हो रहे हैं...' : 'लॉगिन करें (Login)'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setError('');
                  }}
                  className="text-xs font-bold text-burgundy-900 hover:underline"
                >
                  नया खाता बनाना है? यहाँ क्लिक करें (Create New Account) →
                </button>
              </div>
            </form>
          ) : (
            /* REGISTER FORM */
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">
                  आपका नाम (Full Name) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gold-600 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="उदा. पूजा शर्मा"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-boutique-300 focus:outline-none focus:ring-2 focus:ring-burgundy-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">
                    WhatsApp नंबर <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gold-600 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      placeholder="9812345678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-boutique-300 focus:outline-none focus:ring-2 focus:ring-burgundy-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">
                    शहर / गांव (City)
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-gold-600 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="महेंद्रगढ़ / नारनौल / रेवाड़ी"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-boutique-300 focus:outline-none focus:ring-2 focus:ring-burgundy-900"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">
                  ईमेल (Email - Optional)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gold-600 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="pooja@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-boutique-300 focus:outline-none focus:ring-2 focus:ring-burgundy-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">
                  पासवर्ड बनाएं (Create Password) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gold-600 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="कम से कम 4 अक्षर"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-boutique-300 focus:outline-none focus:ring-2 focus:ring-burgundy-900"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-burgundy-900 hover:bg-burgundy-950 text-gold-200 py-3 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-transform active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
              >
                <span>{loading ? 'खाता बन रहा है...' : 'खाता बनाएं (Sign Up)'}</span>
                <CheckCircle2 className="w-4 h-4 text-gold-400" />
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError('');
                  }}
                  className="text-xs font-bold text-burgundy-900 hover:underline"
                >
                  पहले से खाता है? लॉगिन करें (Login) →
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
