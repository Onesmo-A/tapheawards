import React, { useState } from 'react';
import adminApi from '../Utils/adminApi';
import { Search, Loader2, FileSpreadsheet, ArrowLeft, ArrowRight, Plus, Trash2, Edit2, ToggleLeft, ToggleRight, DollarSign, Ticket, CheckCircle, HelpCircle, Camera } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';

interface RegistryModuleProps {
  activeTab: 'marathon' | 'tickets';
  marathons: any[];
  loadingMarathons: boolean;
  fetchMarathons: () => void;
  purchases: any[];
  loadingPurchases: boolean;
  fetchTicketPurchases: () => void;
  ticketTypes?: any[];
  loadingTicketTypes?: boolean;
  fetchTicketTypes?: () => void;
  getPaginatedItems: (items: any[], key: string) => any[];
  renderPageSizeSelector: (key: string) => React.ReactNode;
  renderPagination: (key: string, total: number) => React.ReactNode;
  handleExportMarathons: (format: 'csv' | 'excel' | 'pdf') => void;
  handleExportTickets: (format: 'csv' | 'excel' | 'pdf') => void;
  setErrorMsg: (msg: string) => void;
  setSuccessMsg: (msg: string) => void;
}

export default function RegistryModule({
  activeTab,
  marathons,
  loadingMarathons,
  fetchMarathons,
  purchases,
  loadingPurchases,
  fetchTicketPurchases,
  ticketTypes = [],
  loadingTicketTypes = false,
  fetchTicketTypes = () => {},
  getPaginatedItems,
  renderPageSizeSelector,
  renderPagination,
  handleExportMarathons,
  handleExportTickets,
  setErrorMsg,
  setSuccessMsg
}: RegistryModuleProps) {
  const [marathonSearch, setMarathonSearch] = useState('');
  const [ticketSearch, setTicketSearch] = useState('');
  const [checkingInCode, setCheckingInCode] = useState('');

  // QR code scanner states & handlers
  const [showScanner, setShowScanner] = useState(false);
  const [scannerInstance, setScannerInstance] = useState<any>(null);

  const startScanner = async () => {
    setShowScanner(true);
    setErrorMsg('');
    setSuccessMsg('');
    setTimeout(() => {
      try {
        const html5QrCode = new Html5Qrcode("qr-reader");
        setScannerInstance(html5QrCode);
        html5QrCode.start(
          { facingMode: "environment" },
          {
            fps: 15,
            qrbox: { width: 250, height: 250 }
          },
          (decodedText) => {
            handleCheckInByCode(decodedText);
            html5QrCode.stop().then(() => {
              setShowScanner(false);
            }).catch(err => {
              console.error("Scanner stop error:", err);
              setShowScanner(false);
            });
          },
          () => {}
        ).catch(err => {
          console.error("Scanner start error:", err);
          setErrorMsg("Failed to start camera scanner. Please grant camera permissions.");
          setShowScanner(false);
        });
      } catch (e) {
        console.error("Scanner initialization error:", e);
        setErrorMsg("Failed to initialize scanner.");
        setShowScanner(false);
      }
    }, 500);
  };

  const stopScanner = async () => {
    if (scannerInstance) {
      try {
        await scannerInstance.stop();
      } catch (err) {
        console.error("Error stopping scanner:", err);
      }
      setScannerInstance(null);
    }
    setShowScanner(false);
  };

  const handleCheckInByCode = async (code: string) => {
    try {
      setErrorMsg('');
      setSuccessMsg('');
      const response = await adminApi.post('/api/v1/admin/registry/tickets/check-in-by-code', {
        ticket_code: code.trim()
      });
      setSuccessMsg(response.data.message);
      fetchTicketPurchases();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || `Ticket code "${code}" check-in failed.`);
    }
  };

  // Ticket sub-tab state
  const [ticketSubTab, setTicketSubTab] = useState<'registry' | 'types'>('registry');

  // Ticket Type Form states
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [editingTypeId, setEditingTypeId] = useState<string | null>(null);
  const [typeForm, setTypeForm] = useState({
    name: '',
    description: '',
    price: '0',
    quantity_available: '',
    is_active: true,
    features: ''
  });

  const handleCheckInTicket = async (ticketId: string) => {
    try {
      const response = await adminApi.post(`/api/v1/admin/registry/tickets/${ticketId}/check-in`);
      setSuccessMsg(response.data.message);
      fetchTicketPurchases();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Checking-in failed.');
    }
  };

  // Ticket Type CRUD Handlers
  const openAddType = () => {
    setEditingTypeId(null);
    setTypeForm({
      name: '',
      description: '',
      price: '0',
      quantity_available: '',
      is_active: true,
      features: ''
    });
    setShowTypeModal(true);
  };

  const openEditType = (type: any) => {
    setEditingTypeId(type.id);
    setTypeForm({
      name: type.name || '',
      description: type.description || '',
      price: String(type.price || 0),
      quantity_available: type.quantity_available !== null ? String(type.quantity_available) : '',
      is_active: !!type.is_active,
      features: Array.isArray(type.features) ? type.features.join(', ') : ''
    });
    setShowTypeModal(true);
  };

  const handleSaveType = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    const payload = {
      ...typeForm,
      price: Number(typeForm.price),
      quantity_available: typeForm.quantity_available !== '' ? Number(typeForm.quantity_available) : null,
      features: typeForm.features.split(',').map(f => f.trim()).filter(Boolean)
    };

    try {
      if (editingTypeId) {
        await adminApi.put(`/api/v1/admin/registry/ticket-types/${editingTypeId}`, payload);
        setSuccessMsg('Aina ya tiketi imesasishwa.');
      } else {
        await adminApi.post('/api/v1/admin/registry/ticket-types', payload);
        setSuccessMsg('Aina mpya ya tiketi imeundwa.');
      }
      setShowTypeModal(false);
      fetchTicketTypes();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Imeshindwa kuhifadhi aina ya tiketi.');
    }
  };

  const handleToggleTypeStatus = async (id: string) => {
    try {
      await adminApi.post(`/api/v1/admin/registry/ticket-types/${id}/toggle-status`);
      setSuccessMsg('Hali ya aina ya tiketi imebadilishwa.');
      fetchTicketTypes();
    } catch {
      setErrorMsg('Imeshindwa kubadilisha hali.');
    }
  };

  const handleDeleteType = async (id: string) => {
    if (!window.confirm('Je, una uhakika unataka kufuta aina hii ya tiketi?')) return;
    try {
      await adminApi.delete(`/api/v1/admin/registry/ticket-types/${id}`);
      setSuccessMsg('Aina ya tiketi imefutwa.');
      fetchTicketTypes();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Imeshindwa kufuta aina ya tiketi.');
    }
  };

  // Filtration
  const filteredMarathons = marathons.filter(m => 
    m.full_name.toLowerCase().includes(marathonSearch.toLowerCase()) || 
    m.phone_number.includes(marathonSearch) || 
    (m.unique_code || '').toLowerCase().includes(marathonSearch.toLowerCase())
  );

  const filteredTickets = purchases.filter(p => 
    p.purchaser_name.toLowerCase().includes(ticketSearch.toLowerCase()) || 
    p.purchaser_phone.includes(ticketSearch) || 
    p.tickets.some((t: any) => t.ticket_code.toLowerCase().includes(ticketSearch.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {activeTab === 'marathon' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center gap-4">
            <div className="relative max-w-xs flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="text"
                placeholder="Search runners by name, phone, code..."
                value={marathonSearch}
                onChange={(e) => setMarathonSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#0b0b0b] border border-white/10 rounded-xl text-xs text-white focus:border-[#D90429] outline-none"
              />
            </div>
            <div className="flex gap-1 shrink-0">
              <button
                onClick={() => handleExportMarathons('csv')}
                className="px-2.5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl cursor-pointer"
              >
                CSV
              </button>
              <button
                onClick={() => handleExportMarathons('excel')}
                className="px-2.5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl cursor-pointer"
              >
                EXCEL
              </button>
              <button
                onClick={() => handleExportMarathons('pdf')}
                className="px-2.5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl cursor-pointer"
              >
                PDF
              </button>
            </div>
          </div>

          {loadingMarathons ? (
            <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#D90429]" /></div>
          ) : (
            <div className="bg-[#0b0b0b] border border-white/5 rounded-3xl overflow-hidden">
              <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                <h4 className="text-xs font-black uppercase text-white/40 tracking-wider">Registered Runners</h4>
                {renderPageSizeSelector('marathon')}
              </div>
              <table className="w-full text-left text-xs font-light">
                <thead>
                  <tr className="bg-white/[0.01] border-b border-white/5 text-[9px] font-black uppercase tracking-wider text-white/40">
                    <th className="p-4 pl-6">Code</th>
                    <th className="p-4">Full Name</th>
                    <th className="p-4">Contact</th>
                    <th className="p-4">Race Type</th>
                    <th className="p-4">T-Shirt</th>
                    <th className="p-4 pr-6 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {getPaginatedItems(filteredMarathons, 'marathon').map(m => (
                    <tr key={m.id} className="hover:bg-white/[0.01]">
                      <td className="p-4 pl-6 font-mono text-[#D90429] font-bold text-[10px]">{m.unique_code}</td>
                      <td className="p-4 font-bold text-white">{m.full_name}</td>
                      <td className="p-4 text-white/60">{m.phone_number}<br />{m.email || 'N/A'}</td>
                      <td className="p-4 uppercase text-white/60">{m.race_type || 'N/A'}</td>
                      <td className="p-4 uppercase text-white/40">{m.tshirt_size || 'N/A'}</td>
                      <td className="p-4 pr-6 text-right">
                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase border ${m.status === 'completed' ? 'bg-green-500/10 text-green-500 border-green-500/15' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/15'}`}>{m.status}</span>
                      </td>
                    </tr>
                  ))}
                  {filteredMarathons.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-white/30 text-xs">Hakuna washiriki waliopatikana.</td>
                    </tr>
                  )}
                </tbody>
              </table>
              {renderPagination('marathon', filteredMarathons.length)}
            </div>
          )}
        </div>
      )}

      {activeTab === 'tickets' && (
        <div className="space-y-6">
          {/* STATS CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Total Sales */}
            <div className="p-5 bg-[#0b0b0b] border border-white/5 rounded-3xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-wider text-white/40">Total Sales</p>
                <p className="text-lg font-black text-white mt-0.5">
                  {purchases
                    .filter(p => p.status === 'completed')
                    .reduce((sum, p) => sum + Number(p.total_amount || 0), 0)
                    .toLocaleString()} <span className="text-[10px] text-white/40">TZS</span>
                </p>
              </div>
            </div>

            {/* Card 2: Tickets Sold */}
            <div className="p-5 bg-[#0b0b0b] border border-white/5 rounded-3xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#D90429]/10 border border-[#D90429]/20 flex items-center justify-center text-[#D90429] shrink-0">
                <Ticket className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-wider text-white/40">Tickets Sold</p>
                <p className="text-lg font-black text-white mt-0.5">
                  {purchases
                    .filter(p => p.status === 'completed')
                    .reduce((sum, p) => sum + Number(p.quantity || 0), 0)} <span className="text-[10px] text-white/40">Tickets</span>
                </p>
              </div>
            </div>

            {/* Card 3: Checked In */}
            <div className="p-5 bg-[#0b0b0b] border border-white/5 rounded-3xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 shrink-0">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-wider text-white/40">Checked-In Guests</p>
                <p className="text-lg font-black text-white mt-0.5">
                  {purchases
                    .flatMap(p => p.tickets || [])
                    .filter(t => t.checked_in_at)
                    .length} <span className="text-[10px] text-white/40">Checked In</span>
                </p>
              </div>
            </div>

            {/* Card 4: Ticket Types Count */}
            <div className="p-5 bg-[#0b0b0b] border border-white/5 rounded-3xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-wider text-white/40">Ticket Types</p>
                <p className="text-lg font-black text-white mt-0.5">
                  {ticketTypes.length} <span className="text-[10px] text-white/40">Types</span>
                </p>
              </div>
            </div>
          </div>

          {/* SUBTAB NAVIGATION */}
          <div className="flex gap-4 border-b border-white/5 pb-1">
            <button
              onClick={() => setTicketSubTab('registry')}
              className={`pb-3 text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer border-b-2 ${
                ticketSubTab === 'registry' ? 'border-[#D90429] text-[#D90429]' : 'border-transparent text-white/40 hover:text-white'
              }`}
            >
              Sales Registry
            </button>
            <button
              onClick={() => setTicketSubTab('types')}
              className={`pb-3 text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer border-b-2 ${
                ticketSubTab === 'types' ? 'border-[#D90429] text-[#D90429]' : 'border-transparent text-white/40 hover:text-white'
              }`}
            >
              Ticket Types Manager
            </button>
          </div>

          {/* SUBTAB 1: PURCHASES REGISTRY */}
          {ticketSubTab === 'registry' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4 flex-grow max-w-md w-full">
                  <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      type="text"
                      placeholder="Search buyer name, email, or ticket code..."
                      value={ticketSearch}
                      onChange={(e) => setTicketSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-[#0b0b0b] border border-white/10 rounded-xl text-xs text-white focus:border-[#D90429] outline-none"
                    />
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => handleExportTickets('csv')}
                      className="px-2.5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl cursor-pointer"
                    >
                      CSV
                    </button>
                    <button
                      onClick={() => handleExportTickets('excel')}
                      className="px-2.5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl cursor-pointer"
                    >
                      EXCEL
                    </button>
                    <button
                      onClick={() => handleExportTickets('pdf')}
                      className="px-2.5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl cursor-pointer"
                    >
                      PDF
                    </button>
                  </div>
                </div>

                {/* Direct scan input check-in */}
                <div className="flex gap-2 shrink-0 w-full sm:w-auto">
                  <input
                    type="text"
                    placeholder="Enter Ticket Code..."
                    value={checkingInCode}
                    onChange={(e) => setCheckingInCode(e.target.value)}
                    className="px-4 py-2.5 bg-[#0b0b0b] border border-white/10 rounded-xl text-xs text-white outline-none focus:border-[#D90429] flex-grow sm:flex-grow-0"
                  />
                  <button 
                    onClick={() => {
                      if (checkingInCode.trim()) {
                        handleCheckInByCode(checkingInCode);
                        setCheckingInCode('');
                      } else {
                        setErrorMsg('Tafadhali ingiza code ya tiketi.');
                      }
                    }}
                    className="px-4 py-2.5 bg-[#D90429] text-[10px] font-black uppercase tracking-widest rounded-xl cursor-pointer text-white hover:bg-[#B8031F]"
                  >
                    Check In
                  </button>
                  <button 
                    onClick={startScanner}
                    className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl flex items-center justify-center gap-1.5 cursor-pointer text-[10px] font-black uppercase tracking-widest shrink-0"
                    title="Scan QR Code via Camera"
                  >
                    <Camera className="w-3.5 h-3.5 text-[#D90429]" /> Scan QR
                  </button>
                </div>
              </div>

              {loadingPurchases ? (
                <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#D90429]" /></div>
              ) : (
                <div className="bg-[#0b0b0b] border border-white/5 rounded-3xl overflow-hidden">
                  <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                    <h4 className="text-xs font-black uppercase text-white/40 tracking-wider">Ticket Purchases</h4>
                    {renderPageSizeSelector('tickets')}
                  </div>
                  <table className="w-full text-left text-xs font-light">
                    <thead>
                      <tr className="bg-white/[0.01] border-b border-white/5 text-[9px] font-black uppercase tracking-wider text-white/40">
                        <th className="p-4 pl-6">Buyer</th>
                        <th className="p-4">Ticket Type</th>
                        <th className="p-4">Quantity</th>
                        <th className="p-4">Ticket Codes / Check-in</th>
                        <th className="p-4">Total (TZS)</th>
                        <th className="p-4 pr-6 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {getPaginatedItems(filteredTickets, 'tickets').map(p => (
                        <tr key={p.id} className="hover:bg-white/[0.01]">
                          <td className="p-4 pl-6 font-bold text-white">{p.purchaser_name}<br /><span className="text-white/45 font-light">{p.purchaser_phone}</span></td>
                          <td className="p-4 text-white/60">{p.ticket_type?.name || 'N/A'}</td>
                          <td className="p-4 text-white/80">{p.quantity}</td>
                          <td className="p-4 space-y-1">
                            {p.tickets.map((t: any) => (
                              <div key={t.id} className="flex items-center gap-2">
                                <span className="font-mono text-[10px] text-white/50">{t.ticket_code}</span>
                                {t.checked_in_at ? (
                                  <span className="text-[8px] font-black uppercase text-green-500">Checked In</span>
                                ) : (
                                  <button onClick={() => handleCheckInTicket(t.id)} className="px-2 py-0.5 bg-green-500/10 hover:bg-green-500/20 text-green-500 border border-green-500/10 rounded text-[8px] font-bold uppercase cursor-pointer">Check In</button>
                                )}
                              </div>
                            ))}
                          </td>
                          <td className="p-4 font-black text-white">{Number(p.total_amount).toLocaleString()}</td>
                          <td className="p-4 pr-6 text-right">
                            <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase border ${p.status === 'completed' ? 'bg-green-500/10 text-green-500 border-green-500/15' : 'bg-white/5 text-white/30 border-white/5'}`}>{p.status}</span>
                          </td>
                        </tr>
                      ))}
                      {filteredTickets.length === 0 && (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-white/30 text-xs">No ticket purchases found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  {renderPagination('tickets', filteredTickets.length)}
                </div>
              )}
            </div>
          )}

          {/* SUBTAB 2: TICKET TYPES CRUD */}
          {ticketSubTab === 'types' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-black uppercase text-white tracking-wider">Created Ticket Types</h4>
                  <p className="text-[9px] text-white/35">Create and edit ticket types and price levels for TAPHE Awards</p>
                </div>
                <button
                  onClick={openAddType}
                  className="px-4 py-2.5 bg-[#D90429] hover:bg-[#B8031F] text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center gap-1.5 cursor-pointer text-white transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Ticket Type
                </button>
              </div>

              {loadingTicketTypes ? (
                <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#D90429]" /></div>
              ) : ticketTypes.length === 0 ? (
                <div className="py-20 text-center text-white/20 text-xs uppercase tracking-widest font-bold">No ticket types created yet.</div>
              ) : (
                <div className="bg-[#0b0b0b] border border-white/5 rounded-3xl overflow-hidden">
                  <table className="w-full text-left text-xs font-light">
                    <thead>
                      <tr className="bg-white/[0.01] border-b border-white/5 text-[9px] font-black uppercase tracking-wider text-white/40">
                        <th className="p-4 pl-6">Ticket Type Name</th>
                        <th className="p-4">Price</th>
                        <th className="p-4">Limit (Tickets Available)</th>
                        <th className="p-4">Features</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 pr-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {ticketTypes.map(type => (
                        <tr key={type.id} className="hover:bg-white/[0.01] transition-colors">
                          <td className="p-4 pl-6">
                            <span className="font-bold text-white text-xs">{type.name}</span>
                            {type.description && <p className="text-[10px] text-white/35 mt-0.5 leading-relaxed">{type.description}</p>}
                          </td>
                          <td className="p-4 text-white font-black">{Number(type.price).toLocaleString()} TZS</td>
                          <td className="p-4 text-white/50">{type.quantity_available !== null ? `${type.quantity_available} Available` : 'No Limit'}</td>
                          <td className="p-4 max-w-[200px]">
                            {type.features && type.features.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {type.features.map((f: string, i: number) => (
                                  <span key={i} className="px-1.5 py-0.5 rounded bg-white/5 border border-white/5 text-[8px] text-white/50">{f}</span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-white/20">—</span>
                            )}
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold border ${
                              type.is_active ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                            }`}>{type.is_active ? 'Active' : 'Inactive'}</span>
                          </td>
                          <td className="p-4 pr-6">
                            <div className="flex items-center gap-2 justify-end">
                              <button
                                onClick={() => handleToggleTypeStatus(type.id)}
                                title={type.is_active ? 'Deactivate' : 'Activate'}
                                className={`p-1.5 border rounded-lg cursor-pointer transition-all ${
                                  type.is_active
                                    ? 'border-orange-500/30 text-orange-400 hover:bg-orange-500/10'
                                    : 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'
                                }`}
                              >
                                {type.is_active ? <ToggleRight className="w-3.5 h-3.5" /> : <ToggleLeft className="w-3.5 h-3.5" />}
                              </button>
                              <button
                                onClick={() => openEditType(type)}
                                title="Edit"
                                className="p-1.5 border border-white/10 hover:bg-white/5 rounded-lg text-white/50 hover:text-white cursor-pointer transition-all"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteType(type.id)}
                                title="Delete"
                                className="p-1.5 border border-[#D90429]/20 hover:bg-[#D90429]/10 rounded-lg text-[#D90429] cursor-pointer transition-all"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TICKET TYPE MODAL */}
      {showTypeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#0b0b0b] border border-white/10 rounded-[32px] p-8 space-y-6 text-left max-h-[90vh] overflow-y-auto scrollbar-none">
            <div>
              <h4 className="text-sm font-black uppercase tracking-wider text-[#D90429]">
                {editingTypeId ? 'Edit Ticket Type' : 'Create Ticket Type'}
              </h4>
              <p className="text-[9px] text-white/35 mt-1">Configure price, name, available capacity, and features</p>
            </div>

            <form onSubmit={handleSaveType} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-white/45 uppercase tracking-wider">Ticket Name *</label>
                <input
                  type="text"
                  required
                  value={typeForm.name}
                  onChange={(e) => setTypeForm({ ...typeForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs outline-none focus:border-[#D90429] text-white transition-colors"
                  placeholder="VIP Ticket, Regular Ticket, VVIP Table, n.k."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-white/45 uppercase tracking-wider">Price (TZS) *</label>
                  <input
                    type="number"
                    required
                    value={typeForm.price}
                    onChange={(e) => setTypeForm({ ...typeForm, price: e.target.value })}
                    className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs outline-none focus:border-[#D90429] text-white transition-colors"
                    placeholder="50000"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-white/45 uppercase tracking-wider">Ticket Capacity Limit</label>
                  <input
                    type="number"
                    value={typeForm.quantity_available}
                    onChange={(e) => setTypeForm({ ...typeForm, quantity_available: e.target.value })}
                    className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs outline-none focus:border-[#D90429] text-white transition-colors"
                    placeholder="Leave blank for unlimited"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-white/45 uppercase tracking-wider">Ticket Description</label>
                <textarea
                  value={typeForm.description}
                  onChange={(e) => setTypeForm({ ...typeForm, description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs outline-none focus:border-[#D90429] h-16 resize-none text-white transition-colors"
                  placeholder="Brief description..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-white/45 uppercase tracking-wider">Ticket Features (comma-separated)</label>
                <input
                  type="text"
                  value={typeForm.features}
                  onChange={(e) => setTypeForm({ ...typeForm, features: e.target.value })}
                  className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs outline-none focus:border-[#D90429] text-white transition-colors"
                  placeholder="Free drinks, VIP sitting, buffet, etc."
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-white/45 uppercase tracking-wider">Status</label>
                <button
                  type="button"
                  onClick={() => setTypeForm({ ...typeForm, is_active: !typeForm.is_active })}
                  className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                    typeForm.is_active
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'bg-orange-500/10 border-orange-500/30 text-orange-400'
                  }`}
                >
                  {typeForm.is_active ? '● Active' : '● Inactive'}
                </button>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-grow py-3 bg-[#D90429] hover:bg-[#B8031F] text-[10px] font-black uppercase tracking-widest rounded-2xl cursor-pointer text-white transition-colors">
                  {editingTypeId ? 'Update' : 'Create'}
                </button>
                <button type="button" onClick={() => setShowTypeModal(false)} className="px-5 py-3 border border-white/10 hover:bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest cursor-pointer text-white transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* QR SCANNER MODAL */}
      {showScanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[#0b0b0b] border border-white/10 rounded-[32px] p-6 space-y-6 text-center">
            <div>
              <h4 className="text-sm font-black uppercase tracking-wider text-[#D90429] flex items-center justify-center gap-1.5">
                <Camera className="w-4 h-4" /> Scan Ticket QR Code
              </h4>
              <p className="text-[9px] text-white/35 mt-1">Point your camera at the ticket QR code to check in</p>
            </div>

            {/* Container for scanner */}
            <div className="relative border border-white/10 rounded-2xl overflow-hidden bg-black aspect-square">
              <div id="qr-reader" className="w-full h-full"></div>
            </div>

            <button 
              type="button" 
              onClick={stopScanner} 
              className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest cursor-pointer transition-colors"
            >
              Cancel Scan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
