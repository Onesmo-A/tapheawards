import React, { useEffect, useState } from 'react';
import adminApi from '../Utils/adminApi';
import StandingsModule from '../Modules/StandingsModule';
import { useAdminPagination } from '../Utils/useAdminPagination';
import { downloadCSV, downloadExcel, downloadPDF } from '../Utils/adminExports';

export default function Standings() {
  const [standings, setStandings] = useState<any[]>([]);
  const [loadingStandings, setLoadingStandings] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const {
    getPaginatedItems,
    renderPagination
  } = useAdminPagination();

  const fetchStandings = async () => {
    setLoadingStandings(true);
    try {
      const response = await adminApi.get('/api/v1/admin/votes/standings');
      setStandings(response.data.standings || []);
    } catch {
      setErrorMsg('Imeshindwa kupakia msimamo wa kura.');
    } finally {
      setLoadingStandings(false);
    }
  };

  useEffect(() => {
    fetchStandings();
  }, []);

  return (
    <div className="space-y-6">
      {errorMsg && (
        <div className="p-4 bg-[#D90429]/10 border border-[#D90429]/20 text-[#D90429] text-[11px] font-bold uppercase rounded-2xl text-center mb-6 tracking-wider">
          {errorMsg}
        </div>
      )}

      <StandingsModule
        standings={standings}
        loadingStandings={loadingStandings}
        getPaginatedItems={getPaginatedItems}
        renderPagination={renderPagination}
        downloadCSV={downloadCSV}
        downloadExcel={downloadExcel}
        downloadPDF={downloadPDF}
      />
    </div>
  );
}
