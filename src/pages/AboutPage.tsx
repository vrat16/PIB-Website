import React from 'react';
import { 
  Building2, Users, ShieldAlert, FileText, CheckCircle2, 
  MapPin, Phone, Mail, Globe, Award, ShieldCheck,
  CheckCheck, AlertTriangle, ArrowRight, BookOpen, Clock
} from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';
import { PibLogo } from '../components/brand/PibLogo';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  const { lang, t } = useTranslation();
  const isHindi = lang === 'hi';

  return (
    <div className="pib-container py-8 max-w-5xl space-y-8" id="main-content">
      {/* 1. Official Government Header Masthead */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 md:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 dark:border-slate-800 pb-6">
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 rounded border border-amber-300 dark:border-amber-800 inline-block">
              {isHindi ? 'सूचना एवं प्रसारण मंत्रालय • भारत सरकार' : 'Ministry of Information & Broadcasting • Government of India'}
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold font-serif text-slate-900 dark:text-white">
              {t.about.title}
            </h1>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              {t.about.subtitle}
            </p>
          </div>
          <div className="hidden sm:block shrink-0">
            <PibLogo />
          </div>
        </div>

        {/* Section Navigation Quick Bar */}
        <div className="pt-4 flex flex-wrap gap-2 text-xs">
          <a href="#genesis" className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-medium text-slate-800 dark:text-slate-200">
            {isHindi ? 'ऐतिहासिक विकास' : 'Genesis & History'}
          </a>
          <a href="#charter" className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-medium text-slate-800 dark:text-slate-200">
            {isHindi ? 'अधिदेश एवं चार्टर' : 'Mandate & Charter'}
          </a>
          <a href="#research-unit" className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-medium text-slate-800 dark:text-slate-200">
            {isHindi ? 'शोध एवं फीडबैक प्रभाग' : 'Research Unit'}
          </a>
          <a href="#fact-check" className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-medium text-slate-800 dark:text-slate-200">
            {isHindi ? 'तथ्य जांच इकाई (FCU)' : 'Fact Check Unit (FCU)'}
          </a>
          <a href="#structure" className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-medium text-slate-800 dark:text-slate-200">
            {isHindi ? 'संगठनात्मक ढांचा' : 'Organization & Network'}
          </a>
        </div>
      </div>

      {/* 2. Genesis & Historical Evolution */}
      <section id="genesis" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 md:p-8 space-y-4 shadow-xs scroll-mt-24">
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <BookOpen className="w-5 h-5 text-[#0b3558] dark:text-sky-400" />
          <h2 className="text-xl font-bold font-serif text-slate-900 dark:text-white">
            {isHindi ? 'स्थापना एवं ऐतिहासिक विकास' : 'Genesis & Historical Evolution'}
          </h2>
        </div>

        <div className="space-y-3 text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <p>
            {isHindi
              ? 'पत्र सूचना कार्यालय (पीआईबी) का इतिहास 1919 में शुरू हुआ, जब भारत सरकार के गृह विभाग के अधीन एक लघु कक्ष के रूप में "केंद्रीय सूचना ब्यूरो" (Central Bureau of Information) की स्थापना की गई थी। इसके प्रथम प्रमुख डॉ. एल. एफ. रशब्रुक विलियम्स थे। 1923 में इसका नाम बदलकर "सार्वजनिक सूचना ब्यूरो" और 1941 में इसे "पत्र सूचना कार्यालय" (Press Information Bureau) नाम दिया गया।'
              : 'The Press Information Bureau traces its origins to June 1919 when a small cell named the Central Bureau of Information was established under the Home Department of the Government of India, headed by Dr. L.F. Rushbrook Williams. In 1923, it was redesignated as the Bureau of Public Information, and in 1941, it was formally named the Press Information Bureau (PIB).'}
          </p>
          <p>
            {isHindi
              ? '1947 में स्वतंत्रता के पश्चात, पीआईबी को नवगठित भारत सरकार की नोडल संचार एजेंसी के रूप में पुनर्गठित किया गया। यह एजेंसी भारतीय सूचना सेवा (IIS) के अधिकारियों द्वारा संचालित होती है और स्वतंत्र भारत के लोकतांत्रिक मूल्यों, विकासात्मक मील के पत्थरों और राष्ट्रीय नीतियों को पारदर्शी रूप से देश की सभी प्रमुख भाषाओं में प्रसारित करने का कार्य कर रही है।'
              : 'Upon Independence in 1947, PIB was reorganised as the prime communications arm of free India. Staffed by officers of the Indian Information Service (IIS), PIB has continually adapted from print gazettes and telegram dispatches to optical fiber webcasting and AI-assisted official communications, operating from the National Media Centre, New Delhi.'}
          </p>
        </div>

        {/* Milestone Timeline Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="font-mono font-bold text-[#0b3558] dark:text-sky-400">1919</div>
            <div className="font-semibold text-slate-900 dark:text-white mt-0.5">{isHindi ? 'स्थापना' : 'Established'}</div>
            <p className="text-[11px] text-slate-500 mt-0.5">Central Bureau of Information</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="font-mono font-bold text-[#0b3558] dark:text-sky-400">1941</div>
            <div className="font-semibold text-slate-900 dark:text-white mt-0.5">{isHindi ? 'पीआईबी नामकरण' : 'Designated PIB'}</div>
            <p className="text-[11px] text-slate-500 mt-0.5">Press Information Bureau</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="font-mono font-bold text-[#0b3558] dark:text-sky-400">1947</div>
            <div className="font-semibold text-slate-900 dark:text-white mt-0.5">{isHindi ? 'राष्ट्रीय नोडल एजेंसी' : 'National Nodal Agency'}</div>
            <p className="text-[11px] text-slate-500 mt-0.5">Free India Information Hub</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="font-mono font-bold text-[#0b3558] dark:text-sky-400">2013-Present</div>
            <div className="font-semibold text-slate-900 dark:text-white mt-0.5">{isHindi ? 'राष्ट्रीय मीडिया केंद्र' : 'National Media Centre'}</div>
            <p className="text-[11px] text-slate-500 mt-0.5">State-of-the-art Headquarters</p>
          </div>
        </div>
      </section>

      {/* 3. Charter & Mandate */}
      <section id="charter" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 md:p-8 space-y-4 shadow-xs scroll-mt-24">
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <Building2 className="w-5 h-5 text-[#0b3558] dark:text-sky-400" />
          <h2 className="text-xl font-bold font-serif text-slate-900 dark:text-white">
            {t.about.charterTitle}
          </h2>
        </div>

        <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          {t.about.charterText}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{isHindi ? 'प्रामाणिक स्रोत' : 'Official Authority'}</span>
            </div>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              {isHindi ? 'केंद्रीय मंत्रिमंडल के निर्णयों एवं सरकारी अधिसूचनाओं का एकमात्र आधिकारिक प्राथमिक स्रोत।' : 'Sole authentic dissemination authority for Union Ministries and the Cabinet.'}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-sky-600" />
              <span>{isHindi ? 'बहुभाषी पहुंच' : 'Multilingual Reach'}</span>
            </div>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              {isHindi ? 'अंग्रेजी, हिन्दी तथा संविधान की 8वीं अनुसूची की सभी प्रमुख भारतीय भाषाओं में प्रकाशन।' : 'Releases published in English, Hindi, and all scheduled regional languages.'}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>{isHindi ? 'प्रेस परामर्शदाता' : 'Communications Advisory'}</span>
            </div>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              {isHindi ? 'मंत्रालयों को मीडिया रणनीति और जनसंचार पर पेशेवर सलाह।' : 'Professional communication advisory to Union Ministers and administrative secretaries.'}
            </p>
          </div>
        </div>
      </section>

      {/* 4. Research & Feedback Division (Research Unit) */}
      <section id="research-unit" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 md:p-8 space-y-5 shadow-xs scroll-mt-24">
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <FileText className="w-5 h-5 text-[#0b3558] dark:text-sky-400" />
          <div>
            <h2 className="text-xl font-bold font-serif text-slate-900 dark:text-white">
              {t.about.researchUnitTitle}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {t.about.researchUnitDesc}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCheck className="w-4 h-4 text-[#0b3558] dark:text-sky-400" />
              <span>{t.about.backgroundersTitle}</span>
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
              {t.about.backgroundersDesc}
            </p>
            <ul className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1 list-disc list-inside">
              <li>{isHindi ? 'केंद्रीय बजट और आर्थिक सर्वेक्षण के व्यापक विश्लेषण एवं संदर्भ मैनुअल।' : 'Union Budget and Economic Survey analytical reference manuals.'}</li>
              <li>{isHindi ? 'संसद सत्रों के दौरान प्रमुख नीतिगत विधेयकों पर पृष्ठभूमि दस्तावेज।' : 'Background notes on major legislative bills presented during Parliament sessions.'}</li>
              <li>{isHindi ? 'प्रमुख राष्ट्रीय पहलों (जैसे डिजिटल इंडिया, गतिशक्ति) पर तथ्य पत्रक।' : 'Verified factsheets on national flagship programmes and welfare schemes.'}</li>
            </ul>
          </div>

          <div className="p-5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#0b3558] dark:text-sky-400" />
              <span>{t.about.feedbackTitle}</span>
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
              {t.about.feedbackDesc}
            </p>
            <ul className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1 list-disc list-inside">
              <li>{isHindi ? 'प्रिंट, टीवी और डिजिटल पोर्टलों की 24×7 बहुभाषी निगरानी।' : '24x7 multilingual monitoring of print, broadcast, and digital news portals.'}</li>
              <li>{isHindi ? 'नीतिगत निर्णयों पर जनता और संपादकीय प्रतिक्रिया का दैनिक सार संग्रह।' : 'Daily feedback digests evaluating public perception and ground-level implementation.'}</li>
              <li>{isHindi ? 'मंत्रालयों को त्वरित सुधारात्मक जानकारी प्रदान करने हेतु नोडल संपर्क।' : 'Advisory feedback loops enabling rapid administrative clarifications.'}</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 5. PIB Fact Check Unit (FCU) */}
      <section id="fact-check" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 md:p-8 space-y-5 shadow-xs scroll-mt-24">
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <ShieldAlert className="w-5 h-5 text-rose-600" />
          <div>
            <h2 className="text-xl font-bold font-serif text-slate-900 dark:text-white">
              {t.about.factCheckTitle}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {t.about.factCheckDesc}
            </p>
          </div>
        </div>

        <div className="p-5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>{isHindi ? 'सरकारी सूचनाओं का आधिकारिक सत्यापन तंत्र' : 'Statutory Verification Mechanism for Government Claims & Notifications'}</span>
          </div>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
            {t.about.fcuMission}
          </p>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
            {t.about.fcuProcess}
          </p>
        </div>

        {/* Fact Check Helpline Contact Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
            <span className="text-slate-500 block text-[11px] font-medium">{isHindi ? 'व्हाट्सएप हेल्पलाइन' : 'WhatsApp Helpline'}</span>
            <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5 font-mono">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>+91 87997 11259</span>
            </div>
            <p className="text-[10px] text-slate-500">{isHindi ? 'संदिग्ध संदेश और पोस्टर भेजें' : 'Send suspicious viral claims'}</p>
          </div>

          <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
            <span className="text-slate-500 block text-[11px] font-medium">{isHindi ? 'आधिकारिक ईमेल' : 'Official Email'}</span>
            <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5 font-mono">
              <Mail className="w-3.5 h-3.5 text-sky-600" />
              <span>pibfactcheck@gmail.com</span>
            </div>
            <p className="text-[10px] text-slate-500">{isHindi ? 'दस्तावेज और अधिसूचनाएं अग्रेषित करें' : 'Forward circulars and letters'}</p>
          </div>

          <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
            <span className="text-slate-500 block text-[11px] font-medium">{isHindi ? 'सोशल मीडिया हैंडल' : 'Official X / Twitter Handle'}</span>
            <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5 font-mono">
              <Globe className="w-3.5 h-3.5 text-amber-600" />
              <span>@PIBFactCheck</span>
            </div>
            <p className="text-[10px] text-slate-500">{isHindi ? 'सत्यापित खंडन एवं दृश्य कार्ड' : 'Verified debunks & visual cards'}</p>
          </div>
        </div>
      </section>

      {/* 6. Organizational Hierarchy & Nationwide Network */}
      <section id="structure" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 md:p-8 space-y-5 shadow-xs scroll-mt-24">
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <Users className="w-5 h-5 text-[#0b3558] dark:text-sky-400" />
          <div>
            <h2 className="text-xl font-bold font-serif text-slate-900 dark:text-white">
              {t.about.structureTitle}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {t.about.structureDesc}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="font-bold text-slate-900 dark:text-white">
              {isHindi ? 'केंद्रीय नेतृत्व (नई दिल्ली मुख्यालय)' : 'Central Leadership (New Delhi Headquarters)'}
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
              {isHindi 
                ? 'प्रधान महानिदेशक (Pr. DG) समग्र संस्था का नेतृत्व करते हैं। प्रमुख मंत्रालयों (प्रधानमंत्री कार्यालय, वित्त, गृह, रक्षा, विदेश, रेल) में महानिदेशक (DG) और अतिरिक्त महानिदेशक (ADG) मीडिया संचार का दायित्व संभालते हैं।'
                : 'Led by the Principal Director General (Pr. DG), with dedicated Director Generals (DGs) and Additional Director Generals (ADGs) attached to key Union Ministries.'}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="font-bold text-slate-900 dark:text-white">
              {isHindi ? 'देशव्यापी क्षेत्रीय एवं शाखा कार्यालय' : 'Nationwide Regional & Branch Offices'}
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
              {isHindi
                ? '8 क्षेत्रीय कार्यालय (कोलकाता, मुंबई, चेन्नई, चंडीगढ़, लखनऊ, गुवाहाटी, भोपाल, हैदराबाद) तथा 34 शाखा कार्यालय स्थानीय समाचार पत्रों और प्रादेशिक प्रसारकों को क्षेत्रीय भाषाओं में सामग्री उपलब्ध कराते हैं।'
                : '8 Regional Offices and 34 Branch Offices across all States and Union Territories ensuring localized information dissemination in all scheduled regional languages.'}
            </p>
          </div>
        </div>
      </section>

      {/* Navigation Footer CTA */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs">
        <div>
          <div className="font-bold text-slate-900 dark:text-white">
            {isHindi ? 'मीडिया सुविधा पोर्टल पर जाएं' : 'Need Media Facilities or Accreditation?'}
          </div>
          <div className="text-slate-500 text-[11px]">
            {isHindi ? 'प्रेस मान्यता, एनएमसी सभागार आरक्षण एवं पत्रकार कल्याण योजना की जानकारी।' : 'Explore Press Accreditation, NMC conference hall booking, and Journalist Welfare Scheme.'}
          </div>
        </div>
        <Link
          to="/media-facilitation"
          className="px-4 py-2 bg-[#0b3558] hover:bg-[#164e7c] text-white rounded-lg font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <span>{isHindi ? 'मीडिया सुविधा पोर्टल' : 'Visit Media Facilitation'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
