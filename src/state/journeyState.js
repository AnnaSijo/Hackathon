/**
 * ANAVANDI CONNECT - Centralized Reactive State Store
 * Manages journey progress, persona modes, language, network conditions,
 * 12 application views, accessibility toggles, voice, OCR, and AI pipeline.
 */

import { DEMO_CORRIDOR, calculateRoute, ALL_NETWORK_STOPS } from '../data/transitData.js';
import { getTranslation } from '../i18n/translations.js';

class JourneyStateStore {
  constructor() {
    this.subscribers = new Set();

    // Load persisted settings if available
    const savedLang = this.loadLocal('anavandi_lang') || 'ml';
    const savedPersona = this.loadLocal('anavandi_persona') || 'adult';
    const savedA11y = this.loadLocalJson('anavandi_a11y') || {
      largeText: false,
      highContrast: false,
      reducedMotion: false,
      largeTargets: false,
      visualModeOnly: false
    };

    // Initial state
    this.state = {
      currentLanguage: savedLang, // 'ml' | 'en' | 'hi' | 'ta' | 'kn'
      currentPersona: savedPersona, // 'adult' | 'senior' | 'child'
      networkStatus: 'online', // 'online' | 'weak' | 'offline'
      activeTab: 'home', // 'home'|'plan'|'voice'|'routelens'|'journey'|'map'|'nearby'|'my-journey'|'accessibility'|'privacy'|'help'|'settings'
      journeyViewTab: 'visual', // 'visual' | 'map'
      
      // Accessibility configuration
      accessibility: savedA11y,

      // Active route and live tracking
      journey: {
        route: DEMO_CORRIDOR,
        origin: DEMO_CORRIDOR.stops[0],
        destination: DEMO_CORRIDOR.stops[DEMO_CORRIDOR.stops.length - 1],
        routeStops: DEMO_CORRIDOR.stops,
        currentStopIndex: 3, // Kalamassery (Arriving Now in default demo)
        remainingDistanceKm: 7.6,
        nextStopTimerMin: 4,
        isSimulating: false,
        isCompleted: false,
        totalDistanceKm: 15.0,
        fareStages: 4,
        estimatedFareInr: 40,
        alarmArmed: true,
        isVisualMode: false
      },

      // Intermediate Understanding State (for Plan Journey)
      intermediateUnderstanding: {
        visible: false,
        origin: 'Ernakulam South',
        destination: 'Aluva',
        language: 'ml',
        intent: 'Plan Journey',
        confidence: 98,
        isConfirmed: false
      },

      // RouteLens OCR Scanner state
      ocr: {
        isScanning: false,
        step: 'idle', // 'idle'|'uploading'|'extracting'|'detecting'|'translating'|'matching'|'completed'|'low_confidence'
        confidence: 96,
        lowConfidenceMode: false,
        selectedSampleIndex: 0,
        uploadedImageSrc: null,
        detectedTextMalayalam: 'ആലുവ',
        detectedTextEnglish: 'ALUVA',
        matchedStop: DEMO_CORRIDOR.stops[DEMO_CORRIDOR.stops.length - 1],
        isFlashlightOn: false,
        alternativeSuggestions: [
          { name: 'Aluva (ആലുവ)', id: 'aluva' },
          { name: 'Alwaye Market (ആലുവ മാർക്കറ്റ്)', id: 'aluva' },
          { name: 'Aluva Railway Station (ആലുവ റെയിൽവേ)', id: 'aluva' }
        ]
      },

      // Voice assistant state
      voice: {
        isListening: false,
        waveformActive: false,
        transcript: '',
        detectedLanguage: 'ml',
        recognizedDestination: 'Aluva',
        isConfirmed: false,
        isMuted: false,
        isSpeaking: false,
        audioGuidanceOn: true,
        lastSpokenMessage: ''
      },

      // Passenger Location State
      location: {
        hasPermission: true,
        isMock: true,
        coords: { lat: 9.9674, lng: 76.2941 }, // Ernakulam South
        nearestStop: DEMO_CORRIDOR.stops[0],
        walkingDistanceMeters: 350,
        walkingMinutes: 4
      },

      // Recent journeys stored locally
      recentJourneys: this.loadLocalJson('anavandi_recents') || [
        {
          id: 'rj-1',
          origin: 'Ernakulam South',
          destination: 'Aluva',
          time: 'Today, 08:30 AM',
          fare: '₹40'
        },
        {
          id: 'rj-2',
          origin: 'Kaloor',
          destination: 'Kalamassery',
          time: 'Yesterday',
          fare: '₹20'
        }
      ],

      // Explainable AI drawer state & pipeline
      aiExplainerOpen: false,
      aiPipeline: {
        userRequest: 'എനിക്ക് ആലുവ പോകണം',
        detectedLanguage: 'ml',
        languageLabel: 'മലയാളം (Malayalam)',
        intentUnderstood: 'plan_journey (യാത്രാ ആസൂത്രണം)',
        origin: 'Ernakulam South (Central KSRTC Depot)',
        destination: 'Aluva Bus Terminus & Metro',
        verifiedRoute: 'Route 42 Fast Passenger (15.0 km)',
        fareCalculation: '4 Fare Stages — ₹40 Estimated Demo Fare',
        source: 'local_deterministic_engine',
        confidence: 98,
        explanation: 'Extracted passenger transit intent for Aluva destination using natural language parsing.'
      },
      isAiProcessing: false
    };

    this.simulationTimer = null;
  }

