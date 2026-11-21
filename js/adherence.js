/**
 * MediTrack - Adherence Engine & Medication Memory Map
 * Computes daily, weekly, and monthly adherence statistics
 * Renders patient and guardian calendar heatmaps
 * Implements grace period check for "Dose not confirmed" alerts
 */

class AdherenceEngine {
  constructor() {
    this.selectedMonth = 10; // November (0-indexed)
    this.selectedYear = 2026;
  }

  // Get statistics for the past 30 days
  get30DayStats() {
    const history = window.stateManager ? window.stateManager.state.adherenceHistory : {};
    let totalScheduledDoses = 0;
    let totalConfirmedDoses = 0;
    let totalUnconfirmedDoses = 0;
    let perfectDays = 0;
    let partialDays = 0;
    let missedDays = 0;

    const dates = Object.keys(history).sort();

    dates.forEach(dateStr => {
      const record = history[dateStr];
      if (record.status === 'all_taken') perfectDays++;
      else if (record.status === 'unconfirmed') missedDays++;
      else if (record.status === 'partial') partialDays++;

      if (record.doses) {
        Object.values(record.doses).forEach(d => {
          totalScheduledDoses++;
          if (d.taken) totalConfirmedDoses++;
          else if (d.alertGenerated) totalUnconfirmedDoses++;
        });
      }
    });

    const totalDays = dates.length || 1;
    const adherenceRate = totalScheduledDoses > 0 
      ? Math.round((totalConfirmedDoses / totalScheduledDoses) * 100) 
      : 0;

    return {
      totalDays,
      totalScheduledDoses,
      totalConfirmedDoses,
      totalUnconfirmedDoses,
      perfectDays,
      partialDays,
      missedDays,
      adherenceRate
    };
  }

  // Weekly Adherence (last 7 days)
  getWeeklyRate() {
    const history = window.stateManager ? window.stateManager.state.adherenceHistory : {};
    const dates = Object.keys(history).sort().slice(-7);
    let confirmed = 0;
    let total = 0;

    dates.forEach(d => {
      const rec = history[d];
      if (rec && rec.doses) {
        Object.values(rec.doses).forEach(dose => {
          total++;
          if (dose.taken) confirmed++;
        });
      }
    });

    return total > 0 ? Math.round((confirmed / total) * 100) : 100;
  }

  // Check scheduled doses against current time for grace period lapse
  checkGracePeriodAlerts() {
    if (!window.stateManager) return;
    const todayStr = window.stateManager.state.todayStr || "2026-11-21";
    const history = window.stateManager.state.adherenceHistory[todayStr];
    if (!history) return;

    // Default simulation time: 14:00 (2:00 PM)
    const simulatedHours = 14;
    const simulatedMinutes = 30;
    const currentMinutesOfDay = simulatedHours * 60 + simulatedMinutes;

    window.stateManager.state.medicines.forEach(med => {
      if (!med.active || med.isSOS) return;

      med.schedule.forEach(slot => {
        const [slotH, slotM] = slot.time.split(':').map(Number);
        const slotMinutesOfDay = slotH * 60 + slotM;
        const doseKey = `${med.id}_${slot.timeSlot}`;
        const doseRecord = history.doses[doseKey];

        // If dose time + grace period (45 mins) is passed and not taken
        if (currentMinutesOfDay > (slotMinutesOfDay + CONFIG.GRACE_PERIOD_MINUTES)) {
          if (!doseRecord || !doseRecord.taken) {
            // Generate alert if not already logged
            const existingAlert = window.stateManager.state.alerts.find(
              a => a.type === 'DOSE_UNCONFIRMED' && a.doseKey === doseKey
            );

            if (!existingAlert) {
              const medName = med.brandName || med.name;
              window.stateManager.state.alerts.unshift({
                id: `alt-unconf-${Date.now()}`,
                type: 'DOSE_UNCONFIRMED',
                severity: 'urgent',
                doseKey: doseKey,
                medicineId: med.id,
                timeSlot: slot.timeSlot,
                scheduledTime: slot.time,
                title: "Dose Not Confirmed",
                titleHindi: "दवा की पुष्टि नहीं हुई",
                message: `${medName} (${slot.timeSlot}) scheduled for ${slot.time} was not confirmed beyond the ${CONFIG.GRACE_PERIOD_MINUTES}-min grace period.`,
                messageHindi: `${medName} की खुराक (${slot.time}) 45 मिनट बीतने के बाद भी पुष्ट नहीं हुई है।`,
                timestamp: new Date().toISOString()
              });

              if (doseRecord) {
                doseRecord.alertGenerated = true;
              }
              window.stateManager.saveState();
            }
          }
        }
      });
    });
  }

