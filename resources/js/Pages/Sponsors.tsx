import React from 'react';
import { Award, ShieldCheck, Heart, Sparkles, Building, Mail, Phone, MapPin } from 'lucide-react';

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

export default function Sponsors() {
  return (
    <div className="min-h-screen bg-[#030303] text-white selection:bg-[#D90429] selection:text-white bg-mesh pt-24 pb-20 select-none">
      
      {/* Background ambient spotlight */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#D90429]/10 rounded-full blur-[100px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-6 md:px-16 relative z-10 space-y-16">
        
        {/* Header Title */}
        <div className="text-left space-y-4 max-w-3xl">
          <span className="text-[10px] font-black text-[#D90429] uppercase tracking-widest font-outfit">TAPHE Corporate Desk</span>
          <h1 className="text-5xl md:text-7xl font-outfit font-black tracking-tight uppercase leading-none text-white text-shadow-glow">
            Sponsors & <br />
            <span className="text-red-gradient">Partners</span>
          </h1>
          <p className="text-xs md:text-sm text-white/50 leading-relaxed font-light font-inter max-w-xl">
            Partnering with local and international health organizations, diagnostic corporations, and media networks to elevate health service validation.
          </p>
        </div>

        {/* Marquee scrolling ticker */}
        <div className="relative flex overflow-x-hidden w-full py-4 border-y border-white/5">
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#030303] to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#030303] to-transparent z-10 pointer-events-none" />

          <div className="animate-marquee flex gap-8 whitespace-nowrap">
            {sponsorLogos.map((logo, idx) => (
              <div 
                key={`sponsor-page-1-${idx}`} 
                className="inline-flex items-center justify-center h-20 w-36 px-4 py-2 bg-white/[0.01] border border-white/5 rounded-2xl transition-all duration-300 select-none group/logo"
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

        {/* Structured Sponsor Tiers Grid */}
        <div className="space-y-12">
          <div className="text-left space-y-2">
            <span className="text-[10px] font-black text-[#D90429] uppercase tracking-widest font-outfit">Recognition Tiers</span>
            <h2 className="text-xl md:text-2xl font-outfit font-black tracking-tight uppercase text-white">Sponsorship Categories</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Platinum tier */}
            <div className="p-8 rounded-[32px] glass-panel bg-white/[0.01] border border-[#D90429]/20 space-y-6 hover:border-[#D90429]/40 transition-all text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#D90429]/5 rounded-full blur-[30px] pointer-events-none" />
              <div className="space-y-2">
                <span className="px-3.5 py-1.5 bg-[#D90429]/10 border border-[#D90429]/20 text-[#D90429] rounded-full text-[9px] font-bold uppercase tracking-wider">
                  Platinum Level
                </span>
                <h3 className="text-lg font-black font-outfit uppercase tracking-wide text-white mt-4">Corporate Pillars</h3>
              </div>
              <p className="text-xs text-white/50 leading-relaxed font-light">
                Highest level of brand integration, prime VIP presentation seating, corporate stage recognition, and custom award naming opportunities.
              </p>
              <div className="h-px bg-white/5 w-full" />
              <div className="space-y-2 text-xs text-white/70">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D90429]" />
                  <span>Main Stage Logo Backdrop</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D90429]" />
                  <span>VIP Gala Dinner Table</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D90429]" />
                  <span>Interactive App Ad Banners</span>
                </div>
              </div>
            </div>

            {/* Gold tier */}
            <div className="p-8 rounded-[32px] glass-panel bg-white/[0.01] border border-white/5 space-y-6 hover:border-[#D90429]/20 transition-all text-left relative overflow-hidden">
              <div className="space-y-2">
                <span className="px-3.5 py-1.5 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 rounded-full text-[9px] font-bold uppercase tracking-wider">
                  Gold Level
                </span>
                <h3 className="text-lg font-black font-outfit uppercase tracking-wide text-white mt-4">Excellence Partners</h3>
              </div>
              <p className="text-xs text-white/50 leading-relaxed font-light">
                Premium media alignment, prominent logo placements on web/print media, and presentation of selected sub-category honors.
              </p>
              <div className="h-px bg-white/5 w-full" />
              <div className="space-y-2 text-xs text-white/70">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                  <span>Featured Web & App Logos</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                  <span>Shared Gala Dinner Seating</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                  <span>Secretariat Press Mentions</span>
                </div>
              </div>
            </div>

            {/* Silver tier */}
            <div className="p-8 rounded-[32px] glass-panel bg-white/[0.01] border border-white/5 space-y-6 hover:border-[#D90429]/20 transition-all text-left relative overflow-hidden">
              <div className="space-y-2">
                <span className="px-3.5 py-1.5 bg-slate-400/10 border border-slate-400/20 text-slate-300 rounded-full text-[9px] font-bold uppercase tracking-wider">
                  Silver Level
                </span>
                <h3 className="text-lg font-black font-outfit uppercase tracking-wide text-white mt-4">Supporting Members</h3>
              </div>
              <p className="text-xs text-white/50 leading-relaxed font-light">
                Standard branding validation, shared directory catalog listing, and promotional materials distributions in runner marathon packs.
              </p>
              <div className="h-px bg-white/5 w-full" />
              <div className="space-y-2 text-xs text-white/70">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  <span>Directory Catalog Profile</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  <span>Exhibition Booth Slots</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  <span>Social Media Logo Blurbs</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Corporate Sponsorship Inquiry Form */}
        <div className="rounded-[32px] glass-panel bg-white/[0.01] border border-white/5 p-8 md:p-12 text-left relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-[10px] font-black text-[#D90429] uppercase tracking-widest font-outfit">Sponsor Inquiry</span>
            <h2 className="text-3xl font-outfit font-black tracking-tight uppercase text-white">Join the Council</h2>
            <p className="text-xs text-white/55 leading-relaxed font-light">
              Elevate your corporate brand footprint across the East African healthcare sector. Partner with TAPHE Awards to promote quality service delivery.
            </p>
            <div className="space-y-3 pt-4 text-xs text-white/50">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-[#D90429]" />
                <span>TAPHE secretariat Office, Dar es Salaam</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#D90429]" />
                <span>info@tapheawards.co.tz</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#D90429]" />
                <span>+255 749 562 993</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <form onSubmit={(e) => { e.preventDefault(); alert('Sponsorship inquiry sent successfully!'); }} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest font-bold text-white/40">Company Name</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Enter corporate name" 
                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-2xl text-xs text-white focus:border-[#D90429] focus:ring-1 focus:ring-[#D90429] outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest font-bold text-white/40">Contact Person</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Enter full name" 
                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-2xl text-xs text-white focus:border-[#D90429] focus:ring-1 focus:ring-[#D90429] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest font-bold text-white/40">Email Address</label>
                  <input 
                    type="email" 
                    required 
                    placeholder="company@domain.com" 
                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-2xl text-xs text-white focus:border-[#D90429] focus:ring-1 focus:ring-[#D90429] outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest font-bold text-white/40">Sponsorship Tier Interest</label>
                  <select className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-2xl text-xs text-white focus:border-[#D90429] focus:ring-1 focus:ring-[#D90429] outline-none">
                    <option value="platinum" className="bg-[#030303]">Platinum Corporate Pillar</option>
                    <option value="gold" className="bg-[#030303]">Gold Excellence Partner</option>
                    <option value="silver" className="bg-[#030303]">Silver Supporting Member</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest font-bold text-white/40">Inquiry details</label>
                <textarea 
                  rows={4} 
                  required 
                  placeholder="Outline your partnership objectives..." 
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-2xl text-xs text-white focus:border-[#D90429] focus:ring-1 focus:ring-[#D90429] outline-none resize-none"
                />
              </div>

              <button 
                type="submit" 
                className="w-full py-3 bg-gradient-to-r from-[#D90429] to-[#FF3D57] hover:from-[#B00020] hover:to-[#D90429] text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all duration-300"
              >
                Submit Corporate Inquiry
              </button>
            </form>
          </div>
        </div>

      </div>

    </div>
  );
}
