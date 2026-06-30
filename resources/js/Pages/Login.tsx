import React, { useState } from 'react';
import { Mail, Lock, Loader2, ArrowRight, ShieldCheck, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
    }, 1500);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setTimeout(() => {
      setLoading(false);
      alert('Logged in successfully!');
      window.location.href = '/';
    }, 1500);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 relative overflow-hidden bg-[#030303]">
      
      {/* Background spotlights */}
      <div className="absolute w-[400px] h-[400px] bg-[#D90429]/5 rounded-full blur-[130px] -top-20 -left-20 pointer-events-none" />
      <div className="absolute w-[400px] h-[400px] bg-[#D90429]/5 rounded-full blur-[130px] -bottom-20 -right-20 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10 glass-panel p-8 rounded-3xl border border-white/5 bg-[#0b0b0b] text-left shadow-2xl"
      >
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex p-3 bg-white/5 border border-white/10 rounded-2xl text-[#D90429] mb-1">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <span className="block text-[10px] font-black text-[#D90429] uppercase tracking-widest font-outfit">Security Gate</span>
          <h2 className="text-2xl font-black font-outfit uppercase tracking-tight text-white">Voter Sign In</h2>
          <p className="text-xs text-white/40 max-w-xs mx-auto leading-relaxed">
            Enter your mobile number to receive a cryptographic SMS OTP login verification pin.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 mb-4 bg-red-500/10 border-l-4 border-[#D90429] text-red-400 text-xs rounded-r-xl">
            {errorMsg}
          </div>
        )}

        {!otpSent ? (
          <form onSubmit={handleSendOtp} className="space-y-5">
            <div>
              <label className="block text-[9px] font-bold uppercase tracking-wider text-white/40 mb-1.5">Mobile Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/30">
                  <Phone className="w-4 h-4" />
                </div>
                <input 
                  type="text" 
                  required 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:border-[#D90429] focus:ring-1 focus:ring-[#D90429] text-xs text-white outline-none transition-all"
                  placeholder="e.g. 0712345678"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3.5 bg-[#D90429] hover:bg-[#B00020] disabled:opacity-50 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-2 border border-[#D90429]/15 shadow-md shadow-[#D90429]/15"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Request Login Pin</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div>
              <label className="block text-[9px] font-bold uppercase tracking-wider text-white/40 mb-1.5">OTP Code</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/30">
                  <Lock className="w-4 h-4" />
                </div>
                <input 
                  type="text" 
                  required 
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:border-[#D90429] focus:ring-1 focus:ring-[#D90429] text-xs text-white outline-none transition-all"
                  placeholder="Enter 6-digit pin code"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3.5 bg-[#D90429] hover:bg-[#B00020] disabled:opacity-50 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-2 border border-[#D90429]/15 shadow-md shadow-[#D90429]/15"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Verify and Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <button 
                type="button" 
                onClick={() => setOtpSent(false)} 
                className="text-[10px] font-bold text-white/40 hover:text-[#D90429] uppercase tracking-wide transition-colors"
              >
                Change Phone Number
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
