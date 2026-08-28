import React from 'react';
import { Scissors, Crown, MessageCircle, Truck } from 'lucide-react';

export const BrandTrustBadges = () => {
  const trustPillars = [
    {
      icon: Scissors,
      title: 'मास्टर कटिंग व 100% फिटिंग',
      subtitle: 'Bespoke Tailoring',
      desc: 'आर्महोल में बिना किसी झोल के आपके सही नाप से सिलाई।',
      badgeColor: 'bg-burgundy-50 text-burgundy-900 border-burgundy-200',
    },
    {
      icon: Crown,
      title: 'हरियाणवी व ट्रेंडी डिजाइन्स',
      subtitle: 'Desi Vibe & Modern Cut',
      desc: 'फर्शी सलवार, हैवी गोटा-पत्ती व पैडेड डिजाइनर ब्लाउज।',
      badgeColor: 'bg-gold-50 text-gold-900 border-gold-300',
    },
    {
      icon: MessageCircle,
      title: 'सीधा WhatsApp पर नाप व ऑर्डर',
      subtitle: 'Personal Assistance',
      desc: 'मनपसंद फोटो भेजें, रीना शर्मा से सीधी बात करें।',
      badgeColor: 'bg-emerald-50 text-emerald-900 border-emerald-200',
    },
    {
      icon: Truck,
      title: 'महेंद्रगढ़ व पूरे भारत में डिलीवरी',
      subtitle: 'Pan-India Dispatch',
      desc: 'हरियाणा, दिल्ली-NCR और पूरे देश में सुरक्षित पार्सल।',
      badgeColor: 'bg-amber-50 text-amber-900 border-amber-200',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-gold-300/50 shadow-luxury">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-gold-100">
          {trustPillars.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className={`flex items-start gap-4 ${index !== 0 ? 'sm:pl-6 pt-4 sm:pt-0' : ''}`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${item.badgeColor} shadow-sm`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-gold-700 block">
                    {item.subtitle}
                  </span>
                  <h4 className="font-serif font-bold text-sm sm:text-base text-burgundy-950 leading-tight">
                    {item.title}
                  </h4>
                  <p className="text-xs text-charcoal-muted leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
