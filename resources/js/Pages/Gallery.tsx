import React, { useState } from 'react';
import { Award, Image as ImageIcon, Sparkles, Star, Camera, X, ZoomIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const galleryPhotos = [
  { title: 'TAPHE Gala Banquet 2025', image: '/images/about-us.webp', type: 'gala' },
  { title: 'Excellence Summit Panel', image: '/images/about-us2.webp', type: 'summits' },
  { title: 'Charity Marathon Run', image: '/images/marathon-promo.webp', type: 'marathon' },
  { title: 'Board Evaluation Meeting', image: '/images/sponsorship-promo.webp', type: 'summits' },
  { title: 'Gala Banquet Arena', image: '/images/ticket-bg.webp', type: 'gala' },
  { title: 'TAPHE Awards Ceremony', image: '/images/past_winners.webp', type: 'gala' }
];

export default function Gallery() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'gala' | 'summits' | 'marathon'>('all');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const filteredPhotos = galleryPhotos.filter(photo => 
    activeFilter === 'all' || photo.type === activeFilter
  );

  return (
    <div className="min-h-screen bg-[#030303] text-white selection:bg-[#D90429] selection:text-white bg-mesh pt-24 pb-20">
      
      {/* Ambient glowing spotlight background */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#D90429]/10 rounded-full blur-[100px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-6 md:px-16 relative z-10 space-y-16">
        
        {/* Header Title & Stats */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
          <div className="text-left space-y-4 max-w-2xl">
            <span className="text-[10px] font-black text-[#D90429] uppercase tracking-widest font-outfit">Visual archives</span>
            <h1 className="text-5xl md:text-7xl font-outfit font-black tracking-tight uppercase leading-none text-white text-shadow-glow">
              Visual <br />
              <span className="text-red-gradient">Moments</span>
            </h1>
            <p className="text-xs md:text-sm text-white/50 leading-relaxed font-light font-inter max-w-xl">
              Glimpses of premium celebrations, corporate summits, and charity races in support of health excellence.
            </p>
          </div>

          {/* Stats cards top right */}
          <div className="grid grid-cols-3 gap-4 w-full lg:w-auto shrink-0 lg:mt-4">
            <div className="p-4 px-6 rounded-2xl glass-panel bg-white/[0.01] border border-white/5 text-left space-y-1">
              <span className="text-[8px] font-black uppercase text-white/40 tracking-wider">Moments</span>
              <div className="text-lg font-black text-[#D90429] font-outfit">120+</div>
              <p className="text-[9px] text-white/50 leading-tight">Photos</p>
            </div>
            <div className="p-4 px-6 rounded-2xl glass-panel bg-white/[0.01] border border-[#D90429]/20 text-left space-y-1 shadow-[0_0_15px_rgba(217,4,41,0.05)]">
              <span className="text-[8px] font-black uppercase text-white/40 tracking-wider">Events</span>
              <div className="text-lg font-black text-[#D90429] font-outfit">14</div>
              <p className="text-[9px] text-white/50 leading-tight">Sessions</p>
            </div>
            <div className="p-4 px-6 rounded-2xl glass-panel bg-white/[0.01] border border-white/5 text-left space-y-1">
              <span className="text-[8px] font-black uppercase text-white/40 tracking-wider">Quality</span>
              <div className="text-lg font-black text-[#D90429] font-outfit">4K</div>
              <p className="text-[9px] text-white/50 leading-tight">UHD Specs</p>
            </div>
          </div>
        </div>

        {/* Filters Toolbar */}
        <div className="flex flex-wrap gap-2 p-4 bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-xl justify-start items-center">
          {(['all', 'gala', 'summits', 'marathon'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 border ${
                activeFilter === filter
                  ? 'bg-[#D90429] border-[#D90429]/20 text-white shadow-lg shadow-[#D90429]/10'
                  : 'bg-white/5 border-white/5 text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              {filter === 'all' ? 'All categories' : filter === 'gala' ? 'Gala Banquet' : filter === 'summits' ? 'Summits & Panels' : 'Charity Marathon'}
            </button>
          ))}
        </div>

        {/* Masonry Layout grid of images */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          <AnimatePresence mode="popLayout">
            {filteredPhotos.map((photo, idx) => (
              <motion.div
                layout
                key={photo.image}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                onClick={() => setLightboxImage(photo.image)}
                className="relative overflow-hidden rounded-3xl glass-panel border border-white/5 cursor-pointer break-inside-avoid group block"
              >
                <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex flex-col justify-between p-6">
                  <div className="flex justify-end">
                    <div className="p-2 bg-black/40 border border-white/15 rounded-xl text-white">
                      <ZoomIn className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-left space-y-1">
                    <span className="text-[8px] font-black uppercase text-[#D90429] tracking-wider">TAPHE Moment</span>
                    <h3 className="text-xs font-black uppercase text-white leading-tight">{photo.title}</h3>
                  </div>
                </div>
                <img 
                  src={photo.image} 
                  alt={photo.title} 
                  className="w-full h-auto object-cover rounded-3xl transition-transform duration-500 scale-100 group-hover:scale-105"
                  loading="lazy"
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>

      {/* LIGHTBOX OVERLAY */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md cursor-zoom-out"
          >
            <button 
              onClick={() => setLightboxImage(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 border border-white/10 text-white hover:bg-white/20 transition-all z-50 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <motion.img 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.5 }}
              src={lightboxImage} 
              alt="High resolution gallery highlight" 
              className="max-w-full max-h-[85vh] rounded-3xl object-contain shadow-2xl border border-white/10"
            />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
