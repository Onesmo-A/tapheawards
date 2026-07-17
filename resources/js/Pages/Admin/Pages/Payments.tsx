import React, { useEffect, useState } from 'react';
import adminApi from '../Utils/adminApi';
import { ArrowLeft, ArrowRight, CreditCard, Loader2, Search, ShieldAlert, CheckCircle2, Clock3, XCircle } from 'lucide-react';

type PaymentStatus = 'all' | 'completed' | 'pending' | 'failed' | 'cancelled';

interface TransactionItem {
  id: string;
  order_id: string;
  gateway_reference?: string;
  amount: number;
  currency?: string;
  status: PaymentStatus;
  payment_method?: string;
  phone_number: string;
  created_at: string;
  payable_type?: string;
}

interface Summary {
  total: number;
  completed: number;
  pending: number;
  failed: number;
  cancelled: number;
  completed_amount: number;
  completed_voting_amount?: number;
  completed_nomination_amount?: number;
}

const statusStyles: Record<string, string> = {
  completed: 'bg-green-500/10 text-green-400 border-green-500/20',
  pending: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
  failed: 'bg-[#D90429]/10 text-[#D90429] border-[#D90429]/20',
  cancelled: 'bg-white/5 text-white/40 border-white/10',
};

const statCards = [
  { key: 'completed', label: 'Completed', Icon: CheckCircle2, tone: 'text-green-400' },
  { key: 'pending', label: 'Pending', Icon: Clock3, tone: 'text-amber-300' },
  { key: 'failed', label: 'Failed', Icon: XCircle, tone: 'text-[#D90429]' },
  { key: 'total', label: 'All Transactions', Icon: CreditCard, tone: 'text-white' },
] as const;

