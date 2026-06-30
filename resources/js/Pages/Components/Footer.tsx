import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, MessageSquare, Instagram, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#030303] border-t border-white/5 py-16 px-6 md:px-16 text-white relative z-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 text-left">
        
        {/* Column 1: Logo & Brand Tagline */}
        <div className="md:col-span-5 space-y-6">
          <div className="flex items-center gap-3">
            <img 
              src="/images/logo_hero.png" 
              alt="TAPHE Awards Logo" 
              className="h-10 md:h-12 w-auto object-contain" 
            />
          </div>
          <p className="text-xs text-white/50 leading-relaxed font-light max-w-sm">
            The official portal for the Tanzania People's Health Excellence Awards. Honoring innovations, practitioners, and leaders making a positive impact in health.
          </p>
          
          {/* Secretariat Contact Icons */}
          <div className="flex items-center gap-3 pt-2">
            <a 
              href="https://wa.me/255749562993" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2.5 bg-green-600/10 border border-green-500/20 hover:bg-green-600/20 text-green-500 rounded-xl transition-all duration-300 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Chat</span>
            </a>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2.5 bg-white/5 border border-white/10 hover:border-[#D90429]/30 hover:bg-[#D90429]/5 text-white/40 hover:text-[#D90429] rounded-xl transition-all duration-300"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2.5 bg-white/5 border border-white/10 hover:border-[#D90429]/30 hover:bg-[#D90429]/5 text-white/40 hover:text-[#D90429] rounded-xl transition-all duration-300"
            >
              <Facebook className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Column 2: Navigation Links */}
        <div className="md:col-span-3 space-y-4">
          <h4 className="text-xs font-black uppercase text-[#D90429] tracking-wider font-outfit">Quick Navigation</h4>
          <ul className="space-y-2 text-xs text-white/60 font-light">
            <li>
              <a href="/#story-excellence" className="hover:text-[#D90429] transition-colors">Guest of Honor</a>
            </li>
            <li>
              <a href="/#gallery" className="hover:text-[#D90429] transition-colors">Gallery</a>
            </li>
            <li>
              <Link to="/winners" className="hover:text-[#D90429] transition-colors">Winners</Link>
            </li>
            <li>
              <Link to="/sponsors" className="hover:text-[#D90429] transition-colors">Sponsorship</Link>
            </li>
            <li>
              <Link to="/tickets" className="hover:text-[#D90429] transition-colors">Marathon</Link>
            </li>
            <li>
              <Link to="/categories" className="hover:text-[#D90429] transition-colors">Nominate</Link>
            </li>
            <li>
              <Link to="/categories" className="hover:text-[#D90429] transition-colors">Vote</Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Secretariat Contact & Address */}
        <div className="md:col-span-4 space-y-4">
          <h4 className="text-xs font-black uppercase text-[#D90429] tracking-wider font-outfit">Secretariat Office</h4>
          <ul className="space-y-3.5 text-xs text-white/60 font-light">
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#D90429] shrink-0 mt-0.5" />
              <span>Dar es Salaam, Tanzania</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-[#D90429] shrink-0" />
              <span>info@tapheawards.co.tz</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-[#D90429] shrink-0" />
              <span>+255 749 562 993</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Credit line & powered by Native Technology */}
      <div className="max-w-7xl mx-auto pt-8 mt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] font-bold text-white/30 uppercase tracking-wider">
        <div>
          &copy; {new Date().getFullYear()} TAPHE Awards Council. All Rights Reserved.
        </div>
        <div className="flex items-center gap-1.5">
          <span>Powered by</span>
          <a 
            href="https://nativetechnology.africa" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-white hover:text-[#D90429] underline transition-colors normal-case"
          >
            Native technology
          </a>
          <a 
            href="https://wa.me/255743331626" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="p-1 bg-green-600/10 border border-green-500/20 hover:bg-green-600/20 text-green-500 rounded-lg transition-all ml-1.5"
            title="Chat with Developer (WhatsApp)"
          >
            <MessageSquare className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
