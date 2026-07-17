import React, { useEffect, useMemo, useState } from 'react';
import adminApi from '../Utils/adminApi';
import { ArrowLeft, ArrowRight, CheckCircle2, Database, Loader2, Search, ShieldAlert } from 'lucide-react';

interface LogItem {
  id: string;
  action: string;
  admin_name: string;
  model_type?: string;
  ip_address?: string;
  created_at: string;
  is_verified: boolean;
}

export default function ProcessLogs() {
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchLogs = async (nextPage = 1) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const response = await adminApi.get(`/api/v1/admin/logs?page=${nextPage}`);
      setLogs(response.data.logs || []);
      setPagination(response.data.pagination || null);
      setPage(nextPage);
    } catch {
      setErrorMsg('Imeshindwa kupakia process logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(1);
  }, []);

  const filteredLogs = useMemo(() => {
    const needle = search.toLowerCase().trim();
    if (!needle) return logs;
    return logs.filter(log => [log.action, log.admin_name, log.model_type, log.ip_address]
      .filter(Boolean)
      .some(value => String(value).toLowerCase().includes(needle)));
  }, [logs, search]);

  const verifiedCount = logs.filter(log => log.is_verified).length;
  const tamperedCount = logs.length - verifiedCount;

  return (
    <div className="space-y-6">
      {errorMsg && (
        <div className="p-4 bg-[#D90429]/10 border border-[#D90429]/20 text-[#D90429] text-[11px] font-bold uppercase rounded-2xl text-center tracking-wider">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#0b0b0b] border border-white/5">
          <div className="flex items-center justify-between">
            <span className="text-[8px] font-black uppercase text-white/40 tracking-wider">Loaded Events</span>
            <Database className="w-4 h-4 text-white/40" />
          </div>
          <div className="mt-3 text-2xl font-black text-white font-outfit">{logs.length}</div>
        </div>
        <div className="p-5 rounded-2xl bg-[#0b0b0b] border border-white/5">
          <div className="flex items-center justify-between">
            <span className="text-[8px] font-black uppercase text-white/40 tracking-wider">Verified Rows</span>
            <CheckCircle2 className="w-4 h-4 text-green-400" />
          </div>
          <div className="mt-3 text-2xl font-black text-green-400 font-outfit">{verifiedCount}</div>
        </div>
        <div className="p-5 rounded-2xl bg-[#0b0b0b] border border-white/5">
          <div className="flex items-center justify-between">
            <span className="text-[8px] font-black uppercase text-white/40 tracking-wider">Tamper Alerts</span>
            <ShieldAlert className="w-4 h-4 text-[#D90429]" />
          </div>
          <div className="mt-3 text-2xl font-black text-[#D90429] font-outfit">{tamperedCount}</div>
        </div>
      </div>

      <div className="relative max-w-xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Filter action, admin, IP, model..."
          className="w-full pl-10 pr-4 py-2.5 bg-[#0b0b0b] border border-white/10 rounded-xl text-xs text-white focus:border-[#D90429] outline-none"
        />
      </div>

      {loading ? (
        <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#D90429]" /></div>
      ) : (
        <div className="bg-[#0b0b0b] border border-white/5 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[900px]">
              <thead>
                <tr className="bg-white/[0.02] border-b border-white/5 text-[9px] font-black uppercase tracking-wider text-white/40">
                  <th className="p-4 pl-6">Action</th>
                  <th className="p-4">Admin</th>
                  <th className="p-4">Model</th>
                  <th className="p-4">IP Address</th>
                  <th className="p-4">Integrity</th>
                  <th className="p-4 pr-6 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-white/[0.02]">
                    <td className="p-4 pl-6 font-black uppercase tracking-wider text-[10px] text-white">{log.action}</td>
                    <td className="p-4 text-white/60">{log.admin_name || 'System'}</td>
                    <td className="p-4 text-white/40">{log.model_type ? log.model_type.split('\\').pop() : 'N/A'}</td>
                    <td className="p-4 font-mono text-[10px] text-white/45">{log.ip_address || 'N/A'}</td>
                    <td className="p-4">
                      {log.is_verified ? (
                        <span className="px-2.5 py-1 rounded-full text-[8px] bg-green-500/10 text-green-400 font-black uppercase border border-green-500/20">Verified</span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[8px] bg-[#D90429]/10 text-[#D90429] font-black uppercase border border-[#D90429]/20">Tampered</span>
                      )}
                    </td>
                    <td className="p-4 pr-6 text-right text-white/40">{new Date(log.created_at).toLocaleString()}</td>
                  </tr>
                ))}
                {filteredLogs.length === 0 && (
                  <tr><td colSpan={6} className="p-10 text-center text-white/30">Hakuna logs zilizolingana na utafutaji.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {pagination && pagination.last_page > 1 && (
            <div className="p-4 flex items-center justify-between border-t border-white/5 text-[10px] font-bold text-white/40 uppercase tracking-wider">
              <span>Logs: {pagination.total}</span>
              <div className="flex gap-2">
                <button disabled={page <= 1} onClick={() => fetchLogs(page - 1)} className="p-1 border border-white/10 hover:bg-white/5 disabled:opacity-40 rounded-lg cursor-pointer"><ArrowLeft className="w-4 h-4" /></button>
                <button disabled={page >= pagination.last_page} onClick={() => fetchLogs(page + 1)} className="p-1 border border-white/10 hover:bg-white/5 disabled:opacity-40 rounded-lg cursor-pointer"><ArrowRight className="w-4 h-4" /></button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
