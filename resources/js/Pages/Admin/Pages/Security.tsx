import React, { useEffect, useState } from 'react';
import adminApi from '../Utils/adminApi';
import { ArrowLeft, ArrowRight, CheckCircle2, Database, Loader2, Radar, Search, ShieldAlert, ShieldCheck } from 'lucide-react';

interface AttemptItem {
  id: string;
  status: string;
  reason?: string;
  ip_address?: string;
  subnet?: string;
  risk_score?: number;
  vpn_detected?: boolean;
  proxy_detected?: boolean;
  hosting_detected?: boolean;
  rate_limited?: boolean;
  asn_name?: string;
  nominee_name?: string;
  category_name?: string;
  attempted_at?: string;
}

interface AttemptSummary {
  success: number;
  blocked: number;
  duplicate: number;
  high_risk: number;
  vpn_or_proxy: number;
  rate_limited: number;
}

const statusTone = (status: string) => {
  if (status === 'success') return 'bg-green-500/10 text-green-400 border-green-500/20';
  if (status === 'blocked') return 'bg-[#D90429]/10 text-[#D90429] border-[#D90429]/20';
  if (status === 'duplicate') return 'bg-amber-500/10 text-amber-300 border-amber-500/20';
  return 'bg-white/5 text-white/40 border-white/10';
};

