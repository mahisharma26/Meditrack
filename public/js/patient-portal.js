/**
 * MediTrack - Patient Portal Controller (Elderly-First Experience)
 * Manages Home, Pill Passport, Schedule, Memory Map, Prescriptions, Settings
 */

class PatientPortal {
  constructor() {
    this.activeTab = 'home';
  }

  init() {
    this.bindEvents();
    this.render();
  }

  bindEvents() {
    document.querySelectorAll('.patient-nav-tabs .nav-link').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = e.currentTarget.getAttribute('data-tab');
        if (tab) {
          this.switchTab(tab);
        }
      });
    });
  }

  switchTab(tabName) {
    this.activeTab = tabName;
    document.querySelectorAll('.patient-nav-tabs .nav-link').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tabName);
    });

    document.querySelectorAll('.patient-tab-content').forEach(section => {
      section.classList.toggle('d-none', section.id !== `patient-tab-${tabName}`);
    });

    this.renderActiveTab();
  }

  render() {
    this.renderHeaderGreeting();
    this.renderActiveTab();
  }

  renderActiveTab() {
    switch (this.activeTab) {
      case 'home':
        this.renderHome();
        break;
      case 'medicines':
        this.renderPillPassport();
        break;
      case 'schedule':
        this.renderSchedule();
        break;
      case 'progress':
        this.renderProgress();
        break;
      case 'prescriptions':
        this.renderPrescriptions();
        break;
      case 'settings':
        this.renderSettings();
        break;
    }
  }

  renderHeaderGreeting() {
    const greetingEl = document.getElementById('patientGreetingText');
    const dateEl = document.getElementById('patientDateText');
    const guardianStatusEl = document.getElementById('patientGuardianStatus');
    if (!greetingEl) return;

    const user = window.stateManager ? window.stateManager.state.user : null;
    const isHindi = window.i18n && window.i18n.getLang() === 'hi';

    const hour = new Date().getHours();
    let timeGreeting = isHindi ? "नमस्ते" : "Hello";
    if (hour < 12) timeGreeting = isHindi ? "सुप्रभात" : "Good morning";
    else if (hour < 17) timeGreeting = isHindi ? "नमस्कार" : "Good afternoon";
    else timeGreeting = isHindi ? "शुभ संध्या" : "Good evening";

    const name = isHindi ? (user.nameHindi || user.name) : user.name;
    greetingEl.textContent = `${timeGreeting}, ${name}!`;

    if (dateEl) {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const todayFormatted = new Date("2026-11-21T10:00:00").toLocaleDateString(isHindi ? 'hi-IN' : 'en-US', options);
      dateEl.textContent = `${isHindi ? 'आज की तारीख' : 'Today is'} ${todayFormatted}`;
    }

    if (guardianStatusEl && user.connectedGuardians && user.connectedGuardians.length > 0) {
      const g = user.connectedGuardians[0];
      const gName = isHindi ? (g.nameHindi || g.name) : g.name;
      guardianStatusEl.innerHTML = `
        <span class="guardian-status-pill">
          <i class="bi bi-shield-check text-success fs-5"></i>
          <span>${window.i18n.t('connected_to')} <strong>${gName}</strong> (${g.relationship}) &bull; ${window.i18n.t('online')}</span>
        </span>
      `;
    }
  }

  // Find next dose to take
  getNextDose() {
    const state = window.stateManager ? window.stateManager.state : null;
    if (!state) return null;

    const todayStr = state.todayStr || "2026-11-21";
    const history = state.adherenceHistory[todayStr] || { doses: {} };

    // Find all scheduled doses for today
    const scheduledDoses = [];
    state.medicines.forEach(med => {
      if (!med.active || med.isSOS) return;
      med.schedule.forEach(slot => {
        const key = `${med.id}_${slot.timeSlot}`;
        const doseRecord = history.doses[key];
        const isTaken = doseRecord && doseRecord.taken;

        scheduledDoses.push({
          med,
          slot,
          key,
          isTaken,
          doseRecord
        });
      });
    });

    // Return first unconfirmed dose
    return scheduledDoses.find(d => !d.isTaken) || null;
  }

  // 1. HOME TAB
  renderHome() {
    this.renderNextDoseHero();
    this.renderDoseCounts();
    this.renderTodayScheduleSnippet();
  }

  renderNextDoseHero() {
    const heroContainer = document.getElementById('heroNextDoseContainer');
    if (!heroContainer) return;

    const nextDose = this.getNextDose();
    const isHindi = window.i18n && window.i18n.getLang() === 'hi';

    if (!nextDose) {
      // All doses taken!
      heroContainer.innerHTML = `
        <div class="hero-next-dose-card bg-success-subtle border-success text-center py-5">
          <div class="mb-3">
            <i class="bi bi-patch-check-fill text-success" style="font-size: 4rem;"></i>
          </div>
          <h2 class="fw-bold text-success mb-2">
            ${isHindi ? 'आज की सभी तय दवाएं पूरी हुईं!' : 'All Medicines Taken For Today!'}
          </h2>
          <p class="lead mb-4 text-dark">
            ${isHindi 
              ? 'रमेश जी, आपने आज की सभी दवाएं समय पर ले ली हैं। आपका स्वास्थ्य हमारी प्राथमिकता है।' 
              : 'Wonderful job Ramesh-ji! You have taken all your scheduled doses for today. Rest well.'}
          </p>
          <div class="d-flex justify-content-center gap-3">
            <button class="btn btn-elderly btn-elderly-outline" onclick="window.patientPortal.openContactModal()">
              <i class="bi bi-telephone-fill"></i> ${window.i18n.t('contact_guardian_btn')}
            </button>
            <button class="btn btn-elderly btn-elderly-sage" onclick="window.patientPortal.switchTab('medicines')">
              <i class="bi bi-capsule"></i> ${window.i18n.t('nav_medicines')}
            </button>
          </div>
        </div>
      `;
      return;
    }

    const { med, slot, key } = nextDose;
    const medName = isHindi && med.brandName ? med.brandName : (med.brandName || med.name);
    const genericName = med.name !== med.brandName ? `(${med.name})` : '';
    const instructions = isHindi ? (med.instructionsHindi || med.instructions) : med.instructions;
    const timeLabel = isHindi ? (slot.labelHindi || slot.label) : slot.label;

    // Check if expired
    const isExpired = new Date(med.stock.expiryDate) < new Date("2026-11-21");

    heroContainer.innerHTML = `
      <div class="hero-next-dose-card ${isExpired ? 'border-danger' : ''}">
        <div class="d-flex flex-wrap justify-content-between align-items-center mb-3">
          <span class="brand-badge fs-6">
            <i class="bi bi-bell-fill text-warning"></i>
            ${window.i18n.t('hero_title')}
          </span>
          <span class="hero-time-badge badge-due">
            <i class="bi bi-clock-history"></i>
            ${timeLabel} &bull; ${slot.time}
          </span>
        </div>

        <div class="d-flex flex-column flex-md-row gap-4 align-items-center mb-4">
          <div class="hero-pill-preview">
            <img src="${med.visual.image || 'assets/pills/generic-pill.svg'}" alt="${medName} Pill Visual Reference" class="img-fluid" />
          </div>

          <div class="flex-grow-1 text-center text-md-start">
            <h2 class="display-6 fw-bold mb-1 text-dark">${medName}</h2>
            <div class="text-muted fs-5 mb-2">${genericName}</div>
            
            <div class="d-flex flex-wrap gap-2 justify-content-center justify-content-md-start mb-3">
              <span class="badge bg-light text-dark border fs-6 px-3 py-2">
                <i class="bi bi-droplet-half me-1"></i> ${med.dosage}
              </span>
              <span class="badge bg-light text-dark border fs-6 px-3 py-2">
                <i class="bi bi-info-circle me-1"></i> ${isHindi ? med.visual.colorHindi : med.visual.color} (${isHindi ? med.visual.shapeHindi : med.visual.shape})
              </span>
              ${med.stock.currentQty <= med.stock.reorderThreshold ? `
                <span class="badge bg-warning text-dark fs-6 px-3 py-2">
                  <i class="bi bi-exclamation-triangle-fill me-1"></i> ${window.i18n.t('supply_low_notice')}
                </span>
              ` : ''}
            </div>

            <div class="p-3 bg-white rounded-3 border">
              <strong class="d-block text-secondary fs-6 mb-1">
                <i class="bi bi-cup-straw text-teal me-1"></i> ${window.i18n.t('how_to_take')}:
              </strong>
              <p class="mb-0 fs-5 text-dark fw-bold">${instructions}</p>
            </div>
          </div>
        </div>

        ${isExpired ? `
          <div class="alert alert-danger fs-5 fw-bold mb-4">
            <i class="bi bi-slash-circle-fill me-2"></i> ${window.i18n.t('status_expired')}
          </div>
        ` : `
          <!-- Three Large Elderly-First Action Buttons -->
          <div class="patient-action-grid">
            <button class="btn-action-taken" onclick="window.patientPortal.showTakeDoseModal('${med.id}', '${slot.timeSlot}')" aria-label="I have taken this medicine">
              <i class="bi bi-check-circle-fill fs-3"></i>
              <span>${window.i18n.t('take_dose_btn')}</span>
            </button>

            <button class="btn-action-later" onclick="window.patientPortal.showSnoozeModal()" aria-label="Remind me later">
              <i class="bi bi-alarm fs-4"></i>
              <span>${window.i18n.t('remind_later_btn')}</span>
            </button>

            <button class="btn-action-contact" onclick="window.patientPortal.openContactModal()" aria-label="Contact your family guardian">
              <i class="bi bi-telephone-fill fs-4"></i>
              <span>${window.i18n.t('contact_guardian_btn')}</span>
            </button>
          </div>
        `}
      </div>
    `;
  }

  renderDoseCounts() {
    const countContainer = document.getElementById('patientDoseCounts');
    if (!countContainer) return;

    const state = window.stateManager ? window.stateManager.state : null;
    const todayStr = state.todayStr || "2026-11-21";
    const history = state.adherenceHistory[todayStr] || { doses: {} };

    let taken = 0;
    let upcoming = 0;
    let pending = 0;

    state.medicines.forEach(m => {
      if (!m.active || m.isSOS) return;
      m.schedule.forEach(s => {
        const key = `${m.id}_${s.timeSlot}`;
        const dose = history.doses[key];
        if (dose && dose.taken) {
          taken++;
        } else if (dose && dose.alertGenerated) {
          pending++;
        } else {
          upcoming++;
        }
      });
    });

    const total = taken + upcoming + pending;
    const progressPercent = total > 0 ? Math.round((taken / total) * 100) : 0;

    countContainer.innerHTML = `
      <div class="row g-3">
        <div class="col-md-4">
          <div class="card-soft text-center py-3 bg-white">
            <div class="text-success fs-1 fw-bold mb-1">${taken}</div>
            <div class="text-secondary fw-bold fs-5">${window.i18n.t('taken_count')}</div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card-soft text-center py-3 bg-white">
            <div class="text-primary fs-1 fw-bold mb-1">${upcoming}</div>
            <div class="text-secondary fw-bold fs-5">${window.i18n.t('upcoming_count')}</div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card-soft text-center py-3 bg-white">
            <div class="text-warning fs-1 fw-bold mb-1">${pending}</div>
            <div class="text-secondary fw-bold fs-5">${window.i18n.t('pending_count')}</div>
          </div>
        </div>
      </div>

      <div class="daily-progress-box mt-3">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <strong class="fs-5">${window.i18n.t('daily_progress')}</strong>
          <span class="badge bg-teal fs-6 px-3 py-2 text-white">${progressPercent}% Complete</span>
        </div>
        <div class="progress progress-elderly">
          <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style="width: ${progressPercent}%;" aria-valuenow="${progressPercent}" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
      </div>
    `;
  }

  renderTodayScheduleSnippet() {
    const listContainer = document.getElementById('todayScheduleList');
    if (!listContainer) return;

    const state = window.stateManager ? window.stateManager.state : null;
    const todayStr = state.todayStr || "2026-11-21";
    const history = state.adherenceHistory[todayStr] || { doses: {} };
    const isHindi = window.i18n && window.i18n.getLang() === 'hi';

    let html = '';

    state.medicines.forEach(med => {
      if (!med.active || med.isSOS) return;

      med.schedule.forEach(slot => {
        const key = `${med.id}_${slot.timeSlot}`;
        const doseRecord = history.doses[key];
        const isTaken = doseRecord && doseRecord.taken;
        const medName = isHindi && med.brandName ? med.brandName : (med.brandName || med.name);

        html += `
          <div class="schedule-item-card ${isTaken ? 'is-taken' : 'is-pending'}">
            <div class="schedule-item-pill-icon">
              <img src="${med.visual.image || 'assets/pills/generic-pill.svg'}" alt="${medName}" />
            </div>
            <div class="flex-grow-1">
              <div class="d-flex justify-content-between align-items-start">
                <h4 class="mb-1 fw-bold">${medName} (${med.dosage})</h4>
                <span class="badge ${isTaken ? 'bg-success' : 'bg-warning text-dark'} fs-6 px-3 py-2">
                  ${isTaken ? `<i class="bi bi-check-lg me-1"></i> ${window.i18n.t('taken_count')}` : slot.time}
                </span>
              </div>
              <p class="mb-0 text-muted fs-6">
                ${isHindi ? (slot.labelHindi || slot.label) : slot.label} &bull; 
                ${isHindi ? (med.instructionsHindi || med.instructions) : med.instructions}
              </p>
              ${isTaken && doseRecord.time ? `
                <div class="small text-success mt-1">
                  <i class="bi bi-clock-check me-1"></i> ${window.i18n.t('confirmed_at')}: ${doseRecord.time} (${doseRecord.confirmedBy || 'patient'})
                </div>
              ` : ''}
            </div>
          </div>
        `;
      });
    });

    listContainer.innerHTML = html;
  }

  // 2. PILL PASSPORT TAB
  renderPillPassport() {
    const passportContainer = document.getElementById('pillPassportGrid');
    if (!passportContainer) return;

    const state = window.stateManager ? window.stateManager.state : null;
    const isHindi = window.i18n && window.i18n.getLang() === 'hi';

    let html = `
      <div class="col-12 mb-3">
        <div class="alert alert-warning border-2 p-3 rounded-4 d-flex align-items-start gap-3">
          <i class="bi bi-shield-exclamation fs-2 text-warning flex-shrink-0"></i>
          <div>
            <strong class="d-block fs-5 text-dark mb-1">${isHindi ? 'दवा पहचान सुरक्षा सूचना' : 'Safety Notice'}</strong>
            <p class="mb-0 small text-secondary">${window.i18n.t('passport_disclaimer')}</p>
          </div>
        </div>
      </div>
    `;

    state.medicines.forEach(med => {
      const medName = isHindi && med.brandName ? med.brandName : (med.brandName || med.name);
      const instructions = isHindi ? (med.instructionsHindi || med.instructions) : med.instructions;
      const dailyDoses = med.schedule.length || 1;
      const daysRemaining = Math.floor(med.stock.currentQty / dailyDoses);
      const isLowStock = med.stock.currentQty <= med.stock.reorderThreshold;

      html += `
        <div class="col-md-6 col-lg-4 mb-4">
          <div class="pill-passport-card">
            <div class="pill-passport-visual-header">
              <img src="${med.visual.image || 'assets/pills/generic-pill.svg'}" alt="${medName} visual pill image" />
            </div>
            <div class="p-4 flex-grow-1 d-flex flex-column">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <h3 class="fw-bold fs-4 mb-0 text-dark">${medName}</h3>
                <span class="badge bg-teal text-white fs-6 px-2 py-1">${med.type}</span>
              </div>
              <div class="text-muted small mb-3">${med.name}</div>

              <div class="d-flex flex-wrap gap-2 mb-3">
                <span class="pill-trait-badge"><i class="bi bi-palette me-1"></i> ${isHindi ? med.visual.colorHindi : med.visual.color}</span>
                <span class="pill-trait-badge"><i class="bi bi-circle me-1"></i> ${isHindi ? med.visual.shapeHindi : med.visual.shape}</span>
                <span class="pill-trait-badge"><i class="bi bi-hash me-1"></i> ${med.visual.markings}</span>
              </div>

              <div class="bg-light p-3 rounded-3 mb-3 border">
                <div class="small fw-bold text-secondary mb-1">${window.i18n.t('how_to_take')}:</div>
                <div class="fw-bold fs-6 text-dark">${instructions}</div>
              </div>

              <div class="mt-auto pt-3 border-top d-flex justify-content-between align-items-center">
                <div>
                  <small class="text-muted d-block">${window.i18n.t('stock_remaining')}</small>
                  <strong class="fs-5 ${isLowStock ? 'text-danger' : 'text-dark'}">${med.stock.currentQty} ${med.stock.unit}</strong>
                </div>
                <div class="text-end">
                  <small class="text-muted d-block">${window.i18n.t('days_stock')}</small>
                  <strong class="badge ${isLowStock ? 'bg-danger' : 'bg-success'} fs-6 px-3 py-2">~${daysRemaining} ${window.i18n.t('days_left')}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    });

    passportContainer.innerHTML = html;
  }

  // 3. SCHEDULE TAB
  renderSchedule() {
    this.renderTodayScheduleSnippet();
    const fullListContainer = document.getElementById('patientScheduleFullList');
    if (!fullListContainer) return;

    const state = window.stateManager ? window.stateManager.state : null;
    const todayStr = state.todayStr || "2026-11-21";
    const history = state.adherenceHistory[todayStr] || { doses: {} };
    const isHindi = window.i18n && window.i18n.getLang() === 'hi';

    const slots = [
      { key: 'morning', label: isHindi ? 'सुबह (8:00 AM - 10:00 AM)' : 'Morning (8:00 AM - 10:00 AM)', icon: 'bi-sun-fill text-warning' },
      { key: 'afternoon', label: isHindi ? 'दोपहर (1:00 PM - 2:30 PM)' : 'Afternoon (1:00 PM - 2:30 PM)', icon: 'bi-brightness-high-fill text-warning' },
      { key: 'evening', label: isHindi ? 'शाम (6:00 PM - 8:00 PM)' : 'Evening (6:00 PM - 8:00 PM)', icon: 'bi-sunset-fill text-danger' },
      { key: 'night', label: isHindi ? 'रात सोने से पहले (9:00 PM - 10:30 PM)' : 'Night Bedtime (9:00 PM - 10:30 PM)', icon: 'bi-moon-stars-fill text-primary' }
    ];

    let html = '';

    slots.forEach(slotInfo => {
      const slotMeds = [];
      state.medicines.forEach(m => {
        if (!m.active || m.isSOS) return;
        m.schedule.forEach(s => {
          if (s.timeSlot === slotInfo.key) {
            slotMeds.push({ med: m, slot: s });
          }
        });
      });

      html += `
        <div class="card-soft mb-4">
          <div class="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom">
            <i class="bi ${slotInfo.icon} fs-4"></i>
            <h3 class="fs-4 fw-bold mb-0">${slotInfo.label}</h3>
          </div>
      `;

      if (slotMeds.length === 0) {
        html += `<p class="text-muted fs-6 mb-0">${isHindi ? 'इस समय कोई दवा निर्धारित नहीं है।' : 'No medicines scheduled for this time slot.'}</p>`;
      } else {
        html += `<div class="d-flex flex-column gap-3">`;
        slotMeds.forEach(({ med, slot }) => {
          const key = `${med.id}_${slot.timeSlot}`;
          const doseRecord = history.doses[key];
          const isTaken = doseRecord && doseRecord.taken;
          const medName = isHindi && med.brandName ? med.brandName : (med.brandName || med.name);

          html += `
            <div class="p-3 border rounded-3 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 ${isTaken ? 'bg-success-subtle border-success' : 'bg-light'}">
              <div class="d-flex align-items-center gap-3">
                <img src="${med.visual.image || 'assets/pills/generic-pill.svg'}" width="50" height="50" alt="" />
                <div>
                  <h4 class="fs-5 fw-bold mb-1">${medName} (${med.dosage})</h4>
                  <div class="text-secondary small">
                    <i class="bi bi-clock me-1"></i> ${slot.time} &bull; ${isHindi ? (med.instructionsHindi || med.instructions) : med.instructions}
                  </div>
                </div>
              </div>
              <div>
                ${isTaken ? `
                  <span class="badge bg-success fs-6 px-3 py-2">
                    <i class="bi bi-check-circle-fill me-1"></i> ${isHindi ? 'ली गई' : 'Taken at'} ${doseRecord.time.slice(0, 5)}
                  </span>
                ` : `
                  <button class="btn btn-elderly-teal btn-sm" onclick="window.patientPortal.showTakeDoseModal('${med.id}', '${slot.timeSlot}')">
                    <i class="bi bi-check-lg me-1"></i> ${window.i18n.t('take_dose_btn')}
                  </button>
                `}
              </div>
            </div>
          `;
        });
        html += `</div>`;
      }

      html += `</div>`;
    });

    // Add SOS Section
    const sosMeds = state.medicines.filter(m => m.isSOS);
    if (sosMeds.length > 0) {
      html += `
        <div class="card-soft mb-4 border-warning">
          <div class="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom">
            <i class="bi bi-bandaid-fill fs-4 text-warning"></i>
            <h3 class="fs-4 fw-bold mb-0">${isHindi ? 'जरूरत पड़ने पर (दर्द निवारक SOS)' : 'As Needed / SOS Medications'}</h3>
          </div>
          <div class="d-flex flex-column gap-3">
      `;
      sosMeds.forEach(med => {
        const medName = isHindi && med.brandName ? med.brandName : (med.brandName || med.name);
        html += `
          <div class="p-3 border rounded-3 d-flex justify-content-between align-items-center bg-light">
            <div class="d-flex align-items-center gap-3">
              <img src="${med.visual.image || 'assets/pills/paracetamol.svg'}" width="50" height="50" alt="" />
              <div>
                <h4 class="fs-5 fw-bold mb-1">${medName} (${med.dosage})</h4>
                <div class="text-muted small">${isHindi ? (med.instructionsHindi || med.instructions) : med.instructions}</div>
              </div>
            </div>
            <button class="btn btn-outline-warning text-dark btn-sm" onclick="alert('Please consult with Priya or doctor before taking emergency SOS medication.')">
              <i class="bi bi-info-circle me-1"></i> View Instructions
            </button>
          </div>
        `;
      });
      html += `</div></div>`;
    }

    fullListContainer.innerHTML = html;
  }

  // 4. PROGRESS TAB (MEMORY MAP HEATMAP)
  renderProgress() {
    if (window.adherenceEngine) {
      window.adherenceEngine.renderHeatmap('patientHeatmapContainer', false);
    }

    const statsBox = document.getElementById('patientAdherenceStats');
    if (statsBox && window.adherenceEngine) {
      const stats = window.adherenceEngine.get30DayStats();
      statsBox.innerHTML = `
        <div class="row g-3 text-center">
          <div class="col-md-4">
            <div class="p-3 bg-white rounded-4 border">
              <div class="fs-1 fw-bold text-teal mb-1">${stats.adherenceRate}%</div>
              <div class="text-secondary fw-bold">${window.i18n.t('monthly_adherence')}</div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="p-3 bg-white rounded-4 border">
              <div class="fs-1 fw-bold text-success mb-1">${stats.totalConfirmedDoses}</div>
              <div class="text-secondary fw-bold">${window.i18n.t('total_confirmed_doses')}</div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="p-3 bg-white rounded-4 border">
              <div class="fs-1 fw-bold text-danger mb-1">${stats.totalUnconfirmedDoses}</div>
              <div class="text-secondary fw-bold">${window.i18n.t('total_unconfirmed_doses')}</div>
            </div>
          </div>
        </div>
      `;
    }
  }

  // 5. PRESCRIPTIONS TAB
  renderPrescriptions() {
    const container = document.getElementById('patientPrescriptionsList');
    if (!container) return;

    const state = window.stateManager ? window.stateManager.state : null;
    const isHindi = window.i18n && window.i18n.getLang() === 'hi';

    let html = '';
    state.prescriptions.forEach(rx => {
      const linkedMedNames = rx.linkedMedicines.map(id => {
        const m = state.medicines.find(x => x.id === id);
        return m ? (m.brandName || m.name) : id;
      }).join(', ');

      html += `
        <div class="card-soft mb-4">
          <div class="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3 mb-3">
            <div>
              <span class="badge bg-teal text-white fs-6 px-3 py-1 mb-2">
                <i class="bi bi-file-earmark-medical me-1"></i> ${rx.doctorName}
              </span>
              <h3 class="fw-bold fs-4 mb-1">${rx.specialty}</h3>
              <div class="text-muted fs-6"><i class="bi bi-hospital me-1"></i> ${rx.clinic}</div>
            </div>
            <div class="text-md-end">
              <span class="badge bg-light text-dark border fs-6 px-3 py-2">
                <i class="bi bi-calendar3 me-1"></i> ${rx.date}
              </span>
            </div>
          </div>

          <div class="bg-light p-3 rounded-3 mb-3 border">
            <div class="row">
              <div class="col-md-6 mb-2 mb-md-0">
                <strong class="d-block text-secondary small">${window.i18n.t('diagnosis')}:</strong>
                <span class="fs-6 fw-bold text-dark">${rx.diagnosis}</span>
              </div>
              <div class="col-md-6">
                <strong class="d-block text-secondary small">${window.i18n.t('linked_meds')}:</strong>
                <span class="fs-6 text-teal fw-bold">${linkedMedNames}</span>
              </div>
            </div>
          </div>

          <div class="mb-3">
            <strong class="d-block text-secondary small mb-1">${window.i18n.t('dr_notes')}:</strong>
            <p class="mb-0 fs-6 text-dark">${isHindi && rx.notesHindi ? rx.notesHindi : rx.notes}</p>
          </div>

          <div class="d-flex justify-content-end gap-2 pt-2 border-top">
            <button class="btn btn-elderly-outline btn-sm px-4" onclick="window.patientPortal.openPrescriptionView('${rx.id}')">
              <i class="bi bi-eye-fill me-1"></i> ${window.i18n.t('view_prescription_btn')}
            </button>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  // 6. SETTINGS TAB
  renderSettings() {
    const codeEl = document.getElementById('patientSettingsCode');
    if (codeEl && window.stateManager) {
      codeEl.textContent = window.stateManager.state.user.connectionCode;
    }
  }

  // Modals & Action Handlers
  showTakeDoseModal(medId, timeSlot) {
    const modalEl = document.getElementById('confirmDoseModal');
    const medNameEl = document.getElementById('confirmDoseMedName');
    const btnConfirm = document.getElementById('confirmDoseActionBtn');
    const isHindi = window.i18n && window.i18n.getLang() === 'hi';

    const med = window.stateManager.state.medicines.find(m => m.id === medId);
    if (!med || !modalEl) return;

    const medName = isHindi && med.brandName ? med.brandName : (med.brandName || med.name);
    if (medNameEl) {
      medNameEl.textContent = `${medName} (${med.dosage})`;
    }

    if (btnConfirm) {
      btnConfirm.onclick = () => {
        const result = window.stateManager.confirmDose(medId, timeSlot, null, 'patient');
        if (result.success) {
          // Play confirmation chime
          if (window.notificationManager) {
            window.notificationManager.playChime('normal');
          }
          const bsModal = bootstrap.Modal.getInstance(modalEl);
          if (bsModal) bsModal.hide();

          // Refresh patient views
          this.render();

          // Speak confirmation in Hindi or English
          if (window.voiceAssistant) {
            const spokenMsg = isHindi 
              ? `${medName} की खुराक सफलतापूर्वक दर्ज कर ली गई है। बहुत अच्छा!` 
              : `Your dose of ${medName} has been recorded. Great job!`;
            window.voiceAssistant.speak(spokenMsg);
          }

          alert(window.i18n.t('dose_confirmed_toast'));
        }
      };
    }

    const bsModal = new bootstrap.Modal(modalEl);
    bsModal.show();
  }

  showSnoozeModal() {
    const modalEl = document.getElementById('snoozeModal');
    if (!modalEl) return;
    const bsModal = new bootstrap.Modal(modalEl);
    bsModal.show();
  }

  applySnooze(minutes) {
    if (window.stateManager) {
      window.stateManager.snoozeReminder(minutes);
    }
    const isHindi = window.i18n && window.i18n.getLang() === 'hi';
    const msg = isHindi 
      ? `${minutes} मिनट के लिए रीमाइंडर आगे बढ़ाया गया।` 
      : `Reminder snoozed for ${minutes} minutes.`;

    if (window.voiceAssistant) {
      window.voiceAssistant.speak(msg);
    }

    const modalEl = document.getElementById('snoozeModal');
    const bsModal = bootstrap.Modal.getInstance(modalEl);
    if (bsModal) bsModal.hide();

    alert(window.i18n.t('snooze_toast'));
  }

  openContactModal() {
    const modalEl = document.getElementById('contactGuardianModal');
    if (!modalEl) return;
    const bsModal = new bootstrap.Modal(modalEl);
    bsModal.show();
  }

  sendSOSMessage() {
    if (window.stateManager) {
      window.stateManager.addNotification({
        title: "SOS Assistance Requested",
        message: "Ramesh-ji pressed 'Contact Guardian' requesting assistance with medicines.",
        type: "SOS"
      });
    }

    const isHindi = window.i18n && window.i18n.getLang() === 'hi';
    if (window.voiceAssistant) {
      window.voiceAssistant.speak(isHindi ? "प्रिया को मदद का संदेश भेज दिया गया है।" : "Assistance message sent to Priya.");
    }

    alert(window.i18n.t('sos_sent_msg'));
    const modalEl = document.getElementById('contactGuardianModal');
    const bsModal = bootstrap.Modal.getInstance(modalEl);
    if (bsModal) bsModal.hide();
  }

  openPrescriptionView(rxId) {
    const rx = window.stateManager.state.prescriptions.find(p => p.id === rxId);
    if (!rx) return;

    const modalEl = document.getElementById('prescriptionDetailModal');
    const bodyEl = document.getElementById('prescriptionDetailBody');
    if (!modalEl || !bodyEl) return;

    bodyEl.innerHTML = `
      <div class="p-3 border rounded-3 bg-light">
        <h4 class="fw-bold text-teal mb-1">${rx.doctorName}</h4>
        <div class="text-muted mb-2">${rx.specialty} &bull; ${rx.clinic}</div>
        <p><strong>Date:</strong> ${rx.date}</p>
        <p><strong>Diagnosis:</strong> ${rx.diagnosis}</p>
        <p><strong>Doctor's Instructions:</strong> ${rx.notes}</p>
        <div class="text-center p-4 bg-white border rounded-3 mt-3">
          <i class="bi bi-file-earmark-pdf-fill text-danger" style="font-size: 3rem;"></i>
          <p class="mt-2 mb-0 fw-bold">${rx.fileName}</p>
          <small class="text-muted">Digital Prescription Record - Apollo / Max Healthcare</small>
        </div>
      </div>
    `;

    const bsModal = new bootstrap.Modal(modalEl);
    bsModal.show();
  }

  openEmergencyCard() {
    const modalEl = document.getElementById('emergencyCardModal');
    const bodyEl = document.getElementById('emergencyCardBody');
    if (!modalEl || !bodyEl) return;

    const state = window.stateManager.state;
    const ec = state.emergencyCard;

    bodyEl.innerHTML = `
      <div class="emergency-card-wrapper">
        <div class="emergency-header-strip">
          <h2 class="mb-0 fw-bold fs-3 text-white"><i class="bi bi-heart-pulse-fill me-2"></i> EMERGENCY MEDICAL CARD</h2>
          <span class="badge bg-white text-danger fs-5 px-3 py-1">BLOOD: ${ec.bloodGroup}</span>
        </div>

        <div class="row g-4 mb-4">
          <div class="col-md-6">
            <h4 class="fw-bold mb-1">${ec.patientName} (Age: ${ec.age}, ${ec.gender})</h4>
            <p class="text-muted fs-6 mb-0">Phone: ${state.user.phone}</p>
          </div>
          <div class="col-md-6 text-md-end">
            <strong class="d-block text-secondary">Preferred Hospital:</strong>
            <span class="fs-6 fw-bold text-dark">${ec.preferredHospital}</span>
          </div>
        </div>

        <div class="p-3 bg-danger-subtle border border-danger rounded-3 mb-3">
          <h5 class="fw-bold text-danger mb-1"><i class="bi bi-exclamation-octagon-fill me-2"></i> DRUG ALLERGIES (SEVERE):</h5>
          <ul class="mb-0 fs-6 fw-bold text-dark">
            ${ec.allergies.map(a => `<li>${a}</li>`).join('')}
          </ul>
        </div>

        <div class="p-3 bg-light border rounded-3 mb-3">
          <h5 class="fw-bold text-secondary mb-1">CHRONIC HEALTH CONDITIONS:</h5>
          <ul class="mb-0 fs-6">
            ${ec.chronicConditions.map(c => `<li>${c}</li>`).join('')}
          </ul>
        </div>

        <div class="p-3 bg-light border rounded-3 mb-3">
          <h5 class="fw-bold text-teal mb-2">CURRENT PRESCRIBED MEDICATIONS:</h5>
          <div class="table-responsive">
            <table class="table table-bordered mb-0">
              <thead class="table-secondary">
                <tr><th>Medicine</th><th>Dosage</th><th>Schedule</th><th>Prescribed By</th></tr>
              </thead>
              <tbody>
                ${state.medicines.map(m => `
                  <tr>
                    <td><strong>${m.brandName || m.name}</strong></td>
                    <td>${m.dosage}</td>
                    <td>${m.schedule.map(s => s.time).join(', ') || 'SOS'}</td>
                    <td>${m.prescribedBy}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <div class="p-3 bg-warning-subtle border border-warning rounded-3 mb-3">
          <h5 class="fw-bold text-dark mb-1">EMERGENCY CONTACTS:</h5>
          <div class="row">
            ${ec.emergencyContacts.map(c => `
              <div class="col-md-6">
                <strong>${c.name} (${c.relation})</strong><br />
                <a href="tel:${c.phone}" class="fs-5 text-dark fw-bold">${c.phone}</a>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="small text-muted text-center pt-2 border-top">
          ${ec.disclaimer}
        </div>
      </div>
    `;

    const bsModal = new bootstrap.Modal(modalEl);
    bsModal.show();
  }
}

const patientPortal = new PatientPortal();
window.patientPortal = patientPortal;
