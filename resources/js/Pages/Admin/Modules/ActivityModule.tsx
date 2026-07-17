import React, { useState } from 'react';
import adminApi from '../Utils/adminApi';
import { 
  Loader2, Check, X, ShieldAlert, CheckCircle, Database, ArrowLeft, ArrowRight, Eye, Globe, User, Mail, Phone, Calendar, Award
} from 'lucide-react';

interface ActivityModuleProps {
  activeTab: 'applications' | 'suggestions' | 'users' | 'transactions' | 'auditing';
  applications: any[];
  loadingApplications: boolean;
  fetchApplications: () => void;
  suggestions: any[];
  loadingSuggestions: boolean;
  fetchSuggestions: () => void;
  users: any[];
  loadingUsers: boolean;
  transactions: any[];
  loadingTransactions: boolean;
  fetchTransactions: (page: number) => void;
  txPagination: any;
  txPage: number;
  setTxPage: (page: number) => void;
  txSearch: string;
  setTxSearch: (search: string) => void;
  fullLogs: any[];
  loadingLogs: boolean;
  fetchAuditLogs: (page: number) => void;
  logsPagination: any;
  logsPage: number;
  getPaginatedItems: (items: any[], key: string) => any[];
  renderPageSizeSelector: (key: string) => React.ReactNode;
  renderPagination: (key: string, total: number) => React.ReactNode;
  setErrorMsg: (msg: string) => void;
  setSuccessMsg: (msg: string) => void;
}

