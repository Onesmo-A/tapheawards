import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchWelcomeData, setSelectedCategory, Category } from '../store/slices/categorySlice';
import { setActiveNominee } from '../store/slices/voteSlice';
import VoteModal from './Nominees/VoteModal';
import Footer from './Components/Footer';
import { 
  Award, Loader2, Search, ArrowRight, ShieldCheck, 
  Users, Building, Heart, Star, Sparkles, ChevronRight, X 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Categories() {
  const dispatch = useAppDispatch();
  const { categories, loading, error, selectedCategory } = useAppSelector((state) => state.categories);
  const { activeNominee } = useAppSelector((state) => state.voting);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'individual' | 'organization' | 'special'>('all');
  const [isMobile, setIsMobile] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

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

  // Handle setting category from search/click
  const handleSelectCategory = (cat: Category) => {
    dispatch(setSelectedCategory(cat));
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
          
          {/* Left Categories List Grid */}
          <div className={`${(!isMobile && selectedCategory) ? 'lg:col-span-6' : 'lg:col-span-12'} grid grid-cols-1 md:grid-cols-2 gap-4 transition-all duration-500`}>
            {filteredCategories.map((cat) => {
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
                    <span className="text-[9px] font-bold text-white/40 uppercase">
                      {cat.nominees?.length || 0} Candidates
                    </span>
                    <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-white group-hover:bg-[#D90429] group-hover:text-white transition-all duration-300">
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredCategories.length === 0 && (
              <div className="col-span-full py-16 text-center rounded-3xl border border-white/5 bg-white/[0.01]">
                <Award className="w-16 h-16 text-white/10 mx-auto mb-4" />
                <h4 className="text-sm font-bold text-white/70">No Categories Found</h4>
                <p className="text-xs text-white/50 mt-1 max-w-xs mx-auto leading-relaxed">No categories match your search filters. Try updating your keywords.</p>
              </div>
            )}
          </div>

          {/* Right Nominees Panel (Hidden on Mobile) */}
          {!isMobile && selectedCategory && (
            <div id="nominees-panel" className="lg:col-span-6 bg-[#0b0b0b] border border-white/5 p-6 rounded-3xl space-y-6 backdrop-blur-xl lg:sticky lg:top-24">
              <div className="flex justify-between items-center pb-4 border-b border-white/5 text-left">
                <div>
                  <span className="text-[9px] font-black text-[#D90429] uppercase tracking-widest font-outfit">Active Category Details</span>
                  <h2 className="text-base font-black text-white uppercase mt-0.5 max-w-[85%]">{selectedCategory.name}</h2>
                </div>
                <button
                  onClick={() => dispatch(setSelectedCategory(null))}
                  className="p-1.5 hover:bg-white/5 border border-white/10 rounded-full transition-all"
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
                        <div className="relative h-40 bg-gradient-to-br from-white/5 to-white/10 overflow-hidden">
                          {nominee.image_url ? (
                            <img 
                              src={nominee.image_url} 
                              alt={nominee.name} 
                              className="w-full h-full object-cover filter brightness-[0.7] group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-white/20 bg-[#121212] border-b border-white/5">
                              <Award className="w-12 h-12 text-white/10 group-hover:text-[#D90429]/40 transition-colors" />
                              <span className="text-[8px] uppercase tracking-widest font-bold mt-1 text-white/40">TAPHE Nominee</span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                          <div className="absolute inset-x-0 bottom-0 p-4 text-left">
                            <h3 className="text-xs font-black font-outfit tracking-wide uppercase text-white">{nominee.name}</h3>
                          </div>
                        </div>

                        <div className="p-4 space-y-3">
                          <p className="text-[11px] text-white/60 leading-relaxed text-left min-h-[40px] line-clamp-3 font-light">
                            {nominee.bio || 'Excellence in delivery of health services, research, or organizational impact supporting Tanzanian communities.'}
                          </p>
                        </div>
                      </div>

                      <div className="p-4 bg-[#0e0e0e] border-t border-white/5 flex items-center justify-between gap-3">
                        <span className="text-[9px] text-[#D90429] font-black uppercase tracking-wider">Secure Vote</span>
                        <button
                          onClick={() => dispatch(setActiveNominee(nominee))}
                          className="px-4 py-2 bg-[#D90429] hover:bg-[#B00020] text-white text-[9px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center gap-1.5"
                        >
                          <span>Cast Choice</span>
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

      {/* active vote modal overlay */}
      <AnimatePresence>
        {activeNominee && (
          <VoteModal />
        )}
      </AnimatePresence>

      {/* MOBILE NOMINEES DRAWER OVERLAY */}
      <AnimatePresence>
        {isMobile && selectedCategory && mobileDrawerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm flex items-end justify-center"
          >
            <div className="absolute inset-0 z-0" onClick={() => { setMobileDrawerOpen(false); dispatch(setSelectedCategory(null)); }} />

            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative z-10 w-full max-h-[85vh] bg-[#0c0c0c] border-t border-white/10 rounded-t-[32px] p-6 overflow-y-auto space-y-6 select-none scrollbar-none"
            >
              <div className="flex justify-between items-start">
                <div className="text-left">
                  <span className="text-[9px] font-bold text-[#D90429] uppercase tracking-widest font-outfit">Category Nominees</span>
                  <h3 className="text-base font-black text-white uppercase mt-0.5 max-w-[85%]">{selectedCategory.name}</h3>
                </div>
                <button
                  onClick={() => { setMobileDrawerOpen(false); dispatch(setSelectedCategory(null)); }}
                  className="p-1.5 hover:bg-white/5 border border-white/10 rounded-full transition-all"
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
                      <div className="relative h-40 bg-gradient-to-br from-white/5 to-white/10 overflow-hidden">
                        {nominee.image_url ? (
                          <img 
                            src={nominee.image_url} 
                            alt={nominee.name} 
                            className="w-full h-full object-cover filter brightness-[0.7]"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-white/20 bg-[#151515]">
                            <Award className="w-12 h-12 text-white/10" />
                            <span className="text-[8px] uppercase tracking-widest font-bold mt-1 text-white/40">TAPHE Nominee</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 p-4 text-left">
                          <h3 className="text-xs font-black font-outfit tracking-wide uppercase text-white">{nominee.name}</h3>
                        </div>
                      </div>

                      <div className="p-4 space-y-3">
                        <p className="text-[11px] text-white/65 leading-relaxed text-left line-clamp-3 font-light">
                          {nominee.bio || 'Excellence in delivery of health services, research, or organizational impact supporting Tanzanian communities.'}
                        </p>
                      </div>

                      <div className="p-4 bg-[#0a0a0a] border-t border-white/5 flex items-center justify-between gap-4">
                        <span className="text-[9px] text-[#D90429] font-black uppercase tracking-wider">Secure Vote</span>
                        <button
                          onClick={() => {
                            dispatch(setActiveNominee(nominee));
                            setMobileDrawerOpen(false);
                            dispatch(setSelectedCategory(null));
                          }}
                          className="px-4 py-2 bg-[#D90429] hover:bg-[#B00020] text-white text-[9px] font-black uppercase tracking-widest rounded-xl transition-all"
                        >
                          Vote
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
    </div>
  );
}
