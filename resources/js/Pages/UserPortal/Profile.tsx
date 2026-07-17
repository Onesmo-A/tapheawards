import React, { useState, useEffect } from 'react';
import { User, Lock, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import axios from 'axios';

interface UserData {
  name: string;
  email: string;
  phone?: string;
}

export default function Profile() {
  const [user, setUser] = useState<UserData>({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(true);

  // Profile Form States
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Password Form States
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('user_token');
    axios.get('/api/v1/user', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        setUser(response.data);
        setName(response.data.name);
        setPhone(response.data.phone || '');
      })
      .catch(err => {
        console.error('Failed to load profile data', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMessage(null);
    const token = localStorage.getItem('user_token');

    try {
      const response = await axios.post('/api/v1/user/profile/update', {
        name,
        phone: phone || null,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setProfileMessage({ type: 'success', text: 'Profile information updated successfully.' });
      
      // Update local storage and dispatch event to sync navbar header
      const storedUser = localStorage.getItem('auth_user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        parsed.name = response.data.user.name;
        parsed.phone = response.data.user.phone;
        localStorage.setItem('auth_user', JSON.stringify(parsed));
      }
      window.dispatchEvent(new Event('taphe:user-auth-changed'));

    } catch (err: any) {
      console.error('Profile update failed', err);
      setProfileMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update profile. Please try again.'
      });
    } finally {
      setProfileLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (password !== passwordConfirmation) {
      setPasswordMessage({ type: 'error', text: 'Password confirmation does not match.' });
      return;
    }

    setPasswordLoading(true);
    const token = localStorage.getItem('user_token');

    try {
      await axios.post('/api/v1/user/profile/password', {
        current_password: currentPassword,
        password,
        password_confirmation: passwordConfirmation,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setPasswordMessage({ type: 'success', text: 'Password changed successfully.' });
      setCurrentPassword('');
      setPassword('');
      setPasswordConfirmation('');

    } catch (err: any) {
      console.error('Password change failed', err);
      setPasswordMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to change password. Please check your current password.'
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center space-y-4">
        <div className="w-8 h-8 border-4 border-t-red-600 border-white/10 rounded-full animate-spin" />
        <p className="text-[10px] font-black uppercase text-white/50 tracking-widest">Loading Account Settings...</p>
      </div>
    );
  }

  const fieldShell =
    'group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.045] transition-all duration-300 focus-within:border-[#D90429]/70 focus-within:bg-white/[0.07] focus-within:shadow-[0_0_0_1px_rgba(217,4,41,0.22),0_18px_45px_rgba(217,4,41,0.08)]';

  const inputClass =
    'w-full bg-transparent py-3.5 pl-11 pr-4 font-inter text-sm text-white outline-none placeholder:text-white/25';

  return (
    <div className="space-y-10 text-left">
      <div className="space-y-2">
        <span className="text-[10px] font-black text-[#D90429] uppercase tracking-widest font-outfit">Portal section</span>
        <h2 className="text-3xl font-outfit font-black uppercase tracking-tight text-white leading-none">
          Account Settings
        </h2>
        <p className="text-xs text-white/50 leading-relaxed font-light font-inter max-w-xl">
          Manage your personal information, mobile contact details, and update your security details below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* 1. GENERAL INFO FORM */}
        <div className="rounded-[2rem] border border-white/5 bg-[#080506] p-6 md:p-8 space-y-6 shadow-xl">
          <div className="flex items-center gap-2 border-b border-white/5 pb-4">
            <User className="w-5 h-5 text-[#D4A853]" />
            <h3 className="font-outfit text-xs font-black uppercase tracking-widest text-[#D4A853]">
              Personal Information
            </h3>
          </div>

          {profileMessage && (
            <div
              className={`p-4 rounded-2xl border text-xs font-semibold leading-relaxed flex items-start gap-3 ${
                profileMessage.type === 'success'
                  ? 'bg-green-600/10 border-green-500/20 text-green-400'
                  : 'bg-red-600/10 border-red-500/20 text-red-400'
              }`}
            >
              {profileMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" /> : <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />}
              <span>{profileMessage.text}</span>
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block font-outfit text-[10px] font-black uppercase tracking-widest text-white/50">
                Full Name
              </label>
              <div className={fieldShell}>
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/35 group-focus-within:text-[#D90429] transition-colors" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className={inputClass}
                  placeholder="E.g. John Doe"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block font-outfit text-[10px] font-black uppercase tracking-widest text-white/50">
                Email Address (Cannot Change)
              </label>
              <div className={`${fieldShell} opacity-50 cursor-not-allowed`}>
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/35" />
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className={`${inputClass} cursor-not-allowed`}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block font-outfit text-[10px] font-black uppercase tracking-widest text-white/50">
                Phone Number
              </label>
              <div className={fieldShell}>
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/35 group-focus-within:text-[#D90429] transition-colors" />
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className={inputClass}
                  placeholder="E.g. 0712345678"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={profileLoading}
              className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl border border-[#ff405b]/30 bg-[#D90429] px-4 py-3.5 font-outfit text-[10px] font-black uppercase tracking-[0.22em] text-white shadow-[0_18px_50px_rgba(217,4,41,0.2)] hover:bg-[#b90022] focus:outline-none disabled:cursor-not-allowed disabled:opacity-55 transition-all duration-300"
            >
              {profileLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving Updates</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </form>
        </div>

        {/* 2. PASSWORD SECURITY FORM */}
        <div className="rounded-[2rem] border border-white/5 bg-[#080506] p-6 md:p-8 space-y-6 shadow-xl">
          <div className="flex items-center gap-2 border-b border-white/5 pb-4">
            <Lock className="w-5 h-5 text-[#D4A853]" />
            <h3 className="font-outfit text-xs font-black uppercase tracking-widest text-[#D4A853]">
              Security & Password
            </h3>
          </div>

          {passwordMessage && (
            <div
              className={`p-4 rounded-2xl border text-xs font-semibold leading-relaxed flex items-start gap-3 ${
                passwordMessage.type === 'success'
                  ? 'bg-green-600/10 border-green-500/20 text-green-400'
                  : 'bg-red-600/10 border-red-500/20 text-red-400'
              }`}
            >
              {passwordMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" /> : <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />}
              <span>{passwordMessage.text}</span>
            </div>
          )}

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block font-outfit text-[10px] font-black uppercase tracking-widest text-white/50">
                Current Password
              </label>
              <div className={fieldShell}>
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/35 group-focus-within:text-[#D90429] transition-colors" />
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  className={inputClass}
                  placeholder="Enter current password"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block font-outfit text-[10px] font-black uppercase tracking-widest text-white/50">
                New Password
              </label>
              <div className={fieldShell}>
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/35 group-focus-within:text-[#D90429] transition-colors" />
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className={inputClass}
                  placeholder="Minimum 8 characters"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block font-outfit text-[10px] font-black uppercase tracking-widest text-white/50">
                Confirm New Password
              </label>
              <div className={fieldShell}>
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/35 group-focus-within:text-[#D90429] transition-colors" />
                <input
                  type="password"
                  required
                  minLength={8}
                  value={passwordConfirmation}
                  onChange={e => setPasswordConfirmation(e.target.value)}
                  className={inputClass}
                  placeholder="Repeat new password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={passwordLoading}
              className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl border border-[#ff405b]/30 bg-[#D90429] px-4 py-3.5 font-outfit text-[10px] font-black uppercase tracking-[0.22em] text-white shadow-[0_18px_50px_rgba(217,4,41,0.2)] hover:bg-[#b90022] focus:outline-none disabled:cursor-not-allowed disabled:opacity-55 transition-all duration-300"
            >
              {passwordLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Changing Password</span>
                </>
              ) : (
                <span>Update Password</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
