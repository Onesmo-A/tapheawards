import React, { useEffect, useState } from 'react';
import adminApi from '../Utils/adminApi';
import VotesModule from '../Modules/VotesModule';
import { useAdminPagination } from '../Utils/useAdminPagination';
import { downloadCSV, downloadExcel, downloadPDF } from '../Utils/adminExports';

export default function Votes() {
  const [nominees, setNominees] = useState<any[]>([]);
  const [loadingNominees, setLoadingNominees] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const {
    getPaginatedItems,
    renderPageSizeSelector,
    renderPagination
  } = useAdminPagination();

  const fetchNominees = async () => {
    setLoadingNominees(true);
    try {
      // In votes page, we fetch nominee list with active vote counts
      const response = await adminApi.get('/api/v1/admin/nominees');
      setNominees(response.data.nominees || []);
    } catch {
      setErrorMsg('Imeshindwa kupakia orodha ya wagombea na kura zao.');
    } finally {
      setLoadingNominees(false);
    }
  };

  useEffect(() => {
    fetchNominees();
  }, []);

  const handleExportVotes = (format: 'csv' | 'excel' | 'pdf') => {
    const headers = ['Nominee Name', 'Category Name', 'Votes Count', 'Status'];
    const rows = nominees.map(n => [
      n.name,
      n.category_name || 'N/A',
      String(n.votes_count),
      n.is_suspended ? 'Suspended' : 'Active'
    ]);
    if (format === 'csv') downloadCSV('taphe_votes_standings_export.csv', headers, rows);
    else if (format === 'excel') downloadExcel('taphe_votes_standings_export.xls', headers, rows);
    else if (format === 'pdf') downloadPDF('Nominees & Votes Standings', headers, rows);
  };

  return (
    <div className="space-y-6">
      {errorMsg && (
        <div className="p-4 bg-[#D90429]/10 border border-[#D90429]/20 text-[#D90429] text-[11px] font-bold uppercase rounded-2xl text-center mb-6 tracking-wider">
          {errorMsg}
        </div>
      )}

      <VotesModule
        nominees={nominees}
        loadingNominees={loadingNominees}
        getPaginatedItems={getPaginatedItems}
        renderPageSizeSelector={renderPageSizeSelector}
        renderPagination={renderPagination}
        handleExportVotes={handleExportVotes}
      />
    </div>
  );
}
