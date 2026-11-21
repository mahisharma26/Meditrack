/**
 * MediTrack - Admin & Demonstration Controller
 * Demo scenario runner, data inspector, and system reset
 */

class AdminPortal {
  render() {
    this.renderSystemOverview();
    this.renderAccountsList();
  }

  renderSystemOverview() {
    const statsContainer = document.getElementById('adminStatsContainer');
    if (!statsContainer || !window.stateManager) return;

    const state = window.stateManager.state;
    const medCount = state.medicines.length;
    const alertCount = state.alerts.length;
    const rxCount = state.prescriptions.length;
    const historyCount = Object.keys(state.adherenceHistory).length;

    statsContainer.innerHTML = `
      <div class="row g-3">
        <div class="col-md-3">
          <div class="card-soft text-center p-3">
            <div class="fs-1 fw-bold text-teal">${medCount}</div>
            <div class="text-secondary fw-bold">Active Medicines</div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card-soft text-center p-3">
            <div class="fs-1 fw-bold text-danger">${alertCount}</div>
            <div class="text-secondary fw-bold">Active Alerts</div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card-soft text-center p-3">
            <div class="fs-1 fw-bold text-success">${rxCount}</div>
            <div class="text-secondary fw-bold">Prescriptions in Vault</div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card-soft text-center p-3">
            <div class="fs-1 fw-bold text-primary">${historyCount}</div>
            <div class="text-secondary fw-bold">Days of Adherence Data</div>
          </div>
        </div>
      </div>
    `;
  }

  renderAccountsList() {
    const listEl = document.getElementById('adminAccountsList');
    if (!listEl || !window.stateManager) return;

    const state = window.stateManager.state;
    const user = state.user;
    const guardian = state.guardians[0];

    listEl.innerHTML = `
      <div class="list-group">
        <div class="list-group-item p-3 d-flex justify-content-between align-items-center">
          <div>
            <h5 class="mb-1 fw-bold">👴 ${user.name} <span class="badge bg-success ms-2">Patient</span></h5>
            <div class="text-muted small">Age: ${user.age} &bull; Phone: ${user.phone} &bull; Code: <strong>${user.connectionCode}</strong></div>
          </div>
          <button class="btn btn-outline-teal btn-sm" onclick="window.app.switchPortal('patient')">
            Open Patient Portal
          </button>
        </div>

        <div class="list-group-item p-3 d-flex justify-content-between align-items-center">
          <div>
            <h5 class="mb-1 fw-bold">👩‍💼 ${guardian.name} <span class="badge bg-teal text-white ms-2">Guardian</span></h5>
            <div class="text-muted small">${guardian.relationship} &bull; Phone: ${guardian.phone}</div>
          </div>
          <button class="btn btn-outline-teal btn-sm" onclick="window.app.switchPortal('guardian')">
            Open Guardian Portal
          </button>
        </div>

        <div class="list-group-item p-3 d-flex justify-content-between align-items-center">
          <div>
            <h5 class="mb-1 fw-bold">⚙️ ${state.admin.name} <span class="badge bg-secondary ms-2">Administrator</span></h5>
            <div class="text-muted small">System maintenance & testing role</div>
          </div>
          <span class="badge bg-light text-dark border">Current Hub</span>
        </div>
      </div>
    `;
  }

  // Simulation Scenarios
  runScenario(num) {
    if (!window.stateManager) return;

    switch (num) {
      case 1:
        // Scenario 1: Normal Morning
        window.app.switchPortal('patient');
        if (window.patientPortal) window.patientPortal.switchTab('home');
        alert("Scenario 1 Activated: Patient Portal loaded with Morning Routine.");
        break;

      case 2:
        // Scenario 2: Simulate Unconfirmed Dose Alert (45 min grace period elapsed)
        const med = window.stateManager.state.medicines[1]; // Amlodipine
        window.stateManager.state.alerts.unshift({
          id: `alt-sim-${Date.now()}`,
          type: 'DOSE_UNCONFIRMED',
          severity: 'urgent',
          doseKey: `${med.id}_morning`,
          medicineId: med.id,
          timeSlot: 'morning',
          scheduledTime: '08:00',
          title: "Dose Not Confirmed",
          titleHindi: "दवा की पुष्टि नहीं हुई",
          message: `${med.brandName || med.name} scheduled for 08:00 AM has not been confirmed after 45-min grace period.`,
          messageHindi: `${med.brandName || med.name} की खुराक 45 मिनट की छूट सीमा बीतने पर भी पुष्ट नहीं हुई है।`,
          timestamp: new Date().toISOString()
        });
        window.stateManager.saveState();
        window.app.switchPortal('guardian');
        if (window.guardianPortal) window.guardianPortal.switchTab('overview');
        alert("Scenario 2 Activated: Overdue dose simulated. Guardian Alert generated with 'Call Papa' action.");
        break;

      case 3:
        // Scenario 3: Low stock warning
        window.app.switchPortal('guardian');
        if (window.guardianPortal) window.guardianPortal.switchTab('stock');
        alert("Scenario 3 Activated: Atorvastatin Calcium stock is critically low (5 tablets remaining).");
        break;

      case 4:
        // Scenario 4: Reset Demo Data
        if (confirm("Reset MediTrack to initial demonstration state?")) {
          window.stateManager.resetToDefault();
        }
        break;
    }
  }
}

const adminPortal = new AdminPortal();
window.adminPortal = adminPortal;
