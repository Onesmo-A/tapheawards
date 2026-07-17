import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Award, ShieldCheck, Heart, Sparkles, Building, Mail, Phone, MapPin, CheckCircle2, RefreshCw, AlertTriangle, Sparkle } from 'lucide-react';

const sponsorLogos = [
  '/images/sponsors/GANZI.webp',
  '/images/sponsors/jeziOriginal.webp',
  '/images/sponsors/MAGARI.webp',
  '/images/sponsors/main-sponsor.webp',
  '/images/sponsors/MAKUNDUCHI.webp',
  '/images/sponsors/mama-viwanja.webp',
  '/images/sponsors/MQ.webp',
  '/images/sponsors/NIVES_TRENDS.webp',
  '/images/sponsors/PRO-SHARE.webp',
  '/images/sponsors/PWEZA-BEACH.webp',
  '/images/sponsors/PWEZA.webp',
  '/images/sponsors/RAMA.webp',
  '/images/sponsors/simuhadhiYako.webp',
  '/images/sponsors/sponsor2.webp',
  '/images/sponsors/SPONSORS-BAR.webp',
  '/images/sponsors/SPONSORS-CROWN-MEDIA.webp',
  '/images/sponsors/SPONSORS-DOLLY.webp',
  '/images/sponsors/SPONSORS-GAZEM.webp',
  '/images/sponsors/SPONSORS-jay.webp',
  '/images/sponsors/SPONSORS-STOCK.webp',
  '/images/sponsors/SPONSORS1.webp',
  '/images/sponsors/SPONSORSkim.webp'
];

interface PkgItem {
  id: string;
  name: string;
  slug: string;
  price: string;
  price_formatted: string;
  description: string;
  benefits: string[];
  is_popular: boolean;
}

