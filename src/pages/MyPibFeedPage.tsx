import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bell, CheckCircle, Mail, Clock, 
  ArrowRight, ArrowLeft, Edit3, Trash2,
  Send, Sparkles, Filter, Rss, ShieldCheck, Check,
  Download, ExternalLink, X, Info, HelpCircle, Globe
} from 'lucide-react';
import { MINISTRIES_DATA } from '../data/ministries';
import { RELEASES_DATA } from '../data/releases';
import { loadPreferences, saveSubscription, clearSubscription } from '../services/preferenceService';
import { ReleaseCard } from '../components/common/ReleaseCard';
import { EmblemOfIndia } from '../components/brand/EmblemOfIndia';
import { generateDigestPdf } from '../utils/pdfGenerator';
import { useTranslation } from '../i18n/useTranslation';
import { sendPibDigestEmail, scheduleSubscriptionOnServer, type SendEmailResult } from '../services/emailService';
import type { Category, ContentType, SubscriptionConfig, PressRelease } from '../types';

export const MyPibFeedPage: React.FC = () => {
  const { lang, t } = useTranslation();
  const currentPreferences = loadPreferences();
  const existingSub = currentPreferences.emailSubscription;

  // Step state: 1: Topics & Ministries, 2: Email, 3: Schedule, 4: Review, 5: Active Feed & Dispatch
  const [currentStep, setCurrentStep] = useState<number>(existingSub ? 5 : 1);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [testSentToast, setTestSentToast] = useState(false);
  const [isSendingSmtp, setIsSendingSmtp] = useState(false);
  const [smtpResult, setSmtpResult] = useState<SendEmailResult | null>(null);

  // Form State
  const [selectedTopics, setSelectedTopics] = useState<Category[]>(
    existingSub?.selectedTopics || ['Economy & Finance', 'Science & Technology', 'Health & Family Welfare']
  );
  const [selectedMinistries, setSelectedMinistries] = useState<string[]>(
    existingSub?.selectedMinistries || ['finance', 'meity', 'railways']
  );
  const [selectedContentTypes, setSelectedContentTypes] = useState<ContentType[]>(
    existingSub?.contentTypes || ['Press Release', 'Factsheet']
  );
  const [selectedLanguage, setSelectedLanguage] = useState<'all' | 'en' | 'hi'>(
    existingSub?.language || 'all'
  );
  const [emailAddress, setEmailAddress] = useState<string>(existingSub?.email || '');
  const [emailError, setEmailError] = useState<string>('');
  const [frequency, setFrequency] = useState<'instant' | 'daily' | 'weekly'>(
    existingSub?.frequency || 'daily'
  );
  const [deliveryTimeIST, setDeliveryTimeIST] = useState<string>(
    existingSub?.deliveryTimeIST || '08:00 AM'
  );

  const presetTimes = ['08:00 AM', '01:00 PM', '07:00 PM', '09:30 PM'];
  const [isCustomTime, setIsCustomTime] = useState<boolean>(() => {
    return Boolean(existingSub?.deliveryTimeIST && !presetTimes.includes(existingSub.deliveryTimeIST));
  });
  const [customTimeVal, setCustomTimeVal] = useState<string>('08:00');

  const format24to12 = (val24: string) => {
    if (!val24) return '08:00 AM';
    const [hStr, mStr] = val24.split(':');
    let h = parseInt(hStr, 10);
    const m = mStr || '00';
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    if (h === 0) h = 12;
    return `${h.toString().padStart(2, '0')}:${m} ${ampm}`;
  };

  const availableCategories: Category[] = [
    'Economy & Finance',
    'Science & Technology',
    'Defence & Security',
    'Health & Family Welfare',
    'Environment & Climate',
    'Agriculture & Rural',
    'Education & Skill',
    'Commerce & Industry',
    'National & Governance',
    'Infrastructure & Transport'
  ];

  const contentTypesList: ContentType[] = ['Press Release', 'Factsheet', 'Feature'];
  const timeOptionsIST = ['08:00 AM', '01:00 PM', '07:00 PM', '09:30 PM'];

  const toggleTopic = (cat: Category) => {
    setSelectedTopics(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const toggleMinistry = (mId: string) => {
    setSelectedMinistries(prev => 
      prev.includes(mId) ? prev.filter(id => id !== mId) : [...prev, mId]
    );
  };

  const toggleContentType = (ct: ContentType) => {
    setSelectedContentTypes(prev => 
      prev.includes(ct) ? prev.filter(c => c !== ct) : [...prev, ct]
    );
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleNextFromStep2 = () => {
    if (!emailAddress.trim()) {
      setEmailError('Email address is required.');
      return;
    }
    if (!validateEmail(emailAddress.trim())) {
      setEmailError('Please enter a valid email address (e.g. name@domain.gov.in or name@example.com).');
      return;
    }
    setEmailError('');
    setCurrentStep(3);
  };

  const targetRecipientEmail = emailAddress.trim() || existingSub?.email || 'kachraseth8008@gmail.com';

  // Filter actual releases matching the active subscription
  const matchingReleases = useMemo(() => {
    return RELEASES_DATA.filter(release => {
      const topicMatch = selectedTopics.length === 0 || selectedTopics.includes(release.category);
      const ministryMatch = selectedMinistries.length === 0 || selectedMinistries.includes(release.ministryId);
      const languageMatch = selectedLanguage === 'all' || release.language === selectedLanguage;
      return (topicMatch || ministryMatch) && languageMatch;
    });
  }, [selectedTopics, selectedMinistries, selectedLanguage]);

  const generateDigestText = (recipient: string, matching: PressRelease[]) => {
    const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5174';
    const dateStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
    const lines = [
      `PRESS INFORMATION BUREAU — GOVERNMENT OF INDIA`,
      `Official Daily Information Digest`,
      `Date: ${dateStr}`,
      `Delivery Schedule: ${frequency.toUpperCase()} at ${deliveryTimeIST} (IST)`,
      `Language Filter: ${selectedLanguage === 'all' ? 'All (English & Hindi)' : selectedLanguage.toUpperCase()}`,
      `--------------------------------------------------`,
      ``,
      `TODAY'S HIGHLIGHTED RELEASES FOR YOUR SUBSCRIPTION:`,
      ``,
      ...matching.slice(0, 5).map((r, i) => (
        `${i + 1}. [${r.ministry}] ${r.title}\n   PRID: ${r.prid} | Category: ${r.category} | Language: ${r.language.toUpperCase()}\n   Summary: ${r.excerpt}\n   Read Full Release on PIB: ${siteUrl}/release/${r.id}\n   Official Gazette Source: ${r.sourceUrl}\n`
      )),
      `--------------------------------------------------`,
      `National Media Centre, 7E Raisina Road, New Delhi 110001`,
      `Press Information Bureau (PIB), Ministry of Information & Broadcasting.`
    ];
    return lines.join('\n');
  };

  const digestSubject = `[PIB Daily Digest] Official Government Releases — ${new Date().toLocaleDateString('en-IN')}`;

  // Automatically register background scheduled dispatch with server on mount if subscription exists
  React.useEffect(() => {
    if (existingSub && existingSub.isActive) {
      scheduleSubscriptionOnServer({
        recipientEmail: existingSub.email,
        deliveryTimeIST: existingSub.deliveryTimeIST || '08:00 AM',
        subject: `[PIB Scheduled Daily Digest] Official Government Releases — ${existingSub.deliveryTimeIST || '08:00 AM'} IST`,
        text: generateDigestText(existingSub.email, matchingReleases)
      }).catch(err => console.warn('Could not register scheduler on mount:', err));
    }
  }, []);

  const handleSaveAndConfirm = () => {
    const finalEmail = emailAddress.trim() || 'subscriber@example.gov.in';
    const newSub: SubscriptionConfig = {
      email: finalEmail,
      selectedTopics,
      selectedMinistries,
      contentTypes: selectedContentTypes,
      frequency,
      deliveryTimeIST,
      language: selectedLanguage,
      isActive: true,
      createdAt: new Date().toISOString()
    };
    saveSubscription(newSub);

    // Register active subscription with server-side background timer
    scheduleSubscriptionOnServer({
      recipientEmail: finalEmail,
      deliveryTimeIST,
      subject: `[PIB Scheduled Daily Digest] Official Government Releases — ${deliveryTimeIST} IST`,
      text: generateDigestText(finalEmail, matchingReleases)
    }).catch(err => console.warn('Could not register scheduler:', err));

    setCurrentStep(5);
  };

  const handleResetPreferences = () => {
    if (window.confirm('Reset saved subscription preferences on this browser?')) {
      clearSubscription();
      setSelectedTopics(['Economy & Finance', 'Science & Technology']);
      setSelectedMinistries(['finance']);
      setEmailAddress('');
      setSelectedLanguage('all');
      setCurrentStep(1);
    }
  };

  const handleDownloadEml = () => {
    const body = generateDigestText(targetRecipientEmail, matchingReleases);
    const emlContent = [
      `From: "Press Information Bureau" <pib-noreply@nic.in>`,
      `To: <${targetRecipientEmail}>`,
      `Subject: ${digestSubject}`,
      `Date: ${new Date().toUTCString()}`,
      `MIME-Version: 1.0`,
      `Content-Type: text/plain; charset=UTF-8`,
      ``,
      body
    ].join('\r\n');

    const blob = new Blob([emlContent], { type: 'message/rfc822' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PIB_Official_Digest_${new Date().toISOString().slice(0, 10)}.eml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSendSmtpEmail = async () => {
    const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5174';
    setIsSendingSmtp(true);
    setSmtpResult(null);
    try {
      const result = await sendPibDigestEmail({
        recipientEmail: targetRecipientEmail,
        subject: digestSubject,
        text: generateDigestText(targetRecipientEmail, matchingReleases),
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 640px; margin: 0 auto; padding: 24px; border: 1px solid #cbd5e1; border-radius: 8px; background-color: #ffffff;">
            <div style="text-align: center; border-bottom: 2px solid #0b3558; padding-bottom: 14px; margin-bottom: 20px;">
              <p style="color: #d97706; font-size: 11px; font-weight: bold; margin: 0; text-transform: uppercase; letter-spacing: 1px;">GOVERNMENT OF INDIA • भारत सरकार</p>
              <h1 style="color: #0b3558; font-size: 24px; margin: 6px 0; font-family: Georgia, serif;">PRESS INFORMATION BUREAU</h1>
              <p style="color: #64748b; font-size: 12px; margin: 0;">Official Daily Information Bulletin • Press Information Bureau</p>
            </div>
            <div style="margin-bottom: 24px;">
              <h3 style="color: #0f172a; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 14px; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px;">
                Today's Highlighted Releases for Your Subscription (${matchingReleases.length} matching):
              </h3>
              ${matchingReleases.slice(0, 5).map(r => `
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 14px;">
                  <div style="color: #0b3558; font-size: 11px; font-weight: bold; text-transform: uppercase;">
                    ${r.ministry} • PRID: ${r.prid} • ${r.category}
                  </div>
                  <h4 style="margin: 6px 0 8px 0; font-size: 15px; color: #0f172a; line-height: 1.4;">
                    <a href="${siteUrl}/release/${r.id}" style="color: #0f172a; text-decoration: none;">${r.title}</a>
                  </h4>
                  <p style="margin: 0 0 12px 0; font-size: 12px; color: #475569; line-height: 1.5;">${r.excerpt}</p>
                  <div style="border-top: 1px dashed #cbd5e1; padding-top: 10px; display: flex; align-items: center; gap: 10px;">
                    <a href="${siteUrl}/release/${r.id}" style="display: inline-block; background-color: #0b3558; color: #ffffff; padding: 7px 14px; border-radius: 4px; text-decoration: none; font-size: 11px; font-weight: bold;">
                      → Read Full Official Release on PIB
                    </a>
                    <a href="${r.sourceUrl}" style="display: inline-block; color: #475569; font-size: 11px; text-decoration: underline; margin-left: 10px;">
                      Official Gazette Source ↗
                    </a>
                  </div>
                </div>
              `).join('')}
            </div>
            <div style="text-align: center; border-top: 1px solid #e2e8f0; padding-top: 14px; font-size: 11px; color: #94a3b8; line-height: 1.5;">
              <p style="margin: 0;">National Media Centre, 7E Raisina Road, New Delhi 110001 • Official PIB Communications</p>
              <p style="margin: 4px 0 0 0;">Ministry of Information & Broadcasting, Government of India</p>
            </div>
          </div>
        `
      });
      setSmtpResult(result);
      if (result.success) {
        setTestSentToast(true);
        setTimeout(() => setTestSentToast(false), 4000);
      }
    } catch (err: any) {
      setSmtpResult({ success: false, error: err.message });
    } finally {
      setIsSendingSmtp(false);
    }
  };

  const handleTriggerTestDigest = () => {
    handleSendSmtpEmail();
  };


  return (
    <div className="pib-container py-8 max-w-5xl space-y-8" id="main-content">
      {/* Toast Alert */}
      {testSentToast && (
        <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50 p-4 bg-emerald-900 text-white rounded-xl shadow-xl flex items-center gap-3 text-xs border border-emerald-700 animate-in fade-in duration-200">
          <Check className="w-4 h-4 text-emerald-400" />
          <div>
            <div className="font-bold">Test Bulletin Dispatched!</div>
            <div className="text-[11px] text-emerald-200">
              Generated custom dispatch with {matchingReleases.length} matching releases for {emailAddress || 'subscriber@domain.gov.in'}.
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-lg bg-[#0b3558] text-white">
              <Bell className="w-5 h-5 text-amber-400" />
            </span>
            <h1 className="text-xl md:text-2xl font-bold font-serif text-slate-900 dark:text-white">
              My PIB Feed — Subscription & Personalised Feed
            </h1>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xl">
            Configure ministry and topic subscriptions, customize your daily official digest schedule, and read your real-time personalized release stream.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {existingSub && currentStep === 5 && (
            <button
              onClick={() => setCurrentStep(1)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 font-medium cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Configure Topics</span>
            </button>
          )}

          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Active Local Subscription</span>
          </span>
        </div>
      </div>

      {/* Wizard Step Progress Tracker (Only shown during setup / editing) */}
      {currentStep !== 5 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-semibold overflow-x-auto gap-2">
            {[
              { step: 1, title: '1. Topics & Ministries' },
              { step: 2, title: '2. Email Address' },
              { step: 3, title: '3. Schedule & IST Time' },
              { step: 4, title: '4. Review & Activate' }
            ].map(s => (
              <button
                key={s.step}
                onClick={() => s.step < currentStep && setCurrentStep(s.step)}
                className={`flex items-center gap-1.5 py-1 px-2.5 rounded whitespace-nowrap transition-colors ${
                  currentStep === s.step
                    ? 'text-[#0b3558] dark:text-sky-400 font-bold border-b-2 border-[#0b3558] dark:border-sky-400'
                    : currentStep > s.step
                    ? 'text-emerald-700 dark:text-emerald-400 cursor-pointer'
                    : 'text-slate-400 cursor-not-allowed'
                }`}
              >
                {currentStep > s.step ? (
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <span className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[10px]">
                    {s.step}
                  </span>
                )}
                <span>{s.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 1: SELECT TOPICS & MINISTRIES */}
      {currentStep === 1 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-6">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Step 1: Choose Your Preferred Topics & Ministries
            </h2>
            <p className="text-xs text-slate-500">
              Select the policy categories and ministries you want in your personalized PIB stream.
            </p>
          </div>

          {/* Categories Grid */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Policy Categories ({selectedTopics.length} selected)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
              {availableCategories.map(cat => {
                const selected = selectedTopics.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleTopic(cat)}
                    className={`p-3 rounded-lg border text-left text-xs transition-all cursor-pointer flex flex-col justify-between h-20 ${
                      selected
                        ? 'bg-sky-50 dark:bg-sky-950/60 border-[#0b3558] dark:border-sky-500 text-[#0b3558] dark:text-sky-300 font-bold shadow-2xs'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <span>{cat}</span>
                    <span className="text-[10px] self-end font-mono">
                      {selected ? '✓ Selected' : '+ Add'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Key Ministries Selection */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Specific Ministries ({selectedMinistries.length} selected)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {MINISTRIES_DATA.map(m => {
                const selected = selectedMinistries.includes(m.id);
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => toggleMinistry(m.id)}
                    className={`p-2.5 rounded-lg border text-left text-xs transition-all cursor-pointer ${
                      selected
                        ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-500 text-amber-900 dark:text-amber-200 font-bold'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <div className="truncate font-semibold">{m.nameEn}</div>
                    <div className="text-[10px] text-slate-500 flex justify-between mt-1">
                      <span>{m.releaseCount} releases</span>
                      <span>{selected ? '✓' : '+'}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preferred Release Language Selection for Email Digest */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span>Email Digest Release Language (विज्ञप्ति भाषा चयन)</span>
              </label>
              <span className="text-[11px] text-slate-500">
                Filter digest releases by language
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                { id: 'all', title: 'All Languages (सभी भाषाएं)', desc: 'Bilingual digest containing English and हिन्दी publications' },
                { id: 'en', title: 'English Only', desc: 'Deliver only official English press releases & statements' },
                { id: 'hi', title: 'हिन्दी विज्ञप्तियां केवल (Hindi Only)', desc: 'Deliver only official Hindi press releases & bulletins' }
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedLanguage(item.id as any)}
                  className={`p-3 rounded-lg border text-left text-xs transition-all cursor-pointer flex flex-col justify-between ${
                    selectedLanguage === item.id
                      ? 'bg-sky-50 dark:bg-sky-950/60 border-[#0b3558] dark:border-sky-500 text-[#0b3558] dark:text-sky-300 font-bold shadow-2xs ring-2 ring-[#0b3558]/20'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="font-semibold">{item.title}</span>
                    <span className="text-[10px] font-mono">
                      {selectedLanguage === item.id ? '✓ Selected' : 'Choose'}
                    </span>
                  </div>
                  <div className="text-[11px] font-normal text-slate-500 leading-snug">
                    {item.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-6 py-2.5 bg-[#0b3558] hover:bg-[#164e7c] text-white text-sm font-semibold rounded-lg flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <span>Continue to Email Address</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: EMAIL ADDRESS */}
      {currentStep === 2 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-6">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Step 2: Enter Your Dispatch Email Address
            </h2>
            <p className="text-xs text-slate-500">
              Provide the email where you want to receive official daily digests and breaking announcements.
            </p>
          </div>

          <div className="max-w-md space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="email"
                  value={emailAddress}
                  onChange={(e) => { setEmailAddress(e.target.value); setEmailError(''); }}
                  placeholder="name@domain.gov.in or citizen@example.com"
                  className="w-full pl-9 pr-4 py-2.5 text-xs md:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#0b3558]"
                />
              </div>
              {emailError && (
                <p className="text-xs text-rose-600 mt-1.5 font-medium">{emailError}</p>
              )}
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              onClick={handleNextFromStep2}
              className="px-6 py-2.5 bg-[#0b3558] hover:bg-[#164e7c] text-white text-sm font-semibold rounded-lg flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <span>Continue to Schedule</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: SCHEDULE */}
      {currentStep === 3 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-6">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Step 3: Dispatch Frequency & IST Delivery Schedule
            </h2>
            <p className="text-xs text-slate-500">
              Select how often you wish to receive your personalized digest.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'daily', title: 'Daily Digest (Recommended)', desc: 'Comprehensive morning or evening bulletin of all releases' },
              { id: 'instant', title: 'Instant Alerts', desc: 'Dispatched immediately upon official PIB publication' },
              { id: 'weekly', title: 'Weekly Policy Dossier', desc: 'Consolidated weekend policy summary and gazette extracts' }
            ].map(f => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFrequency(f.id as any)}
                className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                  frequency === f.id
                    ? 'bg-sky-50 dark:bg-sky-950/60 border-[#0b3558] dark:border-sky-500 ring-2 ring-[#0b3558]/20'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="font-bold text-xs text-slate-900 dark:text-white mb-1">{f.title}</div>
                <div className="text-[11px] text-slate-500 leading-relaxed">{f.desc}</div>
              </button>
            ))}
          </div>

          {frequency === 'daily' && (
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>Preferred Dispatch Time (Indian Standard Time):</span>
              </label>
              <div className="flex flex-wrap gap-2 items-center">
                {timeOptionsIST.map(timeStr => (
                  <button
                    key={timeStr}
                    type="button"
                    onClick={() => {
                      setIsCustomTime(false);
                      setDeliveryTimeIST(timeStr);
                    }}
                    className={`px-4 py-2 rounded-lg border text-xs font-bold cursor-pointer transition-colors ${
                      !isCustomTime && deliveryTimeIST === timeStr
                        ? 'bg-[#0b3558] text-white border-[#0b3558]'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {timeStr} IST
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setIsCustomTime(true)}
                  className={`px-4 py-2 rounded-lg border text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5 ${
                    isCustomTime
                      ? 'bg-[#0b3558] text-white border-[#0b3558]'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Custom Time...</span>
                </button>
              </div>

              {isCustomTime && (
                <div className="mt-3 p-3.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 max-w-sm flex items-center gap-4 animate-in fade-in duration-150">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-800 dark:text-slate-200 block">
                      Select Custom Dispatch Time:
                    </label>
                    <input
                      type="time"
                      value={customTimeVal}
                      onChange={(e) => {
                        setCustomTimeVal(e.target.value);
                        if (e.target.value) {
                          setDeliveryTimeIST(format24to12(e.target.value));
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-mono font-bold focus:ring-2 focus:ring-[#0b3558]"
                    />
                  </div>
                  <div className="text-xs border-l border-sky-200 dark:border-sky-800 pl-3">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Set To:</span>
                    <span className="font-bold text-[#0b3558] dark:text-sky-300 font-mono text-sm">
                      {deliveryTimeIST} IST
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-4 py-2 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setCurrentStep(4)}
              className="px-6 py-2.5 bg-[#0b3558] hover:bg-[#164e7c] text-white text-sm font-semibold rounded-lg flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <span>Review Preferences</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: REVIEW & ACTIVATE */}
      {currentStep === 4 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-6">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Step 4: Review Your Subscription Configuration
            </h2>
            <p className="text-xs text-slate-500">
              Verify your criteria before activating your personalized stream.
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/80 rounded-xl p-5 border border-slate-200 dark:border-slate-700 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-slate-500 block mb-1">Subscriber Email:</span>
                <span className="font-bold text-sm text-slate-900 dark:text-white font-mono">{emailAddress}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">Dispatch Frequency & IST Timing:</span>
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  {frequency.toUpperCase()} • {frequency === 'instant' ? 'Immediate on release' : `${deliveryTimeIST} (Asia/Kolkata)`}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
              <span className="text-slate-500 block mb-1">Subscribed Categories ({selectedTopics.length}):</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedTopics.map(t => (
                  <span key={t} className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-semibold text-slate-800 dark:text-slate-200">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
              <span className="text-slate-500 block mb-1">Specific Ministries ({selectedMinistries.length}):</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedMinistries.map(mId => {
                  const min = MINISTRIES_DATA.find(m => m.id === mId);
                  return (
                    <span key={mId} className="px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border border-amber-300 font-semibold">
                      {min?.nameEn || mId}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
              <span className="text-slate-500 block mb-1">Preferred Release Language:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span>
                  {selectedLanguage === 'all' ? 'All Languages (English & हिन्दी)' : selectedLanguage === 'en' ? 'English Releases Only' : 'हिन्दी विज्ञप्तियां केवल (Hindi Only)'}
                </span>
              </span>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setCurrentStep(3)}
              className="px-4 py-2 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              onClick={handleSaveAndConfirm}
              className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-lg flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Save & Activate My PIB Feed</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: ACTIVE SUBSCRIPTION DASHBOARD & LIVE PERSONALIZED FEED */}
      {currentStep === 5 && (
        <div className="space-y-8">
          {/* Active Subscription Summary Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Active Subscription: {emailAddress || existingSub?.email}</span>
                  </h2>
                  <p className="text-xs text-slate-500">
                    Schedule: <strong>{frequency.toUpperCase()}</strong> at <strong>{deliveryTimeIST} IST</strong> • {matchingReleases.length} matching releases
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={handleTriggerTestDigest}
                  disabled={isSendingSmtp}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0b3558] hover:bg-[#164e7c] text-white border border-[#0b3558] text-xs font-semibold disabled:opacity-60 cursor-pointer transition-colors shadow-xs"
                  title="Directly dispatch an immediate on-demand copy of your official digest via Gmail SMTP"
                >
                  {isSendingSmtp ? (
                    <>
                      <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      <span>Sending via SMTP...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5 text-amber-400" />
                      <span>Send Instant Test Copy (On-Demand)</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => generateDigestPdf(targetRecipientEmail, matchingReleases)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700 text-xs font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-900/50 cursor-pointer transition-colors"
                  title="Download official PDF bulletin"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Download PDF</span>
                </button>

                <button
                  type="button"
                  onClick={() => setEmailModalOpen(!emailModalOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>{emailModalOpen ? 'Hide Preview' : 'Preview Email'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetPreferences}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Unsubscribe</span>
                </button>
              </div>
            </div>

            {/* Background Automated Daily Schedule Card */}
            <div className="bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 rounded-lg p-3 text-xs text-sky-900 dark:text-sky-200 flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-bold flex items-center gap-2">
                  <span>Automated Daily Dispatch Schedule:</span>
                  <span className="px-2 py-0.5 rounded-full bg-sky-200 dark:bg-sky-900 text-sky-900 dark:text-sky-100 text-[10px] font-mono font-bold">
                    Active at {deliveryTimeIST} (IST)
                  </span>
                </div>
                <p className="text-[11px] text-sky-700 dark:text-sky-300 leading-relaxed">
                  Your daily digest is scheduled to be automatically delivered to <strong>{targetRecipientEmail}</strong> at <strong>{deliveryTimeIST} IST</strong> every day. Use the <strong>"Send Instant Test Copy (On-Demand)"</strong> button above anytime to receive an immediate test copy directly in your inbox without having to wait for {deliveryTimeIST}.
                </p>
              </div>
            </div>

            {/* Direct SMTP Status Banner */}
            {smtpResult && (
              <div className={`p-3.5 rounded-xl text-xs border animate-in fade-in duration-200 ${
                smtpResult.success 
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200'
                  : 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200'
              }`}>
                <div className="font-bold flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {smtpResult.success ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <Info className="w-4 h-4 text-amber-600" />}
                    <span>{smtpResult.success ? 'Official PIB Digest Dispatched Directly via Gmail SMTP!' : 'SMTP Dispatch Notice:'}</span>
                  </div>
                  <button onClick={() => setSmtpResult(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer font-bold px-1">✕</button>
                </div>
                <div className="text-[11px] mt-1.5 leading-relaxed font-mono">
                  {smtpResult.message || smtpResult.note || smtpResult.error}
                </div>
              </div>
            )}

            {/* Subscribed Filters Pills */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-500 font-medium">Subscribed Topics:</span>
              {selectedTopics.map(t => (
                <span key={t} className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-[11px] font-semibold border border-slate-200 dark:border-slate-700">
                  {t}
                </span>
              ))}
              {selectedMinistries.map(mId => {
                const m = MINISTRIES_DATA.find(x => x.id === mId);
                return (
                  <span key={mId} className="px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 text-[11px] font-semibold border border-amber-300">
                    {m?.nameEn || mId}
                  </span>
                );
              })}
              <span className="px-2.5 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950/60 text-[#0b3558] dark:text-sky-300 text-[11px] font-semibold border border-sky-300 flex items-center gap-1">
                <Globe className="w-3 h-3" />
                <span>
                  Language: {selectedLanguage === 'all' ? 'All (English & Hindi)' : selectedLanguage === 'en' ? 'English Only' : 'हिन्दी Only'}
                </span>
              </span>
            </div>
          </div>

          {/* Interactive Email Dispatch Preview (Toggled or inline) */}
          {emailModalOpen && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-md overflow-hidden animate-in fade-in duration-200">
              <div className="bg-[#0b3558] text-white px-6 py-3 flex items-center justify-between text-xs">
                <span className="font-mono font-bold flex items-center gap-2">
                  <Mail className="w-4 h-4 text-amber-400" />
                  <span>Official Press Information Bureau Daily Digest Dispatch</span>
                </span>
                <span className="text-[10px] bg-sky-900 px-2 py-0.5 rounded">
                  {deliveryTimeIST} (IST)
                </span>
              </div>

              {/* Email Content */}
              <div className="p-8 max-w-2xl mx-auto space-y-6 text-slate-900 dark:text-slate-100 font-sans">
                {/* Email Masthead */}
                <div className="text-center pb-4 border-b-2 border-[#0b3558] space-y-1">
                  <div className="text-xs uppercase font-bold text-amber-600">भारत सरकार • Government of India</div>
                  <div className="text-xl font-bold font-serif text-[#0b3558] dark:text-sky-300">PRESS INFORMATION BUREAU</div>
                  <div className="text-[11px] text-slate-500">
                    Official Daily Information Bulletin • Press Information Bureau • {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </div>
                </div>

                {/* Subscribed releases listing */}
                <div className="space-y-4">
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                    Today's Publications in Your Subscribed Categories:
                  </div>

                  {matchingReleases.slice(0, 3).map((rel) => (
                    <div key={rel.id} className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                      <div className="text-[11px] font-bold text-[#0b3558] dark:text-sky-400 uppercase">
                        {rel.ministry} • PRID: {rel.prid} • {rel.category}
                      </div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {rel.title}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                        {rel.excerpt}
                      </p>
                      <div className="pt-2 flex items-center gap-3">
                        <Link
                          to={`/release/${rel.id}`}
                          className="inline-block text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline"
                        >
                          → Read Full Official Release on PIB
                        </Link>
                        <a
                          href={rel.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-slate-500 hover:underline"
                        >
                          Official Source ↗
                        </a>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400 text-center">
                  <p>National Media Centre, 7E Raisina Road, New Delhi 110001 • Unsubscribe at any time from My PIB Feed</p>
                </div>
              </div>
            </div>
          )}

          {/* MY PERSONALIZED LIVE FEED SECTION */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                  <Rss className="w-4 h-4" />
                </span>
                <h3 className="text-lg font-bold font-serif text-slate-900 dark:text-white">
                  My Personalised Live Feed
                </h3>
                <span className="text-xs bg-[#0b3558] text-white px-2 py-0.5 rounded-full font-bold">
                  {matchingReleases.length} Releases
                </span>
              </div>
              <span className="text-xs text-slate-500">
                Filtered strictly by your subscribed topics & ministries
              </span>
            </div>

            {matchingReleases.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {matchingReleases.map(release => (
                  <ReleaseCard 
                    key={release.id} 
                    release={release} 
                    showExcerpt={true} 
                  />
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                <p className="text-xs text-slate-500">
                  No releases currently match your selected filters. Try adding more categories or ministries.
                </p>
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-1.5 bg-[#0b3558] text-white text-xs font-semibold rounded-lg"
                >
                  Edit Topics
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
