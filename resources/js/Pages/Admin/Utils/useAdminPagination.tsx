import React, { useState } from 'react';

export function useAdminPagination() {
  const [currentPage, setCurrentPage] = useState<Record<string, number>>({});
  const [pageSizes, setPageSizes] = useState<Record<string, number>>({});

  const getPaginatedItems = (items: any[], key: string) => {
    const size = pageSizes[key] || 10;
    if (size === -1) return items;
    const page = currentPage[key] || 1;
    return items.slice((page - 1) * size, page * size);
  };

  const renderPageSizeSelector = (key: string) => {
    return (
      <div className="flex items-center gap-2 text-[9px] uppercase font-black text-white/40 tracking-wider">
        <span>Show</span>
        <select
          value={pageSizes[key] || 10}
          onChange={(e) => {
            setPageSizes({ ...pageSizes, [key]: Number(e.target.value) });
            setCurrentPage({ ...currentPage, [key]: 1 });
          }}
          className="px-2 py-1 bg-[#0b0b0b] border border-white/10 rounded-lg text-white font-bold outline-none cursor-pointer focus:border-[#D90429]"
        >
          <option value={5}>5 entries</option>
          <option value={10}>10 entries</option>
          <option value={25}>25 entries</option>
          <option value={50}>50 entries</option>
          <option value={100}>100 entries</option>
          <option value={-1}>All</option>
        </select>
      </div>
    );
  };

  const renderPagination = (key: string, total: number) => {
    const size = pageSizes[key] || 10;
    const page = currentPage[key] || 1;
    const totalPages = Math.ceil(total / size);
    if (size === -1 || total <= size) return null;

    return (
      <div className="p-4 bg-white/[0.01] border-t border-white/5 flex items-center justify-between text-[10px] text-white/40 font-bold uppercase tracking-wider">
        <div>
          Showing <span className="text-white">{(page - 1) * size + 1}</span> to{' '}
          <span className="text-white">{Math.min(total, page * size)}</span> of{' '}
          <span className="text-white">{total}</span> entries
        </div>
        <div className="flex gap-1.5">
          <button
            disabled={page === 1}
            onClick={() => setCurrentPage({ ...currentPage, [key]: page - 1 })}
            className="px-3 py-1.5 bg-black border border-white/10 hover:bg-white/5 text-white disabled:opacity-40 disabled:hover:bg-transparent rounded-xl transition-all cursor-pointer"
          >
            Prev
          </button>
          <button
            disabled={page === totalPages}
            onClick={() => setCurrentPage({ ...currentPage, [key]: page + 1 })}
            className="px-3 py-1.5 bg-black border border-white/10 hover:bg-white/5 text-white disabled:opacity-40 disabled:hover:bg-transparent rounded-xl transition-all cursor-pointer"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  return {
    currentPage,
    setCurrentPage,
    pageSizes,
    setPageSizes,
    getPaginatedItems,
    renderPageSizeSelector,
    renderPagination
  };
}
