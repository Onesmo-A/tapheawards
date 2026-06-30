import React from 'react';
import { ShieldCheck, Heart, Sparkles, Award } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto my-16 px-6 relative z-10">
      
      {/* Background ambient spotlight */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#A81C1C]/10 rounded-full blur-[100px] pointer-events-none z-0" />

      <div className="relative z-10 glass-panel p-8 md:p-12 rounded-3xl border border-white/5 space-y-8 text-center md:text-left">
        
        {/* Header Title */}
        <div className="space-y-3 text-center">
          <div className="inline-flex p-3 bg-white/5 border border-white/10 rounded-2xl text-[#ff3333] mb-2 shadow-inner">
            <Award className="w-8 h-8" />
          </div>
          <span className="block text-[10px] font-black text-[#ff3333] uppercase tracking-widest font-outfit">TAPHE Secretariat</span>
          <h1 className="text-3xl md:text-5xl font-black font-outfit uppercase tracking-tight text-white">About the Awards</h1>
          <p className="text-xs text-white/50 max-w-xl mx-auto leading-relaxed">
            Recognizing excellence, reinforcing data transparency, and honoring premium contributions to public health across Tanzania.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="border-t border-white/5 pt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#ff3333]/20 hover:bg-white/[0.04] transition-all space-y-3 text-left group">
            <div className="w-10 h-10 rounded-xl bg-black border border-white/10 flex items-center justify-center text-[#ff3333] group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-black text-white uppercase tracking-wider">Secure Choice</h3>
            <p className="text-[11px] text-white/40 leading-relaxed">
              Voter authentication using OTP pins via standard SMS or WhatsApp channels ensures absolute vote integrity.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#ff3333]/20 hover:bg-white/[0.04] transition-all space-y-3 text-left group">
            <div className="w-10 h-10 rounded-xl bg-black border border-white/10 flex items-center justify-center text-[#ff3333] group-hover:scale-105 transition-transform">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-black text-white uppercase tracking-wider">Public Choice</h3>
            <p className="text-[11px] text-white/40 leading-relaxed">
              Allowing standard citizens to choose outstanding health workers, local practitioners, and community initiatives.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#ff3333]/20 hover:bg-white/[0.04] transition-all space-y-3 text-left group">
            <div className="w-10 h-10 rounded-xl bg-black border border-white/10 flex items-center justify-center text-[#ff3333] group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-black text-white uppercase tracking-wider">Gala Banquet</h3>
            <p className="text-[11px] text-white/40 leading-relaxed">
              Bringing national authorities, delegates, and award nominees together under one premium red carpet ceremony.
            </p>
          </div>

        </div>

        {/* Informative paragraphs */}
        <div className="space-y-4 pt-6 border-t border-white/5 text-xs text-white/45 leading-relaxed text-left">
          <p>
            The annual Tanzania People's Health Excellence Awards (TAPHE Awards) are established to identify, validate, and celebrate the incredible contributions of healthcare practitioners, private medical facilities, national research bodies, and community support groups.
          </p>
          <p>
            By executing secure API-driven integrations, utilizing cryptography signature validation, and partnering with premium mobile money gateways, we provide Tanzanians with an honest and immutable selection process.
          </p>
        </div>

      </div>

    </div>
  );
}
