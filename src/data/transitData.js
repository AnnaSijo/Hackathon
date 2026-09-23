/**
 * ANAVANDI CONNECT - Centralized Transit Data & Routing Model
 * Single Source of Truth for verified local/demo transit corridor data.
 * All fares are explicitly marked "Estimated fare based on demo transit data".
 */

export const DEMO_CORRIDOR = {
  routeId: 'ROUTE-42',
  routeNumber: '42',
  serviceType: 'Fast Passenger',
  vehicleNumber: 'KL 15 0007',
  agency: 'KSRTC (Aanavandi)',
  originId: 'ernakulam_south',
  destinationId: 'aluva',
  totalDistanceKm: 15.0,
  estimatedDurationMin: 45,
  departureFrequencyMin: 7,
  fareStages: 4,
  estimatedFareInr: 40,
  fareDisclaimer: 'Estimated fare based on demo transit data.',
  stops: [
    {
      id: 'ernakulam_south',
      order: 1,
      coords: { lat: 9.9674, lng: 76.2941 },
      names: {
        ml: 'എറണാകുളം സൗത്ത്',
        en: 'Ernakulam South KSRTC',
        hi: 'एरणाकुलम साउथ',
        ta: 'எர்ணாகுளம் சவுத்',
        kn: 'ಎರ್ನಾಕುಲಂ ಸೌತ್'
      },
      subnames: {
        ml: 'എറണാകുളം സൗത്ത് സ്റ്റാൻഡ് & മെട്രോ',
        en: 'Central Bus Depot & Metro Station',
        hi: 'सेंट्रल बस डिपो और मेट्रो स्टेशन',
        ta: 'மத்திய பேருந்து நிலையம் & மெட்ரோ',
        kn: 'ಕೇಂದ್ರ ಬಸ್ ನಿಲ್ದಾಣ & ಮೆಟ್ರೋ'
      },
      distanceFromOriginKm: 0.0,
      scheduledTime: '09:05 AM',
      landmarks: [
        { icon: 'directions_subway', label: 'Metro Station' },
        { icon: 'store', label: 'KSRTC Central Depot' },
        { icon: 'train', label: 'South Railway Station' }
      ],
      walkingFromUser: {
        meters: 350,
        walkingMinutes: 4
      },
      tips: {
        ml: 'പ്ലാറ്റ്‌ഫോം 2-ൽ നിന്നാണ് ഫാസ്റ്റ് പാസഞ്ചർ പുറപ്പെടുന്നത്.',
        en: 'Fast Passenger departs from Platform 2.',
        hi: 'फास्ट पैसेंजर प्लेटफॉर्म 2 से रवाना होती है।',
        ta: 'பாஸ்ட் பேசஞ்சர் நடைமேடை 2-ல் இருந்து புறப்படுகிறது.',
        kn: 'ಫಾಸ್ಟ್ ಪ್ಯಾಸೆಂಜರ್ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ 2 ರಿಂದ ಹೊರಡುತ್ತದೆ.'
      }
    },
    {
      id: 'kaloor',
      order: 2,
      coords: { lat: 9.9934, lng: 76.2985 },
      names: {
        ml: 'കലൂർ ജംഗ്ഷൻ',
        en: 'Kaloor Junction',
        hi: 'कलूर जंक्शन',
        ta: 'கலூர் சந்திப்பு',
        kn: 'ಕಲೂರ್ ಜಂಕ್ಷನ್'
      },
      subnames: {
        ml: 'ജെ.എൽ.എൻ സ്റ്റേഡിയം സമീപം',
        en: 'Near JLN Stadium & Metro',
        hi: 'जेएलएन स्टेडियम के पास',
        ta: 'ஜேஎல்என் ஸ்டேடியம் அருகில்',
        kn: 'ಜೆಎಲ್‌ಎನ್ ಕ್ರೀಡಾಂಗಣದ ಹತ್ತಿರ'
      },
      distanceFromOriginKm: 3.1,
      scheduledTime: '09:18 AM',
      landmarks: [
        { icon: 'stadium', label: 'JLN Stadium' },
        { icon: 'local_hospital', label: 'ESI Hospital' },
        { icon: 'directions_subway', label: 'Kaloor Metro' }
      ],
      walkingFromUser: {
        meters: 1200,
        walkingMinutes: 15
      },
      tips: {
        ml: 'കവലയിൽ തിരക്കുണ്ടാകാൻ സാധ്യതയുണ്ട്.',
        en: 'Expect general traffic at this junction.',
        hi: 'इस जंक्शन पर सामान्य यातायात की अपेक्षा करें।',
        ta: 'இந்த சந்திப்பில் போக்குவரத்து நெரிசல் இருக்கும்.',
        kn: 'ಈ ಜಂಕ್ಷನ್‌ನಲ್ಲಿ ಸಂಚಾರ ದಟ್ಟಣೆ ಇರುತ್ತದೆ.'
      }
    },
    {
      id: 'edappally',
      order: 3,
      coords: { lat: 10.0238, lng: 76.3115 },
      names: {
        ml: 'ഇടപ്പള്ളി ടോൾ',
        en: 'Edappally Toll',
        hi: 'एडप्पल्ली टोल',
        ta: 'இடப்பள்ளி டோல்',
        kn: 'ಎಡಪಳ್ಳಿ ಟೋಲ್'
      },
      subnames: {
        ml: 'ലുലു മാൾ & മെട്രോ ഇൻ്റർചേഞ്ച്',
        en: 'LuLu Mall & Metro Interchange',
        hi: 'लुलु मॉल और मेट्रो इंटरचेंज',
        ta: 'லுலு மால் & மெட்ரோ சந்திப்பு',
        kn: 'ಲುಲು ಮಾಲ್ & ಮೆಟ್ರೋ ಇಂಟರ್‌ಚೇಂಜ್'
      },
      distanceFromOriginKm: 7.4,
      scheduledTime: '09:28 AM',
      landmarks: [
        { icon: 'shopping_bag', label: 'LuLu International Mall' },
        { icon: 'church', label: 'St. George Forane Church' },
        { icon: 'directions_subway', label: 'Edappally Metro' }
      ],
      walkingFromUser: {
        meters: 4200,
        walkingMinutes: 52
      },
      tips: {
        ml: 'പ്രധാന ബസ് ബേയിൽ നിർത്തും.',
        en: 'Buses stop inside the designated main bus bay.',
        hi: 'बसें मुख्य बस बे के अंदर रुकती हैं।',
        ta: 'பேருந்துகள் பிரதான பேருந்து விரிகுடாவில் நிற்கும்.',
        kn: 'ಬಸ್‌ಗಳು ಮುಖ್ಯ ಬಸ್ ಬೇ ಒಳಗೆ ನಿಲ್ಲುತ್ತವೆ.'
      }
    },
    {
      id: 'kalamassery',
      order: 4,
      coords: { lat: 10.0526, lng: 76.3262 },
      names: {
        ml: 'കളമശ്ശേരി പ്രീമിയർ',
        en: 'Kalamassery Premier',
        hi: 'कलमश्शेरी प्रीमियर',
        ta: 'களமசேரி பிரீமியர்',
        kn: 'ಕಳಮಶ್ಶೇರಿ ಪ್ರೀಮಿಯರ್'
      },
      subnames: {
        ml: 'മെഡിക്കൽ കോളേജ് ജംഗ്ഷൻ',
        en: 'Medical College & CUSAT Side',
        hi: 'मेडिकल कॉलेज जंक्शन',
        ta: 'மருத்துவக் கல்லூரி சந்திப்பு',
        kn: 'ವೈದ್ಯಕೀಯ ಕಾಲೇಜು ಜಂಕ್ಷನ್'
      },
      distanceFromOriginKm: 11.2,
      scheduledTime: '09:35 AM',
      landmarks: [
        { icon: 'local_hospital', label: 'Medical College Junction' },
        { icon: 'train', label: 'Kalamassery Metro' },
        { icon: 'school', label: 'CUSAT Campus Road' }
      ],
      walkingFromUser: {
        meters: 7800,
        walkingMinutes: 95
      },
      tips: {
        ml: 'ഡ്രൈവർമാർ ഇടതു വശത്തായി വേഗത കുറയ്ക്കും.',
        en: 'Drivers usually slow down on left lane here.',
        hi: 'चालक आमतौर पर बाईं लेन पर गति धीमी करते हैं।',
        ta: 'ஓட்டுநர்கள் இடது பாதையில் வேகத்தைக் குறைப்பார்கள்.',
        kn: 'ಚಾಲಕರು ಎಡ ಲೇನ್‌ನಲ್ಲಿ ವೇಗವನ್ನು ಕಡಿಮೆ ಮಾಡುತ್ತಾರೆ.'
      }
    },
    {
      id: 'companypady',
      order: 5,
      coords: { lat: 10.0821, lng: 76.3401 },
      names: {
        ml: 'കമ്പനിപ്പടി',
        en: 'Companypady',
        hi: 'कंपनीपडी',
        ta: 'கம்பெனிப்படி',
        kn: 'ಕಂಪನಿಪಡಿ'
      },
      subnames: {
        ml: 'മോഡൽ സ്കൂൾ റോഡ്',
        en: 'Model School Road & Metro',
        hi: 'मॉडल स्कूल रोड',
        ta: 'மாடல் பள்ளி சாலை',
        kn: 'ಮಾದರಿ ಶಾಲೆ ರಸ್ತೆ'
      },
      distanceFromOriginKm: 13.5,
      scheduledTime: '09:40 AM',
      landmarks: [
        { icon: 'school', label: 'Model High School' },
        { icon: 'mosque', label: 'Central Masjid' },
        { icon: 'directions_subway', label: 'Companypady Metro' }
      ],
      walkingFromUser: {
        meters: 9800,
        walkingMinutes: 120
      },
      tips: {
        ml: 'ഇറങ്ങാൻ തയ്യാറാകുക (അടുത്തത് അവസാന സ്റ്റോപ്പ്).',
        en: 'Prepare to alight (Terminal stop is next).',
        hi: 'उतरने के लिए तैयार रहें (अगला अंतिम स्टॉप है)।',
        ta: 'இறங்கத் தயாராகுங்கள் (அடுத்து கடைசி நிறுத்தம்).',
        kn: 'ಇಳಿಯಲು ಸಿದ್ಧರಾಗಿ (ಮುಂದಿನದು ಕೊನೆಯ ನಿಲ್ದಾಣ).'
      }
    },
    {
      id: 'aluva',
      order: 6,
      coords: { lat: 10.1118, lng: 76.3533 },
      names: {
        ml: 'ആലുവ ബസ് സ്റ്റാൻഡ്',
        en: 'Aluva Bus Stand & Metro',
        hi: 'अलुवा बस स्टैंड',
        ta: 'ஆலுவா பேருந்து நிலையம்',
        kn: 'ಆಲುವಾ ಬಸ್ ನಿಲ್ದಾಣ'
      },
      subnames: {
        ml: 'റെയിൽവേ സ്റ്റേഷൻ & മണപ്പുറം',
        en: 'Railway Station & Periyar Ghat',
        hi: 'रेलवे स्टेशन और पेरियार घाट',
        ta: 'ரயில் நிலையம் & பெரியாறு படித்துறை',
        kn: 'ರೈಲ್ವೆ ನಿಲ್ದಾಣ ಮತ್ತು ಪೆರಿಯಾರ್ ಘಾಟ್'
      },
      distanceFromOriginKm: 15.0,
      scheduledTime: '09:45 AM',
      landmarks: [
        { icon: 'train', label: 'Aluva Railway Station (Walk 200m)' },
        { icon: 'water', label: 'Periyar River Ghat / Manappuram' },
        { icon: 'directions_subway', label: 'Aluva Metro Terminal' }
      ],
      walkingFromUser: {
        meters: 15000,
        walkingMinutes: 180
      },
      tips: {
        ml: 'ലഗേജുകൾ പരിശോധിച്ച് ഇടതുവശത്തുകൂടി ഇറങ്ങുക.',
        en: 'Check your baggage and alight from the left door.',
        hi: 'अपना सामान जांचें और बाएं दरवाजे से उतरें।',
        ta: 'உங்கள் சாமான்களைச் சரிபார்த்து இடது கதவு வழியாக இறங்கவும்.',
        kn: 'ನಿಮ್ಮ ಲಗೇಜ್ ಪರಿಶೀಲಿಸಿ ಎಡ ಬಾಗಿಲಿನಿಂದ ಇಳಿಯಿರಿ.'
      }
    }
  ]
};

