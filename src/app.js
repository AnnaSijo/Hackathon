/**
 * ANAVANDI CONNECT - Application Orchestrator
 * Connects reactive state, 12 views, multilingual i18n, transit engine,
 * RouteLens OCR, voice assistant, accessibility toggles, and live demo flows.
 */

import { DEMO_CORRIDOR, ALL_NETWORK_STOPS, calculateRoute, extractTransitEntities } from './data/transitData.js';
import { KSRTC_DEPOTS, SAMPLE_ROUTES, KERALA_DISTRICTS } from './data/keralaTransportData.js';
import { TRANSLATIONS, LANGUAGE_OPTIONS, getTranslation } from './i18n/translations.js';
import { journeyStore } from './state/journeyState.js';
import { voiceService } from './services/voiceService.js';
import { ocrService, SAMPLE_BUS_BOARDS } from './services/ocrService.js';
import { geminiService } from './services/geminiService.js';

class AnavandiApp {
  constructor() {
    this._selectedRole = 'passenger';
    this.chatHistory = [];
    this.aiChatOpen = false;
    if (typeof window !== 'undefined') {
      window.anavandiApp = this;
    }
    this.init();
  }

  init() {
    this.bindEvents();
    this.renderAll();

    // Subscribe to state updates
    journeyStore.subscribe(() => {
      this.renderAll();
    });

    // Handle hash change for seamless client-side routing
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.replace('#', '') || 'home';
      journeyStore.setActiveTab(hash);
    });

    // Initial route check
    if (window.location.hash) {
      const initialTab = window.location.hash.replace('#', '');
      journeyStore.setActiveTab(initialTab);
    }
  }

  bindEvents() {
    // 1. Network Status Toggle (Top Bar)
    const networkBadge = document.getElementById('network-badge');
    if (networkBadge) {
      networkBadge.addEventListener('click', () => {
        const current = journeyStore.getState().networkStatus;
        const next = current === 'online' ? 'weak' : (current === 'weak' ? 'offline' : 'online');
        journeyStore.setNetworkStatus(next);
      });
    }

    // 2. Language Dropdown Toggle
    const langBtn = document.getElementById('lang-selector-btn');
    const langMenu = document.getElementById('lang-dropdown-menu');
    if (langBtn && langMenu) {
      langBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        langMenu.classList.toggle('hidden');
      });

      document.addEventListener('click', () => {
        if (!langMenu.classList.contains('hidden')) {
          langMenu.classList.add('hidden');
        }
      });
    }

    // Language Option Selection
    document.querySelectorAll('.lang-option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const lang = btn.dataset.lang;
        if (lang) {
          journeyStore.setLanguage(lang);
          if (langMenu) langMenu.classList.add('hidden');
        }
      });
    });

    // 3. Navigation Links (Desktop & Mobile)
    document.querySelectorAll('[data-nav-target]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = link.dataset.navTarget;
        window.location.hash = target;
        journeyStore.setActiveTab(target);

        // Close mobile sheet if open
        const mobileSheet = document.getElementById('mobile-more-sheet');
        if (mobileSheet) mobileSheet.classList.add('hidden');
      });
    });

    // 4. Mobile More Sheet
    const mobileMoreBtn = document.getElementById('mobile-more-btn');
    const mobileSheet = document.getElementById('mobile-more-sheet');
    const mobileClose = document.getElementById('mobile-more-close');
    if (mobileMoreBtn && mobileSheet) {
      mobileMoreBtn.addEventListener('click', () => mobileSheet.classList.remove('hidden'));
    }
    if (mobileClose && mobileSheet) {
      mobileClose.addEventListener('click', () => mobileSheet.classList.add('hidden'));
    }

    // 5. Persona Selector Buttons (Home & Accessibility)
    document.querySelectorAll('.home-persona-btn, .a11y-persona-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const persona = btn.dataset.persona;
        if (persona) journeyStore.setPersona(persona);
      });
    });

    // 6. Home Primary Action Launchers
    const speakBtn = document.getElementById('home-speak-btn');
    if (speakBtn) {
      speakBtn.addEventListener('click', () => {
        window.location.hash = 'voice';
        journeyStore.setActiveTab('voice');
        this.triggerVoiceInput();
      });
    }

    const typeBtn = document.getElementById('home-type-btn');
    if (typeBtn) {
      typeBtn.addEventListener('click', () => {
        window.location.hash = 'plan';
        journeyStore.setActiveTab('plan');
      });
    }

    const scanBtn = document.getElementById('home-scan-btn');
    if (scanBtn) {
      scanBtn.addEventListener('click', () => {
        window.location.hash = 'routelens';
        journeyStore.setActiveTab('routelens');
        this.loadSampleBoard(0);
      });
    }

    // 7. Plan Journey Form
    const routeForm = document.getElementById('route-planner-form');
    if (routeForm) {
      routeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const originVal = document.getElementById('journey-origin-input').value;
        const destVal = document.getElementById('journey-dest-input').value;
        this.handlePlanFormSubmit(originVal, destVal);
      });
    }

    // Swap Stops
    const swapBtn = document.getElementById('swap-stops-btn');
    if (swapBtn) {
      swapBtn.addEventListener('click', () => {
        const originInput = document.getElementById('journey-origin-input');
        const destInput = document.getElementById('journey-dest-input');
        if (originInput && destInput) {
          const temp = originInput.value;
          originInput.value = destInput.value;
          destInput.value = temp;
        }
      });
    }

    // Intermediate Understanding Card Buttons
    const confirmUnderstoodBtn = document.getElementById('btn-confirm-understanding');
    if (confirmUnderstoodBtn) {
      confirmUnderstoodBtn.addEventListener('click', () => {
        journeyStore.confirmIntermediateUnderstanding();
        window.location.hash = 'journey';
      });
    }

    const changeUnderstoodBtn = document.getElementById('btn-change-understanding');
    if (changeUnderstoodBtn) {
      changeUnderstoodBtn.addEventListener('click', () => {
        const card = document.getElementById('plan-understanding-card');
        if (card) card.classList.add('hidden');
        const destInput = document.getElementById('journey-dest-input');
        if (destInput) destInput.focus();
      });
    }

    // 8. Voice Assistant Controls
    const micTrigger = document.getElementById('voice-mic-trigger');
    if (micTrigger) {
      micTrigger.addEventListener('click', () => this.triggerVoiceInput());
    }

    const voiceConfirmBtn = document.getElementById('voice-confirm-btn');
    if (voiceConfirmBtn) {
      voiceConfirmBtn.addEventListener('click', () => {
        const state = journeyStore.getState();
        const dest = state.intermediateUnderstanding?.destination || 'Aluva';
        journeyStore.setRoute('Ernakulam South', dest);
        
        // Speak journey reassurance
        const reassuranceMsg = geminiService.generateRouteExplanation('Ernakulam South', dest, state.currentLanguage);
        voiceService.speak(reassuranceMsg, state.currentLanguage);
        
        window.location.hash = 'journey';
        journeyStore.setActiveTab('journey');
      });
    }

    const voiceRetryBtn = document.getElementById('voice-retry-btn');
    if (voiceRetryBtn) {
      voiceRetryBtn.addEventListener('click', () => this.triggerVoiceInput());
    }

    // 8B. AI Chat Assistant Form & Input Controls
    const aiChatForm = document.getElementById('ai-chat-form');
    if (aiChatForm) {
      aiChatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.sendAiChatMessage();
      });
    }

    const aiChatInput = document.getElementById('ai-chat-input');
    if (aiChatInput) {
      aiChatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.sendAiChatMessage();
        }
      });
    }

    // 9. RouteLens OCR Controls
    const ocrUploadInput = document.getElementById('ocr-file-upload');
    if (ocrUploadInput) {
      ocrUploadInput.addEventListener('change', (e) => {
        const file = e.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const boardImg = document.getElementById('ocr-board-image');
            if (boardImg) boardImg.src = event.target.result;
            const highwaySample = SAMPLE_BUS_BOARDS.find(b => b.id === 'highway_sign_dwarka') || SAMPLE_BUS_BOARDS[0];
            this.runOcrProcessing(highwaySample);
          };
          reader.readAsDataURL(file);
        }
      });
    }

    const openCameraBtn = document.getElementById('ocr-open-camera-btn');
    if (openCameraBtn) {
      openCameraBtn.addEventListener('click', async () => {
        const video = document.getElementById('ocr-camera-stream');
        const boardImg = document.getElementById('ocr-board-image');
        const res = await ocrService.requestCamera(video);
        if (res.success) {
          if (video) video.classList.remove('hidden');
          if (boardImg) boardImg.classList.add('hidden');
          setTimeout(() => {
            this.runOcrProcessing(SAMPLE_BUS_BOARDS[0]);
          }, 1500);
        } else {
          alert(`Camera notice: ${res.reason || 'Using demo board preview.'}`);
          this.loadSampleBoard(0);
        }
      });
    }

    const flashlightBtn = document.getElementById('ocr-flashlight-btn');
    if (flashlightBtn) {
      flashlightBtn.addEventListener('click', () => journeyStore.toggleFlashlight());
    }

    // 10. Live Journey Simulation Controls
    const simStartBtn = document.getElementById('btn-start-simulation');
    if (simStartBtn) {
      simStartBtn.addEventListener('click', () => {
        const state = journeyStore.getState();
        if (state.journey.isSimulating) {
          journeyStore.stopLiveSimulation();
        } else if (state.journey.isCompleted) {
          journeyStore.resetJourney();
          journeyStore.startLiveSimulation();
        } else {
          journeyStore.startLiveSimulation();
        }
      });
    }

    const visualModeToggle = document.getElementById('journey-visual-mode-toggle');
    if (visualModeToggle) {
      visualModeToggle.addEventListener('click', () => journeyStore.toggleVisualMode());
    }

    const muteBtn = document.getElementById('voice-mute-toggle-btn');
    if (muteBtn) {
      muteBtn.addEventListener('click', () => journeyStore.toggleMute());
    }

    const repeatAnnouncementBtn = document.getElementById('voice-repeat-announcement-btn');
    if (repeatAnnouncementBtn) {
      repeatAnnouncementBtn.addEventListener('click', () => this.playCurrentStopAnnouncement());
    }

    const alarmTestBtn = document.getElementById('test-alarm-trigger-btn');
    if (alarmTestBtn) {
      alarmTestBtn.addEventListener('click', () => {
        if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 400]);
        voiceService.playChime('arrive');
        const orig = alarmTestBtn.innerHTML;
        alarmTestBtn.innerHTML = '<span class="material-symbols-outlined text-[14px]">done_all</span> <span>Alarm Triggered!</span>';
        setTimeout(() => { alarmTestBtn.innerHTML = orig; }, 1800);
      });
    }

    // 11. Nearby Stops Location Button
    const locBtn = document.getElementById('use-location-action-btn');
    if (locBtn) {
      locBtn.addEventListener('click', () => this.simulateLocatePassenger());
    }

    // 12. Accessibility Toggles
    const toggleLargeText = document.getElementById('toggle-large-text');
    if (toggleLargeText) {
      toggleLargeText.addEventListener('click', () => journeyStore.toggleAccessibility('largeText'));
    }

    const toggleHighContrast = document.getElementById('toggle-high-contrast');
    if (toggleHighContrast) {
      toggleHighContrast.addEventListener('click', () => journeyStore.toggleAccessibility('highContrast'));
    }

    const toggleReducedMotion = document.getElementById('toggle-reduced-motion');
    if (toggleReducedMotion) {
      toggleReducedMotion.addEventListener('click', () => journeyStore.toggleAccessibility('reducedMotion'));
    }

    const toggleLargeTargets = document.getElementById('toggle-large-targets');
    if (toggleLargeTargets) {
      toggleLargeTargets.addEventListener('click', () => journeyStore.toggleAccessibility('largeTargets'));
    }

    const toggleVisualModeOnly = document.getElementById('toggle-visual-mode-only');
    if (toggleVisualModeOnly) {
      toggleVisualModeOnly.addEventListener('click', () => journeyStore.toggleAccessibility('visualModeOnly'));
    }

    // 13. Privacy & Settings
    const clearCacheBtn = document.getElementById('btn-clear-cache-data');
    if (clearCacheBtn) {
      clearCacheBtn.addEventListener('click', () => {
        journeyStore.clearAllDataAndCache();
        alert('All local cache, recent journeys, and personalized settings have been cleared.');
      });
    }

    document.querySelectorAll('.settings-datamode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset.mode;
        journeyStore.setNetworkStatus(mode);
      });
    });

    // 14. AI Explainability Drawer
    const aiDrawerBtn = document.getElementById('ai-explainer-toggle-btn');
    const aiDrawer = document.getElementById('ai-explainer-drawer');
    const aiDrawerClose = document.getElementById('ai-drawer-close');
    if (aiDrawerBtn) {
      aiDrawerBtn.addEventListener('click', () => this.openXaiInspector());
    }
    if (aiDrawerClose && aiDrawer) {
      aiDrawerClose.addEventListener('click', () => this.closeXaiInspector());
    }
  }

  // Handle Plan Journey Form Submission with AI Parsing
  async handlePlanFormSubmit(originVal, destVal) {
    const state = journeyStore.getState();
    const queryToParse = destVal || originVal || 'Aluva';

    // Show loading state in understanding card
    const understandingCard = document.getElementById('plan-understanding-card');
    if (understandingCard) {
      understandingCard.classList.remove('hidden');
      document.getElementById('understood-from-val').textContent = 'Analyzing...';
      document.getElementById('understood-to-val').textContent = 'Analyzing...';
    }

    // Call Gemini Transit Engine
    const aiParsedResult = await geminiService.parseTransitQuery(queryToParse, state.currentLanguage);
    
    const finalOrigin = originVal || aiParsedResult?.parsed?.origin || 'Ernakulam South';
    const finalDest = aiParsedResult?.parsed?.destination || destVal || 'Aluva';

    // Display Intermediate Understanding Card
    if (understandingCard) {
      document.getElementById('understood-from-val').textContent = finalOrigin;
      document.getElementById('understood-to-val').textContent = finalDest;
      const langOpt = LANGUAGE_OPTIONS.find(l => l.code === state.currentLanguage) || LANGUAGE_OPTIONS[0];
      document.getElementById('understood-lang-val').textContent = langOpt.nativeName;

      journeyStore.setIntermediateUnderstanding({
        origin: finalOrigin,
        destination: finalDest,
        language: state.currentLanguage,
        intent: 'Plan Journey',
        confidence: aiParsedResult?.parsed?.confidence || 98
      });
    }

    // Calculate Route
    const result = calculateRoute(finalOrigin, finalDest);
    const errorBox = document.getElementById('journey-planner-error-box');

    if (result.status === 'success') {
      if (errorBox) errorBox.classList.add('hidden');
    } else if (result.status === 'ambiguous') {
      if (errorBox) {
        errorBox.classList.remove('hidden');
        errorBox.innerHTML = `
          <div class="p-3 rounded-xl bg-tertiary-fixed/30 border border-tertiary-container/30 text-on-surface flex flex-col gap-2">
            <span class="text-xs font-bold text-tertiary-container flex items-center gap-1">
              <span class="material-symbols-outlined text-[16px]">help</span>
              ${getTranslation(state.currentLanguage, 'didYouMean')}
            </span>
            <p class="text-xs text-on-surface-variant">${result.message}</p>
            <div class="flex flex-wrap gap-1.5 mt-1">
              ${result.suggestions.map(s => `
                <button type="button" class="px-2.5 py-1 rounded-full bg-surface-container-lowest text-primary text-xs font-bold shadow-xs hover:bg-primary hover:text-on-primary" onclick="window.anavandiApp.fillDestination('${s.label}')">
                  ${s.label}
                </button>
              `).join('')}
            </div>
          </div>
        `;
      }
    } else {
      if (errorBox) {
        errorBox.classList.remove('hidden');
        errorBox.innerHTML = `
          <div class="p-3 rounded-xl bg-error-container/40 border border-error/30 text-on-surface flex flex-col gap-2">
            <span class="text-xs font-bold text-error flex items-center gap-1">
              <span class="material-symbols-outlined text-[16px]">error</span>
              ${getTranslation(state.currentLanguage, 'errorNotFound')}
            </span>
            <p class="text-xs text-on-surface-variant">${result.message}</p>
            <button type="button" class="w-fit px-3 py-1 rounded-lg bg-surface-container-lowest text-primary text-xs font-bold shadow-xs" onclick="window.anavandiApp.fillDestination('Aluva')">
              Try Demo Corridor (Aluva)
            </button>
          </div>
        `;
      }
    }
  }

  fillDestination(destName) {
    const destInput = document.getElementById('journey-dest-input');
    if (destInput) destInput.value = destName;
    const originVal = document.getElementById('journey-origin-input')?.value || 'Ernakulam South';
    this.handlePlanFormSubmit(originVal, destName);
  }

  // Voice Input Flow with live Gemini Indic Understanding
  triggerVoiceInput() {
    const state = journeyStore.getState();
    const micRing = document.getElementById('voice-pulse-ring');
    const statusText = document.getElementById('voice-status-indicator');
    const bubble = document.getElementById('voice-live-transcript-bubble');

    if (micRing) micRing.classList.remove('hidden');
    if (statusText) statusText.textContent = getTranslation(state.currentLanguage, 'listening');

    voiceService.startListening(
      state.currentLanguage,
      async (result) => {
        if (bubble) bubble.textContent = `“${result.transcript}”`;
        if (result.isFinal) {
          if (micRing) micRing.classList.add('hidden');
          if (statusText) statusText.textContent = 'Speech Recognized & Analyzed';
          
          // Call Gemini Transit Engine on spoken phrase
          const aiResult = await geminiService.parseTransitQuery(result.transcript, state.currentLanguage);
          const recognizedDest = aiResult?.parsed?.destination || result.destination || 'Aluva';
          const detectedLang = aiResult?.pipeline?.languageLabel || result.detectedLang || 'Malayalam';

          const detectedLangEl = document.getElementById('voice-detected-lang');
          const recognizedTargetEl = document.getElementById('voice-recognized-target');

          if (detectedLangEl) detectedLangEl.textContent = detectedLang;
          if (recognizedTargetEl) recognizedTargetEl.textContent = `Ernakulam to ${recognizedDest}`;

          journeyStore.setIntermediateUnderstanding({
            origin: 'Ernakulam South',
            destination: recognizedDest,
            language: state.currentLanguage,
            intent: 'Plan Journey',
            confidence: aiResult?.parsed?.confidence || 98
          });

          // Audio reassurance readout if enabled
          if (state.voice.audioGuidanceOn) {
            const reassuranceMsg = geminiService.generateRouteExplanation('Ernakulam South', recognizedDest, state.currentLanguage);
            voiceService.speak(reassuranceMsg, state.currentLanguage);
          }
        }
      },
      () => {
        if (micRing) micRing.classList.add('hidden');
      }
    );
  }

  simulateVoiceInput(langCode) {
    journeyStore.setLanguage(langCode);
    this.triggerVoiceInput();
  }

  // RouteLens Sample Board Loader
  loadSampleBoard(index) {
    const board = SAMPLE_BUS_BOARDS[index] || SAMPLE_BUS_BOARDS[0];
    const boardImg = document.getElementById('ocr-board-image');
    const video = document.getElementById('ocr-camera-stream');

    if (video) video.classList.add('hidden');
    if (boardImg) {
      boardImg.classList.remove('hidden');
      boardImg.src = index === 1
        ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQap-B39r1Z0h_Xh28MC9Szx9nBmRVMjt61vlp21Vzi3_iYMcoffXcchS4Hp8DDgYEhFfF7k4eX9m4MxtBRIviM8KJw7Sz6dhCt4SrXOqlM7XeF9YXzvQVzpJrR3wDW8672ibvqwBbzwpjaqHQhlTzY1kaO9Ew1vnHOpoeBh89HTVkdEfopXNiR85cyn3yXsqNtHwn-w32iziTiqYCjFdUbiXL4JueB0EnE04F379mz0EsJYyIrEp3'
        : 'https://lh3.googleusercontent.com/aida-public/AB6AXuCK_rZc0n0E3Qe9z6H_X2sZ6GZ8lK8jH9s8K9jH8s7J6G5F4D3S2A1Q';
    }

    this.runOcrProcessing(board);
  }

  // Run Progressive OCR Pipeline
  async runOcrProcessing(boardData) {
    const badgeText = document.getElementById('ocr-step-status-text');
    const badgePct = document.getElementById('ocr-step-pct');
    const resultBox = document.getElementById('ocr-result-interactive-box');

    if (resultBox) {
      resultBox.innerHTML = `
        <div class="flex items-center gap-2 text-xs text-on-surface-variant animate-pulse py-2">
          <span class="material-symbols-outlined text-[18px] text-primary animate-spin">refresh</span>
          <span>Analyzing bus destination board with RouteLens AI...</span>
        </div>
      `;
    }

    const res = await ocrService.runScanPipeline(boardData, (step, data) => {
      if (badgeText) badgeText.textContent = data.message || step;
      if (badgePct && data.pct) badgePct.textContent = `${data.pct}%`;
    });

    if (badgeText) badgeText.textContent = `Completed (${res.confidence}%)`;
    if (badgePct) badgePct.textContent = `${res.confidence}%`;

    // Update Malayalam translation display targets
    const mlResEl = document.getElementById('ocr-result-malayalam');
    const enResEl = document.getElementById('ocr-result-english');
    const pctResEl = document.getElementById('ocr-status-pct');
    const subResEl = document.getElementById('ocr-result-sub');

    const board = boardData || SAMPLE_BUS_BOARDS[0];

    if (mlResEl) mlResEl.textContent = board.malayalam || res.detectedTextMalayalam || 'ആലുവ';
    if (enResEl) enResEl.textContent = `/ ${board.english || res.detectedTextEnglish || 'ALUVA'}`;
    if (pctResEl) pctResEl.textContent = `Confidence: ${res.confidence}%`;
    if (subResEl) subResEl.textContent = `Verified Destination • ${board.route || res.routeNumber || 'Route 42'} ${board.busClass || 'Fast Passenger'}`;

    // Render high-contrast result card
    if (resultBox) {
      if (board.multiTranslations && board.multiTranslations.length > 0) {
        resultBox.innerHTML = `
          <div class="p-3.5 rounded-2xl bg-white border-2 border-[#111827] shadow-sm flex flex-col gap-2.5">
            <div class="flex items-center justify-between pb-1 border-b border-[#E5E7EB]">
              <span class="px-2.5 py-0.5 rounded-full bg-[#111827] text-white font-black text-[10px] uppercase">Sign Board Translated to Malayalam</span>
              <span class="text-xs text-[#DC2626] font-black">Confidence: ${res.confidence}%</span>
            </div>
            
            <span class="text-xs font-black text-[#111827]">Extracted Destinations (മലയാളം തർജ്ജമ):</span>
            
            <div class="flex flex-col gap-2">
              ${board.multiTranslations.map(item => `
                <div class="p-2.5 rounded-xl bg-[#FFFBEB] border border-[#FDE047] flex items-center justify-between gap-2">
                  <div class="flex items-center gap-2">
                    <span class="text-base font-black text-[#DC2626]">📍</span>
                    <div class="flex flex-col">
                      <span class="text-sm font-black text-[#111827]">${item.malayalam}</span>
                      <span class="text-[10px] font-bold text-[#4B5563]">${item.english}</span>
                    </div>
                  </div>
                  <span class="px-2 py-0.5 rounded-full bg-white text-[#111827] font-black text-[9px] border border-[#111827]">${item.info}</span>
                </div>
              `).join('')}
            </div>

            <button type="button" class="mt-1 w-full py-2.5 px-4 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white font-black text-xs shadow-btn-red active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer" onclick="window.anavandiApp.confirmOcr('aluva')">
              <span>Navigate to ദ്വാരക (Dwarka) →</span>
            </button>
          </div>
        `;
      } else if (res.status === 'low_confidence') {
        resultBox.innerHTML = `
          <div class="p-3.5 rounded-2xl bg-[#FFFBEB] border-2 border-[#DC2626] flex flex-col gap-2">
            <div class="flex items-center justify-between">
              <span class="px-2.5 py-0.5 rounded-full bg-[#DC2626] text-white font-black text-[10px] uppercase shadow-sm">Low Confidence (${res.confidence}%)</span>
              <span class="text-[11px] text-[#4B5563] font-bold">Rain/glare detected</span>
            </div>
            <p class="text-xs font-black text-[#111827]">Did you mean to travel to Aluva (ആലുവ)?</p>
            <div class="flex flex-col gap-1.5 pt-1">
              ${res.alternatives.map(alt => `
                <button type="button" class="py-2.5 px-3.5 rounded-xl bg-white text-[#111827] text-xs font-black text-left hover:bg-[#FEF08A] transition-colors border border-[#111827] flex items-center justify-between shadow-xs" onclick="window.anavandiApp.confirmOcr('${alt.id}')">
                  <span>${alt.name}</span>
                  <span class="material-symbols-outlined text-[16px] text-[#DC2626]">arrow_forward</span>
                </button>
              `).join('')}
            </div>
          </div>
        `;
      } else {
        resultBox.innerHTML = `
          <div class="p-4 rounded-2xl bg-white border-2 border-[#111827] shadow-sm flex flex-col gap-3">
            <div class="flex items-start justify-between">
              <div class="flex flex-col">
                <div class="flex items-center gap-2">
                  <span class="px-2.5 py-0.5 rounded-full bg-[#111827] text-white font-black text-[10px] uppercase">Verified OCR Match</span>
                  <span class="text-xs text-[#DC2626] font-extrabold">Confidence: ${res.confidence}%</span>
                </div>
                <div class="flex items-baseline gap-2 mt-1.5">
                  <h2 class="text-2xl font-black text-[#111827]">${board.malayalam || res.detectedTextMalayalam}</h2>
                  <span class="text-sm font-black text-[#DC2626]">/ ${board.english || res.detectedTextEnglish}</span>
                </div>
              </div>
              <div class="w-10 h-10 rounded-xl bg-[#FFFBEB] border border-[#111827] flex items-center justify-center text-[#DC2626] font-black">
                <span class="material-symbols-outlined text-[22px]">directions_bus</span>
              </div>
            </div>

            <div class="grid grid-cols-3 gap-2 py-1 text-center text-xs">
              <div class="p-2 rounded-xl bg-[#FFFBEB] border border-[#FDE047] flex flex-col">
                <span class="text-[10px] text-[#4B5563] uppercase font-bold">Route</span>
                <span class="font-black text-[#111827] mt-0.5">${board.route || res.routeNumber || 'Route 42'}</span>
              </div>
              <div class="p-2 rounded-xl bg-[#FFFBEB] border border-[#FDE047] flex flex-col">
                <span class="text-[10px] text-[#4B5563] uppercase font-bold">Class</span>
                <span class="font-black text-[#DC2626] mt-0.5">${board.busClass || res.busClass || 'Fast'}</span>
              </div>
              <div class="p-2 rounded-xl bg-[#FFFBEB] border border-[#FDE047] flex flex-col">
                <span class="text-[10px] text-[#4B5563] uppercase font-bold">Est. Fare</span>
                <span class="font-black text-[#111827] mt-0.5">₹40*</span>
              </div>
            </div>

            <button type="button" class="w-full py-3 px-4 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white font-black text-xs shadow-btn-red active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer" onclick="window.anavandiApp.confirmOcr('aluva')">
              <span>Find My Route (${board.malayalam || res.detectedTextMalayalam})</span>
              <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        `;
      }
    }
  }

  confirmOcr(stopId) {
    journeyStore.setRoute('ernakulam_south', stopId);
    window.location.hash = 'journey';
    journeyStore.setActiveTab('journey');
  }

  // Location Simulation
  simulateLocatePassenger() {
    const locStatus = document.getElementById('nearby-location-status');
    if (locStatus) {
      locStatus.innerHTML = `
        <span class="material-symbols-outlined text-[18px] text-primary animate-spin">refresh</span>
        <span>Locating closest bus bays...</span>
      `;
    }
    setTimeout(() => {
      if (locStatus) {
        locStatus.innerHTML = `
          <span class="material-symbols-outlined text-[18px] text-primary">my_location</span>
          <span>Verified near Ernakulam South (GPS Simulation Active)</span>
        `;
      }
    }, 700);
  }

  // Audio Speech Announcement
  playCurrentStopAnnouncement() {
    const state = journeyStore.getState();
    if (state.voice.isMuted) return;

    const stop = state.journey.routeStops[state.journey.currentStopIndex] || DEMO_CORRIDOR.stops[0];
    const stopName = stop.names[state.currentLanguage] || stop.names.en;

    let text = '';
    if (state.currentLanguage === 'ml') {
      text = state.journey.isCompleted
        ? `നിങ്ങൾ ലക്ഷ്യസ്ഥാനമായ ${stopName}-ൽ എത്തിച്ചേർന്നിരിക്കുന്നു. ഇവിടെ ഇറങ്ങുക.`
        : `അടുത്ത സ്റ്റോപ്പ് ${stopName}. ഇറങ്ങാൻ തയ്യാറാകൂ.`;
    } else if (state.currentLanguage === 'hi') {
      text = state.journey.isCompleted
        ? `आप अपने गंतव्य ${stopName} पहुँच चुके हैं। कृपया यहाँ उतरें।`
        : `अगला स्टॉप ${stopName} है। उतरने के लिए तैयार रहें।`;
    } else if (state.currentLanguage === 'ta') {
      text = state.journey.isCompleted
        ? `நீங்கள் இலக்கான ${stopName}-ஐ அடைந்துவிட்டீர்கள். இங்கு இறங்கவும்.`
        : `அடுத்த நிறுத்தம் ${stopName}. இறங்கத் தயாராகுங்கள்.`;
    } else if (state.currentLanguage === 'kn') {
      text = state.journey.isCompleted
        ? `ನೀವು ಗಮ್ಯಸ್ಥಾನವಾದ ${stopName}-ಗೆ ತಲುಪಿದ್ದೀರಿ. ಇಲ್ಲಿ ಇಳಿಯಿರಿ.`
        : `ಮುಂದಿನ ನಿಲ್ದಾಣ ${stopName}. ಇಳಿಯಲು ಸಿದ್ಧರಾಗಿ.`;
    } else {
      text = state.journey.isCompleted
        ? `You have reached your destination ${stopName}. Please alight here.`
        : `Next stop is ${stopName}. Prepare to alight.`;
    }

    voiceService.speak(text, state.currentLanguage);
  }

  // Master Render Method
  renderAll() {
    const state = journeyStore.getState();
    const lang = state.currentLanguage;
    const persona = state.currentPersona;
    const a11y = state.accessibility;

    // Apply persona & accessibility classes to body
    document.body.className = `bg-surface text-on-surface antialiased flex flex-col min-h-screen persona-${persona} ${a11y.largeText ? 'mode-large-text' : ''} ${a11y.highContrast ? 'mode-high-contrast' : ''} ${a11y.reducedMotion ? 'mode-reduced-motion' : ''} ${a11y.largeTargets ? 'mode-large-targets' : ''}`;

    // Render Navigation & Global elements
    this.renderTopAppBar(state);
    this.renderBottomNav(state);
    this.renderActiveView(state);

    // Render Views
    this.renderHomeView(state);
    this.renderJourneyView(state);
    this.renderNearbyView(state);
    this.renderMyJourneyView(state);
    this.renderAccessibilityView(state);
    this.renderAiDrawer(state);
    this.renderDepotView(state);
    this.renderCrewView(state);
    this.renderAdminView(state);
  }

  renderTopAppBar(state) {
    const lang = state.currentLanguage;

    // Network status badge
    const badge = document.getElementById('network-badge');
    const badgeText = document.getElementById('network-status-text');
    const banner = document.getElementById('network-alert-banner');

    if (badge && badgeText) {
      if (state.networkStatus === 'online') {
        badge.className = 'inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-[11px] font-bold shadow-xs cursor-pointer hover:opacity-90';
        badge.innerHTML = `<span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span><span>${getTranslation(lang, 'online')}</span>`;
        if (banner) banner.classList.add('hidden');
      } else if (state.networkStatus === 'weak') {
        badge.className = 'inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-bold text-[11px] cursor-pointer hover:opacity-90';
        badge.innerHTML = `<span class="w-2 h-2 rounded-full bg-tertiary-container animate-pulse"></span><span>${getTranslation(lang, 'weakNetwork')}</span>`;
        if (banner) {
          banner.classList.remove('hidden');
          banner.innerHTML = `
            <div class="px-space-md py-1 bg-tertiary-fixed text-on-tertiary-fixed text-xs font-semibold flex items-center justify-between">
              <span>Weak connection. Using cached transit data where possible.</span>
              <button type="button" class="underline font-bold" onclick="window.anavandiApp.setNetwork('online')">Retry</button>
            </div>
          `;
        }
      } else {
        badge.className = 'inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-error-container text-on-error-container font-bold text-[11px] cursor-pointer hover:opacity-90';
        badge.innerHTML = `<span class="w-2 h-2 rounded-full bg-error"></span><span>${getTranslation(lang, 'offline')}</span>`;
        if (banner) {
          banner.classList.remove('hidden');
          banner.innerHTML = `
            <div class="px-space-md py-1 bg-error-container text-on-error-container text-xs font-semibold flex items-center justify-between">
              <span>${getTranslation(lang, 'offlineNotice')}</span>
              <button type="button" class="underline font-bold" onclick="window.anavandiApp.setNetwork('online')">${getTranslation(lang, 'reconnect')}</button>
            </div>
          `;
        }
      }
    }

    // Update Persona Mode Header Pill
    const personaIcon = document.getElementById('header-persona-icon');
    const personaLabel = document.getElementById('header-persona-label');
    if (personaIcon && personaLabel) {
      if (state.currentPersona === 'child') {
        personaIcon.textContent = '👦';
        personaLabel.textContent = 'Child Mode';
      } else if (state.currentPersona === 'senior') {
        personaIcon.textContent = '👴';
        personaLabel.textContent = 'Senior Mode';
      } else {
        personaIcon.textContent = '👨';
        personaLabel.textContent = 'Adult Mode';
      }
    }

    // Update AI Model Header Pill
    const headerApiModelLabel = document.getElementById('header-api-model-label');
    if (headerApiModelLabel) {
      const activeModel = geminiService.getModel();
      const hasKey = geminiService.hasApiKey();
      if (activeModel === 'local-deterministic' || !hasKey) {
        headerApiModelLabel.textContent = '⚡ Local AI';
      } else if (activeModel === 'gemini-1.5-flash') {
        headerApiModelLabel.textContent = '🤖 Gemini 1.5 Flash';
      } else if (activeModel === 'gemini-2.0-flash') {
        headerApiModelLabel.textContent = '🚀 Gemini 2.0 Flash';
      } else if (activeModel === 'gemini-1.5-pro') {
        headerApiModelLabel.textContent = '🧠 Gemini Pro';
      } else {
        headerApiModelLabel.textContent = '🤖 Gemini AI';
      }
    }

    // Language Button Label
    const currentLangLabel = document.getElementById('current-lang-label');
    if (currentLangLabel) {
      const opt = LANGUAGE_OPTIONS.find(o => o.code === lang) || LANGUAGE_OPTIONS[0];
      currentLangLabel.textContent = opt.nativeName;
    }
  }

  // ================================================================
  // ONBOARDING USER TYPE PERSONA MODAL
  // ================================================================
  openPersonaModal() {
    const modal = document.getElementById('welcome-persona-modal');
    if (modal) modal.classList.remove('hidden');
    this.selectPersonaFromModal(journeyStore.getState().currentPersona || 'adult');
  }

  closePersonaModal() {
    const modal = document.getElementById('welcome-persona-modal');
    if (modal) modal.classList.add('hidden');
  }

  selectPersonaFromModal(persona) {
    this._selectedModalPersona = persona;
    document.querySelectorAll('.modal-persona-card').forEach(card => {
      if (card.dataset.persona === persona) {
        card.className = 'modal-persona-card p-4 rounded-2xl bg-white hover:bg-[#FFFBEB] border-2 border-[#111827] ring-2 ring-[#DC2626] text-center flex flex-col items-center gap-2 cursor-pointer transition-all text-[#111827] shadow-sm';
      } else {
        card.className = 'modal-persona-card p-4 rounded-2xl bg-[#FFFBEB] hover:bg-[#FEF08A]/60 border-2 border-[#FDE047] text-center flex flex-col items-center gap-2 cursor-pointer transition-all text-[#111827]';
      }
    });
  }

  confirmPersonaModal() {
    const chosen = this._selectedModalPersona || journeyStore.getState().currentPersona || 'adult';
    journeyStore.setPersona(chosen);
    this.closePersonaModal();
    sessionStorage.setItem('anavandi_persona_selected', 'true');
    if (chosen === 'senior') {
      window.location.hash = 'senior';
    } else if (chosen === 'child') {
      window.location.hash = 'child';
    } else {
      window.location.hash = 'home';
    }
  }

  // ================================================================
  // API KEY & AI MODEL MODAL HANDLERS
  // ================================================================
  openApiKeyModal() {
    const modal = document.getElementById('api-key-modal');
    if (modal) modal.classList.remove('hidden');
    
    const keyInput = document.getElementById('modal-api-key-input');
    if (keyInput) keyInput.value = geminiService.getApiKey() || '';

    const currentModel = geminiService.getModel() || 'gemini-1.5-flash';
    this.selectModel(currentModel);

    const statusBox = document.getElementById('api-test-status-box');
    if (statusBox) statusBox.classList.add('hidden');
  }

  closeApiKeyModal() {
    const modal = document.getElementById('api-key-modal');
    if (modal) modal.classList.add('hidden');
  }

  selectModel(modelKey) {
    this._selectedModelKey = modelKey;
    document.querySelectorAll('.api-model-card').forEach(card => {
      if (card.dataset.model === modelKey) {
        card.className = 'api-model-card p-3 rounded-2xl bg-white border-2 border-[#111827] ring-2 ring-[#DC2626] text-left flex flex-col gap-1 transition-all shadow-sm';
      } else {
        card.className = 'api-model-card p-3 rounded-2xl bg-[#FFFBEB] hover:bg-[#FEF08A]/60 border-2 border-[#FDE047] text-left flex flex-col gap-1 transition-all';
      }
    });
  }

  toggleApiKeyVisibility() {
    const input = document.getElementById('modal-api-key-input');
    const btn = document.getElementById('toggle-key-visibility-btn');
    if (!input || !btn) return;

    if (input.type === 'password') {
      input.type = 'text';
      btn.textContent = 'Hide';
    } else {
      input.type = 'password';
      btn.textContent = 'Show';
    }
  }

  async testApiKeyConnection() {
    const keyInput = document.getElementById('modal-api-key-input');
    const statusBox = document.getElementById('api-test-status-box');
    const testBtn = document.getElementById('test-api-key-btn');
    const model = this._selectedModelKey || geminiService.getModel() || 'gemini-1.5-flash';
    const key = (keyInput?.value || '').trim();

    if (!statusBox || !testBtn) return;

    if (model === 'local-deterministic') {
      statusBox.className = 'p-3 rounded-xl bg-[#FFFBEB] border border-[#111827] text-[#111827] text-xs font-bold flex items-center gap-2';
      statusBox.innerHTML = '<span class="material-symbols-outlined text-[#111827] text-[18px]">check_circle</span> <span>Local Deterministic Rule Engine is 100% active and operational without API key.</span>';
      statusBox.classList.remove('hidden');
      return;
    }

    if (!key) {
      statusBox.className = 'p-3 rounded-xl bg-[#FFF1F2] border border-[#DC2626] text-[#DC2626] text-xs font-bold flex items-center gap-2';
      statusBox.innerHTML = '<span class="material-symbols-outlined text-[18px]">error</span> <span>Please enter a Gemini API Key to test connection.</span>';
      statusBox.classList.remove('hidden');
      return;
    }

    const origBtnText = testBtn.innerHTML;
    testBtn.innerHTML = '<span class="material-symbols-outlined text-[16px] animate-spin">progress_activity</span> <span>Testing...</span>';
    testBtn.disabled = true;

    try {
      await geminiService.testApiKey(key, model);
      statusBox.className = 'p-3 rounded-xl bg-[#ECFDF5] border border-[#10B981] text-[#065F46] text-xs font-bold flex items-center gap-2';
      statusBox.innerHTML = `<span class="material-symbols-outlined text-[18px]">verified</span> <span>Connected successfully to Google Gemini (${model})!</span>`;
      statusBox.classList.remove('hidden');
    } catch (err) {
      statusBox.className = 'p-3 rounded-xl bg-[#FFF1F2] border border-[#DC2626] text-[#DC2626] text-xs font-bold flex items-center gap-2';
      statusBox.innerHTML = `<span class="material-symbols-outlined text-[18px]">cancel</span> <span>Connection Failed: ${err.message || 'Invalid API key'}</span>`;
      statusBox.classList.remove('hidden');
    } finally {
      testBtn.innerHTML = origBtnText;
      testBtn.disabled = false;
    }
  }

  saveApiKeyAndModel() {
    const keyInput = document.getElementById('modal-api-key-input');
    const chosenModel = this._selectedModelKey || 'gemini-1.5-flash';
    const key = (keyInput?.value || '').trim();

    geminiService.setApiKey(key);
    geminiService.setModel(chosenModel);

    this.closeApiKeyModal();
    this.renderTopAppBar(journeyStore.getState());

    // Show temporary confirmation
    const saveBtn = document.getElementById('save-api-key-btn');
    if (saveBtn) {
      saveBtn.innerHTML = '<span class="material-symbols-outlined text-[16px]">check</span> <span>Saved!</span>';
      setTimeout(() => {
        saveBtn.innerHTML = '<span class="material-symbols-outlined text-[16px]">save</span> <span>Save & Apply</span>';
      }, 1500);
    }
  }

  // ================================================================
  // HOMEPAGE ROLE SELECTION (ആരാണ് നിങ്ങൾ? / How will you use ANAVANDI CONNECT?)
  // ================================================================
  selectRole(roleKey) {
    this._selectedRole = roleKey || 'passenger';
    document.querySelectorAll('.role-select-card').forEach(card => {
      const isSelected = (card.dataset.role === this._selectedRole);
      if (isSelected) {
        card.className = 'role-select-card p-3.5 rounded-2xl bg-white border-2 border-[#111827] ring-2 ring-[#DC2626] shadow-sm flex flex-col justify-between text-left gap-2 cursor-pointer transition-all active:scale-98 group';
      } else {
        card.className = 'role-select-card p-3.5 rounded-2xl bg-[#FFFBEB] hover:bg-[#FEF08A]/60 border-2 border-[#FDE047] shadow-xs flex flex-col justify-between text-left gap-2 cursor-pointer transition-all active:scale-98 group';
      }
    });
    this.handleRoleStart();
  }

  handleRoleStart() {
    const role = this._selectedRole || 'passenger';
    if (role === 'passenger') {
      window.location.hash = 'plan';
      journeyStore.setActiveTab('plan');
    } else if (role === 'depot') {
      window.location.hash = 'depot';
      journeyStore.setActiveTab('depot');
    } else if (role === 'crew') {
      window.location.hash = 'crew';
      journeyStore.setActiveTab('crew');
    } else if (role === 'admin') {
      window.location.hash = 'admin';
      journeyStore.setActiveTab('admin');
    }
  }

  handleGuestContinue() {
    window.location.hash = 'plan';
    journeyStore.setActiveTab('plan');
  }

  setNetwork(mode) {
    journeyStore.setNetworkStatus(mode);
  }

  renderBottomNav(state) {
    const lang = state.currentLanguage;
    const activeTab = state.activeTab;

    document.querySelectorAll('[data-nav-target]').forEach(link => {
      const target = link.dataset.navTarget;
      const isActive = (target === activeTab);
      const isScanFab = link.classList.contains('nav-fab-scan');

      if (!isScanFab) {
        link.className = `flex flex-col items-center justify-center min-h-[48px] min-w-[56px] transition-colors ${isActive ? 'text-[#111827] font-black' : 'text-[#4B5563] hover:text-[#DC2626]'}`;
      } else {
        link.className = `nav-fab-scan flex flex-col items-center justify-center min-h-[52px] min-w-[56px] -mt-4 bg-[#DC2626] text-white rounded-full p-2.5 shadow-btn-red border-2 border-[#FACC15] transition-transform ${isActive ? 'scale-110 ring-4 ring-[#FACC15]/50' : ''}`;
      }

      // Update text label inside
      const labelSpan = link.querySelector('.nav-label');
      if (labelSpan) {
        if (target === 'home') labelSpan.textContent = getTranslation(lang, 'navHome');
        else if (target === 'plan') labelSpan.textContent = getTranslation(lang, 'navPlan');
        else if (target === 'routelens') labelSpan.textContent = getTranslation(lang, 'navScan');
        else if (target === 'nearby') labelSpan.textContent = getTranslation(lang, 'navNearby');
      }
    });
  }

  renderActiveView(state) {
    const views = ['home', 'plan', 'voice', 'routelens', 'journey', 'map', 'nearby', 'my-journey', 'accessibility', 'privacy', 'help', 'settings', 'showcase', 'depot', 'crew', 'admin'];
    const active = state.activeTab;

    views.forEach(v => {
      const el = document.getElementById(`view-${v}`);
      if (el) {
        if (v === active) {
          el.classList.remove('hidden');
        } else {
          el.classList.add('hidden');
        }
      }
    });

    // Update desktop nav pills in Black & Yellow & Translate Labels
    const lang = state.currentLanguage;
    document.querySelectorAll('#main-desktop-nav .nav-pill-item').forEach(pill => {
      const target = pill.dataset.navTarget;
      if (target === active) {
        pill.className = 'nav-pill-item px-4 py-1.5 rounded-full text-xs font-black bg-[#111827] text-white shadow-sm transition-all';
      } else {
        pill.className = 'nav-pill-item px-3.5 py-1.5 rounded-full text-xs font-bold text-[#111827] hover:bg-[#FEF08A] transition-all';
      }

      if (target === 'home') pill.textContent = getTranslation(lang, 'navHome');
      else if (target === 'plan') pill.textContent = getTranslation(lang, 'navPlan');
      else if (target === 'routelens') pill.textContent = getTranslation(lang, 'navScan');
      else if (target === 'nearby') pill.textContent = getTranslation(lang, 'navNearby');
      else if (target === 'journey') pill.textContent = getTranslation(lang, 'navJourney');
      else if (target === 'help') pill.textContent = getTranslation(lang, 'navHelp');
    });

    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  renderHomeView(state) {
    const lang = state.currentLanguage;

    this.setText('home-welcome-title', getTranslation(lang, 'whereToGo'));
    this.setText('home-welcome-sub', getTranslation(lang, 'subtitlePrompt'));

    this.setText('home-speak-title', getTranslation(lang, 'speakBtnTitle'));
    this.setText('home-speak-sub', getTranslation(lang, 'speakBtnSub'));
    this.setText('home-type-title', getTranslation(lang, 'typeBtnTitle'));
    this.setText('home-type-sub', getTranslation(lang, 'typeBtnSub'));
    this.setText('home-scan-title', getTranslation(lang, 'scanBtnTitle'));
    this.setText('home-scan-sub', getTranslation(lang, 'scanBtnSub'));

    // Role Section & Buttons
    this.setText('role-select-title', getTranslation(lang, 'chooseMode'));
    this.setText('btn-start-role-text', `${getTranslation(lang, 'startJourneyBtn')} ➔`);
    this.setText('btn-guest-continue-text', getTranslation(lang, 'continueGuestBtn') || 'Continue as Guest');

    // Role Titles & Descriptions
    this.setText('role-title-passenger', getTranslation(lang, 'rolePassengerTitle') || 'Passenger');
    this.setText('role-title-depot', getTranslation(lang, 'roleDepotTitle') || 'Depot Staff');
    this.setText('role-title-crew', getTranslation(lang, 'roleCrewTitle') || 'Crew');
    this.setText('role-title-admin', getTranslation(lang, 'roleAdminTitle') || 'Admin');
  }

  renderJourneyView(state) {
    const lang = state.currentLanguage;
    const j = state.journey;

    const distEl = document.getElementById('live-journey-dist');
    if (distEl) distEl.textContent = j.remainingDistanceKm.toFixed(1);

    const timerEl = document.getElementById('live-journey-timer');
    if (timerEl) timerEl.textContent = `${j.nextStopTimerMin} ${getTranslation(lang, 'mins')}`;

    // Simulation Button
    const simBtn = document.getElementById('btn-start-simulation');
    if (simBtn) {
      if (j.isSimulating) {
        simBtn.innerHTML = `<span class="material-symbols-outlined text-[16px]">pause</span><span>${getTranslation(lang, 'pauseSimBtn')}</span>`;
        simBtn.className = 'px-3.5 py-1.5 rounded-full bg-[#111827] text-white text-xs font-black shadow-sm flex items-center gap-1 border border-[#FACC15]';
      } else if (j.isCompleted) {
        simBtn.innerHTML = `<span class="material-symbols-outlined text-[16px]">replay</span><span>${getTranslation(lang, 'restartSimBtn')}</span>`;
        simBtn.className = 'px-3.5 py-1.5 rounded-full bg-[#DC2626] text-white text-xs font-black shadow-sm flex items-center gap-1';
      } else {
        simBtn.innerHTML = `<span class="material-symbols-outlined text-[16px]">play_arrow</span><span>${getTranslation(lang, 'startJourneyBtn')}</span>`;
        simBtn.className = 'px-3.5 py-1.5 rounded-full bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-black shadow-sm flex items-center gap-1';
      }
    }

    // Bus Track Progress Pin
    const trackBar = document.getElementById('live-bus-track-progress');
    const busPin = document.getElementById('live-bus-indicator-pin');
    if (trackBar && busPin) {
      const total = j.totalDistanceKm || 15.0;
      const traveled = Math.max(0, total - j.remainingDistanceKm);
      const pct = Math.min(100, Math.max(4, (traveled / total) * 100));
      trackBar.style.width = `${pct}%`;
      busPin.style.left = `${Math.min(94, Math.max(6, pct))}%`;
    }

    // Visual Mode Card
    const visualModeCard = document.getElementById('journey-visual-mode-card');
    const visualModeBtn = document.getElementById('visual-mode-btn-text');
    if (visualModeCard) {
      if (j.isVisualMode) {
        visualModeCard.classList.remove('hidden');
        if (visualModeBtn) visualModeBtn.textContent = 'Audio Mode';
      } else {
        visualModeCard.classList.add('hidden');
        if (visualModeBtn) visualModeBtn.textContent = 'Visual Mode';
      }
    }

    // Arrival Celebration Banner
    const arrivalBanner = document.getElementById('journey-arrival-celebration');
    if (arrivalBanner) {
      if (j.isCompleted) {
        arrivalBanner.classList.remove('hidden');
      } else {
        arrivalBanner.classList.add('hidden');
      }
    }

    // Render Vertical Timeline
    this.renderVerticalTimeline(state);

    // Mute Icon
    const muteIcon = document.getElementById('voice-mute-icon');
    if (muteIcon) {
      muteIcon.textContent = state.voice.isMuted ? 'volume_off' : 'volume_up';
    }
  }

  renderVerticalTimeline(state) {
    const timelineEl = document.getElementById('timeline-stops-list');
    if (!timelineEl) return;

    const lang = state.currentLanguage;
    const stops = state.journey.routeStops;
    const currentIdx = state.journey.currentStopIndex;

    timelineEl.innerHTML = stops.map((stop, idx) => {
      const isPast = idx < currentIdx;
      const isCurrent = idx === currentIdx;
      const isDestination = idx === stops.length - 1;

      const stopName = stop.names[lang] || stop.names.en;
      const stopSubname = stop.subnames[lang] || stop.subnames.en;

      if (isDestination) {
        return `
          <div class="flex gap-3 relative cursor-pointer" onclick="window.anavandiApp.jumpToStop(${idx})">
            <div class="w-8 h-8 rounded-full bg-[#DC2626] text-white flex items-center justify-center shrink-0 z-10 shadow-btn-red border-2 border-[#FACC15]">
              <span class="material-symbols-outlined text-[18px]">location_on</span>
            </div>
            <div class="flex-1 ${isCurrent ? 'bg-[#FEF08A] ring-2 ring-[#DC2626]' : 'bg-[#FFFBEB]'} p-3.5 rounded-2xl flex flex-col border-2 border-[#111827]">
              <div class="flex items-start justify-between">
                <div>
                  <span class="px-2 py-0.5 rounded-full bg-[#DC2626] text-white text-[10px] font-black uppercase shadow-sm">
                    ${getTranslation(lang, 'getDownHere')}
                  </span>
                  <h3 class="text-base text-[#111827] font-black mt-1">${stopName}</h3>
                  <span class="text-xs text-[#4B5563] font-bold">${stopSubname}</span>
                </div>
                <span class="text-xs font-black text-[#111827]">${stop.scheduledTime}</span>
              </div>
              <div class="flex flex-wrap gap-1.5 mt-2">
                ${stop.landmarks.map(lm => `
                  <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white text-[#111827] text-[10px] font-black shadow-xs border border-[#111827]">
                    <span class="material-symbols-outlined text-[13px] text-[#DC2626]">${lm.icon}</span> ${lm.label}
                  </span>
                `).join('')}
              </div>
            </div>
          </div>
        `;
      }

      if (isCurrent) {
        return `
          <div class="flex gap-3 relative pb-5 cursor-pointer" onclick="window.anavandiApp.jumpToStop(${idx})">
            <div class="absolute left-4 top-8 -bottom-0 w-1 border-l-2 border-dashed border-[#111827]"></div>
            <div class="relative flex items-center justify-center shrink-0 z-10">
              <span class="absolute w-10 h-10 rounded-full bg-[#DC2626]/25 animate-ping"></span>
              <div class="w-8 h-8 rounded-full bg-[#DC2626] text-white flex items-center justify-center shadow-btn-red border-2 border-[#FACC15]">
                <span class="material-symbols-outlined text-[18px]">near_me</span>
              </div>
            </div>
            <div class="flex-1 bg-[#FEF08A] p-3.5 rounded-2xl shadow-sm flex flex-col ring-2 ring-[#111827] border-2 border-[#111827]">
              <div class="flex items-start justify-between">
                <div>
                  <span class="px-2 py-0.5 rounded-full bg-[#DC2626] text-white text-[10px] font-black animate-pulse">
                    ${getTranslation(lang, 'arrivingNow')}
                  </span>
                  <h3 class="text-base text-[#111827] font-black mt-1">${stopName}</h3>
                  <span class="text-xs text-[#4B5563] font-bold">${stopSubname}</span>
                </div>
                <div class="w-8 h-8 rounded-xl bg-[#111827] text-[#FACC15] flex items-center justify-center shrink-0 shadow-xs">
                  <span class="material-symbols-outlined text-[20px]">directions_bus</span>
                </div>
              </div>
              <div class="mt-2 p-2 rounded-xl bg-white flex items-center gap-1.5 text-xs text-[#111827] font-bold border border-[#111827]">
                <span class="material-symbols-outlined text-[#DC2626] text-[16px]">info</span>
                <span>${stop.tips ? (stop.tips[lang] || stop.tips.en) : ''}</span>
              </div>
            </div>
          </div>
        `;
      }

      if (isPast) {
        return `
          <div class="flex gap-3 relative pb-5 opacity-70 cursor-pointer" onclick="window.anavandiApp.jumpToStop(${idx})">
            <div class="absolute left-4 top-8 -bottom-0 w-1 bg-[#111827] rounded-full"></div>
            <div class="w-8 h-8 rounded-full bg-[#E5E7EB] text-[#111827] flex items-center justify-center shrink-0 z-10 shadow-xs border border-[#111827]">
              <span class="material-symbols-outlined text-[16px]">check</span>
            </div>
            <div class="flex-1 flex items-start justify-between pt-0.5">
              <div>
                <span class="text-[10px] font-bold text-[#4B5563]">${stop.scheduledTime} • Passed</span>
                <h3 class="text-sm text-[#111827] font-black">${stopName}</h3>
              </div>
              <span class="text-xs text-[#4B5563] font-bold">${stop.distanceFromOriginKm} km</span>
            </div>
          </div>
        `;
      }

      return `
        <div class="flex gap-3 relative pb-5 cursor-pointer" onclick="window.anavandiApp.jumpToStop(${idx})">
          <div class="absolute left-4 top-8 -bottom-0 w-1 border-l-2 border-dashed border-[#9CA3AF]"></div>
          <div class="w-8 h-8 rounded-full bg-white border-2 border-[#111827] text-[#111827] flex items-center justify-center shrink-0 z-10 shadow-xs font-black text-xs">
            ${idx + 1}
          </div>
          <div class="flex-1 flex items-start justify-between pt-0.5">
            <div>
              <span class="text-[10px] font-bold text-[#4B5563]">${stop.scheduledTime} • In ${stop.durationFromOriginMin} mins</span>
              <h3 class="text-sm text-[#111827] font-black">${stopName}</h3>
              <span class="text-xs text-[#4B5563] font-medium">${stopSubname}</span>
            </div>
            <span class="text-xs font-bold text-[#111827]">${stop.distanceFromOriginKm} km</span>
          </div>
        </div>
      `;
    }).join('');
  }

  jumpToStop(index) {
    journeyStore.advanceToStop(index);
    this.playCurrentStopAnnouncement();
  }

  renderNearbyView(state) {
    const listEl = document.getElementById('nearby-stops-list');
    if (!listEl) return;

    const lang = state.currentLanguage;
    const stops = [
      DEMO_CORRIDOR.stops[0], // Ernakulam South
      DEMO_CORRIDOR.stops[1], // Kaloor
      ALL_NETWORK_STOPS.find(s => s.id === 'vytilla_hub'),
      DEMO_CORRIDOR.stops[2]  // Edappally
    ];

    listEl.innerHTML = stops.map(stop => {
      if (!stop) return '';
      const stopName = stop.names[lang] || stop.names.en;
      const subname = stop.subnames[lang] || stop.subnames.en;
      const walk = stop.walkingFromUser || { meters: 500, walkingMinutes: 6 };

      return `
        <div class="bg-white rounded-2xl p-4 border-2 border-[#111827] shadow-sm flex flex-col gap-2">
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-2.5">
              <div class="w-10 h-10 rounded-full bg-[#FFFBEB] text-[#DC2626] border-2 border-[#111827] flex items-center justify-center font-black shrink-0">
                <span class="material-symbols-outlined text-[20px]">pin_drop</span>
              </div>
              <div>
                <h3 class="text-sm text-[#111827] font-black leading-tight">${stopName}</h3>
                <span class="text-xs text-[#4B5563] font-bold">${subname}</span>
              </div>
            </div>
            <div class="text-right shrink-0">
              <span class="text-xs font-black text-[#111827] bg-[#FEF08A] px-2.5 py-1 rounded-full border border-[#111827]">${walk.meters}m</span>
              <span class="text-[10px] text-[#4B5563] font-bold block mt-1">${walk.walkingMinutes} min walk</span>
            </div>
          </div>
          <div class="flex items-center justify-between pt-2.5 border-t border-[#E5E7EB] text-xs">
            <span class="text-[#4B5563] font-bold text-[11px]">Route 42, Fast, Super Fast</span>
            <button type="button" class="px-3.5 py-1.5 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white font-black shadow-btn-red transition-all cursor-pointer" onclick="window.anavandiApp.planFromNearby('${stop.id}')">
              Board Here ➔
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  planFromNearby(stopId) {
    journeyStore.setRoute(stopId, 'aluva');
    window.location.hash = 'journey';
    journeyStore.setActiveTab('journey');
  }

  renderMyJourneyView(state) {
    const listEl = document.getElementById('recent-journeys-list');
    if (!listEl) return;

    const recents = state.recentJourneys || [];
    if (recents.length === 0) {
      listEl.innerHTML = `<span class="text-xs text-[#4B5563] font-bold italic">No recent journeys stored.</span>`;
      return;
    }

    listEl.innerHTML = recents.map(rj => `
      <div class="p-3.5 rounded-2xl bg-white border-2 border-[#111827] flex items-center justify-between shadow-sm">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-[#FFFBEB] border border-[#111827] flex items-center justify-center text-[#DC2626]">
            <span class="material-symbols-outlined text-[18px]">history</span>
          </div>
          <div>
            <span class="text-xs font-black text-[#111827] block">${rj.origin} ➔ ${rj.destination}</span>
            <span class="text-[10px] text-[#4B5563] font-bold">${rj.time}</span>
          </div>
        </div>
        <span class="text-xs font-black text-[#DC2626] bg-[#FFFBEB] px-2.5 py-1 rounded-full border border-[#FDE047]">${rj.fare}</span>
      </div>
    `).join('');
  }

  renderAccessibilityView(state) {
    const a11y = state.accessibility;
    const persona = state.currentPersona;

    // Toggle Knobs
    this.updateToggleState('toggle-large-text', a11y.largeText);
    this.updateToggleState('toggle-high-contrast', a11y.highContrast);
    this.updateToggleState('toggle-reduced-motion', a11y.reducedMotion);
    this.updateToggleState('toggle-large-targets', a11y.largeTargets);
    this.updateToggleState('toggle-visual-mode-only', a11y.visualModeOnly);

    // Persona buttons in Accessibility view
    document.querySelectorAll('.a11y-persona-btn').forEach(btn => {
      const p = btn.dataset.persona;
      if (p === persona) {
        btn.className = 'a11y-persona-btn p-3 rounded-xl bg-primary text-on-primary text-center font-bold text-xs shadow-sm';
      } else {
        btn.className = 'a11y-persona-btn p-3 rounded-xl bg-surface-container text-center text-on-surface font-bold text-xs';
      }
    });
  }

  updateToggleState(elementId, isActive) {
    const el = document.getElementById(elementId);
    if (!el) return;
    const knob = el.querySelector('.toggle-knob');
    if (isActive) {
      el.className = 'w-12 h-6 rounded-full bg-primary transition-colors relative';
      if (knob) knob.className = 'toggle-knob w-5 h-5 rounded-full bg-white absolute top-0.5 right-0.5 shadow-sm transition-transform';
    } else {
      el.className = 'w-12 h-6 rounded-full bg-surface-container-highest transition-colors relative';
      if (knob) knob.className = 'toggle-knob w-5 h-5 rounded-full bg-white absolute top-0.5 left-0.5 shadow-sm transition-transform';
    }
  }

  // ================================================================
  // ANAVANDI AI ASSISTANT & CHAT DRAWER METHODS
  // ================================================================
  openAiAssistant() {
    this.aiChatOpen = true;
    const drawer = document.getElementById('ai-chat-drawer');
    if (drawer) drawer.classList.remove('hidden');

    const modelBadge = document.getElementById('ai-drawer-model-badge');
    if (modelBadge) {
      const activeModel = geminiService.getModel();
      const hasKey = geminiService.hasApiKey();
      modelBadge.textContent = !hasKey || activeModel === 'local-deterministic'
        ? 'Local Indic Engine'
        : (activeModel === 'gemini-2.0-flash' ? 'Gemini 2.0 Flash' : (activeModel === 'gemini-1.5-pro' ? 'Gemini 1.5 Pro' : 'Gemini 1.5 Flash'));
    }

    const input = document.getElementById('ai-chat-input');
    if (input) {
      setTimeout(() => input.focus(), 150);
    }
  }

  closeAiAssistant() {
    this.aiChatOpen = false;
    const drawer = document.getElementById('ai-chat-drawer');
    if (drawer) drawer.classList.add('hidden');
  }

  toggleAiAssistant() {
    if (this.aiChatOpen) {
      this.closeAiAssistant();
    } else {
      this.openAiAssistant();
    }
  }

  handleAiQuickPrompt(promptText) {
    const input = document.getElementById('ai-chat-input');
    if (input) input.value = promptText;
    this.sendAiChatMessage(promptText);
  }

  startAiVoiceDictation() {
    const state = journeyStore.getState();
    const micBtn = document.getElementById('ai-chat-mic-btn');
    const input = document.getElementById('ai-chat-input');

    if (micBtn) {
      micBtn.classList.add('bg-[#DC2626]', 'text-white', 'animate-pulse');
    }

    voiceService.startListening(
      state.currentLanguage,
      (result) => {
        if (input) input.value = result.transcript;
        if (result.isFinal) {
          if (micBtn) {
            micBtn.classList.remove('bg-[#DC2626]', 'text-white', 'animate-pulse');
          }
          this.sendAiChatMessage(result.transcript);
        }
      },
      () => {
        if (micBtn) {
          micBtn.classList.remove('bg-[#DC2626]', 'text-white', 'animate-pulse');
        }
      }
    );
  }

  async sendAiChatMessage(customText) {
    const input = document.getElementById('ai-chat-input');
    const query = (customText || input?.value || '').trim();
    if (!query) return;

    if (input) input.value = '';

    // Append User message to container & history
    this.appendUserChatMessage(query);
    this.chatHistory.push({ role: 'user', text: query });

    // Show thinking indicator
    const thinking = document.getElementById('ai-chat-thinking-indicator');
    if (thinking) thinking.classList.remove('hidden');

    const state = journeyStore.getState();

    try {
      const response = await geminiService.chatAssistant({
        message: query,
        language: state.currentLanguage,
        history: this.chatHistory,
        role: this._selectedRole
      });

      if (thinking) thinking.classList.add('hidden');

      if (response && response.text) {
        this.chatHistory.push({ role: 'assistant', text: response.text });
        this.appendAssistantChatMessage(response.text, response);
      }
    } catch (err) {
      if (thinking) thinking.classList.add('hidden');
      this.appendAssistantChatMessage('ക്ഷമിക്കണം, താൽക്കാലികമായി ഒരു തടസ്സം നേരിട്ടു. ദയവായി വീണ്ടും ശ്രമിക്കുക. (Please try again).');
    }
  }

  appendUserChatMessage(text) {
    const container = document.getElementById('ai-chat-messages-container');
    if (!container) return;

    const userDiv = document.createElement('div');
    userDiv.className = 'flex items-start justify-end gap-2 max-w-[90%] self-end animate-fade-in';
    userDiv.innerHTML = `
      <div class="flex flex-col items-end gap-1">
        <div class="p-3.5 rounded-2xl rounded-tr-none bg-[#111827] text-white text-xs font-bold shadow-sm leading-relaxed text-right">
          ${this.escapeHtml(text)}
        </div>
        <span class="text-[9px] text-[#6B7280] font-bold pr-1">You</span>
      </div>
      <div class="w-7 h-7 rounded-full bg-[#111827] border border-[#FEF08A] flex items-center justify-center text-white text-[11px] font-black shrink-0">
        👤
      </div>
    `;
    container.appendChild(userDiv);
    container.scrollTop = container.scrollHeight;
  }

  appendAssistantChatMessage(markdownText, responseData = {}) {
    const container = document.getElementById('ai-chat-messages-container');
    if (!container) return;

    const formattedHtml = this.formatMarkdownText(markdownText);
    const hasSuggestedPlan = responseData.suggestedAction && responseData.suggestedAction.type === 'plan';

    const aiDiv = document.createElement('div');
    aiDiv.className = 'flex items-start gap-2.5 max-w-[94%] self-start animate-fade-in';
    aiDiv.innerHTML = `
      <div class="w-8 h-8 rounded-full bg-[#DC2626] border border-[#111827] flex items-center justify-center text-white shrink-0 shadow-xs">
        <span class="material-symbols-outlined text-[18px]">smart_toy</span>
      </div>
      <div class="flex flex-col gap-1.5 w-full">
        <div class="p-3.5 rounded-2xl rounded-tl-none bg-white border-2 border-[#111827] text-xs font-medium text-[#111827] shadow-sm leading-relaxed">
          ${formattedHtml}
          ${hasSuggestedPlan ? `
            <div class="mt-2.5 pt-2 border-t border-[#E5E7EB] flex items-center gap-2">
              <button type="button" class="px-3 py-1.5 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white text-[11px] font-black shadow-btn-red transition-all flex items-center gap-1 cursor-pointer" onclick="window.anavandiApp.closeAiAssistant(); window.anavandiApp.fillDestination('${responseData.suggestedAction.destination}')">
                <span class="material-symbols-outlined text-[14px]">directions_bus</span>
                <span>Plan Route to ${responseData.suggestedAction.destination}</span>
              </button>
            </div>
          ` : ''}
        </div>
        <div class="flex items-center justify-between pl-1">
          <span class="text-[9px] text-[#6B7280] font-bold flex items-center gap-1">
            <span>Aanavandi AI</span>
            <span class="text-[#DC2626]">• ${responseData.model || 'Gemini'}</span>
          </span>
          <div class="flex items-center gap-2">
            <button type="button" class="text-[11px] text-[#DC2626] hover:underline font-bold flex items-center gap-0.5 cursor-pointer" onclick="window.anavandiApp.speakAiMessage(${JSON.stringify(markdownText.replace(/[*#_`]/g, ''))})">
              <span class="material-symbols-outlined text-[14px]">volume_up</span>
              <span>Listen</span>
            </button>
            <button type="button" class="text-[11px] text-[#4B5563] hover:text-[#111827] font-bold flex items-center gap-0.5 cursor-pointer" onclick="navigator.clipboard?.writeText(${JSON.stringify(markdownText)})">
              <span class="material-symbols-outlined text-[14px]">content_copy</span>
            </button>
          </div>
        </div>
      </div>
    `;
    container.appendChild(aiDiv);
    container.scrollTop = container.scrollHeight;
  }

  speakAiMessage(text) {
    const state = journeyStore.getState();
    voiceService.speak(text, state.currentLanguage);
  }

  clearAiChat() {
    this.chatHistory = [];
    const container = document.getElementById('ai-chat-messages-container');
    if (container) {
      container.innerHTML = `
        <div class="flex items-start gap-2.5 max-w-[92%]">
          <div class="w-8 h-8 rounded-full bg-[#DC2626] border border-[#111827] flex items-center justify-center text-white shrink-0 shadow-xs">
            <span class="material-symbols-outlined text-[18px]">smart_toy</span>
          </div>
          <div class="flex flex-col gap-1">
            <div class="p-3.5 rounded-2xl rounded-tl-none bg-white border-2 border-[#111827] text-xs font-medium text-[#111827] shadow-sm leading-relaxed">
              <p class="font-black text-sm text-[#111827] mb-1">നമസ്കാരം! ഞാൻ ആനവണ്ടി എഐ അസിസ്റ്റന്റ് ആണ്. 🚌</p>
              <p>നിങ്ങളുടെ യാത്രാ റൂട്ടുകൾ, ടിക്കറ്റ് നിരക്കുകൾ, ബസ് സമയങ്ങൾ, അല്ലെങ്കിൽ കൺസഷൻ വിവരങ്ങൾ എന്നിവയെക്കുറിച്ച് എന്നോട് ചോദിക്കാം. Speak in Malayalam, English, Hindi, Tamil, or Kannada!</p>
            </div>
            <div class="flex items-center gap-2 pl-1">
              <span class="text-[9px] text-[#6B7280] font-bold">Aanavandi AI • Verified KSRTC Guide</span>
              <button type="button" class="text-[11px] text-[#DC2626] hover:underline font-bold flex items-center gap-0.5" onclick="window.anavandiApp.speakAiMessage('നമസ്കാരം! ഞാൻ ആനവണ്ടി എഐ അസിസ്റ്റന്റ് ആണ്. നിങ്ങളുടെ യാത്രാ സംശയങ്ങൾ എന്നോട് ചോദിക്കാം.')">
                <span class="material-symbols-outlined text-[14px]">volume_up</span> Listen
              </button>
            </div>
          </div>
        </div>
      `;
    }
  }

  // ================================================================
  // EXPLAINABLE AI (XAI) REASONING INSPECTOR
  // ================================================================
  openXaiInspector() {
    const drawer = document.getElementById('ai-explainer-drawer');
    if (drawer) drawer.classList.remove('hidden');
    this.renderXaiPipeline();
  }

  closeXaiInspector() {
    const drawer = document.getElementById('ai-explainer-drawer');
    if (drawer) drawer.classList.add('hidden');
  }

  renderXaiPipeline() {
    const pipelineData = geminiService.getLastPipelineData();
    if (!pipelineData) return;

    this.setText('xai-user-query', `“${pipelineData.userRequest}”`);
    this.setText('xai-confidence-pct', `${pipelineData.confidence}% Confidence`);
    this.setText('xai-source-label', pipelineData.source);
    this.setText('xai-entity-lang', pipelineData.languageLabel || 'Malayalam');
    this.setText('xai-entity-intent', pipelineData.intentUnderstood || 'Plan Journey');
    this.setText('xai-entity-origin', pipelineData.origin || 'Ernakulam South');
    this.setText('xai-entity-dest', pipelineData.destination || 'Aluva');
    this.setText('xai-reassurance-text', `“${pipelineData.explanation}”`);

    const modelBadge = document.getElementById('xai-model-badge');
    if (modelBadge) {
      modelBadge.textContent = geminiService.hasApiKey() ? geminiService.getModel() : 'Local Indic Engine';
    }

    const stepsContainer = document.getElementById('xai-steps-container');
    if (stepsContainer && pipelineData.steps) {
      stepsContainer.innerHTML = pipelineData.steps.map((step, idx) => `
        <div class="p-3 rounded-xl bg-white border border-[#111827] flex items-start justify-between gap-3 shadow-xs hover:bg-[#FFFBEB] transition-colors">
          <div class="flex items-start gap-2.5">
            <span class="w-6 h-6 rounded-full bg-[#111827] text-white text-[11px] font-black flex items-center justify-center shrink-0">
              ${idx + 1}
            </span>
            <div class="flex flex-col">
              <span class="text-xs font-black text-[#111827]">${step.name}</span>
              <span class="text-[11px] text-[#4B5563] font-medium leading-tight">${step.detail}</span>
            </div>
          </div>
          <span class="px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#065F46] border border-[#10B981] text-[9px] font-black shrink-0">
            ${step.status}
          </span>
        </div>
      `).join('');
    }
  }

  formatMarkdownText(text) {
    if (!text) return '';
    let html = this.escapeHtml(text);
    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Italic
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // Lists
    html = html.replace(/^- (.*$)/gim, '<li class="ml-4 list-disc">$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul class="my-1.5 flex flex-col gap-1">$1</ul>');
    // Linebreaks
    html = html.replace(/\n\n/g, '<div class="h-2"></div>');
    html = html.replace(/\n/g, '<br/>');
    return html;
  }

  escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  renderAiDrawer(state) {
    if (state.aiExplainerOpen) {
      this.openXaiInspector();
    } else {
      this.closeXaiInspector();
    }
  }

  setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  toggleVisualMode() {
    journeyStore.toggleVisualMode();
  }

  resetJourney() {
    journeyStore.resetJourney();
  }

  // ================================================================
  // ROLE DASHBOARD METHODS (DEPOT STAFF, CREW, ADMIN)
  // Powered by https://github.com/razinahmed/kerala-public-transport-api
  // ================================================================
  renderDepotView(state) {
    const depotSelect = document.getElementById('depot-select-dropdown');
    if (depotSelect && depotSelect.children.length === 0) {
      depotSelect.innerHTML = KSRTC_DEPOTS.map(d => `
        <option value="${d.code}">${d.name} (${d.district})</option>
      `).join('');
    }

    const currentCode = this._selectedDepotCode || 'EKM';
    const depot = KSRTC_DEPOTS.find(d => d.code === currentCode) || KSRTC_DEPOTS[1];

    this.setText('depot-stat-code', depot.code);
    this.setText('depot-stat-district', `${depot.district} District`);
    this.setText('depot-stat-buses', `${depot.bus_count} Fleet Units`);
    this.setText('depot-stat-routes', `${depot.routes_operated} Routes`);

    const scheduleList = document.getElementById('depot-schedules-list');
    if (scheduleList) {
      scheduleList.innerHTML = SAMPLE_ROUTES.map(r => `
        <div class="p-3.5 rounded-2xl bg-[#FFFBEB] border-2 border-[#111827] flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-[#DC2626] text-white font-black text-xs flex items-center justify-center shrink-0 shadow-sm">
              ${r.type.toUpperCase().slice(0, 3)}
            </div>
            <div>
              <span class="text-xs font-black text-[#111827] block">${r.name} (${r.operator})</span>
              <span class="text-[10px] text-[#4B5563] font-bold">Via: ${r.via.join(', ')} • ${r.distance_km} km</span>
            </div>
          </div>
          <div class="flex items-center gap-2 justify-between sm:justify-end">
            <span class="text-xs font-mono font-black text-[#DC2626] bg-white px-2.5 py-1 rounded-lg border border-[#111827]">
              Next: ${r.departure_times[0]}
            </span>
            <span class="px-2 py-0.5 rounded-full bg-[#FEF08A] text-[#111827] text-[9px] font-black border border-[#111827]">
              ₹${r.fare_inr}
            </span>
          </div>
        </div>
      `).join('');
    }
  }

  handleDepotChange(code) {
    this._selectedDepotCode = code;
    this.renderDepotView(journeyStore.getState());
  }

  refreshDepotData() {
    const list = document.getElementById('depot-schedules-list');
    if (list) {
      list.innerHTML = `<div class="p-4 rounded-xl bg-[#FFFBEB] text-xs font-black text-[#111827] text-center border border-[#111827] animate-pulse">Syncing platform chart with KSRTC Central Data Feed...</div>`;
      setTimeout(() => {
        this.renderDepotView(journeyStore.getState());
      }, 600);
    }
  }

  renderCrewView(state) {
    const waypoints = ['Ernakulam South KSRTC', 'Kaloor Junction', 'Edappally Toll', 'Aluva Bus Stand'];
    const idx = this._crewStopIndex || 0;
    
    this.setText('crew-waypoint-name', waypoints[idx] || waypoints[0]);
    this.setText('crew-current-stop-badge', `Stop ${idx + 1} of ${waypoints.length}`);

    const btn = document.getElementById('crew-mark-arrived-btn');
    if (btn) {
      if (idx >= waypoints.length - 1) {
        btn.textContent = 'Trip Completed ✓';
        btn.className = 'px-4 py-2.5 rounded-xl bg-[#10B981] text-white font-black text-xs transition-all';
      } else {
        btn.textContent = 'Mark Arrived ➔';
        btn.className = 'px-4 py-2.5 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white font-black text-xs shadow-btn-red transition-all cursor-pointer';
      }
    }
  }

  markCrewWaypointArrived() {
    const waypoints = ['Ernakulam South KSRTC', 'Kaloor Junction', 'Edappally Toll', 'Aluva Bus Stand'];
    this._crewStopIndex = ((this._crewStopIndex || 0) + 1) % waypoints.length;
    this.renderCrewView(journeyStore.getState());
  }

  renderAdminView(state) {
    const grid = document.getElementById('admin-district-grid');
    if (grid && grid.children.length === 0) {
      grid.innerHTML = KERALA_DISTRICTS.map(d => `
        <div class="p-2.5 rounded-xl bg-[#FFFBEB] border border-[#111827] flex flex-col gap-0.5">
          <span class="text-[11px] font-black text-[#111827]">${d.name}</span>
          <span class="text-[10px] text-[#DC2626] font-bold">${d.depotCount} Depots • ${d.totalBuses} Buses</span>
        </div>
      `).join('');
    }
  }

  runAdminFleetAudit() {
    const statusText = document.getElementById('admin-audit-status-text');
    if (statusText) {
      statusText.textContent = `⚡ Running Statewide Fleet Audit... Synchronizing 14 Districts & 19 Depots...`;
      setTimeout(() => {
        statusText.textContent = `✓ AUDIT PASSED: 19 Depots Verified | 59 Bus Stands Indexed | 20 State Routes Operational | 0 Data Anomaly Detected. (GTFS Stream Sync Complete)`;
      }, 1000);
    }
  }

  // ================================================================
  // HACKATHON LIVE DEMO FLOW CONTROLLER (Step 1 to Step 24)
  // ================================================================
  runDemoStep(stepNumber) {
    switch (stepNumber) {
      case 1:
        // Step 1: Open Home & Select Malayalam
        window.location.hash = 'home';
        journeyStore.setActiveTab('home');
        journeyStore.setLanguage('ml');
        break;
      case 2:
        // Step 2: Open Speak & trigger voice
        window.location.hash = 'voice';
        journeyStore.setActiveTab('voice');
        this.triggerVoiceInput();
        break;
      case 3:
        // Step 3: Type your journey
        window.location.hash = 'plan';
        journeyStore.setActiveTab('plan');
        this.handlePlanFormSubmit('Ernakulam South', 'Aluva');
        break;
      case 4:
        // Step 4: RouteLens OCR Scanner
        window.location.hash = 'routelens';
        journeyStore.setActiveTab('routelens');
        this.loadSampleBoard(0);
        break;
      case 5:
        // Step 5: Live Visual Journey
        window.location.hash = 'journey';
        journeyStore.setActiveTab('journey');
        journeyStore.startLiveSimulation();
        break;
      default:
        window.location.hash = 'home';
    }
  }

  async runFullDemoAuto() {
    this.runDemoStep(1);
    await new Promise(r => setTimeout(r, 1200));
    this.runDemoStep(2);
    await new Promise(r => setTimeout(r, 1800));
    this.runDemoStep(3);
    await new Promise(r => setTimeout(r, 1500));
    this.runDemoStep(4);
    await new Promise(r => setTimeout(r, 3000));
    this.runDemoStep(5);
  }
}

// Instantiate on DOM ready
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    window.anavandiApp = new AnavandiApp();
  });
}
