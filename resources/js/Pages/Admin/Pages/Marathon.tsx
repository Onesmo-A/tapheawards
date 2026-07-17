import React, { useEffect, useState } from 'react';
import adminApi from '../Utils/adminApi';
import RegistryModule from '../Modules/RegistryModule';
import { useAdminPagination } from '../Utils/useAdminPagination';
import { downloadCSV, downloadExcel, downloadPDF } from '../Utils/adminExports';

export default function Marathon() {
  const [marathons, setMarathons] = useState<any[]>([]);
  const [loadingMarathons, setLoadingMarathons] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const {
    getPaginatedItems,
    renderPageSizeSelector,
    renderPagination
  } = useAdminPagination();

  const fetchMarathons = async () => {
    setLoadingMarathons(true);
    try {
      const response = await adminApi.get('/api/v1/admin/registry/marathons');
      setMarathons(response.data.registrations || []);
    } catch {
      setErrorMsg('Imeshindwa kupakia rejesta ya marathon.');
    } finally {
      setLoadingMarathons(false);
    }
  };

  useEffect(() => {
    fetchMarathons();
  }, []);

  const handleExportMarathons = (format: 'csv' | 'excel' | 'pdf') => {
    const headers = ['Unique Code', 'Full Name', 'Phone Number', 'Email Address', 'Race Type', 'T-Shirt Size', 'Payment Status', 'Created At'];
    const rows = marathons.map(m => [
      m.unique_code,
      m.full_name,
      m.phone_number,
      m.email || 'N/A',
      m.race_type || 'N/A',
      m.tshirt_size || 'N/A',
      m.status,
      m.created_at || ''
    ]);
    if (format === 'csv') downloadCSV('taphe_marathon_runners_export.csv', headers, rows);
    else if (format === 'excel') downloadExcel('taphe_marathon_runners_export.xls', headers, rows);
    else if (format === 'pdf') downloadPDF('Marathon Registrations Registry', headers, rows);
  };

  return (
    <div className="space-y-6">
      {errorMsg && (
        <div className="p-4 bg-[#D90429]/10 border border-[#D90429]/20 text-[#D90429] text-[11px] font-bold uppercase rounded-2xl text-center mb-6 tracking-wider">
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-500 text-[11px] font-bold uppercase rounded-2xl text-center mb-6 tracking-wider">
          {successMsg}
        </div>
      )}

      <RegistryModule
        activeTab="marathon"
        marathons={marathons}
        loadingMarathons={loadingMarathons}
        fetchMarathons={fetchMarathons}
        purchases={[]}
        loadingPurchases={false}
        fetchTicketPurchases={() => {}}
        getPaginatedItems={getPaginatedItems}
        renderPageSizeSelector={renderPageSizeSelector}
        renderPagination={renderPagination}
        handleExportMarathons={handleExportMarathons}
        handleExportTickets={() => {}}
        setErrorMsg={setErrorMsg}
        setSuccessMsg={setSuccessMsg}
      />
    </div>
  );
}
