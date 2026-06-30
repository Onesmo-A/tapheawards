import React, { useState } from 'react';
import axios from 'axios';
import { Loader2, CheckCircle, Send, Award, ShieldAlert } from 'lucide-react';

export default function SuggestNominee() {
  const [nomineeName, setNomineeName] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [reason, setReason] = useState('');
  const [suggestorName, setSuggestorName] = useState('');
  const [suggestorContact, setSuggestorContact] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      await axios.post('/api/v1/suggestions', {
        nominee_name: nomineeName,
        category_name: categoryName,
        reason: reason,
        suggestor_name: suggestorName,
        suggestor_contact: suggestorContact
      });
      setSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to submit suggestion. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-16 px-6 relative z-10">
      
      {/* Background ambient light */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#A81C1C]/10 rounded-full blur-[100px] pointer-events-none z-0" />

      <div className="relative z-10 glass-panel p-8 md:p-12 rounded-3xl border border-white/5 space-y-6">
        
        {/* Title Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex p-3 bg-white/5 border border-white/10 rounded-2xl text-[#ff3333] mb-2 shadow-inner">
            <Award className="w-8 h-8" />
          </div>
          <span className="block text-[10px] font-black text-[#ff3333] uppercase tracking-widest font-outfit">Public Engagement</span>
          <h2 className="text-2xl md:text-3xl font-black font-outfit uppercase tracking-tight text-white">Suggest a Nominee</h2>
          <p className="text-xs text-white/45 leading-relaxed max-w-sm mx-auto">
            Recommend outstanding health practitioners, institutions, or health-tech startups for selection evaluation.
          </p>
        </div>

        {success ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
            <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-lg font-black text-white uppercase font-outfit">Recommendation Submitted</h3>
            <p className="text-xs text-white/40 max-w-sm leading-relaxed">
              Thank you for contributing to the TAPHE Awards. Our evaluation council will review your submission details during candidate screening.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            {errorMsg && (
              <div className="p-3 bg-red-500/10 border-l-4 border-[#ff3333] text-red-400 text-xs rounded-r-xl flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0 text-[#ff3333]" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-white/40 mb-1.5">Nominee Full Name</label>
                <input 
                  type="text" 
                  value={nomineeName}
                  onChange={(e) => setNomineeName(e.target.value)}
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:border-[#ff3333] focus:ring-1 focus:ring-[#ff3333] text-xs text-white outline-none transition-all"
                  placeholder="e.g. Dr. Jane Smith"
                  required
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-white/40 mb-1.5">Target Award Category</label>
                <input 
                  type="text" 
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:border-[#ff3333] focus:ring-1 focus:ring-[#ff3333] text-xs text-white outline-none transition-all"
                  placeholder="e.g. Health Specialist of the Year"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[9px] font-bold uppercase tracking-wider text-white/40 mb-1.5">Reason for Suggestion</label>
              <textarea 
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:border-[#ff3333] focus:ring-1 focus:ring-[#ff3333] text-xs text-white outline-none transition-all resize-none"
                placeholder="Explain the accomplishments that warrant this recognition..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-white/40 mb-1.5">Your Full Name</label>
                <input 
                  type="text" 
                  value={suggestorName}
                  onChange={(e) => setSuggestorName(e.target.value)}
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:border-[#ff3333] focus:ring-1 focus:ring-[#ff3333] text-xs text-white outline-none transition-all"
                  placeholder="e.g. John Doe"
                  required
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-white/40 mb-1.5">Your Contact Info</label>
                <input 
                  type="text" 
                  value={suggestorContact}
                  onChange={(e) => setSuggestorContact(e.target.value)}
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:border-[#ff3333] focus:ring-1 focus:ring-[#ff3333] text-xs text-white outline-none transition-all"
                  placeholder="Email or Phone Number"
                  required
                />
              </div>
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
                  <span>Submit Suggestion</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
