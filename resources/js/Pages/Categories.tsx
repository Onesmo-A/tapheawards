import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchWelcomeData, setSelectedCategory, Category } from '../store/slices/categorySlice';
import { setActiveNominee } from '../store/slices/voteSlice';
import Footer from './Components/Footer';
import { 
  Award, Loader2, Search, ArrowRight, ShieldCheck, 
  Users, Building, Heart, Star, Sparkles, ChevronRight, X,
  Copy, Share2, QrCode, CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Categories() {
  const dispatch = useAppDispatch();
  const { categories, loading, error, selectedCategory } = useAppSelector((state) => state.categories);
  const { activeNominee } = useAppSelector((state) => state.voting);

  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'individual' | 'organization' | 'special'>('all');
  const [isMobile, setIsMobile] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [showCopyToast, setShowCopyToast] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<{ url: string; name: string } | null>(null);

  const categoryIdFromUrl = searchParams.get('category');

  // Monitor screen size for mobile overlay check
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!categories.length) {
      dispatch(fetchWelcomeData());
    }
  }, [dispatch, categories.length]);

  // Pre-select category if specified in URL
  useEffect(() => {
    if (categories.length && categoryIdFromUrl) {
      const cat = categories.find((c) => String(c.id) === categoryIdFromUrl);
      if (cat) {
        dispatch(setSelectedCategory(cat));
        if (isMobile) {
          setMobileDrawerOpen(true);
        } else {
          setTimeout(() => {
            const el = document.getElementById('nominees-panel');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 300);
        }
      }
    }
  }, [categories, categoryIdFromUrl, dispatch, isMobile]);

  // Handle setting category from search/click
  const handleSelectCategory = (cat: Category) => {
    dispatch(setSelectedCategory(cat));
    setSearchParams({ category: String(cat.id) });
    if (isMobile) {
      setMobileDrawerOpen(true);
    } else {
      // Scroll smoothly to nominees view
      setTimeout(() => {
        const el = document.getElementById('nominees-panel');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  const getCategoryShareUrl = (catId: number) => {
    return `${window.location.origin}/categories?category=${catId}`;
  };

  const handleCopyLink = (cat: Category) => {
    const url = getCategoryShareUrl(cat.id);
    navigator.clipboard.writeText(url).then(() => {
      setShowCopyToast(true);
      setTimeout(() => setShowCopyToast(false), 3000);
    });
  };

  const handleNativeShare = (cat: Category) => {
    const url = getCategoryShareUrl(cat.id);
    if (navigator.share) {
      navigator.share({
        title: cat.name,
        text: `Vote for nominees in the category "${cat.name}" on TAPHE Awards!`,
        url: url,
      }).catch(console.error);
    } else {
      handleCopyLink(cat);
    }
  };

  const handleShowQrCode = (cat: Category) => {
    const url = getCategoryShareUrl(cat.id);
    setQrCodeData({ url, name: cat.name });
  };

  // Categorize or filter based on keyword helpers in names
  const getCategoryType = (name: string): 'individual' | 'organization' | 'special' => {
    const lower = name.toLowerCase();
    if (lower.includes('hospital') || lower.includes('organization') || lower.includes('institution') || lower.includes('centre')) {
      return 'organization';
    }
    if (lower.includes('special') || lower.includes('recognition') || lower.includes('honorary') || lower.includes('lifetime')) {
      return 'special';
    }
    return 'individual';
  };

  const filteredCategories = categories.filter((cat) => {
    const matchesSearch = cat.name.toLowerCase().includes(searchTerm.toLowerCase());
    const type = getCategoryType(cat.name);
    const matchesFilter = activeFilter === 'all' || type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  // Group filteredCategories by their group_name field
  const groupedCategories = filteredCategories.reduce<Record<string, typeof filteredCategories>>((acc, cat) => {
    const groupName = (cat as any).group_name || 'General';
    if (!acc[groupName]) acc[groupName] = [];
    acc[groupName].push(cat);
    return acc;
  }, {});
  const groupNames = Object.keys(groupedCategories).sort();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030303] flex flex-col items-center justify-center space-y-4 text-white">
        <Loader2 className="w-12 h-12 text-[#D90429] animate-spin" />
        <p className="text-[10px] font-black text-white/50 tracking-widest uppercase font-outfit">Loading Categories Dashboard...</p>
      </div>
    );
  }

  if (error || !categories.length) {
    return (
      <div className="min-h-screen bg-[#030303] flex flex-col items-center justify-center p-6 text-center text-white">
        <Award className="w-16 h-16 text-[#D90429] mb-4 animate-pulse" />
        <h3 className="text-xl font-bold font-outfit text-white">Connection Interrupted</h3>
        <p className="text-xs text-white/55 mt-2 max-w-sm leading-relaxed">{error || 'Unable to retrieve awards details from the server.'}</p>
        <button 
          onClick={() => dispatch(fetchWelcomeData())}
          className="mt-6 px-6 py-2.5 bg-[#D90429] hover:bg-[#B00020] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 shadow-md"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030303] text-white selection:bg-[#D90429] selection:text-white bg-mesh pt-24 pb-0 flex flex-col justify-between">
      <div className="max-w-7xl mx-auto px-6 md:px-16 w-full flex-grow pb-20">
        
        {/* Header Keynote Style */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-8 mb-16">
          <div className="text-left space-y-4 max-w-2xl">
            <span className="text-[10px] font-black text-[#D90429] uppercase tracking-widest font-outfit">TAPHE Excellence portal</span>
            <h1 className="text-5xl md:text-7xl font-outfit font-black tracking-tight uppercase leading-none text-white text-shadow-glow">
              Categories & <br />
              <span className="text-red-gradient">Nominees</span>
            </h1>
            <p className="text-xs md:text-sm text-white/50 leading-relaxed font-light font-inter max-w-xl">
              Explore the categories of Tanzanian health excellence. Review verified practitioner credentials, institutional impacts, and cast your votes.
            </p>
          </div>

          {/* Stats cards top right */}
          <div className="grid grid-cols-3 gap-4 w-full lg:w-auto shrink-0 lg:mt-4">
            <div className="p-4 px-6 rounded-2xl glass-panel bg-white/[0.01] border border-white/5 text-left space-y-1">
              <span className="text-[8px] font-black uppercase text-white/40 tracking-wider">Groups</span>
              <div className="text-lg font-black text-[#D90429] font-outfit">3</div>
              <p className="text-[9px] text-white/50 leading-tight">Focus Sectors</p>
            </div>
            <div className="p-4 px-6 rounded-2xl glass-panel bg-white/[0.01] border border-[#D90429]/20 text-left space-y-1 shadow-[0_0_15px_rgba(217,4,41,0.05)]">
              <span className="text-[8px] font-black uppercase text-white/40 tracking-wider">Awards</span>
              <div className="text-lg font-black text-[#D90429] font-outfit">24+</div>
              <p className="text-[9px] text-white/50 leading-tight">Categories</p>
            </div>
            <div className="p-4 px-6 rounded-2xl glass-panel bg-white/[0.01] border border-white/5 text-left space-y-1">
              <span className="text-[8px] font-black uppercase text-white/40 tracking-wider">Nominees</span>
              <div className="text-lg font-black text-[#D90429] font-outfit">150+</div>
              <p className="text-[9px] text-white/50 leading-tight">Candidates</p>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-3xl mb-12 backdrop-blur-xl">
          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {(['all', 'individual', 'organization', 'special'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 border ${
                  activeFilter === filter
                    ? 'bg-[#D90429] border-[#D90429]/20 text-white shadow-lg shadow-[#D90429]/10'
                    : 'bg-white/5 border-white/5 text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                {filter} Awards
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Search category name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 text-xs bg-black/40 border border-white/10 rounded-2xl focus:border-[#D90429] focus:ring-1 focus:ring-[#D90429] outline-none text-white transition-all"
            />
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Categories List Grid - Grouped by Category Group */}
          <div className={`${(!isMobile && selectedCategory) ? 'lg:col-span-6' : 'lg:col-span-12'} space-y-12 transition-all duration-500`}>
            
            {filteredCategories.length === 0 ? (
              <div className="py-16 text-center rounded-3xl border border-white/5 bg-white/[0.01]">
                <Award className="w-16 h-16 text-white/10 mx-auto mb-4" />
                <h4 className="text-sm font-bold text-white/70">No Categories Found</h4>
                <p className="text-xs text-white/50 mt-1 max-w-xs mx-auto leading-relaxed">No categories match your search filters. Try updating your keywords.</p>
              </div>
            ) : groupNames.map((groupName) => (
              <div key={groupName} className="space-y-4">
                {/* Group Header */}
                <div className="flex items-center gap-4">
                  <div className="w-1 h-8 rounded-full bg-gradient-to-b from-[#D90429] to-[#D90429]/10" />
                  <div>
                    <h2 className="text-base font-outfit font-black uppercase tracking-wider text-white">{groupName}</h2>
                    <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mt-0.5">{groupedCategories[groupName].length} Award Categories</p>
                  </div>
                  <div className="flex-1 h-px bg-white/5" />
                </div>

                {/* Categories within this Group */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {groupedCategories[groupName].map((cat) => {
                    const type = getCategoryType(cat.name);
                    const isSelected = selectedCategory?.id === cat.id;
                    
                    return (
                      <div
                        key={cat.id}
                        onClick={() => handleSelectCategory(cat)}
                        className={`p-6 rounded-3xl glass-panel text-left flex flex-col justify-between h-44 border cursor-pointer transition-all duration-500 group relative overflow-hidden ${
                          isSelected 
                            ? 'border-[#D90429] bg-[#D90429]/5 shadow-[0_0_30px_rgba(219,4,41,0.15)] translate-x-1' 
                            : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 hover:translate-y-[-2px]'
                        }`}
                      >
                        <div className="absolute -right-8 -top-8 w-24 h-24 bg-[#D90429]/5 rounded-full blur-[20px] pointer-events-none group-hover:bg-[#D90429]/10 transition-all duration-300" />
                        
                        {/* Category Details */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#D90429]">
                              {type === 'organization' ? <Building className="w-4 h-4" /> : type === 'special' ? <Heart className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-[#D90429]">
                              {type} Award
                            </span>
                          </div>
                          
                          <h3 className="font-outfit font-black text-sm uppercase leading-tight text-white line-clamp-2 pr-4 transition-colors group-hover:text-[#D90429]">
                            {cat.name}
                          </h3>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-auto">
                          <div className="flex flex-col text-left">
                            <span className="text-[9px] font-bold text-white/40 uppercase">
                              {cat.nominees?.length || 0} Candidates
                            </span>
                            {Number((cat as any).nomination_fee) > 0 ? (
                              <span className="text-[8px] font-bold text-[#D90429] uppercase mt-0.5">
                                Fee: {Number((cat as any).nomination_fee).toLocaleString()} TZS
                              </span>
                            ) : (
                              <span className="text-[8px] font-bold text-green-500 uppercase mt-0.5">
                                Free Entry
                              </span>
                            )}
                          </div>
                          <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-white group-hover:bg-[#D90429] group-hover:text-white transition-all duration-300">
                            <ChevronRight className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>{/* end left column */}

          {/* Right Nominees Panel (Hidden on Mobile) */}
          {!isMobile && selectedCategory && (
            <div id="nominees-panel" className="lg:col-span-6 bg-[#0b0b0b] border border-white/5 p-6 rounded-3xl space-y-6 backdrop-blur-xl lg:sticky lg:top-24">
              <div className="flex justify-between items-start pb-4 border-b border-white/5 text-left">
                <div className="flex-1 min-w-0 pr-4">
                  <span className="text-[9px] font-black text-[#D90429] uppercase tracking-widest font-outfit">Active Category Details</span>
                  <h2 className="text-base font-black text-white uppercase mt-0.5 truncate">{selectedCategory.name}</h2>
                  {/* Category Share controls */}
                  <div className="flex items-center gap-2 mt-3">
                    <button 
                      onClick={() => handleCopyLink(selectedCategory)}
                      title="Copy Category Link"
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-[#D90429] border border-white/20 hover:border-[#D90429] rounded-xl transition-all duration-300 text-white group"
                    >
                      <Copy className="w-3.5 h-3.5 text-white group-hover:text-white" />
                      <span className="text-[9px] font-bold uppercase tracking-wider">Copy Link</span>
                    </button>
                    <button 
                      onClick={() => handleNativeShare(selectedCategory)}
                      title="Share Category"
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-[#D90429] border border-white/20 hover:border-[#D90429] rounded-xl transition-all duration-300 text-white group"
                    >
                      <Share2 className="w-3.5 h-3.5 text-white group-hover:text-white" />
                      <span className="text-[9px] font-bold uppercase tracking-wider">Share</span>
                    </button>
                    <button 
                      onClick={() => handleShowQrCode(selectedCategory)}
                      title="Show Category QR Code"
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#D90429]/20 hover:bg-[#D90429] border border-[#D90429]/40 hover:border-[#D90429] rounded-xl transition-all duration-300 text-[#D90429] hover:text-white group"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span className="text-[9px] font-bold uppercase tracking-wider">QR Code</span>
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => { dispatch(setSelectedCategory(null)); setSearchParams({}); }}
                  className="p-1.5 hover:bg-white/5 border border-white/10 rounded-full transition-all shrink-0"
                >
                  <X className="w-4 h-4 text-white/60 hover:text-white" />
                </button>
              </div>

              {selectedCategory.nominees && selectedCategory.nominees.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-1 scrollbar-none">
                  {selectedCategory.nominees.map((nominee) => (
                    <div 
                      key={nominee.id}
                      className="bg-[#121212] border border-white/5 hover:border-[#D90429]/20 rounded-3xl shadow-md hover:shadow-xl transition-all duration-500 overflow-hidden flex flex-col justify-between group"
                    >
                      <div>
                        {/* Nominee Photo - tall, centered, prominent */}
                        <div className="relative h-56 bg-[#0d0d0d] overflow-hidden flex items-center justify-center">
                          {nominee.image_url ? (
                            <img 
                              src={nominee.image_url} 
                              alt={nominee.name} 
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = '/images/logo.webp';
                              }}
                              className="w-full h-full object-contain object-center p-4 filter brightness-[0.95] hover:brightness-100 group-hover:scale-105 transition-all duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-white/20 bg-[#121212] border-b border-white/5">
                              <Award className="w-16 h-16 text-white/10 group-hover:text-[#D90429]/40 transition-colors" />
                              <span className="text-[8px] uppercase tracking-widest font-bold mt-2 text-white/40">TAPHE Nominee</span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-transparent" />
                          <div className="absolute inset-x-0 bottom-0 p-4 text-center">
                            <h3 className="text-sm font-black font-outfit tracking-wide uppercase text-white drop-shadow-lg">{nominee.name}</h3>
                          </div>
                        </div>

                        <div className="p-4 space-y-3">
                          <p className="text-[11px] text-white/60 leading-relaxed text-center min-h-[40px] line-clamp-3 font-light">
                            {nominee.bio || 'Excellence in delivery of health services, research, or organizational impact supporting Tanzanian communities.'}
                          </p>
                        </div>
                      </div>

                      <div className="p-4 bg-[#0e0e0e] border-t border-white/5 flex items-center justify-center">
                        <button
                          onClick={() => dispatch(setActiveNominee({ ...nominee, category_name: selectedCategory?.name }))}
                          className="w-full py-2.5 bg-gradient-to-r from-[#D90429] to-[#FF3D57] hover:from-[#B00020] hover:to-[#D90429] text-white text-[9px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 shadow-lg shadow-[#D90429]/20"
                        >
                          <span>Cast Vote</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center rounded-3xl border border-white/5 bg-[#0b0b0b]">
                  <Award className="w-16 h-16 text-white/10 mx-auto mb-4" />
                  <h4 className="text-sm font-bold text-white/70">No Nominees Registered</h4>
                  <p className="text-xs text-white/50 mt-1 max-w-xs mx-auto leading-relaxed">This category is currently under screening. Validated candidates will appear shortly.</p>
                </div>
              )}
            </div>
          )}

        </div>

      </div>

      {/* Shared professional footer */}




      {/* MOBILE NOMINEES DRAWER OVERLAY */}
      <AnimatePresence>
        {isMobile && selectedCategory && mobileDrawerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm flex items-end justify-center"
          >
            <div className="absolute inset-0 z-0" onClick={() => { setMobileDrawerOpen(false); dispatch(setSelectedCategory(null)); setSearchParams({}); }} />

            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative z-10 w-full max-h-[85vh] bg-[#0c0c0c] border-t border-white/10 rounded-t-[32px] p-6 overflow-y-auto space-y-6 select-none scrollbar-none"
            >
              <div className="flex justify-between items-start">
                <div className="text-left flex-1 min-w-0 pr-4">
                  <span className="text-[9px] font-bold text-[#D90429] uppercase tracking-widest font-outfit">Category Nominees</span>
                  <h3 className="text-base font-black text-white uppercase mt-0.5 truncate">{selectedCategory.name}</h3>
                  {/* Share controls */}
                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    <button 
                      onClick={() => handleCopyLink(selectedCategory)}
                      title="Copy Category Link"
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-[#D90429] border border-white/20 hover:border-[#D90429] rounded-xl transition-all duration-300 text-white"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span className="text-[9px] font-bold uppercase tracking-wider">Copy Link</span>
                    </button>
                    <button 
                      onClick={() => handleNativeShare(selectedCategory)}
                      title="Share Category"
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-[#D90429] border border-white/20 hover:border-[#D90429] rounded-xl transition-all duration-300 text-white"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span className="text-[9px] font-bold uppercase tracking-wider">Share</span>
                    </button>
                    <button 
                      onClick={() => handleShowQrCode(selectedCategory)}
                      title="Show Category QR Code"
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#D90429]/20 hover:bg-[#D90429] border border-[#D90429]/40 hover:border-[#D90429] rounded-xl transition-all duration-300 text-[#D90429] hover:text-white"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span className="text-[9px] font-bold uppercase tracking-wider">QR Code</span>
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => { setMobileDrawerOpen(false); dispatch(setSelectedCategory(null)); setSearchParams({}); }}
                  className="p-1.5 hover:bg-white/5 border border-white/10 rounded-full transition-all shrink-0"
                >
                  <X className="w-4 h-4 text-white/60 hover:text-white" />
                </button>
              </div>

              {selectedCategory.nominees && selectedCategory.nominees.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedCategory.nominees.map((nominee) => (
                    <div 
                      key={nominee.id}
                      className="bg-[#121212] border border-white/5 rounded-3xl overflow-hidden flex flex-col justify-between"
                    >
                      {/* Nominee Photo - tall and centered */}
                      <div className="relative h-56 bg-[#0d0d0d] overflow-hidden flex items-center justify-center">
                        {nominee.image_url ? (
                          <img 
                            src={nominee.image_url} 
                            alt={nominee.name} 
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = '/images/logo.webp';
                            }}
                            className="w-full h-full object-contain object-center p-4 filter brightness-[0.95]"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-white/20 bg-[#151515]">
                            <Award className="w-16 h-16 text-white/10" />
                            <span className="text-[8px] uppercase tracking-widest font-bold mt-2 text-white/40">TAPHE Nominee</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-transparent" />

                        <div className="absolute inset-x-0 bottom-0 p-4 text-center">
                          <h3 className="text-sm font-black font-outfit tracking-wide uppercase text-white drop-shadow-lg">{nominee.name}</h3>
                        </div>
                      </div>

                      <div className="p-4 space-y-3">
                        <p className="text-[11px] text-white/65 leading-relaxed text-center line-clamp-3 font-light">
                          {nominee.bio || 'Excellence in delivery of health services, research, or organizational impact supporting Tanzanian communities.'}
                        </p>
                      </div>

                      <div className="p-4 bg-[#0a0a0a] border-t border-white/5 flex items-center justify-center">
                        <button
                          onClick={() => {
                            dispatch(setActiveNominee({ ...nominee, category_name: selectedCategory?.name }));
                            setMobileDrawerOpen(false);
                            dispatch(setSelectedCategory(null));
                          }}
                          className="w-full py-2.5 bg-gradient-to-r from-[#D90429] to-[#FF3D57] hover:from-[#B00020] hover:to-[#D90429] text-white text-[9px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-1.5"
                        >
                          <span>Cast Vote</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center rounded-3xl border border-white/5 bg-[#121212]">
                  <Award className="w-14 h-14 text-white/10 mx-auto mb-3" />
                  <h4 className="text-sm font-bold text-white/70">No Nominees Available</h4>
                  <p className="text-xs text-white/50 mt-1 max-w-xs mx-auto">Evaluated candidates will appear shortly.</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* QR Code Modal */}
      <AnimatePresence>
        {qrCodeData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <div className="absolute inset-0" onClick={() => setQrCodeData(null)} />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative z-10 w-full max-w-sm bg-[#0c0c0c] border border-white/10 p-6 rounded-3xl text-center space-y-4 shadow-2xl"
            >
              <button
                onClick={() => setQrCodeData(null)}
                className="absolute top-4 right-4 p-1.5 hover:bg-white/5 border border-white/10 rounded-full transition-all text-white/60 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
              <span className="text-[9px] font-black text-[#D90429] uppercase tracking-widest font-outfit">Scan to Vote</span>
              <h3 className="text-sm font-black text-white uppercase leading-snug px-4">{qrCodeData.name}</h3>
              
              <div className="bg-white p-4 rounded-2xl inline-block shadow-lg mx-auto">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrCodeData.url)}`}
                  alt="Category QR Code"
                  className="w-44 h-44"
                />
              </div>
              
              <p className="text-[10px] text-white/50 leading-relaxed max-w-xs mx-auto">
                Scan this QR code with your phone camera or QR scanner to open this category directly and cast your votes.
              </p>
              
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(qrCodeData.url);
                    setShowCopyToast(true);
                    setTimeout(() => setShowCopyToast(false), 2000);
                    setQrCodeData(null);
                  }}
                  className="flex-1 py-3 bg-[#D90429] hover:bg-[#B00020] text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
                >
                  Copy Link
                </button>
                <button
                  onClick={() => setQrCodeData(null)}
                  className="flex-1 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Copy Success Toast */}
      <AnimatePresence>
        {showCopyToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] px-4 py-3 bg-[#111111] border border-white/10 rounded-2xl flex items-center gap-2 shadow-2xl"
          >
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-[10px] font-bold text-white uppercase tracking-wider">Link copied to clipboard!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}




