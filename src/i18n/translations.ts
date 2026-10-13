export interface TranslationSchema {
  common: {
    govIndia: string;
    pibTitle: string;
    mediaCentre: string;
    officialRelease: string;
    readMore: string;
    readFull: string;
    downloadPdf: string;
    save: string;
    saved: string;
    share: string;
    print: string;
    askAi: string;
    postedOn: string;
    prid: string;
    location: string;
    category: string;
    ministry: string;
    search: string;
    allMinistries: string;
    allCategories: string;
    allLanguages: string;
    back: string;
    continue: string;
    cancel: string;
    close: string;
    subscribe: string;
    unsubscribe: string;
  };
  nav: {
    home: string;
    about: string;
    search: string;
    assistant: string;
    feed: string;
    saved: string;
    mediaFacilitation: string;
    ministries: string;
    preferences: string;
    askAssistantCta: string;
  };
  mediaFacilitation: {
    title: string;
    subtitle: string;
    badge: string;
  };
  home: {
    heroTitle: string;
    heroSubtitle: string;
    searchPlaceholder: string;
    searchButton: string;
    personalisedDiscovery: string;
    discoveryDesc: string;
    personaCitizen: string;
    personaJournalist: string;
    latestReleases: string;
    latestDesc: string;
    allFilter: string;
    filterByMinistry: string;
    filterByCategory: string;
    relatedClusters: string;
    relatedDesc: string;
    noReleasesFound: string;
  };
  about: {
    title: string;
    subtitle: string;
    charterTitle: string;
    charterText: string;
    mediaFacilitationTitle: string;
    mediaFacilitationDesc: string;
    accreditationTitle: string;
    accreditationDesc: string;
    nmcTitle: string;
    nmcDesc: string;
    briefingsTitle: string;
    briefingsDesc: string;
    researchUnitTitle: string;
    researchUnitDesc: string;
    backgroundersTitle: string;
    backgroundersDesc: string;
    feedbackTitle: string;
    feedbackDesc: string;
    factCheckTitle: string;
    factCheckDesc: string;
    fcuMission: string;
    fcuHelpline: string;
    fcuProcess: string;
    structureTitle: string;
    structureDesc: string;
  };
  feed: {
    title: string;
    subtitle: string;
    step1Title: string;
    step2Title: string;
    step3Title: string;
    step4Title: string;
    step5Title: string;
    testDispatch: string;
    previewBulletin: string;
    editSubscription: string;
    myLiveFeed: string;
    downloadPdfBulletin: string;
  };
  assistant: {
    title: string;
    subtitle: string;
    placeholder: string;
    send: string;
    suggestedQueries: string;
    disclaimer: string;
    sourcesTitle: string;
  };
  saved: {
    title: string;
    subtitle: string;
    downloadDossierPdf: string;
    exportJson: string;
    clearAll: string;
    emptyText: string;
  };
  footer: {
    aboutPib: string;
    aboutText: string;
    quickLinks: string;
    factCheckHelpline: string;
    nmcAddress: string;
    copyright: string;
    disclaimer: string;
  };
}

