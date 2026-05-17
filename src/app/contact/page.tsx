'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Instagram, Globe, MapPin, Mail, Phone, ExternalLink, ArrowUpRight } from 'lucide-react';
import Header from '@/components/Header';
import Magnetic from '@/components/Magnetic';
import TiltCard from '@/components/TiltCard';

export default function Contact() {
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
          
          {/* Left: Contact Form Card (Large Bento Item) -> Replaced with Direct Transmission Card */}
          <TiltCard className="card card-light !bg-white !p-6 sm:!p-12 !rounded-[32px] sm:!rounded-[50px] shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[400px]">
            <div>
              <div className="mb-6 lg:mb-10">
                <span className="text-label !text-black/30 mb-2 lg:mb-4 block">DIRECT CHANNEL</span>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-syne font-black text-black leading-[0.9] tracking-tighter uppercase">
                  Start the<br/>transmission.
                </h1>
              </div>
              
              <p className="text-black/60 text-lg lg:text-xl font-bold leading-snug max-w-xl mb-8">
                No complicated forms or automated pipelines. Connect directly with our team to align your digital vision and set new standards.
              </p>

              <div className="my-6 lg:my-8">
                <Link href="mailto:info@link2digital.com?subject=Transmission%20from%20Link2Digital" className="group block">
                  <span className="text-[9px] font-black text-black/30 block mb-1 tracking-widest uppercase">EMAIL DIRECTLY</span>
                  <span className="text-2xl sm:text-3xl lg:text-4xl font-syne font-black text-black group-hover:text-accent-lime transition-colors block break-all tracking-tight leading-none">
                    INFO@LINK2DIGITAL.COM
                  </span>
                </Link>
              </div>
            </div>

            <div className="mt-4">
              <Magnetic>
                <Link 
                  href="mailto:info@link2digital.com?subject=Transmission%20from%20Link2Digital"
                  className="action-pill !w-full justify-center !rounded-2xl !py-5 lg:!py-6 !bg-black !text-white hover:!bg-accent-lime hover:!text-black transition-colors shadow-xl text-md font-black tracking-wider uppercase inline-flex items-center gap-3"
                >
                  SEND DIRECT EMAIL <Mail size={20} />
                </Link>
              </Magnetic>
            </div>
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
                   <Link href="mailto:info@link2digital.com" className="hover:underline">
                      <h3 className="text-xl lg:text-2xl font-syne font-black text-white uppercase tracking-tighter break-all">info@link2digital.com</h3>
                   </Link>
                   <div className="flex gap-4 mt-4">
                      <Link href="https://www.instagram.com/belink2digital/" target="_blank">
                         <Instagram size={20} className="text-white/40 hover:text-white cursor-pointer transition-colors" />
                      </Link>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Bottom Bar Bento Items */}
        <div className="bottom-grid !grid-cols-1 lg:!grid-cols-3 !gap-5 lg:!gap-16 !h-auto !mt-5 lg:!mt-16 !pb-20 lg:!pb-0 relative z-10">
           <Link href="tel:3291679904" className="p-6 lg:p-8 bg-white rounded-[24px] lg:rounded-[30px] border border-black/5 flex items-center justify-between group hover:bg-accent-lime transition-all">
              <div className="flex items-center gap-4">
                 <Phone size={20} className="opacity-40 text-black" />
                 <span className="text-[10px] lg:text-[11px] font-black uppercase tracking-widest text-black">+39 329 167 9904</span>
              </div>
              <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-black" />
           </Link>
           <Link href="https://www.link2digital.com" target="_blank" className="p-6 lg:p-8 bg-white rounded-[24px] lg:rounded-[30px] border border-black/5 flex items-center justify-between group hover:bg-accent-lime transition-all">
              <div className="flex items-center gap-4">
                 <Globe size={20} className="opacity-40 text-black" />
                 <span className="text-[10px] lg:text-[11px] font-black uppercase tracking-widest text-black">link2digital.com</span>
              </div>
              <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-black" />
           </Link>
           <Link href="https://www.instagram.com/belink2digital/" target="_blank" className="p-6 lg:p-8 bg-black rounded-[24px] lg:rounded-[30px] flex items-center justify-between group hover:bg-accent-lime transition-all">
              <div className="flex items-center gap-4">
                 <Instagram size={20} className="text-white/40 group-hover:text-black transition-colors" />
                 <span className="text-[10px] lg:text-[11px] font-black uppercase tracking-widest text-white group-hover:text-black transition-colors">Instagram Feed</span>
              </div>
              <ArrowUpRight size={18} className="text-white/20 group-hover:text-black transition-colors" />
           </Link>
        </div>

        {/* Local SEO & Contact Markers */}
        <section className="sr-only" aria-hidden="true">
          <h2>Contatta la nostra Web Agency a Milano</h2>
          <p>
            Vieni a trovarci nel nostro studio a Milano in Via Montenapoleone 12, o scrivici a info@link2digital.com 
            o chiamaci al +39 329 167 9904 per una consulenza su sviluppo web Next.js, strategie SEO e branding d'élite.
            Link2Digital è attiva su tutto il territorio milanese e lombardo.
          </p>
        </section>
      </motion.div>
    </div>
  );
}
