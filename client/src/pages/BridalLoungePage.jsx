import React, { useState, useEffect } from 'react';
import { useBoutique } from '../context/BoutiqueContext';
import { ProductCard } from '../components/ProductCard';
import { Crown, Sparkles, MessageCircle, Scissors, CheckCircle2, Star, ShieldCheck, Heart } from 'lucide-react';

export const BridalLoungePage = () => {
  const { openWhatsApp, setEnquiryProduct } = useBoutique();
  const [bridalProducts, setBridalProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBridal = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/products?includeInactive=false');
        const data = await res.json();
        if (data.success) {
          const filtered = (data.products || []).filter(
            (p) =>
              p.category?.toLowerCase().includes('bridal') ||
              p.categorySlug?.toLowerCase().includes('bridal') ||
              p.categorySlug === 'lehenga-suits'
          );
          setBridalProducts(filtered);
        }
      } catch (err) {
        console.error('Error fetching bridal products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBridal();
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="space-y-12 sm:space-y-16 pb-12">
      
      {/* Royal Bridal Hero */}
      <section className="relative bg-gradient-to-r from-burgundy-950 via-burgundy-900 to-burgundy-950 text-white py-20 overflow-hidden border-b-2 border-gold-500/30">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-gold-500/20 border border-gold-400/40 text-gold-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-sm">
            <Crown className="w-4 h-4 text-gold-400" />
            <span>Royal Bridal Lounge • Mahendragarh</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
            Handcrafted Bridal Ensembles & Blouse Couture
          </h1>

          <p className="text-sm sm:text-base text-boutique-200 max-w-2xl mx-auto leading-relaxed font-light">
            Designed for the modern Indian bride. Heavy micro-velvet lehengas, zardozi needlework, custom boat-neck bridal blouses, and bespoke wedding stitching by Reena Sharma Boutique.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => openWhatsApp({ customMessage: 'Hello Reena Sharma Boutique! I would like to book a Bridal fitting consultation & discuss custom bridal lehenga stitching.' })}
              className="bg-gold-gradient text-burgundy-950 hover:opacity-95 font-bold px-8 py-3.5 rounded-full text-sm sm:text-base shadow-2xl transition-all hover:scale-105 flex items-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Book Bridal Consultation on WhatsApp</span>
            </button>
            <button
              onClick={() => setEnquiryProduct({ name: 'Custom Bridal Package & Fitting', category: 'Bridal Wear' })}
              className="border border-gold-400/60 hover:bg-gold-400/10 text-gold-200 font-semibold px-6 py-3.5 rounded-full text-sm sm:text-base backdrop-blur-sm transition-colors flex items-center gap-2"
            >
              <Scissors className="w-4 h-4" />
              <span>Submit Fitting Request</span>
            </button>
          </div>
        </div>
      </section>

      {/* Bridal Features Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-luxury border border-boutique-200 text-center space-y-3">
            <div className="w-12 h-12 bg-burgundy-50 text-burgundy-900 rounded-2xl flex items-center justify-center mx-auto">
              <Crown className="w-6 h-6 text-gold-600" />
            </div>
            <h3 className="font-serif font-bold text-lg text-burgundy-950">
              Master Zardozi & Dabka Work
            </h3>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              Every motif is hand-stitched by experienced artisans using antique gold zari, fine sequins, cutdana and real mirror work.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-luxury border border-boutique-200 text-center space-y-3">
            <div className="w-12 h-12 bg-burgundy-50 text-burgundy-900 rounded-2xl flex items-center justify-center mx-auto">
              <Scissors className="w-6 h-6 text-gold-600" />
            </div>
            <h3 className="font-serif font-bold text-lg text-burgundy-950">
              Bespoke Bridal Blouse Cut
            </h3>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              Padded comfort cups, deep back cutouts, customized heavy latkans, elbow-length Maggam sleeves and sweetheart necklines.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-luxury border border-boutique-200 text-center space-y-3">
            <div className="w-12 h-12 bg-burgundy-50 text-burgundy-900 rounded-2xl flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6 text-gold-600" />
            </div>
            <h3 className="font-serif font-bold text-lg text-burgundy-950">
              Fitting Guarantee & Video Approval
            </h3>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              We send HD video previews of your completed bridal outfit before final dispatch or store pickup in Mahendragarh.
            </p>
          </div>
        </div>
      </section>

      {/* Bridal Products Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-gold-700 block mb-1">
              Handpicked Creations
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-burgundy-950">
              Bridal Lehengas & Designer Blouses
            </h2>
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-burgundy-900 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="font-serif text-sm font-semibold text-charcoal-muted">
              Loading bridal collection...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bridalProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Bridal Consultation Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-cream rounded-3xl p-8 sm:p-12 border border-gold-400/40 shadow-luxury flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-widest text-gold-700 bg-gold-100 px-3 py-1 rounded-full inline-block">
              Wedding Season Booking
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-burgundy-950">
              Schedule Your In-Person Bridal Fitting in Mahendragarh
            </h3>
            <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
              Visit our boutique at Shop No. 12, Gandhi Chowk Market, Mahendragarh, Haryana. We recommend booking 2–4 weeks in advance for heavy bridal lehenga stitching.
            </p>
          </div>

          <button
            onClick={() => openWhatsApp({ customMessage: 'Hello Reena Sharma Boutique! I would like to visit your Mahendragarh boutique for bridal outfit trial & measurements.' })}
            className="bg-[#25D366] hover:bg-[#20ba59] text-white font-bold px-8 py-4 rounded-full text-sm sm:text-base shadow-xl flex items-center gap-2 hover:scale-105 transition-all shrink-0"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Chat on WhatsApp (+91 94678 30763)</span>
          </button>
        </div>
      </section>

    </div>
  );
};
