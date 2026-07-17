import React, { useEffect, useState } from 'react';
import adminApi from '../Utils/adminApi';
import NomineesModule from '../Modules/NomineesModule';
import { useAdminPagination } from '../Utils/useAdminPagination';
import { downloadCSV, downloadExcel, downloadPDF } from '../Utils/adminExports';

export default function Nominees() {
  const [nominees, setNominees] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loadingNominees, setLoadingNominees] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const {
    getPaginatedItems,
    renderPageSizeSelector,
    renderPagination
  } = useAdminPagination();

  const fetchNominees = async () => {
    setLoadingNominees(true);
    try {
      const response = await adminApi.get('/api/v1/admin/crud/nominees');
      setNominees(response.data.nominees || []);
    } catch {
      setErrorMsg('Imeshindwa kupakia wagombea.');
    } finally {
      setLoadingNominees(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await adminApi.get('/api/v1/admin/crud/categories');
      setCategories(response.data.categories || []);
    } catch {
      console.error('Failed to load categories.');
    }
  };

  useEffect(() => {
    fetchNominees();
    fetchCategories();
  }, []);

  const handleExportNominees = (format: 'csv' | 'excel' | 'pdf') => {
    const headers = ['Nominee Name', 'Category Name', 'Status'];
    const rows = nominees.map(n => [
      n.name,
      n.category?.name || 'N/A',
      n.is_suspended ? 'Suspended' : 'Active'
    ]);
    if (format === 'csv') downloadCSV('taphe_nominees_export.csv', headers, rows);
    else if (format === 'excel') downloadExcel('taphe_nominees_export.xls', headers, rows);
    else if (format === 'pdf') downloadPDF('Nominees Directory', headers, rows);
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

      <NomineesModule
        nominees={nominees}
        categories={categories}
        loadingNominees={loadingNominees}
        fetchNominees={fetchNominees}
        getPaginatedItems={getPaginatedItems}
        renderPageSizeSelector={renderPageSizeSelector}
        renderPagination={renderPagination}
        handleExportNominees={handleExportNominees}
        setErrorMsg={setErrorMsg}
        setSuccessMsg={setSuccessMsg}
      />
    </div>
  );
}