export default function ActivityModule({
  activeTab,
  applications,
  loadingApplications,
  fetchApplications,
  suggestions,
  loadingSuggestions,
  fetchSuggestions,
  users,
  loadingUsers,
  transactions,
  loadingTransactions,
  fetchTransactions,
  txPagination,
  txPage,
  setTxPage,
  txSearch,
  setTxSearch,
  fullLogs,
  loadingLogs,
  fetchAuditLogs,
  logsPagination,
  logsPage,
  getPaginatedItems,
  renderPageSizeSelector,
  renderPagination,
  setErrorMsg,
  setSuccessMsg
}: ActivityModuleProps) {
  const [auditing, setAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<any>(null);
  const [selectedApp, setSelectedApp] = useState<any>(null);

  const handleReviewApplication = async (id: string, status: 'approved' | 'rejected') => {
    if (!window.confirm(`Je, una uhakika unataka ku-${status} ombi hili?`)) return;
    try {
      const response = await adminApi.post(`/api/v1/admin/activity/applications/${id}/review`, { status });
      setSuccessMsg(response.data.message);
      fetchApplications();
    } catch {
      setErrorMsg('Failed to complete review.');
    }
  };

  const handleApproveSuggestion = async (id: string) => {
    if (!window.confirm('Je, una uhakika unataka kupitisha pendekezo hili kuwa mgombea?')) return;
    try {
      const response = await adminApi.post(`/api/v1/admin/activity/suggestions/${id}/approve`);
      setSuccessMsg(response.data.message);
      fetchSuggestions();
    } catch {
      setErrorMsg('Failed to promote suggestion.');
    }
  };

  const runVotingAudit = async () => {
    setAuditing(true);
    setAuditResult(null);
    try {
      const response = await adminApi.post('/api/v1/admin/votes/verify');
      if (response.data.status === 'success') {
        setAuditResult(response.data.audit);
        fetchAuditLogs(1);
      }
    } catch {
      setErrorMsg('Failed to complete audit.');
    } finally {
      setAuditing(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* TAB: APPLICATIONS */}
      {activeTab === 'applications' && (
        <div className="space-y-6">
          {loadingApplications ? (
            <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#D90429]" /></div>
          ) : (
            <div className="bg-[#0b0b0b] border border-white/5 rounded-3xl overflow-hidden">
              <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                <h4 className="text-xs font-black uppercase text-white/40 tracking-wider">Nominee Applications Queue</h4>
                {renderPageSizeSelector('applications')}
              </div>
              <table className="w-full text-left text-xs font-light">
                <thead>
                  <tr className="bg-white/[0.01] border-b border-white/5 text-[9px] font-black uppercase tracking-wider text-white/40">
                    <th className="p-4 pl-6">Applicant Name</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Contact</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 pr-6 text-right">Details & Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {getPaginatedItems(applications, 'applications').map(app => (
                    <tr key={app.id} className="hover:bg-white/[0.01]">
                      <td className="p-4 pl-6 font-bold text-white">{app.applicant_name}</td>
                      <td className="p-4 text-white/60">{app.category?.name || 'N/A'}</td>
                      <td className="p-4 text-white/50">{app.applicant_phone}<br /><span className="text-[10px] text-white/40">{app.applicant_email}</span></td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase border ${
                          app.status === 'approved' 
                            ? 'bg-green-500/10 border-green-500/15 text-green-500' 
                            : app.status === 'rejected' 
                              ? 'bg-[#D90429]/10 border-[#D90429]/15 text-[#D90429]' 
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
                                title="Approve"
                              ><Check className="w-3.5 h-3.5" /></button>
                              <button
                                onClick={() => handleReviewApplication(app.id, 'rejected')}
                                className="p-1.5 border border-white/10 hover:bg-[#D90429]/20 rounded-lg text-[#D90429] cursor-pointer"
                                title="Reject"
                              ><X className="w-3.5 h-3.5" /></button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {applications.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-white/30">No nominee applications submitted yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
              {renderPagination('applications', applications.length)}
            </div>
          )}
        </div>
      )}

      {/* TAB: SUGGESTIONS */}
      {activeTab === 'suggestions' && (
        <div className="space-y-6">
          {loadingSuggestions ? (
            <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#D90429]" /></div>
          ) : (
            <div className="bg-[#0b0b0b] border border-white/5 rounded-3xl overflow-hidden">
              <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                <h4 className="text-xs font-black uppercase text-white/40 tracking-wider">Suggester Nominees review</h4>
                {renderPageSizeSelector('suggestions')}
              </div>
              <table className="w-full text-left text-xs font-light">
                <thead>
                  <tr className="bg-white/[0.01] border-b border-white/5 text-[9px] font-black uppercase tracking-wider text-white/40">
                    <th className="p-4 pl-6">Suggested Candidate</th>
                    <th className="p-4">Workplace</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Suggester</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {getPaginatedItems(suggestions, 'suggestions').map(sug => (
                    <tr key={sug.id} className="hover:bg-white/[0.01]">
                      <td className="p-4 pl-6 font-bold text-white">{sug.suggested_nominee_name}<br /><span className="text-[10px] text-white/40">{sug.suggested_nominee_phone}</span></td>
                      <td className="p-4 text-white/60">{sug.suggested_nominee_workplace || 'N/A'}</td>
                      <td className="p-4 text-white/60">{sug.category?.name || 'N/A'}</td>
                      <td className="p-4 text-white/50">{sug.suggester_name}<br /><span className="text-[10px] text-white/30">{sug.suggester_email}</span></td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase border ${sug.status === 'approved' ? 'bg-green-500/10 text-green-500 border-green-500/15' : 'bg-white/5 text-white/30 border-white/5'}`}>
                          {sug.status || 'pending'}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        {(!sug.status || sug.status === 'pending') && (
                          <button
                            onClick={() => handleApproveSuggestion(sug.id)}
                            className="px-2.5 py-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-500 border border-green-500/10 rounded-xl text-[9px] font-bold uppercase tracking-wider cursor-pointer"
                          >
                            Promote Nominee
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {suggestions.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-white/30">No suggested nominations.</td>
                    </tr>
                  )}
                </tbody>
              </table>
              {renderPagination('suggestions', suggestions.length)}
            </div>
          )}
        </div>
      )}

      {/* TAB: USERS LIST */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          {loadingUsers ? (
            <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#D90429]" /></div>
          ) : (
            <div className="bg-[#0b0b0b] border border-white/5 rounded-3xl overflow-hidden">
              <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                <h4 className="text-xs font-black uppercase text-white/40 tracking-wider">Registered Users List</h4>
                {renderPageSizeSelector('users')}
              </div>
              <table className="w-full text-left text-xs font-light">
                <thead>
                  <tr className="bg-white/[0.01] border-b border-white/5 text-[9px] font-black uppercase tracking-wider text-white/40">
                    <th className="p-4 pl-6">Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Phone</th>
                    <th className="p-4 pr-6 text-right">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {getPaginatedItems(users, 'users').map(u => (
                    <tr key={u.id} className="hover:bg-white/[0.01]">
                      <td className="p-4 pl-6 font-bold text-white">{u.name}</td>
                      <td className="p-4 text-white/60">{u.email}</td>
                      <td className="p-4 text-white/50">{u.phone || 'N/A'}</td>
                      <td className="p-4 pr-6 text-right text-white/40 font-bold uppercase">{u.role || 'user'}</td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-white/30">No users registered in the database.</td>
                    </tr>
                  )}
                </tbody>
              </table>
              {renderPagination('users', users.length)}
            </div>
          )}
        </div>
      )}

      {/* TAB: TRANSACTIONS */}
      {activeTab === 'transactions' && (
        <div className="space-y-6">
          <form onSubmit={(e) => { e.preventDefault(); fetchTransactions(1); }} className="flex gap-3 max-w-md">
            <input
              type="text"
              placeholder="Search phone, order or gateway reference..."
              value={txSearch}
              onChange={(e) => setTxSearch(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#0b0b0b] border border-white/10 rounded-xl text-xs text-white focus:border-[#D90429] outline-none"
            />
            <button type="submit" className="px-5 py-2.5 bg-[#D90429] text-[10px] font-black uppercase tracking-widest rounded-xl cursor-pointer text-white">Search</button>
          </form>

          {loadingTransactions ? (
            <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#D90429]" /></div>
          ) : (
            <div className="bg-[#0b0b0b] border border-white/5 rounded-3xl overflow-hidden">
              <table className="w-full text-left text-xs font-light">
                <thead>
                  <tr className="bg-white/[0.01] border-b border-white/5 text-[9px] font-black uppercase tracking-wider text-white/40">
                    <th className="p-4 pl-6">Phone</th>
                    <th className="p-4">Gateway Reference</th>
                    <th className="p-4">Amount (TZS)</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 pr-6 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {transactions.map(t => (
                    <tr key={t.id} className="hover:bg-white/[0.01]">
                      <td className="p-4 pl-6 font-bold text-white">{t.phone_number}</td>
                      <td className="p-4 font-mono text-white/40 text-[10px]">{t.gateway_reference || 'N/A'}</td>
                      <td className="p-4 font-black text-white">{Number(t.amount).toLocaleString()}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase border ${t.status === 'completed' ? 'bg-green-500/10 text-green-500 border-green-500/15' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/15'}`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right text-white/40">{new Date(t.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {txPagination && txPagination.last_page > 1 && (
                <div className="p-4 flex items-center justify-between border-t border-white/5 text-[10px] font-bold text-white/40 uppercase tracking-wider">
                  <span>Total Transactions: {txPagination.total}</span>
                  <div className="flex gap-2">
                    <button disabled={txPage <= 1} onClick={() => { setTxPage(txPage - 1); fetchTransactions(txPage - 1); }} className="p-1 border border-white/10 hover:bg-white/5 disabled:opacity-40 rounded-lg cursor-pointer"><ArrowLeft className="w-4 h-4" /></button>
                    <button disabled={txPage >= txPagination.last_page} onClick={() => { setTxPage(txPage + 1); fetchTransactions(txPage + 1); }} className="p-1 border border-white/10 hover:bg-white/5 disabled:opacity-40 rounded-lg cursor-pointer"><ArrowRight className="w-4 h-4" /></button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB: AUDITS & INTEGRITY */}
      {activeTab === 'auditing' && (
        <div className="space-y-8">
          <div className="p-8 rounded-3xl bg-[#0b0b0b] border border-white/5 space-y-6 max-w-2xl">
            <div className="space-y-2">
              <span className="text-[9px] font-black text-[#D90429] uppercase tracking-widest font-outfit">DB Cryptographic Verify</span>
              <h3 className="text-lg font-black text-white uppercase">Cryptographic Audit Scan</h3>
              <p className="text-xs text-white/55 leading-relaxed font-light font-inter">
                Verify the signature of every vote registered in the database. 
                Any vote without a valid HMAC-SHA256 signature signed by the application key will be flagged.
              </p>
            </div>

            <button
              onClick={runVotingAudit}
              disabled={auditing}
              className="px-6 py-3 bg-[#D90429] hover:bg-[#B00020] disabled:bg-[#D90429]/40 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all flex items-center gap-2 cursor-pointer"
            >
              {auditing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Database Signatures...</span>
                </>
              ) : (
                <>
                  <Database className="w-4 h-4" />
                  <span>Scan Database Integrity</span>
                </>
              )}
            </button>
          </div>

          {/* Audit Scan results */}
          {auditResult && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 max-w-4xl">
              <div className="md:col-span-5 p-6 rounded-3xl bg-[#0b0b0b] border border-white/5 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <span className="text-[9px] font-black text-[#D90429] uppercase tracking-widest">Audit Outcome</span>
                  <h4 className="text-sm font-bold text-white uppercase">Status Summary</h4>
                </div>
                
                {auditResult.is_compromised ? (
                  <div className="p-4 bg-[#D90429]/10 border border-[#D90429]/20 text-[#D90429] rounded-2xl flex items-center gap-3">
                    <ShieldAlert className="w-8 h-8 shrink-0" />
                    <div className="text-left text-xs">
                      <h5 className="font-bold">Database Compromised!</h5>
                      <p className="text-[#D90429]/70 mt-0.5">Found tampered entries without integrity hashes.</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-500 rounded-2xl flex items-center gap-3">
                    <CheckCircle className="w-8 h-8 shrink-0" />
                    <div className="text-left text-xs">
                      <h5 className="font-bold">Database Secure</h5>
                      <p className="text-green-500/70 mt-0.5">100% of signatures verified successfully.</p>
                    </div>
                  </div>
                )}

                <div className="text-[10px] text-white/40">
                  Checked at: {new Date(auditResult.timestamp).toLocaleString()}
                </div>
              </div>

              <div className="md:col-span-7 p-6 rounded-3xl bg-[#0b0b0b] border border-white/5 space-y-4 text-left">
                <h4 className="text-xs font-black uppercase text-white/40 tracking-wider">Metrics Checked</h4>
                <div className="divide-y divide-white/5 space-y-3 text-xs font-light">
                  <div className="flex justify-between items-center py-2 pt-0">
                    <span className="text-white/60">Total Audited Vote Rows:</span>
                    <span className="font-bold text-white">{auditResult.total_audited}</span>
                  </div>

                  <div className="flex justify-between items-center py-3">
                    <span className="text-white/60">Cryptographically Valid:</span>
                    <span className="font-black text-green-500">{auditResult.valid_votes}</span>
                  </div>

                  <div className="flex justify-between items-center py-3">
                    <span className="text-white/60">Tampered / Invalid:</span>
                    <span className={`font-black ${auditResult.tampered_votes > 0 ? 'text-[#D90429]' : 'text-white/40'}`}>
                      {auditResult.tampered_votes}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Full paginated logs */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase text-white/40 tracking-wider">Full Administration Logs</h3>
            {loadingLogs ? (
              <div className="py-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#D90429]" /></div>
            ) : (
              <div className="bg-[#0b0b0b] border border-white/5 rounded-3xl overflow-hidden">
                <table className="w-full text-left text-xs font-light">
                  <thead>
                    <tr className="bg-white/[0.01] border-b border-white/5 text-[9px] font-black uppercase tracking-wider text-white/40">
                      <th className="p-4 pl-6">Action</th>
                      <th className="p-4">Admin User</th>
                      <th className="p-4">IP Address</th>
                      <th className="p-4">Timestamp</th>
                      <th className="p-4 pr-6 text-right">Integrity check</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {fullLogs.map(log => (
                      <tr key={log.id} className="hover:bg-white/[0.01]">
                        <td className="p-4 pl-6 font-bold uppercase text-[10px] text-white tracking-wider">{log.action}</td>
                        <td className="p-4 text-white/60">{log.admin_name}</td>
                        <td className="p-4 text-white/40">{log.ip_address}</td>
                        <td className="p-4 text-white/50">{new Date(log.created_at).toLocaleString()}</td>
                        <td className="p-4 pr-6 text-right">
                          {log.is_verified ? (
                            <span className="px-2 py-0.5 rounded-full text-[8px] bg-green-500/10 text-green-500 font-bold uppercase border border-green-500/15">Verified OK</span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[8px] bg-[#D90429]/10 text-[#D90429] font-bold uppercase border border-[#D90429]/15">Tampered</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {logsPagination && logsPagination.last_page > 1 && (
                  <div className="p-4 flex items-center justify-between border-t border-white/5 text-[10px] font-bold text-white/40 uppercase tracking-wider">
                    <span>Logs: {logsPagination.total}</span>
                    <div className="flex gap-2">
                      <button disabled={logsPage <= 1} onClick={() => fetchAuditLogs(logsPage - 1)} className="p-1 border border-white/10 hover:bg-white/5 disabled:opacity-40 rounded-lg cursor-pointer"><ArrowLeft className="w-4 h-4" /></button>
                      <button disabled={logsPage >= logsPagination.last_page} onClick={() => fetchAuditLogs(logsPage + 1)} className="p-1 border border-white/10 hover:bg-white/5 disabled:opacity-40 rounded-lg cursor-pointer"><ArrowRight className="w-4 h-4" /></button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
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
                  {selectedApp.photo_path ? (
                    <img
                      src={`/storage/${selectedApp.photo_path}`}
                      alt={selectedApp.applicant_name}
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
                    onClick={async () => {
                      await handleReviewApplication(selectedApp.id, 'rejected');
                      setSelectedApp(null);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-red-600/20 border border-red-500/20 hover:bg-[#D90429] text-[#D90429] hover:text-white transition-all text-[10px] font-black uppercase tracking-wider cursor-pointer"
                  >
                    Reject Application
                  </button>
                  <button
                    onClick={async () => {
                      await handleReviewApplication(selectedApp.id, 'approved');
                      setSelectedApp(null);
                    }}
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


