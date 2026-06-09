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
const LS_KEY = 'l2d_social_posts_v7';
const LS_SEED = 'l2d_social_seed_v7';

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
  updateSlide: (field: keyof Slide, val: any) => void;
  slide: Slide;
} | null>(null);

const fitTitleClass = (text: string, className: string, isStory: boolean): string => {
  const longestWord = text.split(/\s+/).reduce((m, w) => Math.max(m, w.length), 0);
  const totalLen = text.length;
  const stripped = className.replace(/text-\[[^\]]+\]|text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl)/g, '').trim();
  let sizeClass: string;
  if (longestWord >= 16 || totalLen >= 50) sizeClass = isStory ? 'text-[1.35rem]' : 'text-[1.2rem]';
  else if (longestWord >= 12 || totalLen >= 35) sizeClass = isStory ? 'text-[1.65rem]' : 'text-[1.5rem]';
  else if (longestWord >= 9 || totalLen >= 22) sizeClass = isStory ? 'text-[1.95rem]' : 'text-[1.8rem]';
  else if (totalLen >= 12) sizeClass = isStory ? 'text-[2.3rem]' : 'text-[2.1rem]';
  else sizeClass = isStory ? 'text-[2.7rem]' : 'text-[2.5rem]';
  const tracking = stripped.replace(/tracking-tighter/g, 'tracking-tight');
  return `${sizeClass} ${tracking} whitespace-normal break-words max-w-full`;
};

const EditableTitle = React.memo(({ text, className }: { text: string; className: string }) => {
  const ctx = React.useContext(SlideEditContext);
  if (!ctx) return null;
  const { editing, isStory, updateSlide, slide } = ctx;
  
  if (slide.hideTitle) {
    if (!editing) return null;
    return (
      <button
        onClick={() => updateSlide('hideTitle', false)}
        className="px-3 py-1 border border-dashed border-black/30 hover:border-black/60 text-black/50 hover:text-black rounded text-[10px] font-bold my-2 cursor-pointer transition-all inline-block"
      >
        + Aggiungi Titolo
      </button>
    );
  }
  
  const finalClass = fitTitleClass(text, className, isStory);
  return (
    <div className="relative group/title-field w-full">
      {editing && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            updateSlide('hideTitle', true);
          }}
          className="absolute -top-3 -right-3 w-5 h-5 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center text-[9px] font-black shadow-md z-30 transition-all cursor-pointer opacity-0 group-hover/title-field:opacity-100"
          title="Nascondi Titolo"
        >
          ✕
        </button>
      )}
      {!editing ? (
        <h3 className={finalClass}>{text}</h3>
      ) : (
        <textarea
          value={text}
          onChange={(e) => updateSlide('title', e.target.value)}
          className={`${finalClass} bg-white/10 border-b border-[#ccff00] outline-none resize-none w-full`}
          rows={2}
        />
      )}
    </div>
  );
});
EditableTitle.displayName = 'EditableTitle';

const EditableText = React.memo(({ text, className }: { text: string; className: string }) => {
  const ctx = React.useContext(SlideEditContext);
  if (!ctx) return null;
  const { editing, updateSlide, slide } = ctx;

  if (slide.hideText) {
    if (!editing) return null;
    return (
      <button
        onClick={() => updateSlide('hideText', false)}
        className="px-3 py-1 border border-dashed border-black/30 hover:border-black/60 text-black/50 hover:text-black rounded text-[10px] font-bold my-2 cursor-pointer transition-all inline-block"
      >
        + Aggiungi Descrizione
      </button>
    );
  }

  return (
    <div className="relative group/text-field w-full">
      {editing && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            updateSlide('hideText', true);
          }}
          className="absolute -top-3 -right-3 w-5 h-5 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center text-[9px] font-black shadow-md z-30 transition-all cursor-pointer opacity-0 group-hover/text-field:opacity-100"
          title="Nascondi Descrizione"
        >
          ✕
        </button>
      )}
      {!editing ? (
        <p className={`${className} whitespace-normal max-w-full break-words`}>{text}</p>
      ) : (
        <textarea
          value={text}
          onChange={(e) => updateSlide('text', e.target.value)}
          className={`${className} max-w-full bg-white/10 border-b border-[#ccff00] outline-none resize-none w-full break-words`}
          rows={3}
        />
      )}
    </div>
  );
});
EditableText.displayName = 'EditableText';

const getHideFlagKey = (field: keyof Slide): keyof Slide | null => {
  if (field === 'tag') return 'hideTag';
  if (field === 'tag2') return 'hideTag2';
  if (field === 'subTitle') return 'hideSubTitle';
  if (field === 'pageLabel') return 'hidePageLabel';
  return null;
};