export default function Sponsors() {
  const [packages, setPackages] = useState<PkgItem[]>([]);
  const [loadingPackages, setLoadingPackages] = useState(true);

  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [tier, setTier] = useState('');
  const [messageText, setMessageText] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Fetch Packages
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await axios.get('/api/v1/sponsorship-packages');
        const list = res.data.packages || [];
        setPackages(list);
        if (list.length > 0) {
          setTier(list[0].slug); // Set default selected tier
        }
      } catch (err) {
        console.error('Failed to load packages', err);
      } finally {
        setLoadingPackages(false);
      }
    };
    fetchPackages();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    try {
      const response = await axios.post('/api/v1/sponsorship-inquiries', {
        company_name: companyName,
        contact_name: contactName,
        email: email,
        phone: phone,
        tier: tier,
        message: messageText
      });

      setFeedback({ type: 'success', text: response.data.message });
      
      // Clear inputs
      setCompanyName('');
      setContactName('');
      setEmail('');
      setPhone('');
      setMessageText('');
    } catch (err: any) {
      console.error(err);
      setFeedback({
        type: 'error',
        text: err.response?.data?.message || 'Failed to submit inquiry. Please check your connection.'
      });
    } finally {
      setLoading(false);
    }
  };

  const getPackageStyling = (slug: string) => {
    const s = slug.toLowerCase();
    if (s.includes('title')) {
      return {
        icon: Sparkles,
        iconColor: 'text-[#D90429]',
        border: 'border-[#D90429]/30 hover:border-[#D90429]/60',
        badge: 'bg-[#D90429]/10 border-[#D90429]/30 text-[#D90429]',
        bgGlow: 'bg-[#D90429]/10'
      };
    } else if (s.includes('platinum')) {
      return {
        icon: Award,
        iconColor: 'text-[#C0C0C0]',
        border: 'border-[#C0C0C0]/20 hover:border-[#C0C0C0]/50',
        badge: 'bg-white/10 border-white/20 text-white',
        bgGlow: 'bg-white/5'
      };
    } else if (s.includes('gold')) {
      return {
        icon: Award,
        iconColor: 'text-yellow-500',
        border: 'border-yellow-500/20 hover:border-yellow-500/50',
        badge: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500',
        bgGlow: 'bg-yellow-500/5'
      };
    } else if (s.includes('silver')) {
      return {
        icon: Building,
        iconColor: 'text-slate-300',
        border: 'border-slate-300/20 hover:border-slate-300/50',
        badge: 'bg-slate-300/10 border-slate-300/20 text-slate-300',
        bgGlow: 'bg-slate-300/5'
      };
    } else if (s.includes('category')) {
      return {
        icon: ShieldCheck,
        iconColor: 'text-green-500',
        border: 'border-green-500/20 hover:border-green-500/50',
        badge: 'bg-green-500/10 border-green-500/20 text-green-500',
        bgGlow: 'bg-green-500/5'
      };
    } else {
      return {
        icon: Heart,
        iconColor: 'text-purple-400',
        border: 'border-purple-400/20 hover:border-purple-400/50',
        badge: 'bg-purple-400/10 border-purple-400/20 text-purple-400',
        bgGlow: 'bg-purple-400/5'
      };
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white selection:bg-[#D90429] selection:text-white bg-mesh pt-24 pb-20">
      
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
                  className="max-h-full max-w-full object-contain opacity-85 group-hover/logo:opacity-100 group-hover/logo:scale-105 transition-all duration-300"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>

        {/* 1.5. EXQUISITE TITLE SPONSOR SHOWCASE */}
        <div className="rounded-[2.5rem] border border-[#D90429]/20 bg-gradient-to-b from-[#160b0d] via-[#0a0809] to-[#030303] p-8 md:p-12 relative overflow-hidden shadow-3xl text-left group">
          {/* Ambient glowing highlights */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#D90429]/10 rounded-full blur-[80px] pointer-events-none z-0" />
          <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-[#D90429]/5 rounded-full blur-[60px] pointer-events-none z-0" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Sponsor Text & Info */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#D90429]/10 border border-[#D90429]/30 rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-[#D90429] animate-pulse" />
                <span className="text-[9px] font-black text-[#D90429] uppercase tracking-widest font-outfit">Official Title Sponsor</span>
              </div>
              
              <div className="space-y-3">
                <h2 className="text-3xl md:text-5xl font-outfit font-black tracking-tight uppercase leading-none text-white">
                  Official Title <br />
                  <span className="text-red-gradient">Partner</span>
                </h2>
                <p className="text-xs md:text-sm text-white/70 leading-relaxed font-light font-inter max-w-xl">
                  We are proud to partner with our official Title Sponsor leading the healthcare revolution in Tanzania. This strategic collaboration enables deep recognition of the healthcare practitioners who dedicate themselves daily to saving lives and serving local communities.
                </p>
              </div>

              <div className="h-px bg-white/5 w-full" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#D90429]/10 transition-colors">
                  <h4 className="text-xs font-black uppercase text-[#D90429] tracking-wider font-outfit mb-1">Core Mission</h4>
                  <p className="text-[10px] text-white/50 leading-relaxed font-inter">Elevating care quality and inspiring the adoption of advanced healthcare technologies.</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#D90429]/10 transition-colors">
                  <h4 className="text-xs font-black uppercase text-[#D90429] tracking-wider font-outfit mb-1">Healthcare Impact</h4>
                  <p className="text-[10px] text-white/50 leading-relaxed font-inter">Supporting community clinics, upgrading diagnostic facilities, and empowering healthcare practitioners.</p>
                </div>
              </div>
            </div>

            {/* Premium Logo Showcase Box */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[420px] aspect-[4/3] rounded-[2.5rem] p-6 bg-gradient-to-br from-white/[0.02] to-white/[0.005] border border-white/5 hover:border-[#D90429]/40 shadow-2xl transition-all duration-500 flex flex-col items-center justify-center group/card overflow-hidden">
                {/* Background glow on hover */}
                <div className="absolute inset-0 bg-[#D90429]/5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#D90429]/10 rounded-full blur-[50px] opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Elevated Logo frame */}
                <div className="w-full h-56 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-center p-8 relative z-10 transition-transform duration-500 group-hover/card:scale-[1.03] shadow-inner">
                  <img 
                    loading="lazy"
                    src="/images/sponsors/main-sponsor.webp" 
                    alt="Official Title Sponsor Logo" 
                    className="max-h-full max-w-full object-contain filter drop-shadow-[0_0_12px_rgba(219,4,41,0.25)]"
                  />
                </div>

                <div className="mt-4 text-center z-10">
                  <span className="text-[8px] uppercase tracking-widest font-black text-white/40 block mb-0.5">Official Partnership</span>
                  <h4 className="text-xs font-bold text-white uppercase font-outfit tracking-wider">TAPHE Title Partner</h4>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Structured Sponsor Tiers Grid */}
        <div className="space-y-12">
          <div className="text-left space-y-2">
            <span className="text-[10px] font-black text-[#D90429] uppercase tracking-widest font-outfit">Recognition Tiers</span>
            <h2 className="text-xl md:text-2xl font-outfit font-black tracking-tight uppercase text-white">Sponsorship Categories & Packages</h2>
          </div>

          {loadingPackages ? (
            <div className="py-20 flex justify-center"><RefreshCw className="w-8 h-8 animate-spin text-[#D90429]" /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {packages.map(pkg => {
                const style = getPackageStyling(pkg.slug);
                const Icon = style.icon;
                return (
                  <div 
                    key={pkg.id} 
                    className={`p-8 rounded-[2.5rem] bg-gradient-to-b from-[#1c1c1c]/90 to-[#0c0809] border ${style.border} space-y-6 hover:shadow-2xl transition-all duration-500 text-left relative overflow-hidden group`}
                  >
                    <div className={`absolute top-0 right-0 w-32 h-32 ${style.bgGlow} rounded-full blur-[30px] pointer-events-none`} />
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className={`px-3.5 py-1.5 border rounded-full text-[9px] font-black uppercase tracking-wider ${style.badge}`}>
                          {pkg.name}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {pkg.is_popular && (
                            <span className="px-2 py-0.5 bg-yellow-500 text-black text-[7px] font-black uppercase tracking-wider rounded-md animate-pulse">
                              Popular
                            </span>
                          )}
                          <Icon className={`w-5 h-5 ${style.iconColor}`} />
                        </div>
                      </div>
                      <h3 className="text-2xl font-black font-outfit uppercase tracking-wide text-white">{pkg.name}</h3>
                      <div className="text-2xl font-black text-white font-outfit leading-none">
                        {pkg.price_formatted}
                      </div>
                    </div>
                    <p className="text-xs text-white/60 leading-relaxed font-light font-inter">
                      {pkg.description}
                    </p>
                    <div className="h-px bg-white/5 w-full" />
                    <div className="space-y-3 text-xs text-white/70 font-inter font-light">
                      {(pkg.benefits || []).map((benefit, bIdx) => (
                        <div key={bIdx} className="flex items-start gap-2.5">
                          <Sparkle className={`w-3.5 h-3.5 ${style.iconColor} mt-0.5 shrink-0`} />
                          <span className="text-[11px] text-white/75 leading-relaxed">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Corporate Sponsorship Inquiry Form */}
        <div className="rounded-[2.5rem] border border-white/5 bg-gradient-to-r from-[#0c0809] to-[#12080a] p-8 md:p-12 text-left relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-12 shadow-2xl">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-[10px] font-black text-[#D90429] uppercase tracking-widest font-outfit">Sponsor Inquiry</span>
            <h2 className="text-3xl font-outfit font-black tracking-tight uppercase text-white leading-none">Join the <br />Council</h2>
            <p className="text-xs text-white/55 leading-relaxed font-light font-inter">
              Elevate your corporate brand footprint across the East African healthcare sector. Partner with TAPHE Awards to promote quality service delivery.
            </p>
            <div className="space-y-3 pt-4 text-xs text-white/50 font-inter font-light">
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
            {feedback && (
              <div className={`mb-6 p-4 rounded-2xl border text-xs font-semibold leading-relaxed flex items-start gap-3 ${
                feedback.type === 'success' ? 'bg-green-600/10 border-green-500/20 text-green-400' : 'bg-red-600/10 border-red-500/20 text-red-400'
              }`}>
                <div className="mt-0.5 shrink-0">
                  {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                </div>
                <span>{feedback.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase tracking-widest font-black text-white/40">Company Name</label>
                  <input 
                    type="text" 
                    required 
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Enter corporate name" 
                    className="w-full px-4 py-3 bg-white/[0.02] border border-white/10 rounded-2xl text-xs text-white focus:border-[#D90429] focus:bg-white/[0.04] outline-none transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase tracking-widest font-black text-white/40">Contact Person</label>
                  <input 
                    type="text" 
                    required 
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Enter full name" 
                    className="w-full px-4 py-3 bg-white/[0.02] border border-white/10 rounded-2xl text-xs text-white focus:border-[#D90429] focus:bg-white/[0.04] outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5 sm:col-span-1">
                  <label className="text-[9px] uppercase tracking-widest font-black text-white/40">Email Address</label>
                  <input 
                    type="email" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="company@domain.com" 
                    className="w-full px-4 py-3 bg-white/[0.02] border border-white/10 rounded-2xl text-xs text-white focus:border-[#D90429] focus:bg-white/[0.04] outline-none transition-colors"
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-1">
                  <label className="text-[9px] uppercase tracking-widest font-black text-white/40">Phone Number</label>
                  <input 
                    type="text" 
                    required 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="E.g. 0712345678" 
                    className="w-full px-4 py-3 bg-white/[0.02] border border-white/10 rounded-2xl text-xs text-white focus:border-[#D90429] focus:bg-white/[0.04] outline-none transition-colors"
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-1">
                  <label className="text-[9px] uppercase tracking-widest font-black text-white/40">Sponsorship Tier Interest</label>
                  <select 
                    value={tier}
                    onChange={(e) => setTier(e.target.value)}
                    className="w-full px-4 py-3 bg-white/[0.02] border border-white/10 rounded-2xl text-xs text-white focus:border-[#D90429] focus:bg-white/[0.04] outline-none transition-colors"
                  >
                    {packages.map(pkg => (
                      <option key={pkg.id} value={pkg.slug} className="bg-[#030303]">
                        {pkg.name} ({pkg.price_formatted})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] uppercase tracking-widest font-black text-white/40">Inquiry details</label>
                <textarea 
                  rows={4} 
                  required 
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Outline your partnership objectives..." 
                  className="w-full px-4 py-3 bg-white/[0.02] border border-white/10 rounded-2xl text-xs text-white focus:border-[#D90429] focus:bg-white/[0.04] outline-none resize-none transition-colors"
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-[#D90429] to-[#FF3D57] hover:from-[#B00020] hover:to-[#D90429] disabled:opacity-60 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_25px_rgba(217,4,41,0.25)]"
              >
                {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}
                <span>Submit Corporate Inquiry</span>
              </button>
            </form>
          </div>
        </div>

      </div>

    </div>
  );
}
