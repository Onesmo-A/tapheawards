import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface GalleryCardProps {
  title: string;
  icon: React.ReactNode;
  imageSrc?: string;
  onClick?: () => void;
  className?: string;
}

export default function GalleryCard({ title, icon, imageSrc, onClick, className }: GalleryCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Mouse inputs relative to card center
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 120, damping: 22 };

  // Generate tilt angle translations (tilt limit around 12deg)
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [12, -12]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-12, 12]), springConfig);

  // Generate background parallax translation shifts
  const bgTranslateX = useSpring(useTransform(x, [-0.5, 0.5], [12, -12]), springConfig);
  const bgTranslateY = useSpring(useTransform(y, [-0.5, 0.5], [12, -12]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    // Calculate normalized value from -0.5 to 0.5
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    x.set(mouseX / width);
    y.set(mouseY / height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      className={`gallery-card relative rounded-3xl overflow-hidden glass-panel glass-panel-hover flex flex-col justify-between p-5 cursor-pointer select-none group border border-white/5 shadow-2xl ${className || 'h-52'}`}
    >
      {/* Background image container for smooth parallax offset */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none rounded-3xl" style={{ transform: 'translateZ(-20px)' }}>
        <motion.div
          style={{
            x: bgTranslateX,
            y: bgTranslateY,
            scale: 1.18,
          }}
          className="absolute inset-0 w-full h-full transition-all duration-200"
        >
          {imageSrc ? (
            <img 
              src={imageSrc} 
              alt={title} 
              className="w-full h-full object-cover filter brightness-[0.75] contrast-[1.05] group-hover:brightness-95 transition-all duration-300" 
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-black via-[#0c0c0c] to-[#3a0808]" />
          )}
        </motion.div>
        
        {/* Shadow & Red Ambient Glow Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-65" />
        <div className="absolute inset-0 bg-red-glow opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/5 group-hover:ring-[#A81C1C]/25 transition-colors duration-300" />
      </div>

      {/* Card Foreground Content */}
      <div className="relative z-10 flex flex-col justify-between h-full w-full pointer-events-none" style={{ transform: 'translateZ(30px)' }}>
        {/* Top left corner: Icon box */}
        <div className="w-10 h-10 rounded-full bg-black/50 border border-white/10 flex items-center justify-center text-[#ff3333] shadow-md group-hover:bg-[#A81C1C]/25 group-hover:border-[#ff3333]/30 transition-all duration-300">
          {icon}
        </div>

        {/* Bottom edge: Title & Arrow indicator */}
        <div className="flex items-end justify-between w-full">
          <h3 className="font-outfit font-black text-xs md:text-sm tracking-wider text-white max-w-[85%] uppercase leading-tight group-hover:text-[#D90429] transition-colors duration-300 whitespace-pre-line">
            {title}
          </h3>
          <div className="w-7 h-7 rounded-full border border-[#D90429]/40 flex items-center justify-center text-white bg-black/40 group-hover:border-[#D90429] group-hover:bg-[#D90429]/20 transition-all duration-300 scale-95 group-hover:scale-100 shrink-0">
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

