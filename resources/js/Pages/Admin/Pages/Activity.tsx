import React, { useEffect, useState } from 'react';
import adminApi from '../Utils/adminApi';
import ActivityModule from '../Modules/ActivityModule';
import { useAdminPagination } from '../Utils/useAdminPagination';
import { FileText, Mail, Users } from 'lucide-react';

type ActivityTab = 'applications' | 'suggestions' | 'users';

export default function Activity() {
  const [activeSubTab, setActiveSubTab] = useState<ActivityTab>('applications');
  const [applications, setApplications] = useState<any[]>([]);
  const [loadingApplications, setLoadingApplications] = useState(true);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const {
    getPaginatedItems,
    renderPageSizeSelector,
    renderPagination
  } = useAdminPagination();

  const fetchApplications = async () => {
    setLoadingApplications(true);
    try {
      const response = await adminApi.get('/api/v1/admin/activity/applications');
      setApplications(response.data.applications || []);
    } catch {
      setErrorMsg('Imeshindwa kupakia maombi ya wagombea.');
    } finally {
      setLoadingApplications(false);
    }
  };

  const fetchSuggestions = async () => {
    setLoadingSuggestions(true);
    try {
      const response = await adminApi.get('/api/v1/admin/activity/suggestions');
      setSuggestions(response.data.suggestions || []);
    } catch {
      setErrorMsg('Imeshindwa kupakia mapendekezo.');
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await adminApi.get('/api/v1/admin/activity/users');
      setUsers(response.data.users || []);
    } catch {
      setErrorMsg('Imeshindwa kupakia watumiaji.');
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (activeSubTab === 'applications') fetchApplications();
    if (activeSubTab === 'suggestions') fetchSuggestions();
    if (activeSubTab === 'users') fetchUsers();
  }, [activeSubTab]);

  const tabs = [
    { key: 'applications' as const, label: 'Applications', Icon: FileText },
    { key: 'suggestions' as const, label: 'Suggestions', Icon: Mail },
    { key: 'users' as const, label: 'Users', Icon: Users },
  ];

  return (
    <div className="space-y-6">
      <div className="flex gap-4 border-b border-white/5 pb-4 overflow-x-auto scrollbar-none">
        {tabs.map(({ key, label, Icon }) => (
          <button
            key={key}
            onClick={() => setActiveSubTab(key)}
            className={`px-4 py-2 text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 border-b-2 shrink-0 ${
              activeSubTab === key ? 'border-[#D90429] text-[#D90429]' : 'border-transparent text-white/40 hover:text-white'
            }`}
          >
            <Icon className="w-3.5 h-3.5" /> {label}
          </button>
        ))}
      </div>

      {errorMsg && (
        <div className="p-4 bg-[#D90429]/10 border border-[#D90429]/20 text-[#D90429] text-[11px] font-bold uppercase rounded-lg text-center mb-6 tracking-wider">
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-500 text-[11px] font-bold uppercase rounded-lg text-center mb-6 tracking-wider">
          {successMsg}
        </div>
      )}

      <ActivityModule
        activeTab={activeSubTab}
        applications={applications}
        loadingApplications={loadingApplications}
        fetchApplications={fetchApplications}
        suggestions={suggestions}
        loadingSuggestions={loadingSuggestions}
        fetchSuggestions={fetchSuggestions}
        users={users}
        loadingUsers={loadingUsers}
        transactions={[]}
        loadingTransactions={false}
        fetchTransactions={() => undefined}
        txPagination={null}
        txPage={1}
        setTxPage={() => undefined}
        txSearch=""
        setTxSearch={() => undefined}
        fullLogs={[]}
        loadingLogs={false}
        fetchAuditLogs={() => undefined}
        logsPagination={null}
        logsPage={1}
        getPaginatedItems={getPaginatedItems}
        renderPageSizeSelector={renderPageSizeSelector}
        renderPagination={renderPagination}
        setErrorMsg={setErrorMsg}
        setSuccessMsg={setSuccessMsg}
      />
    </div>
  );
}