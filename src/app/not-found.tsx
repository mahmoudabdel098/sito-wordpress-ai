'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Home } from 'lucide-react';
import Magnetic from '@/components/Magnetic';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <h1 className="text-[15vw] font-syne font-black text-white/5 leading-none select-none">
          404
        </h1>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          <h2 className="text-3xl lg:text-5xl font-syne font-black text-white uppercase tracking-tighter">
            Lost in the digital void.
          </h2>
          <p className="text-white/40 font-bold max-w-md text-lg">
            The page you are looking for has been moved or doesn't exist in this dimension.
          </p>
        </div>
      </motion.div>

      <div className="flex gap-6 mt-12">
        <Magnetic>
          <Link 
            href="/" 
            className="px-8 py-4 bg-accent-lime text-black rounded-full font-black uppercase text-sm flex items-center gap-3 hover:scale-105 transition-all"
          >
            <Home size={18} /> BACK TO REALITY
          </Link>
        </Magnetic>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent-lime/10 rounded-full blur-[100px] pointer-events-none" />
    </div>
  );
}
