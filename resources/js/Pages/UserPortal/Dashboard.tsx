import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Award, Ticket, ShieldCheck, Flame, ArrowRight, Activity } from 'lucide-react';
import axios from 'axios';

interface DashboardStats {
  total_applications: number;
  approved_applications: number;
  total_tickets: number;
  marathon_registrations: number;
}

interface UserData {
  name: string;
  email: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    total_applications: 0,
    approved_applications: 0,
    total_tickets: 0,
    marathon_registrations: 0,
  });
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('user_token');
    
    // Fetch stats
    axios.get('/api/v1/user/dashboard/stats', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        setStats(response.data.stats);
      })
      .catch(err => {
        console.error('Failed to load stats', err);
      });

    // Fetch user details
    axios.get('/api/v1/user', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        setUser(response.data);
      })
      .catch(err => {
        console.error('Failed to load user', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center space-y-4">
        <div className="w-8 h-8 border-4 border-t-red-600 border-white/10 rounded-full animate-spin" />
        <p className="text-[10px] font-black uppercase text-white/50 tracking-widest">Loading Overview...</p>
      </div>
    );
  }

  const statCards = [
    {
      label: 'My Nominations',
      value: stats.total_applications,
      desc: `${stats.approved_applications} Approved Entry`,
      icon: Award,
      color: 'from-[#D90429] to-[#FF3D57]',
      link: '/portal/applications',
    },
    {
      label: 'Gala Tickets Purchased',
      value: stats.total_tickets,
      desc: stats.total_tickets > 0 ? 'Seat Reserved' : 'No Tickets Yet',
      icon: Ticket,
      color: 'from-[#D4A853] to-[#E6C37F]',
      link: '/portal/tickets',
    },
    {
      label: 'Marathon Run',
      value: stats.marathon_registrations,
      desc: stats.marathon_registrations > 0 ? 'Runner Registered' : 'Not Registered',
      icon: Activity,
      color: 'from-blue-600 to-cyan-500',
      link: '/portal/profile',
    },
  ];

  return (
    <div className="space-y-10 text-left">
      {/* 1. HERO BANNER CARD */}
      <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#0c0809] p-8 md:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute -left-16 -top-16 w-64 h-64 bg-[#D90429]/5 rounded-full blur-[70px] pointer-events-none" />
        <div className="absolute right-0 bottom-0 w-80 h-80 bg-[#D4A853]/5 rounded-full blur-[90px] pointer-events-none" />

        <div className="space-y-4 relative z-10 max-w-xl">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#D90429]/10 border border-[#D90429]/30 rounded-full text-[#ff3333] text-[9px] font-black uppercase tracking-widest font-outfit">
            <Flame className="w-3.5 h-3.5" />
            <span>Healthcare Excellence Portal</span>
          </span>
          <h2 className="text-3xl md:text-5xl font-outfit font-black uppercase tracking-tight text-white leading-tight">
            Hello, <br className="hidden md:block" />
            <span className="text-red-gradient">{user?.name || 'Practitioner'}</span>
          </h2>
          <p className="text-xs md:text-sm text-white/50 leading-relaxed font-light font-inter">
            This is your workspace for the Tanzania People's Health Excellence Awards. Register new nominations, review entry guidelines, monitor submitted application statuses, and manage your VIP tickets.
          </p>
        </div>

        <div className="shrink-0 relative z-10">
          <Link
            to="/categories"
            className="px-6 py-3.5 bg-gradient-to-r from-[#D90429] to-[#FF3D57] hover:from-[#B00020] hover:to-[#D90429] text-white text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-2 border border-[#D90429]/20 shadow-[0_4px_25px_rgba(217,4,41,0.25)] hover:shadow-[0_0_35px_rgba(255,51,51,0.5)] transition-all duration-300 group"
          >
            <span>Explore Nominations</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* 2. STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link
              key={idx}
              to={card.link}
              className="group relative overflow-hidden rounded-3xl glass-panel bg-white/[0.01] border border-white/5 p-6 flex flex-col justify-between h-44 hover:border-white/10 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-black/40"
            >
              <div className="absolute inset-0 bg-red-glow opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10 flex items-start justify-between">
                <div className={`p-3 rounded-2xl bg-gradient-to-tr ${card.color} text-white shadow-lg`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-3xl font-black text-white font-outfit tracking-tight group-hover:scale-105 transition-transform duration-300">
                  {card.value}
                </div>
              </div>

              <div className="relative z-10 text-left space-y-1">
                <span className="text-[10px] font-black uppercase text-white/40 tracking-wider">
                  {card.label}
                </span>
                <p className="text-xs font-semibold text-white/80 flex items-center gap-1">
                  <span>{card.desc}</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* 3. QUICK ACTIONS GUIDE */}
      <div className="rounded-3xl border border-white/5 bg-[#080506] p-6 space-y-6">
        <div className="flex items-center gap-2 border-b border-white/5 pb-4">
          <ShieldCheck className="w-5 h-5 text-[#D4A853]" />
          <h3 className="font-outfit text-xs font-black uppercase tracking-widest text-[#D4A853]">
            Getting Started Guide
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase text-white tracking-wider">1. Nominate Candidates</h4>
            <p className="text-xs text-white/50 leading-relaxed font-light">
              Explore categories from the main menu, choose the proper group, fill in nominee personal information and bio description, upload supporting documents, and pay the administrative review fee safely using ZenoPay.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase text-white tracking-wider">2. Secure Tickets & Seats</h4>
            <p className="text-xs text-white/50 leading-relaxed font-light">
              Book seating places for you and your organization for the TAPHE Awards Gala Event. Complete payment via mobile networks and access secure checkout ticket validation codes directly from your portal dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
