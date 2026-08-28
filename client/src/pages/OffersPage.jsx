import React, { useState, useEffect } from 'react';
import { useBoutique } from '../context/BoutiqueContext';
import { ProductCard } from '../components/ProductCard';
import { Tag, Sparkles, MessageCircle, Copy, Check, Calendar, ArrowRight } from 'lucide-react';

export const OffersPage = () => {
  const { openWhatsApp } = useBoutique();
  const [offers, setOffers] = useState([]);
  const [offerProducts, setOfferProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    const fetchOffers = async () => {
      setLoading(true);
      try {
        const [offersRes, prodRes] = await Promise.all([
          fetch('/api/offers?activeOnly=true').then((r) => r.json()),
          fetch('/api/products?onOffer=true').then((r) => r.json()),
        ]);

        if (offersRes.success) setOffers(offersRes.offers || []);
        if (prodRes.success) setOfferProducts(prodRes.products || []);
      } catch (err) {
        console.error('Error fetching offers data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
    window.scrollTo(0, 0);
  }, []);

  const copyPromoCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-burgundy-950 via-burgundy-900 to-burgundy-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-gold-500/20 text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-gold-300 bg-gold-500/20 px-3 py-1 rounded-full inline-block">
          Exclusive Discounts & Deals
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-white">
          Boutique Special Offers & Festive Sales
        </h1>
        <p className="text-xs sm:text-sm text-boutique-200 max-w-xl mx-auto">
          Save on handcrafted bridal wear, sharara suits, designer kurtas, and custom tailoring packages. Simply mention the promo code when ordering on WhatsApp!
        </p>
      </div>

      {/* Offers Showcase Cards */}
      {offers.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="bg-white rounded-3xl p-6 sm:p-8 shadow-luxury border border-boutique-200 hover:border-gold-400 transition-all duration-300 flex flex-col justify-between space-y-6 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 bg-gold-400 text-burgundy-950 text-xs font-extrabold px-4 py-1.5 rounded-bl-2xl shadow">
                {offer.badgeText || `${offer.discount}% OFF`}
              </div>

              <div className="space-y-3 pt-2">
                <div className="w-12 h-12 rounded-2xl bg-burgundy-50 text-burgundy-900 flex items-center justify-center">
                  <Tag className="w-6 h-6 text-gold-600" />
                </div>

                <h3 className="font-serif font-bold text-xl text-burgundy-950 leading-snug">
                  {offer.title}
                </h3>

                <p className="text-xs text-charcoal-muted leading-relaxed">
                  {offer.subtitle || 'Applicable on selected boutique catalog garments and custom tailoring orders.'}
                </p>

                {offer.endDate && (
                  <div className="flex items-center gap-1.5 text-[11px] text-charcoal-muted font-medium">
                    <Calendar className="w-3.5 h-3.5 text-gold-600" />
                    <span>Valid until: {offer.endDate}</span>
                  </div>
                )}
              </div>

              {/* Promo Code Box & WhatsApp CTA */}
              <div className="pt-4 border-t border-boutique-100 space-y-3">
                {offer.code && (
                  <div className="flex items-center justify-between bg-boutique-50 p-2.5 rounded-xl border border-dashed border-boutique-300">
                    <span className="font-mono text-xs font-bold text-burgundy-950">{offer.code}</span>
                    <button
                      onClick={() => copyPromoCode(offer.code)}
                      className="text-[11px] font-bold text-burgundy-900 hover:underline flex items-center gap-1"
                    >
                      {copiedCode === offer.code ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedCode === offer.code ? 'Copied!' : 'Copy Code'}</span>
                    </button>
                  </div>
                )}

                <button
                  onClick={() => openWhatsApp({ customMessage: `Hello Reena Sharma Boutique! I would like to use offer code "${offer.code || offer.title}" for my order.` })}
                  className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow transition-all active:scale-95"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Claim on WhatsApp</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Products on Sale */}
      <div className="space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-gold-700 block mb-1">
              On Sale Now
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-burgundy-950">
              Discounted Outfits & Special Deals
            </h2>
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-burgundy-900 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="font-serif text-sm font-semibold text-charcoal-muted">
              Loading discounted garments...
            </p>
          </div>
        ) : offerProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-boutique-200">
            <p className="text-xs sm:text-sm text-charcoal-muted">
              All promotional items are currently updated. Check back soon or inquire on WhatsApp!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {offerProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
