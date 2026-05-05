'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Instagram, Layout, Sparkles, Download, Copy, ArrowRight, ChevronLeft, ChevronRight, Share2, Calendar, Search, Grid, Monitor, Smartphone, Edit3, Check, Maximize2, X, Target, Zap, ShieldCheck, TrendingUp, BookOpen, Layers, Users, AlertCircle, Menu } from 'lucide-react';
import Header from '@/components/Header';
import { industries, generatePosts } from "@/data/socialContent";
import type { Post, Pillar, PostStatus } from "@/data/socialContent";
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { toPng } from 'html-to-image';

interface Slide {
  title: string;
  text: string;
}

const postsData = generatePosts(300);


const getPillarIcon = (pillar: string) => {
  switch(pillar) {
    case 'AUTHORITY': return <ShieldCheck size={14} className="text-[#ccff00]"/>;
    case 'EDUCATIONAL': return <BookOpen size={14} className="text-[#ccff00]"/>;
    case 'PROBLEM_SOLUTION': return <AlertCircle size={14} className="text-[#ccff00]"/>;
    case 'PERSONAL_BRAND': return <Users size={14} className="text-[#ccff00]"/>;
    case 'VIRAL_HOOK': return <Zap size={14} className="text-[#ccff00]"/>;
    default: return <Sparkles size={14} className="text-[#ccff00]"/>;
  }
};

