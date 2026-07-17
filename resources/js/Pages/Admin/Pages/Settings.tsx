import React, { useEffect, useState } from 'react';
import adminApi from '../Utils/adminApi';
import SettingsModule from '../Modules/SettingsModule';

export default function Settings() {
  const [votingActive, setVotingActive] = useState('1');
  const [votingDeadline, setVotingDeadline] = useState('');
  const [activeSeasonYear, setActiveSeasonYear] = useState('2026');
  const [marathonFee, setMarathonFee] = useState('35000');
  const [showWinners, setShowWinners] = useState('0');
  const [showVisitorStatistics, setShowVisitorStatistics] = useState('1');
  const [eventLocationName, setEventLocationName] = useState('TBA Event Venue');
  const [eventLocationAddress, setEventLocationAddress] = useState('Venue will be announced soon.');
  const [eventLocationMapUrl, setEventLocationMapUrl] = useState('');
  const [nominationOpenTitle, setNominationOpenTitle] = useState('Nomination Applications Now Open!');
  const [nominationOpenDates, setNominationOpenDates] = useState('July 2026');
  
  // Timeline milestones
  const [timelineStep1Title, setTimelineStep1Title] = useState('Public Suggestions');
  const [timelineStep1Date, setTimelineStep1Date] = useState('Aug 30 - Sep 15');
  const [timelineStep2Title, setTimelineStep2Title] = useState('Nominee Applications');
  const [timelineStep2Date, setTimelineStep2Date] = useState('Sep 16 - Oct 10');
  const [timelineStep3Title, setTimelineStep3Title] = useState('Marathon & Health Expo');
  const [timelineStep3Date, setTimelineStep3Date] = useState('Oct 25');
  const [timelineStep4Title, setTimelineStep4Title] = useState('Awards Gala Night');
  const [timelineStep4Date, setTimelineStep4Date] = useState('Nov 03');
  const [timelineStep5Title, setTimelineStep5Title] = useState('Winners Announcement');
  const [timelineStep5Date, setTimelineStep5Date] = useState('Nov 10');

  // Countdown timer settings
  const [countdownEnabled, setCountdownEnabled] = useState('0');
  const [countdownStartDate, setCountdownStartDate] = useState('');
  const [countdownStartLabel, setCountdownStartLabel] = useState('Online Voting Opens In');
  const [countdownTargetDate, setCountdownTargetDate] = useState('');
  const [countdownLabel, setCountdownLabel] = useState('Online Voting Closes In');

  // Contact settings
  const [contactWhatsapp, setContactWhatsapp] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactAddress, setContactAddress] = useState('');

  // OTP channels settings
  const [otpSmsEnabled, setOtpSmsEnabled] = useState('1');
  const [otpWhatsappEnabled, setOtpWhatsappEnabled] = useState('1');

  // Hero backgrounds settings
  const [heroSlide1Image, setHeroSlide1Image] = useState('');
  const [heroSlide2Image, setHeroSlide2Image] = useState('');
  const [heroSlide3Image, setHeroSlide3Image] = useState('');
  const [heroSlide4Image, setHeroSlide4Image] = useState('');

  const [updatingSettings, setUpdatingSettings] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await adminApi.get('/api/v1/admin/settings');
      if (response.data.status === 'success') {
        const s = response.data.settings;
        setVotingActive(s.voting_active || s.voting_enabled || '1');
        setVotingDeadline(s.voting_deadline || '');
        setActiveSeasonYear(s.active_season_year || s.active_season || '2026');
        setMarathonFee(s.marathon_fee || '35000');
        setShowWinners(s.show_winners || s.show_winners_page || '0');
        setShowVisitorStatistics(s.show_visitor_statistics || '1');
        setEventLocationName(s.event_location_name || 'TBA Event Venue');
        setEventLocationAddress(s.event_location_address || 'Venue will be announced soon.');
        setEventLocationMapUrl(s.event_location_map_url || '');
        setNominationOpenTitle(s.nomination_open_title || 'Nomination Applications Now Open!');
        setNominationOpenDates(s.nomination_open_dates || 'July 2026');
        
        setTimelineStep1Title(s.timeline_step1_title || 'Public Suggestions');
        setTimelineStep1Date(s.timeline_step1_date || 'Aug 30 - Sep 15');
        setTimelineStep2Title(s.timeline_step2_title || 'Nominee Applications');
        setTimelineStep2Date(s.timeline_step2_date || 'Sep 16 - Oct 10');
        setTimelineStep3Title(s.timeline_step3_title || 'Marathon & Health Expo');
        setTimelineStep3Date(s.timeline_step3_date || 'Oct 25');
        setTimelineStep4Title(s.timeline_step4_title || 'Awards Gala Night');
        setTimelineStep4Date(s.timeline_step4_date || 'Nov 03');
        setTimelineStep5Title(s.timeline_step5_title || 'Winners Announcement');
        setTimelineStep5Date(s.timeline_step5_date || 'Nov 10');

        setCountdownEnabled(s.countdown_enabled || '0');
        let startDate = s.countdown_start_date || '';
        if (startDate) {
          startDate = startDate.replace(' ', 'T');
          if (startDate.includes('.')) {
            startDate = startDate.split('.')[0];
          }
          if (startDate.length > 16) {
            startDate = startDate.slice(0, 16);
          }
        }
        setCountdownStartDate(startDate);
        setCountdownStartLabel(s.countdown_start_label || 'Online Voting Opens In');

        let targetDate = s.countdown_target_date || '';
        if (targetDate) {
          targetDate = targetDate.replace(' ', 'T');
          if (targetDate.includes('.')) {
            targetDate = targetDate.split('.')[0];
          }
          if (targetDate.length > 16) {
            targetDate = targetDate.slice(0, 16);
          }
        }
        setCountdownTargetDate(targetDate);
        setCountdownLabel(s.countdown_label || 'Online Voting Closes In');

        setContactWhatsapp(s.contact_whatsapp || '');
        setContactEmail(s.contact_email || '');
        setContactPhone(s.contact_phone || '');
        setContactAddress(s.contact_address || '');

        setOtpSmsEnabled(s.otp_sms_enabled !== undefined ? String(s.otp_sms_enabled) : '1');
        setOtpWhatsappEnabled(s.otp_whatsapp_enabled !== undefined ? String(s.otp_whatsapp_enabled) : '1');

        setHeroSlide1Image(s.hero_slide_1_image || '');
        setHeroSlide2Image(s.hero_slide_2_image || '');
        setHeroSlide3Image(s.hero_slide_3_image || '');
        setHeroSlide4Image(s.hero_slide_4_image || '');
      }
    } catch {
      setErrorMsg('Failed to load system settings configuration.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#D90429]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {errorMsg && (
        <div className="p-4 bg-[#D90429]/10 border border-[#D90429]/20 text-[#D90429] text-[11px] font-bold uppercase rounded-2xl text-center mb-6 tracking-wider">
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-500 text-[11px] font-bold uppercase rounded-2xl text-center mb-6 tracking-wider">
          {successMsg}
        </div>
      )}

      <SettingsModule
        votingActive={votingActive}
        setVotingActive={setVotingActive}
        votingDeadline={votingDeadline}
        setVotingDeadline={setVotingDeadline}
        activeSeasonYear={activeSeasonYear}
        setActiveSeasonYear={setActiveSeasonYear}
        marathonFee={marathonFee}
        setMarathonFee={setMarathonFee}
        showWinners={showWinners}
        setShowWinners={setShowWinners}
        showVisitorStatistics={showVisitorStatistics}
        setShowVisitorStatistics={setShowVisitorStatistics}
        eventLocationName={eventLocationName}
        setEventLocationName={setEventLocationName}
        eventLocationAddress={eventLocationAddress}
        setEventLocationAddress={setEventLocationAddress}
        eventLocationMapUrl={eventLocationMapUrl}
        setEventLocationMapUrl={setEventLocationMapUrl}
        nominationOpenTitle={nominationOpenTitle}
        setNominationOpenTitle={setNominationOpenTitle}
        nominationOpenDates={nominationOpenDates}
        setNominationOpenDates={setNominationOpenDates}
        timelineStep1Title={timelineStep1Title}
        setTimelineStep1Title={setTimelineStep1Title}
        timelineStep1Date={timelineStep1Date}
        setTimelineStep1Date={setTimelineStep1Date}
        timelineStep2Title={timelineStep2Title}
        setTimelineStep2Title={setTimelineStep2Title}
        timelineStep2Date={timelineStep2Date}
        setTimelineStep2Date={setTimelineStep2Date}
        timelineStep3Title={timelineStep3Title}
        setTimelineStep3Title={setTimelineStep3Title}
        timelineStep3Date={timelineStep3Date}
        setTimelineStep3Date={setTimelineStep3Date}
        timelineStep4Title={timelineStep4Title}
        setTimelineStep4Title={setTimelineStep4Title}
        timelineStep4Date={timelineStep4Date}
        setTimelineStep4Date={setTimelineStep4Date}
        timelineStep5Title={timelineStep5Title}
        setTimelineStep5Title={setTimelineStep5Title}
        timelineStep5Date={timelineStep5Date}
        setTimelineStep5Date={setTimelineStep5Date}
        
        countdownEnabled={countdownEnabled}
        setCountdownEnabled={setCountdownEnabled}
        countdownStartDate={countdownStartDate}
        setCountdownStartDate={setCountdownStartDate}
        countdownStartLabel={countdownStartLabel}
        setCountdownStartLabel={setCountdownStartLabel}
        countdownTargetDate={countdownTargetDate}
        setCountdownTargetDate={setCountdownTargetDate}
        countdownLabel={countdownLabel}
        setCountdownLabel={setCountdownLabel}

        contactWhatsapp={contactWhatsapp}
        setContactWhatsapp={setContactWhatsapp}
        contactEmail={contactEmail}
        setContactEmail={setContactEmail}
        contactPhone={contactPhone}
        setContactPhone={setContactPhone}
        contactAddress={contactAddress}
        setContactAddress={setContactAddress}

        otpSmsEnabled={otpSmsEnabled}
        setOtpSmsEnabled={setOtpSmsEnabled}
        otpWhatsappEnabled={otpWhatsappEnabled}
        setOtpWhatsappEnabled={setOtpWhatsappEnabled}

        heroSlide1Image={heroSlide1Image}
        setHeroSlide1Image={setHeroSlide1Image}
        heroSlide2Image={heroSlide2Image}
        setHeroSlide2Image={setHeroSlide2Image}
        heroSlide3Image={heroSlide3Image}
        setHeroSlide3Image={setHeroSlide3Image}
        heroSlide4Image={heroSlide4Image}
        setHeroSlide4Image={setHeroSlide4Image}

        updatingSettings={updatingSettings}
        setUpdatingSettings={setUpdatingSettings}
        setErrorMsg={setErrorMsg}
        setSuccessMsg={setSuccessMsg}
      />
    </div>
  );
}
