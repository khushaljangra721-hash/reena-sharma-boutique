import React from 'react';
import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';

export const TermsPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-2 border-b border-boutique-200 pb-6">
        <span className="text-xs font-bold uppercase tracking-widest text-gold-700">Terms of Business</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-burgundy-950 flex items-center justify-center gap-2">
          <FileText className="w-8 h-8 text-gold-600" />
          <span>Terms & Conditions</span>
        </h1>
        <p className="text-xs text-charcoal-muted">Reena Sharma Boutique, Mahendragarh, Haryana</p>
      </div>

      <div className="prose prose-sm max-w-none text-charcoal-soft space-y-6 text-xs sm:text-sm leading-relaxed bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-boutique-200">
        <h3 className="font-serif text-lg font-bold text-burgundy-950">1. Product Descriptions & Photography</h3>
        <p>
          We take immense pride in crafting genuine, high-quality garments. Since boutique items are handcrafted with artisan handwork (zardozi, gota patti, aari, sequence), subtle variations in weave, texture, and embroidery alignment are natural characteristics of bespoke craftsmanship.
        </p>

        <h3 className="font-serif text-lg font-bold text-burgundy-950">2. Custom Stitching & Measurements</h3>
        <p>
          For custom-tailored suits, bridal lehengas, and blouses, customers provide body measurements either in person at our Mahendragarh showroom or via our WhatsApp measurement guide. We include generous internal seam margins for easy future adjustments.
        </p>

        <h3 className="font-serif text-lg font-bold text-burgundy-950">3. Orders & WhatsApp Confirmations</h3>
        <p>
          An order is deemed confirmed once the design specifications, size, and advance token or full payment are acknowledged on official WhatsApp channels.
        </p>

        <h3 className="font-serif text-lg font-bold text-burgundy-950">4. Shipping & Delivery</h3>
        <p>
          Ready-to-ship garments are dispatched within 24–48 hours. Custom stitched outfits take between 4 to 18 working days depending on embroidery complexity. Tracking numbers are shared on WhatsApp upon dispatch.
        </p>

        <h3 className="font-serif text-lg font-bold text-burgundy-950">5. Alteration Support</h3>
        <p>
          We offer complimentary fitting adjustments if you visit our store or return the parcel within 7 days of receipt in unworn condition.
        </p>
      </div>
    </div>
  );
};
