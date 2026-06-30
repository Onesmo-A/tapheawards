import React, { useState } from 'react';
import axios from 'axios';
import { Mail, Phone, MapPin, Loader2, CheckCircle, Send, ShieldAlert } from 'lucide-react';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      await axios.post('/api/v1/contact', { name, email, message });
      setSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto my-16 px-6 relative z-10">
      
      {/* Background ambient spotlight */}
      <div className="absolute top-20 right-10 w-80 h-80 bg-[#A81C1C]/10 rounded-full blur-[100px] pointer-events-none z-0" />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch relative z-10">
        
        {/* Left Side: Contact Information */}
        <div className="md:col-span-5 rounded-3xl bg-[#0b0b0b] border border-white/5 p-8 flex flex-col justify-between space-y-8">
          <div className="space-y-4 text-left">
            <span className="text-[10px] font-black text-[#ff3333] uppercase tracking-widest font-outfit">Enquiries</span>
            <h2 className="text-3xl font-black font-outfit uppercase tracking-tight text-white leading-tight">Get in Touch</h2>
            <p className="text-xs text-white/40 leading-relaxed font-light">
              Have questions about nomination validations, media passes, corporate sponsorships, or VIP gala ticketing? Reach out directly.
            </p>
          </div>

          <div className="space-y-4 pt-6 border-t border-white/5 text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-[#ff3333]">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[9px] text-white/30 uppercase font-bold">Write email</p>
                <p className="text-xs font-semibold text-white/70">info@tapheawards.co.tz</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-[#ff3333]">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[9px] text-white/30 uppercase font-bold">Call office</p>
                <p className="text-xs font-semibold text-white/70">+255 712 345 678</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-[#ff3333]">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[9px] text-white/30 uppercase font-bold">Location</p>
                <p className="text-xs font-semibold text-white/70">Dar es Salaam, Tanzania</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Message Form */}
        <div className="md:col-span-7 rounded-3xl glass-panel border border-white/5 p-8 text-left">
          {success ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
              <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-lg font-black text-white uppercase font-outfit">Message Logged</h3>
              <p className="text-xs text-white/40 max-w-xs leading-relaxed">
                Thank you for contacting the TAPHE Awards. Our secretariat will review your submission and respond shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-base font-black text-white uppercase tracking-wider mb-2">Send Direct Enquiry</h3>
              
              {errorMsg && (
                <div className="p-3 bg-red-500/10 border-l-4 border-[#ff3333] text-red-400 text-xs rounded-r-xl flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0 text-[#ff3333]" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-white/40 mb-1.5">Your Full Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:border-[#ff3333] focus:ring-1 focus:ring-[#ff3333] text-xs text-white outline-none transition-all"
                  placeholder="e.g. Dr. John Doe"
                  required
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-white/40 mb-1.5">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:border-[#ff3333] focus:ring-1 focus:ring-[#ff3333] text-xs text-white outline-none transition-all"
                  placeholder="e.g. name@hospital.or.tz"
                  required
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-white/40 mb-1.5">Message / Details</label>
                <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:border-[#ff3333] focus:ring-1 focus:ring-[#ff3333] text-xs text-white outline-none transition-all resize-none"
                  placeholder="Enter details of your message..."
                  required
                />
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
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message</span>
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
