import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth spring physics for outer ring lag effect
  const ringX = useSpring(mouseX, { stiffness: 300, damping: 28 });
  const ringY = useSpring(mouseY, { stiffness: 300, damping: 28 });

  const [hovered, setHovered] = useState(false);
  const [cursorText, setCursorText] = useState('');

  useEffect(() => {
    const moveMouse = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', moveMouse);
    return () => {
      window.removeEventListener('mousemove', moveMouse);
    };
  }, [mouseX, mouseY]);

  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const isInteractive = target.closest('a, button, [role="button"], select, input, textarea');
      const isCard = target.closest('.gallery-card, .nominee-card');

      if (isInteractive) {
        setHovered(true);
        setCursorText('');
      } else if (isCard) {
        setHovered(true);
        setCursorText('VOTE');
      } else {
        setHovered(false);
        setCursorText('');
      }
    };

    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <div className="hidden md:block pointer-events-none fixed inset-0 z-[99999]">
      {/* Center Dot */}
      <motion.div
        className="custom-cursor-dot"
        style={{
          x: mouseX,
          y: mouseY,
        }}
      />
      {/* Outer Spring Ring */}
      <motion.div
        className="custom-cursor-ring flex items-center justify-center font-outfit text-[7px] font-black tracking-widest text-white pointer-events-none"
        animate={{
          scale: hovered ? 1.6 : 1,
          borderColor: hovered ? 'rgba(255, 51, 51, 0.8)' : 'rgba(168, 28, 28, 0.4)',
          backgroundColor: hovered ? 'rgba(168, 28, 28, 0.15)' : 'rgba(0, 0, 0, 0)',
        }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        style={{
          x: ringX,
          y: ringY,
        }}
      >
        {cursorText}
      </motion.div>
    </div>
  );
}