export default function Payments() {
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [pagination, setPagination] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<PaymentStatus>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchTransactions = async (nextPage = 1) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const params = new URLSearchParams({ page: String(nextPage) });
      if (search.trim()) params.set('search', search.trim());
      if (status !== 'all') params.set('status', status);
      const response = await adminApi.get(`/api/v1/admin/transactions?${params.toString()}`);
      setTransactions(response.data.transactions || []);
      setSummary(response.data.summary || null);
      setPagination(response.data.pagination || null);
      setPage(nextPage);
    } catch {
      setErrorMsg('Imeshindwa kupakia miamala ya malipo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(1);
  }, [status]);

  return (
    <div className="space-y-6">
      {errorMsg && (
        <div className="p-4 bg-[#D90429]/10 border border-[#D90429]/20 text-[#D90429] text-[11px] font-bold uppercase rounded-2xl text-center tracking-wider">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-8 gap-4">
        <div className="xl:col-span-2 p-5 rounded-2xl bg-[#0b0b0b] border border-white/5">
          <span className="text-[8px] font-black uppercase text-white/40 tracking-wider">Settled Voting Revenue</span>
          <div className="mt-2 text-xl font-black text-white font-outfit">{Number(summary?.completed_voting_amount || 0).toLocaleString()} TZS</div>
          <p className="mt-1 text-[9px] text-white/45">Money received from completed voting orders.</p>
        </div>
        <div className="xl:col-span-2 p-5 rounded-2xl bg-[#0b0b0b] border border-white/5">
          <span className="text-[8px] font-black uppercase text-white/40 tracking-wider">Settled Nomination Revenue</span>
          <div className="mt-2 text-xl font-black text-[#D4A853] font-outfit">{Number(summary?.completed_nomination_amount || 0).toLocaleString()} TZS</div>
          <p className="mt-1 text-[9px] text-white/45">Money received from completed applications.</p>
        </div>
        {statCards.map(({ key, label, Icon, tone }) => (
          <button
            key={key}
            onClick={() => setStatus(key === 'total' ? 'all' : key)}
            className={`p-5 rounded-2xl bg-[#0b0b0b] border text-left transition-all cursor-pointer ${status === key || (key === 'total' && status === 'all') ? 'border-[#D90429]/40' : 'border-white/5 hover:border-white/15'} xl:col-span-1`}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-[8px] font-black uppercase text-white/40 tracking-wider">{label}</span>
              <Icon className={`w-4 h-4 ${tone}`} />
            </div>
            <div className={`mt-3 text-xl font-black font-outfit ${tone}`}>{Number(summary?.[key] || 0).toLocaleString()}</div>
          </button>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
        <form onSubmit={(event) => { event.preventDefault(); fetchTransactions(1); }} className="flex gap-3 w-full lg:max-w-xl">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search phone, order ID, gateway reference..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#0b0b0b] border border-white/10 rounded-xl text-xs text-white focus:border-[#D90429] outline-none"
            />
          </div>
          <button className="px-5 py-2.5 bg-[#D90429] text-[10px] font-black uppercase tracking-widest rounded-xl cursor-pointer text-white">Search</button>
        </form>

        <div className="flex gap-2 overflow-x-auto scrollbar-none">
          {(['all', 'completed', 'pending', 'failed', 'cancelled'] as PaymentStatus[]).map(item => (
            <button
              key={item}
              onClick={() => setStatus(item)}
              className={`px-3.5 py-2 rounded-xl border text-[9px] font-black uppercase tracking-wider cursor-pointer shrink-0 ${status === item ? 'bg-[#D90429] border-[#D90429] text-white' : 'bg-white/5 border-white/10 text-white/45 hover:text-white'}`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#D90429]" /></div>
      ) : (
        <div className="bg-[#0b0b0b] border border-white/5 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[920px]">
              <thead>
                <tr className="bg-white/[0.02] border-b border-white/5 text-[9px] font-black uppercase tracking-wider text-white/40">
                  <th className="p-4 pl-6">Payer Phone</th>
                  <th className="p-4">Order / Gateway</th>
                  <th className="p-4">Flow</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {transactions.map(tx => (
                  <tr key={tx.id} className="hover:bg-white/[0.02]">
                    <td className="p-4 pl-6 font-bold text-white">{tx.phone_number}</td>
                    <td className="p-4">
                      <div className="font-mono text-[10px] text-white/55">{tx.order_id}</div>
                      <div className="font-mono text-[10px] text-white/30">{tx.gateway_reference || 'No gateway ref yet'}</div>
                    </td>
                    <td className="p-4 text-white/50">{tx.payable_type || 'Payment'}</td>
                    <td className="p-4 font-black text-white">{Number(tx.amount || 0).toLocaleString()} {tx.currency || 'TZS'}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase border ${statusStyles[tx.status] || statusStyles.cancelled}`}>{tx.status}</span>
                    </td>
                    <td className="p-4 pr-6 text-right text-white/40">{new Date(tx.created_at).toLocaleString()}</td>
                  </tr>
                ))}
                {transactions.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-10 text-center text-white/30">Hakuna miamala iliyopatikana kwa filter hii.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {pagination && pagination.last_page > 1 && (
            <div className="p-4 flex items-center justify-between border-t border-white/5 text-[10px] font-bold text-white/40 uppercase tracking-wider">
              <span>Transactions: {pagination.total}</span>
              <div className="flex gap-2">
                <button disabled={page <= 1} onClick={() => fetchTransactions(page - 1)} className="p-1 border border-white/10 hover:bg-white/5 disabled:opacity-40 rounded-lg cursor-pointer"><ArrowLeft className="w-4 h-4" /></button>
                <button disabled={page >= pagination.last_page} onClick={() => fetchTransactions(page + 1)} className="p-1 border border-white/10 hover:bg-white/5 disabled:opacity-40 rounded-lg cursor-pointer"><ArrowRight className="w-4 h-4" /></button>
              </div>
            </div>
          )}
        </div>
      )}

      {summary && (summary.failed > 0 || summary.pending > 0) && (
        <div className="p-4 rounded-2xl border border-amber-500/20 bg-amber-500/10 text-amber-100 flex gap-3 text-xs">
          <ShieldAlert className="w-5 h-5 shrink-0 text-amber-300" />
          <div>
            <div className="font-black uppercase tracking-wider text-[10px]">Payment Queue Needs Attention</div>
            <p className="mt-1 text-amber-100/70">Pending or failed payments should be checked against gateway callbacks and vote order status before closing the voting window.</p>
          </div>
        </div>
      )}
    </div>
  );
}
