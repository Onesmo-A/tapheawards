import React, { useState } from 'react';
import adminApi from '../Utils/adminApi';
import { 
  Plus, Edit2, Trash2, Search, Loader2, Users 
} from 'lucide-react';

interface NomineesModuleProps {
  nominees: any[];
  categories: any[];
  loadingNominees: boolean;
  fetchNominees: () => void;
  getPaginatedItems: (items: any[], key: string) => any[];
  renderPageSizeSelector: (key: string) => React.ReactNode;
  renderPagination: (key: string, total: number) => React.ReactNode;
  handleExportNominees: (format: 'csv' | 'excel' | 'pdf') => void;
  setErrorMsg: (msg: string) => void;
  setSuccessMsg: (msg: string) => void;
}

export default function NomineesModule({
  nominees,
  categories,
  loadingNominees,
  fetchNominees,
  getPaginatedItems,
  renderPageSizeSelector,
  renderPagination,
  handleExportNominees,
  setErrorMsg,
  setSuccessMsg
}: NomineesModuleProps) {
  const [nomineeSearch, setNomineeSearch] = useState('');
  
  // Nominee Form States
  const [showNomineeModal, setShowNomineeModal] = useState(false);
  const [nomineeForm, setNomineeForm] = useState({ 
    id: '', name: '', category_id: '', bio: '', facebook_url: '', instagram_url: '', tiktok_url: '', is_suspended: false, image_url: '' 
  });
  const [nomineeImageFile, setNomineeImageFile] = useState<File | null>(null);

  const handleSaveNominee = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const formData = new FormData();
      formData.append('name', nomineeForm.name);
      formData.append('category_id', nomineeForm.category_id);
      formData.append('bio', nomineeForm.bio || '');
      formData.append('facebook_url', nomineeForm.facebook_url || '');
      formData.append('instagram_url', nomineeForm.instagram_url || '');
      formData.append('tiktok_url', nomineeForm.tiktok_url || '');
      formData.append('is_suspended', nomineeForm.is_suspended ? '1' : '0');
      if (nomineeImageFile) {
        formData.append('image', nomineeImageFile);
      }

      if (nomineeForm.id) {
        formData.append('_method', 'PUT');
        await adminApi.post(`/api/v1/admin/crud/nominees/${nomineeForm.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setSuccessMsg('Mgombea amesasishwa.');
      } else {
        await adminApi.post('/api/v1/admin/crud/nominees', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setSuccessMsg('Mgombea mpya amesajiliwa.');
      }
      setShowNomineeModal(false);
      setNomineeImageFile(null);
      fetchNominees();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Imeshindwa kuhifadhi taarifa.');
    }
  };

  const handleDeleteNominee = async (id: string) => {
    if (!window.confirm('Je, una uhakika unataka kumfuta mgombea huyu?')) return;
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await adminApi.delete(`/api/v1/admin/crud/nominees/${id}`);
      setSuccessMsg('Mgombea amefutwa.');
      fetchNominees();
    } catch {
      setErrorMsg('Imeshindwa kumfuta mgombea.');
    }
  };

  const handleToggleNomineeSuspension = async (id: string) => {
    try {
      const response = await adminApi.post(`/api/v1/admin/crud/nominees/${id}/toggle-suspension`);
      setSuccessMsg(response.data.message);
      fetchNominees();
    } catch {
      setErrorMsg('Imeshindwa kubadilisha hali ya mgombea.');
    }
  };

  // Filtration
  const filteredNominees = nominees.filter(n => 
    n.name.toLowerCase().includes(nomineeSearch.toLowerCase()) || 
    (n.category?.name || '').toLowerCase().includes(nomineeSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-4">
        <div className="flex items-center gap-4 flex-grow max-w-md">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Search nominee directory..."
              value={nomineeSearch}
              onChange={(e) => setNomineeSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#0b0b0b] border border-white/10 rounded-xl text-xs text-white focus:border-[#D90429] outline-none"
            />
          </div>
          <div className="flex gap-1 shrink-0">
            <button
              onClick={() => handleExportNominees('csv')}
              className="px-2.5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl cursor-pointer"
            >
              CSV
            </button>
            <button
              onClick={() => handleExportNominees('excel')}
              className="px-2.5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl cursor-pointer"
            >
              EXCEL
            </button>
            <button
              onClick={() => handleExportNominees('pdf')}
              className="px-2.5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl cursor-pointer"
            >
              PDF
            </button>
          </div>
        </div>
        <button 
          onClick={() => {
            setNomineeForm({ id: '', name: '', category_id: categories[0]?.id || '', bio: '', facebook_url: '', instagram_url: '', tiktok_url: '', is_suspended: false, image_url: '' });
            setNomineeImageFile(null);
            setShowNomineeModal(true);
          }}
          className="px-4 py-2.5 bg-[#D90429] hover:bg-[#B00020] text-white text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" /> Add Nominee
        </button>
      </div>

      {loadingNominees ? (
        <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#D90429]" /></div>
      ) : (
        <div className="bg-[#0b0b0b] border border-white/5 rounded-3xl overflow-hidden">
          <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
            <h4 className="text-xs font-black uppercase text-white/40 tracking-wider">Nominees Profiles</h4>
            {renderPageSizeSelector('nominees')}
          </div>
          <table className="w-full text-left text-xs font-light">
            <thead>
              <tr className="bg-white/[0.01] border-b border-white/5 text-[9px] font-black uppercase tracking-wider text-white/40">
                <th className="p-4 pl-6">Nominee Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Suspended Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {getPaginatedItems(filteredNominees, 'nominees').map(n => (
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
                  <td className="p-4 text-white/60">{n.category?.name || 'N/A'}</td>
                  <td className="p-4">
                    <button 
                      onClick={() => handleToggleNomineeSuspension(n.id)}
                      className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border cursor-pointer transition-all ${
                        n.is_suspended 
                          ? 'bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500/20' 
                          : 'bg-green-500/10 border-green-500/20 text-green-500 hover:bg-green-500/20'
                      }`}
                    >
                      {n.is_suspended ? 'Deactivated' : 'Active'}
                    </button>
                  </td>
                  <td className="p-4 pr-6 text-right space-x-2">
                    <button onClick={() => { setNomineeForm({ id: n.id, name: n.name, category_id: n.category_id, bio: n.bio || '', facebook_url: n.facebook_url || '', instagram_url: n.instagram_url || '', tiktok_url: n.tiktok_url || '', is_suspended: !!n.is_suspended, image_url: n.image_url || '' }); setNomineeImageFile(null); setShowNomineeModal(true); }} className="p-1.5 border border-white/10 hover:bg-white/5 rounded-lg text-white/60 hover:text-white cursor-pointer"><Edit2 className="w-3.5 h-3.5" /></button>
                    <button onClick={() => handleDeleteNominee(n.id)} className="p-1.5 border border-white/10 hover:bg-[#D90429]/20 rounded-lg text-[#D90429] cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
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
          {renderPagination('nominees', filteredNominees.length)}
        </div>
      )}

      {/* NOMINEE DIALOG MODAL */}
      {showNomineeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0b0b0b] border border-white/10 rounded-[32px] p-8 space-y-6 text-left">
            <h4 className="text-sm font-black uppercase tracking-wider text-[#D90429]">Nominee Details</h4>
            <form onSubmit={handleSaveNominee} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase text-white/45">Candidate Full Name</label>
                <input type="text" required value={nomineeForm.name} onChange={(e) => setNomineeForm({ ...nomineeForm, name: e.target.value })} className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white outline-none focus:border-[#D90429]" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase text-white/45">Award Category</label>
                <select value={nomineeForm.category_id} onChange={(e) => setNomineeForm({ ...nomineeForm, category_id: e.target.value })} className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white outline-none">
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase text-white/45">Status</label>
                <select 
                  value={nomineeForm.is_suspended ? 'suspended' : 'active'} 
                  onChange={(e) => setNomineeForm({ ...nomineeForm, is_suspended: e.target.value === 'suspended' })} 
                  className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white outline-none"
                >
                  <option value="active">Active (Ruhusu Kupigiwa Kura)</option>
                  <option value="suspended">Suspended (Zuia Kupigiwa Kura)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase text-white/45">Nominee Image</label>
                <div className="flex items-center gap-3">
                  {nomineeForm.image_url && (
                    <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                      <img src={nomineeForm.image_url} alt={nomineeForm.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setNomineeImageFile(e.target.files ? e.target.files[0] : null)}
                    className="w-full text-xs text-white/60 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-white/5 file:text-white hover:file:bg-white/10 cursor-pointer"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase text-white/45">Biography</label>
                <textarea value={nomineeForm.bio} onChange={(e) => setNomineeForm({ ...nomineeForm, bio: e.target.value })} className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white outline-none focus:border-[#D90429] h-20 resize-none" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase text-white/45">Social Links</label>
                <div className="space-y-2">
                  <input type="text" placeholder="Facebook URL" value={nomineeForm.facebook_url} onChange={(e) => setNomineeForm({ ...nomineeForm, facebook_url: e.target.value })} className="w-full px-4 py-1.5 bg-black/40 border border-white/10 rounded-lg text-xs outline-none" />
                  <input type="text" placeholder="Instagram URL" value={nomineeForm.instagram_url} onChange={(e) => setNomineeForm({ ...nomineeForm, instagram_url: e.target.value })} className="w-full px-4 py-1.5 bg-black/40 border border-white/10 rounded-lg text-xs outline-none" />
                  <input type="text" placeholder="TikTok URL" value={nomineeForm.tiktok_url} onChange={(e) => setNomineeForm({ ...nomineeForm, tiktok_url: e.target.value })} className="w-full px-4 py-1.5 bg-black/40 border border-white/10 rounded-lg text-xs outline-none" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-grow py-3 bg-[#D90429] text-[10px] font-black uppercase tracking-widest rounded-2xl cursor-pointer">Save Nominee</button>
                <button type="button" onClick={() => setShowNomineeModal(false)} className="px-5 py-3 border border-white/10 hover:bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest cursor-pointer">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