const getFieldNameLabel = (field: keyof Slide): string => {
  if (field === 'tag') return 'Tag';
  if (field === 'tag2') return 'Tag 2';
  if (field === 'subTitle') return 'Sottotitolo';
  if (field === 'pageLabel') return 'Pagina';
  return String(field);
};

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
  const { editing, updateSlide, slide } = ctx;
  
  const hideKey = getHideFlagKey(field);
  
  if (hideKey && slide[hideKey]) {
    if (!editing) return null;
    return (
      <button
        onClick={(e) => {
          e.stopPropagation();
          updateSlide(hideKey, false);
        }}
        className="px-2 py-0.5 border border-dashed border-black/30 hover:border-black/60 text-[8px] text-black/50 hover:text-black rounded cursor-pointer transition-all inline-block my-1 font-mono uppercase"
      >
        + {getFieldNameLabel(field)}
      </button>
    );
  }

  const chWidth = text ? Math.max(1, text.length) : 3;

  return (
    <div className="relative group/tag-field inline-flex items-center">
      {editing && hideKey && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            updateSlide(hideKey, true);
          }}
          className="absolute -top-2.5 -right-2.5 w-4 h-4 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center text-[7px] font-black shadow-md z-30 transition-all cursor-pointer opacity-0 group-hover/tag-field:opacity-100"
          title={`Nascondi ${getFieldNameLabel(field)}`}
        >
          ✕
        </button>
      )}
      {!editing ? (
        <span className={`${className} inline-block break-words`} style={style}>{text}</span>
      ) : (
        <input
          type="text"
          value={text}
          onChange={(e) => updateSlide(field, e.target.value)}
          className={`${className} bg-white/10 border-b border-[#ccff00] outline-none inline-block text-center break-words`}
          style={{
            ...style,
            width: `${chWidth}ch`,
            minWidth: '2ch',
          }}
          onClick={(e) => e.stopPropagation()}
        />
      )}
    </div>
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
  const { editing, updateSlide, slide } = ctx;

  if (slide.hideNumber) {
    if (!editing) return null;
    return (
      <div className="absolute top-2 right-24 bg-black/80 text-white p-2 rounded-lg border border-dashed border-[#ccff00]/40 flex items-center justify-center z-50 text-[10px]">
        <button
          onClick={(e) => {
            e.stopPropagation();
            updateSlide('hideNumber', false);
          }}
          className="text-[#ccff00] font-bold cursor-pointer hover:underline"
        >
          + Mostra Numero
        </button>
      </div>
    );
  }

  return !editing ? (
    <div className={`${className} break-words`}>{text}</div>
  ) : (
    <div className="absolute top-2 right-12 bg-black/80 text-white p-2 rounded-lg border border-[#ccff00]/40 flex flex-col gap-1 z-50 text-[10px] opacity-100 select-all normal-case font-sans">
      <div className="flex justify-between items-center gap-4">
        <span className="text-[9px] text-[#ccff00] font-bold">{label}:</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            updateSlide('hideNumber', true);
          }}
          className="text-red-500 hover:text-red-400 font-black cursor-pointer text-[9px]"
          title="Nascondi Numero"
        >
          ✕
        </button>
      </div>
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

  const updateSlideField = (slideIndex: number, field: keyof Slide, value: any) => {
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
      const hasCta = !slide.hideCta;
      const ctaText = slide.cta ?? 'GET STARTED';

      if (!hasCta) {
        if (!editing) return null;
        return (
          <button
            onClick={() => updateSlide('hideCta', false)}
            className={`px-4 py-2 border-2 border-dashed border-black/30 hover:border-black/60 text-black/50 hover:text-black rounded-full font-black uppercase tracking-widest flex items-center gap-2 mt-4 self-start cursor-pointer transition-all ${isSmall ? 'text-[7px]' : 'text-[9px]'}`}
            title="Mostra Pulsante"
          >
            + Aggiungi Pulsante
          </button>
        );
      }

      return (
        <div className="flex items-center gap-2 mt-4 self-start group/cta relative">
          <div className={`px-5 py-2 bg-[#ccff00] text-black rounded-full font-black uppercase tracking-widest flex items-center gap-2 shadow-xl ${isSmall ? 'text-[7px]' : 'text-[9px]'}`}>
            <EditableTag text={ctaText} className="" field="cta" /> <ArrowRight size={isSmall ? 8 : 11} />
          </div>
          {editing && !isSmall && (
            <button
              onClick={() => updateSlide('hideCta', true)}
              className="w-5 h-5 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center text-[9px] font-black shadow-md transition-all ml-1 shrink-0 cursor-pointer"
              title="Nascondi Pulsante"
            >
              ✕
            </button>
          )}
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
      return (
        <div
          className={`inline-flex items-center bg-black text-white rounded-full shrink-0 w-fit ${
            isSmall ? 'gap-1 px-2 py-1' : 'gap-2 px-3 py-1.5'
          }`}
        >
          <span className={`${isSmall ? 'w-2 h-2' : 'w-3 h-3'} rounded-full bg-blue-500 shrink-0`} />
          <span
            className={`font-extrabold uppercase leading-none ${isSmall ? 'text-[7px]' : 'text-[11px]'}`}
            style={{ letterSpacing: '0.02em' }}
          >
            LINK2DIGITAL
          </span>
        </div>
      );
    };
    // Backward-compat alias so variant code can still call {Wordmark()} without rewriting all 16
    const Wordmark = () => LogoPill();

    const updateSlide = (field: keyof Slide, val: any) => updateSlideField(slideIdx, field, val);

    const slideElement = (() => {
      switch (variant) {
      case 1: // Split sage / charcoal
        return (
          <div className="absolute inset-0 flex flex-col">
            <div className="flex-1 bg-[#d1d9cf] p-10 flex flex-col justify-between text-black">
              {Wordmark()}
              <EditableTitle text={slide.title} className={`${titleSize} font-syne font-black uppercase leading-none tracking-tighter`} />
            </div>
            <div className="flex-1 bg-[#1a1a1a] p-10 flex flex-col justify-center text-white relative">
              <EditableText text={slide.text} className={`${bodySize} font-bold opacity-60 leading-snug max-w-[90%]`} />
              {CTA()}
            </div>
          </div>
        );
      case 2: // Big ghost number
        return (
          <div className="absolute inset-0 p-10 flex flex-col justify-between text-black bg-[#d1d9cf]">
            <EditableNumber text={slide.number ?? `0${slideIdx + 1}`} className="absolute -top-10 -right-10 text-[20rem] font-syne font-black opacity-[0.05] leading-none select-none" field="number" label="BG NUMBER" />
            <div className="z-10">
              {Branding()}
              <EditableTitle text={slide.title} className={`${titleSize} font-syne font-black uppercase leading-none tracking-tighter mb-6`} />
              <EditableText text={slide.text} className={`${bodySize} font-bold opacity-60 leading-snug max-w-[80%]`} />
            </div>
            <div className="flex items-end justify-between z-10">
              {CTA()}
              {Wordmark()}
            </div>
          </div>
        );
      case 3: // Centered minimal
        return (
          <div className="absolute inset-0 p-10 flex flex-col items-center justify-center text-center bg-[#d1d9cf]">
            {Wordmark()}
            <div className="w-12 h-1 px-1 bg-black my-8 rounded-full" />
            <EditableTitle text={slide.title} className="text-[2.2rem] font-syne font-black uppercase leading-none tracking-tighter mb-6 max-w-[85%]" />
            <EditableText text={slide.text} className="text-sm font-bold opacity-40 max-w-[75%] mb-8 leading-none" />
            {CTA()}
          </div>
        );
      case 4: // 4-cell grid
        return (
          <div className="absolute inset-0 p-6 grid grid-cols-2 grid-rows-2 gap-3 text-black bg-[#d1d9cf]">
            <div className="bg-white/40 rounded-2xl p-4 flex flex-col justify-between shadow-sm">
              {Wordmark()}
              <div className="w-5 h-5 rounded-full bg-[#ccff00]" />
            </div>
            <div className="bg-white/40 rounded-2xl p-4 flex items-center justify-center">
              <EditableText text={slide.text} className="text-[9px] font-bold opacity-50 leading-tight italic text-center" />
            </div>
            <div className="bg-[#1a1a1a] text-white rounded-[24px] p-5 col-span-2 flex flex-col justify-between shadow-lg">
              <EditableTitle text={slide.title} className="text-[2rem] font-syne font-black uppercase leading-none tracking-tighter mb-2 text-[#ccff00]" />
              <div className="flex justify-between items-end">
                {CTA()}
              </div>
            </div>
          </div>
        );
      case 5: // Diagonal block
        return (
          <div className="absolute inset-0 bg-[#d1d9cf] overflow-hidden flex flex-col justify-center p-10">
            <div className="absolute inset-0 bg-[#1a1a1a] origin-bottom-right -rotate-12 translate-y-1/2 opacity-10" />
            <div className="z-10">
              {Wordmark()}
              <EditableTitle text={slide.title} className="text-[2.8rem] font-syne font-black uppercase leading-none tracking-tighter my-6" />
              <EditableText text={slide.text} className="text-base font-bold opacity-70 leading-snug max-w-[85%] mb-8" />
              {CTA()}
            </div>
          </div>
        );
      case 6: // Pill header
        return (
          <div className="absolute inset-0 p-10 bg-[#d1d9cf] flex flex-col gap-8">
            <div className="flex items-center justify-between">{Wordmark()}<EditableTag text={slide.pageLabel ?? `0${slideIdx + 1}/${post.slides.length}`} className="text-[9px] font-black opacity-30" field="pageLabel" /></div>
            <div className="bg-black text-white px-8 py-5 rounded-[25px] shadow-2xl">
              <EditableTitle text={slide.title} className="text-[1.8rem] font-syne font-black uppercase leading-tight tracking-tighter" />
            </div>
            <div className="px-2">
              <EditableText text={slide.text} className="text-base font-bold opacity-60 leading-snug mb-8" />
              {CTA()}
            </div>
          </div>
        );
      case 7: // Left border accent
        return (
          <div className="absolute inset-0 p-10 bg-[#d1d9cf] flex flex-col justify-end">
            {Wordmark()}
            <div className="flex gap-4 mt-auto items-stretch">
              <div className="w-1.5 bg-[#ccff00] rounded-full shrink-0" />
              <div className="flex flex-col gap-3">
                <EditableTag text={slide.tag ?? 'Performance Design'} className="text-[9px] font-black uppercase tracking-widest opacity-20" field="tag" />
                <EditableTitle text={slide.title} className="text-[2.4rem] font-syne font-black uppercase leading-none tracking-tighter" />
                <EditableText text={slide.text} className="text-sm font-bold opacity-60 leading-tight max-w-[85%]" />
                {CTA()}
              </div>
            </div>
          </div>
        );
      case 8: // Dark inner card — pill on sage outer top strip
        return (
          <div className="absolute inset-0 bg-[#d1d9cf] p-6 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              {Wordmark()}
              <div className="w-2 h-2 bg-black rounded-full" />
            </div>
            <div className="flex-1 bg-[#1a1a1a] rounded-[28px] p-7 flex flex-col justify-between text-white shadow-2xl border-2 border-[#ccff00]/20">
              <EditableTag text={slide.tag ?? post.pillarName.replace('_', ' ')} className="text-[8px] font-black tracking-widest opacity-40 uppercase text-[#ccff00]" field="tag" />
              <div>
                <EditableTitle text={slide.title} className="font-syne uppercase leading-none mb-4" />
                <EditableText text={slide.text} className="text-sm font-bold opacity-60 leading-snug" />
              </div>
              {CTA()}
            </div>
          </div>
        );
      case 9: // Big quote with marks
        return (
          <div className="absolute inset-0 p-10 bg-[#d1d9cf] flex flex-col justify-between">
            <div className="flex justify-between">{Wordmark()}<EditableTag text={slide.tag ?? post.angleLabel} className="text-[9px] font-black opacity-30" field="tag" /></div>
            <div className="relative">
              <span className="absolute -top-12 -left-2 text-[12rem] font-syne font-black opacity-10 leading-none select-none">"</span>
              <EditableTitle text={slide.title} className="text-[2.4rem] font-syne font-black uppercase leading-none tracking-tighter mb-6 relative z-10" />
              <EditableText text={slide.text} className="text-base font-bold opacity-60 leading-snug max-w-[85%] relative z-10" />
            </div>
            <div className="flex justify-between items-end">
              {CTA()}
              <EditableTag text={slide.pageLabel ?? `#${slideIdx + 1}`} className="text-[9px] font-black opacity-30" field="pageLabel" />
            </div>
          </div>
        );
      case 10: // Brutalist outlined
        return (
          <div className="absolute inset-2 p-8 bg-[#d1d9cf] flex flex-col justify-between border-[6px] border-black/15 rounded-[28px] text-black">
            <div className="flex justify-between items-start">
              <div className="px-3 py-1 bg-black text-[#ccff00] rounded-full text-[8px] font-black uppercase tracking-widest">
                <EditableTag text={slide.tag ?? post.pillarName.replace('_', ' ')} className="" field="tag" />
              </div>
              {Wordmark()}
            </div>
            <div>
              <EditableTitle text={slide.title} className="font-syne font-black uppercase leading-none tracking-tighter mb-4 text-[3.2rem]" />
              <EditableText text={slide.text} className="text-base font-bold opacity-60 leading-snug max-w-[90%]" />
            </div>
            <div className="flex justify-between items-end">
              {CTA()}
              <EditableTag text={slide.pageLabel ?? `SLIDE ${slideIdx + 1}`} className="text-[9px] font-black opacity-30" field="pageLabel" />
            </div>
          </div>
        );
      case 11: // Lime block top
        return (
          <div className="absolute inset-3 bg-[#d1d9cf] rounded-[28px] overflow-hidden flex flex-col">
            <div className="h-[35%] bg-[#ccff00] p-6 flex flex-col justify-between text-black rounded-b-[24px]">
              {Wordmark()}
              <EditableTitle text={slide.title} className="text-[2.2rem] font-syne font-black uppercase leading-none tracking-tighter" />
            </div>
            <div className="flex-1 p-8 flex flex-col justify-between">
              <EditableText text={slide.text} className="text-base font-bold opacity-60 leading-snug max-w-[90%]" />
              {CTA()}
            </div>
          </div>
        );
      case 12: // Number-driven big stat — sage top strip with pill, dark body
        return (
          <div className="absolute inset-3 bg-[#1a1a1a] rounded-[28px] text-white flex flex-col justify-between p-8 overflow-hidden border border-white/5">
            <div className="flex justify-between items-center pb-4">
              {Wordmark()}
              <EditableTag text={slide.tag ?? 'METRIC'} className="text-[9px] font-black tracking-widest text-[#ccff00]" field="tag" />
            </div>
            <div className="w-full h-0.5 bg-white/10 rounded-full shrink-0" />
            <div className="my-auto pt-4">
              <EditableNumber text={slide.number ?? `0${slideIdx + 1}`} className="text-[5rem] font-syne text-[#ccff00] leading-none tracking-tight mb-2" field="number" label="STAT" />
              <EditableTitle text={slide.title} className="font-syne uppercase leading-none mb-3 text-[1.8rem]" />
              <EditableText text={slide.text} className="text-xs font-bold opacity-60 leading-snug max-w-[90%]" />
            </div>
            {CTA()}
          </div>
        );
      case 13: // Editorial card stack
        return (
          <div className="absolute inset-0 bg-[#d1d9cf] p-6 flex flex-col gap-3">
            <div className="bg-white rounded-[24px] p-5 flex justify-between items-center shadow-sm">
              {Wordmark()}
              <EditableTag text={slide.tag ?? post.angleLabel} className="text-[9px] font-black uppercase tracking-widest opacity-40" field="tag" />
            </div>
            <div className="flex-1 bg-black rounded-[28px] p-7 flex flex-col justify-between text-white">
              <EditableTag text={slide.tag2 ?? post.pillarName.replace('_', ' ')} className="text-[9px] font-black uppercase tracking-widest text-[#ccff00]" field="tag2" />
              <EditableTitle text={slide.title} className="text-[2.2rem] font-syne font-black uppercase leading-none tracking-tighter" />
              <EditableText text={slide.text} className="text-sm font-bold opacity-60 leading-snug max-w-[90%]" />
            </div>
            {!slide.hideCta ? (
              <div className="bg-[#ccff00] rounded-full p-4 flex justify-between items-center text-black relative group/cta shrink-0">
                <EditableTag text={slide.cta ?? 'GET STARTED'} className="text-[10px] font-black uppercase tracking-widest" field="cta" />
                <ArrowRight size={16} />
                {editing && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateSlide('hideCta', true);
                    }}
                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center text-[9px] font-black shadow-md transition-all z-30 cursor-pointer"
                    title="Nascondi Pulsante"
                  >
                    ✕
                  </button>
                )}
              </div>
            ) : (
              editing && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    updateSlide('hideCta', false);
                  }}
                  className="px-4 py-2 border-2 border-dashed border-black/30 hover:border-black/60 text-black/50 hover:text-black rounded-full font-black uppercase tracking-widest flex items-center justify-center gap-2 mt-2 w-full cursor-pointer transition-all text-[9px] h-12 shrink-0"
                >
                  + Aggiungi Pulsante
                </button>
              )
            )}
          </div>
        );
      case 14: // Story-style oversized title (great for 9:16)
        return (
          <div className="absolute inset-0 bg-[#d1d9cf] p-10 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              {Wordmark()}
              <EditableTag text={slide.pageLabel ?? `0${slideIdx + 1}`} className="text-[9px] font-black uppercase opacity-30" field="pageLabel" />
            </div>
            <div>
              <EditableTag text={slide.tag ?? post.pillarName.replace('_', ' ')} className="text-[9px] font-black uppercase tracking-[0.4em] opacity-40 block mb-4" field="tag" />
              <EditableTitle text={slide.title} className="text-[3.6rem] font-syne font-black uppercase leading-none tracking-tighter mb-6" />
              <EditableText text={slide.text} className="text-lg font-bold opacity-60 leading-snug max-w-[90%]" />
            </div>
            <div className="flex justify-between items-end">
              {CTA()}
              <Instagram size={16} className="opacity-30" />
            </div>
          </div>
        );
      case 15: // Charcoal hero with lime underline — sage top strip, dark body
        return (
          <div className="absolute inset-0 flex flex-col">
            <div className="bg-[#d1d9cf] px-10 pt-8 pb-5 flex justify-between items-center">
              {Wordmark()}
              <EditableTag text={slide.tag ?? 'LIVE'} className="text-[9px] font-black uppercase tracking-widest text-black/40" field="tag" />
            </div>
            <div className="flex-1 bg-[#1a1a1a] px-10 pt-6 pb-10 text-white flex flex-col justify-between">
              <div>
                <EditableTitle text={slide.title} className="font-syne uppercase leading-none mb-3" />
                <div className="w-20 h-1 bg-[#ccff00] mb-4 rounded-full" />
                <EditableText text={slide.text} className="text-base font-bold opacity-70 leading-snug max-w-[90%]" />
              </div>
              <div className="flex items-end justify-between">
                {CTA()}
                <EditableTag text={slide.pageLabel ?? `SLIDE ${slideIdx + 1} / ${post.slides.length}`} className="text-[8px] font-black uppercase tracking-widest opacity-40" field="pageLabel" />
              </div>
            </div>
          </div>
        );
      case 16: // Neon Accent Corner (Dark charcoal background)
        return (
          <div className="absolute inset-0 bg-[#1a1a1a] text-white p-10 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              {Wordmark()}
              <div className="px-3 py-1 bg-[#ccff00] text-black font-black uppercase text-[8px] tracking-widest rounded-full">
                <EditableTag text={slide.tag ?? 'NEON FEATURE'} className="" field="tag" />
              </div>
            </div>
            <div className="flex-1 flex gap-6 my-4 items-center">
              <div className="flex-1 flex flex-col justify-center">
                <EditableTitle text={slide.title} className={`${titleSize} font-syne font-black uppercase leading-none tracking-tighter text-left`} />
                <EditableText text={slide.text} className="text-sm font-bold opacity-60 leading-snug mt-4 max-w-[85%]" />
              </div>
              <div className="w-1.5 h-3/4 bg-[#ccff00] rounded-full shrink-0" />
            </div>
            <div className="flex justify-between items-end">
              {CTA()}
              <EditableTag text={slide.pageLabel ?? `0${slideIdx + 1}`} className="text-[10px] font-black opacity-30" field="pageLabel" />
            </div>
          </div>
        );
      case 17: // Split Diagonal Split-Screen
        return (
          <div className="absolute inset-0 bg-[#d1d9cf] overflow-hidden flex flex-col justify-between p-10">
            <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <polygon points="0,0 100,0 100,60 0,100" fill="#ccff00" />
              </svg>
            </div>
            <div className="z-10 flex justify-between items-start">
              {Wordmark()}
              <EditableTag text={slide.tag ?? 'INSIGHT'} className="text-[8px] font-black tracking-widest opacity-40 uppercase" field="tag" />
            </div>
            <div className="z-10 my-auto">
              <EditableTitle text={slide.title} className={`${titleSize} font-syne font-black uppercase leading-none tracking-tighter mb-4`} />
              <EditableText text={slide.text} className="text-sm font-bold opacity-60 leading-snug max-w-[90%]" />
            </div>
            <div className="z-10 flex justify-between items-end">
              {CTA()}
              <EditableTag text={slide.pageLabel ?? `SLIDE ${slideIdx + 1}`} className="text-[9px] font-black opacity-30" field="pageLabel" />
            </div>
          </div>
        );
      case 18: // Magazine Header Look (White background)
        return (
          <div className="absolute inset-0 bg-white text-black p-10 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6">
                {Wordmark()}
                <EditableTag text={slide.tag ?? 'MAGAZINE'} className="text-[8px] font-black tracking-widest opacity-40 uppercase" field="tag" />
              </div>
              <EditableTitle text={slide.title} className="text-[3rem] font-syne font-black uppercase leading-[0.9] tracking-tighter mb-4" />
            </div>
            <div className="bg-[#f0f2ef] rounded-[24px] p-6 border border-black/5">
              <EditableText text={slide.text} className="text-sm font-bold opacity-60 leading-snug mb-4" />
              {CTA()}
            </div>
            <div className="flex justify-between items-end text-[9px] font-black opacity-30">
              <span>EDITION 2026</span>
              <EditableTag text={slide.pageLabel ?? `0${slideIdx + 1}`} className="" field="pageLabel" />
            </div>
          </div>
        );
      case 19: // High-Contrast Duotone
        return (
          <div className="absolute inset-0 flex flex-col">
            <div className="h-[60%] bg-[#1a1a1a] text-white p-10 flex flex-col justify-between">
              <div className="flex justify-between items-center">
                {Wordmark()}
                <EditableTag text={slide.tag ?? 'DUOTONE'} className="text-[8px] font-black tracking-widest opacity-40 uppercase text-[#ccff00]" field="tag" />
              </div>
              <EditableTitle text={slide.title} className={`${titleSize} font-syne font-black uppercase leading-none tracking-tighter`} />
            </div>
            <div className="flex-1 bg-[#ccff00] text-black p-10 flex flex-col justify-between relative">
              <EditableText text={slide.text} className="text-sm font-black leading-snug max-w-[85%]" />
              <div className="flex justify-between items-end mt-4">
                {CTA()}
                <EditableTag text={slide.pageLabel ?? `#${slideIdx + 1}`} className="text-[10px] font-black opacity-40" field="pageLabel" />
              </div>
            </div>
          </div>
        );
      case 20: // Minimal Grid Focus
        return (
          <div className="absolute inset-3 bg-[#d1d9cf] rounded-[28px] border-2 border-black/10 p-6 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <EditableTag text={slide.subTitle ?? 'L2D SYSTEM'} className="text-[8px] font-black tracking-[0.3em] opacity-40 uppercase block mb-1" field="subTitle" />
                <EditableTag text={slide.tag ?? 'GRID'} className="text-[7px] font-black opacity-20 uppercase" field="tag" />
              </div>
              {Wordmark()}
            </div>
            <div className="my-6">
              <EditableTitle text={slide.title} className="text-[2.2rem] font-syne font-black uppercase leading-none tracking-tighter mb-4" />
            </div>
            <div className="flex flex-col items-end text-right">
              <EditableText text={slide.text} className="text-sm font-bold opacity-60 leading-snug max-w-[80%] mb-4" />
              {CTA()}
            </div>
            <div className="w-full h-0.5 bg-black/10 rounded-full my-2 shrink-0" />
            <div className="flex justify-between items-end pt-2">
              <span className="text-[8px] font-black opacity-30">© 2026</span>
              <EditableTag text={slide.pageLabel ?? `SLIDE 0${slideIdx + 1}`} className="text-[8px] font-black opacity-30" field="pageLabel" />
            </div>
          </div>
        );
      case 21: // Floating Glass Card
        return (
          <div className="absolute inset-0 bg-[#1a1a1a] p-6 flex flex-col justify-between">
            <div className="flex justify-between items-center text-white">
              {Wordmark()}
              <EditableTag text={slide.tag ?? 'PREMIUM'} className="text-[8px] font-black tracking-widest opacity-40 uppercase text-[#ccff00]" field="tag" />
            </div>
            <div className="flex-1 bg-white/5 backdrop-blur-md rounded-[32px] border border-white/10 p-8 my-4 flex flex-col justify-between text-white shadow-2xl">
              <div>
                <EditableTitle text={slide.title} className="font-syne font-black uppercase leading-none tracking-tighter mb-4 text-[2rem] text-[#ccff00]" />
                <EditableText text={slide.text} className="text-sm font-bold opacity-70 leading-snug" />
              </div>
              {CTA()}
            </div>
            <div className="flex justify-between items-end text-white/40 text-[9px] font-black">
              <span>L2D FRAMEWORK</span>
              <EditableTag text={slide.pageLabel ?? `0${slideIdx + 1}`} className="" field="pageLabel" />
            </div>
          </div>
        );
      case 22: // Stat Callout Split
        return (
          <div className="absolute inset-0 bg-[#d1d9cf] p-10 flex flex-col justify-between">
            <div className="flex justify-between items-center">
              {Wordmark()}
              <EditableTag text={slide.tag ?? 'STATISTICS'} className="text-[8px] font-black tracking-widest opacity-40 uppercase" field="tag" />
            </div>
            <div className="grid grid-cols-3 gap-4 my-auto items-center">
              <div className="col-span-1">
                <EditableNumber text={slide.number ?? `95%`} className="text-[4.5rem] font-syne font-black text-[#ccff00] bg-black text-center py-4 rounded-3xl leading-none tracking-tighter" field="number" label="STAT" />
              </div>
              <div className="col-span-2 pl-2">
                <EditableTitle text={slide.title} className="text-[1.8rem] font-syne font-black uppercase leading-none tracking-tighter mb-2" />
                <EditableText text={slide.text} className="text-xs font-bold opacity-60 leading-tight" />
              </div>
            </div>
            <div className="flex justify-between items-end">
              {CTA()}
              <EditableTag text={slide.pageLabel ?? `#0${slideIdx + 1}`} className="text-[9px] font-black opacity-30" field="pageLabel" />
            </div>
          </div>
        );
      case 23: // Brutalist Poster
        return (
          <div className="absolute inset-3 bg-[#ccff00] text-black p-8 flex flex-col justify-between border-[6px] border-black rounded-[28px]">
            <div className="flex justify-between items-start">
              {Wordmark()}
              <EditableTag text={slide.tag ?? 'CRITICAL'} className="text-[9px] font-black tracking-widest uppercase border border-black px-2 py-0.5 rounded-full" field="tag" />
            </div>
            <div className="my-auto">
              <EditableTitle text={slide.title} className="text-[2.6rem] font-syne font-black uppercase leading-[0.9] tracking-tighter" />
              <div className="w-full h-1.5 bg-black my-4 rounded-full" />
              <EditableText text={slide.text} className="text-sm font-black leading-snug uppercase tracking-tight" />
            </div>
            <div className="flex justify-between items-end">
              {CTA()}
              <EditableTag text={slide.pageLabel ?? `STEP 0${slideIdx + 1}`} className="text-[9px] font-black uppercase tracking-wider" field="pageLabel" />
            </div>
          </div>
        );
      case 24: // Minimalist Border Pill
        return (
          <div className="absolute inset-0 bg-[#d1d9cf] p-10 flex flex-col justify-between">
            <div className="flex justify-between items-center">
              {Wordmark()}
              <EditableTag text={slide.tag ?? 'EDITORIAL'} className="text-[8px] font-black tracking-widest opacity-40 uppercase" field="tag" />
            </div>
            <div className="my-auto flex flex-col items-center text-center">
              <div className="border border-black px-6 py-3 rounded-full mb-6 max-w-full">
                <EditableTitle text={slide.title} className="text-[1.5rem] font-syne font-black uppercase leading-none tracking-tight" />
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-black mb-6" />
              <EditableText text={slide.text} className="text-sm font-bold opacity-60 leading-snug max-w-[85%]" />
            </div>
            <div className="flex justify-between items-end">
              {CTA()}
              <EditableTag text={slide.pageLabel ?? `PAGE 0${slideIdx + 1}`} className="text-[9px] font-black opacity-30" field="pageLabel" />
            </div>
          </div>
        );
      case 25: // Monospaced Spec Grid
        return (
          <div className="absolute inset-0 bg-[#d1d9cf] p-10 flex flex-col justify-between text-black">
            <div className="flex justify-between items-center">
              {Wordmark()}
              <EditableTag text={slide.pageLabel ?? `SPEC 0${slideIdx + 1}`} className="text-[9px] font-mono font-bold opacity-40 uppercase" field="pageLabel" />
            </div>
            <div className="my-auto">
              <EditableTitle text={slide.title} className="text-[2.2rem] font-syne font-black uppercase leading-none tracking-tighter mb-4" />
              <div className="h-0.5 bg-black/10 my-4 rounded-full" />
              <div className="grid grid-cols-2 gap-4 text-[10px] font-mono">
                <div>
                  <span className="opacity-40 block mb-1">FIELD // METADATA</span>
                  <EditableTag text={slide.tag ?? 'L2D LABS'} className="font-bold uppercase" field="tag" />
                </div>
                <div>
                  <span className="opacity-40 block mb-1">ANGLE // ANGLE</span>
                  <EditableTag text={slide.tag2 ?? post.angleLabel} className="font-bold uppercase" field="tag2" />
                </div>
              </div>
            </div>
            <div className="flex justify-between items-end">
              <EditableText text={slide.text} className="text-xs font-mono opacity-60 leading-normal max-w-[75%]" />
              {CTA()}
            </div>
          </div>
        );
      case 26: // Left Bracket Frame
        return (
          <div className="absolute inset-0 bg-[#d1d9cf] p-10 flex flex-col justify-between text-black">
            <div className="flex justify-between items-center">
              {Wordmark()}
              <EditableTag text={slide.pageLabel ?? `#0${slideIdx + 1}`} className="text-[9px] font-black opacity-30" field="pageLabel" />
            </div>
            <div className="flex-1 my-6 flex flex-col justify-center relative pl-6">
              <div className="absolute left-0 top-0 bottom-0 w-3 border-l-2 border-t-2 border-b-2 border-black rounded-l-xl" />
              <EditableTitle text={slide.title} className="text-[2.2rem] font-syne font-black uppercase leading-none tracking-tighter mb-3" />
              <EditableTag text={slide.tag ?? post.pillarName.replace('_', ' ')} className="text-[8px] font-black uppercase tracking-widest text-black/40 mb-2" field="tag" />
              <EditableText text={slide.text} className="text-sm font-bold opacity-60 leading-snug" />
            </div>
            <div>
              {CTA()}
            </div>
          </div>
        );
      case 27: // Highlighted Step Card
        return (
          <div className="absolute inset-0 bg-[#d1d9cf] p-10 flex flex-col justify-between text-black">
            <div className="flex justify-between items-center">
              {Wordmark()}
              <div className="px-3 py-1 bg-black text-[#ccff00] text-[8px] font-black tracking-widest uppercase rounded-full">
                <EditableTag text={slide.pageLabel ?? `STEP 0${slideIdx + 1}`} className="" field="pageLabel" />
              </div>
            </div>
            <div className="grid grid-cols-5 gap-6 my-auto items-center">
              <div className="col-span-3">
                <EditableTitle text={slide.title} className="text-[2rem] font-syne font-black uppercase leading-none tracking-tighter" />
              </div>
              <div className="col-span-2 flex gap-4 items-stretch">
                <div className="w-0.5 bg-black/20 rounded-full shrink-0" />
                <EditableText text={slide.text} className="text-xs font-bold opacity-60 leading-snug" />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <EditableTag text={slide.tag ?? 'L2D STRATEGY'} className="text-[8px] font-black tracking-widest opacity-30 uppercase" field="tag" />
              {CTA()}
            </div>
          </div>
        );
      case 28: // Minimalist Quotation Accent
        return (
          <div className="absolute inset-0 bg-[#d1d9cf] p-10 flex flex-col justify-between text-black">
            <div className="flex justify-between items-center">
              {Wordmark()}
              <EditableTag text={slide.tag ?? 'EDITORIAL'} className="text-[9px] font-black tracking-widest opacity-30 uppercase" field="tag" />
            </div>
            <div className="my-auto flex flex-col items-start relative pl-8 pb-4">
              <span className="absolute left-0 -top-6 text-[6rem] font-syne font-black opacity-10 select-none">“</span>
              <EditableTitle text={slide.title} className="text-[2.2rem] font-syne font-black uppercase leading-none tracking-tighter mb-4" />
              <EditableText text={slide.text} className="text-sm font-bold opacity-60 leading-snug max-w-[90%]" />
              <div className="w-16 h-1 bg-black rounded-full mt-4" />
            </div>
            <div className="flex justify-between items-center">
              {CTA()}
              <EditableTag text={slide.pageLabel ?? `0${slideIdx + 1}/${post.slides.length}`} className="text-[9px] font-black opacity-30" field="pageLabel" />
            </div>
          </div>
        );
      case 29: // Duotone Split Column
        return (
          <div className="absolute inset-0 flex">
            <div className="w-[45%] bg-[#1a1a1a] text-white p-10 flex flex-col justify-between">
              {Wordmark()}
              <div>
                <EditableTag text={slide.tag ?? post.pillarName.replace('_', ' ')} className="text-[8px] font-black tracking-widest opacity-40 uppercase text-[#ccff00] block mb-2" field="tag" />
                <EditableTitle text={slide.title} className="text-[2rem] font-syne font-black uppercase leading-none tracking-tighter" />
              </div>
              <EditableTag text={slide.pageLabel ?? `0${slideIdx + 1}`} className="text-[10px] font-black opacity-30" field="pageLabel" />
            </div>
            <div className="flex-1 bg-[#d1d9cf] text-black p-10 flex flex-col justify-between">
              <EditableTag text={slide.tag2 ?? 'LEAD GEN'} className="text-[8px] font-black tracking-widest opacity-30 uppercase self-end" field="tag2" />
              <div className="my-auto">
                <EditableText text={slide.text} className="text-sm font-bold opacity-60 leading-snug max-w-[90%] mb-4" />
                {CTA()}
              </div>
              <div className="w-4 h-4 rounded-full bg-black/10 self-end" />
            </div>
          </div>
        );
      case 30: // Terminal Console Mock
        return (
          <div className="absolute inset-3 bg-[#1a1a1a] text-white p-8 flex flex-col justify-between border border-white/10 rounded-[28px]">
            <div className="flex justify-between items-center pb-4">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
              </div>
              <span className="text-[9px] font-mono opacity-40">l2d-terminal // sh</span>
            </div>
            <div className="w-full h-0.5 bg-white/10 rounded-full shrink-0" />
            <div className="my-auto font-mono text-[11px] space-y-3">
              <div>
                <span className="text-[#ccff00] font-bold">&gt;&gt; const</span> <span className="text-white font-bold">title</span> = <span className="text-white/70">"</span>
                <EditableTag text={slide.title} className="text-[#ccff00] font-black uppercase tracking-tight bg-white/5 px-1 inline-block" field="title" />
                <span className="text-white/70">";</span>
              </div>
              <div>
                <span className="text-[#ccff00] font-bold">&gt;&gt; const</span> <span className="text-white font-bold">description</span> = <span className="text-white/70">"</span>
                <EditableTag text={slide.text} className="text-white/80 bg-white/5 px-1 inline-block whitespace-normal max-w-full" field="text" />
                <span className="text-white/70">";</span>
              </div>
            </div>
            <div className="w-full h-0.5 bg-white/10 rounded-full shrink-0" />
            <div className="flex justify-between items-end pt-4">
              {Wordmark()}
              <EditableTag text={slide.pageLabel ?? `RUN v0.${slideIdx + 1}`} className="text-[9px] font-mono text-[#ccff00]" field="pageLabel" />
            </div>
          </div>
        );
      case 31: // Floating Glass Panel Overlay
        return (
          <div className="absolute inset-0 bg-[#141414] p-8 flex flex-col justify-between text-white overflow-hidden relative">
            {/* Background Grid Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />
            <div className="z-10 flex justify-between items-center">
              {Wordmark()}
              <EditableTag text={slide.tag ?? 'SYSTEM'} className="text-[8px] font-black tracking-widest opacity-40 uppercase text-[#ccff00]" field="tag" />
            </div>
            <div className="z-10 bg-white/5 backdrop-blur-md rounded-[24px] border border-white/10 p-6 my-auto shadow-2xl relative">
              <div className="absolute -top-2 -left-2 w-5 h-5 border-l-2 border-t-2 border-[#ccff00] rounded-tl-lg" />
              <div className="absolute -bottom-2 -right-2 w-5 h-5 border-r-2 border-b-2 border-[#ccff00] rounded-br-lg" />
              <EditableTitle text={slide.title} className="text-[1.8rem] font-syne font-black uppercase leading-none tracking-tighter mb-4" />
              <EditableText text={slide.text} className="text-xs font-bold opacity-60 leading-snug" />
            </div>
            <div className="z-10 flex justify-between items-end">
              {CTA()}
              <EditableTag text={slide.pageLabel ?? `0${slideIdx + 1}`} className="text-[9px] font-black opacity-30" field="pageLabel" />
            </div>
          </div>
        );
      case 32: // Asymmetrical Bold Sidebar
        return (
          <div className="absolute inset-0 bg-[#d1d9cf] p-10 flex justify-between text-black">
            {/* Left sidebar with rotated text */}
            <div className="w-12 flex flex-col justify-between items-center pb-4 pr-4 relative">
              <span className="w-2.5 h-2.5 rounded-full bg-black shrink-0" />
              <div className="-rotate-90 origin-center my-auto whitespace-nowrap text-[9px] font-black uppercase tracking-[0.4em] opacity-40 translate-y-4">
                <EditableTag text={slide.tag ?? post.pillarName.replace('_', ' ')} className="" field="tag" />
              </div>
              <EditableTag text={slide.pageLabel ?? `P.0${slideIdx + 1}`} className="text-[9px] font-mono font-bold opacity-30" field="pageLabel" />
              <div className="absolute right-0 top-0 bottom-0 w-0.5 bg-black/10 rounded-full" />
            </div>
            {/* Right stack */}
            <div className="flex-1 pl-8 flex flex-col justify-between">
              <div>
                {Wordmark()}
              </div>
              <div className="my-auto">
                <EditableTitle text={slide.title} className="text-[2.2rem] font-syne font-black uppercase leading-none tracking-tighter mb-4" />
                <EditableText text={slide.text} className="text-sm font-bold opacity-60 leading-snug" />
              </div>
              <div>
                {CTA()}
              </div>
            </div>
          </div>
        );
      case 33: // Diagonal Chevron Split
        return (
          <div className="absolute inset-0 bg-[#1a1a1a] flex flex-col justify-between text-white overflow-hidden p-10">
            {/* Chevron split background */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-15">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <polygon points="0,0 100,0 80,100 0,100" fill="#ccff00" />
              </svg>
            </div>
            <div className="z-10 flex justify-between items-center">
              {Wordmark()}
              <EditableTag text={slide.tag ?? 'L2D ANGLE'} className="text-[8px] font-black tracking-widest opacity-40 uppercase text-[#ccff00]" field="tag" />
            </div>
            <div className="z-10 my-auto">
              <EditableTitle text={slide.title} className="text-[2.6rem] font-syne font-black uppercase leading-[0.95] tracking-tighter mb-6" />
              <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-sm">
                <EditableText text={slide.text} className="text-sm font-bold opacity-60 leading-snug" />
              </div>
            </div>
            <div className="z-10 flex justify-between items-end">
              {CTA()}
              <EditableTag text={slide.pageLabel ?? `SLIDE 0${slideIdx + 1}`} className="text-[9px] font-black opacity-30" field="pageLabel" />
            </div>
          </div>
        );
      case 34: // Clean Outlined Grid Cards
        return (
          <div className="absolute inset-0 bg-[#d1d9cf] p-10 flex flex-col justify-between text-black">
            <div className="flex justify-between items-center">
              {Wordmark()}
              <EditableTag text={slide.pageLabel ?? `0${slideIdx + 1}`} className="text-[9px] font-black opacity-30" field="pageLabel" />
            </div>
            <div className="my-auto">
              <EditableTitle text={slide.title} className="text-[1.8rem] font-syne font-black uppercase leading-none tracking-tighter mb-4 text-center" />
              <div className="grid grid-cols-3 gap-2">
                <div className="border border-black/10 rounded-2xl p-3 bg-white/20">
                  <span className="text-[8px] font-black block opacity-40 mb-1">01 / CONCEPT</span>
                  <EditableTag text={slide.tag ?? 'RESEARCH'} className="text-[9px] font-black uppercase" field="tag" />
                </div>
                <div className="border border-black/10 rounded-2xl p-3 bg-white/20">
                  <span className="text-[8px] font-black block opacity-40 mb-1">02 / PILLAR</span>
                  <EditableTag text={slide.tag2 ?? post.pillarName.replace('_', ' ')} className="text-[9px] font-black uppercase" field="tag2" />
                </div>
                <div className="border border-black/10 rounded-2xl p-3 bg-[#ccff00]/10 border-[#ccff00]/30">
                  <span className="text-[8px] font-black block opacity-60 mb-1 text-black/70">03 / GOAL</span>
                  <EditableTag text={slide.cta ?? 'CONVERT'} className="text-[9px] font-black uppercase text-black" field="cta" />
                </div>
              </div>
            </div>
            <div className="flex justify-between items-end mt-4">
              <EditableText text={slide.text} className="text-xs font-bold opacity-60 leading-tight max-w-[80%]" />
              {CTA()}
            </div>
          </div>
        );
      case 35: // Brutalist Grid Columns (No CTA)
        return (
          <div className="absolute inset-3 bg-[#d1d9cf] p-8 flex flex-col justify-between text-black border-4 border-black rounded-[28px]">
            <div className="flex justify-between items-center pb-4">
              {Wordmark()}
              <EditableTag text={slide.pageLabel ?? `INFO 0${slideIdx + 1}`} className="text-[9px] font-black tracking-widest opacity-40 uppercase" field="pageLabel" />
            </div>
            <div className="w-full h-0.5 bg-black/10 rounded-full shrink-0" />
            <div className="flex-1 my-6 flex flex-col justify-center">
              <EditableTag text={slide.tag ?? post.pillarName.replace('_', ' ')} className="text-[10px] font-mono font-bold text-black opacity-30 uppercase mb-3 block" field="tag" />
              <EditableTitle text={slide.title} className="text-[2.2rem] font-syne font-black uppercase leading-none tracking-tighter" />
            </div>
            <div className="w-full h-0.5 bg-black/10 rounded-full shrink-0" />
            <div className="pt-4 flex flex-col md:flex-row justify-between items-start gap-4">
              <EditableText text={slide.text} className="text-xs font-bold opacity-60 leading-snug max-w-[90%]" />
            </div>
          </div>
        );
      case 36: // Oversized Big Quote Accent (No CTA)
        return (
          <div className="absolute inset-0 bg-[#1a1a1a] text-white p-10 flex flex-col justify-between">
            <div className="flex justify-between items-center opacity-40">
              {Wordmark()}
              <EditableTag text={slide.pageLabel ?? `QUOTE 0${slideIdx + 1}`} className="text-[9px] font-black uppercase tracking-widest" field="pageLabel" />
            </div>
            <div className="my-auto text-center relative px-6 py-4">
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 text-[10rem] font-syne font-black opacity-[0.08] text-[#ccff00] select-none">“</span>
              <EditableTitle text={slide.title} className="text-[2.2rem] font-syne font-black uppercase leading-none tracking-tighter text-[#ccff00] mb-4" />
              <EditableText text={slide.text} className="text-sm font-bold opacity-60 italic leading-relaxed max-w-[85%] mx-auto" />
            </div>
            <div className="w-full h-0.5 bg-white/10 rounded-full shrink-0" />
            <div className="flex justify-between items-center text-[9px] font-black opacity-30 pt-4">
              <span>L2D ANTHOLOGY</span>
              <EditableTag text={slide.tag ?? 'REFLECT'} className="uppercase tracking-widest" field="tag" />
            </div>
          </div>
        );
      case 37: // Neon Left Sidebar Tag (No CTA)
        return (
          <div className="absolute inset-0 bg-[#d1d9cf] flex text-black">
            <div className="w-14 bg-[#ccff00] flex flex-col justify-between items-center py-8 relative">
              <span className="w-2.5 h-2.5 rounded-full bg-black shrink-0" />
              <div className="-rotate-90 origin-center my-auto whitespace-nowrap text-[9px] font-black uppercase tracking-[0.4em] text-black">
                <EditableTag text={slide.tag ?? 'L2D STRATEGY'} className="" field="tag" />
              </div>
              <EditableTag text={slide.pageLabel ?? `0${slideIdx + 1}`} className="text-[10px] font-black" field="pageLabel" />
              <div className="absolute right-0 top-0 bottom-0 w-px bg-black/10 rounded-full" />
            </div>
            <div className="flex-1 p-10 flex flex-col justify-between">
              <div>
                {Wordmark()}
              </div>
              <div className="my-auto">
                <EditableTitle text={slide.title} className="text-[2.4rem] font-syne font-black uppercase leading-none tracking-tighter mb-4" />
                <EditableText text={slide.text} className="text-sm font-bold opacity-60 leading-snug" />
              </div>
              <div className="text-[8px] font-mono opacity-30">
                L2D // SYSTEM // NO_ACTION
              </div>
            </div>
          </div>
        );
      case 38: // Magazine Headline Focus (No CTA)
        return (
          <div className="absolute inset-3 bg-white text-black p-8 flex flex-col justify-between border-2 border-black/10 rounded-[28px]">
            <div className="flex justify-between items-center pb-4">
              {Wordmark()}
              <EditableTag text={slide.pageLabel ?? `PAGE 0${slideIdx + 1}`} className="text-[8px] font-mono font-bold opacity-40 uppercase" field="pageLabel" />
            </div>
            <div className="w-full h-0.5 bg-black/10 rounded-full shrink-0" />
            <div className="my-auto py-6 text-center flex flex-col gap-6 items-center w-full">
              <div className="w-full h-0.5 bg-black/10 rounded-full" />
              <EditableTitle text={slide.title} className="text-[2.4rem] font-syne font-black uppercase leading-[0.95] tracking-tight mb-2" />
              <div className="w-full h-0.5 bg-black/10 rounded-full" />
            </div>
            <div className="flex justify-between items-end gap-6">
              <EditableText text={slide.text} className="text-xs font-bold opacity-60 leading-snug max-w-[75%]" />
              <EditableTag text={slide.tag ?? 'EDITORIAL'} className="text-[8px] font-black tracking-widest opacity-40 uppercase shrink-0" field="tag" />
            </div>
          </div>
        );
      case 39: // Cross Grid Wireframe (With CTA)
        return (
          <div className="absolute inset-0 bg-[#d1d9cf] p-4 grid grid-cols-2 grid-rows-2 gap-3 text-black">
            <div className="bg-white/40 rounded-2xl p-4 flex flex-col justify-between items-start border border-black/5 shadow-sm">
              {Wordmark()}
              <EditableTag text={slide.tag ?? 'WIREFRAME'} className="text-[8px] font-black tracking-widest opacity-25 uppercase" field="tag" />
            </div>
            <div className="bg-white/40 rounded-2xl p-4 flex flex-col justify-between items-end text-right border border-black/5 shadow-sm">
              <EditableTag text={slide.pageLabel ?? `0${slideIdx + 1}`} className="text-[10px] font-black opacity-30" field="pageLabel" />
              <EditableTag text={slide.tag2 ?? post.angleLabel} className="text-[8px] font-black tracking-widest opacity-25 uppercase" field="tag2" />
            </div>
            <div className="bg-white/40 rounded-2xl p-4 flex flex-col justify-end border border-black/5 shadow-sm">
              <EditableTitle text={slide.title} className="text-[1.8rem] font-syne font-black uppercase leading-tight tracking-tighter" />
            </div>
            <div className="bg-black text-white rounded-[24px] p-5 flex flex-col justify-between items-end text-right shadow-lg">
              <EditableText text={slide.text} className="text-[10px] font-bold opacity-50 leading-tight mb-4" />
              {CTA()}
            </div>
          </div>
        );
      case 40: // Overlay Rounded Card (With CTA)
        return (
          <div className="absolute inset-0 bg-[#d1d9cf] p-6 flex flex-col justify-between text-black">
            <div className="flex justify-between items-center px-2">
              {Wordmark()}
              <EditableTag text={slide.pageLabel ?? `STEP 0${slideIdx + 1}`} className="text-[9px] font-black opacity-30" field="pageLabel" />
            </div>
            <div className="bg-[#1a1a1a] text-white rounded-[32px] p-6 flex-1 my-3 flex flex-col justify-between shadow-2xl border border-white/5">
              <div>
                <EditableTag text={slide.tag ?? post.pillarName.replace('_', ' ')} className="text-[8px] font-black tracking-widest opacity-40 uppercase text-[#ccff00] block mb-3" field="tag" />
                <EditableTitle text={slide.title} className="text-[1.8rem] font-syne font-black uppercase leading-none tracking-tighter mb-4 text-[#ccff00]" />
                <EditableText text={slide.text} className="text-xs font-bold opacity-60 leading-snug" />
              </div>
              {CTA()}
            </div>
            <div className="text-[8px] opacity-20 text-center uppercase tracking-widest">
              L2D Studio Framework Layer
            </div>
          </div>
        );
      case 41: // Offset Brutalist Card (With CTA)
        return (
          <div className="absolute inset-0 bg-[#d1d9cf] p-8 flex flex-col justify-between text-black relative">
            <div className="flex justify-between items-center z-10">
              {Wordmark()}
              <EditableTag text={slide.pageLabel ?? `#0${slideIdx + 1}`} className="text-[9px] font-black opacity-30" field="pageLabel" />
            </div>
            {/* The offset shadow card */}
            <div className="my-auto relative z-10">
              <div className="absolute inset-0 bg-black rounded-2xl translate-x-2 translate-y-2" />
              <div className="bg-white border-2 border-black rounded-2xl p-6 relative">
                <EditableTag text={slide.tag ?? 'STRATEGY'} className="text-[8px] font-black tracking-widest opacity-40 uppercase text-black/40 block mb-2" field="tag" />
                <EditableTitle text={slide.title} className="text-[1.8rem] font-syne font-black uppercase leading-none tracking-tight mb-4" />
                <EditableText text={slide.text} className="text-xs font-bold opacity-60 leading-snug" />
              </div>
            </div>
            <div className="flex justify-between items-end z-10 mt-2">
              {CTA()}
              <div className="w-3.5 h-3.5 rounded-full bg-black" />
            </div>
          </div>
        );
      case 42: // Modern Gradient Shadow (With CTA)
        return (
          <div className="absolute inset-0 bg-[#141414] p-8 flex flex-col justify-between text-white">
            <div className="flex justify-between items-center">
              {Wordmark()}
              <EditableTag text={slide.pageLabel ?? `SPEC ${slideIdx + 1}`} className="text-[9px] font-mono text-[#ccff00]" field="pageLabel" />
            </div>
            <div className="my-auto flex flex-col items-center text-center relative py-6">
              {/* Subtle back gradient */}
              <div className="absolute w-48 h-48 rounded-full bg-[#ccff00]/5 filter blur-3xl pointer-events-none" />
              <EditableTag text={slide.tag ?? 'L2D ANGLE'} className="text-[8px] font-black tracking-widest text-[#ccff00] uppercase block mb-4 border border-[#ccff00]/30 px-3 py-1 rounded-full bg-[#ccff00]/5" field="tag" />
              <EditableTitle text={slide.title} className="text-[2.2rem] font-syne font-black uppercase leading-none tracking-tighter mb-4" />
              <EditableText text={slide.text} className="text-sm font-bold opacity-60 leading-snug max-w-[85%] mb-6" />
              {CTA()}
            </div>
            <div className="flex justify-between items-center text-[8px] font-black opacity-20">
              <span>L2D FRAMEWORK</span>
              <span>© 2026</span>
            </div>
          </div>
        );
      case 43: // Double Border Editorial (No CTA)
        return (
          <div className="absolute inset-0 bg-[#d1d9cf] p-6 text-black">
            <div className="w-full h-full border-2 border-black/15 rounded-[24px] p-6 flex flex-col justify-between relative">
              <div className="flex justify-between items-center">
                {Wordmark()}
                <EditableTag text={slide.pageLabel ?? `0${slideIdx + 1}`} className="text-[9px] font-black opacity-30" field="pageLabel" />
              </div>
              <div className="my-auto">
                <EditableTitle text={slide.title} className="text-[2rem] font-syne font-black uppercase leading-none tracking-tighter mb-4" />
                <EditableText text={slide.text} className="text-xs font-bold opacity-60 leading-snug" />
              </div>
              <div className="flex justify-between items-center text-[8px] font-black opacity-30">
                <EditableTag text={slide.tag ?? 'EDITORIAL'} className="uppercase tracking-widest" field="tag" />
                <span>LINK2DIGITAL AGENCY</span>
              </div>
            </div>
          </div>
        );
      case 44: // Minimalist Center Dots (No CTA)
        return (
          <div className="absolute inset-0 bg-[#d1d9cf] p-10 flex flex-col justify-between text-black">
            <div className="flex justify-between items-center">
              {Wordmark()}
              <EditableTag text={slide.pageLabel ?? `0${slideIdx + 1}/${post.slides.length}`} className="text-[9px] font-black opacity-30" field="pageLabel" />
            </div>
            <div className="my-auto text-center flex flex-col items-center justify-center">
              <EditableTitle text={slide.title} className="text-[2.2rem] font-syne font-black uppercase leading-none tracking-tighter mb-4 max-w-[90%]" />
              <div className="flex flex-col gap-1 my-3 select-none">
                <span className="w-1.5 h-1.5 rounded-full bg-black" />
                <span className="w-1.5 h-1.5 rounded-full bg-black/40" />
                <span className="w-1.5 h-1.5 rounded-full bg-black/10" />
              </div>
              <EditableText text={slide.text} className="text-sm font-bold opacity-60 leading-snug max-w-[80%]" />
            </div>
            <div className="w-full h-0.5 bg-black/10 rounded-full shrink-0" />
            <div className="flex justify-between items-center text-[8px] font-black opacity-30 pt-4">
              <EditableTag text={slide.tag ?? 'MINIMALIST'} className="uppercase tracking-widest" field="tag" />
              <span>L2D WEB LAB</span>
            </div>
          </div>
        );
      default: // 0 — flagship Cinematic look
        return (
          <div className="absolute inset-0 p-10 flex flex-col justify-between text-black bg-[#d1d9cf]">
            <div className="flex justify-between items-start z-20">
              {Branding()}
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
                {CTA()}
              </div>
            </div>
            <div className="flex justify-between items-end z-20">
              {Wordmark()}
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
    <SlideEditContext.Provider value={{ editing, isStory, updateSlide, slide }}>
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
  const isPortraitFormat = selectedPost.format === 'PORTRAIT';

  const stats = {
    total: posts.length,
    ready: posts.filter((p) => p.status === 'READY' || p.status === 'PUBLISHED').length,
    draft: posts.filter((p) => p.status === 'DRAFT').length,
    posts: posts.filter((p) => p.format === 'POST').length,
    portraits: posts.filter((p) => p.format === 'PORTRAIT').length,
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
                      <option value="PORTRAIT">Ritratto 4:5</option>
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
                  <Instagram size={13} /> Post 1:1
                </button>
                <button
                  onClick={() => updateFormat('PORTRAIT')}
                  className={`px-3 lg:px-4 py-2 rounded-lg text-[10px] font-black uppercase flex items-center gap-1.5 transition-all ${selectedPost.format === 'PORTRAIT' ? 'bg-white shadow-sm' : 'opacity-40'}`}
                >
                  <Instagram size={13} /> Ritratto 4:5
                </button>
                <button
                  onClick={() => updateFormat('STORY')}
                  className={`px-3 lg:px-4 py-2 rounded-lg text-[10px] font-black uppercase flex items-center gap-1.5 transition-all ${selectedPost.format === 'STORY' ? 'bg-white shadow-sm' : 'opacity-40'}`}
                >
                  <Smartphone size={13} /> Story 9:16
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
                <span className="text-[8px] font-black opacity-30 uppercase tracking-widest leading-none mb-1.5">Layout Variant ({selectedPost.styleVariant + 1}/45)</span>
                <div className="flex gap-1.5 flex-wrap">
                  {Array.from({ length: 45 }, (_, v) => (
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
                        : isPortraitFormat
                        ? 'w-[360px] h-[450px] sm:w-[400px] sm:h-[500px]'
                        : 'w-[450px] h-[450px] sm:w-[500px] sm:h-[500px]'
                    } bg-[#d1d9cf] rounded-[32px] sm:rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.1)] overflow-hidden isolate`}
                  >
                    <div className="absolute inset-0 overflow-hidden">
                      {renderSlideContent(selectedPost, currentSlide, { isStory: isStoryFormat || isPortraitFormat })}
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
            <div className={`relative scale-[0.6] sm:scale-75 md:scale-90 lg:scale-100 ${
              isStoryFormat ? 'h-[70vh] aspect-[9/16]' : isPortraitFormat ? 'h-[70vh] aspect-[4/5]' : 'w-[90vw] max-w-[600px] lg:w-[700px] aspect-square'
            } bg-[#d1d9cf] rounded-[40px] lg:rounded-[60px] overflow-hidden shadow-2xl border border-black/5 isolate`}>
              <div className="absolute inset-0 overflow-hidden">
                {renderSlideContent(selectedPost, currentSlide, { isStory: isStoryFormat || isPortraitFormat })}
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
                {posts.filter((p) => p.format === 'POST' || p.format === 'PORTRAIT').slice(0, 30).map((post) => (
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
          className={`${
            batchPost?.post.format === 'STORY' ? 'w-[360px] h-[640px]' :
            batchPost?.post.format === 'PORTRAIT' ? 'w-[500px] h-[625px]' :
            'w-[500px] h-[500px]'
          } bg-[#d1d9cf] relative overflow-hidden isolate`}
        >
          {batchPost && renderSlideContent(batchPost.post, batchPost.sIdx, {
            isStory: batchPost.post.format === 'STORY' || batchPost.post.format === 'PORTRAIT',
            isEditingOverride: false
          })}
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
