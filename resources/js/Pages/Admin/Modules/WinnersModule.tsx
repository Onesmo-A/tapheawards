import React, { useState } from 'react';
import adminApi from '../Utils/adminApi';
import { Loader2, Users, Plus, Trash2, Trophy, Star, Award, TrendingUp, CheckCircle2 } from 'lucide-react';

interface WinnersModuleProps {
  winners: any[];
  categories: any[];
  nominees: any[];
  loadingWinners: boolean;
  fetchWinners: () => void;
  getPaginatedItems: (items: any[], key: string) => any[];
  renderPageSizeSelector: (key: string) => React.ReactNode;
  renderPagination: (key: string, total: number) => React.ReactNode;
  setErrorMsg: (msg: string) => void;
  setSuccessMsg: (msg: string) => void;
}

export default function WinnersModule({
  winners,
  categories,
  nominees,
  loadingWinners,
  fetchWinners,
  getPaginatedItems,
  renderPageSizeSelector,
  renderPagination,
  setErrorMsg,
  setSuccessMsg
}: WinnersModuleProps) {
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [winnerForm, setWinnerForm] = useState({ nominee_id: '', category_id: '', year: '2026' });

  // Handle category change to auto-select first nominee of that category
  const handleCategoryChange = (catId: string) => {
    const filtered = nominees.filter(n => n.category_id === catId);
    setWinnerForm({
      ...winnerForm,
      category_id: catId,
      nominee_id: filtered[0]?.id || ''
    });
  };

  const handleSaveWinner = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    if (!winnerForm.category_id || !winnerForm.nominee_id) {
      setErrorMsg('Please select Category and Nominee.');
      return;
    }
    const nominee = nominees.find(n => n.id === winnerForm.nominee_id);
    if (!nominee || Number(nominee.votes_count || 0) <= 0) {
      setErrorMsg('Cannot declare a nominee with 0 votes as a winner.');
      return;
    }
    try {
      await adminApi.post('/api/v1/admin/crud/winners', winnerForm);
      setSuccessMsg('Winner declared successfully.');
      setShowWinnerModal(false);
      fetchWinners();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to declare winner.');
    }
  };

  const handleToggleWinner = async (nomineeId: string, categoryId: string) => {
    setErrorMsg('');
    setSuccessMsg('');
    const existingWinner = winners.find(
      w => w.nominee_id === nomineeId && w.category_id === categoryId
    );

    if (existingWinner) {
      try {
        await adminApi.delete(`/api/v1/admin/crud/winners/${existingWinner.id}`);
        setSuccessMsg('Winner revoked successfully.');
        fetchWinners();
      } catch (err: any) {
        setErrorMsg('Failed to revoke winner.');
      }
    } else {
      const nominee = nominees.find(n => n.id === nomineeId);
      if (!nominee || Number(nominee.votes_count || 0) <= 0) {
        setErrorMsg('Cannot declare a nominee with 0 votes as a winner.');
        return;
      }
      try {
        await adminApi.post('/api/v1/admin/crud/winners', {
          nominee_id: nomineeId,
          category_id: categoryId,
          year: '2026'
        });
        setSuccessMsg('Winner declared successfully.');
        fetchWinners();
      } catch (err: any) {
        setErrorMsg(err.response?.data?.message || 'Failed to declare winner.');
      }
    }
  };

  const handleDeleteWinner = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this winner declaration?')) return;
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await adminApi.delete(`/api/v1/admin/crud/winners/${id}`);
      setSuccessMsg('Winner deleted successfully.');
      fetchWinners();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to delete winner.');
    }
  };

  const filteredNomineesForSelectedCategory = nominees.filter(n => n.category_id === winnerForm.category_id);

  return (
    <div className="space-y-8">
      {/* SECTION 1: LIVE CATEGORY STANDINGS & DECISION BOARD */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-black uppercase text-white tracking-wider flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[#D90429]" /> Winner Selection Board
          </h3>
          <p className="text-[10px] text-white/35 mt-0.5">
            Select winners directly based on live votes count. The nominee with the highest votes is highlighted.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {categories.map(category => {
            // Find nominees for this category and sort by votes_count desc
            const categoryNominees = nominees
              .filter(n => n.category_id === category.id)
              .sort((a, b) => Number(b.votes_count || 0) - Number(a.votes_count || 0));

            return (
              <div key={category.id} className="p-5 rounded-3xl bg-[#0b0b0b] border border-white/5 space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2 border-b border-white/5 pb-2">
                    <div>
                      <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">{category.group?.name || 'Category'}</span>
                      <h4 className="text-xs font-black uppercase text-white leading-tight mt-0.5">{category.name}</h4>
                    </div>
                  </div>

                  <div className="mt-3 space-y-2">
                    {categoryNominees.map((nominee, index) => {
                      const isWinner = winners.some(
                        w => w.nominee_id === nominee.id && w.category_id === category.id
                      );
                      const isTopVoted = index === 0 && Number(nominee.votes_count || 0) > 0;

                      return (
                        <div
                          key={nominee.id}
                          className={`p-3 rounded-2xl flex items-center justify-between gap-3 border transition-all ${
                            isWinner
                              ? 'bg-emerald-500/10 border-emerald-500/20'
                              : isTopVoted
                              ? 'bg-[#D90429]/5 border-[#D90429]/20'
                              : 'bg-white/[0.01] border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {/* Rank or Trophy icon */}
                            <span className="text-[10px] font-black text-white/30 w-4">
                              {index + 1}
                            </span>
                            {/* Nominee Image */}
                            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                              {nominee.image_url ? (
                                <img src={nominee.image_url} className="w-full h-full object-cover" />
                              ) : (
                                <Users className="w-4 h-4 text-white/20" />
                              )}
                            </div>
                            <div className="truncate">
                              <p className="font-bold text-white text-xs truncate">{nominee.name}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[9px] text-[#D90429] font-black">{nominee.votes_count || 0} Votes</span>
                                {isTopVoted && (
                                  <span className="px-1.5 py-0.5 bg-[#D90429]/10 text-[#D90429] text-[7px] font-black uppercase rounded tracking-wider">Top Voted</span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Toggle winner button */}
                          <button
                            onClick={() => handleToggleWinner(nominee.id, category.id)}
                            title={isWinner ? 'Revoke Winner Status' : 'Declare as Winner'}
                            className={`p-1.5 border rounded-xl cursor-pointer transition-all ${
                              isWinner
                                ? 'bg-emerald-500 text-white border-emerald-500 hover:bg-emerald-600'
                                : isTopVoted
                                ? 'border-[#D90429] text-[#D90429] hover:bg-[#D90429] hover:text-white'
                                : 'border-white/10 text-white/40 hover:text-white hover:border-white/25'
                            }`}
                          >
                            <Trophy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}

                    {categoryNominees.length === 0 && (
                      <p className="text-[10px] text-white/25 italic py-2">No nominees in this category yet.</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: DECLARED WINNERS LIST */}
      <div className="space-y-4 pt-4 border-t border-white/5">
        <div className="flex justify-between items-center gap-4">
          <div>
            <h3 className="text-sm font-black uppercase text-white tracking-wider">TAPHE Declared Winners Registry</h3>
            <p className="text-[10px] text-white/35 mt-0.5">History and log of currently active declared winners.</p>
          </div>
          <button 
            onClick={() => {
              const firstCat = categories[0]?.id || '';
              const firstCatNominees = nominees.filter(n => n.category_id === firstCat);
              setWinnerForm({ nominee_id: firstCatNominees[0]?.id || '', category_id: firstCat, year: '2026' });
              setShowWinnerModal(true);
            }}
            className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" /> Manual Declare
          </button>
        </div>

        {loadingWinners ? (
          <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#D90429]" /></div>
        ) : (
          <div className="bg-[#0b0b0b] border border-white/5 rounded-3xl overflow-hidden">
            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
              <h4 className="text-xs font-black uppercase text-white/40 tracking-wider">Declared Winners</h4>
              {renderPageSizeSelector('winners')}
            </div>
            <table className="w-full text-left text-xs font-light">
              <thead>
                <tr className="bg-white/[0.01] border-b border-white/5 text-[9px] font-black uppercase tracking-wider text-white/40">
                  <th className="p-4 pl-6">Year</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Winner Nominee</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {getPaginatedItems(winners, 'winners').map(w => (
                  <tr key={w.id} className="hover:bg-white/[0.01]">
                    <td className="p-4 pl-6 font-mono font-black text-[#D90429]">{w.year}</td>
                    <td className="p-4 font-bold text-white">{w.category?.name || 'N/A'}</td>
                    <td className="p-4 font-bold text-white/80">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                          {w.nominee?.image_url ? (
                            <img src={w.nominee.image_url} className="w-full h-full object-cover" />
                          ) : (
                            <Users className="w-3.5 h-3.5 text-white/30" />
                          )}
                        </div>
                        <span>{w.nominee?.name || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <button
                        onClick={() => handleDeleteWinner(w.id)}
                        className="p-1.5 border border-white/10 hover:bg-[#D90429]/20 rounded-lg text-[#D90429] cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
                {winners.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-white/30">No winners declared yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
            {renderPagination('winners', winners.length)}
          </div>
        )}
      </div>

      {/* DECLARE WINNER MODAL */}
      {showWinnerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0b0b0b] border border-white/10 rounded-[32px] p-8 space-y-6 text-left">
            <h4 className="text-sm font-black uppercase tracking-wider text-[#D90429]">Declare Season Winner</h4>
            <form onSubmit={handleSaveWinner} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase text-white/45">Season Year</label>
                <input 
                  type="text" 
                  required 
                  value={winnerForm.year} 
                  onChange={(e) => setWinnerForm({ ...winnerForm, year: e.target.value })} 
                  className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white outline-none focus:border-[#D90429]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase text-white/45">Category</label>
                <select 
                  value={winnerForm.category_id} 
                  onChange={(e) => handleCategoryChange(e.target.value)} 
                  className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white outline-none focus:border-[#D90429]"
                >
                  <option value="">— Select Category —</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase text-white/45">Winner Nominee</label>
                <select 
                  value={winnerForm.nominee_id} 
                  onChange={(e) => setWinnerForm({ ...winnerForm, nominee_id: e.target.value })} 
                  className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white outline-none focus:border-[#D90429]"
                >
                  <option value="">— Select Nominee —</option>
                  {filteredNomineesForSelectedCategory.map(n => (
                    <option key={n.id} value={n.id}>{n.name}</option>
                  ))}
                </select>
                {filteredNomineesForSelectedCategory.length === 0 && winnerForm.category_id && (
                  <p className="text-[9px] text-[#D90429] mt-1 font-bold uppercase">No nominees in this category!</p>
                )}
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-grow py-3 bg-[#D90429] text-[10px] font-black uppercase tracking-widest rounded-2xl cursor-pointer text-white">Declare Winner</button>
                <button type="button" onClick={() => setShowWinnerModal(false)} className="px-5 py-3 border border-white/10 hover:bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest cursor-pointer text-white">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
