'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Instagram, Linkedin, Globe, MapPin, CheckCircle2, Mail, Phone, ExternalLink, ArrowUpRight } from 'lucide-react';
import Header from '@/components/Header';
import Magnetic from '@/components/Magnetic';
import TiltCard from '@/components/TiltCard';

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
    }, 1500);
  };

  return (
    <div className="hero-wrapper">
      <motion.div 
        className="cinematic-screen screen-sage"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Header />

        {/* Contact Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-5 lg:gap-12 !mt-4 lg:!mt-8 relative z-10">
          
          {/* Left: Contact Form Card (Large Bento Item) */}
          <TiltCard className="card card-light !bg-white !p-6 sm:!p-12 !rounded-[32px] sm:!rounded-[50px] shadow-2xl relative overflow-hidden flex flex-col justify-between">
             <AnimatePresence mode="wait">
                {!isSent ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <div className="mb-6 lg:mb-10">
                       <span className="text-label !text-black/30 mb-2 lg:mb-4 block">GET IN TOUCH</span>
                       <h1 className="text-4xl sm:text-5xl lg:text-6xl font-syne font-black text-black leading-[0.9] tracking-tighter uppercase">
                         Send a<br/>transmission.
                       </h1>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 lg:gap-6">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input required type="text" placeholder="FULL NAME" className="w-full bg-black/5 border-none p-4 lg:p-6 rounded-2xl text-black font-black placeholder:text-black/20 outline-none focus:ring-2 ring-accent-lime transition-all" />
                          <input required type="email" placeholder="EMAIL ADDRESS" className="w-full bg-black/5 border-none p-4 lg:p-6 rounded-2xl text-black font-black placeholder:text-black/20 outline-none focus:ring-2 ring-accent-lime transition-all" />
                       </div>
                       <textarea rows={4} placeholder="YOUR MESSAGE..." className="w-full bg-black/5 border-none p-4 lg:p-6 rounded-2xl text-black font-black placeholder:text-black/20 outline-none focus:ring-2 ring-accent-lime transition-all resize-none" />
                       
                       <Magnetic>
                          <button type="submit" disabled={isSubmitting} className="action-pill !w-full justify-center !rounded-2xl !py-5 lg:!py-6 !bg-black !text-white hover:!bg-accent-lime hover:!text-black transition-colors">
                             {isSubmitting ? 'PROCESSING...' : 'SEND MESSAGE'} <Send size={20} />
                          </button>
                       </Magnetic>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-12 lg:py-20 text-center gap-6"
                  >
                     <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-accent-lime flex items-center justify-center text-black">
                        <CheckCircle2 size={32} className="lg:w-10 lg:h-10" />
                     </div>
                     <h2 className="text-3xl lg:text-4xl font-syne font-black text-black uppercase">Mission Success.</h2>
                     <p className="text-black/40 font-bold max-w-xs text-sm">We have received your message. Expect a response within 24 hours.</p>
                     <button onClick={() => setIsSent(false)} className="text-[10px] font-black uppercase tracking-widest hover:underline mt-4">New Message</button>
                  </motion.div>
                )}
             </AnimatePresence>
          </TiltCard>

          {/* Right: Info Stack (Bento Items) - Flattened on mobile with 'contents' */}
          <div className="contents lg:flex lg:flex-col lg:gap-5">
             {/* Studio Card */}
             <div className="card card-dark !bg-black !p-8 sm:!p-10 !rounded-[32px] sm:!rounded-[40px] flex flex-col justify-between min-h-[180px] lg:min-h-[220px]">
                <div className="flex justify-between items-start">
                   <div className="p-3 sm:p-4 bg-white/10 rounded-xl border border-white/10">
                      <MapPin className="text-accent-lime lg:w-6 lg:h-6" size={20} />
                   </div>
                   <span className="text-label text-white/40">Studio</span>
                </div>
                <div>
                   <h3 className="text-xl lg:text-2xl font-syne font-black text-white uppercase tracking-tighter">Milano, Italy</h3>
                   <p className="text-white/40 text-xs sm:text-sm font-bold mt-2">Via Montenapoleone, 12</p>
                </div>
             </div>

             {/* Quick Links Card */}
             <div className="card card-blue !bg-blue-600 !p-8 sm:!p-10 !rounded-[32px] sm:!rounded-[40px] flex flex-col justify-between min-h-[180px] lg:min-h-[220px]">
                <div className="flex justify-between items-start">
                   <div className="p-3 sm:p-4 bg-white/10 rounded-xl border border-white/10">
                      <Mail className="text-white lg:w-6 lg:h-6" size={20} />
                   </div>
                   <span className="text-label text-white/60">Email</span>
                </div>
                <div>
                   <h3 className="text-xl lg:text-2xl font-syne font-black text-white uppercase tracking-tighter break-all">hello@link2digital.it</h3>
                   <div className="flex gap-4 mt-4">
                      <Instagram size={20} className="text-white/40 hover:text-white cursor-pointer transition-colors" />
                      <Linkedin size={20} className="text-white/40 hover:text-white cursor-pointer transition-colors" />
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Bottom Bar Bento Items */}
        <div className="bottom-grid !grid-cols-1 lg:!grid-cols-3 !gap-5 lg:!gap-16 !h-auto !mt-5 lg:!mt-16 !pb-20 lg:!pb-0 relative z-10">
           <div className="p-6 lg:p-8 bg-white rounded-[24px] lg:rounded-[30px] border border-black/5 flex items-center justify-between group cursor-pointer hover:bg-accent-lime transition-all">
              <div className="flex items-center gap-4">
                 <Phone size={20} className="opacity-40" />
                 <span className="text-[10px] lg:text-[11px] font-black uppercase tracking-widest">+39 02 123 4567</span>
              </div>
              <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
           </div>
           <div className="p-6 lg:p-8 bg-white rounded-[24px] lg:rounded-[30px] border border-black/5 flex items-center justify-between group cursor-pointer hover:bg-accent-lime transition-all">
              <div className="flex items-center gap-4">
                 <Globe size={20} className="opacity-40" />
                 <span className="text-[10px] lg:text-[11px] font-black uppercase tracking-widest">link2digital.it</span>
              </div>
              <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
           </div>
           <div className="p-6 lg:p-8 bg-black rounded-[24px] lg:rounded-[30px] flex items-center justify-between group cursor-pointer hover:bg-accent-lime transition-all">
              <div className="flex items-center gap-4">
                 <Instagram size={20} className="text-white/40 group-hover:text-black transition-colors" />
                 <span className="text-[10px] lg:text-[11px] font-black uppercase tracking-widest text-white group-hover:text-black transition-colors">Instagram Feed</span>
              </div>
              <ArrowUpRight size={18} className="text-white/20 group-hover:text-black transition-colors" />
           </div>
        </div>

        {/* Local SEO & Contact Markers */}
        <section className="sr-only" aria-hidden="true">
          <h2>Contatta la nostra Web Agency a Milano</h2>
          <p>
            Vieni a trovarci nel nostro studio a Milano in Via Montenapoleone 12, o scrivici a hello@link2digital.it 
            per una consulenza su sviluppo web Next.js, strategie SEO e branding d'élite. Link2Digital è attiva su tutto 
            il territorio milanese e lombardo.
          </p>
        </section>
      </motion.div>
    </div>
  );
}
