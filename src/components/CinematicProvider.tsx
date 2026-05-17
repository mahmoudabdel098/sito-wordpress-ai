'use client';

import React, { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function CinematicProvider({ children }: { children: React.ReactNode }) {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [cursorType, setCursorType] = useState<'default' | 'active' | 'tilt'>('default');
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(isTouch);

    const onMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
    };

    const onMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('.card') || target.closest('.tilt-card')) {
        setCursorType('tilt');
      } else if (
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('.action-pill') ||
        target.closest('.magnetic')
      ) {
        setCursorType('active');
      } else {
        setCursorType('default');
      }
    };

    const onMouseLeave = () => {
      setCursorType('default');
    };

    if (!isTouch) {
      window.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseover', onMouseEnter);
      document.addEventListener('mouseout', onMouseLeave);
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseEnter);
      document.removeEventListener('mouseout', onMouseLeave);
    };
  }, []);

  return (
    <>
      {!isTouchDevice && (
        <div 
          ref={cursorRef} 
          className={`custom-cursor ${cursorType !== 'default' ? 'active' : ''}`} 
        >
          {cursorType === 'tilt' && (
            <span className="text-[8px] font-black text-white uppercase tracking-tighter">DRAG</span>
          )}
        </div>
      )}
      
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
