import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import adminApi from '../Utils/adminApi';
import { AlertTriangle, ArrowRight, CheckCircle2, Clock3, CreditCard, Database, Loader2, Radar, ShieldAlert, Ticket, Trophy, Users, ClipboardList } from 'lucide-react';

interface PaymentSummary {
  completed: number;
  pending: number;
  failed: number;
  cancelled: number;
  total?: number;
  transaction_count?: number;
  completed_amount?: number;
  total_revenue?: number;
}

interface SecuritySummary {
  sample_votes_checked: number;
  tampered_sample_votes: number;
  recent_logs_checked: number;
  unverified_recent_logs: number;
  vote_attempts: {
    success: number;
    blocked: number;
    duplicate: number;
    high_risk: number;
    vpn_or_proxy: number;
    rate_limited: number;
  };
}

interface StatItem {
  active_season: string;
  total_votes: number;
  total_revenue: number;
  categories_count: number;
  nominees_count: number;
  marathon_count: number;
  marathon_revenue: number;
  ticket_count?: number;
  ticket_revenue?: number;
  applications_count?: number;
  applications_pending_count?: number;
  applications_revenue?: number;
  payment_summary?: PaymentSummary;
  security_summary?: SecuritySummary;
  health?: {
    voting_status: string;
    payment_status: string;
    integrity_status: string;
    issue_count: number;
  };
}

interface AuditLogItem {
  id: string;
  action: string;
  created_at: string;
  is_verified?: boolean;
  admin_user?: { name: string } | null;
}

interface QueueItem {
  label: string;
  count: number;
  tone: 'danger' | 'warning' | 'good' | 'muted';
}

const formatMoney = (value: number | string | undefined) => `${Number(value || 0).toLocaleString()} TZS`;

const statusTone: Record<string, string> = {
  live: 'bg-green-500/10 text-green-400 border-green-500/20',
  setup: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
  settled: 'bg-green-500/10 text-green-400 border-green-500/20',
  verified: 'bg-green-500/10 text-green-400 border-green-500/20',
  attention: 'bg-[#D90429]/10 text-[#ff4d67] border-[#D90429]/25',
};

const queueTone: Record<QueueItem['tone'], string> = {
  danger: 'bg-[#D90429]/10 text-[#ff4d67] border-[#D90429]/25',
  warning: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
  good: 'bg-green-500/10 text-green-400 border-green-500/20',
  muted: 'bg-white/5 text-white/45 border-white/10',
};

