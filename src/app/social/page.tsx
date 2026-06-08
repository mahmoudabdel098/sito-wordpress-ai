'use client';

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock, Instagram, Layout, Sparkles, Download, Copy, ArrowRight,
  ChevronLeft, ChevronRight, Calendar, Search, Grid, Smartphone,
  Edit3, Check, Maximize2, X, Zap, ShieldCheck, TrendingUp,
  BookOpen, Layers, Users, AlertCircle, Menu, RefreshCcw, Filter,
  Heart, MessageCircle, Send, Bookmark, MoreHorizontal, ChevronDown,
  Wand2, Image as ImageIcon, Plus, FileText, Briefcase
} from 'lucide-react';
import Header from '@/components/Header';
import { ANGLES, generatePosts } from '@/data/socialContent';
import type { Post, Pillar, PostStatus, Slide, PostFormat, Angle } from '@/data/socialContent';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { toPng } from 'html-to-image';

const INITIAL_COUNT = 320;
const LS_KEY = 'l2d_social_posts_v4';
const LS_SEED = 'l2d_social_seed_v4';

const getPillarIcon = (pillar: string, sizeOverride?: number) => {
  const size = sizeOverride ?? 14;
  switch (pillar) {
    case 'AUTHORITY': return <ShieldCheck size={size} className="text-[#ccff00]" />;
    case 'EDUCATIONAL': return <BookOpen size={size} className="text-[#ccff00]" />;
    case 'PROBLEM_SOLUTION': return <AlertCircle size={size} className="text-[#ccff00]" />;
    case 'VIRAL_HOOK': return <Zap size={size} className="text-[#ccff00]" />;
    case 'CASE_STUDY': return <TrendingUp size={size} className="text-[#ccff00]" />;
    case 'HOW_TO': return <Layers size={size} className="text-[#ccff00]" />;
    case 'MISTAKE': return <AlertCircle size={size} className="text-[#ccff00]" />;
    case 'TESTIMONIAL': return <Users size={size} className="text-[#ccff00]" />;
    case 'OFFER': return <Sparkles size={size} className="text-[#ccff00]" />;
    default: return <Sparkles size={size} className="text-[#ccff00]" />;
  }
};

const L2D_WORDMARK = ({ size = 'sm', inverted = false }: { size?: 'xs' | 'sm' | 'md' | 'lg'; inverted?: boolean }) => {
  const sizes = {
    xs: { text: 'text-[8px]', dot: 'w-1.5 h-1.5' },
    sm: { text: 'text-[10px]', dot: 'w-2 h-2' },
    md: { text: 'text-xs', dot: 'w-2.5 h-2.5' },
    lg: { text: 'text-base', dot: 'w-3 h-3' }
  };
  const cfg = sizes[size];
  return (
    <span className={`inline-flex items-center gap-1.5 ${inverted ? 'text-white' : 'text-black'}`}>
      <span className={`${cfg.dot} rounded-full bg-blue-600 shrink-0`} />
      <span className={`font-syne font-black uppercase tracking-tight ${cfg.text}`}>LINK2DIGITAL</span>
    </span>
  );
};

const SlideEditContext = React.createContext<{
  editing: boolean;
  isStory: boolean;
  updateSlide: (field: keyof Slide, val: string) => void;
} | null>(null);

const fitTitleClass = (text: string, className: string, isStory: boolean): string => {
  const longestWord = text.split(/\s+/).reduce((m, w) => Math.max(m, w.length), 0);
  const totalLen = text.length;
  const stripped = className.replace(/text-\[[^\]]+\]|text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl)/g, '').trim();
  let sizeClass: string;
  if (longestWord >= 15 || totalLen >= 40) sizeClass = isStory ? 'text-[1.5rem]' : 'text-[1.4rem]';
  else if (longestWord >= 12 || totalLen >= 30) sizeClass = isStory ? 'text-[1.85rem]' : 'text-[1.7rem]';
  else if (longestWord >= 9 || totalLen >= 20) sizeClass = isStory ? 'text-[2.2rem]' : 'text-[2.05rem]';
  else if (totalLen >= 12) sizeClass = isStory ? 'text-[2.6rem]' : 'text-[2.4rem]';
  else sizeClass = isStory ? 'text-[3rem]' : 'text-[2.8rem]';
  const tracking = stripped.replace(/tracking-tighter/g, 'tracking-tight');
  return `${sizeClass} ${tracking} whitespace-normal hyphens-none max-w-full`;
};

const EditableTitle = React.memo(({ text, className }: { text: string; className: string }) => {
  const ctx = React.useContext(SlideEditContext);
  if (!ctx) return null;
  const { editing, isStory, updateSlide } = ctx;
  const finalClass = fitTitleClass(text, className, isStory);
  return !editing ? <h3 className={finalClass}>{text}</h3> : (
    <textarea value={text} onChange={(e) => updateSlide('title', e.target.value)}
      className={`${finalClass} bg-white/10 border-b border-[#ccff00] outline-none resize-none w-full`} rows={2} />
  );
});
EditableTitle.displayName = 'EditableTitle';

const EditableText = React.memo(({ text, className }: { text: string; className: string }) => {
  const ctx = React.useContext(SlideEditContext);
  if (!ctx) return null;
  const { editing, updateSlide } = ctx;
  return !editing ? <p className={`${className} whitespace-normal max-w-full`}>{text}</p> : (
    <textarea value={text} onChange={(e) => updateSlide('text', e.target.value)}
      className={`${className} max-w-full bg-white/10 border-b border-[#ccff00] outline-none resize-none w-full`} rows={3} />
  );
});
EditableText.displayName = 'EditableText';

const EditableTag = React.memo(({
  text,
  className,
  field,
  style
}: {
  text: string;
  className: string;
  field: keyof Slide;
  style?: React.CSSProperties;
}) => {
  const ctx = React.useContext(SlideEditContext);
  if (!ctx) return null;
  const { editing, updateSlide } = ctx;
  return !editing ? (
    <span className={className} style={style}>{text}</span>
  ) : (
    <input
      type="text"
      value={text}
      onChange={(e) => updateSlide(field, e.target.value)}
      className={`${className} bg-white/10 border-b border-[#ccff00] outline-none max-w-[180px] inline-block`}
      style={style}
      onClick={(e) => e.stopPropagation()}
    />
  );
});
EditableTag.displayName = 'EditableTag';

