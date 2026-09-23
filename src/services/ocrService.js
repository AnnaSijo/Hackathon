/**
 * ANAVANDI CONNECT - RouteLens OCR Scanner Service
 * Handles camera viewfinder, image OCR animation, language detection,
 * translation, fuzzy stop matching, sample boards, and low-confidence recovery.
 */

import { DEMO_CORRIDOR, ALL_NETWORK_STOPS } from '../data/transitData.js';

export const SAMPLE_BUS_BOARDS = [
  {
    id: 'aluva_clear',
    title: 'Aluva Fast Passenger (Clear)',
    malayalam: 'ആലുവ',
    english: 'ALUVA',
    route: 'ROUTE 42',
    busClass: 'Fast Passenger',
    confidence: 96,
    isLowConfidence: false,
    matchedStopId: 'aluva',
    description: 'Crisp bilingual front destination board on KSRTC Fast Passenger.'
  },
  {
    id: 'aluva_blurry',
    title: 'Aluva Rainy / Low Light (Blurry)',
    malayalam: 'ആലുവ...?',
    english: 'ALUV...?',
    route: 'ROUTE ??',
    busClass: 'Ordinary / Fast',
    confidence: 42,
    isLowConfidence: true,
    matchedStopId: 'aluva',
    description: 'Rain-streaked bus board requiring passenger confirmation.',
    alternatives: [
      { name: 'Aluva Bus Stand (ആലുവ)', id: 'aluva' },
      { name: 'Alwaye Market (ആലുവ മാർക്കറ്റ്)', id: 'aluva' },
      { name: 'Aluva Railway Station (ആലുവ റെയിൽവേ)', id: 'aluva' }
    ]
  },
  {
    id: 'kottayam_sf',
    title: 'Kottayam Super Fast',
    malayalam: 'കോട്ടയം',
    english: 'KOTTAYAM',
    route: 'ROUTE 18',
    busClass: 'Super Fast',
    confidence: 94,
    isLowConfidence: false,
    matchedStopId: 'aluva', // maps to corridor for demo
    description: 'Red and silver express bus board.'
  },
  {
    id: 'thrissur_fp',
    title: 'Thrissur Fast Passenger',
    malayalam: 'തൃശ്ശൂർ',
    english: 'THRISSUR',
    route: 'ROUTE 33',
    busClass: 'Fast Passenger',
    confidence: 95,
    isLowConfidence: false,
    matchedStopId: 'aluva',
    description: 'Northern corridor service board.'
  },
  {
    id: 'highway_sign_dwarka',
    title: 'Highway Sign (Dwarka, Dhaula Kuan, Vasant Vihar, Domestic Airport)',
    malayalam: 'ദ്വാരക • ധൗലാ കുവാൻ • വസന്ത് വിഹാർ',
    english: 'DWARKA / DHAULA KUAN / VASANT VIHAR / DOMESTIC',
    route: 'EXIT 22 (700m)',
    busClass: 'Expressway Direction Sign',
    confidence: 98,
    isLowConfidence: false,
    matchedStopId: 'aluva',
    description: 'Bilingual Highway Overhead Sign Translated to Malayalam Script',
    multiTranslations: [
      { english: 'Dwarka (द्वारका)', malayalam: 'ദ്വാരക', info: 'Exit Left ➔' },
      { english: 'Domestic Airport (अन्तरराज्यीय)', malayalam: 'ഡൊമസ്റ്റിക് വിമാനത്താവളം', info: 'Airport Terminal ✈' },
      { english: 'Dhaula Kuan (धौला कुआँ)', malayalam: 'ധൗലാ കുവാൻ', info: 'Straight ⬆' },
      { english: 'Vasant Vihar (वसन्त विहार)', malayalam: 'വസന്ത് വിഹാർ', info: 'Straight ⬆' },
      { english: 'Exit 22 (700m)', malayalam: 'എക്സിറ്റ് 22 (700 മീറ്റർ)', info: 'Distance 700m' }
    ]
  }
];

class RouteLensService {
  constructor() {
    this.mediaStream = null;
    this.isCameraActive = false;
  }

  /**
   * Request actual camera stream or graceful fallback to demo board
   */
  async requestCamera(videoElement) {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return { success: false, reason: 'MediaDevices not supported on this browser.' };
    }

    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      if (videoElement) {
        videoElement.srcObject = this.mediaStream;
        await videoElement.play();
        this.isCameraActive = true;
      }
      return { success: true };
    } catch (err) {
      console.warn('Camera access denied or unavailable:', err);
      return { success: false, reason: err.message || 'Camera permission denied' };
    }
  }

  stopCamera() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(t => t.stop());
      this.mediaStream = null;
      this.isCameraActive = false;
    }
  }

  /**
   * Step-by-step timed OCR scanning pipeline
   * Emits step updates: extracting -> detecting -> translating -> matching -> completed
   */
  runScanPipeline(boardData, onStep) {
    return new Promise((resolve) => {
      const data = boardData || SAMPLE_BUS_BOARDS[0];

      // Step 1: Extracting text
      if (onStep) onStep('extracting', { message: 'Extracting text from board...', pct: 25 });

      setTimeout(() => {
        // Step 2: Language detection
        if (onStep) onStep('detecting', { message: 'Malayalam script detected (മലയാളം)', pct: 50 });

        setTimeout(() => {
          // Step 3: Translating text
          if (onStep) onStep('translating', { message: `Translating: ${data.malayalam} ➔ ${data.english}`, pct: 75 });

          setTimeout(() => {
            // Step 4: Matching with transit stops
            if (onStep) onStep('matching', { message: 'Matching with verified transit stops...', pct: 90 });

            setTimeout(() => {
              // Final Step
              const finalResult = {
                status: data.isLowConfidence ? 'low_confidence' : 'success',
                confidence: data.confidence,
                lowConfidenceMode: data.isLowConfidence,
                detectedTextMalayalam: data.malayalam,
                detectedTextEnglish: data.english,
                busClass: data.busClass,
                routeNumber: data.route,
                matchedStop: DEMO_CORRIDOR.stops[DEMO_CORRIDOR.stops.length - 1],
                alternatives: data.alternatives || []
              };

              if (onStep) onStep(data.isLowConfidence ? 'low_confidence' : 'completed', finalResult);
              resolve(finalResult);
            }, 600);
          }, 600);
        }, 600);
      }, 700);
    });
  }
}

export const ocrService = new RouteLensService();
