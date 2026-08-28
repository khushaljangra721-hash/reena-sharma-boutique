import React, { useState, useEffect } from 'react';
import { Star, Quote, CheckCircle } from 'lucide-react';

export const TestimonialSection = () => {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    // Default testimonials
    setTestimonials([
      {
        id: '1',
        customerName: 'Pooja Yadav',
        location: 'Mahendragarh, Haryana',
        rating: 5,
        comment: 'Got my bridal lehenga and 3 blouse designs stitched by Reena Sharma Boutique. The fitting was absolutely 100% on point! Everyone at the wedding asked where I got it made. Highly recommended!',
        outfit: 'Royal Crimson Bridal Lehenga & Custom Blouses',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      },
      {
        id: '2',
        customerName: 'Sunita Sharma',
        location: 'Rewari / Gurugram',
        rating: 5,
        comment: 'I ordered the peach sharara suit over WhatsApp. Reena ji was so courteous, sent clear videos of the fabric and dispatched it safely with perfect alterations. Super happy!',
        outfit: 'Pastel Peach Gota Patti Sharara Suit',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      },
      {
        id: '3',
        customerName: 'Anjali Verma',
        location: 'Narnaul, Haryana',
        rating: 5,
        comment: 'Regular customer here! From everyday cotton kurtas to party wear gowns and winter hoodies, the fabric quality and boutique stitching finish is unmatched in this region.',
        outfit: 'Custom Designer Gown & Cotton Sets',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
      },
    ]);
  }, []);

  return (
    <section className="py-16 bg-cream border-y border-boutique-200/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-extrabold uppercase tracking-widest text-gold-700 bg-gold-100/60 px-3 py-1 rounded-full border border-gold-300/40 inline-block mb-3">
            Client Love & Reviews
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-burgundy-950">
            What Our Customers Say
          </h2>
          <p className="text-sm text-charcoal-muted mt-2">
            Real feedback from brides and fashion enthusiasts who trusted Reena Sharma Boutique.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-3xl p-6 sm:p-8 shadow-luxury border border-boutique-200 flex flex-col justify-between relative group hover:border-gold-400 transition-all duration-300"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-gold-300/40" />

              <div className="space-y-4">
                {/* Stars */}
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-xs sm:text-sm text-charcoal-soft leading-relaxed italic">
                  "{t.comment}"
                </p>
              </div>

              {/* Author & Outfit */}
              <div className="pt-6 mt-6 border-t border-boutique-100 flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.customerName}
                  className="w-11 h-11 rounded-full object-cover border-2 border-gold-400"
                />
                <div>
                  <div className="font-serif font-bold text-sm text-burgundy-950 flex items-center gap-1">
                    <span>{t.customerName}</span>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <div className="text-[11px] text-charcoal-muted">{t.location}</div>
                  {t.outfit && (
                    <div className="text-[10px] text-gold-700 font-semibold mt-0.5">
                      👗 {t.outfit}
                    </div>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
