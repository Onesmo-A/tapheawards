import React from 'react';

interface ExportModuleProps {
  handleExportCategories: (format: 'csv' | 'excel' | 'pdf') => void;
  handleExportNominees: (format: 'csv' | 'excel' | 'pdf') => void;
  handleExportMarathons: (format: 'csv' | 'excel' | 'pdf') => void;
  handleExportTickets: (format: 'csv' | 'excel' | 'pdf') => void;
}

export default function ExportModule({
  handleExportCategories,
  handleExportNominees,
  handleExportMarathons,
  handleExportTickets
}: ExportModuleProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-sm font-black uppercase text-white/40 tracking-wider">TAPHE Secure Export Desk</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category list panel */}
        <div className="p-6 bg-[#0b0b0b] border border-white/5 rounded-[32px] flex flex-col justify-between space-y-4">
          <div>
            <h4 className="text-xs font-black uppercase text-white">Categories Directory</h4>
            <p className="text-[10px] text-white/40 mt-1">Export full database directory of award groups, categories, timelines, status and nomination fees.</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleExportCategories('csv')}
              className="py-2.5 bg-[#D90429]/10 hover:bg-[#D90429] border border-[#D90429]/20 hover:border-transparent text-white text-[9px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              CSV
            </button>
            <button
              onClick={() => handleExportCategories('excel')}
              className="py-2.5 bg-[#D90429]/10 hover:bg-[#D90429] border border-[#D90429]/20 hover:border-transparent text-white text-[9px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              Excel
            </button>
            <button
              onClick={() => handleExportCategories('pdf')}
              className="py-2.5 bg-[#D90429]/10 hover:bg-[#D90429] border border-[#D90429]/20 hover:border-transparent text-white text-[9px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              PDF
            </button>
          </div>
        </div>

        {/* Nominees list panel */}
        <div className="p-6 bg-[#0b0b0b] border border-white/5 rounded-[32px] flex flex-col justify-between space-y-4">
          <div>
            <h4 className="text-xs font-black uppercase text-white">Nominees Standings</h4>
            <p className="text-[10px] text-white/40 mt-1">Export all candidates, categories they compete in, and active/deactivated statuses.</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleExportNominees('csv')}
              className="py-2.5 bg-[#D90429]/10 hover:bg-[#D90429] border border-[#D90429]/20 hover:border-transparent text-white text-[9px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              CSV
            </button>
            <button
              onClick={() => handleExportNominees('excel')}
              className="py-2.5 bg-[#D90429]/10 hover:bg-[#D90429] border border-[#D90429]/20 hover:border-transparent text-white text-[9px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              Excel
            </button>
            <button
              onClick={() => handleExportNominees('pdf')}
              className="py-2.5 bg-[#D90429]/10 hover:bg-[#D90429] border border-[#D90429]/20 hover:border-transparent text-white text-[9px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              PDF
            </button>
          </div>
        </div>

        {/* Marathon registrations list panel */}
        <div className="p-6 bg-[#0b0b0b] border border-white/5 rounded-[32px] flex flex-col justify-between space-y-4">
          <div>
            <h4 className="text-xs font-black uppercase text-white">Marathon Registrations Registry</h4>
            <p className="text-[10px] text-white/40 mt-1">Export registered marathon runners registry containing contact info, unique ticket codes, race type, and status.</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleExportMarathons('csv')}
              className="py-2.5 bg-[#D90429]/10 hover:bg-[#D90429] border border-[#D90429]/20 hover:border-transparent text-white text-[9px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              CSV
            </button>
            <button
              onClick={() => handleExportMarathons('excel')}
              className="py-2.5 bg-[#D90429]/10 hover:bg-[#D90429] border border-[#D90429]/20 hover:border-transparent text-white text-[9px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              Excel
            </button>
            <button
              onClick={() => handleExportMarathons('pdf')}
              className="py-2.5 bg-[#D90429]/10 hover:bg-[#D90429] border border-[#D90429]/20 hover:border-transparent text-white text-[9px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              PDF
            </button>
          </div>
        </div>

        {/* Ticket sales list panel */}
        <div className="p-6 bg-[#0b0b0b] border border-white/5 rounded-[32px] flex flex-col justify-between space-y-4">
          <div>
            <h4 className="text-xs font-black uppercase text-white">Ticket Purchase Registry</h4>
            <p className="text-[10px] text-white/40 mt-1">Export full ticket sales registry containing buyer details, ticket type, quantity, total collections, and check-in logs.</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleExportTickets('csv')}
              className="py-2.5 bg-[#D90429]/10 hover:bg-[#D90429] border border-[#D90429]/20 hover:border-transparent text-white text-[9px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              CSV
            </button>
            <button
              onClick={() => handleExportTickets('excel')}
              className="py-2.5 bg-[#D90429]/10 hover:bg-[#D90429] border border-[#D90429]/20 hover:border-transparent text-white text-[9px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              Excel
            </button>
            <button
              onClick={() => handleExportTickets('pdf')}
              className="py-2.5 bg-[#D90429]/10 hover:bg-[#D90429] border border-[#D90429]/20 hover:border-transparent text-white text-[9px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
