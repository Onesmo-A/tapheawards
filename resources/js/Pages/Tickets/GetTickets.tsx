import React, { useState } from 'react';
import { CreditCard, Loader2, CheckCircle, Ticket } from 'lucide-react';

export default function GetTickets() {
  const [ticketType, setTicketType] = useState('regular');
  const [quantity, setQuantity] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const getPrice = () => {
    return ticketType === 'vip' ? 100000 : 30000;
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API checkout
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 2000);
  };

  return (
    <div className="max-w-5xl mx-auto my-16 px-6 relative z-10">
      
      {/* Background ambient spotlight */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#A81C1C]/10 rounded-full blur-[100px] pointer-events-none z-0" />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch relative z-10">
        
        {/* Ticket Details Info */}
        <div className="md:col-span-4 rounded-3xl bg-[#0b0b0b] border border-white/5 p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4 text-left">
            <div className="p-3 bg-white/5 border border-white/10 text-[#ff3333] rounded-2xl inline-flex shadow-inner">
              <Ticket className="w-7 h-7" />
            </div>
            <span className="block text-[10px] font-black text-[#ff3333] uppercase tracking-widest font-outfit">Reservations</span>
            <h3 className="text-2xl font-black font-outfit uppercase tracking-tight text-white">Gala Banquet tickets</h3>
            <p className="text-xs text-white/40 leading-relaxed font-light">
              Reserve your seat at the healthcare excellence gala dinner. Network with industry professionals and witness the live award announcements.
            </p>
          </div>

          <div className="border-t border-white/5 pt-6 mt-6 space-y-4 text-xs text-left">
            <div>
              <span className="font-bold text-white block uppercase tracking-wide text-[9px] text-[#ff3333]">Regular Entrance:</span>
              <span className="text-white/50">30,000 TZS (Includes Buffet Dinner & Entrance)</span>
            </div>
            <div>
              <span className="font-bold text-white block uppercase tracking-wide text-[9px] text-[#ff3333]">VIP Access:</span>
              <span className="text-white/50">100,000 TZS (Includes VIP Lounge, Premium Buffet & Drinks)</span>
            </div>
          </div>
        </div>

        {/* Ticket Booking / Checkout Form */}
        <div className="md:col-span-8 rounded-3xl glass-panel border border-white/5 p-8 text-left">
          {success ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
              <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-lg font-black text-white uppercase font-outfit">Booking Initialized</h3>
              <p className="text-xs text-white/40 max-w-sm leading-relaxed">
                Thank you for reserving your gala seat. We've initiated a payment gateway authorization prompt to your phone. Please input your mobile money PIN to finalize ticket delivery.
              </p>
            </div>
          ) : (
            <form onSubmit={handleCheckout} className="space-y-4">
              <h3 className="text-base font-black text-white uppercase tracking-wider mb-2">Book Entry Ticket</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-white/40 mb-1.5">Ticket Tier</label>
                  <select
                    value={ticketType}
                    onChange={(e) => setTicketType(e.target.value)}
                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white outline-none focus:border-[#ff3333] transition-all"
                  >
                    <option className="bg-[#0b0b0b]" value="regular">Regular - 30,000 TZS</option>
                    <option className="bg-[#0b0b0b]" value="vip">VIP Access - 100,000 TZS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-white/40 mb-1.5">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white outline-none focus:border-[#ff3333] text-xs transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-white/40 mb-1.5">Your Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white outline-none focus:border-[#ff3333] text-xs transition-all"
                  placeholder="e.g. John Doe"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-white/40 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white outline-none focus:border-[#ff3333] text-xs transition-all"
                    placeholder="e.g. name@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-white/40 mb-1.5">Mobile Number (Payment)</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white outline-none focus:border-[#ff3333] text-xs transition-all"
                    placeholder="e.g. 0712345678"
                    required
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex justify-between items-center text-xs">
                <span className="text-white/45">Total Reservation Cost:</span>
                <span className="text-base font-black text-[#ff3333] font-outfit">{(getPrice() * quantity).toLocaleString()} TZS</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#A81C1C] hover:bg-[#ff3333] text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-2 border border-[#ff3333]/15 shadow-md shadow-[#A81C1C]/15"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Pay TZS {(getPrice() * quantity).toLocaleString()}</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
