import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import Welcome from './Pages/Welcome';
import Categories from './Pages/Categories';
import About from './Pages/About';
import Contact from './Pages/Contact';
import GetTickets from './Pages/Tickets/GetTickets';
import SuggestNominee from './Pages/SuggestNominee';
import Login from './Pages/Login';
import Sponsors from './Pages/Sponsors';
import Winners from './Pages/Winners';
import Gallery from './Pages/Gallery';
import CustomCursor from './Pages/Components/CustomCursor';
import Footer from './Pages/Components/Footer';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { setSelectedCategory } from './store/slices/categorySlice';
import Lenis from 'lenis';
import { Menu, X, ChevronUp, User, Mail, Phone, MapPin, MessageSquare, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../css/app.css';
import '../css/transitions.css';

const Navigation = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  const navLinks = [
    { name: 'Guest of Honor', path: '/#story-excellence', isAnchor: true },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Winners', path: '/winners' },
    { name: 'Sponsorship', path: '/sponsors' },
    { name: 'Marathon', path: '/tickets' },
    { name: 'Nominate', path: '/categories' },
    { name: 'Vote', path: '/categories' },
  ];

  const secondaryLinks = [
    { name: 'Suggest Nominee', path: '/suggest' },
    { name: 'Contact Secretariat', path: '/contact' },
  ];

  // Screen resize checker for mega menu logic
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLinkClick = (path: string, isAnchor?: boolean) => {
    setMenuOpen(false);
    if (isAnchor) {
      if (location.pathname !== '/') {
        window.location.href = path;
      } else {
        const id = path.split('#')[1];
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  return (
    <>
      <header className="absolute top-0 left-0 right-0 bg-transparent border-transparent z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <Link to="/" className="flex items-center group relative z-50">
            <img 
              src="/images/logo_hero.png" 
              alt="TAPHE Logo" 
              className="h-10 md:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
            />
          </Link>

          {/* Header Actions: Sign In & Hamburger Menu */}
          <div className="flex items-center gap-4 relative z-50">
            {/* Header Sign In Button (visible on PC/tablet) */}
            <Link
              to="/login"
              className="px-5 py-2.5 rounded-full border border-white/10 bg-white/5 hover:bg-[#D90429]/20 hover:border-[#D90429]/40 text-white text-[11px] font-black uppercase tracking-widest transition-all duration-300 hidden md:flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </Link>

            {/* Hamburger Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2.5 rounded-full border border-white/10 bg-white/5 hover:bg-[#D90429]/20 hover:border-[#D90429]/40 text-white transition-all duration-300 focus:outline-none cursor-pointer"
              aria-label="Toggle Menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Cinematic Full-screen Navigation Menu Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 flex flex-col justify-center items-center px-8 overflow-y-auto backdrop-blur-3xl bg-black/95 text-white"
          >
            <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
            
            {isDesktop ? (
              <div className="grid grid-cols-12 gap-12 w-full max-w-6xl z-10 px-6 text-left items-start relative select-none">
                
                {/* Close Button at top-right of Mega Menu area */}
                <button
                  onClick={() => setMenuOpen(false)}
                  className="absolute -top-12 right-4 p-2 rounded-full border border-white/15 bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-all focus:outline-none cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Column 1: Brand Spotlight */}
                <div className="col-span-4 space-y-6 pr-4">
                  <img 
                    src="/images/logo_hero.png" 
                    alt="TAPHE Logo" 
                    className="h-16 w-auto object-contain" 
                  />
                  <div className="space-y-3">
                    <span className="text-[10px] font-black text-[#D90429] uppercase tracking-widest font-outfit">Tanzania Health Excellence</span>
                    <h2 className="text-3xl font-black font-outfit uppercase tracking-tight text-white leading-none">
                      Honoring the <br />
                      <span className="text-red-gradient">Healers</span>
                    </h2>
                  </div>
                  <p className="text-xs text-white/45 leading-relaxed font-light font-inter">
                    Tanzania People's Health Excellence Awards celebrates groundbreaking innovations, institutional quality, and medical practitioners supporting communities.
                  </p>
                  
                  <div className="pt-2">
                    <Link
                      to="/tickets"
                      onClick={() => setMenuOpen(false)}
                      className="inline-flex px-6 py-3 bg-[#D90429] hover:bg-[#B00020] text-white text-[10px] font-black uppercase tracking-widest rounded-full transition-all duration-300"
                    >
                      Book Gala Seat
                    </Link>
                  </div>
                </div>

                {/* Column 2: Navigation Links */}
                <div className="col-span-4 space-y-6">
                  <h4 className="text-xs font-black uppercase text-[#D90429] tracking-wider font-outfit">Main Navigation</h4>
                  <div className="flex flex-col space-y-3.5">
                    {navLinks.map((link) => {
                      const isActive = location.pathname === link.path;
                      return link.isAnchor ? (
                        <a
                          key={link.name}
                          href={link.path}
                          onClick={(e) => {
                            e.preventDefault();
                            handleLinkClick(link.path, true);
                          }}
                          className="font-outfit font-black text-2xl uppercase tracking-wider text-white/70 hover:text-[#D90429] transition-all hover:translate-x-1.5 duration-300 inline-block"
                        >
                          {link.name}
                        </a>
                      ) : (
                        <Link
                          key={link.name}
                          to={link.path}
                          onClick={() => setMenuOpen(false)}
                          className={`font-outfit font-black text-2xl uppercase tracking-wider transition-all hover:translate-x-1.5 duration-300 inline-block ${
                            isActive ? 'text-[#D90429]' : 'text-white/70 hover:text-white'
                          }`}
                        >
                          {link.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Column 3: Secretariat Contact & Address */}
                <div className="col-span-4 space-y-6">
                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase text-[#D90429] tracking-wider font-outfit">Secretariat Contact</h4>
                    <div className="space-y-3 text-xs text-white/60 font-light">
                      <div className="flex items-start gap-2.5">
                        <MapPin className="w-4 h-4 text-[#D90429] shrink-0 mt-0.5" />
                        <span>Dar es Salaam, Tanzania</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Mail className="w-4 h-4 text-[#D90429] shrink-0" />
                        <span>info@tapheawards.co.tz</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Phone className="w-4 h-4 text-[#D90429] shrink-0" />
                        <span>+255 749 562 993</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase text-white/40 tracking-wider">Help Desk</h4>
                    <a
                      href="https://wa.me/255743331626"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-600/10 border border-green-500/20 hover:bg-green-600/20 text-green-500 rounded-xl transition-all duration-300 text-[10px] font-black uppercase tracking-wider"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>WhatsApp Chat</span>
                    </a>
                  </div>

                  <div className="h-px bg-white/5 w-full" />
                  
                  <div className="flex items-center gap-3">
                    <Link
                      to="/login"
                      onClick={() => setMenuOpen(false)}
                      className="px-6 py-2.5 bg-white/5 border border-white/10 hover:bg-[#D90429]/20 hover:border-[#D90429]/40 text-white text-[10px] font-black uppercase tracking-widest rounded-full transition-all duration-300 flex items-center gap-1.5"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Sign In / Register</span>
                    </Link>
                  </div>
                </div>

              </div>
            ) : (
              <nav className="flex flex-col space-y-6 md:space-y-8 text-center max-w-lg z-10 w-full max-h-[85vh] py-8 overflow-y-auto scrollbar-none">
                
                {/* Main Links */}
                {navLinks.map((link, index) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <motion.div
                      key={link.path}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.04, duration: 0.3 }}
                    >
                      {link.isAnchor ? (
                        <a
                          href={link.path}
                          onClick={(e) => {
                            e.preventDefault();
                            handleLinkClick(link.path, true);
                          }}
                          className="relative font-outfit font-black text-2xl md:text-4xl uppercase tracking-wider transition-all duration-300 hover:text-[#D90429] hover:scale-105 inline-block group text-white/70 hover:text-white"
                        >
                          {link.name}
                          <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#D90429] opacity-0 group-hover:opacity-100 shadow-[0_0_12px_#D90429] transition-all duration-300" />
                        </a>
                      ) : (
                        <Link
                          to={link.path}
                          onClick={() => setMenuOpen(false)}
                          className={`relative font-outfit font-black text-2xl md:text-4xl uppercase tracking-wider transition-all duration-300 hover:text-[#D90429] hover:scale-105 inline-block group ${
                            isActive ? 'text-[#D90429]' : 'text-white/70 hover:text-white'
                          }`}
                        >
                          {link.name}
                          <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#D90429] opacity-0 group-hover:opacity-100 shadow-[0_0_12px_#D90429] transition-all duration-300" />
                        </Link>
                      )}
                    </motion.div>
                  );
                })}

                {/* Secondary Links */}
                {secondaryLinks.map((link, index) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <motion.div
                      key={link.path}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 + index * 0.04, duration: 0.3 }}
                    >
                      <Link
                        to={link.path}
                        onClick={() => setMenuOpen(false)}
                        className={`relative font-outfit font-black text-2xl md:text-4xl uppercase tracking-wider transition-all duration-300 hover:text-[#D90429] hover:scale-105 inline-block group ${
                          isActive ? 'text-[#D90429]' : 'text-white/70 hover:text-white'
                        }`}
                      >
                        {link.name}
                        <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#D90429] opacity-0 group-hover:opacity-100 shadow-[0_0_12px_#D90429] transition-all duration-300" />
                      </Link>
                    </motion.div>
                  );
                })}

                {/* Sign In Link */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.3 }}
                  className="pt-4 flex justify-center"
                >
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="px-8 py-3 bg-[#D90429] hover:bg-[#B00020] text-white text-[11px] font-black uppercase tracking-widest rounded-full transition-all duration-300 flex items-center gap-1.5 shadow-lg shadow-[#D90429]/15 border border-[#D90429]/20"
                  >
                    <User className="w-4 h-4" />
                    <span>Sign In / Register</span>
                  </Link>
                </motion.div>

              </nav>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const App = () => {
  const location = useLocation();
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    // Scroll to top on page transition
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    // Monitor scroll position for Back-to-Top visibility
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Initialize Lenis smooth scrolling
    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#030303] text-white relative select-none bg-mesh">
      {/* Cinematic Film Grain Overlay */}
      <div className="noise-overlay" />
      
      {/* Glowing cursor details */}
      <CustomCursor />
      
      <Navigation />
      
      <main className="flex-grow z-10 relative">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/tickets" element={<GetTickets />} />
          <Route path="/suggest" element={<SuggestNominee />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sponsors" element={<Sponsors />} />
          <Route path="/winners" element={<Winners />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="*" element={<Welcome />} />
        </Routes>
      </main>

      {/* Global professional footer */}
      <Footer />

      {/* Global floating Back-to-Top button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 z-50 p-3.5 rounded-full bg-[#D90429] hover:bg-[#B00020] text-white border border-[#D90429]/20 shadow-lg shadow-[#D90429]/25 transition-all focus:outline-none flex items-center justify-center active:scale-95 cursor-pointer"
          >
            <ChevronUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </React.StrictMode>
  );
}
