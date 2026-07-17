import React, { useEffect, useState } from 'react';
import adminApi from '../Utils/adminApi';
import { useAdminPagination } from '../Utils/useAdminPagination';
import { 
  Loader2, Check, X, ShieldAlert, CheckCircle2, AlertTriangle, Clock, CreditCard, Eye, Mail, Phone, Award, FileText, ArrowLeft, ArrowRight, Search, Download, ExternalLink, Calendar, User
} from 'lucide-react';
import { downloadCSV, downloadExcel } from '../Utils/adminExports';

interface TransactionData {
  id: string;
  order_id: string;
  amount: string;
  status: string;
  phone_number: string;
}

interface ApplicationData {
  id: string;
  applicant_name: string;
  applicant_email: string;
  applicant_phone: string;
  bio: string;
  status: string;
  created_at: string;
  photo_url: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  tiktok_url: string | null;
  category?: {
    id: string;
    name: string;
  };
  user?: {
    id: string;
    name: string;
    email: string;
  };
  transaction?: TransactionData;
}

export default function Applications() {
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Details Modal
  const [selectedApp, setSelectedApp] = useState<ApplicationData | null>(null);

  const {
    getPaginatedItems,
    renderPageSizeSelector,
    renderPagination
  } = useAdminPagination();

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await adminApi.get('/api/v1/admin/activity/applications');
      setApplications(response.data.applications || []);
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to load nominee applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleReviewApplication = async (id: string, status: 'approved' | 'rejected') => {
    if (!window.confirm(`Je, una uhakika unataka ku-${status} ombi hili?`)) return;
    try {
      const response = await adminApi.post(`/api/v1/admin/activity/applications/${id}/review`, { status });
      setSuccessMsg(response.data.message);
      // Close details modal if open
      setSelectedApp(null);
      fetchApplications();
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to complete review process.');
    }
  };

  const handleExport = (format: 'csv' | 'excel') => {
    const headers = ['Applicant Name', 'Category', 'Email', 'Phone', 'Status', 'Bio', 'Paid Amount', 'Tx Reference'];
    const rows = filteredApps.map(app => [
      app.applicant_name,
      app.category?.name || 'N/A',
      app.applicant_email,
      app.applicant_phone,
      app.status,
      app.bio.replace(/\n/g, ' '),
      app.transaction ? `${app.transaction.amount} TZS` : '0 TZS',
      app.transaction?.order_id || 'N/A'
    ]);

    if (format === 'csv') {
      downloadCSV('nominee_applications_export.csv', headers, rows);
    } else {
      downloadExcel('nominee_applications_export.xls', headers, rows);
    }
  };

  // Filter logic
  const filteredApps = applications.filter(app => {
    const matchesSearch = 
      app.applicant_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.applicant_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.applicant_phone.includes(searchQuery) ||
      (app.category?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Stats summary counts
  const totalCount = applications.length;
  const pendingReviewCount = applications.filter(a => a.status === 'pending_review').length;
  const approvedCount = applications.filter(a => a.status === 'approved').length;
  const pendingPaymentCount = applications.filter(a => a.status === 'pending_payment').length;
  const freeEntriesCount = applications.filter(a => !a.transaction || Number(a.transaction.amount) <= 0).length;

  return (
    <div className="space-y-6">
      
      {/* 1. STATS SUMMARY BOXES */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="p-4 rounded-2xl border border-white/5 bg-white/[0.01] space-y-2">
          <span className="text-[9px] font-black uppercase text-white/30 tracking-wider block">Total Entries</span>
          <div className="text-xl font-black text-white">{totalCount}</div>
        </div>
        <div className="p-4 rounded-2xl border border-white/5 bg-white/[0.01] space-y-2 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-1.5 h-1.5 rounded-full bg-orange-500 m-3 animate-pulse" />
          <span className="text-[9px] font-black uppercase text-white/30 tracking-wider block">Pending Review</span>
          <div className="text-xl font-black text-orange-500">{pendingReviewCount}</div>
        </div>
        <div className="p-4 rounded-2xl border border-white/5 bg-white/[0.01] space-y-2">
          <span className="text-[9px] font-black uppercase text-white/30 tracking-wider block">Approved Nominees</span>
          <div className="text-xl font-black text-green-500">{approvedCount}</div>
        </div>
        <div className="p-4 rounded-2xl border border-white/5 bg-white/[0.01] space-y-2">
          <span className="text-[9px] font-black uppercase text-white/30 tracking-wider block">Pending Payments</span>
          <div className="text-xl font-black text-yellow-500">{pendingPaymentCount}</div>
        </div>
        <div className="p-4 rounded-2xl border border-white/5 bg-white/[0.01] space-y-2">
          <span className="text-[9px] font-black uppercase text-white/30 tracking-wider block">Free Entries</span>
          <div className="text-xl font-black text-[#D4A853]">{freeEntriesCount}</div>
        </div>
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

      {/* 2. FILTER & ACTION MENU BAR */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-white/[0.01] border border-white/5 p-4 rounded-2xl">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-sm rounded-xl border border-white/5 bg-[#080506] focus-within:border-[#D90429]/40 transition-colors">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <input
              type="text"
              placeholder="Search applications..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-transparent py-2.5 pl-10 pr-4 text-xs text-white outline-none placeholder:text-white/20"
            />
          </div>

          {/* Status Dropdown */}
          <div className="rounded-xl border border-white/5 bg-[#080506] px-3 focus-within:border-[#D90429]/40 transition-colors flex items-center">
            <span className="text-[8px] font-black uppercase tracking-wider text-white/35 mr-2">Filter:</span>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs text-white outline-none py-2 cursor-pointer border-none"
            >
              <option value="all" className="bg-[#0c0809]">All Application Statuses</option>
              <option value="pending_review" className="bg-[#0c0809]">Pending Review</option>
              <option value="approved" className="bg-[#0c0809]">Approved</option>
              <option value="rejected" className="bg-[#0c0809]">Rejected</option>
              <option value="pending_payment" className="bg-[#0c0809]">Pending Payment</option>
              <option value="payment_failed" className="bg-[#0c0809]">Payment Failed</option>
            </select>
          </div>
        </div>

        {/* Exports */}
        <div className="flex gap-2">
          <button
            onClick={() => handleExport('csv')}
            className="px-4 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-[9px] font-black uppercase tracking-widest rounded-xl flex items-center gap-2 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>
          <button
            onClick={() => handleExport('excel')}
            className="px-4 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-[9px] font-black uppercase tracking-widest rounded-xl flex items-center gap-2 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Excel</span>
          </button>
        </div>
      </div>

      {/* 3. TABLE GRID */}
      {loading ? (
        <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#D90429]" /></div>
      ) : (
        <div className="bg-[#080506] border border-white/5 rounded-3xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
            <h4 className="text-xs font-black uppercase text-white/40 tracking-wider">Submitted Applications</h4>
            {renderPageSizeSelector('admin-applications')}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-light min-w-[700px]">
              <thead>
                <tr className="bg-white/[0.01] border-b border-white/5 text-[9px] font-black uppercase tracking-wider text-white/40">
                  <th className="p-4 pl-6">Applicant Name</th>
                  <th className="p-4">Target Category</th>
                  <th className="p-4">Contact Detail</th>
                  <th className="p-4">Entry Fee</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Details & Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {getPaginatedItems(filteredApps, 'admin-applications').map(app => (
                  <tr key={app.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="p-4 pl-6 font-bold text-white">
                      <div>{app.applicant_name}</div>
                      <div className="text-[9px] text-white/30 font-light mt-0.5">By {app.user?.name || 'Unknown'}</div>
                    </td>
                    <td className="p-4 text-white/60 font-semibold uppercase text-[10px] tracking-wide max-w-[220px] truncate">{app.category?.name || 'N/A'}</td>
                    <td className="p-4 text-white/50">{app.applicant_phone}<br /><span className="text-[10px] text-white/30 font-light">{app.applicant_email}</span></td>
                    <td className="p-4 text-[#D4A853] font-bold">
                      {app.transaction ? `${Number(app.transaction.amount).toLocaleString()} TZS` : '0 TZS'}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase border ${
                        app.status === 'approved' 
                          ? 'bg-green-500/10 border-green-500/15 text-green-500' 
                          : app.status === 'rejected' 
                            ? 'bg-red-500/10 border-red-500/15 text-red-500' 
                            : app.status === 'pending_review' 
                              ? 'bg-orange-500/10 border-orange-500/15 text-orange-400' 
                              : 'bg-yellow-500/10 border-yellow-500/15 text-yellow-500'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="inline-flex gap-2 justify-end items-center">
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="px-2.5 py-1 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg text-white/70 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-3 h-3 text-[#D90429]" />
                          <span>Details</span>
                        </button>
                        {app.status === 'pending_review' && (
                          <>
                            <button
                              onClick={() => handleReviewApplication(app.id, 'approved')}
                              className="p-1.5 border border-white/10 hover:bg-green-500/20 rounded-lg text-green-500 cursor-pointer"
                              title="Approve & Promote to Nominee"
                            ><Check className="w-3.5 h-3.5" /></button>
                            <button
                              onClick={() => handleReviewApplication(app.id, 'rejected')}
                              className="p-1.5 border border-white/10 hover:bg-red-500/20 rounded-lg text-red-500 cursor-pointer"
                              title="Reject Application"
                            ><X className="w-3.5 h-3.5" /></button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredApps.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-10 text-center text-white/20 text-xs">No nominee applications match filters.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {renderPagination('admin-applications', filteredApps.length)}
        </div>
      )}

      {/* 4. PREMIUM SELECTED APPLICATION DETAILS OVERLAY MODAL */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0c0809] border border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase text-[#D90429] tracking-widest">Nomination Details</span>
                <h3 className="text-sm font-black text-white uppercase tracking-wider">{selectedApp.applicant_name}</h3>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="p-1.5 border border-white/10 hover:bg-white/5 rounded-full text-white/50 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-left text-xs font-light leading-relaxed text-white/70">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Candidate Photo */}
                <div className="md:col-span-4 flex flex-col items-center space-y-2">
                  {selectedApp.photo_url ? (
                    <img
                      src={selectedApp.photo_url}
                      alt={selectedApp.applicant_name}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/images/logo.webp';
                      }}
                      className="w-32 h-32 rounded-2xl object-cover border border-white/10 shadow-lg"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white/20">
                      <Award className="w-12 h-12" />
                    </div>
                  )}
                  <span className="text-[9px] text-white/30 uppercase tracking-wider">Candidate Photo</span>
                </div>

                {/* Candidate Core Info */}
                <div className="md:col-span-8 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[8px] font-black uppercase text-white/30 block mb-1">Email Address</span>
                      <span className="text-white font-semibold flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-[#D90429]" />{selectedApp.applicant_email}</span>
                    </div>
                    <div>
                      <span className="text-[8px] font-black uppercase text-white/30 block mb-1">Phone Number</span>
                      <span className="text-white font-semibold flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-[#D90429]" />{selectedApp.applicant_phone}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[8px] font-black uppercase text-white/30 block mb-1">Nomination Category</span>
                    <span className="text-[#D4A853] font-bold uppercase tracking-wider text-[11px]">{selectedApp.category?.name || 'N/A'}</span>
                  </div>

                  <div>
                    <span className="text-[8px] font-black uppercase text-white/30 block mb-1">User Account (Submitter)</span>
                    <span className="text-white/60">{selectedApp.user?.name} ({selectedApp.user?.email})</span>
                  </div>
                </div>
              </div>

              {/* Bio description */}
              <div className="space-y-1 bg-white/[0.01] border border-white/5 p-4 rounded-2xl">
                <span className="text-[8px] font-black uppercase text-[#D4A853] tracking-widest block mb-1">Candidate Biography</span>
                <p className="whitespace-pre-line text-white/80 leading-relaxed font-inter font-light text-[11px]">{selectedApp.bio}</p>
              </div>

              {/* Social links */}
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2 border border-white/5 bg-white/[0.01] rounded-xl text-center">
                  <span className="text-[8px] uppercase text-white/30 block">Facebook</span>
                  {selectedApp.facebook_url ? (
                    <a href={selectedApp.facebook_url} target="_blank" rel="noreferrer" className="text-[#D90429] hover:underline font-semibold block truncate mt-1">Visit Link</a>
                  ) : (
                    <span className="text-white/20 block mt-1 font-light">Not Provided</span>
                  )}
                </div>
                <div className="p-2 border border-white/5 bg-white/[0.01] rounded-xl text-center">
                  <span className="text-[8px] uppercase text-white/30 block">Instagram</span>
                  {selectedApp.instagram_url ? (
                    <a href={selectedApp.instagram_url} target="_blank" rel="noreferrer" className="text-[#D90429] hover:underline font-semibold block truncate mt-1">Visit Link</a>
                  ) : (
                    <span className="text-white/20 block mt-1 font-light">Not Provided</span>
                  )}
                </div>
                <div className="p-2 border border-white/5 bg-white/[0.01] rounded-xl text-center">
                  <span className="text-[8px] uppercase text-white/30 block">TikTok</span>
                  {selectedApp.tiktok_url ? (
                    <a href={selectedApp.tiktok_url} target="_blank" rel="noreferrer" className="text-[#D90429] hover:underline font-semibold block truncate mt-1">Visit Link</a>
                  ) : (
                    <span className="text-white/20 block mt-1 font-light">Not Provided</span>
                  )}
                </div>
              </div>

              {/* Transaction details if present */}
              {selectedApp.transaction && (
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <span className="text-[8px] font-black uppercase text-white/30 block">Order ID</span>
                    <span className="font-mono text-white/50 text-[10px] truncate block">{selectedApp.transaction.order_id}</span>
                  </div>
                  <div>
                    <span className="text-[8px] font-black uppercase text-white/30 block">Amount</span>
                    <span className="font-bold text-white block">{Number(selectedApp.transaction.amount).toLocaleString()} TZS</span>
                  </div>
                  <div>
                    <span className="text-[8px] font-black uppercase text-white/30 block">Gateway Status</span>
                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase border block mt-1 text-center w-max ${
                      selectedApp.transaction.status === 'completed' ? 'bg-green-500/10 text-green-500 border-green-500/15' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/15'
                    }`}>{selectedApp.transaction.status}</span>
                  </div>
                  <div>
                    <span className="text-[8px] font-black uppercase text-white/30 block">Checkout Phone</span>
                    <span className="text-white block">{selectedApp.transaction.phone_number}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer / Review Actions */}
            <div className="p-6 border-t border-white/5 flex justify-end gap-3 bg-white/[0.01]">
              <button
                onClick={() => setSelectedApp(null)}
                className="px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-[10px] font-black uppercase tracking-wider text-white"
              >
                Close
              </button>
              {selectedApp.status === 'pending_review' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleReviewApplication(selectedApp.id, 'rejected')}
                    className="px-5 py-2.5 rounded-xl bg-red-600/20 border border-red-500/20 hover:bg-[#D90429] text-[#D90429] hover:text-white transition-all text-[10px] font-black uppercase tracking-wider cursor-pointer"
                  >
                    Reject Application
                  </button>
                  <button
                    onClick={() => handleReviewApplication(selectedApp.id, 'approved')}
                    className="px-5 py-2.5 rounded-xl bg-green-500/20 border border-green-500/20 hover:bg-green-500 text-green-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-wider cursor-pointer"
                  >
                    Approve & Add Nominee
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