export default function Security() {
  const [attempts, setAttempts] = useState<AttemptItem[]>([]);
  const [summary, setSummary] = useState<AttemptSummary | null>(null);
  const [pagination, setPagination] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [auditing, setAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchAttempts = async (nextPage = 1) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const params = new URLSearchParams({ page: String(nextPage) });
      if (search.trim()) params.set('search', search.trim());
      if (status !== 'all') params.set('status', status);
      const response = await adminApi.get(`/api/v1/admin/security/vote-attempts?${params.toString()}`);
      setAttempts(response.data.attempts || []);
      setSummary(response.data.summary || null);
      setPagination(response.data.pagination || null);
      setPage(nextPage);
    } catch {
      setErrorMsg('Imeshindwa kupakia security vote attempts.');
    } finally {
      setLoading(false);
    }
  };

  const runVotingAudit = async () => {
    setAuditing(true);
    setAuditResult(null);
    setErrorMsg('');
    try {
      const response = await adminApi.post('/api/v1/admin/votes/verify');
      setAuditResult(response.data.audit);
    } catch {
      setErrorMsg('Failed to complete vote integrity audit.');
    } finally {
      setAuditing(false);
    }
  };

  useEffect(() => {
    fetchAttempts(1);
  }, [status]);

  const riskSignals = [
    { label: 'Successful Attempts', value: summary?.success || 0, tone: 'text-green-400', Icon: CheckCircle2 },
    { label: 'Blocked Attempts', value: summary?.blocked || 0, tone: 'text-[#D90429]', Icon: ShieldAlert },
    { label: 'High Risk', value: summary?.high_risk || 0, tone: 'text-amber-300', Icon: Radar },
    { label: 'VPN / Proxy', value: summary?.vpn_or_proxy || 0, tone: 'text-amber-300', Icon: ShieldAlert },
    { label: 'Rate Limited', value: summary?.rate_limited || 0, tone: 'text-[#D90429]', Icon: Database },
  ];

  return (
    <div className="space-y-6">
      {errorMsg && (
        <div className="p-4 bg-[#D90429]/10 border border-[#D90429]/20 text-[#D90429] text-[11px] font-bold uppercase rounded-2xl text-center tracking-wider">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-4 p-6 rounded-2xl bg-[#0b0b0b] border border-white/5 space-y-5">
          <div>
            <span className="text-[9px] font-black text-[#D90429] uppercase tracking-widest font-outfit">Vote Integrity</span>
            <h3 className="mt-2 text-lg font-black uppercase text-white">Database Signature Scan</h3>
            <p className="mt-2 text-xs text-white/55 leading-relaxed">Run an HMAC verification pass on saved votes to detect tampered or unsigned vote rows.</p>
          </div>
          <button
            onClick={runVotingAudit}
            disabled={auditing}
            className="px-5 py-3 bg-[#D90429] hover:bg-[#B00020] disabled:bg-[#D90429]/40 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-2 cursor-pointer"
          >
            {auditing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
            <span>{auditing ? 'Scanning...' : 'Run Integrity Scan'}</span>
          </button>
          {auditResult && (
            <div className={`p-4 rounded-2xl border ${auditResult.is_compromised ? 'bg-[#D90429]/10 border-[#D90429]/20 text-[#D90429]' : 'bg-green-500/10 border-green-500/20 text-green-400'}`}>
              <div className="text-[10px] font-black uppercase tracking-wider">{auditResult.is_compromised ? 'Compromised' : 'Verified OK'}</div>
              <div className="mt-2 grid grid-cols-3 gap-3 text-center">
                <div><div className="text-lg font-black">{auditResult.total_audited}</div><div className="text-[8px] uppercase opacity-60">Rows</div></div>
                <div><div className="text-lg font-black">{auditResult.valid_votes}</div><div className="text-[8px] uppercase opacity-60">Valid</div></div>
                <div><div className="text-lg font-black">{auditResult.tampered_votes}</div><div className="text-[8px] uppercase opacity-60">Bad</div></div>
              </div>
            </div>
          )}
        </div>

        <div className="xl:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {riskSignals.map(({ label, value, tone, Icon }) => (
            <div key={label} className="p-5 rounded-2xl bg-[#0b0b0b] border border-white/5">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[8px] font-black uppercase text-white/40 tracking-wider">{label}</span>
                <Icon className={`w-4 h-4 ${tone}`} />
              </div>
              <div className={`mt-3 text-2xl font-black font-outfit ${tone}`}>{Number(value).toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
        <form onSubmit={(event) => { event.preventDefault(); fetchAttempts(1); }} className="flex gap-3 w-full lg:max-w-xl">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search IP, subnet, ASN, fingerprint, reason..." className="w-full pl-10 pr-4 py-2.5 bg-[#0b0b0b] border border-white/10 rounded-xl text-xs text-white focus:border-[#D90429] outline-none" />
          </div>
          <button className="px-5 py-2.5 bg-[#D90429] text-[10px] font-black uppercase tracking-widest rounded-xl cursor-pointer text-white">Search</button>
        </form>
        <div className="flex gap-2 overflow-x-auto scrollbar-none">
          {['all', 'success', 'blocked', 'duplicate'].map(item => (
            <button key={item} onClick={() => setStatus(item)} className={`px-3.5 py-2 rounded-xl border text-[9px] font-black uppercase tracking-wider cursor-pointer shrink-0 ${status === item ? 'bg-[#D90429] border-[#D90429] text-white' : 'bg-white/5 border-white/10 text-white/45 hover:text-white'}`}>{item}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#D90429]" /></div>
      ) : (
        <div className="bg-[#0b0b0b] border border-white/5 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[980px]">
              <thead>
                <tr className="bg-white/[0.02] border-b border-white/5 text-[9px] font-black uppercase tracking-wider text-white/40">
                  <th className="p-4 pl-6">Status / Reason</th>
                  <th className="p-4">Nominee</th>
                  <th className="p-4">Network</th>
                  <th className="p-4">Risk</th>
                  <th className="p-4">Signals</th>
                  <th className="p-4 pr-6 text-right">Attempted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {attempts.map(attempt => (
                  <tr key={attempt.id} className="hover:bg-white/[0.02]">
                    <td className="p-4 pl-6">
                      <span className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase border ${statusTone(attempt.status)}`}>{attempt.status}</span>
                      <div className="mt-2 text-white/45 max-w-xs truncate">{attempt.reason || 'No reason logged'}</div>
                    </td>
                    <td className="p-4 text-white/60">{attempt.nominee_name || 'N/A'}<br /><span className="text-[10px] text-white/35">{attempt.category_name || 'No category'}</span></td>
                    <td className="p-4 font-mono text-[10px] text-white/45">{attempt.ip_address || 'N/A'}<br /><span className="text-white/25">{attempt.asn_name || attempt.subnet || 'No ASN/subnet'}</span></td>
                    <td className="p-4 font-black text-white">{attempt.risk_score ?? 0}/100</td>
                    <td className="p-4 text-[9px] font-black uppercase tracking-wider text-white/40">
                      {[attempt.vpn_detected && 'VPN', attempt.proxy_detected && 'Proxy', attempt.hosting_detected && 'Hosting', attempt.rate_limited && 'Rate limited'].filter(Boolean).join(' / ') || 'Clear'}
                    </td>
                    <td className="p-4 pr-6 text-right text-white/40">{attempt.attempted_at ? new Date(attempt.attempted_at).toLocaleString() : 'N/A'}</td>
                  </tr>
                ))}
                {attempts.length === 0 && (
                  <tr><td colSpan={6} className="p-10 text-center text-white/30">Hakuna vote attempts zilizopatikana.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          {pagination && pagination.last_page > 1 && (
            <div className="p-4 flex items-center justify-between border-t border-white/5 text-[10px] font-bold text-white/40 uppercase tracking-wider">
              <span>Attempts: {pagination.total}</span>
              <div className="flex gap-2">
                <button disabled={page <= 1} onClick={() => fetchAttempts(page - 1)} className="p-1 border border-white/10 hover:bg-white/5 disabled:opacity-40 rounded-lg cursor-pointer"><ArrowLeft className="w-4 h-4" /></button>
                <button disabled={page >= pagination.last_page} onClick={() => fetchAttempts(page + 1)} className="p-1 border border-white/10 hover:bg-white/5 disabled:opacity-40 rounded-lg cursor-pointer"><ArrowRight className="w-4 h-4" /></button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
