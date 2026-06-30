import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, CheckCircle, X, ShieldAlert, Loader2, ArrowRight, MessageSquare, CreditCard, RotateCcw } from 'lucide-react';
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
    loading,
    errorMsg,
  } = state;

  const [pollCount, setPollCount] = useState(0);

  // Set default payment phone same as voter phone on step transitions
  useEffect(() => {
    if (phone && !paymentPhone) {
      dispatch(setPaymentPhone(phone));
    }
  }, [phone, paymentPhone, dispatch]);

  // Handle polling for payment success
  useEffect(() => {
    let interval: NodeJS.Timeout;
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
        if (pollCount > 30) { // Stop polling after 2.5 minutes (30 * 5s)
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
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg overflow-hidden bg-white border border-black/[0.08] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)]"
      >
        {/* Modal Header */}
        <div className="relative px-6 py-5 border-b border-black/[0.06] flex justify-between items-center bg-[#FAFAFA]">
          <div className="text-left">
            <span className="text-[9px] uppercase tracking-widest text-[#D90429] font-bold">TAPHE Board</span>
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
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-500/5 border-l-4 border-[#D90429] text-red-600 text-xs rounded-r-xl flex items-start gap-2 text-left">
              <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0 text-[#D90429]" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Nominee Info Panel */}
          <div className="flex items-center gap-4 mb-6 p-3 bg-black/[0.02] rounded-2xl border border-black/[0.05]">
            {activeNominee.image_url ? (
              <img 
                src={activeNominee.image_url} 
                alt={activeNominee.name} 
                className="w-11 h-11 rounded-full object-cover border border-[#D90429]/40"
              />
            ) : (
              <div className="w-11 h-11 rounded-full bg-[#D90429]/15 text-[#D90429] font-black flex items-center justify-center text-xs">
                {activeNominee.name.charAt(0)}
              </div>
            )}
            <div className="text-left">
              <p className="text-[9px] text-[#888888] uppercase tracking-widest font-bold">Selected Nominee</p>
              <h4 className="text-xs font-black text-[#111111] uppercase mt-0.5">{activeNominee.name}</h4>
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

                <div className="text-left">
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-[#888888] mb-1.5">Get Verification PIN (OTP) via</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => dispatch(setChannel('sms'))}
                      className={`flex items-center justify-center gap-2 p-3 text-[10px] font-bold uppercase tracking-wider border rounded-xl transition-all ${
                        channel === 'sms' 
                          ? 'border-[#D90429] bg-[#D90429]/5 text-[#D90429]' 
                          : 'border-black/10 bg-transparent text-[#555555] hover:text-[#111111] hover:bg-black/[0.02]'
                      }`}
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>SMS Text</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => dispatch(setChannel('whatsapp'))}
                      className={`flex items-center justify-center gap-2 p-3 text-[10px] font-bold uppercase tracking-wider border rounded-xl transition-all ${
                        channel === 'whatsapp' 
                          ? 'border-green-600 bg-green-600/5 text-green-700' 
                          : 'border-black/10 bg-transparent text-[#555555] hover:text-[#111111] hover:bg-black/[0.02]'
                      }`}
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-gradient-to-r from-[#D90429] to-[#FF3D57] hover:from-[#B00020] hover:to-[#D90429] text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-[#D90429]/15"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Generate Security OTP</span>
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

            {/* STEP 3: VOTE PACKAGES */}
            {step === 'packages' && (
              <motion.form 
                key="step-packages"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                onSubmit={handleInitiatePayment}
                className="space-y-4"
              >
                <div className="text-left">
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-[#888888] mb-2">Select Voting Weight</label>
                  <div className="grid grid-cols-2 gap-2.5 max-h-[170px] overflow-y-auto pr-1">
                    {VOTE_PACKAGES.map((pkg) => (
                      <button
                        type="button"
                        key={pkg.votes}
                        onClick={() => dispatch(setSelectedPackage(pkg))}
                        className={`p-3 border rounded-xl text-left transition-all ${
                          selectedPackage.votes === pkg.votes 
                            ? 'border-[#D90429] bg-[#D90429]/5' 
                            : 'border-black/[0.06] bg-black/[0.01] hover:bg-black/[0.03]'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className={`text-xs font-bold ${selectedPackage.votes === pkg.votes ? 'text-[#D90429]' : 'text-[#111111]'}`}>{pkg.label}</span>
                          <span className="text-[10px] text-[#D90429] font-bold">{pkg.price} TZS</span>
                        </div>
                        <p className="text-[9px] text-[#888888] mt-0.5">{pkg.sub}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-left">
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-[#888888] mb-1">Provider</label>
                    <select
                      value={phoneProvider}
                      onChange={(e: any) => dispatch(setPhoneProvider(e.target.value))}
                      className="w-full p-2.5 py-3 text-xs bg-white border border-black/10 rounded-xl text-[#111111]/80 outline-none focus:border-[#D90429]"
                    >
                      <option value="mpesa">M-Pesa</option>
                      <option value="tigopesa">Tigo Pesa</option>
                      <option value="airtelmoney">Airtel Money</option>
                      <option value="halopesa">HaloPesa</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-[#888888] mb-1">M-Money Phone</label>
                    <input 
                      type="text" 
                      value={paymentPhone}
                      onChange={(e) => dispatch(setPaymentPhone(e.target.value))}
                      className="w-full p-2.5 py-3 text-xs bg-white border border-black/10 rounded-xl text-[#111111] outline-none focus:border-[#D90429]"
                      required
                    />
                  </div>
                </div>

                <div className="pt-3.5 flex justify-between items-center text-xs border-t border-black/[0.06] text-left">
                  <span className="text-[#888888]">Total Amount:</span>
                  <span className="text-base font-black text-[#D90429] font-outfit">{selectedPackage.price.toLocaleString()} TZS</span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-gradient-to-r from-[#D90429] to-[#FF3D57] hover:from-[#B00020] hover:to-[#D90429] text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2"
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
              </motion.form>
            )}

            {/* STEP 4: PROCESSING USSD PULL */}
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
              </motion.div>
            )}

            {/* STEP 5: SUCCESS STATE */}
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
                    Transaction verified successfully. <strong className="text-[#D90429]">{selectedPackage.votes}</strong> selection(s) added for <strong className="text-[#111111]">{activeNominee.name}</strong>.
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

            {/* STEP 6: FAILED STATE */}
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
                    onClick={() => dispatch(setStep('packages'))}
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
  );
}
