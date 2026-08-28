import React, { useState } from 'react';
import { useBoutique } from '../context/BoutiqueContext';
import confetti from 'canvas-confetti';
import { MapPin, Phone, MessageCircle, Mail, Clock, Send, CheckCircle2, Scissors, Navigation, ExternalLink } from 'lucide-react';
import { Youtube, Instagram } from '../components/Icons';

export const ContactPage = () => {
  const { settings, openWhatsApp } = useBoutique();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('कस्टम सिलाई / सूट ऑर्डर');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const boutiqueAddress = settings.fullAddress || '748Q+R37, Mahendergarh - Budeen Rd, Mohlla Khatikan, Mahendragarh, Haryana 123029';
  const googleMapsUrl = settings.googleMapsUrl || 'https://www.google.com/maps/search/?api=1&query=748Q%2BR37,+Mahendergarh+-+Budeen+Rd,+Mohlla+Khatikan,+Mahendragarh,+Haryana+123029';
  const googleMapsEmbedUrl = settings.googleMapsEmbedUrl || 'https://maps.google.com/maps?q=748Q%2BR37,+Mahendergarh+-+Budeen+Rd,+Mohlla+Khatikan,+Mahendragarh,+Haryana+123029&t=&z=16&ie=UTF8&iwloc=&output=embed';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      alert('कृपया अपना नाम और मोबाइल नंबर दर्ज करें।');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          productName: `Contact Form: ${subject}`,
          message: message.trim(),
          type: 'general_inquiry',
        }),
      });

      const data = await res.json();
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch (e) {}

      setSubmitted(true);

      if (data.whatsappUrl) {
        setTimeout(() => {
          window.open(data.whatsappUrl, '_blank', 'noopener,noreferrer');
        }, 1200);
      }
    } catch (err) {
      console.error('Error submitting contact inquiry:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-gold-700 bg-gold-100 px-3.5 py-1 rounded-full inline-block border border-gold-300">
          🌸 संपर्क व दुकान का पता
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-burgundy-950">
          रीना शर्मा बुटीक, महेंद्रगढ़ (हरियाणा)
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-muted">
          दुकान पर पधारें या सीधे WhatsApp पर नाप व ऑर्डर भेजें।
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Contact Cards */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-luxury border-2 border-gold-300/50 space-y-6">
            <h3 className="font-serif font-bold text-xl text-burgundy-950 border-b border-gold-200 pb-3">
              दुकान की पूरी जानकारी
            </h3>

            <div className="space-y-4 text-xs sm:text-sm text-charcoal-soft">
              
              {/* Exact Location */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-burgundy-50 text-burgundy-900 border border-gold-300 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-burgundy-900" />
                </div>
                <div>
                  <span className="font-bold text-charcoal block">Boutique Address (दुकान का पता)</span>
                  <p className="text-charcoal-soft font-medium leading-relaxed mt-0.5">
                    {boutiqueAddress}
                  </p>
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-burgundy-900 font-bold text-xs mt-1.5 hover:underline"
                  >
                    <Navigation className="w-3.5 h-3.5 text-gold-600" />
                    <span>Google Maps पर लोकेशन देखें →</span>
                  </a>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5 text-[#25D366]" />
                </div>
                <div>
                  <span className="font-bold text-charcoal block">WhatsApp Direct Order & Fitting</span>
                  <button
                    onClick={() => openWhatsApp()}
                    className="text-emerald-700 font-bold hover:underline block text-sm font-mono mt-0.5"
                  >
                    +{settings.whatsappNumber || '919812345678'} (Click to Chat)
                  </button>
                  <span className="text-[11px] text-charcoal-muted">तुरंत सिलाई व डिज़ाइन्स की जानकारी के लिए</span>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-burgundy-50 text-burgundy-900 border border-gold-300 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-burgundy-900" />
                </div>
                <div>
                  <span className="font-bold text-charcoal block">Phone Number (कॉलिंग नंबर)</span>
                  <a href={`tel:${settings.phoneNumber}`} className="hover:text-burgundy-900 font-mono font-medium text-sm">
                    {settings.phoneNumber || '+91 98123 45678'}
                  </a>
                </div>
              </div>

              {/* Timings */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-burgundy-50 text-burgundy-900 border border-gold-300 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-burgundy-900" />
                </div>
                <div>
                  <span className="font-bold text-charcoal block">Boutique Timings (खुलने का समय)</span>
                  <span className="text-charcoal-muted">
                    {settings.storeTimings || 'सोमवार – शनिवार: 10:00 AM – 8:30 PM | रविवार: अपॉइंटमेंट अनुसार'}
                  </span>
                </div>
              </div>

              {/* YouTube */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center shrink-0">
                  <Youtube className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-charcoal block">YouTube Channel</span>
                  <a
                    href={settings.youtubeUrl || 'https://www.youtube.com/@Rehan09-wtr'}
                    target="_blank"
                    rel="noreferrer"
                    className="text-red-600 hover:underline font-bold"
                  >
                    @Rehan09-wtr
                  </a>
                </div>
              </div>

            </div>

            <button
              onClick={() => openWhatsApp({ customMessage: 'राम राम रीना जी! मुझे आपके बुटीक के एड्रेस व सिलाई के बारे में जानकारी चाहिए।' })}
              className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
            >
              <MessageCircle className="w-5 h-5" />
              <span>WhatsApp पर बात करें</span>
            </button>
          </div>

        </div>

        {/* Right Column: Contact & Fitting Consultation Form */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-luxury border-2 border-gold-300/50">
            
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="font-serif font-bold text-2xl text-burgundy-950">
                  धन्यवाद, {name} जी!
                </h3>
                <p className="text-xs sm:text-sm text-charcoal-muted max-w-sm mx-auto">
                  आपका मैसेज प्राप्त हो गया है। हम आपको WhatsApp पर तुरंत रिप्लाई कर रहे हैं।
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="bg-burgundy-900 text-gold-200 px-6 py-2 rounded-xl text-xs font-semibold"
                >
                  दूसरा मैसेज भेजें
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="border-b border-gold-200 pb-3">
                  <h3 className="font-serif font-bold text-xl text-burgundy-950">
                    सिलाई या ऑर्डर के लिए मैसेज भेजें
                  </h3>
                  <p className="text-xs text-charcoal-muted mt-0.5">
                    अपनी जानकारी भरें और रीना शर्मा से सीधी सलाह पाएं।
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-charcoal mb-1">
                      आपका नाम <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="उदा. पूजा शर्मा"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-boutique-300 focus:ring-2 focus:ring-burgundy-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-charcoal mb-1">
                      WhatsApp नंबर <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="उदा. 9812345678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-boutique-300 focus:ring-2 focus:ring-burgundy-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">
                    किस काम के लिए संपर्क कर रहे हैं?
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-boutique-300 focus:ring-2 focus:ring-burgundy-900 focus:outline-none bg-white font-medium"
                  >
                    <option>कस्टम सिलाई / सूट ऑर्डर</option>
                    <option>ब्राइडल लहंगा बुकिंग</option>
                    <option>पैडेड डिजाइनर ब्लाउज सिलाई</option>
                    <option>फर्शी सलवार / शरारा सूट</option>
                    <option>दुकान पर आने का समय</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">
                    आपका सवाल या डिजाइन विवरण
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="ड्रेस का नाम, रंग, फैब्रिक या सिलाई की जरूरत के बारे में लिखें..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full p-3 text-xs sm:text-sm rounded-xl border border-boutique-300 focus:ring-2 focus:ring-burgundy-900 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-burgundy-900 hover:bg-burgundy-950 text-gold-200 py-3.5 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'भेज रहे हैं...' : 'मैसेज भेजें व WhatsApp पर जुड़ें'}</span>
                </button>
              </form>
            )}

          </div>
        </div>

      </div>

      {/* Interactive Google Map Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-luxury border-2 border-gold-300/50 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gold-200 pb-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-gold-700">
              <MapPin className="w-4 h-4 text-burgundy-900" />
              <span>Google Maps लाइव लोकेशन</span>
            </div>
            <h3 className="font-serif font-bold text-lg sm:text-xl text-burgundy-950 mt-0.5">
              Reena Sharma Boutique, Mahendragarh
            </h3>
            <p className="text-xs text-charcoal-muted mt-0.5">
              {boutiqueAddress}
            </p>
          </div>

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-burgundy-900 hover:bg-burgundy-950 text-gold-200 text-xs font-bold px-5 py-2.5 rounded-xl shadow transition-transform active:scale-95 shrink-0"
          >
            <Navigation className="w-4 h-4 text-gold-300" />
            <span>दिशा-निर्देश (Get Directions)</span>
            <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
          </a>
        </div>

        {/* Live Interactive Google Map Embed */}
        <div className="w-full h-80 sm:h-96 rounded-2xl overflow-hidden shadow-inner border-2 border-gold-200 bg-boutique-100 relative">
          <iframe
            title="Reena Sharma Boutique Location Map"
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
      </div>

    </div>
  );
};