export const TRANSLATIONS: Record<'en' | 'hi', TranslationSchema> = {
  en: {
    common: {
      govIndia: 'Government of India',
      pibTitle: 'Press Information Bureau',
      mediaCentre: 'National Media Centre, New Delhi',
      officialRelease: 'Official Government Release',
      readMore: 'Read More',
      readFull: 'Read Full',
      downloadPdf: 'Download PDF',
      save: 'Save',
      saved: 'Saved',
      share: 'Share',
      print: 'Print',
      askAi: 'Ask AI',
      postedOn: 'Posted On',
      prid: 'PRID',
      location: 'New Delhi',
      category: 'Category',
      ministry: 'Ministry',
      search: 'Search',
      allMinistries: 'All Ministries',
      allCategories: 'All Categories',
      allLanguages: 'All Languages',
      back: 'Back',
      continue: 'Continue',
      cancel: 'Cancel',
      close: 'Close',
      subscribe: 'Subscribe',
      unsubscribe: 'Unsubscribe'
    },
    nav: {
      home: 'Home',
      about: 'About Us',
      search: 'Smart Search',
      assistant: 'AI Assistant',
      feed: 'My PIB Feed',
      saved: 'Saved Releases',
      mediaFacilitation: 'Media Facilitation',
      ministries: 'Ministries',
      preferences: 'Preferences',
      askAssistantCta: 'Ask PIB Assistant'
    },
    mediaFacilitation: {
      title: 'Media Facilitation Portal',
      subtitle: 'Official Press Accreditation, National Media Centre facilities, Cabinet briefing passes, and journalist welfare services.',
      badge: 'Official Media Services'
    },
    home: {
      heroTitle: 'Official Government Information & Press Releases',
      heroSubtitle: 'Direct, authentic publications from the Government of India with AI synthesis and verifiable gazette records.',
      searchPlaceholder: 'Search press releases, cabinet decisions, schemes, policy notices...',
      searchButton: 'Search Releases',
      personalisedDiscovery: 'Personalised Discovery Mode',
      discoveryDesc: 'Customize your feed for citizen schemes or media and journalism.',
      personaCitizen: 'General Citizen',
      personaJournalist: 'Journalism / Media',
      latestReleases: 'Latest Official Press Releases',
      latestDesc: 'Chronological official bulletins published across Union Ministries.',
      allFilter: 'All Releases',
      filterByMinistry: 'Filter by Ministry',
      filterByCategory: 'Filter by Policy Domain',
      relatedClusters: 'Thematic Clusters & Related Announcements',
      relatedDesc: 'Grouped multi-ministry policy announcements and coordinated government initiatives.',
      noReleasesFound: 'No official releases found matching your selected criteria.'
    },
    about: {
      title: 'About Press Information Bureau (PIB)',
      subtitle: 'The nodal agency of the Government of India for disseminating information to the media and the public.',
      charterTitle: 'Role, Charter & Mandate',
      charterText: 'Press Information Bureau (PIB) is the nodal communications agency of the Government of India. PIB disseminates information on government policies, programmes, initiatives, and achievements to the print, electronic, and digital media. Operating under the Ministry of Information & Broadcasting, PIB is headed by the Principal Director General (Pr. DG) and functions through its headquarters at the National Media Centre, New Delhi, along with regional and branch offices across India.',
      mediaFacilitationTitle: 'Media Facilitation Division',
      mediaFacilitationDesc: 'Comprehensive press accreditation and modern infrastructure for accredited media representatives.',
      accreditationTitle: 'Press Accreditation & CPAC',
      accreditationDesc: 'Issues official government press accreditation cards to correspondents, editors, photojournalists, and camera persons under the Central Press Accreditation Committee guidelines, granting access to official briefings and government premises.',
      nmcTitle: 'National Media Centre (NMC)',
      nmcDesc: 'State-of-the-art communication facility at 7E Raisina Road, New Delhi, equipped with world-class press briefing auditoriums, high-speed fiber connectivity, media lounge, editing rooms, and multi-camera live telecast uplink capabilities.',
      briefingsTitle: 'Press Conferences & Media Tours',
      briefingsDesc: 'Organizes Union Cabinet briefings, ministerial press conferences, and all-India developmental media tours for journalists to observe national infrastructure and welfare milestones firsthand.',
      researchUnitTitle: 'Research & Feedback Division',
      researchUnitDesc: 'Policy backgrounders, reference dossiers, and daily public sentiment media feedback for Union Ministries.',
      backgroundersTitle: 'Backgrounders & Reference Dossiers',
      backgroundersDesc: 'Prepares comprehensive, verifiable background papers, factsheets, Union Budget summaries, and special dossiers on critical national legislation and developmental programmes.',
      feedbackTitle: 'Daily Media Feedback Reports',
      feedbackDesc: 'Monitors print, electronic, and digital media round the clock to compile analytical media feedback digests for Union Ministers and senior administrative secretaries on public reaction and ground implementation.',
      factCheckTitle: 'PIB Fact Check Unit (FCU)',
      factCheckDesc: 'The official anti-misinformation mechanism established in November 2019 to counter fake news and viral misinformation related to the Government of India.',
      fcuMission: 'The Fact Check Unit acts as the first line of defense against viral misinformation concerning government policies, notifications, competitive exams, and welfare disbursements.',
      fcuHelpline: 'Citizens can verify suspected claims via the official WhatsApp helpline (+91 87997 11259) or email (pibfactcheck@gmail.com).',
      fcuProcess: 'Each claim is cross-verified directly with the nodal ministry. Debunks are categorized as FAKE, MISLEADING, or REAL, and published across official social handles (@PIBFactCheck).',
      structureTitle: 'Organizational Leadership & Regional Network',
      structureDesc: 'Headed by the Principal Director General (Pr. DG), PIB operates 8 Regional Offices and 34 Branch Offices across all States and Union Territories, providing localized information dissemination in all scheduled Indian languages.'
    },
    feed: {
      title: 'My PIB Feed — Subscription & Personalised Feed',
      subtitle: 'Configure ministry and topic subscriptions, customize your daily official digest schedule, and read your real-time personalized release stream.',
      step1Title: '1. Topics & Ministries',
      step2Title: '2. Email Address',
      step3Title: '3. Schedule & Time',
      step4Title: '4. Review & Activate',
      step5Title: 'Active Subscription',
      testDispatch: 'Send Test Dispatch',
      previewBulletin: 'Preview Email Bulletin',
      editSubscription: 'Edit Subscription',
      myLiveFeed: 'My Personalised Live Feed',
      downloadPdfBulletin: 'Download PDF Bulletin'
    },
    assistant: {
      title: 'PIB AI Assistant',
      subtitle: 'Ask questions grounded strictly in official Press Information Bureau releases and government gazette records.',
      placeholder: 'Ask a question about government releases, schemes, or dates...',
      send: 'Send',
      suggestedQueries: 'Suggested Citizen & Media Queries',
      disclaimer: 'Responses are synthesized directly from authentic Government of India press releases. Every answer references official PRIDs.',
      sourcesTitle: 'Official Verified Sources'
    },
    saved: {
      title: 'Saved Releases & Notes',
      subtitle: 'Your personal official reading list, policy reference documents, and competitive exam preparation notes.',
      downloadDossierPdf: 'Download PDF Dossier',
      exportJson: 'Export JSON',
      clearAll: 'Clear All',
      emptyText: 'You have not saved any press releases yet. Click the bookmark icon on any release to save it here.'
    },
    footer: {
      aboutPib: 'About Press Information Bureau',
      aboutText: 'The Press Information Bureau (PIB) is the nodal agency of the Government of India to disseminate information to the print and electronic media on government policies, programmes, initiatives and achievements.',
      quickLinks: 'Quick Links',
      factCheckHelpline: 'PIB Fact Check Helpline: +91 87997 11259 | pibfactcheck@gmail.com',
      nmcAddress: 'National Media Centre, 7E Raisina Road, New Delhi - 110001',
      copyright: 'Press Information Bureau, Government of India. All Rights Reserved.',
      disclaimer: 'Website redesigned with verified Government of India assets, grounded AI synthesis, and direct official PDF downloads.'
    }
  },
  hi: {
    common: {
      govIndia: 'भारत सरकार',
      pibTitle: 'पत्र सूचना कार्यालय',
      mediaCentre: 'राष्ट्रीय मीडिया केंद्र, नई दिल्ली',
      officialRelease: 'आधिकारिक सरकारी विज्ञप्ति',
      readMore: 'आगे पढ़ें',
      readFull: 'पूरी विज्ञप्ति पढ़ें',
      downloadPdf: 'पीडीएफ डाउनलोड करें',
      save: 'सहेजें',
      saved: 'सहेजा गया',
      share: 'साझा करें',
      print: 'प्रिंट करें',
      askAi: 'एआई से पूछें',
      postedOn: 'जारी किया गया',
      prid: 'पीआरआईडी',
      location: 'नई दिल्ली',
      category: 'श्रेणी',
      ministry: 'मंत्रालय',
      search: 'खोजें',
      allMinistries: 'सभी मंत्रालय',
      allCategories: 'सभी श्रेणियां',
      allLanguages: 'सभी भाषाएं',
      back: 'पीछे जाएं',
      continue: 'आगे बढ़ें',
      cancel: 'रद्द करें',
      close: 'बंद करें',
      subscribe: 'सदस्यता लें',
      unsubscribe: 'सदस्यता समाप्त करें'
    },
    nav: {
      home: 'मुख्य पृष्ठ',
      about: 'हमारे बारे में',
      search: 'खोजें (Search)',
      assistant: 'पीआईबी सहायक',
      feed: 'मेरी फ़ीड',
      saved: 'सहेजे गए लेख',
      mediaFacilitation: 'मीडिया सुविधा',
      ministries: 'मंत्रालय',
      preferences: 'सेटिंग्स',
      askAssistantCta: 'पीआईबी सहायक से पूछें'
    },
    mediaFacilitation: {
      title: 'मीडिया सुविधा पोर्टल (Media Facilitation)',
      subtitle: 'आधिकारिक प्रेस मान्यता, राष्ट्रीय मीडिया केंद्र सुविधाएं, कैबिनेट ब्रीफिंग पास एवं पत्रकार कल्याण सेवाएं।',
      badge: 'आधिकारिक मीडिया सेवाएं'
    },
    home: {
      heroTitle: 'आधिकारिक सरकारी सूचना एवं प्रेस विज्ञप्तियां',
      heroSubtitle: 'भारत सरकार के मंत्रालयों से सीधे, प्रामाणिक और सत्यापित सरकारी निर्णय एवं नीतिगत घोषणाएं।',
      searchPlaceholder: 'प्रेस विज्ञप्तियां, मंत्रिमंडल के निर्णय, योजनाएं, अधिसूचनाएं खोजें...',
      searchButton: 'विज्ञप्तियां खोजें',
      personalisedDiscovery: 'व्यक्तिगत खोज मोड',
      discoveryDesc: 'सामान्य नागरिक योजनाओं या पत्रकारिता/मीडिया के अनुसार अपनी फ़ीड अनुकूलित करें।',
      personaCitizen: 'सामान्य नागरिक',
      personaJournalist: 'पत्रकारिता / मीडिया',
      latestReleases: 'नवीनतम आधिकारिक प्रेस विज्ञप्तियां',
      latestDesc: 'केंद्रीय मंत्रालयों द्वारा जारी की गई आधिकारिक दैनिक विज्ञप्तियां।',
      allFilter: 'सभी विज्ञप्तियां',
      filterByMinistry: 'मंत्रालय के अनुसार फ़िल्टर',
      filterByCategory: 'विषय श्रेणी के अनुसार फ़िल्टर',
      relatedClusters: 'संबंधित आधिकारिक घोषणाएं एवं समूह',
      relatedDesc: 'विभिन्न मंत्रालयों की समन्वित नीतिगत घोषणाएं और राष्ट्रीय विकास परियोजनाएं।',
      noReleasesFound: 'चयनित मानदंडों से मेल खाती कोई आधिकारिक विज्ञप्ति नहीं मिली।'
    },
    about: {
      title: 'पत्र सूचना कार्यालय (पीआईबी) के बारे में',
      subtitle: 'सरकारी नीतियों और कार्यक्रमों की जानकारी मीडिया और जनता तक पहुंचाने वाली भारत सरकार की नोडल एजेंसी।',
      charterTitle: 'भूमिका, अधिदेश एवं चार्टर',
      charterText: 'पत्र सूचना कार्यालय (पीआईबी) भारत सरकार की नोडल संचार एजेंसी है। यह सरकारी नीतियों, कार्यक्रमों, पहलों और उपलब्धियों की जानकारी प्रिंट, इलेक्ट्रॉनिक और डिजिटल मीडिया को प्रसारित करता है। सूचना और प्रसारण मंत्रालय के अंतर्गत कार्यरत पीआईबी का नेतृत्व प्रधान महानिदेशक (Pr. DG) करते हैं और इसका मुख्यालय राष्ट्रीय मीडिया केंद्र, नई दिल्ली में स्थित है।',
      mediaFacilitationTitle: 'मीडिया सुविधा प्रभाग (Media Facilitation)',
      mediaFacilitationDesc: 'मान्यता प्राप्त मीडिया प्रतिनिधियों के लिए सुलभ प्रेस मान्यता और आधुनिक बुनियादी ढांचा।',
      accreditationTitle: 'प्रेस मान्यता और सीपीएसी',
      accreditationDesc: 'केंद्रीय प्रेस मान्यता समिति (CPAC) के तहत पत्रकारों, संपादकों, छायाकारों और तकनीशियनों को आधिकारिक सरकारी प्रेस कार्ड जारी करता है, जिससे सरकारी कार्यक्रमों और मंत्रालयों तक पहुंच सुनिश्चित होती है।',
      nmcTitle: 'राष्ट्रीय मीडिया केंद्र (NMC)',
      nmcDesc: '7E रायसीना रोड, नई दिल्ली स्थित अत्याधुनिक मीडिया केंद्र, जिसमें विश्व स्तरीय प्रेस ब्रीफिंग हॉल, मीडिया लाउंज, उच्च गति फाइबर कनेक्टिविटी और मल्टी-कैमरा लाइव प्रसारण सुविधाएं उपलब्ध हैं।',
      briefingsTitle: 'प्रेस वार्ताएं एवं क्षेत्रीय मीडिया दौरे',
      briefingsDesc: 'केंद्रीय मंत्रिमंडल के निर्णयों की ब्रीफिंग, मंत्री स्तरीय प्रेस वार्ताएं और राष्ट्रीय विकास परियोजनाओं की जमीनी प्रगति दिखाने के लिए पत्रकारों हेतु अखिल भारतीय मीडिया दौरों का आयोजन करता है।',
      researchUnitTitle: 'शोध एवं फीडबैक प्रभाग (Research Unit)',
      researchUnitDesc: 'केंद्रीय मंत्रालयों के लिए नीतिगत पृष्ठभूमि दस्तावेज, संदर्भ सामग्री और दैनिक मीडिया फीडबैक।',
      backgroundersTitle: 'पृष्ठभूमि दस्तावेज एवं संदर्भ पुस्तिकाएं',
      backgroundersDesc: 'प्रमुख सरकारी नीतियों, केंद्रीय बजट, राष्ट्रीय मील के पत्थरों और प्रमुख विधेयकों पर व्यापक, तथ्य-आधारित पृष्ठभूमि पत्रक और संदर्भ सामग्री तैयार करता है।',
      feedbackTitle: 'दैनिक मीडिया फीडबैक रिपोर्ट',
      feedbackDesc: 'प्रिंट, टीवी और डिजिटल मीडिया पर जनभावना और समाचारों की चौबीसों घंटे निगरानी कर मंत्रियों और वरिष्ठ सचिवों के लिए विश्लेषणात्मक फीडबैक रिपोर्ट तैयार करता है।',
      factCheckTitle: 'पीआईबी तथ्य जांच इकाई (PIB Fact Check Unit)',
      factCheckDesc: 'भारत सरकार से संबंधित फर्जी खबरों और भ्रामक जानकारियों का खंडन करने के लिए नवंबर 2019 में स्थापित आधिकारिक तंत्र।',
      fcuMission: 'तथ्य जांच इकाई सरकारी योजनाओं, भर्ती परीक्षाओं, वित्तीय अधिसूचनाओं और कैबिनेट निर्णयों से जुड़ी फर्जी खबरों की त्वरित पहचान कर उनका आधिकारिक खंडन करती है।',
      fcuHelpline: 'नागरिक आधिकारिक व्हाट्सएप हेल्पलाइन (+91 87997 11259) या ईमेल (pibfactcheck@gmail.com) पर संदिग्ध दावों की जांच करा सकते हैं।',
      fcuProcess: 'प्रत्येक दावे का संबंधित मंत्रालय के साथ आधिकारिक सत्यापन किया जाता है। इसके बाद आधिकारिक सोशल मीडिया हैंडल (@PIBFactCheck) पर खंडन जारी किया जाता है।',
      structureTitle: 'संगठनात्मक नेतृत्व एवं देशव्यापी नेटवर्क',
      structureDesc: 'प्रधान महानिदेशक के नेतृत्व में पीआईबी देश भर के सभी राज्यों और केंद्र शासित प्रदेशों में 8 क्षेत्रीय कार्यालयों और 34 शाखा कार्यालयों के माध्यम से सभी प्रमुख भारतीय भाषाओं में सूचना का प्रसार करता है।'
    },
    feed: {
      title: 'मेरी पीआईबी फ़ीड — सदस्यता एवं व्यक्तिगत फ़ीड',
      subtitle: 'मंत्रालय और विषय चुनें, अपना दैनिक बुलेटिन समय निर्धारित करें और वास्तविक समय में अपनी व्यक्तिगत विज्ञप्तियां पढ़ें।',
      step1Title: '1. विषय और मंत्रालय',
      step2Title: '2. ईमेल पता',
      step3Title: '3. समय एवं आवृत्ति',
      step4Title: '4. समीक्षा एवं सक्रियण',
      step5Title: 'सक्रिय सदस्यता',
      testDispatch: 'परीक्षण बुलेटिन भेजें',
      previewBulletin: 'ईमेल पूर्वावलोकन',
      editSubscription: 'सदस्यता बदलें',
      myLiveFeed: 'मेरी व्यक्तिगत लाइव फ़ीड',
      downloadPdfBulletin: 'पीडीएफ बुलेटिन डाउनलोड करें'
    },
    assistant: {
      title: 'पीआईबी एआई सहायक',
      subtitle: 'आधिकारिक प्रेस विज्ञप्तियों और सरकारी राजपत्र रिकॉर्ड के आधार पर सीधे प्रश्न पूछें।',
      placeholder: 'सरकारी योजनाओं, नीतियों या आंकड़ों के बारे में पूछें...',
      send: 'पूछें',
      suggestedQueries: 'सुझाए गए नागरिक प्रश्न',
      disclaimer: 'सभी उत्तर सीधे भारत सरकार की आधिकारिक विज्ञप्तियों पर आधारित हैं। प्रत्येक उत्तर में आधिकारिक पीआरआईडी उद्धृत है।',
      sourcesTitle: 'सत्यापित आधिकारिक स्रोत'
    },
    saved: {
      title: 'सहेजे गए लेख एवं नोट्स',
      subtitle: 'आपकी व्यक्तिगत पठन सूची, नीतिगत संदर्भ सामग्री और अध्ययन नोट्स।',
      downloadDossierPdf: 'पीडीएफ डोजियर डाउनलोड करें',
      exportJson: 'जेएसओएन निर्यात करें',
      clearAll: 'सभी हटाएं',
      emptyText: 'आपने अभी तक कोई विज्ञप्ति नहीं सहेजी है। किसी भी विज्ञप्ति पर बुकमार्क आइकन दबाकर उसे यहां सहेजें।'
    },
    footer: {
      aboutPib: 'पत्र सूचना कार्यालय के बारे में',
      aboutText: 'पत्र सूचना कार्यालय (पीआईबी) भारत सरकार की नीतियों, कार्यक्रमों, पहलों और उपलब्धियों की जानकारी मीडिया और जनता तक पहुंचाने वाली नोडल एजेंसी है।',
      quickLinks: 'महत्वपूर्ण लिंक',
      factCheckHelpline: 'तथ्य जांच हेल्पलाइन: +91 87997 11259 | pibfactcheck@gmail.com',
      nmcAddress: 'राष्ट्रीय मीडिया केंद्र, 7E रायसीना रोड, नई दिल्ली - 110001',
      copyright: 'पत्र सूचना कार्यालय, भारत सरकार। सर्वाधिकार सुरक्षित।',
      disclaimer: 'सत्यापित सरकारी पहचान, प्रामाणिक एआई संश्लेषण एवं सीधे पीडीएफ डाउनलोड के साथ पुनर्निर्मित।'
    }
  }
};
