import React, { useState } from 'react';
import { 
  Building2, Users, FileText, CheckCircle2, ShieldCheck, 
  MapPin, Phone, Mail, Globe, ExternalLink, Award, Calendar,
  Download, Clock, Search, Send, AlertCircle, Bookmark, Check,
  Radio, Video, HelpCircle, Layers, ArrowRight
} from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';
import { EmblemOfIndia } from '../components/brand/EmblemOfIndia';
import { PibLogo } from '../components/brand/PibLogo';

interface MediaOfficer {
  name: string;
  designation: string;
  ministry: string;
  room: string;
  email: string;
  phone: string;
}

const MEDIA_OFFICERS: MediaOfficer[] = [
  {
    name: 'Shri Dhirendra Ojha',
    designation: 'Principal Director General (Pr. DG)',
    ministry: 'Press Information Bureau (Headquarters)',
    room: 'NMC 101, 7E Raisina Road',
    email: 'pdg-pib@nic.in',
    phone: '+91-11-23488000'
  },
  {
    name: 'Smt. Pragya Paliwal Gaur',
    designation: 'Director General (Media & Communications)',
    ministry: "Prime Minister's Office (PMO) & Cabinet",
    room: 'NMC 104, 7E Raisina Road',
    email: 'pmo.media@pib.gov.in',
    phone: '+91-11-23488022'
  },
  {
    name: 'Shri Rajeev Jain',
    designation: 'Additional Director General (ADG)',
    ministry: 'Ministry of Finance & Corporate Affairs',
    room: 'North Block 134 / NMC 202',
    email: 'finmedia@nic.in',
    phone: '+91-11-23092523'
  },
  {
    name: 'Shri A. Bharatbhushan Babu',
    designation: 'Additional Director General (ADG)',
    ministry: 'Ministry of Defence & Armed Forces',
    room: 'South Block 94 / NMC 205',
    email: 'defpress-pib@nic.in',
    phone: '+91-11-23019004'
  },
  {
    name: 'Smt. Kanchan Prasad',
    designation: 'Additional Director General (ADG)',
    ministry: 'Ministry of Home Affairs (MHA)',
    room: 'North Block 112 / NMC 208',
    email: 'mha.press@nic.in',
    phone: '+91-11-23093220'
  },
  {
    name: 'Shri Dilip Kumar',
    designation: 'Director (Media)',
    ministry: 'Ministry of Railways',
    room: 'Rail Bhawan 401 / NMC 301',
    email: 'railmedia@pib.gov.in',
    phone: '+91-11-23381332'
  },
  {
    name: 'Dr. Manisha Verma',
    designation: 'Director General (Media)',
    ministry: 'Ministry of Health & Family Welfare',
    room: 'Nirman Bhawan 348 / NMC 305',
    email: 'healthpress@nic.in',
    phone: '+91-11-23062388'
  },
  {
    name: 'Shri Y.K. Baweja',
    designation: 'Additional Director General (ADG)',
    ministry: 'Ministry of Electronics & IT (MeitY) & S&T',
    room: 'Electronics Niketan / NMC 308',
    email: 'meity-pib@nic.in',
    phone: '+91-11-24301824'
  }
];

