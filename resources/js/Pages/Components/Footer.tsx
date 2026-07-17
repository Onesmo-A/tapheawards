import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, MessageSquare, Instagram, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#030303] border-t border-white/5 py-16 px-6 md:px-16 text-white relative z-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 text-left">
        
        {/* Column 1: Logo & Brand Tagline */}
        <div className="md:col-span-5 space-y-6">
          <div className="flex items-center gap-3 md:gap-4">
            <img 
              loading="lazy"
              src="/images/logo_hero.webp" 
              alt="TAPHE Awards Logo" 
              className="h-12 md:h-16 w-auto object-contain" 
            />
            <div className="w-px h-8 md:h-10 bg-white/20 self-center" />
            <div className="flex flex-col text-left leading-none justify-center">
              <span className="text-white font-outfit font-black text-sm md:text-base tracking-widest uppercase">TAPHE</span>
              <span className="text-[#D90429] font-outfit font-black text-[10px] md:text-xs tracking-wider uppercase mt-0.5">Awards</span>
            </div>
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
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.455h.008c6.56 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
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
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.455h.008c6.56 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
