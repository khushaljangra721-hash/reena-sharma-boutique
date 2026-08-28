import React, { useState, useEffect } from 'react';
import { useBoutique } from '../context/BoutiqueContext';
import { ProductCard } from '../components/ProductCard';
import { Sparkles, ArrowRight, Flame } from 'lucide-react';

export const NewArrivalsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNew = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/products?newArrival=true');
        const data = await res.json();
        if (data.success) {
          setProducts(data.products || []);
        }
      } catch (err) {
        console.error('Error loading new arrivals:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNew();
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-burgundy-950 via-burgundy-900 to-burgundy-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-gold-500/20 text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-gold-300 bg-gold-500/20 px-3 py-1 rounded-full inline-block">
          Fresh From The Boutique Workshop
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-white">
          New Arrivals & Latest Drops
        </h1>
        <p className="text-xs sm:text-sm text-boutique-200 max-w-xl mx-auto">
          Explore newly launched designer kurtas, festive shararas, trendy co-ord sets, and fresh winter wear additions.
        </p>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-burgundy-900 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-serif text-sm font-semibold text-charcoal-muted">
            Loading latest drops...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
