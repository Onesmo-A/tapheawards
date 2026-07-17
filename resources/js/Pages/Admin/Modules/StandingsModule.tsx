import React from 'react';
import { Loader2, Users, FileSpreadsheet } from 'lucide-react';

interface StandingsModuleProps {
  standings: any[];
  loadingStandings: boolean;
  getPaginatedItems: (items: any[], key: string) => any[];
  renderPagination: (key: string, total: number) => React.ReactNode;
  downloadCSV: (filename: string, headers: string[], rows: string[][]) => void;
  downloadExcel: (filename: string, headers: string[], rows: string[][]) => void;
  downloadPDF: (title: string, headers: string[], rows: string[][]) => void;
}

export default function StandingsModule({
  standings,
  loadingStandings,
  getPaginatedItems,
  renderPagination,
  downloadCSV,
  downloadExcel,
  downloadPDF
}: StandingsModuleProps) {

  const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
    const headers = ['Category', 'Nominee', 'Votes Count'];
    const rows = standings.flatMap(cat => 
      (cat.nominees || []).map((n: any) => [cat.name, n.name, String(n.votes_count)])
    );

    if (format === 'csv') {
      downloadCSV('taphe_live_standings_export.csv', headers, rows);
    } else if (format === 'excel') {
      downloadExcel('taphe_live_standings_export.xls', headers, rows);
    } else if (format === 'pdf') {
      downloadPDF('Live Voting Standings', headers, rows);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-4">
        <h3 className="text-sm font-black uppercase text-white/40 tracking-wider">Live Vote Standings</h3>
        <div className="flex gap-1">
          <button
            onClick={() => handleExport('csv')}
            className="px-2.5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl cursor-pointer"
          >
            CSV
          </button>
          <button
            onClick={() => handleExport('excel')}
            className="px-2.5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl cursor-pointer"
          >
            EXCEL
          </button>
          <button
            onClick={() => handleExport('pdf')}
            className="px-2.5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl cursor-pointer"
          >
            PDF
          </button>
        </div>
      </div>

      {loadingStandings ? (
        <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#D90429]" /></div>
      ) : (
        <div className="space-y-8">
          {getPaginatedItems(standings, 'standings').map(cat => (
            <div key={cat.id} className="bg-[#0b0b0b] border border-white/5 rounded-3xl p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <div>
                  <h4 className="text-xs font-black uppercase text-white">{cat.name}</h4>
                  <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">{cat.group?.name || '—'}</span>
                </div>
                <span className="px-3 py-1 bg-white/5 rounded-full text-[9px] font-black text-white/70">
                  Total: {(cat.nominees || []).reduce((acc: number, curr: any) => acc + curr.votes_count, 0)} Votes
                </span>
              </div>

              <div className="space-y-2">
                {(cat.nominees || []).length === 0 ? (
                  <p className="text-[10px] text-white/30 uppercase italic text-center py-2">No candidates in this category.</p>
                ) : (
                  (cat.nominees || []).map((nom: any, idx: number) => (
                    <div key={nom.id} className="flex items-center justify-between p-3 bg-black/40 rounded-2xl border border-white/[0.02] hover:border-white/5 transition-all">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-mono text-white/30 w-5">#{idx + 1}</span>
                        <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                          {nom.image_url ? (
                            <img src={nom.image_url} className="w-full h-full object-cover" />
                          ) : (
                            <Users className="w-3.5 h-3.5 text-white/30" />
                          )}
                        </div>
                        <span className="text-xs font-bold text-white">{nom.name}</span>
                      </div>
                      <span className="text-xs font-black text-[#D90429]">{nom.votes_count} Votes</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
          {renderPagination('standings', standings.length)}
        </div>
      )}
    </div>
  );
}
