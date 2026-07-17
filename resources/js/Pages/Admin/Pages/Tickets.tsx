import React, { useEffect, useState } from 'react';
import adminApi from '../Utils/adminApi';
import RegistryModule from '../Modules/RegistryModule';
import { useAdminPagination } from '../Utils/useAdminPagination';
import { downloadCSV, downloadExcel, downloadPDF } from '../Utils/adminExports';

export default function Tickets() {
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loadingPurchases, setLoadingPurchases] = useState(true);
  const [ticketTypes, setTicketTypes] = useState<any[]>([]);
  const [loadingTicketTypes, setLoadingTicketTypes] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const {
    getPaginatedItems,
    renderPageSizeSelector,
    renderPagination
  } = useAdminPagination();

  const fetchTicketPurchases = async () => {
    setLoadingPurchases(true);
    try {
      const response = await adminApi.get('/api/v1/admin/registry/tickets');
      setPurchases(response.data.purchases || []);
    } catch {
      setErrorMsg('Imeshindwa kupakia rejesta ya mauzo ya tiketi.');
    } finally {
      setLoadingPurchases(false);
    }
  };

  const fetchTicketTypes = async () => {
    setLoadingTicketTypes(true);
    try {
      const response = await adminApi.get('/api/v1/admin/registry/ticket-types');
      setTicketTypes(response.data.ticket_types || []);
    } catch {
      setErrorMsg('Imeshindwa kupakia aina za tiketi.');
    } finally {
      setLoadingTicketTypes(false);
    }
  };

  useEffect(() => {
    fetchTicketPurchases();
    fetchTicketTypes();
  }, []);

  const handleExportTickets = (format: 'csv' | 'excel' | 'pdf') => {
    const headers = ['Buyer Name', 'Phone Number', 'Email', 'Ticket Type', 'Quantity', 'Total Amount (TZS)', 'Payment Status', 'Ticket Codes', 'Checked In'];
    const rows = purchases.map(p => [
      p.purchaser_name,
      p.purchaser_phone,
      p.purchaser_email,
      p.ticket_type?.name || 'N/A',
      String(p.quantity),
      String(p.total_amount),
      p.status,
      p.tickets.map((t: any) => t.ticket_code).join(' | '),
      p.tickets.filter((t: any) => t.checked_in_at).length + ' / ' + p.tickets.length
    ]);
    if (format === 'csv') downloadCSV('taphe_ticket_sales_export.csv', headers, rows);
    else if (format === 'excel') downloadExcel('taphe_ticket_sales_export.xls', headers, rows);
    else if (format === 'pdf') downloadPDF('Ticket Purchase Registry', headers, rows);
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
        activeTab="tickets"
        marathons={[]}
        loadingMarathons={false}
        fetchMarathons={() => {}}
        purchases={purchases}
        loadingPurchases={loadingPurchases}
        fetchTicketPurchases={fetchTicketPurchases}
        ticketTypes={ticketTypes}
        loadingTicketTypes={loadingTicketTypes}
        fetchTicketTypes={fetchTicketTypes}
        getPaginatedItems={getPaginatedItems}
        renderPageSizeSelector={renderPageSizeSelector}
        renderPagination={renderPagination}
        handleExportMarathons={() => {}}
        handleExportTickets={handleExportTickets}
        setErrorMsg={setErrorMsg}
        setSuccessMsg={setSuccessMsg}
      />
    </div>
  );
}
