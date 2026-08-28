import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { ShieldCheck, Lock, Mail, ArrowRight, Sparkles, KeyRound } from 'lucide-react';

export const AdminLoginPage = () => {
  const { login, isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect smoothly
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-burgundy-950 via-[#2A050A] to-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-gold-500/30 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gold-gradient text-burgundy-950 flex items-center justify-center mx-auto shadow-lg">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gold-300">
            Boutique Admin Portal
          </h1>
          <p className="text-xs text-boutique-300">
            Reena Sharma Boutique • Mahendragarh, Haryana
          </p>
        </div>



        {/* Error Alert */}
        {error && (
          <div className="p-3 bg-red-950/80 border border-red-500/50 rounded-xl text-xs text-red-200 text-center font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-boutique-200 mb-1">
              Admin Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-boutique-400" />
              <input
                type="email"
                required
                placeholder="admin@reenasharma.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-gold-500/30 rounded-xl text-xs sm:text-sm text-white placeholder:text-boutique-500 focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-boutique-200 mb-1">
              Secret Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-boutique-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-gold-500/30 rounded-xl text-xs sm:text-sm text-white placeholder:text-boutique-500 focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold-gradient hover:opacity-95 text-burgundy-950 font-bold py-3 rounded-xl text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-50 mt-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Admin Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 text-center">
          <Link to="/" className="text-xs text-boutique-400 hover:text-gold-300 transition-colors">
            ← Return to Customer Website
          </Link>
        </div>

      </div>
    </div>
  );
};
