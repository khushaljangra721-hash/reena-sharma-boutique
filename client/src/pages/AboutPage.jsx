import React from 'react';
import { Link } from 'react-router-dom';
import { useBoutique } from '../context/BoutiqueContext';
import { Sparkles, Crown, Scissors, MapPin, Heart, ShieldCheck, CheckCircle2, MessageCircle } from 'lucide-react';

export const AboutPage = () => {
  const { settings, openWhatsApp } = useBoutique();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-gold-700 bg-gold-100 px-3.5 py-1 rounded-full inline-block">
          Our Heritage & Craftsmanship
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-burgundy-950">
          About Reena Sharma Boutique
        </h1>
        <p className="text-sm text-charcoal-muted leading-relaxed">
          Modern Designs. Elegant Styles. Handcrafted with passion in Mahendragarh, Haryana.
        </p>
      </div>

      {/* Story Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-6 space-y-5">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-burgundy-950 leading-tight">
            Where Traditional Indian Artistry Meets Modern Fashion
          </h2>

          <p className="text-xs sm:text-sm text-charcoal-soft leading-relaxed">
            Welcome to <strong>Reena Sharma Boutique</strong> — your premier destination in Mahendragarh, Haryana for exquisite dress designs, cutting & stitching perfection, and high-fashion boutique creations.
          </p>

          <p className="text-xs sm:text-sm text-charcoal-soft leading-relaxed">
            Founded with a deep love for handcrafted Indian textiles and modern aesthetics, our boutique specializes in royal Bridal Lehengas, Designer Saree & Lehenga Blouses, grand Sharara Suits, trendy Co-ord Sets, and custom-tailored outfits crafted to your exact body measurements.
          </p>

          <div className="p-4 rounded-2xl bg-boutique-50 border border-boutique-200 space-y-2">
            <h4 className="font-serif font-bold text-sm text-burgundy-950 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold-600" />
              Our Core Philosophy
            </h4>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              Every woman deserves an outfit that fits like a second skin and makes her feel radiant. We reject mass-produced generic fits in favor of master precision tailoring and authentic hand embroidery.
            </p>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={() => openWhatsApp()}
              className="bg-[#25D366] hover:bg-[#20ba59] text-white font-bold px-6 py-3 rounded-full text-xs sm:text-sm shadow-md flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat with Reena Sharma on WhatsApp</span>
            </button>
            <Link
              to="/contact"
              className="border border-boutique-300 hover:bg-boutique-100 text-charcoal font-semibold px-5 py-3 rounded-full text-xs sm:text-sm transition-colors"
            >
              Visit Our Shop
            </Link>
          </div>
        </div>

        <div className="lg:col-span-6 grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <img
              src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80"
              alt="Bridal Lehenga"
              className="rounded-3xl shadow-luxury object-cover aspect-[3/4] w-full"
            />
            <div className="p-4 bg-white rounded-2xl border border-boutique-200 text-center shadow-sm">
              <span className="text-2xl font-bold font-serif text-burgundy-900 block">500+</span>
              <span className="text-[11px] text-charcoal-muted font-medium">Bridal Outfits Handcrafted</span>
            </div>
          </div>
          <div className="space-y-4 pt-6">
            <div className="p-4 bg-burgundy-950 text-gold-300 rounded-2xl text-center shadow-sm">
              <span className="text-2xl font-bold font-serif block">100%</span>
              <span className="text-[11px] text-boutique-300 font-medium">Custom Fitting Satisfaction</span>
            </div>
            <img
              src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=600&q=80"
              alt="Tailoring"
              className="rounded-3xl shadow-luxury object-cover aspect-[3/4] w-full"
            />
          </div>
        </div>
      </div>

      {/* Services & Specializations */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-boutique-200 shadow-luxury space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-gold-700">What We Do</span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-burgundy-950">
            Our Boutique Specializations
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs text-charcoal-soft">
          <div className="p-5 rounded-2xl bg-boutique-50 border border-boutique-200 space-y-2">
            <h4 className="font-serif font-bold text-sm text-burgundy-950 flex items-center gap-2">
              👑 Royal Bridal Lehengas
            </h4>
            <p className="text-charcoal-muted leading-relaxed">
              Heavy micro-velvet, raw silk, zardozi and sequence embroidery with dual dupattas and full can-can flare.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-boutique-50 border border-boutique-200 space-y-2">
            <h4 className="font-serif font-bold text-sm text-burgundy-950 flex items-center gap-2">
              ✂️ Designer Blouses & Latkans
            </h4>
            <p className="text-charcoal-muted leading-relaxed">
              Maggam work, boat neck, deep back cutouts, heavy handcrafted latkans, and sweetheart blouse patterns.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-boutique-50 border border-boutique-200 space-y-2">
            <h4 className="font-serif font-bold text-sm text-burgundy-950 flex items-center gap-2">
              🌸 Sharara & Lehenga Suits
            </h4>
            <p className="text-charcoal-muted leading-relaxed">
              Tiered flares, gota patti work, georgette peplums, and festive sangeet ensembles.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-boutique-50 border border-boutique-200 space-y-2">
            <h4 className="font-serif font-bold text-sm text-burgundy-950 flex items-center gap-2">
              👗 Modern Co-ord Sets
            </h4>
            <p className="text-charcoal-muted leading-relaxed">
              Digital printed modal satin, high-low tunics, and comfortable two-piece designer sets.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-boutique-50 border border-boutique-200 space-y-2">
            <h4 className="font-serif font-bold text-sm text-burgundy-950 flex items-center gap-2">
              🧥 Winter Hoodies & Velour Tracksuits
            </h4>
            <p className="text-charcoal-muted leading-relaxed">
              Heavyweight 380 GSM fleece hoodies for girls & boys, and plush velour track sets.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-boutique-50 border border-boutique-200 space-y-2">
            <h4 className="font-serif font-bold text-sm text-burgundy-950 flex items-center gap-2">
              🎥 Video Tutorials on YouTube
            </h4>
            <p className="text-charcoal-muted leading-relaxed">
              Watch cutting and stitching tutorials on our YouTube Channel <strong>@Rehan09-wtr</strong>.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
