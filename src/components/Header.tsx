'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Magnetic from '@/components/Magnetic';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header({ inverted = false }: { inverted?: boolean }) {
  const [time, setTime] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const updateTime = () => {
      const milanoTime = new Intl.DateTimeFormat('it-IT', {
        timeZone: 'Europe/Rome',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }).format(new Date());
      setTime(milanoTime);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const textColor = inverted ? 'text-white' : 'text-black';
  const opacityColor = inverted ? 'opacity-40 hover:opacity-100' : 'opacity-30 hover:opacity-100';

  return (
    <header className={`header !mb-4 !flex !items-center !justify-between ${textColor} relative z-[100]`}>
      <div className="flex items-center gap-4 lg:gap-16">
        <Magnetic>
          <Link href="/" className={`logo-pill ${inverted ? '!bg-white !text-black shadow-2xl' : ''}`}>
            <div className={`w-4 h-4 rounded-full ${inverted ? 'bg-blue-600' : 'bg-blue-500'}`} />
            <span className="hidden sm:inline">LINK2DIGITAL</span>
            <span className="sm:hidden">L2D</span>
          </Link>
        </Magnetic>
        
        <div className={`hidden xl:flex flex-col border-l h-8 justify-center pl-8 ${inverted ? 'border-white/10' : 'border-black/5'}`}>
          <span className="text-[7px] uppercase font-bold opacity-30 tracking-widest leading-none mb-1">Local Time</span>
          <span className="text-[10px] font-black font-syne leading-none uppercase">{time} MILANO</span>
        </div>
      </div>
      
      <div className="flex items-center gap-4 lg:gap-12">
        <nav className="nav-links !m-0 !hidden lg:!flex !gap-8">
          <Magnetic>
            <Link href="/" className={`text-[11px] font-bold uppercase tracking-wider transition-opacity ${pathname === '/' ? 'opacity-100' : opacityColor}`}>
              Home
            </Link>
          </Magnetic>
          <Magnetic>
            <Link href="/portfolio" className={`text-[11px] font-bold uppercase tracking-wider transition-opacity ${pathname === '/portfolio' ? 'opacity-100' : opacityColor}`}>
              Portfolio
            </Link>
          </Magnetic>
          <Magnetic>
            <Link href="/contact" className={`text-[11px] font-bold uppercase tracking-wider transition-opacity ${pathname === '/contact' ? 'opacity-100' : opacityColor}`}>
              Contact
            </Link>
          </Magnetic>
        </nav>
        
        <div className="flex items-center gap-4">
          <Magnetic>
            <Link href="/contact" className="download-btn !static !m-0 !hidden sm:!block !bg-accent-lime !text-black shadow-[0_0_30px_rgba(204,255,0,0.3)]">
              Let's Talk
            </Link>
          </Magnetic>

          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`lg:hidden p-2 rounded-full ${inverted ? 'bg-white/10 text-white' : 'bg-black/5 text-black'}`}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`absolute top-full left-0 right-0 mt-2 p-8 flex flex-col gap-6 lg:hidden border shadow-2xl rounded-[32px] ${inverted ? 'bg-white text-black border-white/10' : 'bg-black text-white border-black/10'}`}
          >
            <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-2xl font-syne font-black uppercase tracking-tighter">Home</Link>
            <Link href="/portfolio" onClick={() => setIsMenuOpen(false)} className="text-2xl font-syne font-black uppercase tracking-tighter">Portfolio</Link>
            <Link href="/contact" onClick={() => setIsMenuOpen(false)} className="text-2xl font-syne font-black uppercase tracking-tighter">Contact</Link>
            <Link href="/contact" onClick={() => setIsMenuOpen(false)} className="action-pill !m-0 !w-full !text-center !bg-accent-lime !text-black shadow-[0_10px_30px_rgba(204,255,0,0.3)]">Let's Talk</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