// All known transit stops in the network for search, autocomplete, and nearby exploration
export const ALL_NETWORK_STOPS = [
  ...DEMO_CORRIDOR.stops,
  {
    id: 'vytilla_hub',
    order: 99,
    coords: { lat: 9.9672, lng: 76.3195 },
    names: {
      ml: 'വൈറ്റില മൊബിലിറ്റി ഹബ്ബ്',
      en: 'Vytilla Mobility Hub',
      hi: 'वाइटिला मोबिलिटी हब',
      ta: 'வைட்டிலா மொபிலிட்டி ஹப்',
      kn: 'ವೈಟಿಲಾ ಮೊಬಿಲಿಟಿ ಹಬ್'
    },
    subnames: {
      ml: 'ഇൻ്റഗ്രേറ്റഡ് ട്രാൻസിറ്റ് ഹബ്ബ്',
      en: 'Integrated Transit & Water Metro Hub',
      hi: 'एकीकृत पारगमन केंद्र',
      ta: 'ஒருங்கிணைந்த போக்குவரத்து மையம்',
      kn: 'ಸಂಯೋಜಿತ ಸಾರಿಗೆ ಕೇಂದ್ರ'
    },
    distanceFromOriginKm: 5.8,
    walkingFromUser: { meters: 2400, walkingMinutes: 28 },
    landmarks: [{ icon: 'hub', label: 'Water Metro & KSRTC Hub' }]
  },
  {
    id: 'palarivattom',
    order: 99,
    coords: { lat: 10.0076, lng: 76.3075 },
    names: {
      ml: 'പാലാരിവട്ടം ജംഗ്ഷൻ',
      en: 'Palarivattom Junction',
      hi: 'पालारिवट्टम जंक्शन',
      ta: 'பாலாரிவட்டம் சந்திப்பு',
      kn: 'ಪಾಲಾರಿವಟ್ಟಂ ಜಂಕ್ಷನ್'
    },
    subnames: {
      ml: 'ബൈപാസ് ജംഗ്ഷൻ',
      en: 'Bypass Junction & Flyover',
      hi: 'बाईपास जंक्शन',
      ta: 'பைபாஸ் சந்திப்பு',
      kn: 'ಬೈಪಾಸ್ ಜಂಕ್ಷನ್'
    },
    distanceFromOriginKm: 6.2,
    walkingFromUser: { meters: 3100, walkingMinutes: 38 },
    landmarks: [{ icon: 'alt_route', label: 'Civil Station Road' }]
  },
  {
    id: 'angamaly',
    order: 99,
    coords: { lat: 10.1873, lng: 76.3869 },
    names: {
      ml: 'അങ്കമാലി കെ.എസ്.ആർ.ടി.സി',
      en: 'Angamaly KSRTC',
      hi: 'अंगमाली केएसआरटीसी',
      ta: 'அங்கமாலி கே.எஸ்.ஆர்.டி.சி',
      kn: 'ಅಂಗಮಾಲಿ ಕೆ.ಎಸ್.ಆರ್.ಟಿ.ಸಿ'
    },
    subnames: {
      ml: 'എയർപോർട്ട് ലിങ്ക് സ്റ്റേഷൻ',
      en: 'Airport Link Station',
      hi: 'हवाई अड्डा लिंक स्टेशन',
      ta: 'விமான நிலைய இணைப்பு நிலையம்',
      kn: 'ವಿಮಾನ ನಿಲ್ದಾಣ ಲಿಂಕ್ ನಿಲ್ದಾಣ'
    },
    distanceFromOriginKm: 27.0,
    walkingFromUser: { meters: 27000, walkingMinutes: 320 },
    landmarks: [{ icon: 'flight', label: 'Cochin Intl Airport Link' }]
  }
];

