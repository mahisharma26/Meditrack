/**
 * MediTrack - Main Application Orchestrator
 * Authentication, Route Protection, Portal Switching, Voice & A11y
 */

class MediTrackApp {
  constructor() {
    this.currentPortal = 'auth';
  }

  async init() {
    console.log("Initializing MediTrack Application...");

    // 1. Initialize i18n
    if (window.i18n) {
      window.i18n.applyTranslations();
    }

    // 2. Initialize Supabase Service
    if (window.supabaseService) {
      window.supabaseService.init();
    }

    // 3. Apply Accessibility Preferences
    if (window.stateManager) {
      const prefs = window.stateManager.state.preferences;
      window.stateManager.setFontSize(prefs.fontSize || 'normal');
      window.stateManager.setHighContrast(prefs.highContrast);
      window.stateManager.setReducedMotion(prefs.reducedMotion);
    }

    // 4. Bind Global UI Events & Voice Assistant
    this.bindGlobalEvents();
    this.bindAuthEvents();
    this.bindVoiceUI();
    this.bindFormHandlers();

    // 5. Check Authentication Session & Route to Correct Dashboard
    await this.checkAuthAndRoute();

    // 6. Periodic Grace Period Missed-Dose Checker
    if (window.adherenceEngine) {
      window.adherenceEngine.checkGracePeriodAlerts();
    }

    // 7. Initial notification bell render
    if (window.notificationManager) {
      window.notificationManager.renderNotificationCenter();
    }

    // 8. Update Supabase Backend Status Indicator on Login Page
    this.updateAuthBackendStatus();
  }

  async checkAuthAndRoute() {
    const session = window.stateManager ? window.stateManager.getAuthSession() : null;

    if (session && session.user && session.user.role) {
      console.log(`Authenticated as ${session.user.name} (${session.user.role})`);
      this.switchPortal(session.user.role);
    } else {
      console.log("No active user session. Showing Login Portal.");
      this.switchPortal('auth');
    }
  }

