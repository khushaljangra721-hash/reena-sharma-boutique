import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

export const PrivacyPolicyPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-2 border-b border-boutique-200 pb-6">
        <span className="text-xs font-bold uppercase tracking-widest text-gold-700">Legal & Transparency</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-burgundy-950 flex items-center justify-center gap-2">
          <ShieldCheck className="w-8 h-8 text-gold-600" />
          <span>Privacy Policy</span>
        </h1>
        <p className="text-xs text-charcoal-muted">Last Updated: August 2026</p>
      </div>

      <div className="prose prose-sm max-w-none text-charcoal-soft space-y-6 text-xs sm:text-sm leading-relaxed bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-boutique-200">
        <h3 className="font-serif text-lg font-bold text-burgundy-950">1. Information We Collect</h3>
        <p>
          At <strong>Reena Sharma Boutique</strong> (Mahendragarh, Haryana), we respect your privacy. When you place an enquiry or order with us via WhatsApp or our website contact forms, we may collect your name, phone/WhatsApp number, email, body measurements, and design preferences.
        </p>

        <h3 className="font-serif text-lg font-bold text-burgundy-950">2. How We Use Your Information</h3>
        <p>
          We use your information exclusively to:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Communicate with you on WhatsApp regarding product inquiries, fabric availability, and custom tailoring fittings.</li>
          <li>Accurately prepare and dispatch your customized bridal or boutique garments to your delivery address.</li>
          <li>Provide customer support, size alterations, and follow-up consultation.</li>
        </ul>

        <h3 className="font-serif text-lg font-bold text-burgundy-950">3. No Online Card Payments Stored</h3>
        <p>
          Our website operates on a catalog and WhatsApp direct inquiry model. We do not store sensitive credit card or net banking credentials on our web servers. All payment terms (UPI/bank transfer/cash on boutique visit) are coordinated directly with you on official boutique communication channels.
        </p>

        <h3 className="font-serif text-lg font-bold text-burgundy-950">4. Third-Party Sharing</h3>
        <p>
          We never sell, rent, or trade your personal contact details to third-party marketing companies. Details are only shared with trusted courier partners (e.g. DTDC, Delhivery, Speed Post) strictly for delivering your parcel.
        </p>

        <h3 className="font-serif text-lg font-bold text-burgundy-950">5. Contact Us</h3>
        <p>
          If you have any questions regarding your privacy, please visit us at Shop No. 12, Gandhi Chowk Market, Mahendragarh, Haryana 123029 or chat with us on WhatsApp at +91 98123 45678.
        </p>
      </div>
    </div>
  );
};