export default function Overview() {
  const [stats, setStats] = useState<StatItem | null>(null);
  const [recentLogs, setRecentLogs] = useState<AuditLogItem[]>([]);
  const [processQueue, setProcessQueue] = useState<QueueItem[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchStats = async () => {
    setLoadingStats(true);
    setErrorMsg('');
    try {
      const response = await adminApi.get('/api/v1/admin/stats');
      setStats(response.data.stats);
      setRecentLogs(response.data.recent_logs || []);
      setProcessQueue(response.data.process_queue || []);
    } catch {
      setErrorMsg('Imeshindwa kupakia takwimu za mfumo.');
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const payments = stats?.payment_summary;
  const security = stats?.security_summary;
  const voteAttempts = security?.vote_attempts;
  const completedRevenue = payments?.total_revenue ?? payments?.completed_amount ?? stats?.total_revenue ?? 0;

  const health = [
    { label: 'Voting Status', value: stats?.health?.voting_status || 'setup' },
    { label: 'Payment Settlement', value: stats?.health?.payment_status || 'settled' },
    { label: 'Integrity Status', value: stats?.health?.integrity_status || 'verified' },
    { label: 'Issue Count', value: `${stats?.health?.issue_count ?? 0} open`, raw: (stats?.health?.issue_count ?? 0) > 0 ? 'attention' : 'verified' },
  ];

  const metrics = useMemo(() => [
    { label: 'Total Votes', value: Number(stats?.total_votes || 0).toLocaleString(), detail: 'Signed vote rows', Icon: Trophy, tone: 'text-[#D90429]' },
    { label: 'Voting Revenue', value: formatMoney(stats?.total_revenue), detail: 'Completed vote orders', Icon: CreditCard, tone: 'text-white' },
    { label: 'Total Applications', value: Number(stats?.applications_count || 0).toLocaleString(), detail: `${stats?.applications_pending_count || 0} pending review`, Icon: ClipboardList, tone: 'text-[#ff334d]' },
    { label: 'Nomination Revenue', value: formatMoney(stats?.applications_revenue), detail: 'Completed application payments', Icon: CreditCard, tone: 'text-[#D4A853]' },
    { label: 'Pending Payments', value: Number(payments?.pending || 0).toLocaleString(), detail: 'Awaiting gateway callback', Icon: Clock3, tone: 'text-amber-300' },
    { label: 'Failed Payments', value: Number(payments?.failed || 0).toLocaleString(), detail: 'Needs finance review', Icon: AlertTriangle, tone: 'text-[#ff4d67]' },
    { label: 'Nominees', value: Number(stats?.nominees_count || 0).toLocaleString(), detail: `Across ${stats?.categories_count || 0} categories`, Icon: Users, tone: 'text-white' },
    { label: 'Marathon Collections', value: formatMoney(stats?.marathon_revenue), detail: `${stats?.marathon_count || 0} registrations`, Icon: Radar, tone: 'text-green-400' },
    { label: 'Ticket Collections', value: formatMoney(stats?.ticket_revenue), detail: `${stats?.ticket_count || 0} purchases`, Icon: Ticket, tone: 'text-white' },
    { label: 'Transactions', value: Number(payments?.transaction_count ?? payments?.total ?? 0).toLocaleString(), detail: 'All payment rows', Icon: Database, tone: 'text-white' },
  ], [stats, payments]);

  return (
    <div className="space-y-6">
      {errorMsg && (
        <div className="p-4 bg-[#D90429]/10 border border-[#D90429]/20 text-[#D90429] text-[11px] font-bold uppercase rounded-lg text-center tracking-wider">
          {errorMsg}
        </div>
      )}

      {loadingStats ? (
        <div className="py-20 flex justify-center items-center">
          <Loader2 className="w-10 h-10 animate-spin text-[#D90429]" />
        </div>
      ) : (
        <>
          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
            {health.map((item) => {
              const toneKey = item.raw || item.value;
              return (
                <div key={item.label} className={`p-4 rounded-lg border ${statusTone[toneKey] || statusTone.attention}`}>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[9px] font-black uppercase tracking-widest opacity-75">{item.label}</span>
                    {toneKey === 'attention' ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                  </div>
                  <div className="mt-2 text-lg font-black uppercase font-outfit">{item.value}</div>
                </div>
              );
            })}
          </section>

          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {metrics.map(({ label, value, detail, Icon, tone }) => (
              <div key={label} className="p-5 rounded-lg bg-[#0b0b0b] border border-white/5">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[9px] font-black uppercase text-white/40 tracking-wider">{label}</span>
                  <Icon className={`w-5 h-5 ${tone}`} />
                </div>
                <div className={`mt-3 text-2xl font-black font-outfit ${tone}`}>{value}</div>
                <p className="mt-1 text-[10px] text-white/45">{detail}</p>
              </div>
            ))}
          </section>

          <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            <div className="xl:col-span-7 p-5 rounded-lg bg-[#0b0b0b] border border-white/5 space-y-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <span className="text-[9px] font-black text-[#D90429] uppercase tracking-widest font-outfit">Finance Flow</span>
                  <h3 className="mt-1 text-sm font-black uppercase text-white">Paid Voting Settlement</h3>
                </div>
                <Link to="/admin/payments" className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-[#D90429]/40 text-[9px] font-black uppercase tracking-wider text-white/60 hover:text-white flex items-center gap-2">
                  Open Payments <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-4 rounded-lg bg-white/[0.02] border border-white/5"><div className="text-[8px] uppercase font-black text-white/35">Completed</div><div className="mt-2 text-xl font-black text-green-400">{payments?.completed || 0}</div></div>
                <div className="p-4 rounded-lg bg-white/[0.02] border border-white/5"><div className="text-[8px] uppercase font-black text-white/35">Pending</div><div className="mt-2 text-xl font-black text-amber-300">{payments?.pending || 0}</div></div>
                <div className="p-4 rounded-lg bg-white/[0.02] border border-white/5"><div className="text-[8px] uppercase font-black text-white/35">Failed</div><div className="mt-2 text-xl font-black text-[#D90429]">{payments?.failed || 0}</div></div>
                <div className="p-4 rounded-lg bg-white/[0.02] border border-white/5"><div className="text-[8px] uppercase font-black text-white/35">Revenue</div><div className="mt-2 text-lg font-black text-white">{formatMoney(completedRevenue)}</div></div>
              </div>
            </div>

            <div className="xl:col-span-5 p-5 rounded-lg bg-[#0b0b0b] border border-white/5 space-y-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <span className="text-[9px] font-black text-[#D90429] uppercase tracking-widest font-outfit">Security Watch</span>
                  <h3 className="mt-1 text-sm font-black uppercase text-white">Risk Signals</h3>
                </div>
                <Link to="/admin/security" className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-[#D90429]/40 text-[9px] font-black uppercase tracking-wider text-white/60 hover:text-white flex items-center gap-2">
                  Audit <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between border-b border-white/5 pb-3"><span className="text-white/55">Blocked attempts</span><span className="font-black text-[#D90429]">{voteAttempts?.blocked || 0}</span></div>
                <div className="flex justify-between border-b border-white/5 pb-3"><span className="text-white/55">High risk attempts</span><span className="font-black text-amber-300">{voteAttempts?.high_risk || 0}</span></div>
                <div className="flex justify-between border-b border-white/5 pb-3"><span className="text-white/55">VPN/proxy signals</span><span className="font-black text-amber-300">{voteAttempts?.vpn_or_proxy || 0}</span></div>
                <div className="flex justify-between"><span className="text-white/55">Votes sampled for integrity</span><span className="font-black text-white">{security?.sample_votes_checked || 0}</span></div>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 p-5 rounded-lg bg-[#0b0b0b] border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase text-white/40 tracking-wider">Live Process Queue</h3>
                <Radar className="w-4 h-4 text-white/30" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {processQueue.map((item) => (
                  <div key={item.label} className={`p-4 rounded-lg border ${queueTone[item.tone] || queueTone.muted}`}>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[9px] font-black uppercase tracking-wider">{item.label}</span>
                      <span className="text-xl font-black font-outfit">{item.count}</span>
                    </div>
                  </div>
                ))}
                {processQueue.length === 0 && <div className="p-4 rounded-lg bg-white/[0.02] border border-white/5 text-xs text-white/40">No active process queue.</div>}
              </div>
              <div className="flex flex-wrap gap-3 pt-1">
                <Link to="/admin/payments" className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-amber-500/30 text-[9px] font-black uppercase tracking-wider text-white/60 hover:text-white flex items-center gap-2">
                  Open Payments <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link to="/admin/process-logs" className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-[#D90429]/40 text-[9px] font-black uppercase tracking-wider text-white/60 hover:text-white flex items-center gap-2">
                  Open Logs <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 p-5 rounded-lg bg-[#0b0b0b] border border-white/5 space-y-4">
              <h3 className="text-xs font-black uppercase text-white/40 tracking-wider">Recent System Audit Logs</h3>
              <div className="space-y-3">
                {recentLogs.map(log => (
                  <div key={log.id} className="p-3 bg-white/[0.02] border border-white/5 rounded-lg flex flex-col text-xs">
                    <div className="flex justify-between gap-3 font-bold">
                      <span className="text-[#D90429] uppercase truncate">{log.action}</span>
                      <span className="text-white/30 text-[9px] shrink-0">{new Date(log.created_at).toLocaleTimeString()}</span>
                    </div>
                    <span className="text-[10px] text-white/50 mt-1">Admin: {log.admin_user?.name || 'System'}</span>
                  </div>
                ))}
                {recentLogs.length === 0 && (
                  <div className="py-8 text-center text-white/30 text-xs">Hakuna kumbukumbu za hivi karibuni.</div>
                )}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}