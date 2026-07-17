import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone, CheckCircle, X, ShieldAlert, Loader2, ArrowRight,
  MessageSquare, CreditCard, RotateCcw, Copy, Share2, QrCode,
  Zap, Star, Award, ShieldCheck, Crown, Shield, Diamond
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  setActiveNominee,
  setStep,
  setPhone,
  setPaymentPhone,
  setChannel,
  setOtpCode,
  setSelectedPackage,
  setPhoneProvider,
  setErrorMsg,
  resetVoteFlow,
  requestOtp,
  verifyOtpCode,
  initiatePaidVote,
  VOTE_PACKAGES,
} from '../../store/slices/voteSlice';

// Package metadata for enhanced visual design
const PACKAGE_META: Record<number, {
  color: string;
  bg: string;
  border: string;
  selectedBg: string;
  icon: React.ReactNode;
  badge: string;
  popular?: boolean;
}> = {
  1: {
    color: 'text-slate-500',
    bg: 'bg-slate-100',
    border: 'border-slate-300',
    selectedBg: 'bg-slate-50',
    icon: <Zap className="w-3.5 h-3.5" />,
    badge: 'Starter',
  },
  3: {
    color: 'text-amber-700',
    bg: 'bg-amber-100',
    border: 'border-amber-300',
    selectedBg: 'bg-amber-50',
    icon: <Shield className="w-3.5 h-3.5" />,
    badge: 'Bronze',
  },
  6: {
    color: 'text-slate-600',
    bg: 'bg-slate-100',
    border: 'border-slate-400',
    selectedBg: 'bg-slate-50',
    icon: <Star className="w-3.5 h-3.5" />,
    badge: 'Silver',
  },
  15: {
    color: 'text-yellow-600',
    bg: 'bg-yellow-100',
    border: 'border-yellow-400',
    selectedBg: 'bg-yellow-50',
    icon: <Award className="w-3.5 h-3.5" />,
    badge: 'Gold',
    popular: true,
  },
  25: {
    color: 'text-violet-600',
    bg: 'bg-violet-100',
    border: 'border-violet-400',
    selectedBg: 'bg-violet-50',
    icon: <Crown className="w-3.5 h-3.5" />,
    badge: 'Platinum',
  },
  55: {
    color: 'text-cyan-600',
    bg: 'bg-cyan-100',
    border: 'border-cyan-400',
    selectedBg: 'bg-cyan-50',
    icon: <Diamond className="w-3.5 h-3.5" />,
    badge: 'Diamond',
  },
};

