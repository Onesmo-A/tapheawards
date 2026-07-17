import React, { useEffect, useState } from 'react';
import adminApi from '../Utils/adminApi';
import WinnersModule from '../Modules/WinnersModule';
import { useAdminPagination } from '../Utils/useAdminPagination';

export default function Winners() {
  const [winners, setWinners] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [nominees, setNominees] = useState<any[]>([]);
  const [loadingWinners, setLoadingWinners] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const {
    getPaginatedItems,
    renderPageSizeSelector,
    renderPagination
  } = useAdminPagination();

  const fetchWinners = async () => {
    setLoadingWinners(true);
    try {
      const response = await adminApi.get('/api/v1/admin/crud/winners');
      setWinners(response.data.winners || []);
    } catch {
      setErrorMsg('Imeshindwa kupakia washindi.');
    } finally {
      setLoadingWinners(false);
    }
  };

  const fetchCategoriesAndNominees = async () => {
    try {
      const catRes = await adminApi.get('/api/v1/admin/crud/categories');
      setCategories(catRes.data.categories || []);

      const nomRes = await adminApi.get('/api/v1/admin/crud/nominees');
      setNominees(nomRes.data.nominees || []);
    } catch {
      console.error('Failed to load categories/nominees.');
    }
  };

  useEffect(() => {
    fetchWinners();
    fetchCategoriesAndNominees();
  }, []);

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

      <WinnersModule
        winners={winners}
        categories={categories}
        nominees={nominees}
        loadingWinners={loadingWinners}
        fetchWinners={fetchWinners}
        getPaginatedItems={getPaginatedItems}
        renderPageSizeSelector={renderPageSizeSelector}
        renderPagination={renderPagination}
        setErrorMsg={setErrorMsg}
        setSuccessMsg={setSuccessMsg}
      />
    </div>
  );
}