/**
 * Natural language transit query pre-processor
 * Extracts origin and destination from conversational input.
 */
export function extractTransitEntities(text) {
  if (!text) return { origin: null, destination: null };
  const raw = text.trim();
  const lower = raw.toLowerCase();

  // Pattern: "X to Y" or "X ➔ Y"
  if (lower.includes(' to ')) {
    const parts = raw.split(/ to /i);
    return { origin: parts[0].trim(), destination: parts[1].trim() };
  }
  // Malayalam pattern: "X-ൽ നിന്ന് Y" or "X ൽ നിന്ന് Y"
  if (raw.includes('ൽ നിന്ന്') || raw.includes('ൽനിന്ന്')) {
    const parts = raw.split(/ൽ നിന്ന്|ൽനിന്ന്/);
    return { origin: parts[0].trim(), destination: parts[1].trim() };
  }
  if (raw.includes('നിന്ന്') || raw.includes('തൊട്ട്')) {
    const parts = raw.split(/നിന്ന്|തൊട്ട്/);
    return { origin: parts[0].trim(), destination: parts[1].trim() };
  }
  // Hindi pattern: "X से Y"
  if (raw.includes(' से ')) {
    const parts = raw.split(/ से /);
    return { origin: parts[0].trim(), destination: parts[1].trim() };
  }

  // Destination intent pattern: "Aluva pokanam", "എനിക്ക് ആലുവ പോകണം", "अलुवा जाना है"
  let cleanDest = raw
    .replace(/എനിക്ക്|പോകണം|പോവണം|വേണം|എത്തണം/g, '')
    .replace(/take me to|i want to go to|travel to|going to/gi, '')
    .replace(/मुझे|जाना है|पहुँचना है/g, '')
    .replace(/நான்|செல்ல வேண்டும்|போக வேண்டும்/g, '')
    .replace(/ನಾನು|ಹೋಗಬೇಕು|ತಲುಪಬೇಕು/g, '')
    .trim();

  return { origin: 'ernakulam_south', destination: cleanDest || raw };
}