export default function VoteModal() {
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state.voting);
  const {
    activeNominee,
    step,
    phone,
    channel,
    otpCode,
    voterToken,
    selectedPackage,
    phoneProvider,
    paymentPhone,
    orderId,
    transactionOrderId,
    loading,
    errorMsg,
  } = state;

  const { settings } = useAppSelector((state) => state.categories);

  const [pollCount, setPollCount] = useState(0);
  const [showCopyToast, setShowCopyToast] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [simulating, setSimulating] = useState<'success' | 'failed' | null>(null);

  // Adjust default channel based on admin settings
  useEffect(() => {
    if (settings) {
      const smsEnabled = settings.otp_sms_enabled !== false;
      const whatsappEnabled = settings.otp_whatsapp_enabled !== false;

      if (!smsEnabled && whatsappEnabled && channel !== 'whatsapp') {
        dispatch(setChannel('whatsapp'));
      } else if (smsEnabled && !whatsappEnabled && channel !== 'sms') {
        dispatch(setChannel('sms'));
      }
    }
  }, [settings, channel, dispatch]);

  // Set default payment phone same as voter phone on step transitions
  useEffect(() => {
    if (phone && !paymentPhone) {
      dispatch(setPaymentPhone(phone));
    }
  }, [phone, paymentPhone, dispatch]);

  // Handle polling for payment success
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (step === 'pending' && orderId) {
      interval = setInterval(async () => {
        try {
          const res = await axios.get(`/api/v1/vote/order/${orderId}/status`);
          const status = res.data.payment_status;

          if (status === 'completed') {
            dispatch(setStep('success'));
            clearInterval(interval);
          } else if (status === 'failed') {
            dispatch(setStep('failed'));
            clearInterval(interval);
          }
        } catch (e) {
          console.error('Polling status error', e);
        }

        setPollCount((prev) => prev + 1);
        if (pollCount > 30) {
          dispatch(setErrorMsg('Transaction timed out. If you were charged, your votes will be updated automatically.'));
          dispatch(setStep('failed'));
          clearInterval(interval);
        }
      }, 5000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, orderId, pollCount, dispatch]);

  if (!activeNominee) return null;

  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (voterToken && phone) {
      dispatch(setStep('packages'));
      return;
    }
    dispatch(requestOtp({ phone, channel }));
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(verifyOtpCode({ phone, code: otpCode }));
  };

  const handleInitiatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      initiatePaidVote({
        nomineeId: activeNominee.id,
        votesCount: selectedPackage.votes,
        phoneProvider,
        paymentPhone,
        voterToken,
      })
    );
    setPollCount(0);
  };

  const mapProviderName = (provider: string) => {
    switch (provider) {
      case 'mpesa': return 'M-Pesa (Vodacom)';
      case 'tigopesa': return 'Tigo Pesa';
      case 'airtelmoney': return 'Airtel Money';
      case 'halopesa': return 'HaloPesa (Halotel)';
      default: return provider;
    }
  };

  const handleClose = () => {
    dispatch(resetVoteFlow());
    setShowQrModal(false);
  };

  const getNomineeShareUrl = () => {
    // Build a share URL pointing to the nominee's category
    const cat = activeNominee as any;
    if (cat.category_id) {
      return `${window.location.origin}/categories?category=${cat.category_id}`;
    }
    return window.location.href;
  };

  const handleCopyLink = () => {
    const url = getNomineeShareUrl();
    navigator.clipboard.writeText(url).then(() => {
      setShowCopyToast(true);
      setTimeout(() => setShowCopyToast(false), 2500);
    });
  };

  const handleNativeShare = () => {
    const url = getNomineeShareUrl();
    if (navigator.share) {
      navigator.share({
        title: `Vote for ${activeNominee.name} — TAPHE Awards`,
        text: `Support ${activeNominee.name} at the TAPHE Excellence Awards! Cast your verified vote now.`,
        url,
      }).catch(console.error);
    } else {
      handleCopyLink();
    }
  };

  return (
    <>
      {/* Main Vote Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="w-full max-w-lg max-h-[calc(100vh-1rem)] sm:max-h-[calc(100vh-2rem)] flex flex-col overflow-hidden bg-white border border-black/[0.08] rounded-3xl shadow-[0_24px_60px_rgba(0,0,0,0.18)]"
        >
          {/* Modal Header */}
          <div className="relative px-5 py-3.5 border-b border-black/[0.06] flex justify-between items-center bg-[#FAFAFA] shrink-0">
            <div className="text-left">
              <span className="text-[9px] uppercase tracking-widest text-[#D90429] font-bold font-outfit">TAPHE Board</span>
              <h3 className="text-base font-black font-outfit uppercase mt-0.5 text-[#111111]">Cast Verified Vote</h3>
            </div>
            <button
              onClick={handleClose}
              className="p-1.5 hover:bg-black/5 border border-transparent hover:border-black/5 rounded-full transition-all"
            >
              <X className="w-4 h-4 text-[#555555] hover:text-[#111111]" />
            </button>
          </div>

          {/* Form Wizard Body */}
          <div className="p-4 sm:p-5 overflow-y-auto flex-1 min-h-0 text-left">
            {errorMsg && (
              <div className="mb-4 p-3 bg-red-500/5 border-l-4 border-[#D90429] text-red-600 text-xs rounded-r-xl flex items-start gap-2 text-left">
                <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0 text-[#D90429]" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Nominee Info Panel — Centered image, prominent design */}
            <div className="mb-4 rounded-3xl border border-black/[0.05] overflow-hidden bg-gradient-to-br from-[#fafafa] to-[#f3f3f3]">
              {/* Image Hero */}
              <div className="relative flex items-center justify-center bg-[#111111] overflow-hidden h-32 sm:h-44">
                {activeNominee.image_url ? (
                  <img
                    src={activeNominee.image_url}
                    alt={activeNominee.name}
                    className="absolute inset-0 w-full h-full object-cover object-center opacity-30 blur-sm scale-110"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/images/logo.webp';
                    }}
                    aria-hidden="true"
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Centered profile photo */}
                <div className="relative z-10 flex flex-col items-center">
                  {activeNominee.image_url ? (
                    <div className="w-24 h-24 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-white/30 shadow-xl shadow-black/40 ring-2 ring-[#D90429]/40">
                      <img
                        src={activeNominee.image_url}
                        alt={activeNominee.name}
                        className="w-full h-full object-cover object-center"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = '/images/logo.webp';
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-24 sm:w-36 sm:h-36 rounded-full bg-[#D90429]/20 border-4 border-[#D90429]/40 text-[#D90429] font-black flex items-center justify-center text-3xl sm:text-5xl shadow-xl">
                      {activeNominee.name.charAt(0)}
                    </div>
                  )}
                </div>
              </div>

              {/* Nominee Info + Share Row */}
              <div className="px-4 py-3">
                <div className="text-center mb-2">
                  <h4 className="text-sm font-black text-[#111111] uppercase tracking-wide leading-tight mb-1.5">{activeNominee.name}</h4>
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#D90429]/10 text-[#D90429] text-[8px] uppercase tracking-widest font-black mb-1">
                    {activeNominee.category_name || 'TAPHE Board Nominee'}
                  </span>
                  {(activeNominee as any).bio && (
                    <p className="text-[9px] text-[#888888] font-medium leading-relaxed mt-0.5 line-clamp-2">
                      {(activeNominee as any).bio}
                    </p>
                  )}
                </div>

                {/* Share Action Bar */}
                <div className="flex items-center justify-center gap-2 pt-2 border-t border-black/[0.05]">
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    title="Copy nominee link"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-black/10 hover:border-[#D90429]/40 hover:bg-[#D90429]/5 text-[#555555] hover:text-[#D90429] transition-all duration-200 group"
                  >
                    <Copy className="w-3 h-3" />
                    <span className="text-[8px] font-bold uppercase tracking-wider">Copy</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleNativeShare}
                    title="Share nominee"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-black/10 hover:border-[#D90429]/40 hover:bg-[#D90429]/5 text-[#555555] hover:text-[#D90429] transition-all duration-200 group"
                  >
                    <Share2 className="w-3 h-3" />
                    <span className="text-[8px] font-bold uppercase tracking-wider">Share</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowQrModal(true)}
                    title="Show QR Code"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#D90429]/10 border border-[#D90429]/30 hover:bg-[#D90429] text-[#D90429] hover:text-white transition-all duration-200 group"
                  >
                    <QrCode className="w-3 h-3" />
                    <span className="text-[8px] font-bold uppercase tracking-wider">QR</span>
                  </button>
                </div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {/* STEP 1: ENTER PHONE & OTP CHANNEL */}
              {step === 'phone' && (
                <motion.form
                  key="step-phone"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  onSubmit={handleRequestOtp}
                  className="space-y-4"
                >
                  <div className="text-left">
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-[#888888] mb-1.5">Mobile Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30" />
                      <input
                        type="text"
                        placeholder="e.g. 0712345678"
                        value={phone}
                        onChange={(e) => dispatch(setPhone(e.target.value))}
                        className="w-full pl-10 pr-4 py-3 text-xs bg-white border border-black/10 rounded-xl focus:border-[#D90429] focus:ring-1 focus:ring-[#D90429] outline-none text-[#111111] transition-all"
                        required
                      />
                    </div>
                  </div>

                  {(() => {
                    const smsEnabled = settings ? settings.otp_sms_enabled !== false : true;
                    const whatsappEnabled = settings ? settings.otp_whatsapp_enabled !== false : true;
                    const showSms = smsEnabled || (!smsEnabled && !whatsappEnabled);
                    const showWhatsapp = whatsappEnabled;

                    if (!showSms && !showWhatsapp) return null;

                    return (
                      <div className="text-left">
                        <label className="block text-[9px] font-bold uppercase tracking-wider text-[#888888] mb-1.5">Get Verification PIN (OTP) via</label>
                        <div className={`grid gap-3 ${showSms && showWhatsapp ? 'grid-cols-2' : 'grid-cols-1'}`}>
                          {showSms && (
                            <button
                              type="button"
                              onClick={() => dispatch(setChannel('sms'))}
                              className={`flex items-center justify-center gap-2 p-3 text-[10px] font-bold uppercase tracking-wider border rounded-xl transition-all duration-200 ${channel === 'sms'
                                ? 'border-[#D90429] bg-[#D90429] text-white shadow-md shadow-[#D90429]/20'
                                : 'border-black/10 bg-transparent text-[#555555] hover:text-[#D90429] hover:bg-[#D90429]/5 hover:border-[#D90429]/30'
                                }`}
                            >
                              <Phone className="w-3.5 h-3.5" />
                              <span>SMS Text</span>
                            </button>
                          )}
                          {showWhatsapp && (
                            <button
                              type="button"
                              onClick={() => dispatch(setChannel('whatsapp'))}
                              className={`flex items-center justify-center gap-2 p-3 text-[10px] font-bold uppercase tracking-wider border rounded-xl transition-all duration-200 ${channel === 'whatsapp'
                                ? 'border-[#25D366] bg-[#25D366] text-white shadow-md shadow-[#25D366]/20'
                                : 'border-black/10 bg-transparent text-[#555555] hover:text-[#25D366] hover:bg-[#25D366]/5 hover:border-[#25D366]/30'
                                }`}
                            >
                              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.455h.008c6.56 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                              </svg>
                              <span>WhatsApp</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-gradient-to-r from-[#D90429] to-[#FF3D57] hover:from-[#B00020] hover:to-[#D90429] text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-[#D90429]/15"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>{voterToken && phone ? 'Proceed to Packages' : 'Generate Security OTP'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </motion.form>
              )}

              {/* STEP 2: ENTER OTP */}
              {step === 'otp' && (
                <motion.form
                  key="step-otp"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  onSubmit={handleVerifyOtp}
                  className="space-y-4"
                >
                  <div className="text-left">
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-[#888888] mb-1.5">Enter 6-Digit OTP</label>
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="......"
                      value={otpCode}
                      onChange={(e) => dispatch(setOtpCode(e.target.value))}
                      className="w-full text-center tracking-[0.6em] text-lg font-black py-3 bg-white border border-black/10 rounded-xl focus:border-[#D90429] focus:ring-1 focus:ring-[#D90429] outline-none text-[#111111]"
                      required
                    />
                    <p className="text-[10px] text-[#888888] mt-2 leading-relaxed">
                      A code has been sent via {channel === 'sms' ? 'SMS' : 'WhatsApp'} to {phone}.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => dispatch(setStep('phone'))}
                      className="w-1/3 border border-black/10 hover:bg-black/5 text-[#555555] hover:text-[#111111] py-3 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-colors"
                    >
                      Go Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-2/3 py-3 bg-gradient-to-r from-[#D90429] to-[#FF3D57] hover:from-[#B00020] hover:to-[#D90429] text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Verify OTP Code</span>}
                    </button>
                  </div>
                </motion.form>
              )}

              {/* STEP 3: VOTE PACKAGES — Enhanced */}
              {step === 'packages' && (
                <motion.form
                  key="step-packages"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  onSubmit={(e) => {
                    e.preventDefault();
                    dispatch(setStep('provider'));
                  }}
                  className="space-y-3.5"
                >
                  <div className="text-left">
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-[#888888] mb-2">Select Voting Package</label>
                    <div className="grid grid-cols-2 gap-2 max-h-[140px] sm:max-h-[200px] overflow-y-auto pr-1 scrollbar-none">
                      {VOTE_PACKAGES.map((pkg) => {
                        const meta = PACKAGE_META[pkg.votes] || PACKAGE_META[1];
                        const isSelected = selectedPackage.votes === pkg.votes;
                        return (
                          <button
                            type="button"
                            key={pkg.votes}
                            onClick={() => dispatch(setSelectedPackage(pkg))}
                            className={`relative p-2.5 border rounded-xl flex items-center gap-3 text-left transition-all duration-200 overflow-hidden group ${isSelected
                              ? `${meta.border} ${meta.selectedBg} shadow-sm ring-1 ${meta.border.replace('border-', 'ring-')} scale-[1.01]`
                              : 'border-black/[0.07] bg-white hover:bg-black/[0.02] hover:border-black/15'
                              }`}
                          >
                            {/* Popular badge */}
                            {meta.popular && (
                              <span className="absolute top-0 right-0 bg-[#D90429] text-white text-[6px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-bl-lg">
                                Popular
                              </span>
                            )}

                            {/* Left Side: Icon, Badge name, Price */}
                            <div className="flex items-center gap-2">
                              <span className={`w-7 h-7 rounded-lg flex items-center justify-center ${isSelected ? `${meta.bg} ${meta.color}` : 'bg-black/5 text-[#888888]'} shrink-0 transition-all`}>
                                {meta.icon}
                              </span>
                              <div className="leading-none">
                                <span className={`text-[8px] font-black uppercase tracking-widest block ${isSelected ? meta.color : 'text-[#AAAAAA]'}`}>
                                  {meta.badge}
                                </span>
                                <span className={`text-[10px] font-black mt-0.5 block ${isSelected ? meta.color : 'text-[#D90429]'}`}>
                                  {pkg.price.toLocaleString()} TZS
                                </span>
                              </div>
                            </div>

                            {/* Right Side: Votes count */}
                            <div className="ml-auto text-right leading-none pr-1">
                              <span className={`text-sm font-black font-outfit ${isSelected ? meta.color : 'text-[#111111]'}`}>
                                {pkg.votes}
                              </span>
                              <span className="text-[8px] font-bold block uppercase tracking-wider text-[#888888] mt-0.5">
                                vote{pkg.votes > 1 ? 's' : ''}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Selected package summary */}
                  <div className="pt-3 flex justify-between items-center text-xs border-t border-black/[0.06] text-left">
                    <span className="text-[#888888]">Selected Package:</span>
                    <div className="text-right">
                      <span className="block text-base font-black text-[#D90429] font-outfit leading-none">
                        {selectedPackage.votes} Vote{selectedPackage.votes > 1 ? 's' : ''}
                      </span>
                      <span className="text-[9px] text-[#888888]">{selectedPackage.price.toLocaleString()} TZS</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => dispatch(setStep('phone'))}
                      className="w-1/3 border border-black/10 hover:bg-black/5 text-[#555555] hover:text-[#111111] py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-colors"
                    >
                      Go Back
                    </button>
                    <button
                      type="submit"
                      className="w-2/3 py-3.5 bg-[#D90429] hover:bg-[#B00020] text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-[#D90429]/15"
                    >
                      <span>Proceed to Payment</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.form>
              )}

              {/* STEP 4: PAYMENT PROVIDER & MOBILE DETAILS */}
              {step === 'provider' && (
                <motion.form
                  key="step-provider"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  onSubmit={handleInitiatePayment}
                  className="space-y-3.5"
                >
                  <div className="text-left">
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-[#888888] mb-1.5">Choose Mobile Network Provider</label>
                    <div className="grid grid-cols-2 gap-2">
                      {/* M-Pesa */}
                      <button
                        type="button"
                        onClick={() => dispatch(setPhoneProvider('mpesa'))}
                        className={`p-2.5 border rounded-xl text-left transition-all duration-300 ${phoneProvider === 'mpesa'
                          ? 'bg-gradient-to-br from-[#E60000] to-[#B30000] border-[#E60000] text-white shadow-lg shadow-[#E60000]/25 scale-[1.02]'
                          : 'bg-white hover:bg-red-50/50 border-black/10 hover:border-[#E60000]/30 text-slate-800'
                          }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${phoneProvider === 'mpesa' ? 'bg-white text-[#E60000]' : 'bg-[#E60000] text-white'}`}>»</div>
                          <div className="text-left leading-none font-outfit font-black tracking-tighter">
                            <span className={phoneProvider === 'mpesa' ? 'text-white' : 'text-[#E60000]'}>m-</span>
                            <span className={phoneProvider === 'mpesa' ? 'text-[#84E27E]' : 'text-[#4EAF47]'}>pesa</span>
                            <p className={`text-[7px] font-bold ${phoneProvider === 'mpesa' ? 'text-white/60' : 'text-slate-400'} uppercase tracking-widest mt-0.5`}>Vodacom</p>
                          </div>
                        </div>
                      </button>

                      {/* Tigo Pesa */}
                      <button
                        type="button"
                        onClick={() => dispatch(setPhoneProvider('tigopesa'))}
                        className={`p-2.5 border rounded-xl text-left transition-all duration-300 ${phoneProvider === 'tigopesa'
                          ? 'bg-gradient-to-br from-[#0B2265] to-[#051132] border-[#0B2265] text-white shadow-lg shadow-[#0B2265]/25 scale-[1.02]'
                          : 'bg-white hover:bg-blue-50/50 border-black/10 hover:border-[#0B2265]/30 text-slate-800'
                          }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <div className={`w-5 h-5 rounded-md flex items-center justify-center font-black text-[10px] ${phoneProvider === 'tigopesa' ? 'bg-white text-[#0B2265]' : 'bg-[#0B2265] text-white'}`}>t</div>
                          <div className="text-left leading-none font-outfit font-black tracking-tighter">
                            <span className={phoneProvider === 'tigopesa' ? 'text-white' : 'text-[#0B2265]'}>tigo</span>
                            <span className={phoneProvider === 'tigopesa' ? 'text-[#FFBF00]' : 'text-[#F05A28]'}>pesa</span>
                            <p className={`text-[7px] font-bold ${phoneProvider === 'tigopesa' ? 'text-white/60' : 'text-slate-400'} uppercase tracking-widest mt-0.5`}>Tigo</p>
                          </div>
                        </div>
                      </button>

                      {/* Airtel Money */}
                      <button
                        type="button"
                        onClick={() => dispatch(setPhoneProvider('airtelmoney'))}
                        className={`p-2.5 border rounded-xl text-left transition-all duration-300 ${phoneProvider === 'airtelmoney'
                          ? 'bg-gradient-to-br from-[#ED1C24] to-[#B30C10] border-[#ED1C24] text-white shadow-lg shadow-[#ED1C24]/25 scale-[1.02]'
                          : 'bg-white hover:bg-red-50/50 border-black/10 hover:border-[#ED1C24]/30 text-slate-800'
                          }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center font-black text-[10px] ${phoneProvider === 'airtelmoney' ? 'bg-white text-[#ED1C24]' : 'bg-[#ED1C24] text-white'}`}>a</div>
                          <div className="text-left leading-none font-outfit font-black tracking-tighter">
                            <span className={phoneProvider === 'airtelmoney' ? 'text-white' : 'text-[#ED1C24]'}>airtel</span>
                            <span className="text-white/80 font-normal text-[7px] ml-0.5">money</span>
                            <p className={`text-[7px] font-bold ${phoneProvider === 'airtelmoney' ? 'text-white/60' : 'text-slate-400'} uppercase tracking-widest mt-0.5`}>Airtel</p>
                          </div>
                        </div>
                      </button>

                      {/* HaloPesa */}
                      <button
                        type="button"
                        onClick={() => dispatch(setPhoneProvider('halopesa'))}
                        className={`p-2.5 border rounded-xl text-left transition-all duration-300 ${phoneProvider === 'halopesa'
                          ? 'bg-gradient-to-br from-[#FF6600] to-[#C75000] border-[#FF6600] text-white shadow-lg shadow-[#FF6600]/25 scale-[1.02]'
                          : 'bg-white hover:bg-orange-50/50 border-black/10 hover:border-[#FF6600]/30 text-slate-800'
                          }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center font-black text-[9px] ${phoneProvider === 'halopesa' ? 'bg-white text-[#FF6600]' : 'bg-[#FF6600] text-white'}`}>H</div>
                          <div className="text-left leading-none font-outfit font-black tracking-tighter">
                            <span className={phoneProvider === 'halopesa' ? 'text-white' : 'text-[#FF6600]'}>halo</span>
                            <span className={phoneProvider === 'halopesa' ? 'text-[#84E27E]' : 'text-[#008800]'}>pesa</span>
                            <p className={`text-[7px] font-bold ${phoneProvider === 'halopesa' ? 'text-white/60' : 'text-slate-400'} uppercase tracking-widest mt-0.5`}>Halotel</p>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>

                  <div className="text-left">
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-[#888888] mb-1.5">M-Money Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30" />
                      <input
                        type="text"
                        placeholder="e.g. 0712345678"
                        value={paymentPhone}
                        onChange={(e) => dispatch(setPaymentPhone(e.target.value))}
                        className="w-full pl-10 pr-4 py-3 text-xs bg-white border border-black/10 rounded-xl focus:border-[#D90429] focus:ring-1 focus:ring-[#D90429] outline-none text-[#111111] transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="pt-3.5 flex justify-between items-center text-xs border-t border-black/[0.06] text-left">
                    <span className="text-[#888888]">Total Amount:</span>
                    <span className="text-base font-black text-[#D90429] font-outfit">{selectedPackage.price.toLocaleString()} TZS</span>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => dispatch(setStep('packages'))}
                      className="w-1/3 border border-black/10 hover:bg-black/5 text-[#555555] hover:text-[#111111] py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-colors"
                    >
                      Go Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading || !phoneProvider}
                      className="w-2/3 py-3.5 bg-gradient-to-r from-[#D90429] to-[#FF3D57] hover:from-[#B00020] hover:to-[#D90429] disabled:from-gray-100 disabled:to-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-[#D90429]/15"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4" />
                          <span>Authorize TZS {selectedPackage.price}</span>
                        </>
                      )}
                    </button>
                  </div>
                </motion.form>
              )}

              {/* STEP 5: PROCESSING USSD PULL */}
              {step === 'pending' && (
                <motion.div
                  key="step-pending"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-6 text-center space-y-4"
                >
                  <div className="relative inline-flex items-center justify-center">
                    <Loader2 className="w-14 h-14 text-[#D90429] animate-spin" />
                    <CreditCard className="absolute w-5 h-5 text-[#888888]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#111111] uppercase font-outfit">Check your mobile handset</h4>
                    <p className="text-xs text-[#555555] max-w-sm mx-auto mt-1 leading-relaxed">
                      We've initiated a secure payment request (USSD Push) to <strong className="text-[#111111]">{paymentPhone}</strong>.
                      Enter your {mapProviderName(phoneProvider)} PIN to authorize.
                    </p>
                  </div>
                  <div className="p-3 bg-[#D90429]/5 border border-[#D90429]/15 rounded-xl text-[10px] text-[#D90429] text-left max-w-sm mx-auto">
                    If the PIN dialog does not prompt, please wait. Do not close this screen. Polling is active.
                  </div>

                  {/* Sandbox simulation controls */}
                  <div className="pt-3 border-t border-dashed border-black/[0.08] max-w-xs mx-auto space-y-2">
                    <span className="block text-[8px] font-black text-amber-600 uppercase tracking-widest">
                      Developer Sandbox Controls
                    </span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        disabled={simulating !== null}
                        onClick={async () => {
                          setSimulating('success');
                          try {
                            await axios.post('/api/v1/webhooks/zenopay/fake', {
                              order_id: transactionOrderId,
                              vote_order_id: orderId,
                              transaction_order_id: transactionOrderId,
                              payment_status: 'COMPLETED'
                            });
                          } catch (e) {
                            console.error('Failed to simulate success payment', e);
                          } finally {
                            setSimulating(null);
                          }
                        }}
                        className="flex-1 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white text-[9px] font-black uppercase tracking-wider rounded-lg transition-colors shadow-sm"
                      >
                        {simulating === 'success' ? 'Simulating...' : 'Simulate Success'}
                      </button>
                      <button
                        type="button"
                        disabled={simulating !== null}
                        onClick={async () => {
                          setSimulating('failed');
                          try {
                            await axios.post('/api/v1/webhooks/zenopay/fake', {
                              order_id: transactionOrderId,
                              vote_order_id: orderId,
                              transaction_order_id: transactionOrderId,
                              payment_status: 'FAILED'
                            });
                          } catch (e) {
                            console.error('Failed to simulate failed payment', e);
                          } finally {
                            setSimulating(null);
                          }
                        }}
                        className="flex-1 py-2 bg-[#D90429] hover:bg-[#B00020] disabled:bg-red-800 text-white text-[9px] font-black uppercase tracking-wider rounded-lg transition-colors shadow-sm"
                      >
                        {simulating === 'failed' ? 'Simulating...' : 'Simulate Failure'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 6: SUCCESS STATE */}
              {step === 'success' && (
                <motion.div
                  key="step-success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-6 text-center space-y-4"
                >
                  <div className="w-14 h-14 bg-green-500/10 border border-green-500 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-7 h-7 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-green-600 uppercase font-outfit">Choices Counted</h4>
                    <p className="text-xs text-[#555555] max-w-sm mx-auto mt-1 leading-relaxed">
                      Transaction verified successfully. <strong className="text-[#D90429]">{selectedPackage.votes}</strong> Vote(s) Received for <strong className="text-[#111111]">{activeNominee.name}</strong>.
                    </p>
                  </div>
                  <div className="p-4 bg-black/[0.01] rounded-2xl max-w-xs mx-auto border border-black/[0.05] text-xs text-left space-y-2">
                    <div className="flex justify-between">
                      <span className="text-[#888888]">Candidate:</span>
                      <span className="font-bold text-[#111111] uppercase text-[10px]">{activeNominee.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#888888]">Weight:</span>
                      <span className="font-bold text-[#D90429]">{selectedPackage.label}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#888888]">Amount:</span>
                      <span className="font-bold text-[#111111]">{selectedPackage.price} TZS</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="w-full py-3.5 bg-black/5 border border-black/10 hover:bg-black/10 text-slate-800 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
                  >
                    Close Receipt
                  </button>
                </motion.div>
              )}

              {/* STEP 7: FAILED STATE */}
              {step === 'failed' && (
                <motion.div
                  key="step-failed"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-6 text-center space-y-4"
                >
                  <div className="w-14 h-14 bg-red-500/10 border border-[#D90429] rounded-full flex items-center justify-center mx-auto">
                    <X className="w-7 h-7 text-[#D90429]" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-red-600 uppercase font-outfit">Verification Failed</h4>
                    <p className="text-xs text-[#555555] max-w-sm mx-auto mt-1 leading-relaxed">
                      We could not process this transaction. The network timed out or the request was rejected.
                    </p>
                  </div>
                  <div className="flex gap-3 max-w-sm mx-auto">
                    <button
                      type="button"
                      onClick={() => dispatch(setStep('provider'))}
                      className="w-1/2 border border-black/10 hover:bg-black/5 text-[#555555] hover:text-[#111111] py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Try Again</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleClose}
                      className="w-1/2 bg-black/5 border border-black/10 hover:bg-black/10 text-[#555555] py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* QR Code Modal */}
      <AnimatePresence>
        {showQrModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          >
            <div className="absolute inset-0" onClick={() => setShowQrModal(false)} />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative z-10 w-full max-w-xs bg-white border border-black/10 p-6 rounded-3xl text-center space-y-4 shadow-2xl"
            >
              <button
                onClick={() => setShowQrModal(false)}
                className="absolute top-4 right-4 p-1.5 hover:bg-black/5 border border-black/10 rounded-full transition-all text-[#555555] hover:text-[#111111]"
              >
                <X className="w-4 h-4" />
              </button>
              <span className="text-[9px] font-black text-[#D90429] uppercase tracking-widest font-outfit">Scan to Campaign</span>
              <h3 className="text-sm font-black text-[#111111] uppercase leading-snug px-4">{activeNominee.name}</h3>
              <p className="text-[9px] text-[#888888] uppercase tracking-widest">{activeNominee.category_name}</p>

              <div className="bg-white border border-black/5 p-3 rounded-2xl inline-block shadow-sm mx-auto">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(getNomineeShareUrl())}`}
                  alt="Nominee QR Code"
                  className="w-44 h-44"
                />
              </div>

              <p className="text-[10px] text-[#888888] leading-relaxed max-w-xs mx-auto">
                Scan this code to open the nominee's voting category directly on any device.
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => { handleCopyLink(); setShowQrModal(false); }}
                  className="flex-1 py-3 bg-[#D90429] hover:bg-[#B00020] text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </button>
                <button
                  onClick={() => setShowQrModal(false)}
                  className="flex-1 py-3 bg-black/5 border border-black/10 hover:bg-black/10 text-[#555555] text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Copy Toast */}
      <AnimatePresence>
        {showCopyToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[300] px-4 py-3 bg-[#111111] border border-white/10 rounded-2xl flex items-center gap-2 shadow-2xl"
          >
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-[10px] font-bold text-white uppercase tracking-wider">Link copied to clipboard!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
