import React, { useState } from 'react';
import adminApi from '../Utils/adminApi';
import { 
  Plus, Edit2, Trash2, Search, Loader2, FolderOpen, List 
} from 'lucide-react';

interface CategoriesModuleProps {
  groups: any[];
  loadingGroups: boolean;
  fetchGroups: () => void;
  categories: any[];
  loadingCategories: boolean;
  fetchCategories: () => void;
  getPaginatedItems: (items: any[], key: string) => any[];
  renderPageSizeSelector: (key: string) => React.ReactNode;
  renderPagination: (key: string, total: number) => React.ReactNode;
  handleExportCategories: (format: 'csv' | 'excel' | 'pdf') => void;
  setErrorMsg: (msg: string) => void;
  setSuccessMsg: (msg: string) => void;
}

export default function CategoriesModule({
  groups,
  loadingGroups,
  fetchGroups,
  categories,
  loadingCategories,
  fetchCategories,
  getPaginatedItems,
  renderPageSizeSelector,
  renderPagination,
  handleExportCategories,
  setErrorMsg,
  setSuccessMsg
}: CategoriesModuleProps) {
  const [categorySubTab, setCategorySubTab] = useState<'groups' | 'categories'>('categories');
  const [categorySearch, setCategorySearch] = useState('');
  
  // Group Form States
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [groupForm, setGroupForm] = useState({ id: '', name: '', description: '', status: 'active' });

  // Category Form States
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryForm, setCategoryForm] = useState({ 
    id: '', name: '', description: '', category_group_id: '', status: 'active', voting_enabled: true, nomination_fee: '0' 
  });

  const handleSaveGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    try {
      if (groupForm.id) {
        await adminApi.put(`/api/v1/admin/crud/groups/${groupForm.id}`, groupForm);
        setSuccessMsg('Kundi Kuu limesasishwa kikamilifu.');
      } else {
        await adminApi.post('/api/v1/admin/crud/groups', groupForm);
        setSuccessMsg('Kundi Kuu jipya limeundwa kikamilifu.');
      }
      setShowGroupModal(false);
      fetchGroups();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Imeshindwa kuhifadhi Kundi.');
    }
  };

  const handleDeleteGroup = async (id: string) => {
    if (!window.confirm('Je, una uhakika unataka kufuta kundi hili? Kategoria zote ndani yake zitaathiriwa.')) return;
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await adminApi.delete(`/api/v1/admin/crud/groups/${id}`);
      setSuccessMsg('Kundi Kuu limefutwa.');
      fetchGroups();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Imeshindwa kufuta Kundi.');
    }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    try {
      if (categoryForm.id) {
        await adminApi.put(`/api/v1/admin/crud/categories/${categoryForm.id}`, categoryForm);
        setSuccessMsg('Kategoria imesasishwa kikamilifu.');
      } else {
        await adminApi.post('/api/v1/admin/crud/categories', categoryForm);
        setSuccessMsg('Kategoria mpya imeundwa kikamilifu.');
      }
      setShowCategoryModal(false);
      fetchCategories();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Imeshindwa kuhifadhi kategoria.');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm('Je, una uhakika unataka kufuta kategoria hii?')) return;
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await adminApi.delete(`/api/v1/admin/crud/categories/${id}`);
      setSuccessMsg('Kategoria imefutwa.');
      fetchCategories();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Imeshindwa kufuta kategoria.');
    }
  };

  const handleToggleCategoryStatus = async (id: string) => {
    try {
      const response = await adminApi.post(`/api/v1/admin/crud/categories/${id}/toggle-status`);
      setSuccessMsg(response.data.message);
      fetchCategories();
    } catch {
      setErrorMsg('Imeshindwa kubadilisha hali ya kategoria.');
    }
  };

  // Filtration
  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(categorySearch.toLowerCase()) || 
    (c.group?.name || '').toLowerCase().includes(categorySearch.toLowerCase())
  );

  const filteredGroups = groups.filter(g => 
    g.name.toLowerCase().includes(categorySearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Category sub-tab controllers */}
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <div className="flex gap-4">
          <button
            onClick={() => { setCategorySubTab('categories'); setCategorySearch(''); }}
            className={`px-4 py-2 text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 border-b-2 ${
              categorySubTab === 'categories' ? 'border-[#D90429] text-[#D90429]' : 'border-transparent text-white/40 hover:text-white'
            }`}
          >
            <List className="w-3.5 h-3.5" /> Award Categories
          </button>
          <button
            onClick={() => { setCategorySubTab('groups'); setCategorySearch(''); }}
            className={`px-4 py-2 text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 border-b-2 ${
              categorySubTab === 'groups' ? 'border-[#D90429] text-[#D90429]' : 'border-transparent text-white/40 hover:text-white'
            }`}
          >
            <FolderOpen className="w-3.5 h-3.5" /> Category Groups
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center gap-4">
        <div className="flex items-center gap-4 flex-grow max-w-lg">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder={categorySubTab === 'categories' ? 'Search categories...' : 'Search category groups...'}
              value={categorySearch}
              onChange={(e) => setCategorySearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#0b0b0b] border border-white/10 rounded-xl text-xs text-white focus:border-[#D90429] outline-none"
            />
          </div>

          {categorySubTab === 'categories' && (
            <div className="flex gap-1 shrink-0">
              <button
                onClick={() => handleExportCategories('csv')}
                className="px-2.5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl cursor-pointer"
              >
                CSV
              </button>
              <button
                onClick={() => handleExportCategories('excel')}
                className="px-2.5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl cursor-pointer"
              >
                EXCEL
              </button>
              <button
                onClick={() => handleExportCategories('pdf')}
                className="px-2.5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl cursor-pointer"
              >
                PDF
              </button>
            </div>
          )}
        </div>

        {categorySubTab === 'categories' ? (
          <button 
            onClick={() => {
              setCategoryForm({ id: '', name: '', description: '', category_group_id: groups[0]?.id || '', status: 'active', voting_enabled: true, nomination_fee: '0' });
              setShowCategoryModal(true);
            }}
            className="px-4 py-2.5 bg-[#D90429] hover:bg-[#B00020] text-white text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" /> Add Category
          </button>
        ) : (
          <button 
            onClick={() => {
              setGroupForm({ id: '', name: '', description: '', status: 'active' });
              setShowGroupModal(true);
            }}
            className="px-4 py-2.5 bg-[#D90429] hover:bg-[#B00020] text-white text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" /> Add Group
          </button>
        )}
      </div>

      {categorySubTab === 'groups' ? (
        loadingGroups ? (
          <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#D90429]" /></div>
        ) : (
          <div className="bg-[#0b0b0b] border border-white/5 rounded-3xl overflow-hidden">
            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
              <h4 className="text-xs font-black uppercase text-white/40 tracking-wider">Category Groups</h4>
              {renderPageSizeSelector('groups')}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-light">
                <thead>
                  <tr className="bg-white/[0.01] border-b border-white/5 text-[9px] font-black uppercase tracking-wider text-white/40">
                    <th className="p-4 pl-6">Group Name</th>
                    <th className="p-4">Description</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {getPaginatedItems(filteredGroups, 'groups').map(g => (
                    <tr key={g.id} className="hover:bg-white/[0.01]">
                      <td className="p-4 pl-6 font-bold text-white">{g.name}</td>
                      <td className="p-4 text-white/60 truncate max-w-xs">{g.description || 'N/A'}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${g.status === 'active' ? 'bg-green-500/10 text-green-500 border-green-500/15' : 'bg-white/5 text-white/40 border-white/5'}`}>
                          {g.status}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right space-x-2">
                        <button
                          onClick={() => { setGroupForm({ id: g.id, name: g.name, description: g.description || '', status: g.status }); setShowGroupModal(true); }}
                          className="p-1.5 border border-white/10 hover:bg-white/5 rounded-lg text-white/60 hover:text-white cursor-pointer"
                        ><Edit2 className="w-3.5 h-3.5" /></button>
                        <button
                          onClick={() => handleDeleteGroup(g.id)}
                          className="p-1.5 border border-white/10 hover:bg-[#D90429]/20 rounded-lg text-[#D90429] cursor-pointer"
                        ><Trash2 className="w-3.5 h-3.5" /></button>
                      </td>
                    </tr>
                  ))}
                  {filteredGroups.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-white/30">Hakuna makundi yaliyopatikana.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {renderPagination('groups', filteredGroups.length)}
          </div>
        )
      ) : (
        loadingCategories ? (
          <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#D90429]" /></div>
        ) : (
          <div className="bg-[#0b0b0b] border border-white/5 rounded-3xl overflow-hidden">
            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
              <h4 className="text-xs font-black uppercase text-white/40 tracking-wider">Award Categories</h4>
              {renderPageSizeSelector('categories')}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-light">
                <thead>
                  <tr className="bg-white/[0.01] border-b border-white/5 text-[9px] font-black uppercase tracking-wider text-white/40">
                    <th className="p-4 pl-6">Category Name</th>
                    <th className="p-4">Parent Group</th>
                    <th className="p-4">Nomination Fee</th>
                    <th className="p-4">Voting</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {getPaginatedItems(filteredCategories, 'categories').map(c => (
                    <tr key={c.id} className="hover:bg-white/[0.01]">
                      <td className="p-4 pl-6 font-bold text-white">{c.name}</td>
                      <td className="p-4 text-white/60">{c.group?.name || c.group_name || 'N/A'}</td>
                      <td className="p-4 font-mono font-black text-white/80">
                        {c.nomination_fee > 0 ? `${Number(c.nomination_fee).toLocaleString()} TZS` : 'Free'}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase border ${
                          c.voting_enabled 
                            ? 'bg-green-500/10 border-green-500/15 text-green-500' 
                            : 'bg-[#D90429]/10 border-[#D90429]/15 text-[#D90429]'
                        }`}>
                          {c.voting_enabled ? 'Open' : 'Closed'}
                        </span>
                      </td>
                      <td className="p-4">
                        <button 
                          onClick={() => handleToggleCategoryStatus(c.id)}
                          className={`px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase border cursor-pointer transition-all ${
                            c.status === 'active' 
                              ? 'bg-green-500/10 border-green-500/15 text-green-500 hover:bg-green-500/20' 
                              : 'bg-[#D90429]/10 border-[#D90429]/15 text-[#D90429] hover:bg-[#D90429]/20'
                          }`}
                        >
                          {c.status}
                        </button>
                      </td>
                      <td className="p-4 pr-6 text-right space-x-2">
                        <button
                          onClick={() => { setCategoryForm({ id: c.id, name: c.name, description: c.description || '', category_group_id: c.category_group_id || '', status: c.status, voting_enabled: !!c.voting_enabled, nomination_fee: String(c.nomination_fee) }); setShowCategoryModal(true); }}
                          className="p-1.5 border border-white/10 hover:bg-white/5 rounded-lg text-white/60 hover:text-white cursor-pointer"
                        ><Edit2 className="w-3.5 h-3.5" /></button>
                        <button
                          onClick={() => handleDeleteCategory(c.id)}
                          className="p-1.5 border border-white/10 hover:bg-[#D90429]/20 rounded-lg text-[#D90429] cursor-pointer"
                        ><Trash2 className="w-3.5 h-3.5" /></button>
                      </td>
                    </tr>
                  ))}
                  {filteredCategories.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-white/30">Hakuna kategoria zilizopatikana.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {renderPagination('categories', filteredCategories.length)}
          </div>
        )
      )}

      {/* CATEGORY DIALOG MODAL */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0b0b0b] border border-white/10 rounded-[32px] p-8 space-y-6 text-left">
            <h4 className="text-sm font-black uppercase tracking-wider text-[#D90429]">{categoryForm.id ? 'Edit' : 'New'} Award Category</h4>
            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase text-white/45">Category Name</label>
                <input type="text" required value={categoryForm.name} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white outline-none focus:border-[#D90429]" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase text-white/45">Description</label>
                <textarea value={categoryForm.description} onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })} className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white outline-none focus:border-[#D90429] h-20 resize-none" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase text-white/45">Category Group <span className="text-[#D90429]">*</span></label>
                <select required value={categoryForm.category_group_id} onChange={(e) => setCategoryForm({ ...categoryForm, category_group_id: e.target.value })} className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white outline-none focus:border-[#D90429]">
                  <option value="">— Select a Category Group —</option>
                  {groups.map(g => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase text-white/45">Status</label>
                  <select value={categoryForm.status} onChange={(e) => setCategoryForm({ ...categoryForm, status: e.target.value })} className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white outline-none">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase text-white/45">Voting</label>
                  <select value={categoryForm.voting_enabled ? '1' : '0'} onChange={(e) => setCategoryForm({ ...categoryForm, voting_enabled: e.target.value === '1' })} className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white outline-none">
                    <option value="1">Enabled</option>
                    <option value="0">Disabled</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase text-white/45">Nomination Fee (TZS)</label>
                <input type="number" required value={categoryForm.nomination_fee} onChange={(e) => setCategoryForm({ ...categoryForm, nomination_fee: e.target.value })} className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white outline-none focus:border-[#D90429]" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-grow py-3 bg-[#D90429] text-[10px] font-black uppercase tracking-widest rounded-2xl cursor-pointer">Save Category</button>
                <button type="button" onClick={() => setShowCategoryModal(false)} className="px-5 py-3 border border-white/10 hover:bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest cursor-pointer">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CATEGORY GROUP DIALOG MODAL */}
      {showGroupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0b0b0b] border border-white/10 rounded-[32px] p-8 space-y-6 text-left">
            <h4 className="text-sm font-black uppercase tracking-wider text-[#D90429]">{groupForm.id ? 'Edit' : 'New'} Category Group</h4>
            <form onSubmit={handleSaveGroup} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase text-white/45">Group Name <span className="text-[#D90429]">*</span></label>
                <input type="text" required value={groupForm.name} onChange={(e) => setGroupForm({ ...groupForm, name: e.target.value })} className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white outline-none focus:border-[#D90429]" placeholder="e.g. Clinical Excellence" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase text-white/45">Description</label>
                <textarea value={groupForm.description} onChange={(e) => setGroupForm({ ...groupForm, description: e.target.value })} className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white outline-none h-20 resize-none" placeholder="Brief description of this category group..." />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase text-white/45">Status</label>
                <select value={groupForm.status} onChange={(e) => setGroupForm({ ...groupForm, status: e.target.value })} className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white outline-none">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-grow py-3 bg-[#D90429] text-[10px] font-black uppercase tracking-widest rounded-2xl cursor-pointer">Save Group</button>
                <button type="button" onClick={() => setShowGroupModal(false)} className="px-5 py-3 border border-white/10 hover:bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest cursor-pointer">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
