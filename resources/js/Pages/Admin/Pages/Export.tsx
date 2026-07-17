import React, { useEffect, useState } from 'react';
import adminApi from '../Utils/adminApi';
import ExportModule from '../Modules/ExportModule';
import { downloadCSV, downloadExcel, downloadPDF } from '../Utils/adminExports';

export default function Export() {
  const [categories, setCategories] = useState<any[]>([]);
  const [nominees, setNominees] = useState<any[]>([]);
  const [marathons, setMarathons] = useState<any[]>([]);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchExportData = async () => {
    try {
      const catRes = await adminApi.get('/api/v1/admin/crud/categories');
      setCategories(catRes.data.categories || []);

      const nomRes = await adminApi.get('/api/v1/admin/crud/nominees');
      setNominees(nomRes.data.nominees || []);

      const maraRes = await adminApi.get('/api/v1/admin/registry/marathons');
      setMarathons(maraRes.data.registrations || []);

      const ticketRes = await adminApi.get('/api/v1/admin/registry/tickets');
      setPurchases(ticketRes.data.purchases || []);
    } catch {
      setErrorMsg('Imeshindwa kupakia data za ripoti.');
    }
  };

  useEffect(() => {
    fetchExportData();
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

      <ExportModule
        handleExportCategories={handleExportCategories}
        handleExportNominees={handleExportNominees}
        handleExportMarathons={handleExportMarathons}
        handleExportTickets={handleExportTickets}
      />
    </div>
  );
}
