import React, { useState } from 'react';
import { Search, Loader2, Users } from 'lucide-react';

interface VotesModuleProps {
  nominees: any[];
  loadingNominees: boolean;
  getPaginatedItems: (items: any[], key: string) => any[];
  renderPageSizeSelector: (key: string) => React.ReactNode;
  renderPagination: (key: string, total: number) => React.ReactNode;
  handleExportVotes: (format: 'csv' | 'excel' | 'pdf') => void;
}

export default function VotesModule({
  nominees,
  loadingNominees,
  getPaginatedItems,
  renderPageSizeSelector,
  renderPagination,
  handleExportVotes
}: VotesModuleProps) {
  const [nomineeSearch, setNomineeSearch] = useState('');

  const filteredNominees = nominees.filter(n => 
    n.name.toLowerCase().includes(nomineeSearch.toLowerCase()) || 
    (n.category_name || '').toLowerCase().includes(nomineeSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-4">
        <div className="flex items-center gap-4 flex-grow max-w-md">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Search nominee votes..."
              value={nomineeSearch}
              onChange={(e) => setNomineeSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#0b0b0b] border border-white/10 rounded-xl text-xs text-white focus:border-[#D90429] outline-none"
            />
          </div>
          <div className="flex gap-1 shrink-0">
            <button
              onClick={() => handleExportVotes('csv')}
              className="px-2.5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl cursor-pointer"
            >
              CSV
            </button>
            <button
              onClick={() => handleExportVotes('excel')}
              className="px-2.5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl cursor-pointer"
            >
              EXCEL
            </button>
            <button
              onClick={() => handleExportVotes('pdf')}
              className="px-2.5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl cursor-pointer"
            >
              PDF
            </button>
          </div>
        </div>
      </div>

      {loadingNominees ? (
        <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#D90429]" /></div>
      ) : (
        <div className="bg-[#0b0b0b] border border-white/5 rounded-3xl overflow-hidden">
          <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
            <h4 className="text-xs font-black uppercase text-white/40 tracking-wider">Nominee Votes Registry</h4>
            {renderPageSizeSelector('votes')}
          </div>
          <table className="w-full text-left text-xs font-light">
            <thead>
              <tr className="bg-white/[0.01] border-b border-white/5 text-[9px] font-black uppercase tracking-wider text-white/40">
                <th className="p-4 pl-6">Nominee Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Total Votes</th>
                <th className="p-4 pr-6 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {getPaginatedItems(filteredNominees, 'votes').map(n => (
                <tr key={n.id} className="hover:bg-white/[0.01]">
                  <td className="p-4 pl-6 font-bold text-white">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                        {n.image_url ? (
                          <img src={n.image_url} alt={n.name} className="w-full h-full object-cover" />
                        ) : (
                          <Users className="w-4 h-4 text-white/30" />
                        )}
                      </div>
                      <span>{n.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-white/60">{n.category_name || 'N/A'}</td>
                  <td className="p-4 font-black text-[#D90429] text-xs">
                    {n.votes_count?.toLocaleString() || 0} Votes
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <span className={`px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase border ${n.is_suspended ? 'bg-red-500/10 text-red-500 border-red-500/15' : 'bg-green-500/10 text-green-500 border-green-500/15'}`}>
                      {n.is_suspended ? 'Suspended' : 'Active'}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredNominees.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-white/30 text-xs">Hakuna wagombea waliopatikana.</td>
                </tr>
              )}
            </tbody>
          </table>
          {renderPagination('votes', filteredNominees.length)}
        </div>
      )}
    </div>
  );
}
