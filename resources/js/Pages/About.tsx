import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, Sparkles, Award, Users, Activity, ChevronRight, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function About() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 20
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white selection:bg-[#D90429] selection:text-white bg-mesh pt-24 pb-20 overflow-x-hidden">
      
      {/* Ambient glowing highlights */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#D90429]/5 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-[#D90429]/3 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#D90429]/5 rounded-full blur-[100px] pointer-events-none z-0" />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-6 md:px-16 relative z-10 space-y-20"
      >
        
        {/* Header Banner */}
        <motion.div variants={itemVariants} className="text-left space-y-4 max-w-3xl">
          <span className="text-[10px] font-black text-[#D90429] uppercase tracking-widest font-outfit">TAPHE Secretariat</span>
          <h1 className="text-5xl md:text-7xl font-outfit font-black tracking-tight uppercase leading-none text-white text-shadow-glow">
            About The <br />
            <span className="text-red-gradient">Awards</span>
          </h1>
          <p className="text-xs md:text-sm text-white/50 leading-relaxed font-light font-inter max-w-xl">
            Tanzania People's Health Excellence Awards (TAPHE Awards) are dedicated to identifying, validating, and celebrating outstanding contributions to healthcare quality, local medical innovations, and clinical dedication.
          </p>
        </motion.div>

        {/* Mission & Vision Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mission Card */}
          <div className="p-8 md:p-10 rounded-[2.5rem] bg-gradient-to-b from-[#1c1c1c]/90 to-[#0c0809] border border-white/5 space-y-4 hover:border-[#D90429]/30 transition-all duration-500 text-left relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D90429]/5 rounded-full blur-[30px] pointer-events-none" />
            <div className="w-full h-48 rounded-2xl overflow-hidden border border-white/10 mb-4 bg-black relative">
              <img 
                loading="lazy"
                src="/images/about-us.webp" 
                alt="Our Mission" 
                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c0809] via-transparent to-transparent" />
            </div>
            <h3 className="text-xl font-black font-outfit uppercase tracking-wider text-white">Our Mission</h3>
            <p className="text-xs text-white/60 leading-relaxed font-light font-inter">
              To provide Tanzanian citizens and healthcare authorities with a completely transparent, secure, and authenticated platform to nominate and reward the real heroes of public health. By reinforcing data transparency and clinical verification, we build trust and elevate institutional care standards nationwide.
            </p>
          </div>

          {/* Vision Card */}
          <div className="p-8 md:p-10 rounded-[2.5rem] bg-gradient-to-b from-[#1c1c1c]/90 to-[#0c0809] border border-white/5 space-y-4 hover:border-[#D90429]/30 transition-all duration-500 text-left relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D90429]/5 rounded-full blur-[30px] pointer-events-none" />
            <div className="w-full h-48 rounded-2xl overflow-hidden border border-white/10 mb-4 bg-black relative">
              <img 
                loading="lazy"
                src="/images/about-us2.webp" 
                alt="Our Vision" 
                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c0809] via-transparent to-transparent" />
            </div>
            <h3 className="text-xl font-black font-outfit uppercase tracking-wider text-white">Our Vision</h3>
            <p className="text-xs text-white/60 leading-relaxed font-light font-inter">
              To establish the premier healthcare validation benchmark in East Africa, inspiring sustainable medical practices, clinical innovation, and quality healthcare infrastructure that leaves a lasting positive footprint on maternal and community clinic diagnostics.
            </p>
          </div>
        </motion.div>

        {/* Core Pillars */}
        <motion.div variants={itemVariants} className="space-y-12">
          <div className="text-left space-y-2">
            <span className="text-[10px] font-black text-[#D90429] uppercase tracking-widest font-outfit">Core values</span>
            <h2 className="text-xl md:text-2xl font-outfit font-black tracking-tight uppercase text-white">How We Maintain Integrity</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <ShieldCheck className="w-5 h-5" />,
                title: "Secure Verification",
                desc: "Voter authenticity is guarded using OTP pins processed via standard SMS or WhatsApp networks to ensure absolute integrity."
              },
              {
                icon: <Award className="w-5 h-5" />,
                title: "Clinical Validation",
                desc: "Every candidate nomination undergoes screening by our technical steering panel to confirm clinical qualifications and impact."
              },
              {
                icon: <Users className="w-5 h-5" />,
                title: "Public Voice",
                desc: "Empowering everyday Tanzanians to participate, nominate, and recognize the doctors, clinics, and workers making a difference."
              },
              {
                icon: <Heart className="w-5 h-5" />,
                title: "Community Focus",
                desc: "A portion of tickets and partner sponsorships goes directly toward medical logistics, maternal kits, and community clinic supplies."
              }
            ].map((pillar, idx) => (
              <div 
                key={idx} 
                className="p-6 rounded-3xl bg-white/[0.01] border border-white/5 hover:border-[#D90429]/25 hover:bg-white/[0.02] transition-all duration-300 text-left space-y-4 group"
              >
                <div className="w-10 h-10 rounded-xl bg-black border border-white/10 flex items-center justify-center text-[#D90429] group-hover:scale-105 transition-transform duration-300">
                  {pillar.icon}
                </div>
                <h4 className="text-xs font-black uppercase text-white tracking-wider">{pillar.title}</h4>
                <p className="text-[11px] text-white/50 leading-relaxed font-inter font-light">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Board & Secretariat Showcase */}
        <motion.div variants={itemVariants} className="space-y-12">
          <div className="text-left space-y-2">
            <span className="text-[10px] font-black text-[#D90429] uppercase tracking-widest font-outfit">Governance</span>
            <h2 className="text-xl md:text-2xl font-outfit font-black tracking-tight uppercase text-white">Secretariat & Steering Committee</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                role: "Board Chairperson",
                title: "Executive Medical Board",
                desc: "Directs governance protocols, validates nominations audit reports, and represents TAPHE with national health ministries."
              },
              {
                role: "Secretariat Lead",
                title: "Operations & Logistics",
                desc: "Coordinates public engagement campaigns, event ticket distribution networks, and official media communications."
              },
              {
                role: "Technical Steering Panel",
                title: "Verification & Data Officers",
                desc: "Reviews candidates biographies, processes verified SMS database votes, and coordinates the digital portal integrity checks."
              }
            ].map((member, idx) => (
              <div 
                key={idx}
                className="p-6 rounded-[2rem] bg-gradient-to-b from-[#121212] to-[#0a0a0a] border border-white/5 hover:border-white/10 transition-all duration-300 text-left space-y-4 relative overflow-hidden group"
              >
                <div className="flex justify-between items-start">
                  <span className="px-2.5 py-1 bg-white/5 rounded-md text-[8px] font-black uppercase tracking-wider text-[#D90429]">
                    {member.role}
                  </span>
                  <Star className="w-4 h-4 text-white/10 group-hover:text-yellow-500 transition-colors" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-sm font-black uppercase text-white tracking-wider">{member.title}</h4>
                  <p className="text-[11px] text-white/45 leading-relaxed font-inter font-light">{member.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Luxury CTA Section */}
        <motion.div 
          variants={itemVariants}
          className="rounded-[2.5rem] border border-white/5 bg-gradient-to-r from-[#0c0809] to-[#12080a] p-8 md:p-12 text-left relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl"
        >
          <div className="absolute -left-16 -top-16 w-64 h-64 bg-[#D90429]/5 rounded-full blur-[70px] pointer-events-none" />
          <div className="absolute right-0 bottom-0 w-80 h-80 bg-[#D90429]/5 rounded-full blur-[90px] pointer-events-none" />

          <div className="text-left space-y-4 max-w-xl relative z-10">
            <span className="text-[9px] font-black text-[#D90429] uppercase tracking-widest font-outfit">Join the celebration</span>
            <h3 className="text-2xl md:text-4xl font-outfit font-black uppercase text-white">Celebrate Tanzanian Healthcare Heroes</h3>
            <p className="text-xs text-white/55 leading-relaxed font-light font-inter">
              Explore award categories, cast your secure authenticated vote, or book your seat at the luxury gala presentation dinner.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap gap-4 shrink-0">
            <Link
              to="/categories"
              className="px-6 py-3.5 bg-black/60 hover:bg-[#D90429]/10 border border-[#D90429]/40 hover:border-[#D90429] text-white text-[10px] font-black uppercase tracking-widest rounded-full transition-all duration-300 flex items-center gap-1.5"
            >
              <span>Explore Categories</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
            
            <Link
              to="/tickets"
              className="px-6 py-3.5 bg-gradient-to-r from-[#D90429] to-[#FF3D57] hover:from-[#B00020] hover:to-[#D90429] text-white text-[10px] font-black uppercase tracking-widest rounded-full transition-all duration-300 shadow-[0_4px_25px_rgba(217,4,41,0.2)]"
            >
              Get Tickets
            </Link>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}
