'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Artificial progress for the feel
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoading(false), 500);
          return 100;
        }
        return prev + 5; // Faster for less frustration
      });
    }, 40);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="preloader"
          className="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.6, ease: "circOut" }}
          style={{ zIndex: 9999999 }}
        >
          <div className="flex flex-col items-center gap-12 text-center px-10 w-full">
            <motion.div 
              className="flex items-center gap-4 text-white font-syne font-black text-3xl lg:text-4xl tracking-tighter"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="w-6 h-6 lg:w-8 lg:h-8 bg-blue-500 rounded-full" />
              LINK2DIGITAL
            </motion.div>
            
            <div className="flex flex-col items-center gap-4 w-full max-w-[280px] lg:max-w-[320px]">
              <div className="w-full h-[2px] bg-white/10 relative overflow-hidden rounded-full">
                <motion.div 
                  className="absolute inset-y-0 left-0 bg-accent-lime"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.6em]">
                {progress}%
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
