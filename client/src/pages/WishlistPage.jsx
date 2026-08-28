import React from 'react';
import { Link } from 'react-router-dom';
import { useBoutique } from '../context/BoutiqueContext';
import { ProductCard } from '../components/ProductCard';
import { Heart, MessageCircle, ArrowLeft, Trash2 } from 'lucide-react';

export const WishlistPage = () => {
  const { wishlist, openWhatsApp, setWishlist } = useBoutique();

  const handleOrderAll = () => {
    if (wishlist.length === 0) return;
    const names = wishlist.map((item) => `• ${item.name} (${item.sku || 'N/A'}) - ₹${item.salePrice || item.originalPrice}`).join('\n');
    const text = `Hello Reena Sharma Boutique! 👋\n\nI have saved these items in my wishlist and would like to check availability and place an order:\n\n${names}\n\nPlease share details. Thank you!`;
    openWhatsApp({ customMessage: text });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-boutique-200 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-gold-700 block mb-1">
            Saved Outfits
          </span>
          <h1 className="font-serif text-3xl font-bold text-burgundy-950 flex items-center gap-2">
            <Heart className="w-7 h-7 text-burgundy-900 fill-burgundy-900" />
            <span>My Wishlist ({wishlist.length})</span>
          </h1>
        </div>

        {wishlist.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              onClick={handleOrderAll}
              className="bg-[#25D366] hover:bg-[#20ba59] text-white font-bold px-5 py-2.5 rounded-full text-xs sm:text-sm shadow-md flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Inquire All on WhatsApp</span>
            </button>
          </div>
        )}
      </div>

      {/* Wishlist Items Grid */}
      {wishlist.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-boutique-200 space-y-4">
          <div className="w-16 h-16 rounded-full bg-boutique-100 text-boutique-400 flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="font-serif font-bold text-xl text-burgundy-950">
            Your Wishlist is Empty
          </h3>
          <p className="text-xs sm:text-sm text-charcoal-muted max-w-sm mx-auto">
            Explore our designer bridal wear, sharara suits, blouses and kurtas and tap the heart icon to save your favorites!
          </p>
          <Link
            to="/shop"
            className="inline-block bg-burgundy-900 text-gold-200 px-6 py-3 rounded-full text-xs font-bold hover:bg-burgundy-950 transition-colors"
          >
            Explore Catalog Now
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

    </div>
  );
};