  loadLocal(key) {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch (e) {}
    return null;
  }

  loadLocalJson(key) {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      }
    } catch (e) {}
    return null;
  }

  saveLocal(key, val) {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, typeof val === 'string' ? val : JSON.stringify(val));
      }
    } catch (e) {}
  }

  getState() {
    return this.state;
  }

  subscribe(listener) {
    this.subscribers.add(listener);
    return () => this.subscribers.delete(listener);
  }

  notify() {
    for (const listener of this.subscribers) {
      try {
        listener(this.state);
      } catch (err) {
        console.error('State subscriber error:', err);
      }
    }
  }

  setLanguage(langCode) {
    if (this.state.currentLanguage !== langCode) {
      this.state.currentLanguage = langCode;
      this.saveLocal('anavandi_lang', langCode);
      this.notify();
    }
  }

  setPersona(persona) {
    if (this.state.currentPersona !== persona) {
      this.state.currentPersona = persona;
      this.saveLocal('anavandi_persona', persona);

      // Auto-tune accessibility defaults based on persona
      if (persona === 'senior') {
        this.state.accessibility.largeText = true;
        this.state.accessibility.largeTargets = true;
        this.state.accessibility.highContrast = true;
      } else if (persona === 'child') {
        this.state.accessibility.largeText = false;
        this.state.accessibility.largeTargets = true;
        this.state.accessibility.highContrast = false;
      } else {
        this.state.accessibility.largeText = false;
        this.state.accessibility.largeTargets = false;
        this.state.accessibility.highContrast = false;
      }
      this.saveLocal('anavandi_a11y', this.state.accessibility);
      this.notify();
    }
  }

  toggleAccessibility(key) {
    if (key in this.state.accessibility) {
      this.state.accessibility[key] = !this.state.accessibility[key];
      this.saveLocal('anavandi_a11y', this.state.accessibility);
      this.notify();
    }
  }

  setAccessibility(key, value) {
    if (key in this.state.accessibility) {
      this.state.accessibility[key] = !!value;
      this.saveLocal('anavandi_a11y', this.state.accessibility);
      this.notify();
    }
  }

  setNetworkStatus(status) {
    this.state.networkStatus = status;
    this.notify();
  }

  setActiveTab(tab) {
    // Normalise route aliases
    const aliases = {
      '': 'home',
      '/': 'home',
      'plan-journey': 'plan',
      'scan': 'routelens',
      'myjourney': 'my-journey',
      'modes': 'accessibility'
    };
    const cleanTab = aliases[tab] || tab;
    this.state.activeTab = cleanTab;
    this.notify();
  }

  setJourneyViewTab(viewTab) {
    this.state.journeyViewTab = viewTab;
    this.notify();
  }

  toggleVisualMode() {
    this.state.journey.isVisualMode = !this.state.journey.isVisualMode;
    this.state.accessibility.visualModeOnly = this.state.journey.isVisualMode;
    this.notify();
  }

  setVisualMode(enabled) {
    this.state.journey.isVisualMode = !!enabled;
    this.state.accessibility.visualModeOnly = !!enabled;
    this.notify();
  }

  setRoute(originQuery, destinationQuery) {
    const result = calculateRoute(originQuery, destinationQuery);
    if (result.status === 'success') {
      this.state.journey = {
        ...this.state.journey,
        route: result.route,
        origin: result.origin,
        destination: result.destination,
        routeStops: result.routeStops,
        currentStopIndex: 0,
        remainingDistanceKm: result.distanceKm,
        nextStopTimerMin: 3,
        isCompleted: false,
        totalDistanceKm: result.distanceKm,
        fareStages: result.fareStages,
        estimatedFareInr: result.estimatedFareInr
      };

      // Add to recent journeys
      this.addRecentJourney({
        id: `rj-${Date.now()}`,
        origin: result.origin.names.en,
        destination: result.destination.names.en,
        time: 'Just now',
        fare: `₹${result.estimatedFareInr}`
      });

      this.notify();
      return result;
    }
    return result;
  }

  setIntermediateUnderstanding(data) {
    this.state.intermediateUnderstanding = {
      ...this.state.intermediateUnderstanding,
      ...data
    };
    this.notify();
  }

  confirmIntermediateUnderstanding() {
    const { origin, destination } = this.state.intermediateUnderstanding;
    this.state.intermediateUnderstanding.isConfirmed = true;
    this.setRoute(origin, destination);
    this.setActiveTab('journey');
  }

  startLiveSimulation() {
    if (this.simulationTimer) clearInterval(this.simulationTimer);
    this.state.journey.isSimulating = true;
    this.state.journey.isCompleted = false;
    this.notify();

    this.simulationTimer = setInterval(() => {
      const j = this.state.journey;
      if (j.remainingDistanceKm > 0.5) {
        j.remainingDistanceKm = +(j.remainingDistanceKm - 1.2).toFixed(1);
        
        // Progress stops based on remaining distance
        const total = j.totalDistanceKm || 15.0;
        const progressPct = 1 - (j.remainingDistanceKm / total);
        const stopsCount = j.routeStops.length;
        const targetStopIndex = Math.min(stopsCount - 2, Math.floor(progressPct * stopsCount));
        
        if (targetStopIndex > j.currentStopIndex) {
          j.currentStopIndex = targetStopIndex;
          j.nextStopTimerMin = Math.max(1, Math.round(j.remainingDistanceKm * 2.2));
        }

        if (j.remainingDistanceKm <= 0.5) {
          j.remainingDistanceKm = 0.0;
          j.currentStopIndex = j.routeStops.length - 1;
          j.isCompleted = true;
          j.isSimulating = false;
          clearInterval(this.simulationTimer);
        }
        this.notify();
      } else {
        j.remainingDistanceKm = 0.0;
        j.currentStopIndex = j.routeStops.length - 1;
        j.isCompleted = true;
        j.isSimulating = false;
        clearInterval(this.simulationTimer);
        this.notify();
      }
    }, 2000);
  }

  stopLiveSimulation() {
    if (this.simulationTimer) {
      clearInterval(this.simulationTimer);
      this.simulationTimer = null;
    }
    this.state.journey.isSimulating = false;
    this.notify();
  }

  resetJourney() {
    this.stopLiveSimulation();
    const j = this.state.journey;
    j.currentStopIndex = 0;
    j.remainingDistanceKm = j.totalDistanceKm;
    j.nextStopTimerMin = 4;
    j.isCompleted = false;
    this.notify();
  }

  advanceToStop(index) {
    const stops = this.state.journey.routeStops;
    if (index >= 0 && index < stops.length) {
      this.state.journey.currentStopIndex = index;
      const targetDist = +(stops[stops.length - 1].distanceFromOriginKm - stops[index].distanceFromOriginKm).toFixed(1);
      this.state.journey.remainingDistanceKm = targetDist;
      this.state.journey.isCompleted = (index === stops.length - 1);
      this.state.journey.nextStopTimerMin = index === stops.length - 1 ? 0 : Math.max(1, Math.round(targetDist * 2.2));
      this.notify();
    }
  }

  toggleMute() {
    this.state.voice.isMuted = !this.state.voice.isMuted;
    this.notify();
  }

  toggleAudioGuidance() {
    this.state.voice.audioGuidanceOn = !this.state.voice.audioGuidanceOn;
    this.notify();
  }

  setVoiceListening(isListening, transcript = '') {
    this.state.voice.isListening = isListening;
    this.state.voice.waveformActive = isListening;
    if (transcript) this.state.voice.transcript = transcript;
    this.notify();
  }

  setOcrStep(step, data = {}) {
    this.state.ocr.step = step;
    this.state.ocr = { ...this.state.ocr, ...data };
    this.notify();
  }

  setOcrConfidence(confidence, lowConfidence = false) {
    this.state.ocr.confidence = confidence;
    this.state.ocr.lowConfidenceMode = lowConfidence;
    this.notify();
  }

  toggleFlashlight() {
    this.state.ocr.isFlashlightOn = !this.state.ocr.isFlashlightOn;
    this.notify();
  }

  toggleAiExplainer() {
    this.state.aiExplainerOpen = !this.state.aiExplainerOpen;
    this.notify();
  }

  setAiExplainer(open) {
    this.state.aiExplainerOpen = !!open;
    this.notify();
  }

  setAiPipeline(data) {
    this.state.aiPipeline = {
      ...this.state.aiPipeline,
      ...data
    };
    this.notify();
  }

  addRecentJourney(item) {
    const list = [item, ...this.state.recentJourneys.filter(j => j.destination !== item.destination)].slice(0, 5);
    this.state.recentJourneys = list;
    this.saveLocal('anavandi_recents', list);
    this.notify();
  }

  clearAllDataAndCache() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem('anavandi_recents');
        window.localStorage.removeItem('anavandi_a11y');
        window.localStorage.removeItem('anavandi_lang');
        window.localStorage.removeItem('anavandi_persona');
      }
    } catch (e) {}
    this.state.recentJourneys = [];
    this.state.accessibility = {
      largeText: false,
      highContrast: false,
      reducedMotion: false,
      largeTargets: false,
      visualModeOnly: false
    };
    this.notify();
  }

  t(key) {
    return getTranslation(this.state.currentLanguage, key);
  }
}

export const journeyStore = new JourneyStateStore();
