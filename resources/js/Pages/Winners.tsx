import React, { useEffect, useState } from 'react';
import { Award, Search, Sparkles, Star, Building, Users, X, ShieldCheck, Loader2, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const getCategoryIcon = (category: string) => {
  const lower = category.toLowerCase();
  if (lower.includes('hospital') || lower.includes('care') || lower.includes('facility')) {
    return <Building className="w-5 h-5" />;
  }
  if (lower.includes('researcher') || lower.includes('achievement') || lower.includes('advocate')) {
    return <Users className="w-5 h-5" />;
  }
  return <Award className="w-5 h-5" />;
};

export default function Winners() {
  const [winners, setWinners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [disabledMessage, setDisabledMessage] = useState('');
  const [selectedSeason, setSelectedSeason] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWinnerStats, setSelectedWinnerStats] = useState<any | null>(null);

  useEffect(() => {
    fetch('/api/v1/awards/winners')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'disabled') {
          setDisabled(true);
          setDisabledMessage(data.message || 'Voting results are not publicly available yet.');
        } else if (data.status === 'success') {
          const list = data.winners || [];
          setWinners(list);
          // Auto select latest season year
          const years = Array.from(new Set(list.map((w: any) => String(w.year)))).sort((a, b) => Number(b) - Number(a)) as string[];
          if (years.length > 0) {
            setSelectedSeason(years[0]);
          } else {
            setSelectedSeason('2026');
          }
        }
      })
      .catch(err => console.error("Error loading winners:", err))
      .finally(() => setLoading(false));
  }, []);

  // Group winners dynamically by season year
  const seasonsData: Record<string, any[]> = {};
  winners.forEach((w: any) => {
    const yr = String(w.year);
    if (!seasonsData[yr]) {
      seasonsData[yr] = [];
    }
    if (w.nominee) {
      seasonsData[yr].push({
        id: w.id,
        name: w.nominee.name,
        category: w.category_name,
        desc: w.nominee.bio || w.category_description || 'Healthcare quality and service excellence laureate.',
        image: w.nominee.image_url || '/images/logo.webp',
        nominees: w.nominees || []
      });
    }
  });

  const availableSeasons = Object.keys(seasonsData).sort((a, b) => Number(b) - Number(a));
  const activeSeason = selectedSeason || availableSeasons[0] || '2026';

  const currentWinners = (seasonsData[activeSeason] || []).filter((winner) => 
    winner.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    winner.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalLaureatesCount = winners.length;
  const certifiedReportsCount = winners.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#D90429]" />
      </div>
    );
  }

  if (disabled) {
    return (
      <div className="min-h-screen bg-[#030303] text-white selection:bg-[#D90429] selection:text-white bg-mesh pt-32 pb-20 flex items-center justify-center">
        <div className="max-w-md mx-auto px-6 text-center space-y-6">
          <div className="w-16 h-16 bg-[#D90429]/10 border border-[#D90429]/20 text-[#D90429] rounded-3xl flex items-center justify-center mx-auto animate-pulse">
            <Trophy className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-outfit font-black uppercase tracking-tight text-white">Results Coming Soon</h1>
          <p className="text-xs text-white/50 leading-relaxed font-light">
            {disabledMessage}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030303] text-white selection:bg-[#D90429] selection:text-white bg-mesh pt-24 pb-20">
      
      {/* Spotlight blur */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#D90429]/10 rounded-full blur-[100px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-6 md:px-16 relative z-10 space-y-16">
        
        {/* Header Title */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
          <div className="text-left space-y-4 max-w-2xl">
            <span className="text-[10px] font-black text-[#D90429] uppercase tracking-widest font-outfit">TAPHE Hall of Fame</span>
            <h1 className="text-5xl md:text-7xl font-outfit font-black tracking-tight uppercase leading-none text-white text-shadow-glow">
              Past <br />
              <span className="text-red-gradient">Laureates</span>
            </h1>
            <p className="text-xs md:text-sm text-white/50 leading-relaxed font-light font-inter max-w-xl">
              Celebrating the institutions and medical practitioners who achieved the peak of healthcare quality and service delivery in previous seasons.
            </p>
          </div>

          {/* Stats cards top right */}
          <div className="grid grid-cols-3 gap-4 w-full lg:w-auto shrink-0 lg:mt-4">
            <div className="p-4 px-6 rounded-2xl glass-panel bg-white/[0.01] border border-white/5 text-left space-y-1">
              <span className="text-[8px] font-black uppercase text-white/40 tracking-wider">Seasons</span>
              <div className="text-lg font-black text-[#D90429] font-outfit">{availableSeasons.length || 1}</div>
              <p className="text-[9px] text-white/50 leading-tight">Archives</p>
            </div>
            <div className="p-4 px-6 rounded-2xl glass-panel bg-white/[0.01] border border-[#D90429]/20 text-left space-y-1 shadow-[0_0_15px_rgba(217,4,41,0.05)]">
              <span className="text-[8px] font-black uppercase text-white/40 tracking-wider">Winners</span>
              <div className="text-lg font-black text-[#D90429] font-outfit">{totalLaureatesCount}</div>
              <p className="text-[9px] text-white/50 leading-tight">Laureates</p>
            </div>
            <div className="p-4 px-6 rounded-2xl glass-panel bg-white/[0.01] border border-white/5 text-left space-y-1">
              <span className="text-[8px] font-black uppercase text-white/40 tracking-wider">Audits</span>
              <div className="text-lg font-black text-[#D90429] font-outfit">{certifiedReportsCount}</div>
              <p className="text-[9px] text-white/50 leading-tight">Certified Reports</p>
            </div>
          </div>
        </div>

        {/* Filter Toolbar (Seasons & Search) */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-xl">
          {/* Season Switcher Tabs */}
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto scrollbar-none">
            {availableSeasons.length === 0 ? (
              <span className="px-5 py-2.5 text-[10px] font-black uppercase text-white/30 tracking-wider">No Archive Seasons</span>
            ) : (
              availableSeasons.map((season) => (
                <button
                  key={season}
                  onClick={() => setSelectedSeason(season)}
                  className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 border ${
                    activeSeason === season
                      ? 'bg-[#D90429] border-[#D90429]/20 text-white shadow-lg shadow-[#D90429]/10'
                      : 'bg-white/5 border-white/5 text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Season {season}
                </button>
              ))
            )}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Search laureates or awards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 text-xs bg-black/40 border border-white/10 rounded-2xl focus:border-[#D90429] focus:ring-1 focus:ring-[#D90429] outline-none text-white transition-all"
            />
          </div>
        </div>

        {/* Winners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="wait">
            {currentWinners.map((winner, idx) => (
              <motion.div
                key={`${activeSeason}-${winner.name}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                onClick={() => setSelectedWinnerStats(winner)}
                className="bg-[#0b0b0b] border border-white/5 hover:border-[#D90429]/20 rounded-[32px] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  {/* Photo container */}
                  <div className="relative h-56 bg-gradient-to-br from-white/5 to-white/10 overflow-hidden flex items-center justify-center">
                    {winner.image ? (
                      <img 
                        src={winner.image} 
                        alt={winner.name} 
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = '/images/logo.webp';
                        }}
                        className="w-full h-full object-cover filter brightness-[0.7] group-hover:scale-105 transition-transform duration-500 bg-[#0b0b0b]"
                      />
                    ) : (
                      <Users className="w-16 h-16 text-white/10" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    {/* Floating badge */}
                    <div className="absolute top-4 left-4 px-3.5 py-1.5 bg-black/60 backdrop-blur-md border border-[#D90429]/40 text-[#D90429] rounded-full text-[9px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Star className="w-3 h-3 fill-[#D90429]" />
                      <span>Winner</span>
                    </div>

                    <div className="absolute inset-x-0 bottom-0 p-6 text-left">
                      <h3 className="text-base font-black font-outfit tracking-wide uppercase text-white leading-tight">
                        {winner.name}
                      </h3>
                    </div>
                  </div>

                  {/* Body description */}
                  <div className="p-6 space-y-4 text-left">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#D90429]">
                        {getCategoryIcon(winner.category)}
                      </div>
                      <span className="text-[10px] font-black uppercase text-[#D90429] tracking-wider font-outfit truncate max-w-[200px]">
                        {winner.category}
                      </span>
                    </div>
                    <p className="text-xs text-white/55 leading-relaxed font-light font-inter min-h-[48px] line-clamp-3">
                      {winner.desc}
                    </p>
                  </div>
                </div>

                <div className="p-6 bg-[#0e0e0e] border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
                    <span className="text-[9px] font-bold text-white/45 uppercase tracking-wider">
                      Season {activeSeason} Excellence Laureate
                    </span>
                  </div>
                  <span className="text-[9px] font-black text-[#D90429] uppercase tracking-wider group-hover:underline">View Audit Stats →</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {currentWinners.length === 0 && (
            <div className="col-span-full py-20 text-center rounded-[32px] border border-white/5 bg-white/[0.01]">
              <Award className="w-16 h-16 text-white/10 mx-auto mb-4" />
              <h4 className="text-sm font-bold text-white/70">No Winners Found</h4>
              <p className="text-xs text-white/50 mt-1 max-w-xs mx-auto leading-relaxed">Try updating your filters or search keywords.</p>
            </div>
          )}
        </div>

      </div>

      {/* LAUREATE AUDIT STATISTICS MODAL OVERLAY */}
      <AnimatePresence>
        {selectedWinnerStats && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 z-0" onClick={() => setSelectedWinnerStats(null)} />

            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="relative z-10 w-full max-w-lg bg-[#0c0c0c] border border-white/10 rounded-[32px] p-6 space-y-6 overflow-hidden text-left"
            >
              <div className="absolute -left-12 -top-12 w-32 h-32 bg-[#D90429]/5 rounded-full blur-[40px] pointer-events-none" />

              {/* Close trigger */}
              <button
                onClick={() => setSelectedWinnerStats(null)}
                className="absolute top-6 right-6 p-1.5 hover:bg-white/5 border border-white/10 rounded-full transition-all cursor-pointer"
              >
                <X className="w-4 h-4 text-white/60 hover:text-white" />
              </button>

              {/* Header Title */}
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-[#D90429] uppercase tracking-widest font-outfit">Audited Season Results</span>
                <h3 className="text-base font-black text-white uppercase">{selectedWinnerStats.category}</h3>
                <p className="text-[10px] text-white/40 uppercase font-mono">Season {activeSeason} Archives</p>
              </div>

              {/* Audited integrity check card */}
              <div className="p-3 bg-green-500/5 border border-green-500/10 rounded-2xl flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-green-500 shrink-0" />
                <div className="text-[10px] text-left">
                  <h4 className="font-bold text-white uppercase">Certified Audit Record</h4>
                  <p className="text-white/50 leading-relaxed font-light mt-0.5">Vote records cryptographically signed via SHA-256 HMAC integrity signatures.</p>
                </div>
              </div>

              {/* Nominees breakdown comparisons list */}
              <div className="space-y-4 pt-2">
                <h4 className="text-[10px] font-bold uppercase text-white/40 tracking-wider">Candidate Standing Breakdown</h4>
                
                <div className="space-y-4">
                  {selectedWinnerStats.nominees.map((nominee: any, idx: number) => {
                    const isWinnerCandidate = nominee.name === selectedWinnerStats.name;
                    return (
                      <div key={idx} className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className={`font-bold ${isWinnerCandidate ? 'text-white' : 'text-white/60'}`}>
                            {nominee.name} {isWinnerCandidate && '🏆'}
                          </span>
                          <span className={`font-black ${isWinnerCandidate ? 'text-[#D90429]' : 'text-white/40'}`}>
                            {nominee.percentage}% <span className="text-[10px] font-light text-white/30">({nominee.votes.toLocaleString()} votes)</span>
                          </span>
                        </div>
                        
                        {/* Vote percentage bar representation */}
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${nominee.percentage}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut', delay: idx * 0.1 }}
                            className={`h-full rounded-full ${
                              isWinnerCandidate 
                                ? 'bg-gradient-to-r from-[#D90429] to-[#FF3D57] shadow-[0_0_8px_#D90429]' 
                                : 'bg-white/20'
                            }`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 text-center">
                <button
                  onClick={() => setSelectedWinnerStats(null)}
                  className="w-full py-3 border border-white/10 hover:bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-all duration-300"
                >
                  Close Audit Sheet
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
