import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useBoutique } from '../context/BoutiqueContext';
import { HeroSlider } from '../components/HeroSlider';
import { CategoryCarousel } from '../components/CategoryCarousel';
import { ShortsReelSection } from '../components/ShortsReelSection';
import { ProductCard } from '../components/ProductCard';
import { BrandTrustBadges } from '../components/BrandTrustBadges';
import { TestimonialSection } from '../components/TestimonialSection';
import {
  Sparkles,
  Crown,
  Tag,
  ArrowRight,
  MessageCircle,
  Scissors,
  CheckCircle2,
  PhoneCall,
  MapPin,
  Navigation,
  Clock,
  Phone,
  ExternalLink
} from 'lucide-react';
import { Youtube } from '../components/Icons';

export const HomePage = () => {
  const { settings, openWhatsApp, formatPrice } = useBoutique();

  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [activeOffers, setActiveOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  const boutiqueAddress = settings.fullAddress || '748Q+R37, Mahendergarh - Budeen Rd, Mohlla Khatikan, Mahendragarh, Haryana 123029';
  const googleMapsUrl = settings.googleMapsUrl || 'https://www.google.com/maps/search/?api=1&query=748Q%2BR37,+Mahendergarh+-+Budeen+Rd,+Mohlla+Khatikan,+Mahendragarh,+Haryana+123029';
  const googleMapsEmbedUrl = settings.googleMapsEmbedUrl || 'https://maps.google.com/maps?q=748Q%2BR37,+Mahendergarh+-+Budeen+Rd,+Mohlla+Khatikan,+Mahendragarh,+Haryana+123029&t=&z=16&ie=UTF8&iwloc=&output=embed';

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [featRes, trendRes, offersRes] = await Promise.all([
          fetch('/api/products?featured=true&limit=6').then((r) => r.json()),
          fetch('/api/products?trending=true&limit=6').then((r) => r.json()),
          fetch('/api/offers?activeOnly=true').then((r) => r.json()),
        ]);

        if (featRes.success) setFeaturedProducts(featRes.products || []);
        if (trendRes.success) setTrendingProducts(trendRes.products || []);
        if (offersRes.success) setActiveOffers(offersRes.offers || []);
      } catch (err) {
        console.error('Error fetching homepage products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div className="space-y-10 sm:space-y-14 pb-14">
      
      {/* 1. Hero Slider */}
      <HeroSlider />

      {/* 2. Haryanvi Heritage Banner Ribbon */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-burgundy-950 via-burgundy-900 to-burgundy-950 text-white rounded-3xl p-5 sm:p-7 shadow-xl border-2 border-gold-400/50 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 bg-gold-400 text-burgundy-950 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider">
              <span>🌾 म्हारा हरियाणवी बुटीक</span>
            </div>
            <h3 className="font-serif text-lg sm:text-2xl font-bold text-gold-200">
              सिलाई ऐसी कि फिटिंग में 1 नंबर!
            </h3>
            <p className="text-xs text-boutique-200">
              फर्शी सलवार, दामन स्टाइल सूट, चुनरी, पैडेड ब्लाउज व ब्राइडल लहंगे — रीना शर्मा (महेंद्रगढ़)।
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => openWhatsApp({ customMessage: 'राम राम रीना जी! मुझे आपके बुटीक के नए डिज़ाइन्स व सिलाई के बारे में जानकारी चाहिए।' })}
              className="bg-[#25D366] hover:bg-[#20ba59] text-white font-bold px-5 py-2.5 rounded-full text-xs sm:text-sm shadow-md flex items-center gap-1.5 transition-transform active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp पर बात करें</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3. Shop by Category (6 Core Collections) */}
      <CategoryCarousel />

      {/* 4. Real YouTube Shorts from @Rehan09-wtr */}
      <ShortsReelSection />

      {/* 5. Active Offers & Flash Deals */}
      {activeOffers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-burgundy-950 via-burgundy-900 to-burgundy-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border-2 border-gold-400/40">
            <div className="space-y-2 text-center md:text-left max-w-xl">
              <span className="inline-flex items-center gap-1 bg-gold-400/20 text-gold-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-gold-400/30">
                <Tag className="w-3.5 h-3.5" />
                <span>त्योहार व शादी स्पेशल डिस्काउंट</span>
              </span>
              <h3 className="font-serif text-xl sm:text-3xl font-bold text-white">
                {activeOffers[0].title}
              </h3>
              <p className="text-xs text-boutique-200">
                {activeOffers[0].subtitle || 'सूट्स, लहंगे व स्पेशल सिलाई पर खास छूट।'}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                to="/offers"
                className="bg-gold-gradient text-burgundy-950 font-bold px-5 py-2.5 rounded-full text-xs sm:text-sm shadow"
              >
                ऑफर देखें
              </Link>
              <button
                onClick={() => openWhatsApp({ customMessage: `राम राम जी! मुझे यह ऑफर क्लेम करना है: "${activeOffers[0].title}".` })}
                className="bg-[#25D366] hover:bg-[#20ba59] text-white font-bold px-5 py-2.5 rounded-full text-xs sm:text-sm shadow flex items-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp पर छूट पाएं</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 6. Featured Outfits Grid (2 Cols on Phone, 3 on Desktop) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-gold-700 bg-gold-100/80 px-2.5 py-0.5 rounded-full border border-gold-300 mb-1">
              <span>🌸 बेस्ट सेलिंग कलेक्शन</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-burgundy-950">
              Featured Boutique Designs (ट्रेंडिंग कपड़े)
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs sm:text-sm font-bold text-burgundy-900 hover:text-burgundy-700 flex items-center gap-1 hover:underline"
          >
            <span>सभी देखें</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 2 Cols Mobile, 3 Cols Desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 7. Custom Stitching Studio Card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-cream rounded-3xl p-6 sm:p-10 border-2 border-gold-300/80 shadow-luxury flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-gold-700 bg-gold-100 px-3 py-1 rounded-full border border-gold-300">
              <Scissors className="w-3.5 h-3.5 text-gold-600" />
              <span>मास्टर टेलरिंग स्टूडियो • महेंद्रगढ़</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-burgundy-950 leading-tight">
              कोई भी फोटो या डिजाइन भेजें, हम आपके सही नाप से सिलेंगे!
            </h3>
            <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
              ब्लाउज डिजाइन, फर्शी सलवार, पाकिस्तानी सूट या यूट्यूब की कोई भी फोटो WhatsApp पर भेजें। हमारे मास्टर कटर 100% परफेक्ट फिटिंग की गारंटी देते हैं।
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <button
                onClick={() => openWhatsApp({ customMessage: 'राम राम रीना जी! मेरे पास एक ड्रेस की फोटो है जो मुझे आपके बुटीक से सिलवानी है।' })}
                className="bg-[#25D366] hover:bg-[#20ba59] text-white font-bold px-6 py-3 rounded-full text-xs sm:text-sm shadow-md flex items-center gap-2 transition-transform active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp पर फोटो भेजें</span>
              </button>
              <Link
                to="/custom-designs"
                className="bg-burgundy-900 text-gold-200 font-bold px-5 py-3 rounded-full text-xs sm:text-sm shadow-md hover:bg-burgundy-950 transition-colors"
              >
                सिलाई डिटेल्स देखें
              </Link>
            </div>
          </div>

          <div className="w-full lg:w-96 rounded-2xl overflow-hidden shadow-xl border-2 border-gold-400/60 aspect-[4/3]">
            <img
              src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80"
              alt="Boutique Blouse Tailoring"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 8. Brand Trust Pillars */}
      <BrandTrustBadges />

      {/* 9. Pinned Store Location & Live Interactive Google Map */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-luxury border-2 border-gold-400/60 space-y-6">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gold-200 pb-5">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 bg-gold-100 text-gold-800 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border border-gold-300">
                <MapPin className="w-3.5 h-3.5 text-burgundy-900" />
                <span>दुकान का पता व लाइव मैप लोकेशन</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-burgundy-950">
                Reena Sharma Boutique — महेंद्रगढ़ (हरियाणा)
              </h2>
              <p className="text-xs sm:text-sm text-charcoal-muted">
                📍 {boutiqueAddress}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="bg-burgundy-900 hover:bg-burgundy-950 text-gold-200 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow flex items-center gap-2 transition-transform active:scale-95"
              >
                <Navigation className="w-4 h-4 text-gold-400" />
                <span>Google Maps दिशा-निर्देश</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => openWhatsApp({ customMessage: `राम राम रीना जी! मुझे आपके बुटीक की लोकेशन चाहिए। Address: ${boutiqueAddress}` })}
                className="bg-[#25D366] hover:bg-[#20ba59] text-white px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow flex items-center gap-1.5 transition-transform active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp पर लोकेशन</span>
              </button>
            </div>
          </div>

          {/* Map + Info Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Live Interactive Pinned Google Map */}
            <div className="lg:col-span-8 w-full h-72 sm:h-96 rounded-2xl overflow-hidden shadow-inner border-2 border-gold-300 bg-boutique-100">
              <iframe
                title="Reena Sharma Boutique Pinned Location Map"
                src={googleMapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />
            </div>

            {/* Store Information Card */}
            <div className="lg:col-span-4 bg-cream rounded-2xl p-5 sm:p-6 border-2 border-gold-300 space-y-4">
              <h3 className="font-serif font-bold text-lg text-burgundy-950 border-b border-gold-200 pb-2">
                दुकान की जानकारी
              </h3>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-gold-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-charcoal block">Plus Code & Area:</span>
                    <span className="text-charcoal-muted leading-tight block">
                      748Q+R37, Mahendergarh - Budeen Rd, Mohlla Khatikan, Mahendragarh
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-gold-700 shrink-0" />
                  <div>
                    <span className="font-bold text-charcoal block">Timing (समय):</span>
                    <span className="text-charcoal-muted">Mon – Sat: 10:00 AM – 8:30 PM</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-gold-700 shrink-0" />
                  <div>
                    <span className="font-bold text-charcoal block">Phone (कॉल करें):</span>
                    <a href={`tel:${settings.phoneNumber || '+919812345678'}`} className="text-burgundy-900 font-bold font-mono hover:underline">
                      {settings.phoneNumber || '+91 98123 45678'}
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-burgundy-900 hover:bg-burgundy-950 text-gold-200 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Open in Google Maps App</span>
                </a>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 10. Verified Customer Reviews */}
      <TestimonialSection />

      {/* 11. Direct WhatsApp Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-emerald-900 text-white rounded-3xl p-6 sm:p-10 text-center shadow-xl space-y-3 border-2 border-emerald-400/40">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold">
            सीधा रीना शर्मा से WhatsApp पर बात करें
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-xl mx-auto">
            तैयार कपड़े ऑर्डर करें, नाप दें या सिलाई के बारे में पूछें। तुरंत पर्सनल जवाब मिलेगा।
          </p>
          <div className="pt-2">
            <button
              onClick={() => openWhatsApp()}
              className="bg-white text-emerald-950 hover:bg-emerald-50 font-bold px-8 py-3.5 rounded-full text-xs sm:text-sm shadow-xl inline-flex items-center gap-2 transition-transform active:scale-95"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>WhatsApp चैट खोलें (+91 98123 45678)</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
