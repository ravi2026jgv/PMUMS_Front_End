export const DEFAULT_PORTAL_SLUG = 'tab1';

export const PORTALS = [
  {
    slug: 'tab1',
    code: 'TAB1',

    // =========================================================
    // EXISTING / INTERNAL VALUES
    // IMPORTANT:
    // Keep these values because the existing TAB 1 header
    // and other shared components already use them.
    // =========================================================
    name: 'Kalyan Kosh - Portal 1',
    shortName: 'Portal 1',

    selectorLabel: 'पोर्टल 1',
    selectorCategory: 'वर्तमान पोर्टल',
    selectorTitle:
      'स्कूल शिक्षा विभाग एवं आदिम जाति कल्याण विभाग के नियमित कर्मचारी / अधिकारी / शिक्षक / संविदा शिक्षक / अतिथि शिक्षक / कम्प्यूटर ऑपरेटर / आउटसोर्स आदि',
    selectorDescription:
      'स्कूल शिक्षा एवं आदिम जाति कल्याण विभाग से संबंधित कर्मचारियों के लिए।',

    enabled: true,
    status: 'active',

    // Show this portal on the new "/" landing page
    showOnLanding: true,

    // =========================================================
    // NEW LANDING PAGE VALUES
    // These values are used ONLY by PortalSelector.js.
    // This prevents us from disturbing TAB 1.
    // =========================================================
    landingGroupLabel: 'प्रथम समूह',
    landingCategory: 'Education Family',
    landingTitle: 'शिक्षा एवं जनजातीय कार्य विभाग',
    landingEnglishTitle:
      'School Education & Tribal Welfare Department',

    landingDescription:
      'स्कूल शिक्षा विभाग एवं जनजातीय कार्य विभाग के अंतर्गत कार्यरत पात्र अधिकारी-कर्मचारियों, शिक्षकों एवं अन्य कर्मचारियों के लिए पृथक कल्याण समूह।',

    landingEligibility: [
      'समस्त नियमित शिक्षक, शिक्षक संवर्ग, अधिकारी एवं कर्मचारी',
      'समस्त लिपिकीय संवर्ग के कर्मचारी',
      'समस्त अतिथि शिक्षक (Guest Teachers)',
      'समस्त अस्थाई शिक्षक',
      'समस्त संविदा शिक्षक एवं संविदा कर्मचारी',
      'आई.टी. शिक्षक (IT Teachers)',
      'आउटसोर्स शिक्षक एवं अन्य आउटसोर्स कर्मचारी',
      'कंप्यूटर ऑपरेटर',
      'अन्य सभी प्रकार के अस्थाई / संविदा आधार पर कार्यरत कर्मचारी',
    ],

    landingButtonText: 'शिक्षा परिवार में प्रवेश करें',

    theme: {
      background:
        'linear-gradient(145deg, #ffe600 0%, #ffc400 52%, #ffad00 100%)',
      darkColor: '#4d3900',
      textColor: '#241b00',
      lightColor: '#fff9c7',
      shadowColor: 'rgba(190, 137, 0, 0.28)',
    },

    features: {
      selfDonation: true,
      registration: true,
      memberServices: true,
    },
  },

  {
    slug: 'tab2',
    code: 'TAB2',

    // =========================================================
    // EXISTING / INTERNAL VALUES
    // We will configure TAB 2 operational screens separately
    // in the next phase.
    // =========================================================
    name: 'Kalyan Kosh - Portal 2',
    shortName: 'Portal 2',

    selectorLabel: 'पोर्टल 2',
    selectorCategory: 'संविदा एवं आउटसोर्स कर्मचारी',
    selectorTitle:
      'समस्त विभागों के संविदा / आउटसोर्स कर्मचारी / अधिकारी / कम्प्यूटर ऑपरेटर / कन्वर्जेंसी / आँगनवाड़ी आदि कर्मचारी',
    selectorDescription:
      'समस्त विभागों के संविदा, आउटसोर्स एवं संबंधित कर्मचारियों के लिए।',

    enabled: true,
    status: 'active',

    // Show this portal on the new "/" landing page
    showOnLanding: true,

    // =========================================================
    // NEW LANDING PAGE VALUES
    // Client's latest definition for second operational group
    // =========================================================
    landingGroupLabel: 'द्वितीय समूह',
    landingCategory: 'All Other Departments & Sectors',
    landingTitle:
      'अन्य समस्त शासकीय विभाग, उपक्रम एवं बैंक',
    landingEnglishTitle:
      'All Other Government Departments, Undertakings & Banks',

    landingDescription:
      'शिक्षा एवं जनजातीय कार्य विभाग के अतिरिक्त मध्य प्रदेश शासन के अन्य सभी शासकीय विभागों, निगम-मंडलों, शासकीय उपक्रमों, बैंकों एवं सुरक्षा बलों में कार्यरत पात्र कर्मचारियों के लिए पृथक कल्याण समूह।',

    landingEligibility: [
      'समस्त नियमित अधिकारी एवं कर्मचारी',
      'संविदा अधिकारी एवं कर्मचारी',
      'आउटसोर्स कर्मचारी',
      'कंप्यूटर ऑपरेटर एवं आई.टी. से संबंधित कर्मचारी',
      'आंगनवाड़ी कार्यकर्ता एवं सहायिका',
      'अन्य सभी अस्थाई कर्मचारी',
      'विभागीय / संस्थागत व्यवस्था के अंतर्गत कार्यरत अन्य कर्मचारी',
    ],

    landingButtonText: 'अन्य विभाग समूह में प्रवेश करें',

    theme: {
      background:
        'linear-gradient(145deg, #22d3ee 0%, #06b6d4 50%, #0284c7 100%)',
      darkColor: '#064e63',
      textColor: '#ffffff',
      lightColor: '#cffafe',
      shadowColor: 'rgba(2, 132, 199, 0.28)',
    },

    features: {
      selfDonation: true,
      registration: true,
      memberServices: true,
    },
  },

  {
    slug: 'tab3',
    code: 'TAB3',

    // TAB 3 remains available in architecture/code,
    // but it is NOT part of the current release.
    name: 'Kalyan Kosh - Portal 3',
    shortName: 'Portal 3',

    selectorLabel: 'पोर्टल 3',
    selectorCategory: 'नियमित कर्मचारी',
    selectorTitle:
      'समस्त विभागों के नियमित कर्मचारी / अधिकारी',
    selectorDescription:
      'समस्त विभागों के नियमित कर्मचारियों एवं अधिकारियों के लिए।',

    // IMPORTANT:
    // Not released currently.
    enabled: false,
    status: 'upcoming',

    // Completely hide from main landing page.
    showOnLanding: false,

    theme: {
      background:
        'linear-gradient(145deg, #c084fc 0%, #9333ea 50%, #6b21a8 100%)',
      darkColor: '#581c87',
      textColor: '#ffffff',
      lightColor: '#f3e8ff',
      shadowColor: 'rgba(126, 34, 206, 0.30)',
    },

    features: {
      selfDonation: true,
      registration: true,
      memberServices: true,
    },
  },
];

export const getPortalBySlug = (slug) =>
  PORTALS.find(
    (portal) =>
      portal.slug === String(slug || '').toLowerCase()
  );

export const getDefaultPortal = () =>
  getPortalBySlug(DEFAULT_PORTAL_SLUG);