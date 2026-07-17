import React, { useEffect, useState } from 'react';
import adminApi from '../Utils/adminApi';
import CategoriesModule from '../Modules/CategoriesModule';
import { useAdminPagination } from '../Utils/useAdminPagination';
import { downloadCSV, downloadExcel, downloadPDF } from '../Utils/adminExports';

export default function Categories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const {
    getPaginatedItems,
    renderPageSizeSelector,
    renderPagination
  } = useAdminPagination();

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const response = await adminApi.get('/api/v1/admin/crud/categories');
      setCategories(response.data.categories || []);
    } catch {
      setErrorMsg('Imeshindwa kupakia kategoria.');
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchGroups = async () => {
    setLoadingGroups(true);
    try {
      const response = await adminApi.get('/api/v1/admin/crud/groups');
      setGroups(response.data.groups || []);
    } catch {
      setErrorMsg('Imeshindwa kupakia makundi.');
    } finally {
      setLoadingGroups(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchGroups();
  }, []);

  const handleExportCategories = (format: 'csv' | 'excel' | 'pdf') => {
    const headers = ['Category Name', 'Group Name', 'Nomination Fee (TZS)', 'Status', 'Voting State'];
    const rows = categories.map(c => [
      c.name,
      c.group?.name || c.group_name || 'N/A',
      String(c.nomination_fee),
      c.status,
      c.voting_enabled ? 'Enabled' : 'Disabled'
    ]);
    if (format === 'csv') downloadCSV('taphe_categories_export.csv', headers, rows);
    else if (format === 'excel') downloadExcel('taphe_categories_export.xls', headers, rows);
    else if (format === 'pdf') downloadPDF('Categories Directory', headers, rows);
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

      <CategoriesModule
        groups={groups}
        loadingGroups={loadingGroups}
        fetchGroups={fetchGroups}
        categories={categories}
        loadingCategories={loadingCategories}
        fetchCategories={fetchCategories}
        getPaginatedItems={getPaginatedItems}
        renderPageSizeSelector={renderPageSizeSelector}
        renderPagination={renderPagination}
        handleExportCategories={handleExportCategories}
        setErrorMsg={setErrorMsg}
        setSuccessMsg={setSuccessMsg}
      />
    </div>
  );
}
