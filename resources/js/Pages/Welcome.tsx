import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchWelcomeData, setSelectedCategory, Category } from '../store/slices/categorySlice';
import { setActiveNominee } from '../store/slices/voteSlice';
import VoteModal from './Nominees/VoteModal';
import GalleryCard from './Components/GalleryCard';
import Footer from './Components/Footer';
import { 
  Award, Loader2, Sparkles, Heart, Users, ChevronRight, 
  Instagram, Facebook, ArrowRight, ShieldCheck, CheckCircle, 
  Calendar, MapPin, Mail, Phone, Ticket, Send, Building, Star, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const sponsorLogos = [
  '/images/sponsors/GANZI.png',
  '/images/sponsors/jeziOriginal.png',
  '/images/sponsors/MAGARI.png',
  '/images/sponsors/main-sponsor.png',
  '/images/sponsors/MAKUNDUCHI.png',
  '/images/sponsors/mama-viwanja.png',
  '/images/sponsors/MQ.png',
  '/images/sponsors/NIVES_TRENDS.png',
  '/images/sponsors/PRO-SHARE.png',
  '/images/sponsors/PWEZA-BEACH.png',
  '/images/sponsors/PWEZA.png',
  '/images/sponsors/RAMA.png',
  '/images/sponsors/simuhadhiYako.png',
  '/images/sponsors/sponsor2.png',
  '/images/sponsors/SPONSORS-BAR.png',
  '/images/sponsors/SPONSORS-CROWN-MEDIA.png',
  '/images/sponsors/SPONSORS-DOLLY.png',
  '/images/sponsors/SPONSORS-GAZEM.png',
  '/images/sponsors/SPONSORS-jay.png',
  '/images/sponsors/SPONSORS-STOCK.png',
  '/images/sponsors/SPONSORS1.png',
  '/images/sponsors/SPONSORSkim.png'
];

const pastWinners = [
  {
    name: 'Bochi Hospital',
    award: 'Best Private Hospital of the Year',
    description: 'Recognized for world-class patient-centric clinical delivery and state-of-the-art diagnostic facilities.',
    image: '/images/hero/slide-1.png'
  },
  {
    name: 'Dr. Sarah Joseph',
    award: 'Best Medical Researcher of the Year',
    description: 'Awarded for pioneering research in local epidemiological studies supporting Tanzanian community clinics.',
    image: '/images/hero/slide-2.png'
  },
  {
    name: 'Muhimbili Medical Lab',
    award: 'Health Innovator of the Year',
    description: 'Honored for introducing scalable digital diagnostics processing and rapid local response protocols.',
    image: '/images/hero/slide-3.png'
  }
];

const galleryItems = [
  { title: 'TAPHE Gala Banquet 2025', image: '/images/about-us.jpg', type: 'wide' },
  { title: 'Excellence Summit Panel', image: '/images/about-us2.jpg', type: 'tall' },
  { title: 'Charity Marathon Run', image: '/images/marathon-promo.jpg', type: 'square' },
  { title: 'Board Evaluation Meeting', image: '/images/sponsorship-promo.jpg', type: 'tall' },
  { title: 'Gala Banquet Arena', image: '/images/ticket-bg.jpg', type: 'wide' },
  { title: 'TAPHE Awards Ceremony', image: '/images/past_winners.png', type: 'square' }
];

export default function Welcome() {
  const dispatch = useAppDispatch();
  const { categories, loading, error, selectedCategory } = useAppSelector((state) => state.categories);
  const { activeNominee } = useAppSelector((state) => state.voting);

  const [activeStep, setActiveStep] = useState(1);
  const [currentWinnerIndex, setCurrentWinnerIndex] = useState(0);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Countdown timer logic
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date('2026-11-15T23:59:59').getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = target - now;
      if (diff <= 0) {
        clearInterval(interval);
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Monitor screen size for mobile overlay check
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    dispatch(fetchWelcomeData());
  }, [dispatch]);

  // Track scrolling to sync vertical timeline indicator dots
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY;
      const height = window.innerHeight;
      
      if (scrollPos < height * 0.8) {
        setActiveStep(1);
      } else if (scrollPos >= height * 0.8 && scrollPos < height * 1.8) {
        setActiveStep(2);
      } else {
        setActiveStep(3);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCategoryCardClick = (slugKeyword: string) => {
    const match = categories.find(c => c.name.toLowerCase().includes(slugKeyword.toLowerCase()));
    if (match) {
      dispatch(setSelectedCategory(match));
      if (isMobile) {
        setMobileDrawerOpen(true);
      } else {
        scrollToSection('voting-arena');
      }
    } else {
      scrollToSection('voting-arena');
    }
  };

  const handleSelectCategory = (cat: Category) => {
    dispatch(setSelectedCategory(cat));
    if (isMobile) {
      setMobileDrawerOpen(true);
    } else {
      scrollToSection('voting-arena');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030303] flex flex-col items-center justify-center space-y-4 text-white">
        <Loader2 className="w-12 h-12 text-[#D90429] animate-spin" />
        <p className="text-[10px] font-black text-white/50 tracking-widest uppercase font-outfit">TAPHE Excellence Loading...</p>
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
          className="mt-6 px-6 py-2.5 bg-[#D90429] hover:bg-[#B00020] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 shadow-md shadow-[#D90429]/15 border border-[#D90429]/20"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  const displayedCategories = categories.slice(0, 8);

  return (
    <div 
      style={{ 
        '--x': '50%', 
        '--y': '50%' 
      } as React.CSSProperties}
      className="min-h-screen bg-[#030303] text-white selection:bg-[#D90429] selection:text-white bg-radial overflow-x-hidden"
    >
      {/* Cinematic Film Grain Overlay */}
      <div className="noise-overlay" />

      {/* 1. HERO SECTION */}
      <section 
        className="relative min-h-screen flex flex-col justify-between pt-0 mt-0 pb-8 px-6 md:px-16 overflow-hidden bg-cover bg-center bg-no-repeat bg-[#030303]"
        style={{ backgroundImage: "url('/images/hero_theme.png')" }}
      >
        {/* Left Side indicators */}
        <div className="hidden lg:flex flex-col items-center gap-2 absolute left-12 top-1/2 -translate-y-1/2 z-20">
          <div className="flex flex-col items-center gap-2">
            <span className={`text-[10px] font-black transition-all duration-300 ${activeStep === 1 ? 'text-[#D90429] scale-110' : 'text-white/30'}`}>01</span>
            <div className="h-6 w-px bg-white/10 relative flex justify-center items-center">
              {activeStep === 1 && (
                <motion.div 
                  layoutId="activeDot"
                  className="absolute w-1.5 h-1.5 rounded-full bg-[#D90429] shadow-[0_0_8px_#D90429]" 
                />
              )}
            </div>
            <span className={`text-[10px] font-black transition-all duration-300 ${activeStep === 2 ? 'text-[#D90429] scale-110' : 'text-white/30'}`}>02</span>
            <div className="h-6 w-px bg-white/10 relative flex justify-center items-center">
              {activeStep === 2 && (
                <motion.div 
                  layoutId="activeDot"
                  className="absolute w-1.5 h-1.5 rounded-full bg-[#D90429] shadow-[0_0_8px_#D90429]" 
                />
              )}
            </div>
            <span className={`text-[10px] font-black transition-all duration-300 ${activeStep === 3 ? 'text-[#D90429] scale-110' : 'text-white/30'}`}>03</span>
            
            <div 
              className="flex flex-col items-center gap-1 mt-4 cursor-pointer text-white/40 hover:text-[#D90429] transition-colors" 
              onClick={() => scrollToSection('story-excellence')}
            >
              <div className="w-4 h-7 border border-white/20 rounded-full flex justify-center p-1 bg-transparent backdrop-blur-md">
                <motion.div 
                  className="w-1 h-1.5 rounded-full bg-[#D90429]" 
                  animate={{ y: [0, 6, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                />
              </div>
              <span className="text-[10px] font-bold">↓</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full z-10 pt-28 lg:pt-36 mt-0 lg:-mt-2">
          <div className="lg:col-span-6 space-y-6 text-left max-w-xl lg:pl-12">
            <div className="space-y-3">
              <div className="relative inline-block">
                <h2 className="text-[12px] md:text-sm font-black text-[#D90429] uppercase tracking-widest font-outfit">
                  Tanzania People's Health Excellence
                </h2>
                <div className="absolute -bottom-1 left-0 w-[42%] h-0.5 bg-[#D90429]" />
              </div>
              <h1 className="text-7xl md:text-8xl lg:text-[105px] font-outfit font-black tracking-tight leading-none text-white text-shadow-glow">
                Awards
              </h1>
            </div>

            <p className="text-xs md:text-sm text-white/55 leading-relaxed font-light font-inter max-w-md">
              Celebrating individuals and organizations making a difference in health across Tanzania.
            </p>

            <div className="flex flex-wrap gap-4 pt-1">
              <button 
                onClick={() => scrollToSection('voting-arena')}
                className="px-6 py-2.5 bg-black/60 hover:bg-[#D90429]/10 border border-[#D90429]/40 hover:border-[#D90429] text-white text-[10px] font-black tracking-widest uppercase rounded-full flex items-center gap-3 transition-all duration-300 group shadow-[0_0_15px_rgba(219,4,41,0.05)] hover:shadow-[0_0_25px_rgba(219,4,41,0.2)]"
              >
                <span>Nominate Now</span>
                <div className="w-5.5 h-5.5 rounded-full bg-[#D90429] flex items-center justify-center text-white group-hover:scale-105 transition-transform duration-300">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>
            </div>
          </div>

          <div className="lg:hidden flex justify-center items-center py-4 w-full z-10">
            <div className="relative">
              <div className="absolute w-[200px] h-[200px] bg-[#D90429]/10 rounded-full blur-[80px] pointer-events-none" />
              <img 
                src="/images/trophy_hero.png" 
                alt="TAPHE Trophy" 
                className="h-[280px] w-auto object-contain drop-shadow-[0_15px_35px_rgba(217,4,41,0.2)] animate-float"
              />
            </div>
          </div>

          <div className="lg:col-span-6 hidden lg:block h-0" />
        </div>

        <div className="w-full z-20 relative mt-6 lg:mt-8 lg:pl-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <GalleryCard 
              title={"Individual\nAwards"} 
              icon={<Users className="w-5 h-5" />} 
              imageSrc="/images/ind_awards.png"
              onClick={() => handleCategoryCardClick('practitioner')}
            />
            <GalleryCard 
              title={"Organization\nAwards"} 
              icon={<Building className="w-5 h-5" />} 
              imageSrc="/images/org_awards.png"
              onClick={() => handleCategoryCardClick('hospital')}
            />
            <GalleryCard 
              title={"Special\nRecognitions"} 
              icon={<Heart className="w-5 h-5" />} 
              imageSrc="/images/special_awards.png"
              onClick={() => handleCategoryCardClick('special')}
            />
          </div>

          <div className="flex justify-center items-center gap-1.5 mt-6 w-full">
            <div className="w-16 h-[2px] bg-white/10 relative rounded-full overflow-visible">
              <div className="absolute top-1/2 -translate-y-1/2 left-[58%] w-2 h-2 bg-[#D90429] rounded-full shadow-[0_0_8px_#D90429]" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. DYNAMIC COUNTDOWN TIMER SECTION */}
      <section className="py-14 bg-[#070707] border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-left space-y-2">
            <span className="text-[9px] font-black text-[#D90429] uppercase tracking-widest font-outfit">Urgency standing</span>
            <h2 className="text-2xl font-outfit font-black tracking-tight text-white uppercase">Online Voting Closes In</h2>
            <p className="text-xs text-white/45 font-light">Cast your secure choice before the audit locks database submissions.</p>
          </div>

          <div className="flex gap-4">
            {[
              { val: timeLeft.days, label: 'Days' },
              { val: timeLeft.hours, label: 'Hrs' },
              { val: timeLeft.minutes, label: 'Min' },
              { val: timeLeft.seconds, label: 'Sec' }
            ].map((unit, idx) => (
              <div key={idx} className="w-20 py-4 rounded-2xl glass-panel bg-white/[0.02] border border-white/5 flex flex-col items-center shadow-lg shadow-black/20">
                <span className="text-2xl font-black text-[#D90429] font-outfit">{str_pad(unit.val)}</span>
                <span className="text-[8px] uppercase tracking-widest text-white/40 font-bold mt-1">{unit.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2.5. STORY & STATS SECTION */}
      <section id="story-excellence" className="py-24 bg-[#030303] border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6 text-left">
              <span className="text-[10px] font-black text-[#D90429] uppercase tracking-widest font-outfit">The Excellence Story</span>
              <h2 className="text-3xl md:text-5xl font-outfit font-black tracking-tight leading-tight text-white">
                A Tribute to <br />
                <span className="text-white/50">Healthcare Heroes</span>
              </h2>
              <p className="text-xs md:text-sm text-white/60 leading-relaxed font-light max-w-md mx-auto lg:mx-0">
                Every single day, across the clinics, hospitals, and communities of Tanzania, dedicated practitioners execute quiet miracles. TAPHE stands to honor, validate, and celebrate this unmatched devotion to human life and wellness.
              </p>
              <div className="h-px w-24 bg-[#D90429] opacity-60" />
            </div>

            <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-3xl glass-panel bg-white/[0.01] text-left space-y-2 border border-white/5 hover:border-[#D90429]/25 transition-all">
                <span className="text-xs font-bold text-white/40 uppercase">Categories</span>
                <h3 className="text-3xl md:text-4xl font-outfit font-black text-[#D90429]">24+</h3>
                <p className="text-[10px] text-white/60">Distinct honors covering practitioners, services & tech.</p>
              </div>

              <div className="p-6 rounded-3xl glass-panel bg-white/[0.01] text-left space-y-2 border border-white/5 hover:border-[#D90429]/25 transition-all">
                <span className="text-xs font-bold text-white/40 uppercase">Voter Turnout</span>
                <h3 className="text-3xl md:text-4xl font-outfit font-black text-[#D90429]">150k+</h3>
                <p className="text-[10px] text-white/60">Secure and validated public choices processed.</p>
              </div>

              <div className="p-6 rounded-3xl glass-panel bg-white/[0.01] text-left space-y-2 border border-white/5 hover:border-[#D90429]/25 transition-all col-span-2 md:col-span-1">
                <span className="text-xs font-bold text-white/40 uppercase">Data Integrity</span>
                <h3 className="text-3xl md:text-4xl font-outfit font-black text-[#D90429]">99.9%</h3>
                <p className="text-[10px] text-white/60">HMAC cryptographic signed voting verification.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. AWARD CATEGORIES SECTION */}
      <section className="py-24 bg-[#070707] border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-16 space-y-12">
          <div className="text-left space-y-2 max-w-xl">
            <span className="text-[10px] font-black text-[#D90429] uppercase tracking-widest font-outfit">Showcase</span>
            <h2 className="text-3xl md:text-5xl font-outfit font-black tracking-tight text-white uppercase">Featured Fields</h2>
            <p className="text-xs text-white/50 leading-relaxed font-light">Explore targeted areas of healthcare honor. Select any category cards to view nominees and start voting.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.slice(0, 3).map((cat, idx) => (
              <div 
                key={cat.id} 
                onClick={() => handleSelectCategory(cat)}
                className="group relative h-72 rounded-3xl overflow-hidden glass-panel border border-white/5 flex flex-col justify-end p-6 cursor-pointer transition-all duration-500 hover:border-[#D90429]/30"
              >
                <div className="absolute inset-0 bg-red-gradient opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
                <div className="absolute inset-0 z-0">
                  <div className="absolute inset-0 bg-black/60 z-10 transition-colors group-hover:bg-black/50" />
                  <img 
                    src={idx === 0 ? '/images/ind_awards.png' : idx === 1 ? '/images/org_awards.png' : '/images/special_awards.png'} 
                    alt="Category Backdrop" 
                    className="w-full h-full object-cover transition-transform duration-700 scale-100 group-hover:scale-105" 
                  />
                </div>

                <div className="relative z-20 space-y-2 text-left">
                  <span className="text-[9px] font-black text-[#D90429] uppercase tracking-widest">TAPHE Core Category</span>
                  <h3 className="text-lg md:text-xl font-outfit font-black text-white uppercase leading-tight pr-4">{cat.name}</h3>
                  <div className="flex items-center gap-2 text-[10px] text-[#D90429] font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span>Explore Nominees</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3.5. VOTING ARENA */}
      <section id="voting-arena" className="py-24 bg-[#030303] border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-16">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div className="space-y-2 text-left">
              <span className="text-[10px] font-black text-[#D90429] uppercase tracking-widest font-outfit">Live Standing</span>
              <h2 className="text-3xl md:text-5xl font-outfit font-black tracking-tight text-white uppercase">Cast Your Choice</h2>
            </div>
            <p className="text-xs text-white/50 max-w-xs leading-relaxed text-left md:text-right font-light">
              Explore categories, review nominee bios, and verify securely to ensure your vote impacts Tanzanian healthcare recognition.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4 space-y-3 lg:sticky lg:top-24">
              <h3 className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-3 mb-2 text-left">Category Selection</h3>
              <div className="flex flex-col gap-2 pr-1">
                {displayedCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleSelectCategory(cat)}
                    className={`text-left px-5 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-between gap-3 border ${
                      selectedCategory?.id === cat.id
                        ? 'bg-[#D90429] border-[#D90429]/20 text-white shadow-lg shadow-[#D90429]/10 translate-x-1 lg:translate-x-2'
                        : 'bg-white/[0.02] border-white/5 text-white/60 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <span className="truncate pr-2">{cat.name}</span>
                    <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${
                      selectedCategory?.id === cat.id ? 'text-white translate-x-0.5' : 'text-white/30'
                    } transition-transform`} />
                  </button>
                ))}

                {categories.length > 8 && (
                  <Link
                    to="/categories"
                    className="flex items-center justify-between px-5 py-4 rounded-2xl text-xs font-black uppercase tracking-wider border border-dashed border-[#D90429]/40 bg-transparent text-[#D90429] hover:bg-[#D90429]/5 transition-all duration-300 hover:scale-[1.01]"
                  >
                    <span>More Categories...</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>

            {/* Right Column: Nominees Showcase (Hidden on Mobile) */}
            <div className="lg:col-span-8 hidden lg:block">
              {selectedCategory ? (
                <div className="space-y-6">
                  <div className="flex justify-between items-center mb-6 pl-2">
                    <div className="text-left">
                      <span className="text-[9px] font-bold text-[#D90429] uppercase tracking-widest font-outfit">Active Selection</span>
                      <h2 className="text-lg font-black text-white uppercase mt-0.5">{selectedCategory.name}</h2>
                    </div>
                    <span className="px-3.5 py-1.5 bg-white/5 border border-white/10 text-white/65 rounded-full text-[9px] font-bold uppercase tracking-wider">
                      Nominees: {selectedCategory.nominees?.length || 0}
                    </span>
                  </div>

                  {selectedCategory.nominees && selectedCategory.nominees.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {selectedCategory.nominees.map((nominee) => (
                        <div 
                          key={nominee.id}
                          className="bg-[#0b0b0b] border border-white/5 hover:border-[#D90429]/20 rounded-3xl shadow-md hover:shadow-xl transition-all duration-500 overflow-hidden flex flex-col justify-between group"
                        >
                          <div>
                            <div className="relative h-48 bg-gradient-to-br from-white/5 to-white/10 overflow-hidden">
                              {nominee.image_url ? (
                                <img 
                                  src={nominee.image_url} 
                                  alt={nominee.name} 
                                  className="w-full h-full object-cover filter brightness-[0.7] group-hover:scale-105 transition-transform duration-500"
                                />
                              ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-white/20 bg-[#121212] border-b border-white/5">
                                  <Award className="w-14 h-14 text-white/10 group-hover:text-[#D90429]/40 transition-colors" />
                                  <span className="text-[8px] uppercase tracking-widest font-bold mt-2 text-white/40">TAPHE Nominee</span>
                                </div>
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                              <div className="absolute inset-x-0 bottom-0 p-5 text-left">
                                <h3 className="text-sm font-black font-outfit tracking-wide uppercase text-white">{nominee.name}</h3>
                              </div>
                            </div>

                            <div className="p-5 space-y-4">
                              <p className="text-xs text-white/60 leading-relaxed text-left min-h-[48px] line-clamp-3 font-light">
                                {nominee.bio || 'Excellence in delivery of health services, research, or organizational impact supporting Tanzanian communities.'}
                              </p>
                              <div className="flex gap-2.5 pt-3 border-t border-white/5">
                                {nominee.instagram_url && (
                                  <a href={nominee.instagram_url} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-[#D90429]/10 text-white/40 hover:text-[#D90429] rounded-xl transition-colors border border-transparent hover:border-[#D90429]/10">
                                    <Instagram className="w-3.5 h-3.5" />
                                  </a>
                                )}
                                {nominee.facebook_url && (
                                  <a href={nominee.facebook_url} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-[#D90429]/10 text-white/40 hover:text-[#D90429] rounded-xl transition-colors border border-transparent hover:border-[#D90429]/10">
                                    <Facebook className="w-3.5 h-3.5" />
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="p-5 bg-[#0e0e0e] border-t border-white/5 flex items-center justify-between gap-4">
                            <span className="text-[10px] text-[#D90429] font-black uppercase tracking-wider">Secure Vote</span>
                            <button
                              onClick={() => dispatch(setActiveNominee(nominee))}
                              className="px-5 py-2.5 bg-[#D90429] hover:bg-[#B00020] text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center gap-2 active:scale-95 shadow-[0_4px_15px_rgba(217,4,41,0.15)]"
                            >
                              <span>Vote</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-16 text-center rounded-3xl glass-panel border border-white/5 bg-[#0b0b0b]">
                      <Award className="w-16 h-16 text-white/10 mx-auto mb-4" />
                      <h4 className="text-sm font-bold text-white/70">No Nominees Available</h4>
                      <p className="text-xs text-white/50 mt-1 max-w-xs mx-auto leading-relaxed">This category is currently being evaluated. Validated candidates will appear shortly.</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-16 text-center rounded-3xl glass-panel border border-white/5 bg-[#0b0b0b]">
                  <Award className="w-16 h-16 text-white/10 mx-auto mb-4" />
                  <h4 className="text-sm font-bold text-white/70">Select a Category</h4>
                  <p className="text-xs text-white/50 mt-1">Please select an award category to view candidates.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 4. VERTICAL TIMELINE SECTION */}
      <section id="event-timeline" className="py-24 bg-[#070707] border-t border-white/5 relative z-10">
        <div className="max-w-4xl mx-auto px-6 md:px-16 text-center">
          <div className="space-y-3 mb-20">
            <span className="text-[10px] font-black text-[#D90429] uppercase tracking-widest font-outfit">The Road to Glory</span>
            <h2 className="text-3xl md:text-5xl font-outfit font-black tracking-tight uppercase text-white">Gala Night Timeline</h2>
            <p className="text-xs text-white/50 leading-relaxed font-light max-w-md mx-auto">Track the milestones leading up to the grand Tanzania People's Health Excellence Awards ceremony.</p>
          </div>

          <div className="relative border-l-2 border-white/10 ml-4 md:ml-1/2 space-y-12">
            {[
              {
                title: 'Voter Nominations',
                date: 'June 15 - July 15, 2026',
                description: 'Public voting portal is open across all categories. Live database verification and registration checks are fully active.',
                icon: <Calendar className="w-4 h-4" />
              },
              {
                title: 'Integrity Auditing',
                date: 'July 18, 2026',
                description: 'Compilation of choices and verification of security signatures. Removal of any compromised inputs to ensure total trust.',
                icon: <ShieldCheck className="w-4 h-4" />
              },
              {
                title: 'TAPHE Gala Banquet',
                date: 'July 25, 2026',
                description: 'Grand celebration banquet and award presentation ceremony. Announcement of winners live under the spotlight.',
                icon: <Award className="w-4 h-4" />
              }
            ].map((event, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="relative pl-8 md:pl-12 text-left"
              >
                <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-[#030303] border-2 border-[#D90429] flex items-center justify-center text-[#D90429] shadow-[0_0_8px_#D90429]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D90429]" />
                </div>

                <div className="p-6 rounded-3xl glass-panel bg-white/[0.01] border border-white/5 space-y-2 hover:border-[#D90429]/20 transition-all max-w-xl">
                  <span className="text-[9px] font-bold text-[#D90429] uppercase tracking-wider">{event.date}</span>
                  <h3 className="text-sm font-bold text-white uppercase font-outfit">{event.title}</h3>
                  <p className="text-xs text-white/50 leading-relaxed font-light">{event.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CINEMATIC PAST WINNERS SLIDER */}
      <section className="relative py-32 bg-[#030303] border-t border-white/5 overflow-hidden z-10 min-h-[500px]">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/75 z-10" />
          <AnimatePresence mode="wait">
            <motion.img 
              key={currentWinnerIndex}
              src={pastWinners[currentWinnerIndex].image}
              alt="Past Winner Presentation"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 0.35, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="w-full h-full object-cover filter brightness-[0.4]"
            />
          </AnimatePresence>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-16 relative z-20 h-full flex flex-col justify-center items-start text-left">
          <span className="text-[10px] font-black text-[#D90429] uppercase tracking-widest font-outfit">Past Laureates</span>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full mt-6">
            <div className="lg:col-span-7 space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentWinnerIndex}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-4"
                >
                  <h3 className="text-xs font-bold text-[#D90429] uppercase tracking-widest font-outfit">
                    {pastWinners[currentWinnerIndex].award}
                  </h3>
                  <h2 className="text-4xl md:text-6xl font-outfit font-black text-white uppercase tracking-tight">
                    {pastWinners[currentWinnerIndex].name}
                  </h2>
                  <p className="text-xs md:text-sm text-white/70 max-w-xl leading-relaxed font-light">
                    {pastWinners[currentWinnerIndex].description}
                  </p>
                </motion.div>
              </AnimatePresence>

              <div className="flex gap-3 pt-4">
                {pastWinners.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentWinnerIndex(idx)}
                    className={`h-1.5 transition-all duration-300 rounded-full ${
                      currentWinnerIndex === idx ? 'w-8 bg-[#D90429]' : 'w-2 bg-white/20'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <Link 
                to="/about"
                className="px-6 py-3 border border-white/10 hover:border-white/20 hover:bg-white/5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all"
              >
                <span>Browse Hall of Fame</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5.2. TESTIMONIALS SECTION */}
      <section className="py-24 bg-[#070707] border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-16 text-center space-y-12">
          <div className="space-y-2">
            <span className="text-[10px] font-black text-[#D90429] uppercase tracking-widest font-outfit">Testimonials</span>
            <h2 className="text-3xl md:text-5xl font-outfit font-black tracking-tight uppercase text-white">Words from Leaders</h2>
            <p className="text-xs text-white/50 leading-relaxed font-light max-w-md mx-auto">Explore how the Tanzanian healthcare platform elevates recognition and quality sectors.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto text-left">
            <div className="p-8 rounded-[32px] glass-panel bg-white/[0.01] border border-white/5 space-y-6 hover:border-[#D90429]/20 transition-all flex flex-col justify-between">
              <p className="text-sm md:text-base text-white/80 leading-relaxed font-light italic">
                "We are honored to welcome patients from across Africa who choose our hospitals for medical treatments and complex surgeries. TAPHE Awards plays a crucial role in validating our regional healthcare quality."
              </p>
              <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10 bg-slate-800">
                  <img src="/images/testimonials/saad-mtambule.jpg" alt="Hon. Saad Mtambule" className="w-full h-full object-cover" onError={(e: any) => e.target.src = '/images/placeholder.png'} />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase text-white font-outfit">Hon. Saad Mtambule</h4>
                  <p className="text-[9px] text-[#D90429] font-bold uppercase tracking-wider mt-0.5">Kinondoni District Commissioner</p>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-[32px] glass-panel bg-white/[0.01] border border-white/5 space-y-6 hover:border-[#D90429]/20 transition-all flex flex-col justify-between">
              <p className="text-sm md:text-base text-white/80 leading-relaxed font-light italic">
                "Participating in the TAPHE Awards offers more than a trophy. It brings validation, sector-wide recognition, and visibility to innovators supporting regional health centers across Tanzania."
              </p>
              <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10 bg-slate-800">
                  <img src="/images/testimonials/karim-haji.jpg" alt="Mr. Karim S. Haji" className="w-full h-full object-cover" onError={(e: any) => e.target.src = '/images/placeholder.png'} />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase text-white font-outfit">Mr. Karim S. Haji</h4>
                  <p className="text-[9px] text-[#D90429] font-bold uppercase tracking-wider mt-0.5">Director - WICoL</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5.5. EVENT LOCATION & MAP SECTION */}
      <section className="py-24 bg-[#030303] border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6 text-left">
            <span className="text-[10px] font-black text-[#D90429] uppercase tracking-widest font-outfit">Venue Location</span>
            <h2 className="text-3xl md:text-5xl font-outfit font-black tracking-tight uppercase text-white">Gala Venue</h2>
            
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#D90429] shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase text-white font-outfit">Event Venue</h4>
                  <p className="text-xs text-white/50 mt-1 leading-relaxed">TBA Event Venue, Dar es Salaam, Tanzania.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#D90429] shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase text-white font-outfit">Banquet Schedule</h4>
                  <p className="text-xs text-white/50 mt-1 leading-relaxed">December 20, 2026 at 18:30 PM (EAT).</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-[32px] overflow-hidden border border-white/5 glass-panel bg-white/[0.01] p-2 shadow-2xl">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d253840.48512134567!2d39.1171804!3d-6.8140417!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x185c4bbf573d8435%3A0xe54e6097d74f7626!2sDar%20es%20Salaam!5e0!3m2!1sen!2stz!4v1700000000000!5m2!1sen!2stz" 
                width="100%" 
                height="320" 
                style={{ border: 0, borderRadius: '24px' }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SPONSORS MARQUEE SECTION */}
      <section className="py-20 bg-[#070707] border-t border-white/5 overflow-hidden relative z-10 w-full">
        <div className="max-w-7xl mx-auto px-6 md:px-16 mb-10 text-center">
          <span className="text-[10px] font-black text-[#D90429] uppercase tracking-widest font-outfit">Sponsors & Partners</span>
          <h2 className="text-xl md:text-2xl font-outfit font-black tracking-tight uppercase text-white mt-1">Supported by Industry Leaders</h2>
        </div>

        <div className="relative flex overflow-x-hidden w-full py-4">
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#070707] to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#070707] to-transparent z-10 pointer-events-none" />

          <div className="animate-marquee flex gap-8 whitespace-nowrap">
            {sponsorLogos.map((logo, idx) => (
              <div 
                key={`sponsor-1-${idx}`} 
                className="inline-flex items-center justify-center h-20 w-36 px-4 py-2 bg-white/[0.01] hover:bg-white/[0.04] border border-white/5 hover:border-white/10 rounded-2xl transition-all duration-300 select-none group/logo"
              >
                <img 
                  src={logo} 
                  alt="Sponsor Logo" 
                  className="max-h-full max-w-full object-contain opacity-80 group-hover/logo:opacity-100 group-hover/logo:scale-105 transition-all duration-300"
                  loading="lazy"
                />
              </div>
            ))}
            {sponsorLogos.map((logo, idx) => (
              <div 
                key={`sponsor-2-${idx}`} 
                className="inline-flex items-center justify-center h-20 w-36 px-4 py-2 bg-white/[0.01] hover:bg-white/[0.04] border border-white/5 hover:border-white/10 rounded-2xl transition-all duration-300 select-none group/logo"
              >
                <img 
                  src={logo} 
                  alt="Sponsor Logo" 
                  className="max-h-full max-w-full object-contain opacity-80 group-hover/logo:opacity-100 group-hover/logo:scale-105 transition-all duration-300"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. MASONRY GALLERY SECTION WITH LIGHTBOX */}
      <section id="gallery" className="py-24 bg-[#030303] border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-16 space-y-12">
          <div className="text-center space-y-2 max-w-lg mx-auto">
            <span className="text-[10px] font-black text-[#D90429] uppercase tracking-widest font-outfit">Visual Moments</span>
            <h2 className="text-3xl md:text-5xl font-outfit font-black tracking-tight uppercase text-white">Event Gallery</h2>
            <p className="text-xs text-white/50 leading-relaxed font-light">Glimpses of premium celebrations, corporate summits, and charity races in support of health excellence.</p>
          </div>

          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {galleryItems.map((item, idx) => (
              <div
                key={idx}
                onClick={() => setLightboxImage(item.image)}
                className="relative overflow-hidden rounded-3xl glass-panel border border-white/5 cursor-pointer break-inside-avoid group block"
              >
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-center justify-center">
                  <span className="text-[10px] font-black uppercase text-white tracking-widest border border-white/20 px-4 py-2 rounded-full bg-black/40">Zoom Photo</span>
                </div>
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-auto object-cover rounded-3xl transition-transform duration-500 scale-100 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7.5. PROMO / ADVERTISEMENT SECTION */}
      <section className="py-16 bg-[#070707] border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-16">
          <div className="rounded-[32px] glass-panel bg-[#0b0b0b] border border-white/5 p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="absolute -left-16 -top-16 w-64 h-64 bg-[#D90429]/5 rounded-full blur-[70px] pointer-events-none" />
            <div className="absolute right-0 bottom-0 w-80 h-80 bg-[#D90429]/5 rounded-full blur-[90px] pointer-events-none" />

            <div className="text-left space-y-4 max-w-xl relative z-10">
              <span className="text-[9px] font-black text-[#D90429] uppercase tracking-widest font-outfit">Charity expo event</span>
              <h3 className="text-2xl md:text-4xl font-outfit font-black uppercase text-white">TAPHE Awards Charity Marathon</h3>
              <p className="text-xs text-white/55 leading-relaxed font-light">
                Run for health excellence! Participate in the 5KM, 10KM, or 21KM charity race to support essential healthcare logistics and medical supplies in local maternal clinics.
              </p>
            </div>

            <div className="relative z-10 shrink-0">
              <Link 
                to="/tickets"
                className="px-6 py-3.5 bg-black/60 hover:bg-[#D90429]/10 border border-[#D90429]/40 hover:border-[#D90429] text-white text-[10px] font-black uppercase tracking-widest rounded-full transition-all duration-300"
              >
                Register - 35,000 TZS
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 8. LUXURY CTA SECTION */}
      <section className="py-28 bg-[#030303] border-t border-white/5 relative z-10 overflow-hidden">
        <div className="absolute -left-16 -top-16 w-64 h-64 bg-[#D90429]/5 rounded-full blur-[70px] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 md:px-16 text-center space-y-8 relative z-10">
          <span className="text-[10px] font-black text-[#D90429] uppercase tracking-widest font-outfit">Secretariat Desk</span>
          <h2 className="text-4xl md:text-7xl font-outfit font-black tracking-tight uppercase text-white leading-none">
            Honoring Those Who <br />
            <span className="text-red-gradient">Heal Tanzania</span>
          </h2>
          <p className="text-xs md:text-sm text-white/50 leading-relaxed font-light max-w-xl mx-auto">
            Book your presence at the grand banquet. Join premium healthcare practitioners, institutional coordinators, and corporate sponsors under one celebratory roof.
          </p>

          <div className="pt-4 flex justify-center">
            <Link 
              to="/tickets"
              className="px-8 py-4 bg-gradient-to-r from-[#D90429] to-[#FF3D57] hover:from-[#B00020] hover:to-[#D90429] text-white text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-2 border border-[#D90429]/20 shadow-[0_4px_25px_rgba(217,4,41,0.25)] hover:shadow-[0_0_35px_rgba(255,51,51,0.5)] transition-all duration-300"
            >
              <span>Book Gala Seat</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 9. MINIMAL LUXURY FOOTER */}

      {/* ACTIVE VOTE MODAL OVERLAY */}
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

      {/* GALLERY LIGHTBOX OVERLAY */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md cursor-zoom-out"
          >
            <button 
              onClick={() => setLightboxImage(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 border border-white/10 text-white hover:bg-white/20 transition-all z-50"
            >
              <X className="w-5 h-5" />
            </button>
            <motion.img 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.5 }}
              src={lightboxImage} 
              alt="High resolution gallery highlight" 
              className="max-w-full max-h-[85vh] rounded-3xl object-contain shadow-2xl border border-white/10"
            />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

function str_pad(val: number): string {
  return String(val).padStart(2, '0');
}
