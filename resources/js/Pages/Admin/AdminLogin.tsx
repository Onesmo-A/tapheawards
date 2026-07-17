import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShieldCheck, Loader2, ArrowRight, Key, Mail, Lock, Phone } from 'lucide-react';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  
  const [requiresOtp, setRequiresOtp] = useState(false);
  const [adminId, setAdminId] = useState('');
  const [otpPreview, setOtpPreview] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const response = await axios.post('/api/v1/admin/login', {
        email,
        password,
      });

      if (response.data.status === 'requires_otp') {
        setRequiresOtp(true);
        setAdminId(response.data.admin_id);
        if (response.data.otp_preview) {
          setOtpPreview(response.data.otp_preview);
        }
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Nyaraka za kuingia sio sahihi.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const response = await axios.post('/api/v1/admin/login/verify', {
        admin_id: adminId,
        code: otpCode,
      });

      if (response.data.token) {
        // Save administrative credentials
        localStorage.setItem('admin_token', response.data.token);
        localStorage.setItem('admin_user', JSON.stringify(response.data.user));
        
        // Redirect to admin dashboard panel
        navigate('/admin/dashboard');
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Namba ya siri (OTP) sio sahihi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white bg-mesh flex items-center justify-center p-6 relative">
      
      {/* Background ambient light */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#D90429]/10 rounded-full blur-[100px] pointer-events-none z-0" />

      <div className="relative z-10 w-full max-w-md bg-[#0b0b0b] border border-white/5 rounded-[32px] p-8 md:p-10 space-y-6 shadow-2xl">
        
        {/* Brand Spotlight */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-white/5 border border-white/10 rounded-2xl text-[#D90429] mb-2 shadow-inner">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <span className="block text-[10px] font-black text-[#D90429] uppercase tracking-widest font-outfit">Secure Lockbox</span>
          <h2 className="text-2xl font-black font-outfit uppercase tracking-tight text-white">TAPHE Secretariat</h2>
          <p className="text-xs text-white/45 leading-relaxed max-w-xs mx-auto">
            Authorized administrative staff only. All actions are cryptographically logged and monitored.
          </p>
        </div>

        {errorMsg && (
          <div className="p-4 bg-[#D90429]/10 border border-[#D90429]/20 text-[#D90429] text-[11px] font-bold uppercase rounded-2xl text-center tracking-wider">
            {errorMsg}
          </div>
        )}

        {!requiresOtp ? (
          // CREDENTIALS FORM
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-black uppercase text-white/50 tracking-wider">Secretariat Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="email"
                  required
                  placeholder="admin@tapheawards.co.tz"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-black/40 border border-white/10 rounded-2xl text-xs text-white focus:border-[#D90429] focus:ring-1 focus:ring-[#D90429] outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-black uppercase text-white/50 tracking-wider">Admin Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-black/40 border border-white/10 rounded-2xl text-xs text-white focus:border-[#D90429] focus:ring-1 focus:ring-[#D90429] outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#D90429] hover:bg-[#B00020] disabled:bg-[#D90429]/40 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Unlock Gateway</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          // MFA OTP FORM
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl text-center space-y-1">
              <span className="text-[9px] text-[#D90429] font-black uppercase tracking-wider block">MFA Required</span>
              <p className="text-[10px] text-white/50 leading-relaxed font-light font-inter">
                We sent a 6-digit verification code to your registered mobile number.
              </p>
            </div>

            {otpPreview && (
              <div className="p-3.5 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 rounded-2xl text-center space-y-1">
                <span className="text-[9px] font-black uppercase tracking-wider block">Dev Sandbox Helper</span>
                <p className="text-[10px] leading-relaxed font-light font-inter">
                  Namba ya siri ya majaribio ni: <strong className="font-black text-white">{otpPreview}</strong> au <strong className="font-black text-white">123456</strong>
                </p>
              </div>
            )}

            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-black uppercase text-white/50 tracking-wider">Verification Code (OTP)</label>
              <div className="relative">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="e.g. 123456"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-black/40 border border-white/10 rounded-2xl text-xs text-white tracking-widest text-center focus:border-[#D90429] focus:ring-1 focus:ring-[#D90429] outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#D90429] hover:bg-[#B00020] disabled:bg-[#D90429]/40 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Verify Identity</span>
                  <ShieldCheck className="w-4 h-4" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setRequiresOtp(false)}
              className="w-full py-2.5 bg-transparent border border-white/5 text-white/40 hover:text-white hover:bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer"
            >
              Go Back
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
