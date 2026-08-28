import React, { useState } from 'react';
import { useBoutique } from '../context/BoutiqueContext';
import confetti from 'canvas-confetti';
import { X, MessageCircle, Sparkles, CheckCircle2, Scissors, Phone, User, Mail, FileText } from 'lucide-react';

export const EnquiryModal = () => {
  const { enquiryProduct, setEnquiryProduct, settings, formatPrice } = useBoutique();

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!enquiryProduct) return null;

  const product = enquiryProduct;
  const isCustomOnly = !product.id || product.categorySlug === 'custom-designer-outfits';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim()) {
      alert('Please provide your name and WhatsApp phone number.');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        customerName: customerName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        productId: product.id || null,
        productName: product.name || 'Custom Boutique Consultation',
        productSku: product.sku || 'N/A',
        productPrice: product.salePrice || product.originalPrice || null,
        size: selectedSize || (product.sizes?.[0] || 'Standard Fit'),
        color: selectedColor || (product.colors?.[0] || 'Standard Color'),
        message: message.trim(),
        type: isCustomOnly ? 'custom_stitching' : 'product_order',
      };

      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      // Trigger Confetti!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#58111A', '#D4AF37', '#25D366', '#FFFFFF'],
        });
      } catch (e) {}

      setSubmitted(true);

      // Open WhatsApp in new tab after 1 second
      if (data.whatsappUrl) {
        setTimeout(() => {
          window.open(data.whatsappUrl, '_blank', 'noopener,noreferrer');
        }, 1000);
      }
    } catch (err) {
      console.error('Enquiry submission error:', err);
      alert('Failed to submit enquiry. You can also chat directly on WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  const closeModal = () => {
    setEnquiryProduct(null);
    setSubmitted(false);
    setCustomerName('');
    setPhone('');
    setEmail('');
    setSelectedSize('');
    setSelectedColor('');
    setMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-gold-500/20 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-burgundy-950 via-burgundy-900 to-burgundy-950 text-white p-5 flex items-center justify-between border-b border-gold-400/20">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gold-500/20 border border-gold-400/30 flex items-center justify-center text-gold-300">
              <Scissors className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-gold-200 leading-tight">
                {isCustomOnly ? 'Custom Fitting & Tailoring Enquiry' : 'Order & Enquiry via WhatsApp'}
              </h3>
              <p className="text-xs text-boutique-300">
                {settings.boutiqueName || 'Reena Sharma Boutique'} • Mahendragarh
              </p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="p-2 rounded-full text-boutique-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {submitted ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="font-serif font-bold text-xl text-burgundy-950">
                Thank You, {customerName}!
              </h4>
              <p className="text-sm text-charcoal-muted max-w-sm mx-auto">
                Your enquiry for <span className="font-semibold text-charcoal">{product.name}</span> has been received. We are opening WhatsApp to continue your custom consultation!
              </p>
              <div className="pt-4 flex flex-col gap-2">
                <button
                  onClick={closeModal}
                  className="bg-burgundy-900 text-gold-200 py-2.5 px-6 rounded-xl font-semibold text-sm hover:bg-burgundy-950 transition-colors"
                >
                  Back to Catalog
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Product Preview Card */}
              {product.name && (
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-boutique-50 border border-boutique-200">
                  {product.images?.[0] && (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-xl border border-boutique-300"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] uppercase font-bold text-gold-700 tracking-wider block">
                      {product.category || 'Boutique Collection'}
                    </span>
                    <h5 className="font-serif font-bold text-sm text-burgundy-950 truncate">
                      {product.name}
                    </h5>
                    {(product.salePrice || product.originalPrice) && (
                      <span className="font-bold text-xs text-burgundy-900">
                        {formatPrice(product.salePrice || product.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Customer Name */}
              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">
                  Your Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-boutique-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pooja Sharma"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-boutique-300 focus:ring-2 focus:ring-burgundy-900 focus:outline-none"
                  />
                </div>
              </div>

              {/* Phone / WhatsApp */}
              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">
                  WhatsApp Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-boutique-400" />
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9812345678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-boutique-300 focus:ring-2 focus:ring-burgundy-900 focus:outline-none"
                  />
                </div>
              </div>

              {/* Size Selector */}
              {Array.isArray(product.sizes) && product.sizes.length > 0 && (
                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">Select Size</label>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((s, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setSelectedSize(s)}
                        className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                          selectedSize === s
                            ? 'bg-burgundy-900 text-gold-200 border-burgundy-900 shadow-sm'
                            : 'bg-white text-charcoal border-boutique-300 hover:border-burgundy-900'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selector */}
              {Array.isArray(product.colors) && product.colors.length > 0 && (
                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">Preferred Color</label>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((c, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setSelectedColor(c)}
                        className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                          selectedColor === c
                            ? 'bg-burgundy-900 text-gold-200 border-burgundy-900 shadow-sm'
                            : 'bg-white text-charcoal border-boutique-300 hover:border-burgundy-900'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Custom Message / Notes */}
              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">
                  Customization Details or Question
                </label>
                <textarea
                  rows={3}
                  placeholder="Need custom neck design, special latkans, urgent delivery, or fitting appointment in Mahendragarh?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3 text-sm rounded-xl border border-boutique-300 focus:ring-2 focus:ring-burgundy-900 focus:outline-none"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 disabled:opacity-50"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>{submitting ? 'Connecting...' : 'Send Enquiry & Open WhatsApp'}</span>
                </button>
                <p className="text-[11px] text-center text-charcoal-muted mt-2">
                  🔒 Your details are saved securely and our boutique team will respond on WhatsApp immediately.
                </p>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
