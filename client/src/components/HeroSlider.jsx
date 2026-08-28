import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useBoutique } from '../context/BoutiqueContext';
import { ChevronLeft, ChevronRight, MessageCircle, Sparkles, Crown, Scissors } from 'lucide-react';

export const HeroSlider = () => {
  const { openWhatsApp } = useBoutique();
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch('/api/banners?activeOnly=true')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.banners?.length > 0) {
          setBanners(data.banners);
        }
      })
      .catch((err) => console.error('Error fetching banners:', err));
  }, []);

  // Default fallback banners if none loaded
  const displayBanners = banners.length > 0 ? banners : [
    {
      id: 'default_1',
      title: 'Modern Designs. Haryanvi Styles.',
      subtitle: 'फर्शी सलवार सूट, पैडेड साड़ी ब्लाउज, लहंगे व स्पेशल सिलाई',
      highlight: '🌸 महेंद्रगढ़ (हरियाणा) • YouTube @Rehan09-wtr',
      image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1800&q=85',
      ctaText: 'कलेक्शन देखें',
      ctaLink: '/shop',
      badge: 'यूट्यूब @Rehan09-wtr ट्रेंड्स',
    },
    {
      id: 'default_2',
      title: 'Farshi Salwar & Sharara Suits',
      subtitle: 'हैवी गोटा-पत्ती योक वर्क, प्योर जॉर्जेट व 100% परफेक्ट फिटिंग',
      highlight: '📲 सीधे WhatsApp पर नाप दें या ऑर्डर करें',
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1800&q=85',
      ctaText: 'Suits Collection',
      ctaLink: '/category/suits',
      badge: 'हरियाणा स्पेशल',
    }
  ];

  // Auto rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayBanners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [displayBanners.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? displayBanners.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % displayBanners.length);
  };

  const current = displayBanners[currentIndex];

  return (
    <section className="relative w-full overflow-hidden bg-burgundy-950 min-h-[520px] sm:min-h-[600px] lg:min-h-[660px] flex items-center">
      {/* Background Slides */}
      {displayBanners.map((banner, index) => (
        <div
          key={banner.id || index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          {/* Background Image with Dark Vignette */}
          <img
            src={banner.image}
            alt={banner.title}
            className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-7000 ease-out"
          />
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-burgundy-950/95 via-burgundy-950/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-burgundy-950 via-transparent to-burgundy-950/40" />
        </div>
      ))}

      {/* Slide Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-2xl text-white space-y-6">
          
          {/* Badge */}
          {current.badge && (
            <div className="inline-flex items-center gap-2 bg-gold-500/20 border border-gold-400/40 text-gold-300 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-md shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              <span>{current.badge}</span>
            </div>
          )}

          {/* Heading */}
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight drop-shadow-md">
            {current.title}
          </h1>

          {/* Subtitle & Highlight */}
          <div className="space-y-2">
            <p className="text-base sm:text-xl text-gold-200 font-light leading-relaxed">
              {current.subtitle}
            </p>
            {current.highlight && (
              <p className="text-xs sm:text-sm text-boutique-300 font-medium tracking-wide">
                📍 {current.highlight}
              </p>
            )}
          </div>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-wrap items-center gap-3 sm:gap-4">
            <Link
              to={current.ctaLink || '/shop'}
              className="bg-gold-gradient text-burgundy-950 hover:opacity-95 font-bold px-6 sm:px-8 py-3.5 rounded-full text-sm sm:text-base shadow-xl transition-all hover:scale-105 flex items-center gap-2"
            >
              <span>{current.ctaText || 'Explore Collection'}</span>
              <Sparkles className="w-4 h-4" />
            </Link>

            <button
              onClick={() => openWhatsApp()}
              className="bg-[#25D366] hover:bg-[#20ba59] text-white font-bold px-6 sm:px-8 py-3.5 rounded-full text-sm sm:text-base shadow-xl transition-all hover:scale-105 flex items-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Order on WhatsApp</span>
            </button>

            <Link
              to="/custom-designs"
              className="border border-gold-400/50 hover:bg-gold-400/10 text-gold-200 font-semibold px-5 py-3.5 rounded-full text-sm sm:text-base backdrop-blur-sm transition-colors flex items-center gap-2"
            >
              <Scissors className="w-4 h-4" />
              <span>Custom Stitching</span>
            </Link>
          </div>

        </div>
      </div>

      {/* Navigation Arrows */}
      {displayBanners.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-burgundy-950/60 hover:bg-burgundy-950 text-gold-300 border border-gold-500/20 backdrop-blur-sm transition-all"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-burgundy-950/60 hover:bg-burgundy-950 text-gold-300 border border-gold-500/20 backdrop-blur-sm transition-all"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Indicator Dots */}
      {displayBanners.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
          {displayBanners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'w-8 bg-gold-400' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};
