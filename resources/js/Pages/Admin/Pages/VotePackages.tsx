import React, { useEffect, useState } from 'react';
import adminApi from '../Utils/adminApi';
import { useAdminPagination } from '../Utils/useAdminPagination';
import { Plus, Edit2, Trash2, Loader2, Award, Check, ArrowLeft, ShieldAlert, Sparkles } from 'lucide-react';

interface VotePackage {
  id: string;
  votes: number;
  price: number;
  label: string;
  sub: string | null;
  is_active: boolean;
  sort_order: number;
}

export default function VotePackages() {
  const [packages, setPackages] = useState<VotePackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Page view state: 'list' | 'create' | 'edit'
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list');

  // Form state
  const [form, setForm] = useState({
    id: '',
    votes: 0,
    price: 0,
    label: '',
    sub: '',
    is_active: true,
    sort_order: 0,
  });

  const {
    getPaginatedItems,
    renderPageSizeSelector,
    renderPagination
  } = useAdminPagination();

  const fetchPackages = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const response = await adminApi.get('/api/v1/admin/crud/vote-packages');
      if (response.data.status === 'success') {
        setPackages(response.data.packages || []);
      }
    } catch (err: any) {
      setErrorMsg('Failed to load voting packages.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleOpenCreatePage = () => {
    setForm({
      id: '',
      votes: 1,
      price: 500,
      label: '1 Vote',
      sub: '',
      is_active: true,
      sort_order: packages.length + 1,
    });
    setErrorMsg('');
    setSuccessMsg('');
    setView('create');
  };

  const handleOpenEditPage = (pkg: VotePackage) => {
    setForm({
      id: pkg.id,
      votes: pkg.votes,
      price: pkg.price,
      label: pkg.label,
      sub: pkg.sub || '',
      is_active: pkg.is_active,
      sort_order: pkg.sort_order,
    });
    setErrorMsg('');
    setSuccessMsg('');
    setView('edit');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (form.id) {
        // Update
        const response = await adminApi.put(`/api/v1/admin/crud/vote-packages/${form.id}`, form);
        if (response.data.status === 'success') {
          setSuccessMsg('Package updated successfully.');
          setView('list');
          fetchPackages();
        }
      } else {
        // Create
        const response = await adminApi.post('/api/v1/admin/crud/vote-packages', form);
        if (response.data.status === 'success') {
          setSuccessMsg('New package created successfully.');
          setView('list');
          fetchPackages();
        }
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to save package.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this vote package? Users will no longer be able to select it.')) return;
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const response = await adminApi.delete(`/api/v1/admin/crud/vote-packages/${id}`);
      if (response.data.status === 'success') {
        setSuccessMsg('Package deleted successfully.');
        fetchPackages();
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to delete this package.');
    }
  };

  const paginatedPackages = getPaginatedItems(packages, 'packages');

  return (
    <div className="space-y-6">
      {/* Messages */}
      {errorMsg && (
        <div className="p-4 bg-[#D90429]/10 border border-[#D90429]/20 text-[#D90429] text-[11px] font-bold uppercase rounded-2xl text-center tracking-wider">
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-500 text-[11px] font-bold uppercase rounded-2xl text-center tracking-wider">
          {successMsg}
        </div>
      )}

      {view === 'list' ? (
        /* LIST VIEW */
        <div className="bg-[#0b0b0b] border border-white/5 rounded-3xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
            <div>
              <h3 className="text-base font-black font-outfit uppercase text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-[#D90429]" />
                <span>Vote Packages</span>
              </h3>
              <p className="text-xs text-white/40 mt-0.5">Configure price and number of votes for each paid package.</p>
            </div>

            <button
              onClick={handleOpenCreatePage}
              className="self-start sm:self-auto px-4 py-2.5 bg-[#D90429] hover:bg-[#B00020] text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-[#D90429]/15 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Package</span>
            </button>
          </div>

          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 text-[#D90429] animate-spin" />
              <span className="text-xs font-bold uppercase text-white/40 tracking-widest">Loading...</span>
            </div>
          ) : packages.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-white/10 rounded-2xl">
              <ShieldAlert className="w-10 h-10 text-white/20 mx-auto mb-2" />
              <h4 className="text-xs font-black uppercase text-white">No Packages Found</h4>
              <p className="text-xs text-white/40 mt-1">Click "New Package" to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs text-white/40 border-b border-white/5 pb-2">
                <span>{packages.length} Packages total</span>
                {renderPageSizeSelector('packages')}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs font-light">
                  <thead>
                    <tr className="bg-white/[0.01] border-b border-white/5 text-[9px] font-black uppercase tracking-wider text-white/40">
                      <th className="py-3 px-4">Sort</th>
                      <th className="py-3 px-4">Label</th>
                      <th className="py-3 px-4">Votes Count</th>
                      <th className="py-3 px-4">Price (TZS)</th>
                      <th className="py-3 px-4">Subtext</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {paginatedPackages.map((pkg) => (
                      <tr key={pkg.id} className="hover:bg-white/[0.01] transition-colors">
                        <td className="py-3.5 px-4 font-bold text-white/40">#{pkg.sort_order}</td>
                        <td className="py-3.5 px-4 font-black text-white uppercase">{pkg.label}</td>
                        <td className="py-3.5 px-4 font-bold text-[#D90429]">{pkg.votes.toLocaleString()} Votes</td>
                        <td className="py-3.5 px-4 font-black text-slate-200">{pkg.price.toLocaleString()} TZS</td>
                        <td className="py-3.5 px-4 text-white/60">{pkg.sub || '-'}</td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                            pkg.is_active 
                              ? 'bg-green-500/10 text-green-500 border-green-500/15' 
                              : 'bg-white/5 text-white/40 border-white/5'
                          }`}>
                            {pkg.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => handleOpenEditPage(pkg)}
                              className="p-2 border border-white/10 hover:bg-white/5 rounded-xl text-white/60 hover:text-white transition-all cursor-pointer"
                              title="Edit Package"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(pkg.id)}
                              className="p-2 border border-white/10 hover:bg-red-500/10 rounded-xl text-white/60 hover:text-red-500 transition-all cursor-pointer"
                              title="Delete Package"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pt-4 border-t border-white/5">
                {renderPagination('packages', packages.length)}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* CREATE / EDIT FORM VIEW */
        <div className="bg-[#0b0b0b] border border-white/5 rounded-3xl p-6 shadow-sm max-w-xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
            <div className="text-left">
              <button
                onClick={() => setView('list')}
                className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-[#D90429] font-black hover:text-[#B00020] transition-colors mb-2 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Packages</span>
              </button>
              <h3 className="text-base font-black font-outfit uppercase text-white flex items-center gap-2 mt-1">
                <Sparkles className="w-5 h-5 text-[#D90429]" />
                <span>{view === 'edit' ? 'Edit Vote Package' : 'Create Vote Package'}</span>
              </h3>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-left">
              <div>
                <label className="block text-[9px] font-black uppercase text-white/40 mb-1.5">
                  Votes Count
                </label>
                <input
                  type="number"
                  min={1}
                  value={form.votes}
                  onChange={(e) => setForm({ ...form, votes: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-xs text-white outline-none focus:border-[#D90429] focus:ring-1 focus:ring-[#D90429]"
                  required
                />
              </div>
              <div>
                <label className="block text-[9px] font-black uppercase text-white/40 mb-1.5">
                  Price (TZS)
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-xs text-white outline-none focus:border-[#D90429] focus:ring-1 focus:ring-[#D90429]"
                  required
                />
              </div>
            </div>

            <div className="text-left">
              <label className="block text-[9px] font-black uppercase text-white/40 mb-1.5">
                Label
              </label>
              <input
                type="text"
                placeholder="e.g. 1 Vote or 15 Votes"
                value={form.label}
                onChange={(e) => setForm({ ...form, label: e.target.value })}
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-xs text-white outline-none focus:border-[#D90429] focus:ring-1 focus:ring-[#D90429]"
                required
              />
            </div>

            <div className="text-left">
              <label className="block text-[9px] font-black uppercase text-white/40 mb-1.5">
                Subtext Description
              </label>
              <input
                type="text"
                placeholder="e.g. Bronze Package or Single test vote"
                value={form.sub}
                onChange={(e) => setForm({ ...form, sub: e.target.value })}
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-xs text-white outline-none focus:border-[#D90429] focus:ring-1 focus:ring-[#D90429]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 text-left">
              <div>
                <label className="block text-[9px] font-black uppercase text-white/40 mb-1.5">
                  Sort Order
                </label>
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-xs text-white outline-none focus:border-[#D90429] focus:ring-1 focus:ring-[#D90429]"
                  required
                />
              </div>
              <div>
                <label className="block text-[9px] font-black uppercase text-white/40 mb-1.5">
                  Status
                </label>
                <div className="flex items-center h-[46px] border border-white/10 rounded-xl px-3 bg-black/40">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={form.is_active}
                    onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                    className="w-4 h-4 text-[#D90429] border-white/10 rounded bg-black/40 focus:ring-[#D90429]"
                  />
                  <label htmlFor="is_active" className="ml-2 text-xs font-bold text-white/60 select-none">
                    Active
                  </label>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setView('list')}
                className="px-6 py-3 border border-white/10 hover:bg-white/5 text-white/60 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-8 py-3 bg-[#D90429] hover:bg-[#B00020] text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {saving ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Save Package</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