  // Render Calendar Heatmap for Patient (Simplified) or Guardian (Detailed)
  renderHeatmap(containerId, isGuardian = false) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const history = window.stateManager ? window.stateManager.state.adherenceHistory : {};
    const year = this.selectedYear;
    const month = this.selectedMonth; // 10 = November

    const firstDay = new Date(year, month, 1).getDay(); // Day of week (0-6)
    const daysInMonth = new Date(year, month + 1, 0).getDate(); // 30 in Nov

    const dayLabels = window.i18n && window.i18n.getLang() === 'hi' 
      ? ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि']
      : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    let html = `
      <div class="calendar-wrapper">
        <div class="calendar-header d-flex justify-content-between align-items-center mb-3">
          <h4 class="mb-0 fw-bold">
            ${window.i18n && window.i18n.getLang() === 'hi' ? 'नवंबर 2026' : 'November 2026'}
          </h4>
          <span class="badge bg-sage text-dark px-3 py-2 fs-6">
            ${this.getWeeklyRate()}% ${window.i18n ? window.i18n.t('weekly_adherence') : 'Weekly Adherence'}
          </span>
        </div>

        <div class="calendar-grid">
          ${dayLabels.map(d => `<div class="calendar-weekday-header fw-bold">${d}</div>`).join('')}
    `;

    // Empty offset days
    for (let i = 0; i < firstDay; i++) {
      html += `<div class="calendar-day-cell empty"></div>`;
    }

    // Days 1..30
    for (let day = 1; day <= daysInMonth; day++) {
      const dayStr = String(day).padStart(2, '0');
      const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${dayStr}`;
      const record = history[dateKey];
      const isToday = day === 21;

      let statusClass = 'status-grey';
      let icon = '<i class="bi bi-dash-circle"></i>';
      let label = 'No record';

      if (record) {
        if (record.status === 'all_taken') {
          statusClass = 'status-green';
          icon = '<i class="bi bi-check-circle-fill"></i>';
          label = 'All Doses Confirmed';
        } else if (record.status === 'partial') {
          statusClass = 'status-yellow';
          icon = '<i class="bi bi-clock-fill"></i>';
          label = 'Doses Pending / In Progress';
        } else if (record.status === 'unconfirmed') {
          statusClass = 'status-red';
          icon = '<i class="bi bi-exclamation-triangle-fill"></i>';
          label = 'Dose Not Confirmed';
        }
      }

      html += `
        <div class="calendar-day-cell ${statusClass} ${isToday ? 'is-today' : ''}" 
             tabindex="0" 
             role="button"
             data-date="${dateKey}"
             onclick="window.adherenceEngine.onDayClick('${dateKey}', ${isGuardian})"
             onkeydown="if(event.key==='Enter') window.adherenceEngine.onDayClick('${dateKey}', ${isGuardian})"
             aria-label="${dateKey}: ${label}">
          <div class="day-number">${day}</div>
          <div class="day-status-icon">${icon}</div>
          ${isToday ? `<span class="today-tag">${window.i18n && window.i18n.getLang() === 'hi' ? 'आज' : 'Today'}</span>` : ''}
        </div>
      `;
    }

    html += `
        </div>
        <!-- Accessible Heatmap Legend -->
        <div class="calendar-legend mt-4 p-3 bg-light rounded-3 d-flex flex-wrap gap-3 justify-content-around">
          <div class="d-flex align-items-center gap-2">
            <span class="legend-swatch legend-green"><i class="bi bi-check-circle-fill"></i></span>
            <span>${window.i18n ? window.i18n.t('heatmap_green') : 'All Doses Confirmed'}</span>
          </div>
          <div class="d-flex align-items-center gap-2">
            <span class="legend-swatch legend-yellow"><i class="bi bi-clock-fill"></i></span>
            <span>${window.i18n ? window.i18n.t('heatmap_yellow') : 'Some Doses Pending'}</span>
          </div>
          <div class="d-flex align-items-center gap-2">
            <span class="legend-swatch legend-red"><i class="bi bi-exclamation-triangle-fill"></i></span>
            <span>${window.i18n ? window.i18n.t('heatmap_red') : 'Dose Not Confirmed'}</span>
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;
  }