  switchPortal(role) {
    // 1. If trying to access a portal without being authenticated, force 'auth'
    if (role !== 'auth' && (!window.stateManager || !window.stateManager.isAuthenticated())) {
      this.switchPortal('auth');
      return;
    }

    // 2. Role Guard: Prevent unauthorized access to other roles' dashboards
    if (role !== 'auth' && window.stateManager && !window.stateManager.canAccessRole(role)) {
      const currentRole = window.stateManager.getRole();
      console.warn(`Access Denied: ${currentRole} cannot access ${role}`);
      this.showUnauthorizedWarning(role);
      return;
    }

    this.currentPortal = role;
    if (window.stateManager && role !== 'auth') {
      window.stateManager.state.currentRole = role;
      window.stateManager.saveState();
    }

    // Update portal display (Show active portal, hide others)
    document.querySelectorAll('.portal-view').forEach(view => {
      view.classList.toggle('d-none', view.id !== `portal-${role}`);
    });

    // Update Header with active user profile or hide when on auth page
    this.updateHeaderProfile();

    // Render active portal views
    if (role === 'patient' && window.patientPortal) {
      window.patientPortal.init();
    } else if (role === 'guardian' && window.guardianPortal) {
      window.guardianPortal.init();
    } else if (role === 'admin' && window.adminPortal) {
      window.adminPortal.render();
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  showUnauthorizedWarning(targetRole) {
    const modalEl = document.getElementById('unauthorizedModal');
    const msgEl = document.getElementById('unauthorizedMsg');
    const currentRole = window.stateManager ? window.stateManager.getRole() : 'user';

    if (msgEl) {
      msgEl.textContent = `You are signed in with the ${currentRole.toUpperCase()} role. You do not have permission to access the ${targetRole.toUpperCase()} portal.`;
    }

    if (modalEl) {
      const bsModal = new bootstrap.Modal(modalEl);
      bsModal.show();
    }
  }

  redirectToAuthorizedPortal() {
    const role = window.stateManager ? window.stateManager.getRole() : 'auth';
    this.switchPortal(role || 'auth');
  }

  updateHeaderProfile() {
    const profileContainer = document.getElementById('userHeaderProfile');
    const notifContainer = document.getElementById('notificationDropdownContainer');
    if (!profileContainer) return;

    if (!window.stateManager || !window.stateManager.isAuthenticated() || this.currentPortal === 'auth') {
      profileContainer.classList.add('d-none');
      if (notifContainer) notifContainer.classList.add('d-none');
      return;
    }

    const user = window.stateManager.getAuthUser();
    if (!user) {
      profileContainer.classList.add('d-none');
      return;
    }

    profileContainer.classList.remove('d-none');
    if (notifContainer) notifContainer.classList.remove('d-none');

    const nameEl = document.getElementById('userProfileName');
    const avatarEl = document.getElementById('userProfileAvatar');
    const badgeEl = document.getElementById('userProfileRoleBadge');

    if (nameEl) nameEl.textContent = user.name || user.email;

    if (avatarEl) {
      if (user.role === 'patient') avatarEl.textContent = '👴';
      else if (user.role === 'guardian') avatarEl.textContent = '👩‍💼';
      else avatarEl.textContent = '⚙️';
    }

    if (badgeEl) {
      badgeEl.textContent = user.role.toUpperCase();
      badgeEl.className = `badge ms-1 ${user.role === 'patient' ? 'bg-success' : (user.role === 'guardian' ? 'bg-teal text-white' : 'bg-secondary')}`;
    }
  }

  updateAuthBackendStatus() {
    const statusEl = document.getElementById('authBackendStatus');
    if (!statusEl) return;

    const isSupabase = window.supabaseService && window.supabaseService.isConfigured();

    if (isSupabase) {
      statusEl.innerHTML = `
        <span class="badge bg-success-subtle text-success border border-success p-2 px-3">
          <i class="bi bi-cloud-check-fill me-1"></i> Supabase Cloud Authentication & RLS Active
        </span>
      `;
    } else {
      statusEl.innerHTML = `
        <span class="badge bg-warning-subtle text-dark border border-warning p-2 px-3">
          <i class="bi bi-shield-exclamation text-warning me-1"></i> Prototype Demo Authentication (Client-side mock mode &bull; Add Supabase in .env for production)
        </span>
      `;
    }
  }

  // Quick Login for Judges & Testing
  async quickLogin(role) {
    let email = "ramesh@meditrack.demo";
    if (role === 'guardian') email = "priya@meditrack.demo";
    else if (role === 'admin') email = "admin@meditrack.demo";

    const res = await window.supabaseService.signIn(email, "demo123", role);
    if (res.success) {
      window.stateManager.login(res.session);
      this.switchPortal(role);

      const welcomeMsg = `Welcome, ${res.session.user.name}! Redirected to your authorized ${role.toUpperCase()} dashboard.`;
      console.log(welcomeMsg);
      if (window.notificationManager) {
        window.notificationManager.playChime('normal');
      }
    }
  }

  // Logout Handler
  logout() {
    if (window.stateManager) {
      window.stateManager.logout();
    }
    this.switchPortal('auth');
    this.showAuthAlert("You have signed out successfully.", "info");
  }

  showAuthAlert(message, type = "danger") {
    const alertEl = document.getElementById('authAlert');
    if (!alertEl) return;
    alertEl.className = `alert alert-${type} py-2 px-3 small`;
    alertEl.textContent = message;
    alertEl.classList.remove('d-none');
    setTimeout(() => {
      alertEl.classList.add('d-none');
    }, 6000);
  }

  bindAuthEvents() {
    // 1. Auth Tabs: Sign In / Register / Forgot Password
    const tabBtns = document.querySelectorAll('.auth-tab-btn');
    const signInForm = document.getElementById('signInForm');
    const regForm = document.getElementById('registerForm');
    const forgotForm = document.getElementById('forgotPasswordForm');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = e.currentTarget.getAttribute('data-auth-tab');
        tabBtns.forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');

        if (signInForm) signInForm.classList.toggle('d-none', tab !== 'signin');
        if (regForm) regForm.classList.toggle('d-none', tab !== 'register');
        if (forgotForm) forgotForm.classList.toggle('d-none', tab !== 'forgot');
      });
    });

    // 2. Register Role Radio (shows connection code if Guardian)
    const roleRadios = document.querySelectorAll('input[name="regRole"]');
    const codeGroup = document.getElementById('regConnectionCodeGroup');
    roleRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        if (codeGroup) {
          codeGroup.classList.toggle('d-none', e.target.value !== 'guardian');
        }
      });
    });

    // 3. Sign In Form Submission
    if (signInForm) {
      signInForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        const roleHint = document.getElementById('loginRoleHint').value;

        const res = await window.supabaseService.signIn(email, password, roleHint);
        if (res.success) {
          window.stateManager.login(res.session);
          this.switchPortal(res.session.user.role);
        } else {
          this.showAuthAlert(res.error || "Invalid email or password. Please try again.", "danger");
        }
      });
    }

    // 4. Register Form Submission
    if (regForm) {
      regForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const fullName = document.getElementById('regFullName').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const password = document.getElementById('regPassword').value;
        const role = document.querySelector('input[name="regRole"]:checked').value;
        const connectionCode = document.getElementById('regConnectionCode') ? document.getElementById('regConnectionCode').value.trim() : '';

        const res = await window.supabaseService.signUp(email, password, {
          fullName,
          role,
          connectionCode
        });

        if (res.success) {
          if (res.session) {
            window.stateManager.login(res.session);
            this.switchPortal(res.session.user.role);
          } else {
            this.showAuthAlert(res.message, "success");
            // Switch to sign in tab
            document.getElementById('tabBtnSignIn').click();
          }
        } else {
          this.showAuthAlert(res.error || "Failed to create account.", "danger");
        }
      });
    }

    // 5. Forgot Password Form Submission
    if (forgotForm) {
      forgotForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('forgotEmail').value.trim();
        const res = await window.supabaseService.resetPassword(email);
        if (res.success) {
          this.showAuthAlert(res.message, "success");
        } else {
          this.showAuthAlert(res.error || "Failed to send reset link.", "danger");
        }
      });
    }

    // 6. Header Logout Button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        this.logout();
      });
    }
  }

  bindGlobalEvents() {
    // Language Switcher
    const langSelector = document.getElementById('globalLanguageSelect');
    if (langSelector) {
      langSelector.value = window.i18n ? window.i18n.getLang() : 'en';
      langSelector.addEventListener('change', (e) => {
        if (window.i18n) window.i18n.setLang(e.target.value);
      });
    }

    // Font Size Switcher
    document.querySelectorAll('[data-font-size]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const size = e.currentTarget.getAttribute('data-font-size');
        if (window.stateManager) window.stateManager.setFontSize(size);
      });
    });

    // High Contrast Toggle
    const contrastBtn = document.getElementById('toggleHighContrastBtn');
    if (contrastBtn) {
      contrastBtn.addEventListener('click', () => {
        const current = window.stateManager.state.preferences.highContrast;
        window.stateManager.setHighContrast(!current);
      });
    }

    // Network offline notification banner
    window.addEventListener('networkStatusChanged', (e) => {
      const banner = document.getElementById('offlineBanner');
      if (banner) {
        banner.classList.toggle('active', !e.detail.isOnline);
      }
    });

    // Listen for language changed events to re-render views
    window.addEventListener('languageChanged', () => {
      if (this.currentPortal === 'patient' && window.patientPortal) {
        window.patientPortal.render();
      } else if (this.currentPortal === 'guardian' && window.guardianPortal) {
        window.guardianPortal.render();
      }
    });
  }

  bindVoiceUI() {
    const micBtn = document.getElementById('voiceMicBtn');
    const transcriptEl = document.getElementById('voiceTranscript');

    if (!micBtn || !window.voiceAssistant) return;

    micBtn.addEventListener('click', () => {
      window.voiceAssistant.toggleListening();
    });

    // Wire callbacks
    window.voiceAssistant.transcriptCallback = (text, isFinal) => {
      if (transcriptEl) {
        transcriptEl.textContent = text || window.i18n.t('voice_listening');
      }
    };

    window.voiceAssistant.statusCallback = (status) => {
      if (micBtn) {
        micBtn.classList.toggle('is-active', status === 'listening');
      }
      if (transcriptEl && status === 'idle' && !transcriptEl.textContent) {
        transcriptEl.textContent = window.i18n.t('voice_tap_to_speak');
      }
    };
  }

  simulateVoice(commandText) {
    const transcriptEl = document.getElementById('voiceTranscript');
    if (transcriptEl) {
      transcriptEl.textContent = `"${commandText}"`;
    }
    if (window.voiceAssistant) {
      window.voiceAssistant.handleCommand(commandText);
    }
  }

  bindFormHandlers() {
    // Add Medicine Form
    const addMedForm = document.getElementById('addMedicineForm');
    if (addMedForm) {
      addMedForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const brand = document.getElementById('medBrandName').value.trim();
        const name = document.getElementById('medGenericName').value.trim() || brand;
        const dosage = document.getElementById('medDosage').value.trim();
        const type = document.getElementById('medType').value;
        const color = document.getElementById('medColor').value.trim();
        const shape = document.getElementById('medShape').value.trim();
        const instructions = document.getElementById('medInstructions').value.trim();
        const qty = parseInt(document.getElementById('medCurrentQty').value, 10) || 30;
        const expiry = document.getElementById('medExpiryDate').value || "2027-12-31";
        const timeSlot = document.getElementById('medScheduleSlot').value;
        const time = document.getElementById('medScheduleTime').value || "08:30";

        const newMed = {
          name: name,
          brandName: brand,
          category: "General Prescription",
          type: type,
          dosage: dosage,
          visual: {
            color: color || "White",
            colorHindi: color || "सफेद",
            shape: shape || "Tablet",
            shapeHindi: shape || "गोली",
            markings: "Prescribed",
            image: type === 'Capsule' ? "assets/pills/generic-pill.svg" : "assets/pills/metformin.svg"
          },
          instructions: instructions,
          instructionsHindi: instructions,
          mealRelation: "after_meal",
          schedule: [
            { timeSlot: timeSlot, time: time, label: "Scheduled", labelHindi: "निर्धारित" }
          ],
          stock: {
            currentQty: qty,
            unit: type === 'Capsule' ? "capsules" : "tablets",
            reorderThreshold: 7,
            refillDate: new Date().toISOString().split('T')[0],
            expiryDate: expiry
          },
          prescribedBy: "Dr. Rajesh Verma (Cardiologist)",
          prescriptionId: "rx-01",
          active: true
        };

        window.stateManager.saveMedicine(newMed);

        const modalEl = document.getElementById('addMedicineModal');
        const bsModal = bootstrap.Modal.getInstance(modalEl);
        if (bsModal) bsModal.hide();

        if (window.guardianPortal) window.guardianPortal.render();
        alert("New medicine added to patient regimen successfully!");
      });
    }

    // Upload Prescription Form
    const rxForm = document.getElementById('uploadPrescriptionForm');
    if (rxForm) {
      rxForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const drName = document.getElementById('rxDrName').value.trim();
        const clinic = document.getElementById('rxClinic').value.trim();
        const diagnosis = document.getElementById('rxDiagnosis').value.trim();
        const notes = document.getElementById('rxNotes').value.trim();
        const date = document.getElementById('rxDate').value || new Date().toISOString().split('T')[0];

        window.stateManager.addPrescription({
          doctorName: drName,
          specialty: "Consulting Physician",
          clinic: clinic,
          diagnosis: diagnosis,
          date: date,
          linkedMedicines: ["med-01", "med-02"],
          notes: notes,
          notesHindi: notes,
          fileName: `Rx_${drName.replace(/[^a-zA-Z]/g, '')}_${date}.pdf`
        });

        const modalEl = document.getElementById('uploadPrescriptionModal');
        const bsModal = bootstrap.Modal.getInstance(modalEl);
        if (bsModal) bsModal.hide();

        if (window.guardianPortal) window.guardianPortal.render();
        alert("Prescription document uploaded and stored in vault!");
      });
    }

    // Connect Patient by Code Form
    const pairForm = document.getElementById('pairPatientForm');
    if (pairForm) {
      pairForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const codeInput = document.getElementById('pairPatientCodeInput');
        const code = codeInput ? codeInput.value.trim() : '';

        const result = window.stateManager.connectPatient(code);
        alert(result.message);

        if (result.success) {
          codeInput.value = '';
          if (window.guardianPortal) window.guardianPortal.render();
        }
      });
    }

    // Record Caregiver Follow-Up Log Form
    const logForm = document.getElementById('addCaregiverLogForm');
    if (logForm) {
      logForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const action = document.getElementById('cgActionType').value;
        const notes = document.getElementById('cgNotes').value.trim();
        const followUp = document.getElementById('cgFollowUpCheck').checked;

        window.stateManager.addCaregiverLog(action, notes, followUp);

        const modalEl = document.getElementById('caregiverLogModal');
        const bsModal = bootstrap.Modal.getInstance(modalEl);
        if (bsModal) bsModal.hide();

        if (window.guardianPortal) window.guardianPortal.render();
        alert("Caregiver follow-up logged successfully!");
      });
    }
  }
}

const app = new MediTrackApp();
window.app = app;

document.addEventListener('DOMContentLoaded', () => {
  window.app.init();
});
