import React, { useState } from 'react';
import { useBoutique } from '../context/BoutiqueContext';
import { Scissors, Sparkles, MessageCircle, Ruler, CheckCircle2, ShieldCheck, Video, HelpCircle } from 'lucide-react';

export const CustomDesignsPage = () => {
  const { openWhatsApp, setEnquiryProduct } = useBoutique();

  const services = [
    {
      title: 'Bridal Lehenga & Gown Stitching',
      desc: 'Complete bridal lehenga stitching with multi-layer can-can, double lining, zardozi work, and matching dupatta borders.',
      time: '10–18 Days',
    },
    {
      title: 'Designer Saree & Lehenga Blouses',
      desc: 'Sweetheart necklines, boat neck, deep back cutouts, sheer back net with moti/latkans, elbow sleeves and padded bust cups.',
      time: '3–6 Days',
    },
    {
      title: 'Sharara & Gharara Suits',
      desc: '3-tier flared shararas, peplum kurtis with gota patti lace, heavy daman border attachment and pure shantoon lining.',
      time: '4–7 Days',
    },
    {
      title: 'Trendy Co-ord Sets & Tunics',
      desc: 'High-low ethnic co-ords, asymmetrical kaftans, jacket suits, and modern western silhouette stitching.',
      time: '3–5 Days',
    },
    {
      title: 'Anarkalis & Heavy Party Wear',
      desc: '32 to 56 kali umbrella cut Anarkalis with floor-touch fall, yoke embroidery alignment, and matching churidar/pants.',
      time: '5–8 Days',
    },
    {
      title: 'Alterations & Fitting Rectification',
      desc: 'Got an ill-fitting outfit from elsewhere? We adjust bust, waist, hips, and sleeve length with perfection.',
      time: '1–2 Days',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      
      {/* Hero */}
      <div className="bg-gradient-to-r from-burgundy-950 via-burgundy-900 to-burgundy-950 text-white rounded-3xl p-8 sm:p-14 shadow-2xl border border-gold-500/20 text-center space-y-5">
        <div className="inline-flex items-center gap-2 bg-gold-500/20 text-gold-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-gold-400/30">
          <Scissors className="w-4 h-4 text-gold-400" />
          <span>Bespoke Boutique Tailoring Studio</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-white leading-tight">
          Custom Dress Designing, Cutting & Stitching
        </h1>

        <p className="text-xs sm:text-base text-boutique-200 max-w-2xl mx-auto leading-relaxed">
          At Reena Sharma Boutique in Mahendragarh, we turn your outfit dreams into reality. Bring any Pinterest or celebrity design photo, or let our master cutters design exclusively for your body silhouette.
        </p>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => openWhatsApp({ customMessage: 'Hello Reena Sharma Boutique! I want to get a custom dress designed & stitched. Here are my requirements:' })}
            className="bg-[#25D366] hover:bg-[#20ba59] text-white font-bold px-8 py-3.5 rounded-full text-xs sm:text-sm shadow-xl flex items-center gap-2 hover:scale-105 transition-transform"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Send Design Photo on WhatsApp</span>
          </button>
          <button
            onClick={() => setEnquiryProduct({ name: 'Bespoke Custom Stitching Consultation', category: 'Custom Designer Outfits' })}
            className="bg-gold-gradient text-burgundy-950 font-bold px-6 py-3.5 rounded-full text-xs sm:text-sm shadow-xl hover:scale-105 transition-transform"
          >
            <span>Book Consultation Form</span>
          </button>
        </div>
      </div>

      {/* How It Works 4-Step Guide */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-gold-700">Simple 4-Step Process</span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-burgundy-950">
            How Custom Stitching Works
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-boutique-200 shadow-sm space-y-3 relative">
            <div className="w-10 h-10 rounded-full bg-burgundy-900 text-gold-300 font-bold flex items-center justify-center text-sm">
              01
            </div>
            <h3 className="font-serif font-bold text-base text-burgundy-950">Share Your Idea / Photo</h3>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              Send us a photo of the blouse, suit, or lehenga you want over WhatsApp, or choose from our boutique catalog.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-boutique-200 shadow-sm space-y-3 relative">
            <div className="w-10 h-10 rounded-full bg-burgundy-900 text-gold-300 font-bold flex items-center justify-center text-sm">
              02
            </div>
            <h3 className="font-serif font-bold text-base text-burgundy-950">Fabric & Measurement</h3>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              Choose from our curated boutique fabrics (Silk, Velvet, Organza, Georgette) or provide your own unstitched fabric.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-boutique-200 shadow-sm space-y-3 relative">
            <div className="w-10 h-10 rounded-full bg-burgundy-900 text-gold-300 font-bold flex items-center justify-center text-sm">
              03
            </div>
            <h3 className="font-serif font-bold text-base text-burgundy-950">Master Tailoring & Zari</h3>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              Our expert tailors cut and stitch with accurate seam allowances, padded lining, interlock finishing and custom latkans.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-boutique-200 shadow-sm space-y-3 relative">
            <div className="w-10 h-10 rounded-full bg-burgundy-900 text-gold-300 font-bold flex items-center justify-center text-sm">
              04
            </div>
            <h3 className="font-serif font-bold text-base text-burgundy-950">Video Preview & Delivery</h3>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              We send HD video preview of your finished outfit. Pickup from Mahendragarh store or get safe doorstep delivery!
            </p>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-gold-700">Services Offered</span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-burgundy-950">
            Boutique Stitching & Tailoring Specializations
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 shadow-luxury border border-boutique-200 hover:border-gold-400 transition-all duration-300 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-gold-700 font-bold">
                  <span className="flex items-center gap-1">
                    <Scissors className="w-3.5 h-3.5" />
                    Boutique Craft
                  </span>
                  <span className="bg-boutique-100 text-charcoal-soft px-2 py-0.5 rounded-full font-medium">
                    {svc.time}
                  </span>
                </div>
                <h3 className="font-serif font-bold text-lg text-burgundy-950">
                  {svc.title}
                </h3>
                <p className="text-xs text-charcoal-muted leading-relaxed">
                  {svc.desc}
                </p>
              </div>

              <button
                onClick={() => openWhatsApp({ customMessage: `Hello Reena Sharma Boutique! I am inquiring about "${svc.title}" service.` })}
                className="w-full bg-burgundy-50 hover:bg-burgundy-100 text-burgundy-950 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5 text-green-600" />
                <span>Inquire for {svc.title}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Measurement Chart helper banner */}
      <div className="bg-cream rounded-3xl p-8 sm:p-12 border border-gold-400/40 shadow-luxury flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gold-700 bg-gold-100 px-3 py-1 rounded-full">
            <Ruler className="w-3.5 h-3.5 text-gold-600" />
            <span>Measurement Support</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-burgundy-950">
            Not Sure How to Measure at Home?
          </h3>
          <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
            Our team will guide you step-by-step on a quick WhatsApp video call to measure your bust, waist, shoulder, armhole, and outfit length accurately!
          </p>
        </div>

        <button
          onClick={() => openWhatsApp({ customMessage: 'Hello Reena Sharma Boutique! Can you please guide me on how to take body measurements for stitching?' })}
          className="bg-[#25D366] hover:bg-[#20ba59] text-white font-bold px-8 py-3.5 rounded-full text-xs sm:text-sm shadow-xl flex items-center gap-2 shrink-0"
        >
          <Video className="w-4 h-4" />
          <span>Request Video Call Guidance</span>
        </button>
      </div>

    </div>
  );
};