  onDayClick(dateKey, isGuardian) {
    const history = window.stateManager ? window.stateManager.state.adherenceHistory[dateKey] : null;
    const modalEl = document.getElementById('adherenceDayModal');
    const modalBody = document.getElementById('adherenceDayModalBody');
    const modalTitle = document.getElementById('adherenceDayModalTitle');

    if (!modalEl || !modalBody || !modalTitle) return;

    modalTitle.textContent = `${window.i18n && window.i18n.getLang() === 'hi' ? 'दवा विवरण' : 'Dose Records'}: ${dateKey}`;

    if (!history || !history.doses || Object.keys(history.doses).length === 0) {
      modalBody.innerHTML = `<p class="lead text-muted">${window.i18n && window.i18n.getLang() === 'hi' ? 'इस दिन कोई दवा रिकॉर्ड उपलब्ध नहीं है।' : 'No dosage activity recorded for this date.'}</p>`;
    } else {
      let dosesHtml = '<div class="list-group">';
      Object.entries(history.doses).forEach(([key, dose]) => {
        const [medId, slot] = key.split('_');
        const med = window.stateManager.state.medicines.find(m => m.id === medId);
        const name = med ? (med.brandName || med.name) : medId;
        const isTaken = dose.taken;

        dosesHtml += `
          <div class="list-group-item d-flex justify-content-between align-items-center p-3">
            <div>
              <h5 class="mb-1 fw-bold">${name} <span class="badge bg-secondary fs-6 text-capitalize">${slot}</span></h5>
              <div class="text-muted small">
                ${isTaken 
                  ? `<span class="text-success"><i class="bi bi-check-circle-fill me-1"></i> Confirmed at ${dose.time} by ${dose.confirmedBy || 'patient'}</span>` 
                  : (dose.alertGenerated 
                      ? `<span class="text-danger"><i class="bi bi-exclamation-circle-fill me-1"></i> Dose not confirmed (Overdue)</span>` 
                      : `<span class="text-warning"><i class="bi bi-hourglass-split me-1"></i> Scheduled for ${dose.scheduled || slot}</span>`)
                }
              </div>
            </div>
            ${isGuardian && !isTaken ? `
              <button class="btn btn-outline-teal btn-sm" onclick="window.guardianPortal.recordCaregiverDose('${medId}', '${slot}', '${dateKey}')">
                <i class="bi bi-clipboard-check me-1"></i> Record as Caregiver
              </button>
            ` : ''}
          </div>
        `;
      });
      dosesHtml += '</div>';

      modalBody.innerHTML = dosesHtml;
    }

    const bsModal = new bootstrap.Modal(modalEl);
    bsModal.show();
  }
}

const adherenceEngine = new AdherenceEngine();
window.adherenceEngine = adherenceEngine;
