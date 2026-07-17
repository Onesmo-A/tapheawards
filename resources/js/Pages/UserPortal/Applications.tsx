import React, { useState, useEffect } from 'react';
import { Award, CreditCard, Clock, CheckCircle2, AlertTriangle, RefreshCw, Plus, X, Upload, Globe, Phone, Mail, User, Search, ArrowRight, ArrowLeft } from 'lucide-react';
import axios from 'axios';

interface TransactionData {
  id: string;
  order_id: string;
  amount: string;
  status: string;
  phone_number: string;
}

interface ApplicationData {
  id: string;
  applicant_name: string;
  applicant_email: string;
  applicant_phone: string;
  bio: string;
  status: string;
  created_at: string;
  category?: {
    id: string;
    name: string;
  };
  transaction?: TransactionData;
}

interface CategoryData {
  id: string;
  name: string;
  nomination_fee: string;
}

export default function Applications() {
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form States
  const [showForm, setShowForm] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [formLoading, setFormLoading] = useState(false);
  
  const [categoryId, setCategoryId] = useState('');
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [bio, setBio] = useState('');
  const [facebookUrl, setFacebookUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [tiktokUrl, setTiktokUrl] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  
  // Search Category filter
  const [searchCategory, setSearchCategory] = useState('');

  const fetchApplications = () => {
    const token = localStorage.getItem('user_token');
    axios.get('/api/v1/user/applications', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        setApplications(response.data.applications);
      })
      .catch(err => {
        console.error('Failed to load applications', err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchCategories = () => {
    const token = localStorage.getItem('user_token');
    axios.get('/api/v1/user/categories', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        setCategories(response.data.categories);
      })
      .catch(err => {
        console.error('Failed to load categories', err);
      });
  };

  useEffect(() => {
    fetchApplications();
    fetchCategories();
  }, []);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleRetryPayment = async (appId: string) => {
    setActionLoading(appId);
    setMessage(null);
    const token = localStorage.getItem('user_token');

    try {
      const response = await axios.post(`/api/v1/user/applications/${appId}/retry-payment`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage({ type: 'success', text: response.data.message });
      fetchApplications();
    } catch (err: any) {
      console.error('Payment retry failed', err);
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to initiate payment. Please try again later.'
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setMessage(null);
    const token = localStorage.getItem('user_token');

    const formData = new FormData();
    formData.append('category_id', categoryId);
    formData.append('applicant_name', applicantName);
    formData.append('applicant_email', applicantEmail);
    formData.append('applicant_phone', applicantPhone);
    formData.append('bio', bio);
    if (facebookUrl) formData.append('facebook_url', facebookUrl);
    if (instagramUrl) formData.append('instagram_url', instagramUrl);
    if (tiktokUrl) formData.append('tiktok_url', tiktokUrl);
    if (photoFile) formData.append('photo', photoFile);

    try {
      const response = await axios.post('/api/v1/user/applications', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setMessage({ type: 'success', text: response.data.message });
      
      // Reset form states
      setCategoryId('');
      setApplicantName('');
      setApplicantEmail('');
      setApplicantPhone('');
      setBio('');
      setFacebookUrl('');
      setInstagramUrl('');
      setTiktokUrl('');
      setPhotoFile(null);
      setPhotoPreview(null);
      setShowForm(false);
      setFormStep(1);

      fetchApplications();
    } catch (err: any) {
      console.error('Failed to submit application', err);
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Incomplete details or network error. Please verify input.'
      });
    } finally {
      setFormLoading(false);
    }
  };

  const getStatusDetails = (status: string) => {
    switch (status) {
      case 'approved':
        return {
          label: 'Approved',
          classes: 'bg-green-500/10 text-green-400 border-green-500/30',
          icon: CheckCircle2,
        };
      case 'rejected':
        return {
          label: 'Rejected',
          classes: 'bg-red-500/10 text-red-400 border-red-500/30',
          icon: AlertTriangle,
        };
      case 'pending_review':
        return {
          label: 'Under Review',
          classes: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
          icon: Clock,
        };
      case 'pending_payment':
        return {
          label: 'Pending Payment',
          classes: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
          icon: CreditCard,
        };
      case 'payment_failed':
        return {
          label: 'Payment Failed',
          classes: 'bg-red-500/10 text-red-400 border-red-500/30',
          icon: AlertTriangle,
        };
      default:
        return {
          label: status,
          classes: 'bg-white/5 text-white/60 border-white/10',
          icon: Clock,
        };
    }
  };

  const selectedCategoryObj = categories.find(cat => cat.id === categoryId);

  // Filter categories by search keyword
  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchCategory.toLowerCase())
  );

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center space-y-4">
        <div className="w-8 h-8 border-4 border-t-red-600 border-white/10 rounded-full animate-spin" />
        <p className="text-[10px] font-black uppercase text-white/50 tracking-widest">Loading Applications...</p>
      </div>
    );
  }

  const fieldShell =
    'group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.045] transition-all duration-300 focus-within:border-[#D90429]/70 focus-within:bg-white/[0.07]';

  const inputClass =
    'w-full bg-transparent py-3.5 pl-11 pr-4 font-inter text-sm text-white outline-none placeholder:text-white/25';

  return (
    <div className="space-y-8 text-left relative">
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <span className="text-[10px] font-black text-[#D90429] uppercase tracking-widest font-outfit">Portal section</span>
          <h2 className="text-3xl font-outfit font-black uppercase tracking-tight text-white leading-none">
            My Nominations
          </h2>
          <p className="text-xs text-white/50 leading-relaxed font-light font-inter max-w-xl">
            List of award nominations you have submitted. You can monitor review statuses or complete payments for entries waiting for settlement.
          </p>
        </div>

        {!showForm && (
          <button
            onClick={() => {
              setShowForm(true);
              setFormStep(1);
            }}
            className="px-6 py-3.5 bg-gradient-to-r from-[#D90429] to-[#FF3D57] hover:from-[#B00020] hover:to-[#D90429] text-white text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-2 border border-[#D90429]/20 shadow-[0_4px_25px_rgba(217,4,41,0.25)] transition-all duration-300 group shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Apply Nomination</span>
          </button>
        )}
      </div>

      {message && (
        <div
          className={`p-4 rounded-2xl border text-xs font-semibold leading-relaxed flex items-start gap-3 ${
            message.type === 'success'
              ? 'bg-green-600/10 border-green-500/20 text-green-400'
              : 'bg-red-600/10 border-red-500/20 text-red-400'
          }`}
        >
          <div className="mt-0.5">
            {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          </div>
          <span>{message.text}</span>
        </div>
      )}

      {/* 2. MULTI-STEP NOMINATION FORM */}
      {showForm ? (
        <div className="rounded-[2.5rem] border border-white/10 bg-[#0c0809] p-6 md:p-10 shadow-2xl relative">
          {/* Close button */}
          <button
            onClick={() => {
              setShowForm(false);
              setFormStep(1);
            }}
            className="absolute top-6 right-6 p-2 rounded-full border border-white/10 hover:bg-white/5 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Stepper Progress bar */}
          <div className="mb-10 max-w-lg mx-auto">
            <div className="flex justify-between items-center relative">
              {/* Progress Line */}
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-white/10 z-0" />
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-r from-[#D90429] to-[#FF3D57] transition-all duration-500 z-0"
                style={{ width: `${((formStep - 1) / 2) * 100}%` }}
              />

              {/* Step indicator buttons */}
              {[
                { number: 1, label: 'Category' },
                { number: 2, label: 'Candidate Details' },
                { number: 3, label: 'Social & Checkout' }
              ].map(s => (
                <div key={s.number} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-outfit font-black text-xs uppercase border transition-all duration-500 ${
                      formStep >= s.number
                        ? 'bg-gradient-to-r from-[#D90429] to-[#FF3D57] border-[#D90429] text-white shadow-[0_0_15px_rgba(217,4,41,0.35)]'
                        : 'bg-[#0c0809] border-white/10 text-white/40'
                    }`}
                  >
                    {s.number}
                  </div>
                  <span className="text-[8px] font-black uppercase tracking-wider text-white/45 mt-2 hidden sm:block">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6 text-left">
            {/* STEP 1: SELECT CATEGORY (GORGEOUS CARDS LAYOUT) */}
            {formStep === 1 && (
              <div className="space-y-6">
                <div className="space-y-1">
                  <span className="text-[9px] font-black text-[#D90429] uppercase tracking-widest">Step 1 of 3</span>
                  <h3 className="text-xl md:text-2xl font-outfit font-black uppercase text-white tracking-tight">
                    Select Nomination Category
                  </h3>
                  <p className="text-xs text-white/40 leading-relaxed font-light">
                    Browse the available award categories below. Choose the specific category you want to submit a candidate entry for.
                  </p>
                </div>

                {/* Filter Search Input */}
                <div className="max-w-md relative rounded-2xl border border-white/10 bg-white/[0.03] focus-within:border-[#D90429]/60 transition-all">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/35" />
                  <input
                    type="text"
                    placeholder="Search award categories..."
                    value={searchCategory}
                    onChange={e => setSearchCategory(e.target.value)}
                    className="w-full bg-transparent py-3 pl-11 pr-4 text-xs text-white outline-none placeholder:text-white/20"
                  />
                </div>

                {/* Category Card Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[380px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                  {filteredCategories.map(cat => {
                    const isSelected = cat.id === categoryId;
                    return (
                      <div
                        key={cat.id}
                        onClick={() => {
                          setCategoryId(cat.id);
                          setFormStep(2); // Auto-advance to Step 2 for high productivity
                        }}
                        className={`p-5 rounded-2xl border text-left cursor-pointer transition-all duration-300 relative overflow-hidden group ${
                          isSelected
                            ? 'bg-gradient-to-r from-[#D90429]/10 to-[#FF3D57]/10 border-[#D90429] shadow-lg shadow-[#D90429]/5'
                            : 'bg-white/[0.02] border-white/5 hover:border-white/20 hover:bg-white/[0.04]'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-[#D90429] to-transparent opacity-20" />
                        )}

                        <div className="space-y-3">
                          <div className="flex justify-between items-start gap-3">
                            <h4 className="font-outfit font-black text-xs uppercase tracking-wider text-white group-hover:text-[#D90429] transition-colors leading-tight">
                              {cat.name}
                            </h4>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-[#D90429] shrink-0" />}
                          </div>
                          <p className="text-[10px] font-black text-[#D4A853] font-outfit uppercase tracking-wider">
                            {Number(cat.nomination_fee) <= 0 ? 'Bila Ada (Free Entry)' : `Fee: ${Number(cat.nomination_fee).toLocaleString()} TZS`}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  {filteredCategories.length === 0 && (
                    <div className="col-span-2 p-12 text-center text-white/35 text-xs font-light">
                      No categories found matching your search.
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-white/5 flex justify-end">
                  <button
                    disabled={!categoryId}
                    onClick={() => setFormStep(2)}
                    className="px-6 py-3 bg-[#D90429] hover:bg-[#B00020] disabled:bg-white/5 disabled:text-white/20 text-white text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-2 border border-[#D90429]/20 shadow-[0_4px_15px_rgba(217,4,41,0.2)] transition-all duration-300 disabled:cursor-not-allowed"
                  >
                    <span>Next Step</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: CANDIDATE DETAILS FORM */}
            {formStep === 2 && (
              <div className="space-y-6">
                <div className="space-y-1">
                  <span className="text-[9px] font-black text-[#D90429] uppercase tracking-widest">Step 2 of 3</span>
                  <h3 className="text-xl md:text-2xl font-outfit font-black uppercase text-white tracking-tight">
                    Candidate Information
                  </h3>
                  <p className="text-xs text-white/40 leading-relaxed font-light">
                    Provide the profile credentials of the nominee candidate, including photo validation and a professional biography.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Name & Email Group */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block font-outfit text-[10px] font-black uppercase tracking-widest text-white/50">
                        Candidate Full Name
                      </label>
                      <div className={fieldShell}>
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/35 group-focus-within:text-[#D90429] transition-colors" />
                        <input
                          type="text"
                          required
                          value={applicantName}
                          onChange={e => setApplicantName(e.target.value)}
                          className={inputClass}
                          placeholder="E.g. Dr. Jane Doe"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block font-outfit text-[10px] font-black uppercase tracking-widest text-white/50">
                        Candidate Email Address
                      </label>
                      <div className={fieldShell}>
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/35 group-focus-within:text-[#D90429] transition-colors" />
                        <input
                          type="email"
                          required
                          value={applicantEmail}
                          onChange={e => setApplicantEmail(e.target.value)}
                          className={inputClass}
                          placeholder="E.g. jane.doe@example.com"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Phone & Photo Group */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block font-outfit text-[10px] font-black uppercase tracking-widest text-white/50">
                        {selectedCategoryObj && Number(selectedCategoryObj.nomination_fee) <= 0 
                          ? 'Contact Phone Number' 
                          : 'Payment Mobile Number (ZenoPay)'}
                      </label>
                      <div className={fieldShell}>
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/35 group-focus-within:text-[#D90429] transition-colors" />
                        <input
                          type="text"
                          required
                          value={applicantPhone}
                          onChange={e => setApplicantPhone(e.target.value)}
                          className={inputClass}
                          placeholder={selectedCategoryObj && Number(selectedCategoryObj.nomination_fee) <= 0 
                            ? 'E.g. 0712345678' 
                            : 'E.g. 0712345678 (ZenoPay)'}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block font-outfit text-[10px] font-black uppercase tracking-widest text-white/50">
                        Candidate Photo
                      </label>
                      <div className="flex items-center gap-3">
                        <label className="cursor-pointer flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl border border-dashed border-white/20 bg-white/[0.03] hover:bg-white/[0.06] transition-colors text-xs font-semibold text-white/70">
                          <Upload className="w-4 h-4 text-[#D90429]" />
                          <span>Choose File</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            className="hidden"
                          />
                        </label>
                        {photoPreview && (
                          <img
                            src={photoPreview}
                            alt="Preview"
                            className="w-11 h-11 rounded-xl object-cover border border-white/10"
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Biography */}
                  <div className="space-y-1.5">
                    <label className="block font-outfit text-[10px] font-black uppercase tracking-widest text-white/50">
                      Biography & Supporting Achievements
                    </label>
                    <div className="relative rounded-2xl border border-white/10 bg-white/[0.045] focus-within:border-[#D90429]/70 focus-within:bg-white/[0.07] transition-all">
                      <textarea
                        required
                        maxLength={2000}
                        value={bio}
                        onChange={e => setBio(e.target.value)}
                        rows={5}
                        className="w-full bg-transparent p-4 font-inter text-sm text-white outline-none placeholder:text-white/25 resize-none"
                        placeholder="Provide a detailed description of candidate qualifications, contributions to community health services, or medical research innovations."
                      />
                      <span className="absolute bottom-2 right-4 text-[9px] font-semibold text-white/25">
                        {bio.length}/2000 chars
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex justify-between">
                  <button
                    onClick={() => setFormStep(1)}
                    className="px-6 py-3 rounded-full border border-white/10 hover:bg-white/5 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all duration-300"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                  <button
                    disabled={!applicantName || !applicantEmail || !applicantPhone || !bio}
                    onClick={() => setFormStep(3)}
                    className="px-6 py-3 bg-[#D90429] hover:bg-[#B00020] disabled:bg-white/5 disabled:text-white/20 text-white text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-2 border border-[#D90429]/20 shadow-[0_4px_15px_rgba(217,4,41,0.2)] transition-all duration-300 disabled:cursor-not-allowed"
                  >
                    <span>Next Step</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: SOCIAL HANDLES & FINAL PAYMENT CHECKOUT */}
            {formStep === 3 && (
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="space-y-1">
                  <span className="text-[9px] font-black text-[#D90429] uppercase tracking-widest">Step 3 of 3</span>
                  <h3 className="text-xl md:text-2xl font-outfit font-black uppercase text-white tracking-tight">
                    Review & Checkout
                  </h3>
                  <p className="text-xs text-white/40 leading-relaxed font-light">
                    Add social handles (optional) and complete payment using ZenoPay push authorization.
                  </p>
                </div>

                {/* Social media handles */}
                <div className="space-y-3 bg-white/[0.01] border border-white/5 p-5 rounded-2xl">
                  <span className="block font-outfit text-[10px] font-black uppercase tracking-widest text-[#D4A853]">
                    Social Media Handles (Optional)
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="relative rounded-xl border border-white/5 bg-white/[0.02] focus-within:border-white/20 transition-all">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/35" />
                      <input
                        type="url"
                        value={facebookUrl}
                        onChange={e => setFacebookUrl(e.target.value)}
                        className="w-full bg-transparent py-2.5 pl-9 pr-3 text-xs text-white outline-none placeholder:text-white/20 font-inter"
                        placeholder="Facebook URL"
                      />
                    </div>
                    <div className="relative rounded-xl border border-white/5 bg-white/[0.02] focus-within:border-white/20 transition-all">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/35" />
                      <input
                        type="url"
                        value={instagramUrl}
                        onChange={e => setInstagramUrl(e.target.value)}
                        className="w-full bg-transparent py-2.5 pl-9 pr-3 text-xs text-white outline-none placeholder:text-white/20 font-inter"
                        placeholder="Instagram URL"
                      />
                    </div>
                    <div className="relative rounded-xl border border-white/5 bg-white/[0.02] focus-within:border-white/20 transition-all">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/35" />
                      <input
                        type="url"
                        value={tiktokUrl}
                        onChange={e => setTiktokUrl(e.target.value)}
                        className="w-full bg-transparent py-2.5 pl-9 pr-3 text-xs text-white outline-none placeholder:text-white/20 font-inter"
                        placeholder="TikTok URL"
                      />
                    </div>
                  </div>
                </div>

                {/* Checkout review box */}
                {selectedCategoryObj && (
                  <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 divide-y divide-white/5 space-y-3">
                     <div className="flex justify-between text-xs py-1">
                      <span className="text-white/40">Candidate:</span>
                      <span className="font-bold text-white">{applicantName}</span>
                    </div>
                    <div className="flex justify-between text-xs pt-3 py-1">
                      <span className="text-white/40">Category:</span>
                      <span className="font-bold text-white text-right max-w-[200px] sm:max-w-md truncate">{selectedCategoryObj.name}</span>
                    </div>
                    <div className="flex justify-between text-xs pt-3 py-1">
                      <span className="text-white/40">
                        {Number(selectedCategoryObj.nomination_fee) <= 0 ? 'Contact Phone:' : 'Phone for mobile push:'}
                      </span>
                      <span className="font-bold text-white">{applicantPhone}</span>
                    </div>
                    <div className="flex justify-between pt-3 text-sm">
                      <span className="font-bold text-white/40">Nomination Fee:</span>
                      <span className="font-black text-[#D4A853] font-outfit">
                        {Number(selectedCategoryObj.nomination_fee) <= 0 
                          ? 'FREE (Bila Ada)' 
                          : `${Number(selectedCategoryObj.nomination_fee).toLocaleString()} TZS`}
                      </span>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setFormStep(2)}
                    className="px-6 py-3 rounded-full border border-white/10 hover:bg-white/5 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all duration-300"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="px-8 py-3.5 bg-gradient-to-r from-[#D90429] to-[#FF3D57] hover:from-[#B00020] hover:to-[#D90429] text-white text-[10px] font-black uppercase tracking-widest rounded-full flex items-center justify-center gap-2 border border-[#D90429]/20 shadow-[0_4px_25px_rgba(217,4,41,0.25)] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {formLoading ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : Number(selectedCategoryObj.nomination_fee) <= 0 ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <CreditCard className="w-3.5 h-3.5" />
                    )}
                    <span>
                      {Number(selectedCategoryObj.nomination_fee) <= 0 
                        ? 'Submit Free Application' 
                        : 'Submit & Pay Fee'}
                    </span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      ) : (
        /* 3. APPLICATIONS DISPLAY CARDS LIST */
        <>
          {applications.length === 0 ? (
            <div className="rounded-3xl border border-white/5 bg-[#080506] p-12 text-center space-y-6">
              <div className="mx-auto w-12 h-12 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center text-white/30">
                <Award className="w-6 h-6" />
              </div>
              <div className="space-y-1.5 max-w-sm mx-auto">
                <h3 className="font-outfit text-xs font-black uppercase tracking-wider text-white">No Nominations Found</h3>
                <p className="text-xs text-white/40 leading-relaxed font-light font-inter">
                  You haven't submitted any candidate nomination entries yet. Click the "Apply Nomination" button above to get started.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {applications.map(app => {
                const statusInfo = getStatusDetails(app.status);
                const StatusIcon = statusInfo.icon;
                const canRetry = ['pending_payment', 'payment_failed'].includes(app.status);

                return (
                  <div
                    key={app.id}
                    className="relative overflow-hidden rounded-[2rem] border border-white/5 bg-[#080506]/65 p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl relative"
                  >
                    <div className="space-y-4 text-left flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className={`px-3.5 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 ${statusInfo.classes}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          <span>{statusInfo.label}</span>
                        </span>
                        <span className="text-[10px] text-white/30 font-light font-inter">
                          Submitted on {new Date(app.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-lg md:text-xl font-outfit font-black text-white uppercase leading-tight truncate">
                          {app.applicant_name}
                        </h3>
                        <p className="text-xs font-bold text-[#D4A853] uppercase tracking-wider font-outfit">
                          Category: {app.category?.name || 'Unknown Category'}
                        </p>
                        <p className="text-xs text-white/40 leading-relaxed font-light font-inter line-clamp-2 pr-4">
                          {app.bio}
                        </p>
                      </div>
                    </div>

                    {/* ZenoPay Checkout Area */}
                    {app.transaction && (
                      <div className="shrink-0 w-full md:w-auto p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-left md:text-right space-y-3">
                        <div className="space-y-1">
                          <span className="text-[9px] font-black uppercase text-white/30 tracking-wider block">
                            Processing Fee
                          </span>
                          <span className="text-sm font-black text-white font-outfit block">
                            {Number(app.transaction.amount).toLocaleString()} TZS
                          </span>
                        </div>

                        {canRetry && (
                          <button
                            onClick={() => handleRetryPayment(app.id)}
                            disabled={actionLoading !== null}
                            className="w-full md:w-auto px-5 py-2.5 bg-[#D90429] hover:bg-[#B00020] text-white text-[9px] font-black uppercase tracking-widest rounded-full flex items-center justify-center gap-2 border border-[#D90429]/20 shadow-[0_4px_15px_rgba(217,4,41,0.2)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {actionLoading === app.id ? (
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <CreditCard className="w-3.5 h-3.5" />
                            )}
                            <span>Retry Mobile Push</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
