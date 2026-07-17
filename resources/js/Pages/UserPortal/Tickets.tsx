import React, { useState, useEffect } from 'react';
import { Ticket, Calendar, ShieldCheck, Mail, Phone, ShoppingBag, Download } from 'lucide-react';
import axios from 'axios';

interface TicketData {
  id: string;
  ticket_code: string;
  is_checked_in: boolean;
  checked_in_at: string | null;
}

interface PurchaseData {
  id: string;
  purchaser_name: string;
  purchaser_email: string;
  purchaser_phone: string;
  quantity: number;
  total_amount: string;
  status: string;
  created_at: string;
  ticket_type?: {
    id: string;
    name: string;
  };
  tickets: TicketData[];
}

export default function Tickets() {
  const [purchases, setPurchases] = useState<PurchaseData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('user_token');
    axios.get('/api/v1/user/tickets', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        setPurchases(response.data.purchases);
      })
      .catch(err => {
        console.error('Failed to load tickets', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center space-y-4">
        <div className="w-8 h-8 border-4 border-t-red-600 border-white/10 rounded-full animate-spin" />
        <p className="text-[10px] font-black uppercase text-white/50 tracking-widest">Loading Tickets...</p>
      </div>
    );
  }

  // Filter completed purchases only (completed means payment is validated and tickets are generated)
  const completedPurchases = purchases.filter(p => p.status === 'completed');

  return (
    <div className="space-y-8 text-left">
      <div className="space-y-2">
        <span className="text-[10px] font-black text-[#D90429] uppercase tracking-widest font-outfit">Portal section</span>
        <h2 className="text-3xl font-outfit font-black uppercase tracking-tight text-white leading-none">
          Gala Banquet Seats
        </h2>
        <p className="text-xs text-white/50 leading-relaxed font-light font-inter max-w-xl">
          Review your purchased seats and validation codes. Present the ticket codes at the entry point of the grand banquet room for entry confirmation.
        </p>
      </div>

      {completedPurchases.length === 0 ? (
        <div className="rounded-3xl border border-white/5 bg-[#080506] p-12 text-center space-y-6">
          <div className="mx-auto w-12 h-12 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center text-white/30">
            <Ticket className="w-6 h-6" />
          </div>
          <div className="space-y-1.5 max-w-sm mx-auto">
            <h3 className="font-outfit text-xs font-black uppercase tracking-wider text-white">No Tickets Found</h3>
            <p className="text-xs text-white/40 leading-relaxed font-light font-inter">
              You haven't bought tickets or completed payments for seating reservations yet. Complete seat reservation checkout in the tickets section first.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-10">
          {completedPurchases.map(purchase => (
            <div
              key={purchase.id}
              className="rounded-3xl border border-white/5 bg-[#080506]/75 p-6 md:p-8 space-y-6 shadow-xl relative overflow-hidden"
            >
              {/* Checkout details Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-4">
                <div className="space-y-1">
                  <h3 className="font-outfit text-sm font-black uppercase text-white tracking-widest">
                    Receipt Ref: {purchase.id.substring(0, 8).toUpperCase()}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-white/40 font-light font-inter">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(purchase.created_at).toLocaleDateString()}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{purchase.ticket_type?.name}</span>
                    </span>
                  </div>
                </div>

                <div className="text-left md:text-right space-y-1">
                  <span className="text-[9px] font-black uppercase text-white/30 tracking-wider block">
                    Paid Amount
                  </span>
                  <span className="text-sm font-black text-[#D4A853] font-outfit block">
                    {Number(purchase.total_amount).toLocaleString()} TZS
                  </span>
                </div>
              </div>

              {/* Tickets grid layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {purchase.tickets.map((t, idx) => (
                  <div
                    key={t.id}
                    className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0c0c0c] to-[#050505] border border-white/10 hover:border-[#D4A853]/40 transition-all duration-300 p-6 flex flex-col justify-between h-44 shadow-lg shadow-black/35 group"
                  >
                    {/* Glowing corner dot */}
                    <div className="absolute top-0 right-0 w-16 h-16 bg-[#D4A853]/5 rounded-full blur-xl pointer-events-none group-hover:bg-[#D4A853]/10 transition-colors" />

                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <span className="text-[8px] font-black uppercase text-[#D4A853] tracking-widest block">
                          TAPHE GALA SEAT
                        </span>
                        <h4 className="text-[10px] font-bold text-white uppercase tracking-wider font-outfit">
                          {purchase.ticket_type?.name}
                        </h4>
                      </div>
                      <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/30">
                        <Ticket className="w-3.5 h-3.5 text-[#D4A853]" />
                      </div>
                    </div>

                    {/* Secure validation ticket code */}
                    <div className="space-y-1">
                      <span className="text-[8px] font-black uppercase text-white/30 tracking-wider block">
                        Secure Validation Code
                      </span>
                      <div className="font-outfit font-black text-xl md:text-2xl tracking-[0.25em] text-white select-all">
                        {t.ticket_code}
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-[9px] text-white/40 border-t border-white/5 pt-2 mt-2">
                      <div className="flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
                        <span>Valid Invitation</span>
                      </div>
                      <span className="text-[8px] font-semibold text-white/20">
                        Ticket {idx + 1} of {purchase.quantity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
