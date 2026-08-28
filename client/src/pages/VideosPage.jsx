import React, { useState, useEffect } from 'react';
import { useBoutique } from '../context/BoutiqueContext';
import { Play, ExternalLink, Sparkles, X, MessageCircle } from 'lucide-react';
import { Youtube } from '../components/Icons';

export const VideosPage = () => {
  const { settings, openWhatsApp } = useBoutique();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeVideoModal, setActiveVideoModal] = useState(null);

  useEffect(() => {
    fetch('/api/videos?activeOnly=true')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.videos) {
          setVideos(data.videos);
        }
      })
      .catch((err) => console.error('Error loading videos:', err))
      .finally(() => setLoading(false));

    window.scrollTo(0, 0);
  }, []);

  const channelUrl = settings.youtubeUrl || 'https://www.youtube.com/@Rehan09-wtr';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-red-950 via-burgundy-950 to-red-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-red-500/20 text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-red-600/30 text-red-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-red-500/40">
          <Youtube className="w-4 h-4 fill-red-500 text-red-500" />
          <span>YouTube Channel: @Rehan09-wtr</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-white">
          Watch Our Latest Designs & Stitching Tutorials
        </h1>

        <p className="text-xs sm:text-sm text-boutique-200 max-w-xl mx-auto leading-relaxed">
          Explore behind-the-scenes cutting techniques, neck design patterns, bridal blouse latkan tutorials, and customer dress fitting reveals.
        </p>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
          <a
            href="https://www.youtube.com/@Rehan09-wtr?sub_confirmation=1"
            target="_blank"
            rel="noreferrer"
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3.5 rounded-full text-xs sm:text-sm shadow-xl transition-all hover:scale-105 flex items-center gap-2"
          >
            <Youtube className="w-5 h-5" />
            <span>Subscribe on YouTube (@Rehan09-wtr)</span>
          </a>
          <a
            href={channelUrl}
            target="_blank"
            rel="noreferrer"
            className="border border-white/30 hover:bg-white/10 text-white font-semibold px-6 py-3.5 rounded-full text-xs sm:text-sm backdrop-blur-sm transition-colors flex items-center gap-1.5"
          >
            <span>Open YouTube Channel</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Videos Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-serif text-sm font-semibold text-charcoal-muted">
            Loading boutique videos...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((vid) => (
            <div
              key={vid.id}
              className="group bg-white rounded-3xl overflow-hidden border border-boutique-200 shadow-luxury hover:shadow-2xl hover:border-red-400 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Thumbnail */}
              <div
                onClick={() => setActiveVideoModal(vid)}
                className="relative aspect-video w-full overflow-hidden bg-black cursor-pointer"
              >
                <img
                  src={vid.thumbnail || `https://img.youtube.com/vi/${vid.videoId}/hqdefault.jpg`}
                  alt={vid.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                />
                
                <span className="absolute top-3 left-3 bg-black/80 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1">
                  <Youtube className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                  {vid.type === 'short' ? 'YouTube Short' : 'Full Video'}
                </span>

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 fill-white ml-0.5" />
                  </div>
                </div>
              </div>

              {/* Title & Action */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <h3
                  onClick={() => setActiveVideoModal(vid)}
                  className="font-serif font-bold text-base text-burgundy-950 group-hover:text-red-600 transition-colors leading-snug cursor-pointer"
                >
                  {vid.title}
                </h3>

                <div className="pt-3 border-t border-boutique-100 flex items-center justify-between">
                  <span className="text-xs text-charcoal-muted">Channel: @Rehan09-wtr</span>
                  <button
                    onClick={() => openWhatsApp({ customMessage: `Hello Reena Sharma Boutique! I watched your YouTube design video: "${vid.title}". Can you stitch this for me?` })}
                    className="text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Order Design</span>
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Video Lightbox Modal */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl bg-charcoal-soft rounded-3xl overflow-hidden shadow-2xl border border-gold-500/20">
            <button
              onClick={() => setActiveVideoModal(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/70 hover:bg-black text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="aspect-video w-full bg-black">
              {activeVideoModal.videoId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${activeVideoModal.videoId}?autoplay=1`}
                  title={activeVideoModal.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center text-white space-y-3">
                  <Youtube className="w-16 h-16 text-red-600" />
                  <h4 className="font-serif font-bold text-lg">{activeVideoModal.title}</h4>
                  <a
                    href={activeVideoModal.youtubeUrl || channelUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-red-600 text-white font-bold px-6 py-2.5 rounded-full text-sm"
                  >
                    Watch on YouTube
                  </a>
                </div>
              )}
            </div>

            <div className="p-4 bg-charcoal text-white flex items-center justify-between">
              <span className="text-sm font-semibold truncate pr-4">{activeVideoModal.title}</span>
              <button
                onClick={() => {
                  const title = activeVideoModal.title;
                  setActiveVideoModal(null);
                  openWhatsApp({ customMessage: `Hello Reena Sharma Boutique! I watched your YouTube video: "${title}". Can you give me pricing and details to stitch this?` });
                }}
                className="bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold px-4 py-2 rounded-xl shrink-0 flex items-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Inquire on WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