/**
 * Deterministic Route Engine
 * Evaluates origin and destination using the verified transit model.
 */
export function calculateRoute(originQuery, destinationQuery) {
  const normOrigin = (originQuery || '').trim().toLowerCase();
  const normDest = (destinationQuery || '').trim().toLowerCase();

  // Check for ambiguous generic queries first
  if (normDest === 'ernakulam' || normDest === 'എറണാകുളം' || normDest === 'cochin' || normDest === 'kochi') {
    return {
      status: 'ambiguous',
      query: destinationQuery,
      suggestions: [
        { label: 'Ernakulam South (Central Bus & Railway)', stopId: 'ernakulam_south' },
        { label: 'Kaloor Junction (JLN Stadium & Metro)', stopId: 'kaloor' },
        { label: 'Edappally Toll (LuLu Mall)', stopId: 'edappally' }
      ],
      message: 'Multiple transit stations match your request. Please select your exact boarding or destination point.'
    };
  }

  // Helper matcher
  const matchStop = (q) => {
    if (!q) return null;
    return ALL_NETWORK_STOPS.find(s => {
      if (s.id.toLowerCase() === q) return true;
      if (Object.values(s.names).some(n => n.toLowerCase() === q)) return true;
      if (s.id.toLowerCase().includes(q)) return true;
      return Object.values(s.names).some(n => n.toLowerCase().includes(q));
    });
  };

  const originStop = matchStop(normOrigin) || DEMO_CORRIDOR.stops[0];
  const destStop = matchStop(normDest);

  if (!destStop) {
    return {
      status: 'not_found',
      query: destinationQuery,
      message: `We couldn't find verified transit stops for "${destinationQuery}".`,
      suggestedFallback: 'Aluva',
      suggestions: [
        { label: 'Aluva (ആലുവ)', stopId: 'aluva' },
        { label: 'Kaloor (കലൂർ)', stopId: 'kaloor' },
        { label: 'Edappally (ഇടപ്പള്ളി)', stopId: 'edappally' }
      ]
    };
  }

  // Ensure origin and destination are distinct
  if (originStop.id === destStop.id) {
    return {
      status: 'same_location',
      message: 'Boarding and destination stop cannot be the same.'
    };
  }

  const startIndex = DEMO_CORRIDOR.stops.findIndex(s => s.id === originStop.id);
  const endIndex = DEMO_CORRIDOR.stops.findIndex(s => s.id === destStop.id);

  let routeStops = [];
  if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
    routeStops = DEMO_CORRIDOR.stops.slice(startIndex, endIndex + 1);
  } else {
    // Synthetic route for demo corridor
    routeStops = DEMO_CORRIDOR.stops;
  }

  const distance = +(routeStops[routeStops.length - 1].distanceFromOriginKm - routeStops[0].distanceFromOriginKm).toFixed(1);
  const stages = Math.max(1, Math.min(4, Math.ceil(distance / 3.8)));
  const estimatedFare = stages * 10;
  const estimatedMin = Math.round(distance * 3);

  return {
    status: 'success',
    route: DEMO_CORRIDOR,
    origin: routeStops[0],
    destination: routeStops[routeStops.length - 1],
    routeStops: routeStops,
    distanceKm: distance,
    estimatedMinutes: estimatedMin,
    fareStages: stages,
    estimatedFareInr: estimatedFare,
    isDemoCorridor: true,
    serviceClass: DEMO_CORRIDOR.serviceType,
    vehicleNumber: DEMO_CORRIDOR.vehicleNumber,
    fareDisclaimer: DEMO_CORRIDOR.fareDisclaimer
  };
}
