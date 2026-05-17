'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { ArrowUpRight, Globe, Layout, ShoppingBag, Video, ExternalLink, Sparkles } from 'lucide-react';
import Magnetic from '@/components/Magnetic';
import Header from '@/components/Header';

const projects = [
  {
    id: "01",
    title: "I BOSSI",
    subtitle: "Real Estate Portal",
    category: "Web Development",
    color: "bg-blue-600",
    darkText: false,
    icon: <Globe className="w-12 h-12 text-white" />,
    url: "https://ibossi.it/",
    description: "Online portal for Immobiliare Bossi, a historic real estate agency in Varese."
  },
  {
    id: "02",
    title: "ACHROME",
    subtitle: "Lifestyle Brand",
    category: "Design & Identity",
    color: "bg-[#d1d9cf]",
    darkText: true,
    icon: <Layout className="w-12 h-12 text-black" />,
    url: "https://achromeofficial.com/",
    description: "Official portal of Achrome, promoting a minimalist lifestyle."
  },
  {
    id: "03",
    title: "GIGLIO",
    subtitle: "Tigrato Fashion",
    category: "E-commerce",
    color: "bg-[#1a1a1a]",
    darkText: false,
    icon: <ShoppingBag className="w-12 h-12 text-white" />,
    url: "https://gigliotigrato.com/",
    description: "A Milan-based upcycling fashion brand promoting unique clothing."
  },
  {
    id: "04",
    title: "ZODA",
    subtitle: "Shotz Editing",
    category: "Platform Dev",
    color: "bg-white",
    darkText: true,
    icon: <Video className="w-12 h-12 text-black" />,
    url: "https://zodashotz.com/",
    description: "Platform specializing in video editing resources."
  },
  {
    id: "05",
    title: "ALESSIA LAZZARETTO",
    subtitle: "Architecture & Design",
    category: "Architecture",
    color: "bg-[#0f172a]",
    darkText: false,
    icon: <ExternalLink className="w-12 h-12 text-white" />,
    url: "https://alessialazzaretto.com/",
    description: "High-end architecture and interior design for international elite clients."
  },
  {
    id: "06",
    title: "GIOVANNI ARIONI",
    subtitle: "Videomaker & Motion Designer",
    category: "Motion Design",
    color: "bg-[#1a1a1b]",
    darkText: false,
    icon: <Sparkles className="w-12 h-12 text-white" />,
    url: "https://giovanniarioni.com/",
    description: "End-to-end video production and high-end motion graphics for premium brands."
  }
];

