import React, { useState } from 'react';
import { useBoutique } from '../context/BoutiqueContext';
import { MessageCircle, X, Sparkles } from 'lucide-react';

export const FloatingWhatsApp = () => {
  const { settings, openWhatsApp } = useBoutique();
  const [showTooltip, setShowTooltip] = useState(true);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
      {/* Floating Teaser Prompt */}
      {showTooltip && (
        <div className="relative bg-white text-charcoal px-4 py-3 rounded-2xl shadow-2xl border border-boutique-200 text-xs max-w-xs animate-in fade-in slide-in-from-bottom-3 duration-300">
          <button
            onClick={() => setShowTooltip(false)}
            className="absolute -top-2 -left-2 bg-charcoal text-white rounded-full p-0.5 hover:bg-black transition-colors"
            aria-label="Close tooltip"
          >
            <X className="w-3 h-3" />
          </button>
          
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-full bg-burgundy-900 text-gold-300 flex items-center justify-center font-bold text-xs shrink-0">
              RS
            </div>
            <div>
              <div className="font-bold text-burgundy-950 flex items-center gap-1">
                <span>{settings.boutiqueName || 'Reena Sharma Boutique'}</span>
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block animate-ping" />
              </div>
              <p className="text-[11px] text-charcoal-muted mt-0.5">
                Need customized stitching or ready dress inquiry? Chat with us directly on WhatsApp!
              </p>
            </div>
          </div>

          <button
            onClick={() => openWhatsApp()}
            className="mt-2.5 w-full bg-[#25D366] hover:bg-[#20ba59] text-white py-1.5 px-3 rounded-xl font-semibold text-[11px] flex items-center justify-center gap-1.5 shadow-sm transition-transform active:scale-95"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Chat on WhatsApp</span>
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => openWhatsApp()}
        className="group relative flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 animate-whatsapp-glow"
        aria-label="Order or Chat on WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />
        
        {/* Pulse Dot */}
        <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-white border-2 border-green-500"></span>
        </span>
      </button>
    </div>
  );
};
