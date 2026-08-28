import React from 'react';
import { Link } from 'react-router-dom';
import { useBoutique } from '../context/BoutiqueContext';
import { ArrowRight, Sparkles } from 'lucide-react';

export const CategoriesPage = () => {
  const { categories } = useBoutique();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-gold-700 bg-gold-100 px-3 py-1 rounded-full inline-block">
          Explore All Categories
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-burgundy-950">
          Designer Boutique Collections
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-muted">
          From heavy bridal lehengas and royal shararas to everyday kurtas, winter hoodies, and velour track suits.
        </p>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/category/${cat.slug}`}
            className="group relative bg-white rounded-3xl overflow-hidden shadow-luxury border border-boutique-200 hover:border-gold-400 transition-all duration-300 flex flex-col justify-between"
          >
            {/* Image */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-boutique-100">
              <img
                src={cat.image || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80'}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-burgundy-950/80 via-transparent to-transparent" />
              
              {cat.productCount > 0 && (
                <span className="absolute top-3 right-3 bg-burgundy-900/90 text-gold-200 text-xs font-bold px-2.5 py-0.5 rounded-full shadow-md backdrop-blur-sm">
                  {cat.productCount} Designs
                </span>
              )}
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h3 className="font-serif font-bold text-lg text-burgundy-950 group-hover:text-burgundy-700 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-charcoal-muted mt-1 line-clamp-2 leading-relaxed">
                  {cat.description || `Browse handcrafted ${cat.name} designs with custom stitching.`}
                </p>
              </div>

              <div className="pt-2 border-t border-boutique-100 flex items-center justify-between text-xs font-bold text-burgundy-900 group-hover:text-gold-700 transition-colors">
                <span>Explore Designs</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
};
