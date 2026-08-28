import React, { useState, useEffect } from 'react';
import { Play, ExternalLink, Sparkles, X } from 'lucide-react';
import { Youtube } from './Icons';
import { useBoutique } from '../context/BoutiqueContext';

export const YouTubeSection = () => {
  const { settings } = useBoutique();
  const [videos, setVideos] = useState([]);
  const [activeVideoModal, setActiveVideoModal] = useState(null);

  useEffect(() => {
    fetch('/api/videos?activeOnly=true')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.videos?.length > 0) {
          setVideos(data.videos);
        }
      })
      .catch((err) => console.error('Error fetching videos:', err));
  }, []);

  const displayVideos = videos.length > 0 ? videos : [
    {
      id: 'v1',
      title: 'Latest Designer Bridal Lehenga Cutting & Stitching Tutorial',
      youtubeUrl: 'https://www.youtube.com/@Rehan09-wtr',
      videoId: 'dQw4w9WgXcQ',
      thumbnail: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
      type: 'video',
    },
    {
      id: 'v2',
      title: 'Trending Heavy Latkan & Back Neck Blouse Design 2026',
      youtubeUrl: 'https://www.youtube.com/@Rehan09-wtr',
      videoId: '3JZ_D3ELwOQ',
      thumbnail: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80',
      type: 'short',
    },
    {
      id: 'v3',
      title: 'Sharara Suit Cutting & Gota Patti Stitching Ideas',
      youtubeUrl: 'https://www.youtube.com/@Rehan09-wtr',
      videoId: 'L_LUpnjgPso',
      thumbnail: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80',
      type: 'short',
    },
    {
      id: 'v4',
      title: 'New Co-ord Set Stitching & Fitting Hacks at Boutique',
      youtubeUrl: 'https://www.youtube.com/@Rehan09-wtr',
      videoId: 'kJQP7kiw5Fk',
      thumbnail: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
      type: 'short',
    },
  ];

  const channelUrl = settings.youtubeUrl || 'https://www.youtube.com/@Rehan09-wtr';

  return (
    <section className="py-16 bg-white border-b border-boutique-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with YouTube Channel Banner */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-6 border-b border-boutique-100">
          <div>
            <div className="inline-flex items-center gap-1.5 text-red-600 font-bold text-xs uppercase tracking-wider mb-2">
              <Youtube className="w-4 h-4 fill-red-600" />
              <span>Watch Our Latest Designs & Stitching Ideas</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-burgundy-950">
              YouTube Channel: <span className="text-red-600 font-mono text-2xl sm:text-3xl">@Rehan09-wtr</span>
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-muted mt-1">
              Watch real boutique dress fittings, blouse cutting patterns, fabric reviews and behind-the-scenes designs.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://www.youtube.com/@Rehan09-wtr?sub_confirmation=1"
              target="_blank"
              rel="noreferrer"
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-full text-xs sm:text-sm shadow-md transition-all hover:scale-105 flex items-center gap-2"
            >
              <Youtube className="w-4 h-4" />
              <span>Subscribe on YouTube</span>
            </a>
            <a
              href={channelUrl}
              target="_blank"
              rel="noreferrer"
              className="border border-boutique-300 hover:bg-boutique-50 text-charcoal font-semibold px-4 py-2.5 rounded-full text-xs sm:text-sm transition-colors flex items-center gap-1.5"
            >
              <span>Visit Channel</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayVideos.map((video) => (
            <div
              key={video.id}
              className="group bg-boutique-50 rounded-2xl overflow-hidden border border-boutique-200 hover:border-red-500/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              {/* Video Thumbnail */}
              <div
                onClick={() => setActiveVideoModal(video)}
                className="relative aspect-video sm:aspect-[4/3] w-full overflow-hidden bg-black cursor-pointer"
              >
                <img
                  src={video.thumbnail || `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                />

                {/* Badge (Short / Video) */}
                <span className="absolute top-2 left-2 bg-black/75 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                  <Youtube className="w-3 h-3 text-red-500 fill-red-500" />
                  {video.type === 'short' ? 'Shorts Design' : 'Full Video'}
                </span>

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-white ml-0.5" />
                  </div>
                </div>
              </div>

              {/* Video Info */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <h3
                  onClick={() => setActiveVideoModal(video)}
                  className="font-medium text-xs sm:text-sm text-burgundy-950 group-hover:text-red-600 transition-colors line-clamp-2 cursor-pointer font-serif leading-snug"
                >
                  {video.title}
                </h3>

                <div className="pt-3 mt-3 border-t border-boutique-200/60 flex items-center justify-between text-[11px]">
                  <span className="text-charcoal-muted">@Rehan09-wtr</span>
                  <a
                    href={video.youtubeUrl || channelUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-red-600 font-bold hover:underline flex items-center gap-1"
                  >
                    <span>Watch</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Video Modal Player */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl bg-charcoal-soft rounded-3xl overflow-hidden shadow-2xl border border-gold-500/20">
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
                    Open on YouTube Channel
                  </a>
                </div>
              )}
            </div>

            <div className="p-4 bg-charcoal text-white flex items-center justify-between">
              <span className="text-sm font-semibold truncate pr-4">{activeVideoModal.title}</span>
              <a
                href="https://www.youtube.com/@Rehan09-wtr?sub_confirmation=1"
                target="_blank"
                rel="noreferrer"
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-xl shrink-0"
              >
                Subscribe
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
