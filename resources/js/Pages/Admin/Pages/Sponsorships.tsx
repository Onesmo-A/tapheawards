import React, { useEffect, useState } from 'react';
import adminApi from '../Utils/adminApi';
import { useAdminPagination } from '../Utils/useAdminPagination';
import { 
  Loader2, Check, X, ShieldAlert, CheckCircle2, AlertTriangle, Clock, CreditCard, Eye, Mail, Phone, Award, Building, FileText, ArrowLeft, ArrowRight, Search, Download, Calendar, User, Edit2, Trash2, Plus, ArrowUp, ArrowDown, EyeOff
} from 'lucide-react';
import { downloadCSV, downloadExcel } from '../Utils/adminExports';

interface SponsorshipItem {
  id: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  tier: string;
  price: string;
  message: string;
  status: string;
  created_at: string;
}

interface PackageItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  price_formatted: string;
  description: string;
  benefits: string[];
  is_active: boolean;
  is_popular: boolean;
  sort_order: number;
}

export default function Sponsorships() {
  const [activeTab, setActiveTab] = useState<'leads' | 'packages'>('leads');
  const [inquiries, setInquiries] = useState<SponsorshipItem[]>([]);
  const [packages, setPackages] = useState<PackageItem[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [loadingPkgs, setLoadingPkgs] = useState(false);
  
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Leads Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Leads Details Modal
  const [selectedInquiry, setSelectedInquiry] = useState<SponsorshipItem | null>(null);

  // Packages Form Modal
  const [showPkgModal, setShowPkgModal] = useState(false);
  const [editingPkg, setEditingPkg] = useState<PackageItem | null>(null);
  
  const [pkgName, setPkgName] = useState('');
  const [pkgPrice, setPkgPrice] = useState(0);
  const [pkgPriceFormatted, setPkgPriceFormatted] = useState('');
  const [pkgDescription, setPkgDescription] = useState('');
  const [pkgBenefits, setPkgBenefits] = useState<string[]>([]);
  const [newBenefitInput, setNewBenefitInput] = useState('');
  const [pkgIsPopular, setPkgIsPopular] = useState(false);
  const [pkgSortOrder, setPkgSortOrder] = useState(0);
  const [pkgIsActive, setPkgIsActive] = useState(true);

  const {
    getPaginatedItems,
    renderPageSizeSelector,
    renderPagination
  } = useAdminPagination();

  const fetchInquiries = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const response = await adminApi.get('/api/v1/admin/activity/sponsorships');
      setInquiries(response.data.sponsorships || []);
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to load sponsorship inquiries.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPackages = async () => {
    setLoadingPkgs(true);
    setErrorMsg('');
    try {
      const response = await adminApi.get('/api/v1/admin/crud/sponsorship-packages');
      setPackages(response.data.packages || []);
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to load sponsorship packages.');
    } finally {
      setLoadingPkgs(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'leads') {
      fetchInquiries();
    } else {
      fetchPackages();
    }
  }, [activeTab]);

  const handleMarkContacted = async (id: string) => {
    if (!window.confirm('Je, una uhakika unataka kuweka alama kuwa mawasiliano yamefanyika?')) return;
    try {
      const response = await adminApi.post(`/api/v1/admin/activity/sponsorships/${id}/contacted`);
      setSuccessMsg(response.data.message);
      setSelectedInquiry(null);
      fetchInquiries();
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to update inquiry status.');
    }
  };

  // Toggle Visibility status
  const handleTogglePackageStatus = async (pkg: PackageItem) => {
    try {
      const response = await adminApi.post(`/api/v1/admin/crud/sponsorship-packages/${pkg.id}/toggle-status`);
      setSuccessMsg(response.data.message);
      fetchPackages();
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to toggle package visibility.');
    }
  };

  // Delete Package
  const handleDeletePackage = async (id: string) => {
    if (!window.confirm('Je, una uhakika unataka kufuta kifurushi hiki kabisa? Hatua hii hairejesheki.')) return;
    try {
      const response = await adminApi.delete(`/api/v1/admin/crud/sponsorship-packages/${id}`);
      setSuccessMsg(response.data.message);
      fetchPackages();
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to delete package.');
    }
  };

  // Open modal for package create
  const handleNewPackageClick = () => {
    setEditingPkg(null);
    setPkgName('');
    setPkgPrice(0);
    setPkgPriceFormatted('');
    setPkgDescription('');
    setPkgBenefits([]);
    setNewBenefitInput('');
    setPkgIsPopular(false);
    setPkgSortOrder(packages.length + 1);
    setPkgIsActive(true);
    setShowPkgModal(true);
  };

  // Open modal for package edit
  const handleEditPackageClick = (pkg: PackageItem) => {
    setEditingPkg(pkg);
    setPkgName(pkg.name);
    setPkgPrice(pkg.price);
    setPkgPriceFormatted(pkg.price_formatted);
    setPkgDescription(pkg.description);
    setPkgBenefits(pkg.benefits || []);
    setNewBenefitInput('');
    setPkgIsPopular(pkg.is_popular);
    setPkgSortOrder(pkg.sort_order);
    setPkgIsActive(pkg.is_active);
    setShowPkgModal(true);
  };

  // Add Benefit to list
  const handleAddBenefit = () => {
    if (newBenefitInput.trim()) {
      setPkgBenefits([...pkgBenefits, newBenefitInput.trim()]);
      setNewBenefitInput('');
    }
  };

  // Remove Benefit from list
  const handleRemoveBenefit = (idx: number) => {
    setPkgBenefits(pkgBenefits.filter((_, i) => i !== idx));
  };

  // Handle Save Package
  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pkgBenefits.length === 0) {
      alert('Tafadhali weka angalau faida/faida moja ya kifurushi (benefit).');
      return;
    }

    const payload = {
      name: pkgName,
      price: Number(pkgPrice),
      price_formatted: pkgPriceFormatted || `${Number(pkgPrice).toLocaleString()} TZS`,
      description: pkgDescription,
      benefits: pkgBenefits,
      is_popular: pkgIsPopular,
      sort_order: Number(pkgSortOrder),
      is_active: pkgIsActive
    };

    try {
      if (editingPkg) {
        await adminApi.put(`/api/v1/admin/crud/sponsorship-packages/${editingPkg.id}`, payload);
        setSuccessMsg('Kifurushi kimehifadhiwa vyema.');
      } else {
        await adminApi.post('/api/v1/admin/crud/sponsorship-packages', payload);
        setSuccessMsg('Kifurushi kipya kimesajiliwa vyema.');
      }
      setShowPkgModal(false);
      fetchPackages();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Imeshindwa kuhifadhi kifurushi.');
    }
  };

  const handleExport = (format: 'csv' | 'excel') => {
    const headers = ['Company Name', 'Contact Person', 'Email', 'Phone', 'Tier', 'Price Interest', 'Status', 'Message', 'Date'];
    const rows = filteredInquiries.map(item => [
      item.company_name,
      item.contact_name,
      item.email,
      item.phone,
      item.tier.toUpperCase(),
      item.price,
      item.status,
      item.message.replace(/\n/g, ' '),
      new Date(item.created_at).toLocaleDateString()
    ]);

    if (format === 'csv') {
      downloadCSV('sponsorship_inquiries_export.csv', headers, rows);
    } else {
      downloadExcel('sponsorship_inquiries_export.xls', headers, rows);
    }
  };

  // Filters logic for leads
  const filteredInquiries = inquiries.filter(item => {
    const matchesSearch = 
      item.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.contact_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.phone.includes(searchQuery);

    const matchesTier = tierFilter === 'all' || item.tier.toLowerCase() === tierFilter.toLowerCase();
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

    return matchesSearch && matchesTier && matchesStatus;
  });

  // Calculate statistics
  const totalCount = inquiries.length;
  const newCount = inquiries.filter(i => i.status === 'new').length;
  const contactedCount = inquiries.filter(i => i.status === 'contacted').length;

  const totalValue = inquiries.reduce((sum, item) => {
    const numericStr = item.price.replace(/[^0-9]/g, '');
    const val = parseInt(numericStr, 10) || 0;
    return sum + val;
  }, 0);

  const tierBadges: Record<string, { label: string; classes: string }> = {
    platinum: { label: 'Platinum', classes: 'bg-white/10 border-white/20 text-white' },
    gold: { label: 'Gold', classes: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500' },
    silver: { label: 'Silver', classes: 'bg-slate-400/10 border-slate-400/20 text-slate-300' },
    'title-sponsor': { label: 'Title Sponsor', classes: 'bg-[#D90429]/10 border-[#D90429]/20 text-[#D90429]' },
    'category-sponsor': { label: 'Category Sponsor', classes: 'bg-green-500/10 border-green-500/20 text-green-400' },
    'support-sponsor': { label: 'Support Sponsor', classes: 'bg-purple-500/10 border-purple-500/20 text-purple-400' },
  };

  return (
    <div className="space-y-6">

      {/* TABS SELECTOR */}
      <div className="flex gap-1 bg-[#080506] p-1 border border-white/5 rounded-2xl w-fit">
        <button
          onClick={() => { setActiveTab('leads'); setErrorMsg(''); setSuccessMsg(''); }}
          className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'leads' ? 'bg-[#D90429] text-white shadow-lg' : 'text-white/40 hover:text-white'
          }`}
        >
          Leads & Inquiries
        </button>
        <button
          onClick={() => { setActiveTab('packages'); setErrorMsg(''); setSuccessMsg(''); }}
          className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'packages' ? 'bg-[#D90429] text-white shadow-lg' : 'text-white/40 hover:text-white'
          }`}
        >
          Sponsorship Packages
        </button>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-600/10 border border-red-500/20 text-red-400 text-[11px] font-bold uppercase rounded-xl text-center tracking-wider">
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-500 text-[11px] font-bold uppercase rounded-xl text-center tracking-wider">
          {successMsg}
        </div>
      )}

      {/* TAB CONTENT: LEADS & INQUIRIES */}
      {activeTab === 'leads' && (
        <>
          {/* STATS SUMMARY BOXES */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl border border-white/5 bg-white/[0.01] space-y-2">
              <span className="text-[9px] font-black uppercase text-white/30 tracking-wider block">Total Inquiries</span>
              <div className="text-xl font-black text-white">{totalCount}</div>
            </div>
            <div className="p-4 rounded-2xl border border-white/5 bg-white/[0.01] space-y-2 relative">
              <div className="absolute top-0 right-0 w-1.5 h-1.5 rounded-full bg-[#D90429] m-3 animate-pulse" />
              <span className="text-[9px] font-black uppercase text-white/30 tracking-wider block">New Inquiries</span>
              <div className="text-xl font-black text-[#D90429]">{newCount}</div>
            </div>
            <div className="p-4 rounded-2xl border border-white/5 bg-white/[0.01] space-y-2">
              <span className="text-[9px] font-black uppercase text-white/30 tracking-wider block">Contacted</span>
              <div className="text-xl font-black text-green-500">{contactedCount}</div>
            </div>
            <div className="p-4 rounded-2xl border border-white/5 bg-white/[0.01] space-y-2">
              <span className="text-[9px] font-black uppercase text-white/30 tracking-wider block">Projected Value</span>
              <div className="text-xl font-black text-[#D4A853]">{totalValue.toLocaleString()} TZS</div>
            </div>
          </div>

          {/* FILTER BAR */}
          <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 bg-white/[0.01] border border-white/5 p-4 rounded-2xl">
            <div className="flex flex-col sm:flex-row gap-3 flex-1 flex-wrap">
              <div className="relative flex-grow max-w-sm rounded-xl border border-white/5 bg-[#080506] focus-within:border-[#D90429]/40 transition-colors">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input
                  type="text"
                  placeholder="Search companies, contacts..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent py-2.5 pl-10 pr-4 text-xs text-white outline-none placeholder:text-white/20"
                />
              </div>

              <div className="rounded-xl border border-white/5 bg-[#080506] px-3 focus-within:border-[#D90429]/40 transition-colors flex items-center">
                <span className="text-[8px] font-black uppercase tracking-wider text-white/35 mr-2">Tier:</span>
                <select
                  value={tierFilter}
                  onChange={e => setTierFilter(e.target.value)}
                  className="bg-transparent text-xs text-white outline-none py-2 cursor-pointer border-none"
                >
                  <option value="all" className="bg-[#0c0809]">All Tiers</option>
                  <option value="title-sponsor" className="bg-[#0c0809]">Title Sponsor</option>
                  <option value="platinum" className="bg-[#0c0809]">Platinum</option>
                  <option value="gold" className="bg-[#0c0809]">Gold</option>
                  <option value="silver" className="bg-[#0c0809]">Silver</option>
                  <option value="category-sponsor" className="bg-[#0c0809]">Category Sponsor</option>
                  <option value="support-sponsor" className="bg-[#0c0809]">Support Sponsor</option>
                </select>
              </div>

              <div className="rounded-xl border border-white/5 bg-[#080506] px-3 focus-within:border-[#D90429]/40 transition-colors flex items-center">
                <span className="text-[8px] font-black uppercase tracking-wider text-white/35 mr-2">Status:</span>
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="bg-transparent text-xs text-white outline-none py-2 cursor-pointer border-none"
                >
                  <option value="all" className="bg-[#0c0809]">All Statuses</option>
                  <option value="new" className="bg-[#0c0809]">New Inquiries</option>
                  <option value="contacted" className="bg-[#0c0809]">Contacted</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={() => handleExport('csv')} className="px-4 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-[9px] font-black uppercase tracking-widest rounded-xl flex items-center gap-2 transition-all cursor-pointer"><Download className="w-3.5 h-3.5" /><span>CSV</span></button>
              <button onClick={() => handleExport('excel')} className="px-4 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-[9px] font-black uppercase tracking-widest rounded-xl flex items-center gap-2 transition-all cursor-pointer"><Download className="w-3.5 h-3.5" /><span>Excel</span></button>
            </div>
          </div>

          {/* LEADS TABLE */}
          {loading ? (
            <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#D90429]" /></div>
          ) : (
            <div className="bg-[#080506] border border-white/5 rounded-3xl overflow-hidden shadow-xl">
              <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                <h4 className="text-xs font-black uppercase text-white/40 tracking-wider">Corporate Leads</h4>
                {renderPageSizeSelector('admin-sponsorships')}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-light min-w-[700px]">
                  <thead>
                    <tr className="bg-white/[0.01] border-b border-white/5 text-[9px] font-black uppercase tracking-wider text-white/40">
                      <th className="p-4 pl-6">Company & Level</th>
                      <th className="p-4">Contact Details</th>
                      <th className="p-4">Price Bracket</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Submission Date</th>
                      <th className="p-4 pr-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {getPaginatedItems(filteredInquiries, 'admin-sponsorships').map(item => {
                      const badge = tierBadges[item.tier.toLowerCase()] || { label: item.tier, classes: 'bg-white/5 border-white/10 text-white/50' };
                      return (
                        <tr key={item.id} className="hover:bg-white/[0.01] transition-colors">
                          <td className="p-4 pl-6 font-bold text-white">
                            <div>{item.company_name}</div>
                            <span className={`inline-block px-2 py-0.5 mt-1 border rounded-full text-[7px] font-black uppercase tracking-wider ${badge.classes}`}>
                              {badge.label}
                            </span>
                          </td>
                          <td className="p-4 text-white/60">
                            <div className="font-semibold text-white/80">{item.contact_name}</div>
                            <div className="text-[10px] text-white/40 mt-0.5">{item.email} • {item.phone}</div>
                          </td>
                          <td className="p-4 text-[#D4A853] font-bold">
                            {item.price}
                          </td>
                          <td className="p-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase border ${
                              item.status === 'contacted'
                                ? 'bg-green-500/10 border-green-500/15 text-green-500'
                                : 'bg-orange-500/10 border-orange-500/15 text-orange-400'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="p-4 text-white/40 font-light">
                            {new Date(item.created_at).toLocaleDateString()}
                          </td>
                          <td className="p-4 pr-6 text-right">
                            <div className="inline-flex gap-2 justify-end items-center">
                              <button
                                onClick={() => setSelectedInquiry(item)}
                                className="px-2.5 py-1 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg text-white/70 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider cursor-pointer"
                              >
                                <Eye className="w-3 h-3 text-[#D90429]" />
                                <span>Details</span>
                              </button>
                              {item.status === 'new' && (
                                <button
                                  onClick={() => handleMarkContacted(item.id)}
                                  className="p-1.5 border border-white/10 hover:bg-green-500/25 rounded-lg text-green-500 cursor-pointer"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {filteredInquiries.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-10 text-center text-white/20 text-xs">No sponsorship inquiries match filters.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {renderPagination('admin-sponsorships', filteredInquiries.length)}
            </div>
          )}
        </>
      )}

      {/* TAB CONTENT: SPONSORSHIP PACKAGES */}
      {activeTab === 'packages' && (
        <>
          <div className="flex justify-between items-center bg-white/[0.01] border border-white/5 p-4 rounded-2xl">
            <div className="space-y-1 text-left">
              <h3 className="text-xs font-black uppercase text-white/50 tracking-wider">Packages Registry</h3>
              <p className="text-[10px] text-white/35">Manage corporate packages shown to partners on the Sponsors page.</p>
            </div>
            <button
              onClick={handleNewPackageClick}
              className="px-5 py-2.5 bg-[#D90429] hover:bg-[#B00020] text-white text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center gap-2 cursor-pointer transition-colors shadow-lg shadow-[#D90429]/15"
            >
              <Plus className="w-4 h-4" />
              <span>+ Create Package</span>
            </button>
          </div>

          {loadingPkgs ? (
            <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#D90429]" /></div>
          ) : (
            <div className="bg-[#080506] border border-white/5 rounded-3xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-light min-w-[700px]">
                  <thead>
                    <tr className="bg-white/[0.01] border-b border-white/5 text-[9px] font-black uppercase tracking-wider text-white/40">
                      <th className="p-4 pl-6">Order</th>
                      <th className="p-4">Package Name</th>
                      <th className="p-4">Pricing</th>
                      <th className="p-4">Benefits Count</th>
                      <th className="p-4">Popularity</th>
                      <th className="p-4">Visibility</th>
                      <th className="p-4 pr-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {packages.map(pkg => (
                      <tr key={pkg.id} className="hover:bg-white/[0.01] transition-colors">
                        <td className="p-4 pl-6 font-bold text-white/40">
                          #{pkg.sort_order}
                        </td>
                        <td className="p-4 font-bold text-white">
                          <div>{pkg.name}</div>
                          <div className="text-[10px] font-light text-white/45 truncate max-w-xs mt-0.5">{pkg.description}</div>
                        </td>
                        <td className="p-4">
                          <div className="font-semibold text-white">{pkg.price_formatted}</div>
                          <div className="text-[9px] text-white/35">Raw: {Number(pkg.price).toLocaleString()}</div>
                        </td>
                        <td className="p-4 text-white/60 font-semibold">
                          {(pkg.benefits || []).length} benefits listed
                        </td>
                        <td className="p-4">
                          {pkg.is_popular ? (
                            <span className="px-2 py-0.5 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[8px] font-black uppercase tracking-wider rounded-md">
                              Most Popular
                            </span>
                          ) : (
                            <span className="text-white/30 text-[9px]">Standard</span>
                          )}
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase border ${
                            pkg.is_active
                              ? 'bg-green-500/10 border-green-500/20 text-green-500'
                              : 'bg-white/5 border-white/10 text-white/30'
                          }`}>
                            {pkg.is_active ? 'Visible' : 'Hidden'}
                          </span>
                        </td>
                        <td className="p-4 pr-6 text-right">
                          <div className="inline-flex gap-2 justify-end items-center">
                            <button
                              onClick={() => handleTogglePackageStatus(pkg)}
                              className={`p-1.5 border rounded-lg cursor-pointer ${
                                pkg.is_active 
                                  ? 'border-white/5 hover:bg-white/10 text-white/60' 
                                  : 'border-[#D90429]/20 hover:bg-[#D90429]/10 text-[#D90429]'
                              }`}
                              title={pkg.is_active ? "Hide Package" : "Show Package"}
                            >
                              {pkg.is_active ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              onClick={() => handleEditPackageClick(pkg)}
                              className="p-1.5 border border-white/5 hover:bg-white/10 text-white/60 rounded-lg cursor-pointer"
                              title="Edit Package"
                            >
                              <Edit2 className="w-3.5 h-3.5 text-blue-400" />
                            </button>
                            <button
                              onClick={() => handleDeletePackage(pkg.id)}
                              className="p-1.5 border border-white/5 hover:bg-red-500/25 text-[#D90429] rounded-lg cursor-pointer"
                              title="Delete Package"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {packages.length === 0 && (
                      <tr>
                        <td colSpan={7} className="p-10 text-center text-white/20 text-xs">No sponsorship packages found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* DETAILS OVERLAY MODAL */}
      {selectedInquiry && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0c0809] border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative flex flex-col">
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase text-[#D90429] tracking-widest">Sponsorship Inquiry Details</span>
                <h3 className="text-sm font-black text-white uppercase tracking-wider">{selectedInquiry.company_name}</h3>
              </div>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="p-1.5 border border-white/10 hover:bg-white/5 rounded-full text-white/50 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-5 text-left text-xs font-light leading-relaxed text-white/70">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[8px] font-black uppercase text-white/30 block mb-1">Contact Name</span>
                  <span className="text-white font-semibold flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-[#D90429]" />{selectedInquiry.contact_name}</span>
                </div>
                <div>
                  <span className="text-[8px] font-black uppercase text-white/30 block mb-1">Phone Number</span>
                  <span className="text-white font-semibold flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-[#D90429]" />{selectedInquiry.phone}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[8px] font-black uppercase text-white/30 block mb-1">Email Address</span>
                  <span className="text-white font-semibold flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-[#D90429]" />{selectedInquiry.email}</span>
                </div>
                <div>
                  <span className="text-[8px] font-black uppercase text-white/30 block mb-1">Sponsorship Level</span>
                  <span className="text-white font-bold uppercase tracking-wider text-[10px]">{selectedInquiry.tier}</span>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-[8px] font-black uppercase text-[#D4A853] tracking-widest block mb-2">Inquiry Message</span>
                <p className="whitespace-pre-line text-white/80 leading-relaxed font-light text-[11px]">{selectedInquiry.message}</p>
              </div>
              <div className="flex justify-between items-center text-[10px] text-white/30">
                <span>Submitted Date: {new Date(selectedInquiry.created_at).toLocaleString()}</span>
                <span>Price Bracket: <strong className="text-[#D4A853] font-bold">{selectedInquiry.price}</strong></span>
              </div>
            </div>
            <div className="p-6 border-t border-white/5 flex justify-end gap-3 bg-white/[0.01]">
              <button
                onClick={() => setSelectedInquiry(null)}
                className="px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-[10px] font-black uppercase tracking-wider text-white"
              >
                Close
              </button>
              {selectedInquiry.status === 'new' && (
                <button
                  onClick={() => handleMarkContacted(selectedInquiry.id)}
                  className="px-5 py-2.5 rounded-xl bg-green-500/20 border border-green-500/20 hover:bg-green-500 text-green-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-wider cursor-pointer"
                >
                  Mark as Contacted
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT PACKAGE FORM MODAL */}
      {showPkgModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0c0809] border border-white/10 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl relative flex flex-col my-8 max-h-[90vh]">
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase text-[#D90429] tracking-widest">Sponsorship Packages Admin</span>
                <h3 className="text-sm font-black text-white uppercase tracking-wider">{editingPkg ? 'Edit Package Details' : 'Create Sponsorship Package'}</h3>
              </div>
              <button
                onClick={() => setShowPkgModal(false)}
                className="p-1.5 border border-white/10 hover:bg-white/5 rounded-full text-white/50 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePackage} className="flex-1 overflow-y-auto p-6 space-y-4 text-left text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase tracking-widest font-black text-white/40">Package Name</label>
                  <input
                    type="text"
                    required
                    value={pkgName}
                    onChange={e => setPkgName(e.target.value)}
                    placeholder="e.g. Title Sponsor"
                    className="w-full px-4 py-3 bg-white/[0.02] border border-white/10 rounded-xl text-xs text-white focus:border-[#D90429] outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase tracking-widest font-black text-white/40">Sort Order</label>
                  <input
                    type="number"
                    required
                    value={pkgSortOrder}
                    onChange={e => setPkgSortOrder(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-white/[0.02] border border-white/10 rounded-xl text-xs text-white focus:border-[#D90429] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase tracking-widest font-black text-white/40">Price (Numeric)</label>
                  <input
                    type="number"
                    required
                    value={pkgPrice}
                    onChange={e => setPkgPrice(Number(e.target.value))}
                    placeholder="e.g. 50000000"
                    className="w-full px-4 py-3 bg-white/[0.02] border border-white/10 rounded-xl text-xs text-white focus:border-[#D90429] outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase tracking-widest font-black text-white/40">Price Formatted</label>
                  <input
                    type="text"
                    required
                    value={pkgPriceFormatted}
                    onChange={e => setPkgPriceFormatted(e.target.value)}
                    placeholder="e.g. 50,000,000 TZS"
                    className="w-full px-4 py-3 bg-white/[0.02] border border-white/10 rounded-xl text-xs text-white focus:border-[#D90429] outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] uppercase tracking-widest font-black text-white/40">Description</label>
                <textarea
                  rows={2}
                  required
                  value={pkgDescription}
                  onChange={e => setPkgDescription(e.target.value)}
                  placeholder="Provide package summary..."
                  className="w-full px-4 py-3 bg-white/[0.02] border border-white/10 rounded-xl text-xs text-white focus:border-[#D90429] outline-none resize-none"
                />
              </div>

              {/* Toggles */}
              <div className="flex gap-6 items-center p-3 rounded-xl bg-white/[0.01] border border-white/5">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={pkgIsPopular}
                    onChange={e => setPkgIsPopular(e.target.checked)}
                    className="w-4 h-4 rounded text-[#D90429] focus:ring-[#D90429] bg-[#0c0809] border-white/10"
                  />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/70">Popular (Most Popular Tag)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={pkgIsActive}
                    onChange={e => setPkgIsActive(e.target.checked)}
                    className="w-4 h-4 rounded text-[#D90429] focus:ring-[#D90429] bg-[#0c0809] border-white/10"
                  />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/70">Is Active (Visible on site)</span>
                </label>
              </div>

              {/* Benefits list section */}
              <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-widest font-black text-[#D4A853] block">Package Benefits & Inclusions</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newBenefitInput}
                    onChange={e => setNewBenefitInput(e.target.value)}
                    placeholder="e.g. Exclusive naming rights as main sponsor"
                    className="flex-grow px-4 py-2.5 bg-white/[0.02] border border-white/10 rounded-xl text-xs text-white focus:border-[#D90429] outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddBenefit}
                    className="px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white font-bold rounded-xl text-xs transition-colors"
                  >
                    Add
                  </button>
                </div>
                
                {/* Benefits Items List */}
                <div className="max-h-36 overflow-y-auto space-y-2 border border-white/5 rounded-xl p-3 bg-white/[0.01]">
                  {pkgBenefits.map((benefit, bIdx) => (
                    <div key={bIdx} className="flex justify-between items-center gap-2 bg-white/[0.02] p-2 rounded-lg border border-white/5 text-[10px] text-white/80">
                      <span className="truncate">{benefit}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveBenefit(bIdx)}
                        className="p-1 hover:bg-red-500/10 rounded text-red-400 shrink-0"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  {pkgBenefits.length === 0 && (
                    <div className="text-center text-white/20 py-4">No benefits added. Please type above and click Add.</div>
                  )}
                </div>
              </div>

              {/* Submit footer */}
              <div className="pt-4 border-t border-white/5 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowPkgModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-[10px] font-black uppercase tracking-wider text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#D90429] hover:bg-[#B00020] text-white text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer"
                >
                  Save Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
