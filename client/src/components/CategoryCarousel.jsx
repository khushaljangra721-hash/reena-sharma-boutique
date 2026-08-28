import React from 'react';
import { Link } from 'react-router-dom';
import { useBoutique } from '../context/BoutiqueContext';
import { ChevronRight, Sparkles } from 'lucide-react';

const HINDI_SUBTITLES = {
  'suits': 'सलवार, फर्शी व शरारा',
  'lehenga': 'ब्राइडल व पार्टी लहंगा',
  'saree-blouse': 'पैडेड व लटकन ब्लाउज',
  'kurta': 'कुर्ती विद पैंट सेट',
  'summer-wear': 'प्योर मलमल कॉटन',
  'latest-designs': 'यूट्यूब @Rehan09-wtr ट्रेंड्स',
};

export const CategoryCarousel = () => {
  const { categories } = useBoutique();

  if (!categories || categories.length === 0) return null;

  return (
    <section className="py-10 sm:py-14 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <div className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-gold-700 bg-gold-100/70 px-3 py-0.5 rounded-full border border-gold-300 mb-1">
              <span>🌸 मुख्य बुटीक कैटेगरीज</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-burgundy-950">
              Shop by Category (कैटेगरी अनुसार देखें)
            </h2>
          </div>
          <Link
            to="/categories"
            className="text-xs sm:text-sm font-bold text-burgundy-900 hover:text-burgundy-700 flex items-center gap-1 hover:underline"
          >
            <span>सभी 6 कैटेगरीज</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Categories Grid (6 Cards) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((cat) => {
            const hindiSub = HINDI_SUBTITLES[cat.slug] || 'बुटीक डिजाइन';
            return (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                className="group relative rounded-2xl overflow-hidden bg-white border-2 border-gold-300/40 shadow-sm hover:shadow-luxury hover:border-gold-500 transition-all duration-300 flex flex-col text-center"
              >
                {/* Category Image */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-boutique-100">
                  <img
                    src={cat.image || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=400&q=80'}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-burgundy-950/90 via-burgundy-950/30 to-transparent group-hover:from-burgundy-950 transition-colors" />
                  
                  {/* Top Badge */}
                  {cat.productCount > 0 && (
                    <span className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-gold-300 text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full border border-gold-500/30">
                      {cat.productCount} Designs
                    </span>
                  )}

                  {/* Name on Image */}
                  <div className="absolute inset-x-2 bottom-3 text-center space-y-0.5">
                    <h3 className="font-serif font-bold text-xs sm:text-sm text-white drop-shadow group-hover:text-gold-200 transition-colors leading-tight">
                      {cat.name}
                    </h3>
                    <span className="text-[10px] text-gold-300 block font-medium">
                      {hindiSub}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
};
