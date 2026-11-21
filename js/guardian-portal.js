/**
 * MediTrack - Guardian Portal Controller (Family & Caregiver Command Hub)
 * Adherence charts, stock management, prescription vault, alerts, PDF export
 */

class GuardianPortal {
  constructor() {
    this.activeTab = 'overview';
    this.adherenceChart = null;
  }

  init() {
    this.bindEvents();
    this.render();
  }

  bindEvents() {
    document.querySelectorAll('.guardian-nav-tabs .nav-link').forEach(btn => {
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
    document.querySelectorAll('.guardian-nav-tabs .nav-link').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tabName);
    });

    document.querySelectorAll('.guardian-tab-content').forEach(section => {
      section.classList.toggle('d-none', section.id !== `guardian-tab-${tabName}`);
    });

    this.renderActiveTab();
  }

  render() {
    this.renderActiveTab();
  }

  renderActiveTab() {
    switch (this.activeTab) {
      case 'overview':
        this.renderOverview();
        break;
      case 'medicines':
        this.renderMedicinesManager();
        break;
      case 'stock':
        this.renderStockManager();
        break;
      case 'prescriptions':
        this.renderPrescriptionVault();
        break;
      case 'adherence':
        this.renderAdherenceDetails();
        break;
      case 'timeline':
        this.renderTimeline();
        break;
      case 'connect':
        this.renderConnectAndFamily();
        break;
      case 'followup':
        this.renderFollowUpLogs();
        break;
    }
  }

  // 1. GUARDIAN OVERVIEW TAB
  renderOverview() {
    this.renderAlertsBanner();
    this.renderAdherenceDonut();
    this.renderRecentActivity();
  }

  renderAlertsBanner() {
    const alertsContainer = document.getElementById('guardianAlertsContainer');
    if (!alertsContainer) return;

    const state = window.stateManager ? window.stateManager.state : null;
    const alerts = state ? state.alerts : [];
    const isHindi = window.i18n && window.i18n.getLang() === 'hi';

    if (alerts.length === 0) {
      alertsContainer.innerHTML = `
        <div class="alert alert-success border-2 rounded-4 p-3 d-flex align-items-center gap-3">
          <i class="bi bi-shield-check fs-2 text-success"></i>
          <div>
            <strong class="d-block fs-5">${window.i18n.t('no_alerts')}</strong>
            <span class="text-secondary small">Ramesh-ji's medication adherence is 92%. All supplies are sufficient.</span>
          </div>
        </div>
      `;
      return;
    }

    let html = '';
    alerts.forEach(alert => {
      let alertClass = 'alert-warning';
      let icon = 'bi-exclamation-triangle-fill';

      if (alert.type === 'DOSE_UNCONFIRMED') {
        alertClass = 'alert-urgent';
        icon = 'bi-clock-history';
      } else if (alert.type === 'EXPIRY_WARNING') {
        alertClass = 'alert-info';
        icon = 'bi-calendar-event';
      }

      html += `
        <div class="guardian-alert-card ${alertClass}">
          <div class="guardian-alert-icon"><i class="bi ${icon}"></i></div>
          <div class="flex-grow-1">
            <div class="d-flex justify-content-between align-items-start">
              <strong class="fs-5">${isHindi && alert.titleHindi ? alert.titleHindi : alert.title}</strong>
              <button class="btn btn-sm btn-outline-secondary rounded-pill py-0 px-2" onclick="window.stateManager.clearAlert('${alert.id}'); window.guardianPortal.renderAlertsBanner();">
                Dismiss
              </button>
            </div>
            <p class="mb-2 fs-6 mt-1">${isHindi && alert.messageHindi ? alert.messageHindi : alert.message}</p>
            
            ${alert.type === 'DOSE_UNCONFIRMED' ? `
              <div class="d-flex gap-2 mt-2">
                <a href="tel:+919876512345" class="btn btn-sm btn-danger">
                  <i class="bi bi-telephone-fill me-1"></i> Call Papa (+91 98765 12345)
                </a>
                <button class="btn btn-sm btn-outline-danger" onclick="window.guardianPortal.recordCaregiverDose('${alert.medicineId}', '${alert.timeSlot}')">
                  <i class="bi bi-check2-circle me-1"></i> Confirm Dose Taken (Spoke with Papa)
                </button>
              </div>
            ` : ''}

            ${alert.type === 'LOW_STOCK' ? `
              <button class="btn btn-sm btn-warning mt-1" onclick="window.guardianPortal.openStockAdjustModal('${alert.medicineId}')">
                <i class="bi bi-box-seam me-1"></i> Update Stock / Add Refill
              </button>
            ` : ''}
          </div>
        </div>
      `;
    });

    alertsContainer.innerHTML = html;
  }

  renderAdherenceDonut() {
    const canvas = document.getElementById('adherenceDonutChart');
    if (!canvas || !window.Chart) return;

    const stats = window.adherenceEngine ? window.adherenceEngine.get30DayStats() : { totalConfirmedDoses: 124, totalUnconfirmedDoses: 4 };

    if (this.adherenceChart) {
      this.adherenceChart.destroy();
    }

    const ctx = canvas.getContext('2d');
    this.adherenceChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Confirmed Doses', 'Unconfirmed / Pending'],
        datasets: [{
          data: [stats.totalConfirmedDoses, stats.totalUnconfirmedDoses],
          backgroundColor: ['#1A6B70', '#E2E8F0'],
          borderColor: ['#FFFFFF', '#FFFFFF'],
          borderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '75%',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.label}: ${ctx.raw} doses`
            }
          }
        }
      }
    });

    const percentEl = document.getElementById('adherenceDonutPercentage');
    if (percentEl) {
      percentEl.textContent = `${stats.adherenceRate}%`;
    }
  }

  renderRecentActivity() {
    const listEl = document.getElementById('guardianRecentActivityList');
    if (!listEl) return;

    const notifs = window.stateManager ? window.stateManager.state.notifications : [];
    if (notifs.length === 0) {
      listEl.innerHTML = `<li class="list-group-item text-muted text-center py-4">No recent activity</li>`;
      return;
    }

    listEl.innerHTML = notifs.slice(0, 6).map(n => `
      <li class="list-group-item p-3 border-bottom d-flex align-items-center gap-3">
        <div class="rounded-circle bg-teal-subtle text-teal p-2 d-flex align-items-center justify-content-center" style="width: 44px; height: 44px;">
          <i class="bi bi-check2-circle fs-4"></i>
        </div>
        <div class="flex-grow-1">
          <div class="d-flex justify-content-between align-items-center">
            <strong class="fs-6">${n.title}</strong>
            <small class="text-muted">${n.timestamp ? n.timestamp.slice(11, 16) : ''}</small>
          </div>
          <div class="text-secondary small mt-1">${n.message}</div>
        </div>
      </li>
    `).join('');
  }

  // 2. MANAGE MEDICINES
  renderMedicinesManager() {
    const container = document.getElementById('guardianMedicinesList');
    if (!container) return;

    const state = window.stateManager.state;
    const isHindi = window.i18n && window.i18n.getLang() === 'hi';

    let html = `
      <div class="col-12 mb-3 d-flex justify-content-between align-items-center">
        <h4 class="fw-bold mb-0">${window.i18n.t('guardian_overview')} &bull; Prescribed Regimen</h4>
        <button class="btn btn-elderly-teal btn-sm" onclick="window.guardianPortal.openAddMedicineModal()">
          <i class="bi bi-plus-circle me-1"></i> ${window.i18n.t('add_medicine')}
        </button>
      </div>
    `;

    state.medicines.forEach(med => {
      const isExpired = new Date(med.stock.expiryDate) < new Date("2026-11-21");
      html += `
        <div class="col-md-6 mb-3">
          <div class="card-soft h-100">
            <div class="d-flex gap-3 align-items-start">
              <div class="hero-pill-preview" style="width: 90px; height: 90px;">
                <img src="${med.visual.image || 'assets/pills/generic-pill.svg'}" alt="${med.name}" />
              </div>
              <div class="flex-grow-1">
                <div class="d-flex justify-content-between align-items-start">
                  <h4 class="fw-bold fs-5 mb-0">${med.brandName || med.name}</h4>
                  <span class="badge ${isExpired ? 'bg-danger' : 'bg-teal'} text-white">${med.dosage}</span>
                </div>
                <div class="text-muted small mb-2">${med.name}</div>
                <div class="small text-secondary mb-2">
                  <i class="bi bi-clock me-1"></i> ${med.schedule.map(s => `${s.timeSlot} (${s.time})`).join(', ') || 'SOS (As Needed)'}
                </div>
                <div class="small text-secondary">
                  <i class="bi bi-person me-1"></i> Prescribed by: ${med.prescribedBy}
                </div>
              </div>
            </div>

            <div class="d-flex justify-content-between align-items-center pt-3 mt-3 border-top">
              <span class="small text-muted">Stock: <strong>${med.stock.currentQty} ${med.stock.unit}</strong> (Exp: ${med.stock.expiryDate})</span>
              <button class="btn btn-outline-secondary btn-sm" onclick="window.guardianPortal.openEditMedicineModal('${med.id}')">
                <i class="bi bi-pencil-square me-1"></i> Edit Regimen
              </button>
            </div>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  // 3. STOCK & EXPIRY MANAGEMENT
  renderStockManager() {
    const tableBody = document.getElementById('guardianStockTableBody');
    if (!tableBody) return;

    const state = window.stateManager.state;
    const isHindi = window.i18n && window.i18n.getLang() === 'hi';

    let html = '';
    state.medicines.forEach(med => {
      const dailyDoses = med.schedule.length || 1;
      const daysRemaining = Math.floor(med.stock.currentQty / dailyDoses);
      const isLowStock = med.stock.currentQty <= med.stock.reorderThreshold;
      const isExpired = new Date(med.stock.expiryDate) < new Date("2026-11-21");
      const isExpiringSoon = !isExpired && (new Date(med.stock.expiryDate) - new Date("2026-11-21")) / (1000 * 60 * 60 * 24) < 30;

      let statusBadge = '<span class="badge bg-success fs-6">Adequate</span>';
      if (isExpired) {
        statusBadge = '<span class="badge bg-danger fs-6">Expired - Unsafe</span>';
      } else if (isLowStock) {
        statusBadge = '<span class="badge bg-danger fs-6">Low Stock</span>';
      } else if (isExpiringSoon) {
        statusBadge = '<span class="badge bg-warning text-dark fs-6">Expiring Soon</span>';
      }

      html += `
        <tr>
          <td>
            <div class="d-flex align-items-center gap-2">
              <img src="${med.visual.image || 'assets/pills/generic-pill.svg'}" width="36" height="36" alt="" />
              <div>
                <strong>${med.brandName || med.name}</strong>
                <div class="small text-muted">${med.dosage} &bull; ${med.type}</div>
              </div>
            </div>
          </td>
          <td><span class="fs-5 fw-bold ${isLowStock ? 'text-danger' : 'text-dark'}">${med.stock.currentQty}</span> <span class="text-muted small">${med.stock.unit}</span></td>
          <td>${med.stock.reorderThreshold} ${med.stock.unit}</td>
          <td><strong class="${isLowStock ? 'text-danger' : 'text-success'}">~${daysRemaining} days</strong></td>
          <td>
            <span class="${isExpired || isExpiringSoon ? 'text-danger fw-bold' : ''}">
              ${med.stock.expiryDate}
            </span>
          </td>
          <td>${statusBadge}</td>
          <td>
            <button class="btn btn-outline-teal btn-sm" onclick="window.guardianPortal.openStockAdjustModal('${med.id}')">
              <i class="bi bi-box-arrow-in-down me-1"></i> Adjust / Refill
            </button>
          </td>
        </tr>
      `;
    });

    tableBody.innerHTML = html;
  }

  // 4. PRESCRIPTION VAULT
  renderPrescriptionVault() {
    const grid = document.getElementById('guardianPrescriptionVaultGrid');
    if (!grid) return;

    const state = window.stateManager.state;
    let html = '';

    state.prescriptions.forEach(rx => {
      const linkedMedNames = rx.linkedMedicines.map(id => {
        const m = state.medicines.find(x => x.id === id);
        return m ? (m.brandName || m.name) : id;
      }).join(', ');

      html += `
        <div class="col-md-6 mb-4">
          <div class="prescription-vault-card">
            <div class="d-flex gap-3 align-items-start mb-3">
              <div class="rx-doc-icon"><i class="bi bi-file-earmark-medical-fill"></i></div>
              <div class="flex-grow-1">
                <h4 class="fw-bold fs-5 mb-0">${rx.doctorName}</h4>
                <div class="text-muted small">${rx.specialty} &bull; ${rx.clinic}</div>
                <div class="badge bg-light text-dark border mt-1">Date: ${rx.date}</div>
              </div>
            </div>

            <div class="bg-light p-3 rounded-3 mb-3 border">
              <strong class="d-block text-secondary small">Diagnosis:</strong>
              <div class="fw-bold fs-6 mb-2">${rx.diagnosis}</div>
              <strong class="d-block text-secondary small">Associated Medicines:</strong>
              <div class="text-teal fw-bold fs-6">${linkedMedNames}</div>
            </div>

            <div class="small text-muted mb-3">
              <strong>Doctor's Notes:</strong> ${rx.notes}
            </div>

            <div class="mt-auto pt-3 border-top d-flex justify-content-between align-items-center">
              <span class="small text-muted"><i class="bi bi-paperclip me-1"></i> ${rx.fileName}</span>
              <button class="btn btn-outline-teal btn-sm" onclick="window.patientPortal.openPrescriptionView('${rx.id}')">
                <i class="bi bi-eye-fill me-1"></i> View / Print
              </button>
            </div>
          </div>
        </div>
      `;
    });

    grid.innerHTML = html;
  }

  // 5. ADHERENCE & MEMORY MAP
  renderAdherenceDetails() {
    if (window.adherenceEngine) {
      window.adherenceEngine.renderHeatmap('guardianHeatmapContainer', true);
    }
  }

  // 6. TIMELINE
  renderTimeline() {
    const list = document.getElementById('guardianTimelineList');
    if (!list) return;

    const timeline = window.stateManager.state.timeline;
    list.innerHTML = timeline.map(t => `
      <div class="timeline-entry">
        <div class="timeline-entry-dot"></div>
        <div class="card-soft p-3">
          <div class="d-flex justify-content-between align-items-center mb-1">
            <strong class="text-teal fs-6">${t.type}</strong>
            <small class="text-muted">${t.timestamp.replace('T', ' ').slice(0, 16)}</small>
          </div>
          <p class="mb-1 text-dark fs-6">${t.details}</p>
          <small class="text-secondary"><i class="bi bi-person-check me-1"></i> ${t.actor}</small>
        </div>
      </div>
    `).join('');
  }

  // 7. CONNECT & FAMILY CIRCLE
  renderConnectAndFamily() {
    const patientCodeEl = document.getElementById('guardianFamilyPatientCode');
    const guardiansListEl = document.getElementById('guardianFamilyGuardiansList');

    if (patientCodeEl) {
      patientCodeEl.textContent = window.stateManager.state.user.connectionCode;
    }

    if (guardiansListEl) {
      const g = window.stateManager.state.user.connectedGuardians;
      guardiansListEl.innerHTML = g.map(guardian => `
        <div class="card-soft p-3 mb-3 d-flex justify-content-between align-items-center">
          <div>
            <h5 class="fw-bold mb-1"><i class="bi bi-shield-fill-check text-success me-2"></i>${guardian.name} (${guardian.relationship})</h5>
            <div class="text-muted small">${guardian.phone} &bull; Paired on ${guardian.connectedDate}</div>
            <div class="d-flex flex-wrap gap-2 mt-2">
              <span class="badge bg-light text-dark border">Schedule View: Allowed</span>
              <span class="badge bg-light text-dark border">Manage Stock: Allowed</span>
              <span class="badge bg-light text-dark border">Alerts: Active</span>
            </div>
          </div>
          <span class="badge bg-success fs-6 px-3 py-2">Connected</span>
        </div>
      `).join('');
    }
  }

  // 8. CAREGIVER FOLLOW-UP LOGS
  renderFollowUpLogs() {
    const listEl = document.getElementById('caregiverLogsList');
    if (!listEl) return;

    const logs = window.stateManager.state.caregiverLogs;
    listEl.innerHTML = logs.map(l => `
      <div class="card-soft p-3 mb-3">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <h5 class="fw-bold mb-0 text-teal"><i class="bi bi-journal-check me-2"></i>${l.action}</h5>
          <small class="text-muted">${l.timestamp.replace('T', ' ').slice(0, 16)}</small>
        </div>
        <p class="mb-2 text-dark">${l.notes}</p>
        <div class="d-flex justify-content-between align-items-center">
          <small class="text-secondary"><i class="bi bi-person me-1"></i> Logged by: ${l.guardianName}</small>
          ${l.followUpNeeded ? '<span class="badge bg-warning text-dark"><i class="bi bi-clock-history me-1"></i> Follow-up Pending</span>' : '<span class="badge bg-light text-muted">Completed</span>'}
        </div>
      </div>
    `).join('');
  }

  // Modals & Actions
  openStockAdjustModal(medId) {
    const med = window.stateManager.state.medicines.find(m => m.id === medId);
    if (!med) return;

    const modalEl = document.getElementById('adjustStockModal');
    const titleEl = document.getElementById('adjustStockMedTitle');
    const inputQty = document.getElementById('adjustStockQty');
    const inputReason = document.getElementById('adjustStockReason');
    const btnSave = document.getElementById('adjustStockSaveBtn');

    if (titleEl) titleEl.textContent = `${med.brandName || med.name} (${med.stock.currentQty} ${med.stock.unit} currently)`;
    if (inputQty) inputQty.value = med.stock.currentQty;
    if (inputReason) inputReason.value = "Purchased refill pack from local pharmacy.";

    if (btnSave) {
      btnSave.onclick = () => {
        const newQty = parseInt(inputQty.value, 10);
        const reason = inputReason.value.trim() || "Manual stock correction";
        window.stateManager.updateStock(medId, newQty, reason, "Priya Sharma");

        const bsModal = bootstrap.Modal.getInstance(modalEl);
        if (bsModal) bsModal.hide();

        this.render();
        alert("Stock updated successfully!");
      };
    }

    const bsModal = new bootstrap.Modal(modalEl);
    bsModal.show();
  }

  openAddMedicineModal() {
    const modalEl = document.getElementById('addMedicineModal');
    if (!modalEl) return;
    const bsModal = new bootstrap.Modal(modalEl);
    bsModal.show();
  }

  openEditMedicineModal(medId) {
    this.openAddMedicineModal();
  }

  openUploadPrescriptionModal() {
    const modalEl = document.getElementById('uploadPrescriptionModal');
    if (!modalEl) return;
    const bsModal = new bootstrap.Modal(modalEl);
    bsModal.show();
  }

  recordCaregiverDose(medId, slot, dateStr = null) {
    const res = window.stateManager.confirmDose(medId, slot, dateStr, 'caregiver (Priya Sharma)');
    if (res.success) {
      this.render();
      alert("Caregiver dose confirmation recorded successfully!");
    }
  }

  exportDoctorPDF() {
    if (window.doctorReportGenerator) {
      window.doctorReportGenerator.generatePDF();
    }
  }
}

const guardianPortal = new GuardianPortal();
window.guardianPortal = guardianPortal;
