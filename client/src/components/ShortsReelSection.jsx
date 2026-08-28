import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useBoutique } from '../context/BoutiqueContext';
import { Play, ExternalLink, Sparkles, X, MessageCircle, ArrowRight, Eye } from 'lucide-react';
import { Youtube } from './Icons';

export const ShortsReelSection = () => {
  const { settings, openWhatsApp } = useBoutique();
  const [shorts, setShorts] = useState([]);
  const [activeReel, setActiveReel] = useState(null);

  useEffect(() => {
    fetch('/api/videos?activeOnly=true')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.videos) {
          setShorts(data.videos);
        }
      })
      .catch((err) => console.error('Error loading shorts:', err));
  }, []);

  const channelUrl = settings.youtubeUrl || 'https://www.youtube.com/@Rehan09-wtr';

  return (
    <section className="py-12 bg-white border-y border-boutique-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-200 mb-1.5">
              <Youtube className="w-4 h-4 text-red-600" />
              <span>YouTube Shorts @Rehan09-wtr</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-burgundy-950">
              Watch Latest Designs & Stitching Ideas
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-muted mt-0.5">
              Padded blouses, Farshi salwar suits, latkan making and fitting hacks straight from Reena Sharma.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://www.youtube.com/@Rehan09-wtr?sub_confirmation=1"
              target="_blank"
              rel="noreferrer"
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-full shadow transition-all hover:scale-105 flex items-center gap-1.5"
            >
              <Youtube className="w-3.5 h-3.5" />
              <span>Subscribe</span>
            </a>
            <Link
              to="/videos"
              className="text-xs font-bold text-burgundy-900 hover:underline px-2 py-2 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 9:16 Shorts Reels Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {shorts.map((reel) => (
            <div
              key={reel.id}
              className="group relative aspect-[9/16] rounded-2xl overflow-hidden bg-black shadow-md hover:shadow-2xl transition-all duration-300 border border-slate-200 hover:border-red-500 flex flex-col justify-between cursor-pointer"
              onClick={() => setActiveReel(reel)}
            >
              {/* Background Thumbnail */}
              <img
                src={reel.thumbnail || `https://img.youtube.com/vi/${reel.videoId}/hqdefault.jpg`}
                alt={reel.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
              />

              {/* Gradient Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40" />

              {/* Top Pill */}
              <div className="relative z-10 p-2.5 flex items-center justify-between">
                <span className="bg-red-600/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
                  <Youtube className="w-2.5 h-2.5" />
                  Shorts
                </span>
              </div>

              {/* Center Play Pulse */}
              <div className="relative z-10 flex items-center justify-center opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/40 flex items-center justify-center shadow-lg">
                  <Play className="w-4 h-4 fill-white ml-0.5" />
                </div>
              </div>

              {/* Bottom Content & Title */}
              <div className="relative z-10 p-3 space-y-2">
                <span className="text-[10px] font-bold text-gold-300 uppercase tracking-wider block">
                  {reel.category || 'Design Idea'}
                </span>
                <h3 className="text-white font-serif font-bold text-xs line-clamp-2 leading-snug drop-shadow-md">
                  {reel.title}
                </h3>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openWhatsApp({ customMessage: `Hello Reena Sharma Boutique! I watched your YouTube Short: "${reel.title}". Can you give me pricing and details to stitch this?` });
                  }}
                  className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white py-1.5 px-2 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1 shadow transition-transform active:scale-95"
                >
                  <MessageCircle className="w-3 h-3" />
                  <span>Order This</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Full-Screen Shorts / Reel Player Modal */}
      {activeReel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm sm:max-w-md bg-charcoal rounded-3xl overflow-hidden shadow-2xl border border-gold-500/30 flex flex-col max-h-[90vh]">
            
            {/* Close Button */}
            <button
              onClick={() => setActiveReel(null)}
              className="absolute top-3 right-3 z-30 p-2 rounded-full bg-black/70 hover:bg-black text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Video Player */}
            <div className="aspect-[9/16] w-full bg-black relative">
              {activeReel.videoId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${activeReel.videoId}?autoplay=1&rel=0`}
                  title={activeReel.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-white space-y-3">
                  <Youtube className="w-12 h-12 text-red-600" />
                  <h4 className="font-serif font-bold text-sm">{activeReel.title}</h4>
                  <a
                    href={activeReel.youtubeUrl || channelUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-red-600 text-white font-bold px-5 py-2 rounded-full text-xs"
                  >
                    Open on YouTube Shorts
                  </a>
                </div>
              )}
            </div>

            {/* Bottom Meta & WhatsApp Order Action */}
            <div className="p-4 bg-charcoal-soft text-white space-y-3 border-t border-slate-700">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-red-400 font-bold mb-1">
                  <Youtube className="w-3.5 h-3.5" />
                  <span>@Rehan09-wtr • Reena Sharma Boutique</span>
                </div>
                <h4 className="font-serif font-bold text-sm text-white line-clamp-2 leading-snug">
                  {activeReel.title}
                </h4>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const title = activeReel.title;
                    setActiveReel(null);
                    openWhatsApp({ customMessage: `Hello Reena Sharma Boutique! I watched your YouTube Short: "${title}". Can you give me pricing and details to stitch this for me?` });
                  }}
                  className="flex-1 bg-[#25D366] hover:bg-[#20ba59] text-white py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Order on WhatsApp</span>
                </button>
                <a
                  href="https://www.youtube.com/@Rehan09-wtr?sub_confirmation=1"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-2.5 rounded-xl font-bold text-xs shrink-0 flex items-center gap-1"
                >
                  <Youtube className="w-3.5 h-3.5" />
                  <span>Subscribe</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};