export default function SocialStudioV16() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState(false);
  
  const [posts, setPosts] = useState(postsData);
  
  // Persistence: Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('l2d_social_posts');
    if (saved) {
      try {
        setPosts(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load saved posts", e);
      }
    }
  }, []);

  // Persistence: Save to localStorage when posts change
  useEffect(() => {
    localStorage.setItem('l2d_social_posts', JSON.stringify(posts));
  }, [posts]);

  const [selectedPostIndex, setSelectedPostIndex] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [format, setFormat] = useState('post'); 
  const [isEditing, setIsEditing] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [sidebarView, setSidebarView] = useState('list'); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [exportProgress, setExportProgress] = useState<{ current: number, total: number } | null>(null);
  const [batchPost, setBatchPost] = useState<{ post: Post, sIdx: number } | null>(null);

  const batchRef = useRef<HTMLDivElement>(null);

  const captureSlide = async (post: Post, sIdx: number): Promise<string> => {
    return new Promise((resolve, reject) => {
      setBatchPost({ post, sIdx });
      // Give React time to render
      setTimeout(async () => {
        if (batchRef.current) {
          try {
            const dataUrl = await toPng(batchRef.current, { cacheBust: true, pixelRatio: 2, quality: 0.95 });
            resolve(dataUrl);
          } catch (err) {
            reject(err);
          }
        } else {
          reject("No batch ref");
        }
      }, 100);
    });
  };

  const exportBundle = async () => {
    const readyPosts = posts.filter(p => p.status === 'READY' || p.status === 'PUBLISHED');
    if (readyPosts.length === 0) {
      alert("Nessun post marcato come 'READY' o 'PUBLISHED'.");
      return;
    }

    setExportProgress({ current: 0, total: readyPosts.length });
    const zip = new JSZip();

    try {
      for (let i = 0; i < readyPosts.length; i++) {
        const post = readyPosts[i];
        const postFolder = zip.folder(`Post_${post.id}_${post.pillarName}`);
        
        // Add caption as text file
        postFolder?.file("caption.txt", post.caption);

        // Generate images for each slide
        for (let sIdx = 0; sIdx < post.slides.length; sIdx++) {
           const dataUrl = await captureSlide(post, sIdx);
           const base64Data = dataUrl.split(',')[1];
           postFolder?.file(`slide_${sIdx + 1}.png`, base64Data, { base64: true });
        }
        setExportProgress(prev => prev ? { ...prev, current: i + 1 } : null);
      }
      
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `L2D_SOCIAL_BUNDLE_${new Date().toISOString().split('T')[0]}.zip`);
    } catch (err) {
      console.error(err);
      alert("Errore durante l'esportazione del bundle.");
    } finally {
      setExportProgress(null);
      setBatchPost(null);
    }
  };

  const selectedPost = posts[selectedPostIndex];
  const slideRef = useRef<HTMLDivElement>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (user.toLowerCase() === 'admin' && pass.toLowerCase() === 'admin') {
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  const updatePostText = (slideIndex: number, field: keyof Slide, value: string) => {
    const updatedPosts = [...posts];
    updatedPosts[selectedPostIndex].slides[slideIndex][field] = value;
    setPosts(updatedPosts);
  };

  const updateCaption = (value: string) => {
    const updatedPosts = [...posts];
    updatedPosts[selectedPostIndex].caption = value;
    setPosts(updatedPosts);
  };

  const updatePostStatus = (status: 'DRAFT' | 'READY' | 'PUBLISHED') => {
    const updatedPosts = [...posts];
    updatedPosts[selectedPostIndex].status = status;
    setPosts(updatedPosts);
  };

  const updateStyleVariant = (variant: number) => {
    const updatedPosts = [...posts];
    updatedPosts[selectedPostIndex].styleVariant = variant;
    setPosts(updatedPosts);
  };

  const exportAsImage = async () => {
    try {
      const { toPng } = await import('html-to-image');
      if (slideRef.current) {
        const dataUrl = await toPng(slideRef.current, { cacheBust: true, pixelRatio: 3, quality: 1 });
        const link = document.createElement('a');
        link.download = `L2D-SOCIAL-DAY${selectedPost.id}.png`;
        link.href = dataUrl;
        link.click();
      }
    } catch (err) {
      alert('Esportazione fallita.');
    }
  };

  const renderSlideContent = (post: Post, slideIdx: number, isSmall: boolean = false) => {
    const slide = post.slides[slideIdx];
    const variant = post.styleVariant;
    const titleSize = isSmall ? 'text-2xl' : 'text-[2.6rem]';
    const bodySize = isSmall ? 'text-xs' : 'text-base';

    const CTA = () => (
      <div className={`px-5 py-2 bg-[#ccff00] text-black rounded-full font-black uppercase tracking-widest flex items-center gap-2 shadow-xl mt-4 ${isSmall ? 'text-[7px]' : 'text-[9px]'}`}>
        Get Started <ArrowRight size={isSmall ? 8 : 11}/>
      </div>
    );

    const Branding = () => (
      <div className="flex flex-col mb-4">
          <span className="text-[9px] font-black tracking-[0.4em] uppercase opacity-40 leading-none">L2D STUDIO // {post.industryTag}</span>
          <span className="text-[7px] font-black uppercase opacity-20 mt-1 tracking-tighter">Strategic {post.pillarName.replace('_', ' ')} Framework</span>
      </div>
    );

    const updateSlide = (field: keyof Slide, val: string) => {
      updatePostText(slideIdx, field, val);
    };

    const EditableTitle = ({ text, className }: { text: string, className: string }) => {
      if (!isEditing) return <h3 className={className}>{text}</h3>;
      return (
        <textarea 
          value={text} 
          onChange={(e) => updateSlide('title', e.target.value)}
          className={`${className} bg-white/10 border-b border-[#ccff00] outline-none resize-none w-full`}
          rows={2}
        />
      );
    };

    const EditableText = ({ text, className }: { text: string, className: string }) => {
      if (!isEditing) return <p className={className}>{text}</p>;
      return (
        <textarea 
          value={text} 
          onChange={(e) => updateSlide('text', e.target.value)}
          className={`${className} bg-white/10 border-b border-[#ccff00] outline-none resize-none w-full`}
          rows={3}
        />
      );
    };

    switch(variant) {
      case 1: 
        return (
          <div className="absolute inset-0 flex flex-col">
            <div className="flex-1 bg-[#d1d9cf] p-10 flex flex-col justify-center text-black">
               <EditableTitle text={slide.title} className={`${titleSize} font-syne font-black uppercase leading-[0.85] tracking-tighter`} />
            </div>
            <div className="flex-1 bg-[#1a1a1a] p-10 flex flex-col justify-center text-white relative">
               <EditableText text={slide.text} className={`${bodySize} font-bold opacity-60 leading-snug max-w-[90%]`} />
               <CTA />
            </div>
          </div>
        );
      case 2: 
        return (
          <div className="absolute inset-0 p-10 flex flex-col justify-between text-black bg-[#d1d9cf]">
             <div className="absolute -top-10 -right-10 text-[20rem] font-syne font-black opacity-[0.05] leading-none select-none">0{slideIdx+1}</div>
             <div className="z-10">
                <Branding />
                <EditableTitle text={slide.title} className={`${titleSize} font-syne font-black uppercase leading-[0.85] tracking-tighter mb-6`} />
                <EditableText text={slide.text} className={`${bodySize} font-bold opacity-60 leading-snug max-w-[80%]`} />
             </div>
             <CTA />
          </div>
        );
      case 3: 
        return (
          <div className="absolute inset-0 p-10 flex flex-col items-center justify-center text-center bg-[#d1d9cf]">
             <div className="w-12 h-1 px-1 bg-black mb-8" />
             <EditableTitle text={slide.title} className="text-[2.2rem] font-syne font-black uppercase leading-[0.9] tracking-tighter mb-6 max-w-[85%]" />
             <EditableText text={slide.text} className="text-sm font-bold opacity-40 max-w-[75%] mb-8 leading-snug" />
             <CTA />
          </div>
        );
      case 4: 
        return (
          <div className="absolute inset-0 p-10 grid grid-cols-2 grid-rows-2 text-black bg-[#d1d9cf]">
             <div className="border-r border-b border-black/10 p-4 flex flex-col justify-between">
                <span className="text-[8px] font-black uppercase opacity-20 tracking-widest">Link2Digital</span>
                <div className="w-6 h-6 rounded-full bg-[#ccff00]" />
             </div>
             <div className="border-b border-black/10 p-4">
                <EditableText text={slide.text} className="text-[9px] font-bold opacity-40 leading-tight italic" />
             </div>
             <div className="p-4 col-span-2 flex flex-col justify-end">
                <EditableTitle text={slide.title} className="text-[2.4rem] font-syne font-black uppercase leading-[0.85] tracking-tighter mb-4" />
                <CTA />
             </div>
          </div>
        );
      case 5: 
        return (
          <div className="absolute inset-0 bg-[#d1d9cf] overflow-hidden flex flex-col justify-center p-10">
             <div className="absolute inset-0 bg-[#1a1a1a] origin-bottom-right -rotate-12 translate-y-1/2 opacity-10" />
             <div className="z-10">
                <EditableTitle text={slide.title} className="text-[2.8rem] font-syne font-black uppercase leading-[0.75] tracking-tighter mb-6" />
                <EditableText text={slide.text} className="text-base font-bold opacity-70 leading-snug max-w-[85%] mb-8" />
                <CTA />
             </div>
          </div>
        );
      case 6: 
        return (
          <div className="absolute inset-0 p-10 bg-[#d1d9cf] flex flex-col gap-8">
             <div className="bg-black text-white px-8 py-5 rounded-[25px] shadow-2xl">
                <EditableTitle text={slide.title} className="text-[1.8rem] font-syne font-black uppercase leading-tight tracking-tighter" />
             </div>
             <div className="px-2">
                <EditableText text={slide.text} className="text-base font-bold opacity-60 leading-snug mb-8" />
                <CTA />
             </div>
          </div>
        );
      case 7: 
        return (
          <div className="absolute inset-0 p-10 bg-[#d1d9cf] flex flex-col justify-end">
             <div className="flex flex-col gap-4 border-l-4 border-[#ccff00] pl-6">
                <span className="text-[9px] font-black uppercase tracking-widest opacity-20">Performance Design</span>
                <EditableTitle text={slide.title} className="text-[2.4rem] font-syne font-black uppercase leading-[0.85] tracking-tighter" />
                <EditableText text={slide.text} className="text-sm font-bold opacity-60 leading-tight max-w-[85%]" />
                <CTA />
             </div>
          </div>
        );
      case 8: 
        return (
          <div className="absolute inset-0 p-8 bg-[#d1d9cf] flex items-center justify-center">
             <div className="w-full h-full bg-[#1a1a1a] rounded-[30px] p-8 flex flex-col justify-between text-white shadow-2xl border-2 border-[#ccff00]/20">
                <div className="flex justify-between items-start">
                   <span className="text-[8px] font-black tracking-widest opacity-40 uppercase">Elite Protocol</span>
                   <div className="w-2 h-2 bg-[#ccff00] rounded-full" />
                </div>
                <div>
                   <EditableTitle text={slide.title} className="text-[2.1rem] font-syne font-black uppercase leading-[0.9] tracking-tighter mb-4" />
                   <EditableText text={slide.text} className="text-sm font-bold opacity-50 leading-snug" />
                </div>
                <CTA />
             </div>
          </div>
        );
      default: 
        return (
          <div className="absolute inset-0 p-10 flex flex-col justify-between text-black bg-[#d1d9cf]">
              <div className="flex justify-between items-start z-20">
                <Branding />
                <span className="font-black text-[10px] opacity-40">0{slideIdx + 1}</span>
              </div>
              <div className="flex flex-col flex-1 justify-center gap-0 mt-4 mb-4 relative">
                <div className="relative z-10">
                    <EditableTitle 
                      text={slide.title} 
                      className={`font-syne font-black uppercase leading-[0.85] tracking-tighter mb-4 ${slide.title.length > 25 ? 'text-[1.8rem]' : 'text-[2.6rem]'}`} 
                    />
                    {!isEditing && (
                      <h3 className={`absolute -top-4 left-0 w-full font-syne font-black uppercase leading-[0.85] tracking-tighter opacity-[0.02] select-none -z-10 ${slide.title.length > 25 ? 'text-[4rem]' : 'text-[6rem]'}`}>
                        {slide.title.split(' ').slice(0, 2).join(' ')}
                      </h3>
                    )}
                </div>
                <div className="mt-4 flex flex-col items-start gap-4 z-20">
                    <EditableText text={slide.text} className="text-sm font-bold opacity-60 leading-snug max-w-[90%]" />
                    <CTA />
                </div>
              </div>
              <div className="flex justify-between items-end z-20">
                <div className="flex items-center gap-3">
                    <Instagram size={18} />
                    <span className="text-[8px] font-black uppercase tracking-widest opacity-40">@link2digital</span>
                </div>
                <div className="flex gap-1.5">
                    {post.slides.map((_, i) => (
                      <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === slideIdx ? 'w-8 bg-black' : 'w-2 bg-black/10'}`} />
                    ))}
                </div>
              </div>
          </div>
        );
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="hero-wrapper bg-[#080808] flex flex-col p-6">
        <div className="w-full mb-12">
          <Header inverted={true} />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-md p-8 lg:p-12 rounded-[40px] bg-white/5 border border-white/10 backdrop-blur-3xl text-center shadow-2xl">
             <div className="w-16 h-16 lg:w-20 lg:h-20 bg-[#ccff00] rounded-full flex items-center justify-center text-black mx-auto mb-8 shadow-2xl"><Lock size={28} /></div>
             <h1 className="text-2xl lg:text-3xl font-syne font-black text-white uppercase mb-8 tracking-tighter">L2D STUDIO</h1>
             <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <input type="text" placeholder="USER" className="bg-white/10 p-4 lg:p-5 rounded-2xl text-white font-black outline-none focus:ring-2 ring-[#ccff00]" onChange={(e) => setUser(e.target.value)}/>
                <input type="password" placeholder="PASS" className="bg-white/10 p-4 lg:p-5 rounded-2xl text-white font-black outline-none focus:ring-2 ring-[#ccff00]" onChange={(e) => setPass(e.target.value)}/>
                <button type="submit" className="py-5 lg:py-6 bg-[#ccff00] text-black rounded-2xl font-black uppercase hover:bg-white transition-all">Unlock Studio</button>
             </form>
          </motion.div>
        </div>
      </div>
    );
  }

  const filteredPosts = posts.filter(post => 
    post.slides[0].title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    post.day.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.pillarName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.industryTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f4f6f3] text-black font-inter overflow-hidden relative">
      
      {/* Mobile Sidebar Toggle */}
      <button 
        onClick={() => setIsSidebarOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-black text-white rounded-full flex items-center justify-center z-[60] shadow-2xl"
      >
        <Menu size={24} />
      </button>

      <div className="flex h-screen overflow-hidden">
        
        {/* Navigation Sidebar */}
        <aside 
          data-lenis-prevent 
          className={`fixed lg:static inset-y-0 left-0 w-[280px] sm:w-[360px] bg-white border-r border-black/5 flex flex-col overflow-hidden shadow-2xl z-[70] transition-transform duration-500 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
            <div className="p-6 lg:p-8 border-b border-black/5 flex justify-between items-center">
               <div className="flex items-center gap-4">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 bg-black rounded-xl rotate-12 flex items-center justify-center text-[#ccff00]"><Layout size={18}/></div>
                  <div>
                     <h2 className="font-black text-xs lg:text-sm uppercase tracking-widest leading-none">Social Studio</h2>
                     <span className="text-[8px] lg:text-[9px] font-bold opacity-30 uppercase tracking-[0.2em]">Strategy v16.0</span>
                  </div>
               </div>
               <div className="flex items-center gap-2">
                  <button 
                    onClick={() => { if(confirm('Reset all edits to defaults?')) { localStorage.removeItem('l2d_social_posts'); window.location.reload(); } }} 
                    className="p-2 text-black/20 hover:text-red-500 transition-all"
                    title="Reset Strategy"
                  >
                    <Zap size={16} />
                  </button>
                  <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2"><X size={20}/></button>
               </div>
            </div>

            <div className="p-6 lg:p-8 border-b border-black/5 bg-[#fcfcfc]">
               <div className="flex justify-between items-end mb-4">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Strategy Progress</span>
                  <span className="text-xl font-black text-black">
                    {Math.round((posts.filter(p => p.status === 'READY' || p.status === 'PUBLISHED').length / posts.length) * 100)}%
                  </span>
               </div>
               <div className="w-full h-1.5 bg-black/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#ccff00] transition-all duration-1000" 
                    style={{ width: `${(posts.filter(p => p.status === 'READY' || p.status === 'PUBLISHED').length / posts.length) * 100}%` }} 
                  />
               </div>
               <div className="mt-4 flex justify-between">
                  <div className="flex flex-col">
                     <span className="text-[7px] font-black opacity-30 uppercase tracking-tighter">Total Posts</span>
                     <span className="text-[10px] font-black">{posts.length}</span>
                  </div>
                  <div className="flex flex-col items-end">
                     <span className="text-[7px] font-black opacity-30 uppercase tracking-tighter">Ready to Post</span>
                     <span className="text-[10px] font-black text-[#ccff00] drop-shadow-[0_0_10px_rgba(204,255,0,0.5)] bg-black px-2 py-0.5 rounded-md">
                        {posts.filter(p => p.status === 'READY' || p.status === 'PUBLISHED').length}
                     </span>
                  </div>
               </div>
               <button 
                 onClick={exportBundle}
                 className="w-full mt-6 py-3 bg-black text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#ccff00] hover:text-black transition-all flex items-center justify-center gap-2 shadow-lg"
               >
                 <Download size={14} /> Download Full Strategy Bundle
               </button>
            </div>
           
           <div className="p-6 lg:p-8 border-b border-black/5 space-y-6">
              <div className="flex bg-black/5 p-1 rounded-xl">
                 <button onClick={() => setSidebarView('list')} className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase flex items-center justify-center gap-2 transition-all ${sidebarView === 'list' ? 'bg-white shadow-sm' : 'opacity-40'}`}><Grid size={14}/> List</button>
                 <button onClick={() => setSidebarView('calendar')} className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase flex items-center justify-center gap-2 transition-all ${sidebarView === 'calendar' ? 'bg-white shadow-sm' : 'opacity-40'}`}><Calendar size={14}/> Planner</button>
              </div>

              <div className="relative">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20" size={16} />
                 <input type="text" placeholder="TOPIC, SETTORE O PILASTRO..." className="w-full bg-black/5 p-3 lg:p-4 pl-10 lg:pl-12 rounded-2xl text-[9px] lg:text-[10px] font-black outline-none" onChange={(e) => setSearchTerm(e.target.value)}/>
              </div>
           </div>

           <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-[#fcfcfc]">
              {sidebarView === 'list' ? (
                <div className="space-y-2">
                   {filteredPosts.map((post) => (
                      <div key={post.id} onClick={() => { setSelectedPostIndex(posts.findIndex(p => p.id === post.id)); setCurrentSlide(0); if(window.innerWidth < 1024) setIsSidebarOpen(false); }} className={`p-4 lg:p-6 rounded-[24px] lg:rounded-[28px] cursor-pointer transition-all border-2 flex items-center justify-between ${selectedPost.id === post.id ? 'border-black bg-black text-white shadow-2xl -translate-y-1' : 'border-transparent bg-black/5 hover:bg-black/10'}`}>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[8px] lg:text-[9px] font-black uppercase opacity-40">Post {post.id}</span>
                                <div className="w-1 h-1 bg-white/20 rounded-full" />
                                <span className={`text-[7px] lg:text-[8px] font-black uppercase flex items-center gap-1 ${selectedPost.id === post.id ? 'text-[#ccff00]' : 'text-black/40'}`}>
                                  {getPillarIcon(post.pillarName)} {post.pillarName.replace('_', ' ')}
                                </span>
                            </div>
                            <h4 className="text-[8px] lg:text-[9px] font-black opacity-40 uppercase tracking-widest mb-1">{post.industryTitle}</h4>
                            <h4 className="text-[9px] lg:text-[10px] font-black uppercase tracking-tight leading-tight max-w-[180px] lg:max-w-[200px]">{post.slides[0].title}</h4>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                           <div className={`w-2 h-2 lg:w-3 lg:h-3 rounded-full ${selectedPost.id === post.id ? 'bg-[#ccff00]' : 'bg-black/5 border border-black/10'}`} />
                           <span className={`text-[6px] lg:text-[7px] font-black px-1.5 py-0.5 rounded-full ${post.status === 'READY' ? 'bg-[#ccff00] text-black' : post.status === 'PUBLISHED' ? 'bg-blue-600 text-white' : 'bg-black/10 text-black/40'}`}>
                              {post.status || 'DRAFT'}
                           </span>
                        </div>
                      </div>
                   ))}
                </div>
              ) : (
                <div className="grid grid-cols-5 lg:grid-cols-6 gap-2">
                   {posts.map((post, idx) => (
                      <div key={post.id} onClick={() => { setSelectedPostIndex(idx); setCurrentSlide(0); if(window.innerWidth < 1024) setIsSidebarOpen(false); }} className={`aspect-square rounded-xl border flex flex-col items-center justify-center cursor-pointer transition-all ${selectedPost.id === post.id ? 'bg-[#ccff00] border-black' : 'bg-white border-black/5 hover:border-black/20'}`}>
                         <span className="text-[8px] lg:text-[9px] font-black">{post.id}</span>
                         <div className="mt-1 scale-75 opacity-60">{getPillarIcon(post.pillarName)}</div>
                      </div>
                   ))}
                </div>
              )}
           </div>
        </aside>

        {/* Studio Canvas */}
        <main className="flex-1 flex flex-col bg-[#ecedeb] overflow-hidden relative">
           
           <div className="w-full bg-white border-b border-black/5 p-4 lg:p-6">
              <Header />
           </div>

           <header className="p-4 bg-white border-b border-black/5 flex flex-col sm:flex-row gap-4 justify-between items-center z-50 overflow-x-auto no-scrollbar">
              <div className="flex items-center gap-2 lg:gap-4 w-full sm:w-auto overflow-x-auto no-scrollbar">
                 <div className="flex bg-black/5 p-1 rounded-xl shrink-0">
                    <button onClick={() => setFormat('post')} className={`px-3 lg:px-4 py-2 rounded-lg text-[9px] lg:text-[10px] font-black uppercase flex items-center gap-2 transition-all ${format === 'post' ? 'bg-white shadow-sm' : 'opacity-40'}`}><Instagram size={14}/> Post</button>
                    <button onClick={() => setFormat('story')} className={`px-3 lg:px-4 py-2 rounded-lg text-[9px] lg:text-[10px] font-black uppercase flex items-center gap-2 transition-all ${format === 'story' ? 'bg-white shadow-sm' : 'opacity-40'}`}><Smartphone size={14}/> Story</button>
                 </div>
                 <button onClick={() => setIsEditing(!isEditing)} className={`px-4 lg:px-6 py-2 rounded-xl text-[9px] lg:text-[10px] font-black uppercase flex items-center gap-2 transition-all shrink-0 ${isEditing ? 'bg-[#ccff00] text-black' : 'bg-black text-white'}`}>
                    {isEditing ? <Check size={14}/> : <Edit3 size={14}/>} {isEditing ? 'Salva' : 'Edit'}
                 </button>
                 <button onClick={() => setIsPreviewOpen(true)} className="p-2 rounded-xl border border-black/5 bg-white hover:bg-black hover:text-white transition-all shadow-sm shrink-0"><Maximize2 size={16}/></button>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                 <button onClick={() => { navigator.clipboard.writeText(selectedPost.caption); alert('Caption Copiata!'); }} className="flex-1 sm:flex-none px-4 lg:px-5 py-2.5 bg-white border border-black/10 rounded-xl font-black text-[9px] lg:text-[10px] uppercase flex items-center justify-center gap-2 hover:bg-black hover:text-white transition-all"><Copy size={14}/> Copy</button>
                 <button onClick={exportAsImage} className="flex-1 sm:flex-none px-4 lg:px-6 py-2.5 bg-black text-white rounded-xl font-black text-[9px] lg:text-[10px] uppercase flex items-center justify-center gap-2 hover:bg-[#ccff00] hover:text-black transition-all shadow-lg"><Download size={14}/> Export</button>
              </div>
           </header>

           <div className="bg-white border-b border-black/5 px-6 py-3 flex items-center justify-between z-40 overflow-x-auto no-scrollbar">
              <div className="flex items-center gap-6 shrink-0">
                 <div className="flex flex-col">
                    <span className="text-[8px] font-black opacity-30 uppercase tracking-widest leading-none mb-1">Layout Variant</span>
                    <div className="flex gap-1.5">
                       {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(v => (
                          <button 
                             key={v} 
                             onClick={() => updateStyleVariant(v)}
                             className={`w-6 h-6 rounded-lg text-[9px] font-black transition-all ${selectedPost.styleVariant === v ? 'bg-[#ccff00] text-black shadow-lg scale-110' : 'bg-black/5 text-black/40 hover:bg-black/10'}`}
                          >
                             {v}
                          </button>
                       ))}
                    </div>
                 </div>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                 <div className="flex flex-col items-end">
                    <span className="text-[8px] font-black opacity-30 uppercase tracking-widest leading-none mb-1">Workflow Status</span>
                    <div className="flex bg-black/5 p-1 rounded-xl">
                       {(['DRAFT', 'READY', 'PUBLISHED'] as const).map(s => (
                          <button 
                             key={s} 
                             onClick={() => updatePostStatus(s)}
                             className={`px-3 py-1.5 rounded-lg text-[8px] font-black uppercase transition-all ${selectedPost.status === s ? (s === 'READY' ? 'bg-[#ccff00] text-black shadow-sm' : s === 'PUBLISHED' ? 'bg-blue-600 text-white shadow-sm' : 'bg-black text-white shadow-sm') : 'opacity-40'}`}
                          >
                             {s}
                          </button>
                       ))}
                    </div>
                 </div>
              </div>
           </div>

           <div data-lenis-prevent className="flex-1 overflow-y-auto bg-[#f0f2ef] flex flex-col items-center p-6 lg:p-12 pb-60">
              <div className="flex flex-col items-center gap-8 lg:gap-10 w-full max-w-[800px]">
                 <div className="relative group w-full flex justify-center">
            <div className="relative scale-[0.55] xs:scale-[0.65] sm:scale-75 md:scale-90 lg:scale-100 origin-center">
              <div ref={slideRef} className={`relative transition-all duration-500 ease-in-out ${format === 'story' ? 'w-[320px] h-[568px] sm:w-[360px] sm:h-[640px]' : 'w-[450px] h-[450px] sm:w-[500px] sm:h-[500px]'} bg-[#d1d9cf] rounded-[32px] sm:rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.1)] overflow-hidden`}>
                          <div className="absolute inset-0">
                             {renderSlideContent(selectedPost, currentSlide)}
                          </div>
                      </div>
                    </div>
                    <div className="absolute inset-y-0 -left-4 sm:-left-16 -right-4 sm:-right-16 flex items-center justify-between pointer-events-none px-2 z-20">
                        <button onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))} className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white shadow-xl flex items-center justify-center text-black pointer-events-auto hover:scale-110 transition-all border border-black/5"><ChevronLeft size={20}/></button>
                        <button onClick={() => setCurrentSlide(prev => Math.min(selectedPost.slides.length - 1, prev + 1))} className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white shadow-xl flex items-center justify-center text-black pointer-events-auto hover:scale-110 transition-all border border-black/5"><ChevronRight size={20}/></button>
                    </div>
                 </div>
                 {/* Caption Panel */}
                 <div className="w-full bg-white rounded-[32px] lg:rounded-[40px] p-6 lg:p-10 shadow-2xl border border-black/5">
                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                       <div className="flex-1">
                          <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.3em] opacity-20 mb-4 lg:mb-6 block">Ready-to-Publish Caption</span>
                          {isEditing ? (
                            <textarea value={selectedPost.caption} onChange={(e) => updateCaption(e.target.value)} className="w-full bg-black/5 p-4 lg:p-6 rounded-2xl lg:rounded-3xl text-[13px] lg:text-sm font-bold italic leading-relaxed text-black/70 resize-none outline-none border border-black/10" rows={6}/>
                          ) : (
                            <div className="p-6 lg:p-8 bg-black/5 rounded-[24px] lg:rounded-[32px] text-[13px] lg:text-sm font-bold italic leading-relaxed text-black/70 whitespace-pre-wrap">"{selectedPost.caption}"</div>
                          )}
                       </div>
                       <div className="w-full lg:w-[240px] xl:w-[280px]">
                          <div className="p-5 lg:p-6 bg-black text-white rounded-2xl lg:rounded-3xl mb-4 border border-[#ccff00]/30">
                             <div className="flex justify-between items-start mb-4">
                                <div>
                                   <span className="text-[8px] lg:text-[9px] font-black uppercase opacity-40 block mb-1">Pillar Strategy</span>
                                   <div className="flex items-center gap-2">
                                      {getPillarIcon(selectedPost.pillarName)}
                                      <span className="font-black text-[8px] lg:text-[9px] text-[#ccff00] uppercase tracking-tighter">{selectedPost.pillarName.replace('_', ' ')}</span>
                                   </div>
                                </div>
                                <div className="text-right">
                                   <span className="text-[8px] lg:text-[9px] font-black uppercase opacity-40 block mb-1">Slide Flow</span>
                                   <span className="font-black text-xs text-white">{currentSlide + 1}/{selectedPost.slides.length}</span>
                                </div>
                             </div>
                             <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-[#ccff00]" style={{ width: `${((currentSlide + 1) / selectedPost.slides.length) * 100}%` }} />
                             </div>
                          </div>
                          <button className="w-full py-4 lg:py-5 bg-[#ccff00] text-black rounded-2xl lg:rounded-3xl font-black uppercase text-[10px] lg:text-[11px] tracking-[0.2em] hover:bg-black hover:text-white transition-all shadow-lg">Schedule Now</button>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </main>
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
         {isPreviewOpen && (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[99999] bg-[#d1d9cf] flex flex-col items-center justify-center p-6 lg:p-12">
              <button onClick={() => setIsPreviewOpen(false)} className="absolute top-6 lg:top-12 right-6 lg:right-12 text-black opacity-40 hover:opacity-100 transition-all hover:rotate-90 duration-300"><X size={32} className="lg:w-12 lg:h-12" /></button>
              <div className={`relative scale-[0.6] sm:scale-75 md:scale-90 lg:scale-100 ${format === 'story' ? 'h-[70vh] aspect-[9/16]' : 'w-[90vw] max-w-[600px] lg:w-[850px] aspect-square'} bg-[#d1d9cf] rounded-[40px] lg:rounded-[60px] overflow-hidden shadow-2xl border border-black/5`}>
                  {renderSlideContent(selectedPost, currentSlide)}
              </div>
              <div className="mt-8 lg:mt-12 flex gap-4 lg:gap-8">
                 <button onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))} className="w-14 h-14 lg:w-20 lg:h-20 bg-white/5 rounded-full text-black hover:bg-black hover:text-white transition-all flex items-center justify-center border border-black/10"><ChevronLeft size={32} className="lg:w-12 lg:h-12" /></button>
                 <button onClick={() => setCurrentSlide(prev => Math.min(selectedPost.slides.length - 1, prev + 1))} className="w-14 h-14 lg:w-20 lg:h-20 bg-white/5 rounded-full text-black hover:bg-black hover:text-white transition-all flex items-center justify-center border border-black/10"><ChevronRight size={32} className="lg:w-12 lg:h-12" /></button>
              </div>
           </motion.div>
         )}
      </AnimatePresence>

      {/* Hidden Batch Renderer */}
      <div className="fixed -left-[2000px] top-0 pointer-events-none">
        <div ref={batchRef} className="w-[500px] h-[500px] bg-[#d1d9cf]">
           {batchPost && renderSlideContent(batchPost.post, batchPost.sIdx)}
        </div>
      </div>

      {/* Export Progress Modal */}
      <AnimatePresence>
        {exportProgress && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[100000] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-6"
          >
             <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[40px] p-10 lg:p-16 max-w-md w-full text-center shadow-2xl">
                <div className="w-24 h-24 bg-[#ccff00] rounded-full flex items-center justify-center text-black mx-auto mb-8 shadow-2xl relative">
                  <Download size={40} className="animate-bounce" />
                  <div className="absolute inset-0 rounded-full border-4 border-black/10 border-t-black animate-spin" />
                </div>
                <h2 className="text-2xl lg:text-3xl font-syne font-black uppercase mb-4 tracking-tighter">Generazione Bundle</h2>
                <p className="text-black/40 font-bold mb-10 text-sm leading-relaxed">Stiamo preparando il pacchetto completo dei tuoi post. Questo richiederà solo pochi istanti.</p>
                <div className="w-full h-2 bg-black/5 rounded-full overflow-hidden mb-4">
                   <div className="h-full bg-black transition-all duration-300" style={{ width: `${(exportProgress.current / exportProgress.total) * 100}%` }} />
                </div>
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest opacity-40">
                   <span>Post {exportProgress.current} di {exportProgress.total}</span>
                   <span>{Math.round((exportProgress.current / exportProgress.total) * 100)}%</span>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