export const MediaFacilitationPage: React.FC = () => {
  const { lang, t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'accreditation' | 'nmc' | 'briefings' | 'passes' | 'tours' | 'welfare' | 'officers'>('accreditation');
  
  // Simulated Accreditation Search State
  const [appNumber, setAppNumber] = useState('');
  const [searchResult, setSearchResult] = useState<string | null>(null);

  // Booking Form State
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [bookingData, setBookingData] = useState({
    ministry: '',
    purpose: '',
    date: '',
    time: '',
    hall: 'Main Auditorium (350 pax)',
    contact: ''
  });

  const handleSearchStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appNumber.trim()) return;
    if (appNumber.toUpperCase().includes('PIB') || appNumber.length >= 6) {
      setSearchResult(`Application #${appNumber.toUpperCase()}: In Review with CPAC (Central Press Accreditation Committee). Biometric verification completed at NMC.`);
    } else {
      setSearchResult(`No records found for "${appNumber}". Format should be e.g. PIB/ACCR/2026/XXXX.`);
    }
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingData.ministry || !bookingData.date) return;
    setBookingSubmitted(true);
  };

  const isHindi = lang === 'hi';

  return (
    <div className="pib-container py-8 max-w-6xl space-y-8" id="main-content">
      {/* 1. Official Header Masthead */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 md:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 dark:border-slate-800 pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 rounded border border-amber-300 dark:border-amber-800">
                {isHindi ? 'सूचना एवं प्रसारण मंत्रालय • भारत सरकार' : 'Ministry of Information & Broadcasting • Government of India'}
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>{t.mediaFacilitation.badge}</span>
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold font-serif text-slate-900 dark:text-white">
              {t.mediaFacilitation.title}
            </h1>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
              {t.mediaFacilitation.subtitle}
            </p>
          </div>
          <div className="hidden sm:block shrink-0">
            <PibLogo />
          </div>
        </div>

        {/* Official Contact Strip */}
        <div className="pt-4 flex flex-wrap items-center justify-between text-xs text-slate-600 dark:text-slate-400 gap-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-[#0b3558] dark:text-sky-400" />
            <span>National Media Centre, 7E Raisina Road, New Delhi 110001</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>NMC Control: 011-23488000</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>mediafacilitation@pib.gov.in</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. Primary Navigation Tabs */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2 shadow-2xs">
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-semibold">
          {[
            { id: 'accreditation', labelEn: 'Press Accreditation & CPAC', labelHi: 'प्रेस मान्यता और सीपीएसी', icon: ShieldCheck },
            { id: 'nmc', labelEn: 'National Media Centre (NMC)', labelHi: 'राष्ट्रीय मीडिया केंद्र (NMC)', icon: Building2 },
            { id: 'briefings', labelEn: 'Cabinet & Press Briefings', labelHi: 'कैबिनेट एवं प्रेस ब्रीफिंग', icon: Radio },
            { id: 'passes', labelEn: 'Special Event Passes', labelHi: 'विशेष राष्ट्रीय कार्यक्रम पास', icon: Award },
            { id: 'tours', labelEn: 'Developmental Media Tours', labelHi: 'विकासपरक मीडिया दौरे', icon: Globe },
            { id: 'welfare', labelEn: 'Journalist Welfare Scheme (JWS)', labelHi: 'पत्रकार कल्याण योजना (JWS)', icon: Users },
            { id: 'officers', labelEn: 'Media Officers Directory', labelHi: 'मीडिया अधिकारी निर्देशिका', icon: FileText }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#0b3558] text-white shadow-xs font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{isHindi ? tab.labelHi : tab.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. TAB CONTENT PANELS */}

      {/* TAB A: PRESS ACCREDITATION & CPAC */}
      {activeTab === 'accreditation' && (
        <div className="space-y-6">
          {/* Overview Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 md:p-8 space-y-5 shadow-xs">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-lg md:text-xl font-bold font-serif text-slate-900 dark:text-white">
                  {isHindi ? 'केंद्रीय प्रेस मान्यता समिति (CPAC) एवं ई-मान्यता प्रणाली' : 'Central Press Accreditation Committee (CPAC) & Accreditation Guidelines'}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  {isHindi 
                    ? 'भारत सरकार के मंत्रालयों और आधिकारिक आयोजनों तक अधिकृत पत्रकारों की निर्बाध पहुंच हेतु आधिकारिक कार्ड।' 
                    : 'Official Press Accreditation guidelines governing correspondents, camerapersons, editors, wire agencies, and digital news portals.'}
                </p>
              </div>
              <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                CPAC 2022/2026 Rules
              </span>
            </div>

            <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {isHindi
                ? 'प्रेस सूचना ब्यूरो (पीआईबी), केंद्रीय प्रेस मान्यता समिति (CPAC) के माध्यम से पेशेवर पत्रकारों को आधिकारिक प्रेस मान्यता कार्ड प्रदान करता है। यह कार्ड धारक को केंद्र सरकार के मंत्रालयों, संसद की प्रेस दीर्घा (अलग प्रक्रियाधीन), राष्ट्रीय मीडिया केंद्र और आधिकारिक ब्रीफिंग में भाग लेने का अधिकार देता है।'
                : 'The Press Information Bureau administers press accreditation under the Central Press Accreditation Guidelines. Accredited media professionals receive the official PIB Press Identity Card, conferring access to Union Government ministries, official briefings at the National Media Centre, and authorized government proceedings.'}
            </p>

            {/* 4-Step Accreditation Lifecycle */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                {isHindi ? 'मान्यता प्रक्रिया के 4 चरण:' : '4-Step e-Accreditation Workflow:'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                  <span className="w-6 h-6 rounded-full bg-[#0b3558] text-white flex items-center justify-center font-bold text-[11px]">1</span>
                  <div className="font-bold text-slate-900 dark:text-white">{isHindi ? 'ऑनलाइन आवेदन' : 'Online Registration'}</div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    {isHindi ? 'पीआईबी ई-मान्यता पोर्टल पर संपादक का सिफारिश पत्र, वेतन प्रमाण एवं कतरनें अपलोड करें।' : 'Submit editor recommendation letter, proof of circulation, and published clippings.'}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                  <span className="w-6 h-6 rounded-full bg-[#0b3558] text-white flex items-center justify-center font-bold text-[11px]">2</span>
                  <div className="font-bold text-slate-900 dark:text-white">{isHindi ? 'सुरक्षा सत्यापन' : 'Security Clearance'}</div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    {isHindi ? 'गृह मंत्रालय तथा सक्षम सुरक्षा एजेंसियों द्वारा अनिवार्य चरित्र एवं पृष्ठभूमि सत्यापन।' : 'Statutory character & background verification through competent nodal security agencies.'}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                  <span className="w-6 h-6 rounded-full bg-[#0b3558] text-white flex items-center justify-center font-bold text-[11px]">3</span>
                  <div className="font-bold text-slate-900 dark:text-white">{isHindi ? 'सीपीएसी समीक्षा' : 'CPAC Committee'}</div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    {isHindi ? 'प्रधान महानिदेशक की अध्यक्षता में सीपीएसी समिति द्वारा आवेदन की पात्रता समीक्षा।' : 'Scrutiny of circulation quotas, professional experience (min. 5 years) and eligibility.'}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                  <span className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-[11px]">4</span>
                  <div className="font-bold text-slate-900 dark:text-white">{isHindi ? 'पीआईबी स्मार्ट कार्ड' : 'Card Issuance'}</div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    {isHindi ? 'राष्ट्रीय मीडिया केंद्र में बायोमेट्रिक सत्यापन पश्चात आरएफआईडी युक्त पीआईबी कार्ड जारी।' : 'Biometric capture & RFID-enabled official PIB press card issued at NMC counter.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Application Status Tracker & Document Checklist */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Status Tracker */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5">
                <Search className="w-4 h-4 text-[#0b3558] dark:text-sky-400" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  {isHindi ? 'ऑनलाइन मान्यता आवेदन स्थिति जांचें' : 'Check e-Accreditation Application Status'}
                </h3>
              </div>
              <form onSubmit={handleSearchStatus} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    {isHindi ? 'आवेदन संख्या (Application Number):' : 'Application Ref Number:'}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={appNumber}
                      onChange={(e) => setAppNumber(e.target.value)}
                      placeholder="e.g. PIB/ACCR/2026/0481"
                      className="flex-1 text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#0b3558]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#0b3558] hover:bg-[#164e7c] text-white text-xs font-semibold rounded-lg cursor-pointer transition-colors"
                    >
                      {isHindi ? 'जांचें' : 'Check Status'}
                    </button>
                  </div>
                </div>
              </form>

              {searchResult && (
                <div className="p-3.5 rounded-lg bg-sky-50 dark:bg-sky-950/60 border border-sky-300 dark:border-sky-800 text-xs text-sky-950 dark:text-sky-200">
                  <div className="font-bold flex items-center gap-1.5 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-sky-600" />
                    <span>{isHindi ? 'सत्यापन परिणाम' : 'System Verification Status'}</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">{searchResult}</p>
                </div>
              )}

              <p className="text-[11px] text-slate-500">
                {isHindi 
                  ? 'सहायता केंद्र: कमरा सं. 108, राष्ट्रीय मीडिया केंद्र • दूरभाष: 011-23488055 • ईमेल: accreditation@pib.gov.in'
                  : 'Facilitation Desk: Room 108, National Media Centre • Tel: 011-23488055 • Email: accreditation@pib.gov.in'}
              </p>
            </div>

            {/* Document Checklist */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-600" />
                <span>{isHindi ? 'अनिवार्य संलग्नक एवं पात्रता मानदंड' : 'Mandatory Eligibility & Documentation'}</span>
              </h3>
              <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-2 list-none">
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Experience:</strong> Minimum 5 consecutive years of full-time journalistic experience for correspondents.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Circulation Quota:</strong> RNI-certified daily circulation (Minimum 10,000 copies for Delhi edition).</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Digital Media:</strong> Minimum 6 months continuous operation, at least 1 million unique monthly visitors.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Endorsement:</strong> Letter of authorization from the Editor-in-Chief / Head of Media Organization.</span>
                </li>
              </ul>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[11px]">
                <span className="text-slate-500">Central Press Accreditation Guidelines</span>
                <span className="font-bold text-[#0b3558] dark:text-sky-400">PDF Available at NMC Desk</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB B: NATIONAL MEDIA CENTRE (NMC) */}
      {activeTab === 'nmc' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 md:p-8 space-y-6 shadow-xs">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="text-[11px] font-bold uppercase text-[#0b3558] dark:text-sky-400">
                World-Class Media Infrastructure
              </span>
              <h2 className="text-xl font-bold font-serif text-slate-900 dark:text-white mt-1">
                National Media Centre (NMC), 7E Raisina Road, New Delhi
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                The apex governmental communications facility built to facilitate seamless coverage of Union Government policies.
              </p>
            </div>

            {/* Facilities Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-[#0b3558] text-white flex items-center justify-center font-bold">
                  <Video className="w-4 h-4 text-amber-400" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Main Briefing Auditorium</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  350-seat state-of-the-art auditorium equipped with 4K interactive video walls, 6-language simultaneous interpretation booths, and multi-camera broadcast capture.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-[#0b3558] text-white flex items-center justify-center font-bold">
                  <Globe className="w-4 h-4 text-sky-400" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Press Workstation Lounge</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  60 dedicated PC workstations with high-speed NIC optical fiber internet, high-throughput Wi-Fi 6, teleprinters, live news monitoring screens, and printing stations.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-[#0b3558] text-white flex items-center justify-center font-bold">
                  <Radio className="w-4 h-4 text-emerald-400" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Broadcast Uplink & MCR</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Dedicated master control room directly hooked to Doordarshan Central Hub, allowing multi-point live feed distribution to national news channels and international agencies.
                </p>
              </div>
            </div>

            {/* Requisition / Booking Protocol for Ministries */}
            <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {isHindi ? 'मंत्रालयों हेतु प्रेस कॉन्फ्रेंस हॉल आरक्षण फॉर्म' : 'Briefing Hall Requisition Form (Union Ministries & Departments)'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Official booking request for Cabinet briefings, policy launches, or ministerial press interactions.
                  </p>
                </div>
                <span className="text-[10px] bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 px-2 py-0.5 rounded font-bold">
                  NMC Protocol
                </span>
              </div>

              {bookingSubmitted ? (
                <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-xs text-emerald-900 dark:text-emerald-200 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Requisition Lodged Successfully!</span>
                  </div>
                  <p className="text-[11px]">
                    Reference ID: NMC/REQ/2026/089. Official confirmation and security allotment will be conveyed to the ministry liaison officer within 2 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Nodal Ministry / Department:
                    </label>
                    <input
                      type="text"
                      required
                      value={bookingData.ministry}
                      onChange={(e) => setBookingData({ ...bookingData, ministry: e.target.value })}
                      placeholder="e.g. Ministry of Finance"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Date of Press Conference:
                    </label>
                    <input
                      type="date"
                      required
                      value={bookingData.date}
                      onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Select Venue:
                    </label>
                    <select
                      value={bookingData.hall}
                      onChange={(e) => setBookingData({ ...bookingData, hall: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    >
                      <option>Main Auditorium (350 seats)</option>
                      <option>Conference Hall B (100 seats)</option>
                      <option>Media Briefing Studio (40 seats)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Brief Description / Subject of Briefing:
                    </label>
                    <input
                      type="text"
                      value={bookingData.purpose}
                      onChange={(e) => setBookingData({ ...bookingData, purpose: e.target.value })}
                      placeholder="e.g. Post-Cabinet decisions announcement"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full py-2 bg-[#0b3558] hover:bg-[#164e7c] text-white text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-xs"
                    >
                      Submit Requisition
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB C: CABINET & PRESS BRIEFINGS */}
      {activeTab === 'briefings' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 md:p-8 space-y-6 shadow-xs">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="text-xl font-bold font-serif text-slate-900 dark:text-white">
                {isHindi ? 'केंद्रीय मंत्रिमंडल निर्णय ब्रीफिंग एवं मीडिया सम्मेलन' : 'Cabinet Decision Briefings & Official Press Conferences'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Live official dissemination of Cabinet resolutions, policy pronouncements, and emergency briefings.
              </p>
            </div>

            {/* Upcoming / Recent Briefings Schedule */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                Recent & Scheduled Briefings Schedule:
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border border-slate-200 dark:border-slate-800">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="p-3">Date & Time (IST)</th>
                      <th className="p-3">Briefing Title / Subject</th>
                      <th className="p-3">Addressed By</th>
                      <th className="p-3">Venue / Feed</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="p-3 font-mono font-medium">Every Wednesday, 3:30 PM</td>
                      <td className="p-3 font-semibold text-slate-900 dark:text-white">Cabinet Decisions Briefing</td>
                      <td className="p-3">Union Minister of Information & Broadcasting</td>
                      <td className="p-3">Auditorium, NMC New Delhi</td>
                      <td className="p-3"><span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">Standing Protocol</span></td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="p-3 font-mono font-medium">Daily 11:30 AM</td>
                      <td className="p-3 font-semibold text-slate-900 dark:text-white">PIB Daily Media Briefing (On Request)</td>
                      <td className="p-3">Departmental Information Officers (DIOs)</td>
                      <td className="p-3">Conference Hall B</td>
                      <td className="p-3"><span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300">Live Webcast</span></td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="p-3 font-mono font-medium">Post-Parliament Sittings</td>
                      <td className="p-3 font-semibold text-slate-900 dark:text-white">Parliamentary Legislative Briefing</td>
                      <td className="p-3">Union Ministers for Parliamentary Affairs & Law</td>
                      <td className="p-3">Auditorium, NMC New Delhi</td>
                      <td className="p-3"><span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">During Session</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Protocol for Press Representatives */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-[#0b3558] dark:text-sky-400" />
                <span>Guidelines for Accredited Correspondents Attending Briefings:</span>
              </div>
              <ul className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1 list-disc list-inside">
                <li>Entry is strictly regulated via biometric verification with official PIB Accreditation Card.</li>
                <li>Camera positions in the auditorium are earmarked based on pool rotation guidelines.</li>
                <li>Live feeds are made available to all news channels simultaneously via DD Uplink / SDI patch panels at NMC MCR.</li>
                <li>Audio interpretation in Hindi/English is available at every auditorium seat console.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB D: SPECIAL EVENT PASSES */}
      {activeTab === 'passes' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 md:p-8 space-y-6 shadow-xs">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="text-xl font-bold font-serif text-slate-900 dark:text-white">
                {isHindi ? 'राष्ट्रीय आयोजनों हेतु विशेष प्रेस मान्यता पास' : 'Special National Event Media Passes & Accreditation'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Coordination, security clearances, and enclosure pass issuance for major state occasions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>Republic Day Parade (26 January)</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  Kartavya Path Press Enclosure Passes issued to accredited correspondents and photojournalists following IB and Delhi Police security clearance. Applications open in December.
                </p>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-[10px] text-slate-500">
                  Counters: Ground Floor, NMC
                </div>
              </div>

              <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-600" />
                  <span>Independence Day (15 August)</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  Red Fort Press Enclosure badges for the Prime Minister's address to the nation. Camera positions allocated by PIB pool protocol. Applications open mid-July.
                </p>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-[10px] text-slate-500">
                  Counters: Room 104, NMC
                </div>
              </div>

              <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-sky-600" />
                  <span>Union Budget Day (1 February)</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  Press Gallery passes and post-Budget National Media Centre lock-in and press briefing access for financial journalists, economic editors, and wire services.
                </p>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-[10px] text-slate-500">
                  Counters: Media Facilitation Desk
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB E: DEVELOPMENTAL MEDIA TOURS */}
      {activeTab === 'tours' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 md:p-8 space-y-6 shadow-xs">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="text-xl font-bold font-serif text-slate-900 dark:text-white">
                {isHindi ? 'अखिल भारतीय विकासपरक मीडिया दौरे (Media Tours)' : 'All-India Developmental Media Tours'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Fostering firsthand ground reporting on flagship infrastructure, scientific missions, and social welfare programmes.
              </p>
            </div>

            <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              PIB organizes all-India press tours for accredited national and regional journalists to observe firsthand the implementation of major central government developmental projects, scientific breakthroughs (e.g. ISRO launch sites, DRDO facilities), and border infrastructure developments in aspirational districts.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Objectives of PIB Press Tours:</span>
                </span>
                <ul className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1 list-disc list-inside">
                  <li>Facilitate direct interaction between media and project engineers/beneficiaries.</li>
                  <li>Ensure balanced coverage across national print, regional dailies, and electronic networks.</li>
                  <li>Logistical coordination, local transportation, and briefings managed entirely by PIB Regional Offices.</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#0b3558] dark:text-sky-400" />
                  <span>Recent & Upcoming Destinations:</span>
                </span>
                <ul className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1 list-disc list-inside">
                  <li>Chenab Railway Bridge & Udhampur-Srinagar-Baramulla Rail Link (USBRL).</li>
                  <li>Zojila & Atal Tunnel National Highway connectivity.</li>
                  <li>Semiconductor Fab facilities at Dholera & Sanand, Gujarat.</li>
                  <li>Aspirational Districts Programme progress in North East States.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB F: JOURNALIST WELFARE SCHEME (JWS) */}
      {activeTab === 'welfare' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 md:p-8 space-y-6 shadow-xs">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="text-[11px] font-bold uppercase text-amber-700 dark:text-amber-400">
                Ministry of Information & Broadcasting
              </span>
              <h2 className="text-xl font-bold font-serif text-slate-900 dark:text-white mt-1">
                {isHindi ? 'पत्रकार कल्याण योजना (Journalist Welfare Scheme - JWS)' : 'Journalist Welfare Scheme (JWS)'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Ex-gratia financial relief to journalists and their families in cases of extreme hardship, permanent disability, or demise.
              </p>
            </div>

            {/* Scheme Entitlements Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border border-slate-200 dark:border-slate-800">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="p-3">Category of Contingency</th>
                    <th className="p-3">Maximum Financial Assistance</th>
                    <th className="p-3">Eligibility Requirement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">Demise of Journalist</td>
                    <td className="p-3 font-bold text-emerald-700 dark:text-emerald-400">Up to ₹5,00,000</td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">Disbursed to family / dependent spouse or children</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">Permanent Disability</td>
                    <td className="p-3 font-bold text-emerald-700 dark:text-emerald-400">Up to ₹5,00,000</td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">Suffered in the line of professional journalistic duty</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">Critical / Major Medical Illness</td>
                    <td className="p-3 font-bold text-emerald-700 dark:text-emerald-400">Up to ₹3,00,000</td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">Cancer, kidney transplant, cardiac surgery, etc.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
              <div className="font-bold text-slate-900 dark:text-white">How to Apply for JWS:</div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                Applications should be submitted along with proof of journalistic vocation (minimum 5 years continuous full-time work, both accredited and non-accredited journalists are eligible), medical/death certificates, and income verification to the Secretary, Journalist Welfare Scheme Committee, Press Information Bureau, National Media Centre, New Delhi or via email to <strong>jws-pib@nic.in</strong>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB G: MEDIA OFFICERS DIRECTORY */}
      {activeTab === 'officers' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 md:p-8 space-y-6 shadow-xs">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="text-xl font-bold font-serif text-slate-900 dark:text-white">
                {isHindi ? 'पीआईबी मीडिया अधिकारी एवं विभागीय सूचना अधिकारी (DIO) निर्देशिका' : 'PIB Media Officers & Departmental Information Officers (DIO) Directory'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Official directory of officers attached to Union Ministries for press enquiries and official clarifications.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border border-slate-200 dark:border-slate-800">
                <thead className="bg-[#0b3558] text-white font-semibold">
                  <tr>
                    <th className="p-3">Officer Name</th>
                    <th className="p-3">Designation</th>
                    <th className="p-3">Attached Ministry / Division</th>
                    <th className="p-3">Office Location</th>
                    <th className="p-3">Official Email</th>
                    <th className="p-3">Telephone</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {MEDIA_OFFICERS.map((officer, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="p-3 font-bold text-slate-900 dark:text-white">{officer.name}</td>
                      <td className="p-3 text-slate-600 dark:text-slate-300">{officer.designation}</td>
                      <td className="p-3 font-semibold text-[#0b3558] dark:text-sky-300">{officer.ministry}</td>
                      <td className="p-3 font-mono text-slate-600 dark:text-slate-400">{officer.room}</td>
                      <td className="p-3 font-mono text-[#0b3558] dark:text-sky-400">{officer.email}</td>
                      <td className="p-3 font-mono text-slate-700 dark:text-slate-300">{officer.phone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
              Note: General press queries can also be routed through the Central Press Room, NMC (Tel: 011-23488050 / Fax: 011-23488051).
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
