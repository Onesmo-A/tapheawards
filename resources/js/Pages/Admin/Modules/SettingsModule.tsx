import React from 'react';
import adminApi from '../Utils/adminApi';
import { Loader2, ShieldCheck, HelpCircle } from 'lucide-react';

interface SettingsModuleProps {
  votingActive: string;
  setVotingActive: (val: string) => void;
  votingDeadline: string;
  setVotingDeadline: (val: string) => void;
  activeSeasonYear: string;
  setActiveSeasonYear: (val: string) => void;
  marathonFee: string;
  setMarathonFee: (val: string) => void;
  showWinners: string;
  setShowWinners: (val: string) => void;
  showVisitorStatistics: string;
  setShowVisitorStatistics: (val: string) => void;
  eventLocationName: string;
  setEventLocationName: (val: string) => void;
  eventLocationAddress: string;
  setEventLocationAddress: (val: string) => void;
  eventLocationMapUrl: string;
  setEventLocationMapUrl: (val: string) => void;
  nominationOpenTitle: string;
  setNominationOpenTitle: (val: string) => void;
  nominationOpenDates: string;
  setNominationOpenDates: (val: string) => void;
  timelineStep1Title: string;
  setTimelineStep1Title: (val: string) => void;
  timelineStep1Date: string;
  setTimelineStep1Date: (val: string) => void;
  timelineStep2Title: string;
  setTimelineStep2Title: (val: string) => void;
  timelineStep2Date: string;
  setTimelineStep2Date: (val: string) => void;
  timelineStep3Title: string;
  setTimelineStep3Title: (val: string) => void;
  timelineStep3Date: string;
  setTimelineStep3Date: (val: string) => void;
  timelineStep4Title: string;
  setTimelineStep4Title: (val: string) => void;
  timelineStep4Date: string;
  setTimelineStep4Date: (val: string) => void;
  timelineStep5Title: string;
  setTimelineStep5Title: (val: string) => void;
  timelineStep5Date: string;
  setTimelineStep5Date: (val: string) => void;

  // Countdown settings
  countdownEnabled: string;
  setCountdownEnabled: (val: string) => void;
  countdownStartDate: string;
  setCountdownStartDate: (val: string) => void;
  countdownStartLabel: string;
  setCountdownStartLabel: (val: string) => void;
  countdownTargetDate: string;
  setCountdownTargetDate: (val: string) => void;
  countdownLabel: string;
  setCountdownLabel: (val: string) => void;

  // Contact settings
  contactWhatsapp: string;
  setContactWhatsapp: (val: string) => void;
  contactEmail: string;
  setContactEmail: (val: string) => void;
  contactPhone: string;
  setContactPhone: (val: string) => void;
  contactAddress: string;
  setContactAddress: (val: string) => void;

  // OTP channels settings
  otpSmsEnabled: string;
  setOtpSmsEnabled: (val: string) => void;
  otpWhatsappEnabled: string;
  setOtpWhatsappEnabled: (val: string) => void;

  // Hero backgrounds settings
  heroSlide1Image: string;
  setHeroSlide1Image: (val: string) => void;
  heroSlide2Image: string;
  setHeroSlide2Image: (val: string) => void;
  heroSlide3Image: string;
  setHeroSlide3Image: (val: string) => void;
  heroSlide4Image: string;
  setHeroSlide4Image: (val: string) => void;

  updatingSettings: boolean;
  setUpdatingSettings: (val: boolean) => void;
  setErrorMsg: (msg: string) => void;
  setSuccessMsg: (msg: string) => void;
}

