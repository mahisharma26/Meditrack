/**
 * MediTrack - Voice Assistant Engine (Web Speech API)
 * Supports English (en-US) and Hindi (hi-IN)
 * SpeechRecognition + SpeechSynthesis with Safe Confirmation Dialogs
 */

class VoiceAssistant {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.speechSynth = window.speechSynthesis;
    this.selectedVoice = null;
    this.transcriptCallback = null;
    this.statusCallback = null;

    this.initRecognition();
    this.initVoices();
  }

  initRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 1;

      this.recognition.onstart = () => {
        this.isListening = true;
        this.updateStatus('listening');
      };

      this.recognition.onresult = (event) => {
        const result = event.results[0];
        const text = result[0].transcript;
        const isFinal = result.isFinal;

        if (this.transcriptCallback) {
          this.transcriptCallback(text, isFinal);
        }

        if (isFinal) {
          this.handleCommand(text);
        }
      };

      this.recognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        this.isListening = false;
        this.updateStatus('error', event.error);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        this.updateStatus('idle');
      };
    } else {
      console.warn("SpeechRecognition API not natively supported in this browser. Fallback simulation available.");
    }
  }

  initVoices() {
    if (!this.speechSynth) return;
    const loadVoices = () => {
      this.voices = this.speechSynth.getVoices();
    };
    loadVoices();
    if (this.speechSynth.onvoiceschanged !== undefined) {
      this.speechSynth.onvoiceschanged = loadVoices;
    }
  }

  getBestVoice(lang) {
    if (!this.voices || this.voices.length === 0) {
      this.voices = this.speechSynth ? this.speechSynth.getVoices() : [];
    }

    if (lang.startsWith('hi')) {
      const hiVoice = this.voices.find(v => v.lang.includes('hi') || v.name.toLowerCase().includes('hindi') || v.name.toLowerCase().includes('lekha'));
      if (hiVoice) return hiVoice;
    }
    // Fallback to English
    const enVoice = this.voices.find(v => (v.lang.includes('en-IN') || v.lang.includes('en-GB') || v.lang.includes('en-US')) && !v.name.includes('Google'));
    return enVoice || this.voices[0] || null;
  }

  startListening(lang = null) {
    const currentLang = lang || (window.i18n ? window.i18n.getLang() : 'en');
    const speechLang = currentLang === 'hi' ? 'hi-IN' : 'en-US';

    if (this.recognition) {
      try {
        this.recognition.lang = speechLang;
        this.recognition.start();
        return true;
      } catch (e) {
        console.warn("Recognition already started or error:", e);
      }
    } else {
      this.updateStatus('unsupported');
    }
    return false;
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
      this.updateStatus('idle');
    }
  }

  toggleListening() {
    if (this.isListening) {
      this.stopListening();
    } else {
      this.startListening();
    }
  }

  speak(text, lang = null) {
    if (!this.speechSynth) return;
    this.speechSynth.cancel(); // Stop any active speech

    const currentLang = lang || (window.i18n ? window.i18n.getLang() : 'en');
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = currentLang === 'hi' ? 'hi-IN' : 'en-US';
    utterance.rate = 0.9; // Calm, slower pace suitable for elderly listeners
    utterance.pitch = 1.0;

    const voice = this.getBestVoice(utterance.lang);
    if (voice) utterance.voice = voice;

    this.speechSynth.speak(utterance);
  }

  updateStatus(status, details = null) {
    if (this.statusCallback) {
      this.statusCallback(status, details);
    }
    const indicator = document.getElementById('voiceIndicator');
    if (indicator) {
      indicator.className = `voice-indicator status-${status}`;
    }
  }

  // Natural Language Understanding for Voice Commands
  handleCommand(rawText) {
    const text = rawText.trim().toLowerCase();
    const isHindi = window.i18n && window.i18n.getLang() === 'hi';

    console.log("MediTrack Voice heard:", rawText);

    // 1. "What is my next medicine?" / "मेरी अगली दवा क्या है?"
    if (
      text.includes('next medicine') ||
      text.includes('next pill') ||
      text.includes('what is next') ||
      text.includes('what next') ||
      text.includes('अगली दवा') ||
      text.includes('अगला') ||
      text.includes('आगे क्या लेना')
    ) {
      this.answerNextMedicine(isHindi);
      return;
    }

    // 2. "What medicines do I have today?" / "आज मेरी कौन सी दवाएं हैं?"
    if (
      text.includes('medicines do i have today') ||
      text.includes('medicines today') ||
      text.includes('pills today') ||
      text.includes('schedule today') ||
      text.includes('today schedule') ||
      text.includes('आज मेरी कौन सी दवा') ||
      text.includes('आज की दवा') ||
      text.includes('दवाएं आज')
    ) {
      this.answerTodaySchedule(isHindi);
      return;
    }

    // 3. "I have taken my medicine" / "मैंने दवा ले ली है"
    // CRITICAL SAFETY RULE: Never automatically mark dose without explicit confirmation modal
    if (
      text.includes('taken my medicine') ||
      text.includes('took my pill') ||
      text.includes('have taken it') ||
      text.includes('i have taken') ||
      text.includes('दवा ले ली') ||
      text.includes('ले ली है') ||
      text.includes('गोली खा ली')
    ) {
      this.promptTakeConfirmation(isHindi);
      return;
    }

    // 4. "Remind me later" / "मुझे बाद में याद दिलाएं"
    if (
      text.includes('remind me later') ||
      text.includes('snooze') ||
      text.includes('remind later') ||
      text.includes('बाद में याद दिलाएं') ||
      text.includes('बाद में') ||
      text.includes('थोड़ी देर बाद')
    ) {
      this.answerRemindLater(isHindi);
      return;
    }

    // 5. "Call my guardian" / "गार्जियन को फोन करें"
    if (
      text.includes('call my guardian') ||
      text.includes('call guardian') ||
      text.includes('call priya') ||
      text.includes('call daughter') ||
      text.includes('गार्जियन को फोन') ||
      text.includes('प्रिया को फोन') ||
      text.includes('फोन करो') ||
      text.includes('मदद चाहिए')
    ) {
      this.triggerCallGuardian(isHindi);
      return;
    }

    // Unrecognized speech command
    const unrecognizedMsg = isHindi
      ? "माफ़ कीजिए, मैं समझ नहीं पाई। कृपया कहें: 'मेरी अगली दवा क्या है?' या 'मैंने दवा ले ली है'।"
      : "I am sorry, I did not catch that. You can ask: 'What is my next medicine?' or say 'I have taken my medicine'.";

    this.speak(unrecognizedMsg);
    if (this.transcriptCallback) {
      this.transcriptCallback(rawText + ` — (${unrecognizedMsg})`, true);
    }
  }

  answerNextMedicine(isHindi) {
    const nextDose = window.patientPortal ? window.patientPortal.getNextDose() : null;
    let speechText = "";

    if (!nextDose) {
      speechText = isHindi
        ? "आज के लिए आपकी सभी दवाएं पूरी हो चुकी हैं। शाबाश!"
        : "All scheduled medicines for today have already been taken. Great job!";
    } else {
      const medName = isHindi && nextDose.med.brandName ? nextDose.med.brandName : nextDose.med.name;
      const time = nextDose.slot.time;
      const instruction = isHindi ? (nextDose.med.instructionsHindi || nextDose.med.instructions) : nextDose.med.instructions;

      speechText = isHindi
        ? `आपकी अगली दवा ${medName} है, जो ${time} बजे निर्धारित है। ${instruction}`
        : `Your next medicine is ${medName}, scheduled for ${time}. ${instruction}`;
    }

    this.speak(speechText);
    this.displayAssistantResponse(speechText);
  }

  answerTodaySchedule(isHindi) {
    const medicines = window.stateManager ? window.stateManager.state.medicines.filter(m => m.active && !m.isSOS) : [];
    let count = medicines.length;

    let speechText = "";
    if (isHindi) {
      speechText = `आज आपके पास कुल ${count} नियमित दवाएं हैं: मेटफॉर्मिन, एम्लोडिपिन, मल्टीविटामिन और एटोरवास्टेटिन। क्या आप अगली दवा सुनना चाहते हैं?`;
    } else {
      speechText = `Today you have ${count} regular medicines scheduled: Metformin, Amlodipine, Multivitamin, and Atorvastatin. Would you like to hear your next due medicine?`;
    }

    this.speak(speechText);
    this.displayAssistantResponse(speechText);
  }

  promptTakeConfirmation(isHindi) {
    const nextDose = window.patientPortal ? window.patientPortal.getNextDose() : null;
    if (!nextDose) {
      const noPending = isHindi
        ? "आज के लिए कोई भी खुराक बाकी नहीं है।"
        : "There are no pending doses left for today.";
      this.speak(noPending);
      return;
    }

    const medName = nextDose.med.brandName || nextDose.med.name;
    const confirmPrompt = isHindi
      ? `क्या आपने ${medName} ले ली है? कृपया पुष्टि करने के लिए स्क्रीन पर 'हाँ' का बटन दबाएं।`
      : `Did you just take your ${medName}? Please press Yes on the screen to confirm.`;

    this.speak(confirmPrompt);
    this.displayAssistantResponse(confirmPrompt);

    // Open safe confirmation modal on Patient Portal
    if (window.patientPortal && typeof window.patientPortal.showTakeDoseModal === 'function') {
      window.patientPortal.showTakeDoseModal(nextDose.med.id, nextDose.slot.timeSlot);
    }
  }

  answerRemindLater(isHindi) {
    if (window.stateManager) {
      window.stateManager.snoozeReminder(15);
    }
    const msg = isHindi
      ? "ठीक है रमेश जी, मैंने 15 मिनट के लिए रीमाइंडर आगे बढ़ा दिया है।"
      : "Understood Ramesh-ji, I have snoozed your reminder for 15 minutes.";

    this.speak(msg);
    this.displayAssistantResponse(msg);
    if (window.patientPortal) {
      window.patientPortal.renderNextDoseHero();
    }
  }

  triggerCallGuardian(isHindi) {
    const msg = isHindi
      ? "आपकी बेटी प्रिया को संपर्क किया जा रहा है।"
      : "Opening contact card to reach your daughter Priya.";

    this.speak(msg);
    this.displayAssistantResponse(msg);

    if (window.patientPortal && typeof window.patientPortal.openContactModal === 'function') {
      window.patientPortal.openContactModal();
    }
  }

  displayAssistantResponse(text) {
    const replyEl = document.getElementById('voiceAssistantResponse');
    if (replyEl) {
      replyEl.textContent = text;
      replyEl.classList.remove('d-none');
    }
  }
}

const voiceAssistant = new VoiceAssistant();
window.voiceAssistant = voiceAssistant;