const EditableNumber = React.memo(({
  text,
  className,
  field,
  label = "BG NUMBER"
}: {
  text: string;
  className: string;
  field: keyof Slide;
  label?: string;
}) => {
  const ctx = React.useContext(SlideEditContext);
  if (!ctx) return null;
  const { editing, updateSlide } = ctx;
  return !editing ? (
    <div className={className}>{text}</div>
  ) : (
    <div className="absolute top-2 right-12 bg-black/80 text-white p-2 rounded-lg border border-[#ccff00]/40 flex flex-col gap-1 z-50 text-[10px] opacity-100 select-all normal-case font-sans">
      <span className="text-[9px] text-[#ccff00] font-bold">{label}:</span>
      <input
        type="text"
        value={text}
        onChange={(e) => updateSlide(field, e.target.value)}
        className="bg-white/10 border-b border-[#ccff00] outline-none text-sm p-1 font-bold text-center w-20 text-white"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
});
EditableNumber.displayName = 'EditableNumber';

export default function SocialStudio() {
  // === AUTH ===
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [authError, setAuthError] = useState(false);

  // === DATA ===
  const [seed, setSeed] = useState(42);
  const [posts, setPosts] = useState<Post[]>([]);

  // Initial load: hydrate from localStorage or generate fresh
  useEffect(() => {
    const savedSeed = parseInt(localStorage.getItem(LS_SEED) ?? '42', 10);
    setSeed(Number.isFinite(savedSeed) ? savedSeed : 42);
    const saved = localStorage.getItem(LS_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPosts(parsed);
          return;
        }
      } catch {}
    }
    setPosts(generatePosts({ count: INITIAL_COUNT, seed: Number.isFinite(savedSeed) ? savedSeed : 42 }));
  }, []);

  // Persist whenever posts change
  useEffect(() => {
    if (posts.length === 0) return;
    try { localStorage.setItem(LS_KEY, JSON.stringify(posts)); } catch {}
  }, [posts]);

  // === UI STATE ===
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [angleFilter, setAngleFilter] = useState<'all' | Angle>('all');
  const [pillarFilter, setPillarFilter] = useState<string>('all');
  const [formatFilter, setFormatFilter] = useState<'all' | PostFormat>('all');
  const [isEditing, setIsEditing] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isIgGridOpen, setIsIgGridOpen] = useState(false);
  const [sidebarView, setSidebarView] = useState<'list' | 'calendar'>('list');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [exportProgress, setExportProgress] = useState<{ current: number; total: number } | null>(null);
  const [batchPost, setBatchPost] = useState<{ post: Post; sIdx: number } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const slideRef = useRef<HTMLDivElement>(null);
  const batchRef = useRef<HTMLDivElement>(null);

  const selectedPost = useMemo(() => {
    if (selectedPostId === null) return posts[0];
    return posts.find((p) => p.id === selectedPostId) ?? posts[0];
  }, [posts, selectedPostId]);

  // Auto-select first post once posts are loaded
  useEffect(() => {
    if (posts.length > 0 && selectedPostId === null) {
      setSelectedPostId(posts[0].id);
    }
  }, [posts, selectedPostId]);

  // === LOGIN ===
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (user.toLowerCase() === 'admin' && pass.toLowerCase() === 'admin') {
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  // === MUTATIONS ===
  const mutateSelected = useCallback((mutator: (p: Post) => Post) => {
    setPosts((curr) => curr.map((p) => (p.id === selectedPost?.id ? mutator({ ...p, slides: p.slides.map((s) => ({ ...s })) }) : p)));
  }, [selectedPost?.id]);

  const updateSlideField = (slideIndex: number, field: keyof Slide, value: string) => {
    mutateSelected((p) => {
      const slides = [...p.slides];
      slides[slideIndex] = { ...slides[slideIndex], [field]: value };
      return { ...p, slides };
    });
  };
  const updateCaption = (value: string) => mutateSelected((p) => ({ ...p, caption: value }));
  const updateStatus = (status: PostStatus) => mutateSelected((p) => ({ ...p, status }));
  const updateStyleVariant = (variant: number) => mutateSelected((p) => ({ ...p, styleVariant: variant }));
  const updateFormat = (format: PostFormat) => mutateSelected((p) => ({ ...p, format }));

  const handleRegenerate = () => {
    if (!confirm('Generare un nuovo set di 320 contenuti? Le modifiche manuali andranno perse.')) return;
    setIsGenerating(true);
    const newSeed = Date.now() % 1000000;
    setSeed(newSeed);
    setTimeout(() => {
      const fresh = generatePosts({ count: INITIAL_COUNT, seed: newSeed });
      setPosts(fresh);
      try { localStorage.setItem(LS_SEED, String(newSeed)); } catch {}
      setSelectedPostId(fresh[0]?.id ?? null);
      setCurrentSlide(0);
      setIsGenerating(false);
    }, 600);
  };

  const handleAddPost = () => {
    const fresh = generatePosts({ count: 1, seed: Date.now() % 1000000 });
    const newPost = { ...fresh[0], id: (posts[posts.length - 1]?.id ?? 0) + 1 };
    setPosts((curr) => [newPost, ...curr]);
    setSelectedPostId(newPost.id);
    setCurrentSlide(0);
  };

  // === EXPORT ===
  const captureSlide = (post: Post, sIdx: number): Promise<string> =>
    new Promise((resolve, reject) => {
      setBatchPost({ post, sIdx });
      setTimeout(async () => {
        if (batchRef.current) {
          try {
            if (typeof document !== 'undefined') {
              await document.fonts.ready;
            }
            const dataUrl = await toPng(batchRef.current, {
              cacheBust: true, pixelRatio: 4, quality: 1,
              style: { borderRadius: '0', transform: 'scale(1)' }
            });
            resolve(dataUrl);
          } catch (err) { reject(err); }
        } else reject('No batch ref');
      }, 200);
    });

  const exportBundle = async () => {
    const readyPosts = posts.filter((p) => p.status === 'READY' || p.status === 'PUBLISHED');
    if (readyPosts.length === 0) {
      alert("Nessun post marcato come 'READY' o 'PUBLISHED'. Vai nei tuoi post preferiti e impostali su READY.");
      return;
    }
    setExportProgress({ current: 0, total: readyPosts.length });
    const zip = new JSZip();
    try {
      for (let i = 0; i < readyPosts.length; i++) {
        const post = readyPosts[i];
        const folderName = `${String(post.id).padStart(3, '0')}_${post.angle}_${post.pillarName}`;
        const postFolder = zip.folder(folderName);
        postFolder?.file('caption.txt', `${post.caption}\n\n${post.hashtags}`);
        for (let sIdx = 0; sIdx < post.slides.length; sIdx++) {
          const dataUrl = await captureSlide(post, sIdx);
          const base64Data = dataUrl.split(',')[1];
          postFolder?.file(`slide_${sIdx + 1}.png`, base64Data, { base64: true });
        }
        setExportProgress((prev) => (prev ? { ...prev, current: i + 1 } : null));
      }
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, `L2D_SOCIAL_BUNDLE_${new Date().toISOString().split('T')[0]}.zip`);
    } catch (err) {
      console.error(err);
      alert("Errore durante l'esportazione del bundle.");
    } finally {
      setExportProgress(null);
      setBatchPost(null);
    }
  };

  const exportSingleImage = async () => {
    if (!slideRef.current || !selectedPost) return;
    try {
      if (typeof document !== 'undefined') {
        await document.fonts.ready;
      }
      const dataUrl = await toPng(slideRef.current, {
        cacheBust: true, pixelRatio: 4, quality: 1,
        style: { borderRadius: '0', transform: 'scale(1)' }
      });
      const link = document.createElement('a');
      link.download = `L2D_${selectedPost.angle}_${selectedPost.id}_slide${currentSlide + 1}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      alert('Esportazione fallita.');
    }
  };

  // === FILTERING ===
  const filteredPosts = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return posts.filter((post) => {
      if (angleFilter !== 'all' && post.angle !== angleFilter) return false;
      if (pillarFilter !== 'all' && post.pillarName !== pillarFilter) return false;
      if (formatFilter !== 'all' && post.format !== formatFilter) return false;
      if (!term) return true;
      return (
        post.slides[0].title.toLowerCase().includes(term) ||
        post.day.toLowerCase().includes(term) ||
        post.pillarName.toLowerCase().includes(term) ||
        post.angleLabel.toLowerCase().includes(term)
      );
    });
  }, [posts, searchTerm, angleFilter, pillarFilter, formatFilter]);

  // ==========================================================================
  // SLIDE RENDERERS — 16 variants (0-9 post, 10-15 story-friendly)
  // ==========================================================================
  const renderSlideContent = (post: Post, slideIdx: number, opts: { isSmall?: boolean; isStory?: boolean; isEditingOverride?: boolean } = {}) => {
    const { isSmall = false, isStory = false, isEditingOverride } = opts;
    const editing = isEditingOverride ?? isEditing;
    const slide = post.slides[slideIdx] ?? post.slides[0];
    const variant = post.styleVariant;
    const titleSize = isSmall ? 'text-2xl' : isStory ? 'text-[2.8rem]' : 'text-[2.6rem]';
    const bodySize = isSmall ? 'text-xs' : 'text-base';

    const CTA = () => {
      const ctaText = slide.cta ?? 'GET STARTED';
      return (
        <div className={`px-5 py-2 bg-[#ccff00] text-black rounded-full font-black uppercase tracking-widest flex items-center gap-2 shadow-xl mt-4 self-start ${isSmall ? 'text-[7px]' : 'text-[9px]'}`}>
          <EditableTag text={ctaText} className="" field="cta" /> <ArrowRight size={isSmall ? 8 : 11} />
        </div>
      );
    };

    const Branding = () => {
      const subText = slide.subTitle ?? 'L2D STUDIO // LEAD GEN';
      const tagText = slide.tag ?? `${post.pillarName.replace('_', ' ')} FRAMEWORK`;
      return (
        <div className="flex flex-col mb-4">
          <EditableTag text={subText} className="text-[9px] font-black tracking-[0.4em] uppercase opacity-40 leading-none" field="subTitle" />
          <EditableTag text={tagText} className="text-[7px] font-black uppercase opacity-20 mt-1 tracking-tight" field="tag" />
        </div>
      );
    };

    // LogoPill — IDENTICAL across every single post/story.
    // This is the brand anchor (mai cambiare): pillola nera, dot blu, testo Inter ExtraBold bianco.
    // Lo stesso pill che trovi nell'Header della homepage.
    const LogoPill = () => {
      const logoText = slide.logoText ?? 'LINK2DIGITAL';
      return (
        <div
          className={`inline-flex items-center bg-black text-white rounded-full shrink-0 ${
            isSmall ? 'gap-1 px-2 py-1' : 'gap-2 px-3 py-1.5'
          }`}
        >
          <span className={`${isSmall ? 'w-2 h-2' : 'w-3 h-3'} rounded-full bg-blue-500 shrink-0`} />
          <EditableTag
            text={logoText}
            className={`font-extrabold uppercase leading-none ${isSmall ? 'text-[7px]' : 'text-[11px]'}`}
            field="logoText"
            style={{ letterSpacing: '0.02em' }}
          />
        </div>
      );
    };
    // Backward-compat alias so variant code can still call <Wordmark /> without rewriting all 16
    const Wordmark = ({ light = false }: { light?: boolean }) => <LogoPill />;

    const updateSlide = (field: keyof Slide, val: string) => updateSlideField(slideIdx, field, val);

    const slideElement = (() => {
      switch (variant) {
      case 1: // Split sage / charcoal
        return (
          <div className="absolute inset-0 flex flex-col">
            <div className="flex-1 bg-[#d1d9cf] p-10 flex flex-col justify-between text-black">
              <Wordmark />
              <EditableTitle text={slide.title} className={`${titleSize} font-syne font-black uppercase leading-none tracking-tighter`} />
            </div>
            <div className="flex-1 bg-[#1a1a1a] p-10 flex flex-col justify-center text-white relative">
              <EditableText text={slide.text} className={`${bodySize} font-bold opacity-60 leading-snug max-w-[90%]`} />
              <CTA />
            </div>
          </div>
        );
      case 2: // Big ghost number
        return (
          <div className="absolute inset-0 p-10 flex flex-col justify-between text-black bg-[#d1d9cf]">
            <EditableNumber text={slide.number ?? `0${slideIdx + 1}`} className="absolute -top-10 -right-10 text-[20rem] font-syne font-black opacity-[0.05] leading-none select-none" field="number" label="BG NUMBER" />
            <div className="z-10">
              <Branding />
              <EditableTitle text={slide.title} className={`${titleSize} font-syne font-black uppercase leading-none tracking-tighter mb-6`} />
              <EditableText text={slide.text} className={`${bodySize} font-bold opacity-60 leading-snug max-w-[80%]`} />
            </div>
            <div className="flex items-end justify-between z-10">
              <CTA />
              <Wordmark />
            </div>
          </div>
        );
      case 3: // Centered minimal
        return (
          <div className="absolute inset-0 p-10 flex flex-col items-center justify-center text-center bg-[#d1d9cf]">
            <Wordmark />
            <div className="w-12 h-1 px-1 bg-black my-8" />
            <EditableTitle text={slide.title} className="text-[2.2rem] font-syne font-black uppercase leading-none tracking-tighter mb-6 max-w-[85%]" />
            <EditableText text={slide.text} className="text-sm font-bold opacity-40 max-w-[75%] mb-8 leading-none" />
            <CTA />
          </div>
        );
      case 4: // 4-cell grid
        return (
          <div className="absolute inset-0 p-10 grid grid-cols-2 grid-rows-2 text-black bg-[#d1d9cf]">
            <div className="border-r border-b border-black/10 p-4 flex flex-col justify-between">
              <Wordmark />
              <div className="w-6 h-6 rounded-full bg-[#ccff00]" />
            </div>
            <div className="border-b border-black/10 p-4">
              <EditableText text={slide.text} className="text-[9px] font-bold opacity-40 leading-tight italic" />
            </div>
            <div className="p-4 col-span-2 flex flex-col justify-end">
              <EditableTitle text={slide.title} className="text-[2.4rem] font-syne font-black uppercase leading-none tracking-tighter mb-4" />
              <CTA />
            </div>
          </div>
        );
      case 5: // Diagonal block
        return (
          <div className="absolute inset-0 bg-[#d1d9cf] overflow-hidden flex flex-col justify-center p-10">
            <div className="absolute inset-0 bg-[#1a1a1a] origin-bottom-right -rotate-12 translate-y-1/2 opacity-10" />
            <div className="z-10">
              <Wordmark />
              <EditableTitle text={slide.title} className="text-[2.8rem] font-syne font-black uppercase leading-none tracking-tighter my-6" />
              <EditableText text={slide.text} className="text-base font-bold opacity-70 leading-snug max-w-[85%] mb-8" />
              <CTA />
            </div>
          </div>
        );
      case 6: // Pill header
        return (
          <div className="absolute inset-0 p-10 bg-[#d1d9cf] flex flex-col gap-8">
            <div className="flex items-center justify-between"><Wordmark /><EditableTag text={slide.pageLabel ?? `0${slideIdx + 1}/${post.slides.length}`} className="text-[9px] font-black opacity-30" field="pageLabel" /></div>
            <div className="bg-black text-white px-8 py-5 rounded-[25px] shadow-2xl">
              <EditableTitle text={slide.title} className="text-[1.8rem] font-syne font-black uppercase leading-tight tracking-tighter" />
            </div>
            <div className="px-2">
              <EditableText text={slide.text} className="text-base font-bold opacity-60 leading-snug mb-8" />
              <CTA />
            </div>
          </div>
        );
      case 7: // Left border accent
        return (
          <div className="absolute inset-0 p-10 bg-[#d1d9cf] flex flex-col justify-end">
            <Wordmark />
            <div className="flex flex-col gap-4 border-l-4 border-[#ccff00] pl-6 mt-auto">
              <EditableTag text={slide.tag ?? 'Performance Design'} className="text-[9px] font-black uppercase tracking-widest opacity-20" field="tag" />
              <EditableTitle text={slide.title} className="text-[2.4rem] font-syne font-black uppercase leading-none tracking-tighter" />
              <EditableText text={slide.text} className="text-sm font-bold opacity-60 leading-tight max-w-[85%]" />
              <CTA />
            </div>
          </div>
        );
      case 8: // Dark inner card — pill on sage outer top strip
        return (
          <div className="absolute inset-0 bg-[#d1d9cf] p-6 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <Wordmark />
              <div className="w-2 h-2 bg-black rounded-full" />
            </div>
            <div className="flex-1 bg-[#1a1a1a] rounded-[28px] p-7 flex flex-col justify-between text-white shadow-2xl border-2 border-[#ccff00]/20">
              <EditableTag text={slide.tag ?? post.pillarName.replace('_', ' ')} className="text-[8px] font-black tracking-widest opacity-40 uppercase text-[#ccff00]" field="tag" />
              <div>
                <EditableTitle text={slide.title} className="font-syne uppercase leading-none mb-4" />
                <EditableText text={slide.text} className="text-sm font-bold opacity-60 leading-snug" />
              </div>
              <CTA />
            </div>
          </div>
        );
      case 9: // Big quote with marks
        return (
          <div className="absolute inset-0 p-10 bg-[#d1d9cf] flex flex-col justify-between">
            <div className="flex justify-between"><Wordmark /><EditableTag text={slide.tag ?? post.angleLabel} className="text-[9px] font-black opacity-30" field="tag" /></div>
            <div className="relative">
              <span className="absolute -top-12 -left-2 text-[12rem] font-syne font-black opacity-10 leading-none select-none">"</span>
              <EditableTitle text={slide.title} className="text-[2.4rem] font-syne font-black uppercase leading-none tracking-tighter mb-6 relative z-10" />
              <EditableText text={slide.text} className="text-base font-bold opacity-60 leading-snug max-w-[85%] relative z-10" />
            </div>
            <div className="flex justify-between items-end">
              <CTA />
              <EditableTag text={slide.pageLabel ?? `#${slideIdx + 1}`} className="text-[9px] font-black opacity-30" field="pageLabel" />
            </div>
          </div>
        );
      case 10: // Brutalist outlined
        return (
          <div className="absolute inset-0 p-10 bg-[#d1d9cf] flex flex-col justify-between border-[8px] border-black/10">
            <div className="flex justify-between items-start">
              <div className="px-3 py-1 bg-black text-[#ccff00] rounded-full text-[8px] font-black uppercase tracking-widest">
                <EditableTag text={slide.tag ?? post.pillarName.replace('_', ' ')} className="" field="tag" />
              </div>
              <Wordmark />
            </div>
            <div>
              <EditableTitle text={slide.title} className="font-syne font-black uppercase leading-none tracking-tighter mb-4 text-[3.2rem]" />
              <EditableText text={slide.text} className="text-base font-bold opacity-60 leading-snug max-w-[90%]" />
            </div>
            <div className="flex justify-between items-end">
              <CTA />
              <EditableTag text={slide.pageLabel ?? `SLIDE ${slideIdx + 1}`} className="text-[9px] font-black opacity-30" field="pageLabel" />
            </div>
          </div>
        );
      case 11: // Lime block top
        return (
          <div className="absolute inset-0 flex flex-col bg-[#d1d9cf]">
            <div className="h-[35%] bg-[#ccff00] p-8 flex flex-col justify-between text-black">
              <Wordmark />
              <EditableTitle text={slide.title} className="text-[2.2rem] font-syne font-black uppercase leading-none tracking-tighter" />
            </div>
            <div className="flex-1 p-8 flex flex-col justify-between">
              <EditableText text={slide.text} className="text-base font-bold opacity-60 leading-snug max-w-[90%]" />
              <CTA />
            </div>
          </div>
        );
      case 12: // Number-driven big stat — sage top strip with pill, dark body
        return (
          <div className="absolute inset-0 flex flex-col">
            <div className="bg-[#d1d9cf] px-10 pt-8 pb-5">
              <Wordmark />
            </div>
            <div className="flex-1 px-10 pb-10 pt-5 bg-[#1a1a1a] text-white flex flex-col justify-between">
              <div>
                <EditableNumber text={slide.number ?? `0${slideIdx + 1}`} className="text-[6rem] font-syne text-[#ccff00] leading-none tracking-tight mb-2" field="number" label="STAT" />
                <EditableTitle text={slide.title} className="font-syne uppercase leading-none mb-3" />
                <EditableText text={slide.text} className="text-sm font-bold opacity-60 leading-snug max-w-[90%]" />
              </div>
              <CTA />
            </div>
          </div>
        );
      case 13: // Editorial card stack
        return (
          <div className="absolute inset-0 bg-[#d1d9cf] p-6 flex flex-col gap-3">
            <div className="bg-white rounded-[24px] p-5 flex justify-between items-center shadow-sm">
              <Wordmark />
              <EditableTag text={slide.tag ?? post.angleLabel} className="text-[9px] font-black uppercase tracking-widest opacity-40" field="tag" />
            </div>
            <div className="flex-1 bg-black rounded-[28px] p-7 flex flex-col justify-between text-white">
              <EditableTag text={slide.tag2 ?? post.pillarName.replace('_', ' ')} className="text-[9px] font-black uppercase tracking-widest text-[#ccff00]" field="tag2" />
              <EditableTitle text={slide.title} className="text-[2.2rem] font-syne font-black uppercase leading-none tracking-tighter" />
              <EditableText text={slide.text} className="text-sm font-bold opacity-60 leading-snug max-w-[90%]" />
            </div>
            <div className="bg-[#ccff00] rounded-[20px] p-4 flex justify-between items-center text-black">
              <EditableTag text={slide.cta ?? 'GET STARTED'} className="text-[10px] font-black uppercase tracking-widest" field="cta" />
              <ArrowRight size={16} />
            </div>
          </div>
        );
      case 14: // Story-style oversized title (great for 9:16)
        return (
          <div className="absolute inset-0 bg-[#d1d9cf] p-10 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <Wordmark />
              <EditableTag text={slide.pageLabel ?? `0${slideIdx + 1}`} className="text-[9px] font-black uppercase opacity-30" field="pageLabel" />
            </div>
            <div>
              <EditableTag text={slide.tag ?? post.pillarName.replace('_', ' ')} className="text-[9px] font-black uppercase tracking-[0.4em] opacity-40 block mb-4" field="tag" />
              <EditableTitle text={slide.title} className="text-[3.6rem] font-syne font-black uppercase leading-none tracking-tighter mb-6" />
              <EditableText text={slide.text} className="text-lg font-bold opacity-60 leading-snug max-w-[90%]" />
            </div>
            <div className="flex justify-between items-end">
              <CTA />
              <Instagram size={16} className="opacity-30" />
            </div>
          </div>
        );
      case 15: // Charcoal hero with lime underline — sage top strip, dark body
        return (
          <div className="absolute inset-0 flex flex-col">
            <div className="bg-[#d1d9cf] px-10 pt-8 pb-5 flex justify-between items-center">
              <Wordmark />
              <EditableTag text={slide.tag ?? 'LIVE'} className="text-[9px] font-black uppercase tracking-widest text-black/40" field="tag" />
            </div>
            <div className="flex-1 bg-[#1a1a1a] px-10 pt-6 pb-10 text-white flex flex-col justify-between">
              <div>
                <EditableTitle text={slide.title} className="font-syne uppercase leading-none mb-3" />
                <div className="w-20 h-1 bg-[#ccff00] mb-4" />
                <EditableText text={slide.text} className="text-base font-bold opacity-70 leading-snug max-w-[90%]" />
              </div>
              <div className="flex items-end justify-between">
                <CTA />
                <EditableTag text={slide.pageLabel ?? `SLIDE ${slideIdx + 1} / ${post.slides.length}`} className="text-[8px] font-black uppercase tracking-widest opacity-40" field="pageLabel" />
              </div>
            </div>
          </div>
        );
      default: // 0 — flagship Cinematic look
        return (
          <div className="absolute inset-0 p-10 flex flex-col justify-between text-black bg-[#d1d9cf]">
            <div className="flex justify-between items-start z-20">
              <Branding />
              <EditableTag text={slide.pageLabel ?? `0${slideIdx + 1}`} className="font-black text-[10px] opacity-40" field="pageLabel" />
            </div>
            <div className="flex flex-col flex-1 justify-center gap-0 mt-4 mb-4 relative">
              <div className="relative z-10">
                <EditableTitle
                  text={slide.title}
                  className={`font-syne font-black uppercase leading-none tracking-tighter mb-4 ${slide.title.length > 25 ? 'text-[1.8rem]' : 'text-[2.6rem]'}`}
                />
                {!editing && (
                  <h3 className={`absolute -top-4 left-0 w-full font-syne font-black uppercase leading-none tracking-tighter opacity-[0.02] select-none -z-10 ${slide.title.length > 25 ? 'text-[4rem]' : 'text-[6rem]'}`}>
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
              <Wordmark />
              <div className="flex gap-1.5">
                {post.slides.map((_, i) => (
                  <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === slideIdx ? 'w-8 bg-black' : 'w-2 bg-black/10'}`} />
                ))}
              </div>
            </div>
          </div>
        );
    }
  })();

  return (
    <SlideEditContext.Provider value={{ editing, isStory, updateSlide }}>
      {slideElement}
    </SlideEditContext.Provider>
  );
};

  // ==========================================================================
  // LOGIN SCREEN
  // ==========================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#080808] flex flex-col p-6">
        <div className="w-full mb-12">
          <Header inverted />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md p-8 lg:p-12 rounded-[40px] bg-white/5 border border-white/10 backdrop-blur-3xl text-center shadow-2xl"
          >
            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-[#ccff00] rounded-full flex items-center justify-center text-black mx-auto mb-8 shadow-2xl">
              <Lock size={28} />
            </div>
            <div className="mb-2 flex justify-center"><L2D_WORDMARK size="md" inverted /></div>
            <h1 className="text-2xl lg:text-3xl font-syne font-black text-white uppercase mb-2 tracking-tighter">SOCIAL STUDIO</h1>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/30 mb-8">Strategy Lab v17</p>
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="USER"
                className="bg-white/10 p-4 lg:p-5 rounded-2xl text-white font-black outline-none focus:ring-2 ring-[#ccff00] placeholder-white/30"
                onChange={(e) => setUser(e.target.value)}
              />
              <input
                type="password"
                placeholder="PASS"
                className="bg-white/10 p-4 lg:p-5 rounded-2xl text-white font-black outline-none focus:ring-2 ring-[#ccff00] placeholder-white/30"
                onChange={(e) => setPass(e.target.value)}
              />
              {authError && (
                <div className="text-red-400 text-xs font-black uppercase tracking-widest">Credenziali non valide</div>
              )}
              <button type="submit" className="py-5 lg:py-6 bg-[#ccff00] text-black rounded-2xl font-black uppercase hover:bg-white transition-all">
                Unlock Studio
              </button>
              <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mt-2">Hint: admin / admin</p>
            </form>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!selectedPost) {
    return (
      <div className="min-h-screen bg-[#f4f6f3] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-black/10 border-t-black rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs font-black uppercase tracking-widest opacity-50">Loading Studio…</p>
        </div>
      </div>
    );
  }

  const isStoryFormat = selectedPost.format === 'STORY';

  const stats = {
    total: posts.length,
    ready: posts.filter((p) => p.status === 'READY' || p.status === 'PUBLISHED').length,
    draft: posts.filter((p) => p.status === 'DRAFT').length,
    posts: posts.filter((p) => p.format === 'POST').length,
    stories: posts.filter((p) => p.format === 'STORY').length
  };

  const progressPct = stats.total > 0 ? Math.round((stats.ready / stats.total) * 100) : 0;

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
        {/* ============================== SIDEBAR ============================== */}
        <aside
          data-lenis-prevent
          className={`fixed lg:static inset-y-0 left-0 w-[300px] sm:w-[380px] bg-white border-r border-black/5 flex flex-col overflow-hidden shadow-2xl z-[70] transition-transform duration-500 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          {/* Brand */}
          <div className="p-6 lg:p-7 border-b border-black/5 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 lg:w-10 lg:h-10 bg-black rounded-xl rotate-12 flex items-center justify-center text-[#ccff00] shadow-lg">
                <Layout size={18} />
              </div>
              <div>
                <L2D_WORDMARK size="sm" />
                <span className="block text-[8px] lg:text-[9px] font-bold opacity-30 uppercase tracking-[0.25em] mt-0.5">Social Studio · v17</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleRegenerate}
                className="p-2 text-black/30 hover:text-black hover:bg-black/5 rounded-full transition-all"
                title="Genera nuovo set di contenuti"
              >
                <RefreshCcw size={15} />
              </button>
              <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2"><X size={20} /></button>
            </div>
          </div>

          {/* Progress card */}
          <div className="p-6 lg:p-7 border-b border-black/5 bg-[#fcfcfc]">
            <div className="flex justify-between items-end mb-3">
              <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Strategy Progress</span>
              <span className="text-xl font-syne font-black text-black">{progressPct}%</span>
            </div>
            <div className="w-full h-1.5 bg-black/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#ccff00]"
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.6 }}
              />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="text-center bg-black/5 rounded-xl py-2">
                <div className="text-[7px] font-black opacity-30 uppercase">Totale</div>
                <div className="text-[11px] font-black">{stats.total}</div>
              </div>
              <div className="text-center bg-[#ccff00] rounded-xl py-2">
                <div className="text-[7px] font-black opacity-50 uppercase">Ready</div>
                <div className="text-[11px] font-black">{stats.ready}</div>
              </div>
              <div className="text-center bg-black text-white rounded-xl py-2">
                <div className="text-[7px] font-black opacity-50 uppercase">Draft</div>
                <div className="text-[11px] font-black">{stats.draft}</div>
              </div>
            </div>
            <button
              onClick={exportBundle}
              className="w-full mt-5 py-3 bg-black text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#ccff00] hover:text-black transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <Download size={14} /> Download Bundle
            </button>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <button
                onClick={handleAddPost}
                className="py-2.5 border border-black/10 rounded-xl text-[9px] font-black uppercase hover:bg-black hover:text-white transition-all flex items-center justify-center gap-1.5"
              >
                <Plus size={12} /> Nuovo
              </button>
              <button
                onClick={() => setIsIgGridOpen(true)}
                className="py-2.5 border border-black/10 rounded-xl text-[9px] font-black uppercase hover:bg-black hover:text-white transition-all flex items-center justify-center gap-1.5"
              >
                <Instagram size={12} /> Feed
              </button>
            </div>
          </div>

          {/* View toggle + search + filters */}
          <div className="p-6 lg:p-7 border-b border-black/5 space-y-4">
            <div className="flex bg-black/5 p-1 rounded-xl">
              <button onClick={() => setSidebarView('list')} className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase flex items-center justify-center gap-2 transition-all ${sidebarView === 'list' ? 'bg-white shadow-sm' : 'opacity-40'}`}>
                <Grid size={14} /> List
              </button>
              <button onClick={() => setSidebarView('calendar')} className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase flex items-center justify-center gap-2 transition-all ${sidebarView === 'calendar' ? 'bg-white shadow-sm' : 'opacity-40'}`}>
                <Calendar size={14} /> Planner
              </button>
            </div>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20" size={16} />
              <input
                type="text"
                placeholder="Cerca topic, settore o pillar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black/5 p-3 lg:p-3.5 pl-10 lg:pl-11 rounded-2xl text-[10px] font-black outline-none placeholder-black/30"
              />
            </div>

            <button
              onClick={() => setShowFilters((v) => !v)}
              className="w-full flex items-center justify-between bg-black/5 px-3.5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black/10 transition-all"
            >
              <span className="flex items-center gap-2"><Filter size={12} /> Filtri</span>
              <ChevronDown size={14} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-3 overflow-hidden"
                >
                  <div>
                    <label className="text-[8px] font-black uppercase tracking-widest opacity-40 block mb-1.5">Tipologia di Hook</label>
                    <select
                      value={angleFilter}
                      onChange={(e) => setAngleFilter(e.target.value as 'all' | Angle)}
                      className="w-full bg-black/5 px-3 py-2.5 rounded-xl text-[10px] font-black outline-none"
                    >
                      <option value="all">Tutti gli hook</option>
                      {ANGLES.map((a) => (
                        <option key={a.id} value={a.id}>{a.emoji} {a.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[8px] font-black uppercase tracking-widest opacity-40 block mb-1.5">Pillar</label>
                    <select
                      value={pillarFilter}
                      onChange={(e) => setPillarFilter(e.target.value)}
                      className="w-full bg-black/5 px-3 py-2.5 rounded-xl text-[10px] font-black outline-none"
                    >
                      <option value="all">Tutti i pillar</option>
                      {['AUTHORITY','EDUCATIONAL','PROBLEM_SOLUTION','VIRAL_HOOK','CASE_STUDY','HOW_TO','MISTAKE','TESTIMONIAL','OFFER'].map((p) => (
                        <option key={p} value={p}>{p.replace('_', ' ')}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[8px] font-black uppercase tracking-widest opacity-40 block mb-1.5">Formato</label>
                    <select
                      value={formatFilter}
                      onChange={(e) => setFormatFilter(e.target.value as any)}
                      className="w-full bg-black/5 px-3 py-2.5 rounded-xl text-[10px] font-black outline-none"
                    >
                      <option value="all">Tutti i formati</option>
                      <option value="POST">Post 1:1</option>
                      <option value="STORY">Story 9:16</option>
                    </select>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* List / planner */}
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-[#fcfcfc]">
            <div className="text-[9px] font-black uppercase tracking-widest opacity-40 px-2 mb-2">
              {filteredPosts.length} {filteredPosts.length === 1 ? 'risultato' : 'risultati'}
            </div>
            {sidebarView === 'list' ? (
              <div className="space-y-2">
                {filteredPosts.map((post) => {
                  const active = selectedPost.id === post.id;
                  return (
                    <button
                      key={post.id}
                      onClick={() => {
                        setSelectedPostId(post.id);
                        setCurrentSlide(0);
                        if (window.innerWidth < 1024) setIsSidebarOpen(false);
                      }}
                      className={`w-full text-left p-4 rounded-[22px] cursor-pointer transition-all border-2 flex items-start justify-between gap-3 ${active ? 'border-black bg-black text-white shadow-xl' : 'border-transparent bg-black/5 hover:bg-black/10'}`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[8px] font-black uppercase opacity-50">#{post.id}</span>
                          <div className={`w-1 h-1 rounded-full ${active ? 'bg-white/30' : 'bg-black/20'}`} />
                          <span className={`text-[7px] font-black uppercase flex items-center gap-1 ${active ? 'text-[#ccff00]' : 'text-black/40'}`}>
                            {getPillarIcon(post.pillarName, 10)} {post.pillarName.replace('_', ' ')}
                          </span>
                          {post.format === 'STORY' && (
                            <span className={`text-[6px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${active ? 'bg-white/10 text-white/70' : 'bg-black/10 text-black/50'}`}>
                              STORY
                            </span>
                          )}
                        </div>
                        <h4 className={`text-[8px] font-black uppercase tracking-widest mb-1 ${active ? 'opacity-50' : 'opacity-40'}`}>
                          {post.angleLabel}
                        </h4>
                        <h4 className="text-[10px] font-black uppercase tracking-tight leading-tight line-clamp-2">
                          {post.slides[0].title}
                        </h4>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <div className={`w-2 h-2 rounded-full ${active ? 'bg-[#ccff00]' : 'bg-black/10'}`} />
                        <span className={`text-[6px] font-black px-1.5 py-0.5 rounded-full ${
                          post.status === 'READY' ? 'bg-[#ccff00] text-black' :
                          post.status === 'PUBLISHED' ? 'bg-blue-600 text-white' :
                          active ? 'bg-white/10 text-white/70' : 'bg-black/10 text-black/50'
                        }`}>{post.status}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-6 gap-1.5">
                {filteredPosts.map((post) => {
                  const active = selectedPost.id === post.id;
                  return (
                    <button
                      key={post.id}
                      onClick={() => {
                        setSelectedPostId(post.id);
                        setCurrentSlide(0);
                        if (window.innerWidth < 1024) setIsSidebarOpen(false);
                      }}
                      className={`aspect-square rounded-lg border flex flex-col items-center justify-center transition-all ${active ? 'bg-[#ccff00] border-black scale-110 z-10' : 'bg-white border-black/5 hover:border-black/20'}`}
                      title={post.slides[0].title}
                    >
                      <span className="text-[9px] font-black">{post.id}</span>
                      <div className="mt-1 scale-75 opacity-60">{getPillarIcon(post.pillarName, 10)}</div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </aside>

        {/* ============================== MAIN CANVAS ============================== */}
        <main className="flex-1 flex flex-col bg-[#ecedeb] overflow-hidden relative">
          {/* Brand header */}
          <div className="w-full bg-white border-b border-black/5 p-4 lg:p-5">
            <Header />
          </div>

          {/* Toolbar */}
          <header className="p-4 bg-white border-b border-black/5 flex flex-col sm:flex-row gap-3 justify-between items-center z-50 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2 lg:gap-3 w-full sm:w-auto overflow-x-auto no-scrollbar">
              <div className="flex bg-black/5 p-1 rounded-xl shrink-0">
                <button
                  onClick={() => updateFormat('POST')}
                  className={`px-3 lg:px-4 py-2 rounded-lg text-[10px] font-black uppercase flex items-center gap-1.5 transition-all ${selectedPost.format === 'POST' ? 'bg-white shadow-sm' : 'opacity-40'}`}
                >
                  <Instagram size={13} /> Post
                </button>
                <button
                  onClick={() => updateFormat('STORY')}
                  className={`px-3 lg:px-4 py-2 rounded-lg text-[10px] font-black uppercase flex items-center gap-1.5 transition-all ${selectedPost.format === 'STORY' ? 'bg-white shadow-sm' : 'opacity-40'}`}
                >
                  <Smartphone size={13} /> Story
                </button>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase flex items-center gap-1.5 transition-all shrink-0 ${isEditing ? 'bg-[#ccff00] text-black' : 'bg-black text-white'}`}
              >
                {isEditing ? <Check size={13} /> : <Edit3 size={13} />} {isEditing ? 'Salva' : 'Edit'}
              </button>
              <button onClick={() => setIsPreviewOpen(true)} className="p-2 rounded-xl border border-black/5 bg-white hover:bg-black hover:text-white transition-all shadow-sm shrink-0" title="Anteprima fullscreen">
                <Maximize2 size={15} />
              </button>
              <button onClick={() => setIsIgGridOpen(true)} className="p-2 rounded-xl border border-black/5 bg-white hover:bg-black hover:text-white transition-all shadow-sm shrink-0" title="Anteprima feed Instagram">
                <Instagram size={15} />
              </button>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={() => { navigator.clipboard.writeText(`${selectedPost.caption}\n\n${selectedPost.hashtags}`); }}
                className="flex-1 sm:flex-none px-4 py-2.5 bg-white border border-black/10 rounded-xl font-black text-[10px] uppercase flex items-center justify-center gap-1.5 hover:bg-black hover:text-white transition-all"
              >
                <Copy size={13} /> Copia
              </button>
              <button
                onClick={exportSingleImage}
                className="flex-1 sm:flex-none px-4 py-2.5 bg-black text-white rounded-xl font-black text-[10px] uppercase flex items-center justify-center gap-1.5 hover:bg-[#ccff00] hover:text-black transition-all shadow-lg"
              >
                <Download size={13} /> Export PNG
              </button>
            </div>
          </header>

          {/* Variant + Status bar */}
          <div className="bg-white border-b border-black/5 px-6 py-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 z-40 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-4 shrink-0">
              <div className="flex flex-col">
                <span className="text-[8px] font-black opacity-30 uppercase tracking-widest leading-none mb-1.5">Layout Variant ({selectedPost.styleVariant + 1}/16)</span>
                <div className="flex gap-1.5 flex-wrap">
                  {Array.from({ length: 16 }, (_, v) => (
                    <button
                      key={v}
                      onClick={() => updateStyleVariant(v)}
                      className={`w-6 h-6 rounded-lg text-[9px] font-black transition-all ${selectedPost.styleVariant === v ? 'bg-[#ccff00] text-black shadow-lg scale-110' : 'bg-black/5 text-black/40 hover:bg-black/10'}`}
                      title={`Variant ${v}`}
                    >{v}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <div className="flex flex-col items-end">
                <span className="text-[8px] font-black opacity-30 uppercase tracking-widest leading-none mb-1.5">Workflow</span>
                <div className="flex bg-black/5 p-1 rounded-xl">
                  {(['DRAFT', 'READY', 'PUBLISHED'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus(s)}
                      className={`px-3 py-1.5 rounded-lg text-[8px] font-black uppercase transition-all ${
                        selectedPost.status === s
                          ? (s === 'READY' ? 'bg-[#ccff00] text-black shadow-sm' :
                             s === 'PUBLISHED' ? 'bg-blue-600 text-white shadow-sm' :
                             'bg-black text-white shadow-sm')
                          : 'opacity-40'
                      }`}
                    >{s}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Slide stage + caption */}
          <div data-lenis-prevent className="flex-1 overflow-y-auto bg-[#f0f2ef] flex flex-col items-center p-6 lg:p-10 pb-40">
            <div className="flex flex-col items-center gap-8 lg:gap-10 w-full max-w-[860px]">
              <div className="relative group w-full flex justify-center">
                <div className="relative scale-[0.55] xs:scale-[0.65] sm:scale-75 md:scale-90 lg:scale-100 origin-center">
                  <div
                    ref={slideRef}
                    className={`relative transition-all duration-500 ease-in-out ${
                      isStoryFormat
                        ? 'w-[320px] h-[568px] sm:w-[360px] sm:h-[640px]'
                        : 'w-[450px] h-[450px] sm:w-[500px] sm:h-[500px]'
                    } bg-[#d1d9cf] rounded-[32px] sm:rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.1)] overflow-hidden isolate`}
                  >
                    <div className="absolute inset-0 overflow-hidden">
                      {renderSlideContent(selectedPost, currentSlide, { isStory: isStoryFormat })}
                    </div>
                  </div>
                </div>
                <div className="absolute inset-y-0 -left-4 sm:-left-12 -right-4 sm:-right-12 flex items-center justify-between pointer-events-none px-2 z-20">
                  <button
                    onClick={() => setCurrentSlide((prev) => Math.max(0, prev - 1))}
                    disabled={currentSlide === 0}
                    className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white shadow-xl flex items-center justify-center text-black pointer-events-auto hover:scale-110 disabled:opacity-30 disabled:hover:scale-100 transition-all border border-black/5"
                  ><ChevronLeft size={20} /></button>
                  <button
                    onClick={() => setCurrentSlide((prev) => Math.min(selectedPost.slides.length - 1, prev + 1))}
                    disabled={currentSlide === selectedPost.slides.length - 1}
                    className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white shadow-xl flex items-center justify-center text-black pointer-events-auto hover:scale-110 disabled:opacity-30 disabled:hover:scale-100 transition-all border border-black/5"
                  ><ChevronRight size={20} /></button>
                </div>
              </div>

              {/* Slide thumbnails */}
              <div className="flex gap-2 items-center justify-center flex-wrap">
                {selectedPost.slides.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase transition-all ${i === currentSlide ? 'bg-black text-white' : 'bg-white text-black/40 hover:text-black border border-black/10'}`}
                  >SLIDE {i + 1}</button>
                ))}
              </div>

              {/* Caption Panel */}
              <div className="w-full bg-white rounded-[32px] lg:rounded-[40px] p-6 lg:p-9 shadow-2xl border border-black/5">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30">Caption Pronta da Pubblicare</span>
                      <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest opacity-50">
                        <FileText size={12} /> {selectedPost.caption.length} caratteri
                      </span>
                    </div>
                    {isEditing ? (
                      <textarea
                        value={selectedPost.caption}
                        onChange={(e) => updateCaption(e.target.value)}
                        className="w-full bg-black/5 p-5 lg:p-6 rounded-2xl lg:rounded-3xl text-[13px] lg:text-sm font-bold leading-relaxed text-black/70 resize-none outline-none border border-black/10"
                        rows={10}
                      />
                    ) : (
                      <div className="p-5 lg:p-7 bg-black/5 rounded-[22px] lg:rounded-[28px] text-[13px] lg:text-sm font-bold leading-relaxed text-black/70 whitespace-pre-wrap">
                        {selectedPost.caption}
                      </div>
                    )}
                    <div className="mt-3 px-4 py-3 rounded-2xl bg-black text-[#ccff00] text-[10px] font-black uppercase tracking-widest break-words">
                      {selectedPost.hashtags}
                    </div>
                  </div>
                  <div className="w-full lg:w-[260px] xl:w-[300px]">
                    <div className="p-5 lg:p-6 bg-black text-white rounded-2xl lg:rounded-3xl mb-3 border border-[#ccff00]/30">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <span className="text-[8px] lg:text-[9px] font-black uppercase opacity-40 block mb-1">Pillar</span>
                          <div className="flex items-center gap-1.5">
                            {getPillarIcon(selectedPost.pillarName, 12)}
                            <span className="font-black text-[8px] lg:text-[9px] text-[#ccff00] uppercase tracking-tighter">
                              {selectedPost.pillarName.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[8px] lg:text-[9px] font-black uppercase opacity-40 block mb-1">Slide</span>
                          <span className="font-black text-xs text-white">{currentSlide + 1}/{selectedPost.slides.length}</span>
                        </div>
                      </div>
                      <div className="mb-3">
                        <span className="text-[8px] font-black uppercase opacity-40 block mb-1">Hook</span>
                        <span className="text-[10px] font-black text-white">{selectedPost.angleLabel}</span>
                      </div>
                      <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-[#ccff00] transition-all" style={{ width: `${((currentSlide + 1) / selectedPost.slides.length) * 100}%` }} />
                      </div>
                    </div>
                    <button
                      onClick={() => updateStatus(selectedPost.status === 'READY' ? 'DRAFT' : 'READY')}
                      className={`w-full py-3.5 lg:py-4 rounded-2xl font-black uppercase text-[10px] lg:text-[11px] tracking-[0.2em] transition-all shadow-lg ${
                        selectedPost.status === 'READY' ? 'bg-black text-white hover:bg-[#ccff00] hover:text-black' : 'bg-[#ccff00] text-black hover:bg-black hover:text-white'
                      }`}
                    >
                      {selectedPost.status === 'READY' ? '✓ Marca come Draft' : 'Marca come Ready'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ============================== FULLSCREEN PREVIEW ============================== */}
      <AnimatePresence>
        {isPreviewOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] bg-[#d1d9cf] flex flex-col items-center justify-center p-6 lg:p-12"
          >
            <button
              onClick={() => setIsPreviewOpen(false)}
              className="absolute top-6 lg:top-12 right-6 lg:right-12 text-black opacity-40 hover:opacity-100 transition-all hover:rotate-90 duration-300"
            ><X size={32} className="lg:w-12 lg:h-12" /></button>
            <div className={`relative scale-[0.6] sm:scale-75 md:scale-90 lg:scale-100 ${isStoryFormat ? 'h-[70vh] aspect-[9/16]' : 'w-[90vw] max-w-[600px] lg:w-[700px] aspect-square'} bg-[#d1d9cf] rounded-[40px] lg:rounded-[60px] overflow-hidden shadow-2xl border border-black/5 isolate`}>
              <div className="absolute inset-0 overflow-hidden">
                {renderSlideContent(selectedPost, currentSlide, { isStory: isStoryFormat })}
              </div>
            </div>
            <div className="mt-8 lg:mt-12 flex gap-4 lg:gap-8">
              <button onClick={() => setCurrentSlide((prev) => Math.max(0, prev - 1))} className="w-14 h-14 lg:w-20 lg:h-20 bg-white/5 rounded-full text-black hover:bg-black hover:text-white transition-all flex items-center justify-center border border-black/10"><ChevronLeft size={32} /></button>
              <button onClick={() => setCurrentSlide((prev) => Math.min(selectedPost.slides.length - 1, prev + 1))} className="w-14 h-14 lg:w-20 lg:h-20 bg-white/5 rounded-full text-black hover:bg-black hover:text-white transition-all flex items-center justify-center border border-black/10"><ChevronRight size={32} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================== INSTAGRAM GRID PREVIEW ============================== */}
      <AnimatePresence>
        {isIgGridOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-2xl flex flex-col items-center p-4 lg:p-8 overflow-y-auto"
          >
            <div className="w-full max-w-[420px] bg-white rounded-[32px] overflow-hidden shadow-2xl my-auto">
              {/* IG Header */}
              <div className="p-4 flex items-center justify-between border-b border-black/5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#ccff00] via-[#1a1a1a] to-blue-600 p-[2px]">
                    <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-blue-600 rounded-full" />
                    </div>
                  </div>
                  <div>
                    <div className="font-syne font-black text-sm uppercase tracking-tight">link2digital</div>
                    <div className="text-[10px] font-bold opacity-50">Web Agency · Milano</div>
                  </div>
                </div>
                <button onClick={() => setIsIgGridOpen(false)} className="p-2 rounded-full hover:bg-black/5"><X size={20} /></button>
              </div>
              {/* Stats */}
              <div className="grid grid-cols-3 py-4 text-center border-b border-black/5">
                <div><div className="font-black text-sm">{stats.total}</div><div className="text-[10px] font-bold opacity-50">post</div></div>
                <div><div className="font-black text-sm">2.4k</div><div className="text-[10px] font-bold opacity-50">follower</div></div>
                <div><div className="font-black text-sm">312</div><div className="text-[10px] font-bold opacity-50">following</div></div>
              </div>
              {/* Bio */}
              <div className="px-5 py-3 border-b border-black/5">
                <div className="font-black text-xs mb-1">Link2Digital · Web Agency d'élite</div>
                <div className="text-[11px] leading-snug opacity-70">Crafting digital identities for premium brands.<br />Milano · Disponibili in tutta Italia.</div>
                <div className="text-[11px] font-black text-blue-600 mt-1">link2digital.it</div>
              </div>
              {/* Grid */}
              <div className="grid grid-cols-3 gap-[2px] bg-black/5">
                {posts.filter((p) => p.format === 'POST').slice(0, 30).map((post) => (
                  <button
                    key={post.id}
                    onClick={() => { setSelectedPostId(post.id); setCurrentSlide(0); setIsIgGridOpen(false); }}
                    className="aspect-square relative overflow-hidden bg-[#d1d9cf] group"
                  >
                    <div className="absolute inset-0 scale-[0.36] origin-top-left" style={{ width: '278%', height: '278%' }}>
                      <div className="relative w-[500px] h-[500px]">
                        {renderSlideContent(post, 0, { isSmall: false, isEditingOverride: false })}
                      </div>
                    </div>
                    <div className="absolute inset-0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="text-white text-[10px] font-black uppercase tracking-widest">#{post.id}</div>
                    </div>
                    {post.status === 'READY' && (
                      <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#ccff00] shadow-lg" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden batch renderer */}
      <div className="fixed -left-[3000px] top-0 pointer-events-none">
        <div
          ref={batchRef}
          className={`${batchPost?.post.format === 'STORY' ? 'w-[360px] h-[640px]' : 'w-[500px] h-[500px]'} bg-[#d1d9cf] relative overflow-hidden isolate`}
        >
          {batchPost && renderSlideContent(batchPost.post, batchPost.sIdx, { isStory: batchPost.post.format === 'STORY', isEditingOverride: false })}
        </div>
      </div>

      {/* Export progress */}
      <AnimatePresence>
        {exportProgress && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100000] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-6"
          >
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[40px] p-10 lg:p-14 max-w-md w-full text-center shadow-2xl">
              <div className="w-24 h-24 bg-[#ccff00] rounded-full flex items-center justify-center text-black mx-auto mb-8 shadow-2xl relative">
                <Download size={40} className="animate-bounce" />
                <div className="absolute inset-0 rounded-full border-4 border-black/10 border-t-black animate-spin" />
              </div>
              <h2 className="text-2xl lg:text-3xl font-syne font-black uppercase mb-4 tracking-tighter">Generazione Bundle</h2>
              <p className="text-black/40 font-bold mb-10 text-sm leading-relaxed">Stiamo preparando il pacchetto completo dei tuoi post.</p>
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

      {/* Regenerate progress */}
      <AnimatePresence>
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100000] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-[#ccff00] rounded-full flex items-center justify-center text-black mx-auto mb-6 shadow-2xl">
                <Wand2 size={32} className="animate-pulse" />
              </div>
              <div className="text-white font-syne font-black uppercase text-2xl mb-2 tracking-tighter">Genero contenuti</div>
              <div className="text-white/50 text-xs font-black uppercase tracking-widest">Nuovo set strategico in arrivo…</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