export default function SettingsModule({
  votingActive,
  setVotingActive,
  votingDeadline,
  setVotingDeadline,
  activeSeasonYear,
  setActiveSeasonYear,
  marathonFee,
  setMarathonFee,
  showWinners,
  setShowWinners,
  showVisitorStatistics,
  setShowVisitorStatistics,
  eventLocationName,
  setEventLocationName,
  eventLocationAddress,
  setEventLocationAddress,
  eventLocationMapUrl,
  setEventLocationMapUrl,
  nominationOpenTitle,
  setNominationOpenTitle,
  nominationOpenDates,
  setNominationOpenDates,
  timelineStep1Title,
  setTimelineStep1Title,
  timelineStep1Date,
  setTimelineStep1Date,
  timelineStep2Title,
  setTimelineStep2Title,
  timelineStep2Date,
  setTimelineStep2Date,
  timelineStep3Title,
  setTimelineStep3Title,
  timelineStep3Date,
  setTimelineStep3Date,
  timelineStep4Title,
  setTimelineStep4Title,
  timelineStep4Date,
  setTimelineStep4Date,
  timelineStep5Title,
  setTimelineStep5Title,
  timelineStep5Date,
  setTimelineStep5Date,

  countdownEnabled,
  setCountdownEnabled,
  countdownStartDate,
  setCountdownStartDate,
  countdownStartLabel,
  setCountdownStartLabel,
  countdownTargetDate,
  setCountdownTargetDate,
  countdownLabel,
  setCountdownLabel,

  contactWhatsapp,
  setContactWhatsapp,
  contactEmail,
  setContactEmail,
  contactPhone,
  setContactPhone,
  contactAddress,
  setContactAddress,

  otpSmsEnabled,
  setOtpSmsEnabled,
  otpWhatsappEnabled,
  setOtpWhatsappEnabled,

  heroSlide1Image,
  setHeroSlide1Image,
  heroSlide2Image,
  setHeroSlide2Image,
  heroSlide3Image,
  setHeroSlide3Image,
  heroSlide4Image,
  setHeroSlide4Image,

  updatingSettings,
  setUpdatingSettings,
  setErrorMsg,
  setSuccessMsg
}: SettingsModuleProps) {

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingSettings(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      const response = await adminApi.post('/api/v1/admin/settings', {
        settings: {
          voting_active: votingActive,
          voting_enabled: votingActive, // Keep both in sync
          voting_deadline: votingDeadline,
          active_season_year: activeSeasonYear,
          active_season: activeSeasonYear, // Keep both in sync
          marathon_fee: marathonFee,
          show_winners: showWinners,
          show_winners_page: showWinners, // Keep both in sync
          show_visitor_statistics: showVisitorStatistics,
          event_location_name: eventLocationName,
          event_location_address: eventLocationAddress,
          event_location_map_url: eventLocationMapUrl,
          nomination_open_title: nominationOpenTitle,
          nomination_open_dates: nominationOpenDates,

          timeline_step1_title: timelineStep1Title,
          timeline_step1_date: timelineStep1Date,
          timeline_step2_title: timelineStep2Title,
          timeline_step2_date: timelineStep2Date,
          timeline_step3_title: timelineStep3Title,
          timeline_step3_date: timelineStep3Date,
          timeline_step4_title: timelineStep4Title,
          timeline_step4_date: timelineStep4Date,
          timeline_step5_title: timelineStep5Title,
          timeline_step5_date: timelineStep5Date,

          countdown_enabled: countdownEnabled,
          countdown_start_date: countdownStartDate,
          countdown_start_label: countdownStartLabel,
          countdown_target_date: countdownTargetDate,
          countdown_label: countdownLabel,

          contact_whatsapp: contactWhatsapp,
          contact_email: contactEmail,
          contact_phone: contactPhone,
          contact_address: contactAddress,

          otp_sms_enabled: otpSmsEnabled,
          otp_whatsapp_enabled: otpWhatsappEnabled,

          hero_slide_1_image: heroSlide1Image,
          hero_slide_2_image: heroSlide2Image,
          hero_slide_3_image: heroSlide3Image,
          hero_slide_4_image: heroSlide4Image,
        }
      });
      if (response.data.status === 'success') {
        setSuccessMsg('System configuration settings saved.');
      }
    } catch {
      setErrorMsg('Failed to update configuration settings.');
    } finally {
      setUpdatingSettings(false);
    }
  };

  return (
    <form onSubmit={handleSaveSettings} className="space-y-6 max-w-xl pb-16">

      {/* Winners & Statistics Settings */}
      <div className="p-6 rounded-3xl bg-[#0b0b0b] border border-white/5 space-y-4">
        <h3 className="text-xs font-black uppercase text-[#D90429] tracking-wider font-outfit mb-2">Winners & Display settings</h3>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase text-white/60">Show Winners & Results Publicly</span>
          <select value={showWinners} onChange={(e) => setShowWinners(e.target.value)} className="px-4 py-2 bg-black/40 border border-white/10 rounded-xl text-xs outline-none text-white">
            <option value="1">Enabled</option>
            <option value="0">Disabled</option>
          </select>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase text-white/60">Show Visitor Statistics on Home</span>
          <select value={showVisitorStatistics} onChange={(e) => setShowVisitorStatistics(e.target.value)} className="px-4 py-2 bg-black/40 border border-white/10 rounded-xl text-xs outline-none text-white">
            <option value="1">Enabled</option>
            <option value="0">Disabled</option>
          </select>
        </div>
      </div>

      {/* OTP Verification Channels */}
      <div className="p-6 rounded-3xl bg-[#0b0b0b] border border-white/5 space-y-4">
        <h3 className="text-xs font-black uppercase text-[#D90429] tracking-wider font-outfit mb-2">OTP Verification Channels</h3>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase text-white/60">Enable SMS OTP Channel</span>
          <select value={otpSmsEnabled} onChange={(e) => setOtpSmsEnabled(e.target.value)} className="px-4 py-2 bg-black/40 border border-white/10 rounded-xl text-xs outline-none text-white">
            <option value="1">Enabled</option>
            <option value="0">Disabled</option>
          </select>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase text-white/60">Enable WhatsApp OTP Channel</span>
          <select value={otpWhatsappEnabled} onChange={(e) => setOtpWhatsappEnabled(e.target.value)} className="px-4 py-2 bg-black/40 border border-white/10 rounded-xl text-xs outline-none text-white">
            <option value="1">Enabled</option>
            <option value="0">Disabled</option>
          </select>
        </div>
      </div>

      {/* Voting & Season Parameters */}
      <div className="p-6 rounded-3xl bg-[#0b0b0b] border border-white/5 space-y-4">
        <h3 className="text-xs font-black uppercase text-[#D90429] tracking-wider font-outfit mb-2">Voting & Season parameters</h3>

        <div className="space-y-1.5">
          <label className="text-[9px] font-black uppercase text-white/40">Global Voting Status</label>
          <select value={votingActive} onChange={(e) => setVotingActive(e.target.value)} className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-xs outline-none text-white">
            <option value="1">Voting Open</option>
            <option value="0">Voting Closed</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-[9px] font-black uppercase text-white/40">Voting Deadline Date & Time</label>
          <input type="datetime-local" value={votingDeadline} onChange={(e) => setVotingDeadline(e.target.value)} className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-xs text-white outline-none focus:border-[#D90429]" />
        </div>

        <div className="space-y-1.5">
          <label className="text-[9px] font-black uppercase text-white/40">Active Awards Season Year</label>
          <input type="number" value={activeSeasonYear} onChange={(e) => setActiveSeasonYear(e.target.value)} className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-xs text-white outline-none focus:border-[#D90429]" placeholder="e.g. 2026" />
        </div>
      </div>

      {/* Countdown Timer Configuration */}
      <div className="p-6 rounded-3xl bg-[#0b0b0b] border border-white/5 space-y-4">
        <h3 className="text-xs font-black uppercase text-[#D90429] tracking-wider font-outfit mb-2">Event Countdown Timer</h3>

        <div className="space-y-1.5">
          <label className="text-[9px] font-black uppercase text-white/40">Countdown Display Status</label>
          <select value={countdownEnabled} onChange={(e) => setCountdownEnabled(e.target.value)} className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-xs outline-none text-white">
            <option value="1">Show Timer Publicly</option>
            <option value="0">Hide Timer Publicly</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-[9px] font-black uppercase text-white/40">Countdown Start Label</label>
          <input type="text" value={countdownStartLabel} onChange={(e) => setCountdownStartLabel(e.target.value)} className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-xs text-white outline-none focus:border-[#D90429]" placeholder="e.g. Online Voting Opens In" />
        </div>

        <div className="space-y-1.5">
          <label className="text-[9px] font-black uppercase text-white/40">Countdown Start Date & Time</label>
          <input type="datetime-local" value={countdownStartDate} onChange={(e) => setCountdownStartDate(e.target.value)} className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-xs text-white outline-none focus:border-[#D90429]" />
        </div>

        <div className="space-y-1.5">
          <label className="text-[9px] font-black uppercase text-white/40">Countdown Target Label</label>
          <input type="text" value={countdownLabel} onChange={(e) => setCountdownLabel(e.target.value)} className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-xs text-white outline-none focus:border-[#D90429]" placeholder="e.g. Online Voting Closes In" />
        </div>

        <div className="space-y-1.5">
          <label className="text-[9px] font-black uppercase text-white/40">Countdown Target Deadline Date & Time</label>
          <input type="datetime-local" value={countdownTargetDate} onChange={(e) => setCountdownTargetDate(e.target.value)} className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-xs text-white outline-none focus:border-[#D90429]" />
        </div>
      </div>

      {/* Marathon Fee & Setup */}
      <div className="p-6 rounded-3xl bg-[#0b0b0b] border border-white/5 space-y-4">
        <h3 className="text-xs font-black uppercase text-[#D90429] tracking-wider font-outfit mb-2">Marathon parameters</h3>
        <div className="space-y-1.5">
          <label className="text-[9px] font-black uppercase text-white/40">Marathon Registration Fee (TZS)</label>
          <input type="number" value={marathonFee} onChange={(e) => setMarathonFee(e.target.value)} className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-xs text-white outline-none focus:border-[#D90429]" />
        </div>
      </div>

      {/* Event Location */}
      <div className="p-6 rounded-3xl bg-[#0b0b0b] border border-white/5 space-y-4">
        <h3 className="text-xs font-black uppercase text-[#D90429] tracking-wider font-outfit mb-2">Event Location Details</h3>
        <div className="space-y-1.5">
          <label className="text-[9px] font-black uppercase text-white/40">Location Venue Name</label>
          <input type="text" value={eventLocationName} onChange={(e) => setEventLocationName(e.target.value)} className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-xs text-white outline-none focus:border-[#D90429]" />
        </div>
        <div className="space-y-1.5">
          <label className="text-[9px] font-black uppercase text-white/40">Location Address</label>
          <input type="text" value={eventLocationAddress} onChange={(e) => setEventLocationAddress(e.target.value)} className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-xs text-white outline-none focus:border-[#D90429]" />
        </div>
        <div className="space-y-1.5">
          <label className="text-[9px] font-black uppercase text-white/40">Google Maps Embed URL</label>
          <input type="text" value={eventLocationMapUrl} onChange={(e) => setEventLocationMapUrl(e.target.value)} className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-xs text-white outline-none focus:border-[#D90429]" placeholder="https://www.google.com/maps/embed?..." />
        </div>
      </div>

      {/* Nomination Open Timeline */}
      <div className="p-6 rounded-3xl bg-[#0b0b0b] border border-white/5 space-y-4">
        <h3 className="text-xs font-black uppercase text-[#D90429] tracking-wider font-outfit mb-2">Nomination settings</h3>
        <div className="space-y-1.5">
          <label className="text-[9px] font-black uppercase text-white/40">Nomination Open Banner Title</label>
          <input type="text" value={nominationOpenTitle} onChange={(e) => setNominationOpenTitle(e.target.value)} className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-xs text-white outline-none focus:border-[#D90429]" />
        </div>
        <div className="space-y-1.5">
          <label className="text-[9px] font-black uppercase text-white/40">Nomination Date range</label>
          <input type="text" value={nominationOpenDates} onChange={(e) => setNominationOpenDates(e.target.value)} className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-xs text-white outline-none focus:border-[#D90429]" />
        </div>
      </div>

      {/* Contact Details Settings */}
      <div className="p-6 rounded-3xl bg-[#0b0b0b] border border-white/5 space-y-4">
        <h3 className="text-xs font-black uppercase text-[#D90429] tracking-wider font-outfit mb-2">Contact Secretariat Details</h3>

        <div className="space-y-1.5">
          <label className="text-[9px] font-black uppercase text-white/40">WhatsApp Contact Link</label>
          <input type="text" value={contactWhatsapp} onChange={(e) => setContactWhatsapp(e.target.value)} className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-xs text-white outline-none focus:border-[#D90429]" placeholder="e.g. https://wa.me/255743331626" />
        </div>

        <div className="space-y-1.5">
          <label className="text-[9px] font-black uppercase text-white/40">Support Email Address</label>
          <input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-xs text-white outline-none focus:border-[#D90429]" placeholder="e.g. info@tapheawards.co.tz" />
        </div>

        <div className="space-y-1.5">
          <label className="text-[9px] font-black uppercase text-white/40">Support Telephone Number</label>
          <input type="text" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-xs text-white outline-none focus:border-[#D90429]" placeholder="e.g. +255 749 562 993" />
        </div>

        <div className="space-y-1.5">
          <label className="text-[9px] font-black uppercase text-white/40">Physical Secretariat Address</label>
          <input type="text" value={contactAddress} onChange={(e) => setContactAddress(e.target.value)} className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-xs text-white outline-none focus:border-[#D90429]" placeholder="e.g. Dar es Salaam, Tanzania" />
        </div>
      </div>

      {/* Hero Slide Images Paths */}
      <div className="p-6 rounded-3xl bg-[#0b0b0b] border border-white/5 space-y-4">
        <h3 className="text-xs font-black uppercase text-[#D90429] tracking-wider font-outfit mb-2">Home Hero Background Slides</h3>

        <div className="space-y-1.5">
          <label className="text-[9px] font-black uppercase text-white/40">Slide 1 Background Image Path</label>
          <input type="text" value={heroSlide1Image} onChange={(e) => setHeroSlide1Image(e.target.value)} className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-xs text-white outline-none focus:border-[#D90429]" placeholder="e.g. images/hero/slide-1.webp" />
        </div>

        <div className="space-y-1.5">
          <label className="text-[9px] font-black uppercase text-white/40">Slide 2 Background Image Path</label>
          <input type="text" value={heroSlide2Image} onChange={(e) => setHeroSlide2Image(e.target.value)} className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-xs text-white outline-none focus:border-[#D90429]" placeholder="e.g. images/hero/slide-2.webp" />
        </div>

        <div className="space-y-1.5">
          <label className="text-[9px] font-black uppercase text-white/40">Slide 3 Background Image Path</label>
          <input type="text" value={heroSlide3Image} onChange={(e) => setHeroSlide3Image(e.target.value)} className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-xs text-white outline-none focus:border-[#D90429]" placeholder="e.g. images/hero/slide-3.webp" />
        </div>

        <div className="space-y-1.5">
          <label className="text-[9px] font-black uppercase text-white/40">Slide 4 Background Image Path</label>
          <input type="text" value={heroSlide4Image} onChange={(e) => setHeroSlide4Image(e.target.value)} className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-xs text-white outline-none focus:border-[#D90429]" placeholder="e.g. images/hero/slide-4.webp" />
        </div>
      </div>

      {/* Timeline Milestones */}
      <div className="p-6 rounded-3xl bg-[#0b0b0b] border border-white/5 space-y-4">
        <h3 className="text-xs font-black uppercase text-[#D90429] tracking-wider font-outfit mb-2">Event Timeline Steps</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[8px] font-black uppercase text-white/40 block mb-1">Step 1: Title</label>
            <input type="text" value={timelineStep1Title} onChange={(e) => setTimelineStep1Title(e.target.value)} className="w-full px-3 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs outline-none text-white focus:border-[#D90429]" />
          </div>
          <div>
            <label className="text-[8px] font-black uppercase text-white/40 block mb-1">Step 1: Date range</label>
            <input type="text" value={timelineStep1Date} onChange={(e) => setTimelineStep1Date(e.target.value)} className="w-full px-3 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs outline-none text-white focus:border-[#D90429]" />
          </div>

          <div>
            <label className="text-[8px] font-black uppercase text-white/40 block mb-1">Step 2: Title</label>
            <input type="text" value={timelineStep2Title} onChange={(e) => setTimelineStep2Title(e.target.value)} className="w-full px-3 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs outline-none text-white focus:border-[#D90429]" />
          </div>
          <div>
            <label className="text-[8px] font-black uppercase text-white/40 block mb-1">Step 2: Date range</label>
            <input type="text" value={timelineStep2Date} onChange={(e) => setTimelineStep2Date(e.target.value)} className="w-full px-3 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs outline-none text-white focus:border-[#D90429]" />
          </div>

          <div>
            <label className="text-[8px] font-black uppercase text-white/40 block mb-1">Step 3: Title</label>
            <input type="text" value={timelineStep3Title} onChange={(e) => setTimelineStep3Title(e.target.value)} className="w-full px-3 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs outline-none text-white focus:border-[#D90429]" />
          </div>
          <div>
            <label className="text-[8px] font-black uppercase text-white/40 block mb-1">Step 3: Date range</label>
            <input type="text" value={timelineStep3Date} onChange={(e) => setTimelineStep3Date(e.target.value)} className="w-full px-3 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs outline-none text-white focus:border-[#D90429]" />
          </div>

          <div>
            <label className="text-[8px] font-black uppercase text-white/40 block mb-1">Step 4: Title</label>
            <input type="text" value={timelineStep4Title} onChange={(e) => setTimelineStep4Title(e.target.value)} className="w-full px-3 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs outline-none text-white focus:border-[#D90429]" />
          </div>
          <div>
            <label className="text-[8px] font-black uppercase text-white/40 block mb-1">Step 4: Date range</label>
            <input type="text" value={timelineStep4Date} onChange={(e) => setTimelineStep4Date(e.target.value)} className="w-full px-3 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs outline-none text-white focus:border-[#D90429]" />
          </div>

          <div>
            <label className="text-[8px] font-black uppercase text-white/40 block mb-1">Step 5: Title</label>
            <input type="text" value={timelineStep5Title} onChange={(e) => setTimelineStep5Title(e.target.value)} className="w-full px-3 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs outline-none text-white focus:border-[#D90429]" />
          </div>
          <div>
            <label className="text-[8px] font-black uppercase text-white/40 block mb-1">Step 5: Date range</label>
            <input type="text" value={timelineStep5Date} onChange={(e) => setTimelineStep5Date(e.target.value)} className="w-full px-3 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs outline-none text-white focus:border-[#D90429]" />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={updatingSettings}
        className="w-full py-4 bg-gradient-to-r from-[#D90429] to-[#FF3D57] hover:from-[#B00020] hover:to-[#D90429] disabled:opacity-60 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_25px_rgba(217,4,41,0.25)]"
      >
        {updatingSettings ? <Loader2 className="w-4 h-4 animate-spin" /> : <><span>Save Configuration</span><ShieldCheck className="w-4 h-4" /></>}
      </button>

    </form>
  );
}