export default function Portfolio() {
  const targetRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [activeProject, setActiveProject] = useState(0);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", isMobile ? "0%" : "-88%"]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (isMobile) return;
    // Total items: Intro (1) + Projects (6) + Final (1) = 8
    const totalItems = projects.length + 2; 
    const step = Math.floor(latest * totalItems);
    const clampedStep = Math.min(Math.max(step, 0), totalItems - 1);
    setActiveProject(clampedStep);
  });

  return (
    <div className="relative bg-black min-h-screen">
      <div className="fixed top-0 left-0 w-full z-[100] px-4 sm:px-6 lg:px-16 py-4 sm:py-6 lg:py-16 pointer-events-none">
        <div className="pointer-events-auto">
          <Header inverted={true} />
        </div>
      </div>

      <section ref={targetRef} className="relative bg-black h-auto pb-40 lg:h-[800vh]">
        <div className="relative pt-24 lg:sticky lg:top-0 lg:h-screen lg:flex lg:items-center lg:pt-20 lg:overflow-hidden">
          <motion.div 
            style={isMobile ? undefined : { x }} 
            className="flex flex-col items-center gap-5 lg:flex-row lg:items-stretch lg:gap-16 px-6 lg:px-16 max-lg:!transform-none"
          >
            {/* Intro Card */}
            <div className="w-[85vw] lg:w-[700px] h-[55vh] lg:h-[72vh] flex flex-col justify-center gap-6 lg:gap-8 p-8 lg:p-20 rounded-[40px] lg:rounded-[60px] bg-white/5 border border-white/10 shrink-0">
               <span className="text-label text-accent-lime">OUR WORK</span>
               <h1 className="text-4xl sm:text-5xl lg:text-8xl font-syne font-black text-white leading-[0.85] uppercase tracking-tighter">
                 THE<br/>GALLERY.
               </h1>
               <p className="text-white/40 max-w-[280px] lg:max-w-sm text-lg lg:text-xl font-bold leading-tight">
                 A selection of digital masterpieces crafted for the elite.
               </p>
               <div className="flex items-center gap-4 mt-4 lg:mt-8">
                  <div className="w-12 lg:w-16 h-[2px] bg-accent-lime shadow-[0_0_10px_rgba(204,255,0,0.5)]" />
                  <span className="text-[9px] lg:text-[10px] font-black text-white uppercase tracking-[0.4em] lg:tracking-[0.5em]">Scroll to explore</span>
               </div>
            </div>

            {/* Project Cards */}
            {projects.map((project, index) => (
              <div 
                key={project.id} 
                className={`w-[85vw] lg:w-[75vw] h-[55vh] lg:h-[72vh] rounded-[40px] lg:rounded-[60px] overflow-hidden shrink-0 relative group p-6 sm:p-8 lg:p-16 flex flex-col justify-between ${project.color}`}
              >
                <div className="flex justify-between items-start relative z-10">
                   <div className="flex flex-col gap-2">
                      <span className={`text-label ${project.darkText ? 'text-black/40' : 'text-white/40'}`}>
                        {project.category}
                      </span>
                      <h2 className={`text-3xl sm:text-4xl lg:text-7xl font-syne font-black tracking-tighter uppercase leading-tight lg:leading-none ${project.darkText ? 'text-black' : 'text-white'} max-w-[80%]`}>
                        {project.title}
                      </h2>
                   </div>
                   <Magnetic>
                     <Link href={project.url} target="_blank" className={`w-14 h-14 sm:w-16 lg:w-24 lg:h-24 rounded-full flex items-center justify-center border transition-all ${project.darkText ? 'bg-black text-white border-black' : 'bg-white/10 backdrop-blur-md text-white border-white/20 hover:bg-white hover:text-black'}`}>
                        <ArrowUpRight className="w-6 h-6 sm:w-8 lg:w-10 lg:h-10" />
                     </Link>
                   </Magnetic>
                </div>

                <div className="flex items-center justify-center py-4 lg:py-6 relative z-10">
                   {/* Zero-JS static icon for Mobile to prevent scroll stutter */}
                   <div className="lg:hidden p-6 sm:p-8 bg-white/10 rounded-full border border-white/10 flex items-center justify-center">
                      {React.cloneElement(project.icon as React.ReactElement, { className: 'w-8 h-8 text-current' })}
                   </div>
                   {/* Animated icon for Desktop */}
                   <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, margin: "100px" }}
                    className="hidden lg:flex p-16 bg-white/10 rounded-full border border-white/10 backdrop-blur-xl"
                   >
                      {React.cloneElement(project.icon as React.ReactElement, { className: 'w-12 h-12 text-current' })}
                   </motion.div>
                </div>

                <div className="flex justify-between items-end border-t border-black/10 pt-4 lg:pt-8 relative z-10">
                   <div className="max-w-md lg:max-w-xl">
                      <p className={`text-base sm:text-lg lg:text-2xl font-bold font-syne leading-tight ${project.darkText ? 'text-black/60' : 'text-white/60'}`}>
                        {project.description}
                      </p>
                   </div>
                   <div className="flex flex-col items-end">
                      <span className={`text-[8px] lg:text-[10px] font-black uppercase tracking-widest mb-1 ${project.darkText ? 'text-black/20' : 'text-white/20'}`}>Case Study</span>
                      <span className={`text-2xl sm:text-3xl lg:text-5xl font-black ${project.darkText ? 'text-black' : 'text-white'}`}>NO.{project.id}</span>
                   </div>
                </div>

                {/* Decorative background number */}
                <div className={`absolute -bottom-10 -right-10 text-[20vw] font-black opacity-5 leading-none pointer-events-none ${project.darkText ? 'text-black' : 'text-white'}`}>
                   {project.id}
                </div>
              </div>
            ))}

            {/* Final Contact Card */}
            <div className="w-[85vw] lg:w-[700px] h-[55vh] lg:h-[75vh] flex flex-col justify-center items-center gap-8 lg:gap-12 p-8 sm:p-10 lg:p-20 rounded-[40px] lg:rounded-[60px] bg-accent-lime shrink-0 text-center shadow-[0_0_100px_rgba(204,255,0,0.2)]">
               <h2 className="text-3xl sm:text-4xl lg:text-6xl font-syne font-black text-black leading-[0.85] uppercase tracking-tighter">
                 READY FOR<br/>THE NEXT<br/>LEVEL?
               </h2>
               <Magnetic>
                 <Link href="/contact" className="px-8 sm:px-10 lg:px-16 py-5 sm:py-6 lg:py-8 bg-black text-white rounded-full font-black uppercase text-lg sm:text-xl lg:text-2xl hover:scale-105 transition-all shadow-2xl">
                   LET'S TALK
                 </Link>
               </Magnetic>
            </div>
          </motion.div>
        </div>
      </section>

      {/* REFINED Progress Indicator */}
      <div className="fixed bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-[100] hidden lg:flex items-center gap-4 lg:gap-8 px-6 lg:px-10 py-3 lg:py-5 bg-black/80 backdrop-blur-2xl rounded-full border border-white/10 shadow-2xl w-auto max-w-[90vw] lg:min-w-[500px]">
         <div className="hidden sm:flex flex-col items-start min-w-[100px] lg:min-w-[120px]">
            <span className="text-[7px] lg:text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">Current Section</span>
            <span className="text-[10px] lg:text-sm font-black text-accent-lime uppercase truncate max-w-[80px] lg:max-w-[150px]">
               {activeProject === 0 ? "Intro" : activeProject > projects.length ? "Finish" : projects[activeProject-1].title}
            </span>
         </div>

         <div className="flex-1 flex items-center gap-4 min-w-[100px] lg:min-w-[200px]">
            <div className="w-full h-[2px] lg:h-[4px] bg-white/10 relative overflow-hidden rounded-full">
               <motion.div 
                 className="absolute inset-y-0 left-0 bg-accent-lime shadow-[0_0_15px_rgba(204,255,0,0.8)]"
                 style={{ scaleX: scrollYProgress, transformOrigin: "0%" }}
               />
            </div>
         </div>

         <div className="flex items-center gap-2">
            <span className="text-sm lg:text-lg font-black text-white">
               {activeProject === 0 ? "00" : activeProject > projects.length ? "END" : `0${activeProject}`}
            </span>
            <span className="text-[9px] lg:text-[10px] font-black text-white/20">/ 06</span>
         </div>
      </div>

      {/* Local SEO & AEO markers for Portfolio */}
      <section className="sr-only" aria-hidden="true">
        <h2>Progetti Web realizzati a Milano - Link2Digital</h2>
        <p>
          Il nostro portfolio include lo sviluppo di siti web professionali a Milano per settori diversi: 
          immobiliare, fashion, lifestyle e architettura. Ogni progetto è ottimizzato per garantire la 
          massima visibilità locale e internazionale, posizionando Link2Digital come l'agenzia web di riferimento 
          per il mercato milanese e globale.
        </p>
      </section>
    </div>
  );
}

