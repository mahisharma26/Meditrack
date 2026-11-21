/**
 * MediTrack - State Management & Persistence Engine
 * Supports LocalStorage, offline queueing, stock tracking, and role separation
 */

class StateManager {
  constructor() {
    this.STORAGE_KEY = 'meditrack_app_state_v1';
    this.state = this.loadState();
    this.initNetworkMonitoring();
  }

  loadState() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Failed to read from localStorage, using initial mock data", e);
    }
    return this.createInitialState();
  }

  saveState() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state));
      window.dispatchEvent(new CustomEvent('stateChanged', { detail: { state: this.state } }));
    } catch (e) {
      console.error("Failed to save state to localStorage", e);
    }
  }

  createInitialState() {
    // Generate realistic 30-day adherence history up to Nov 21, 2026
    const adherenceHistory = {};
    const baseDate = new Date("2026-11-21T00:00:00");

    for (let i = 29; i >= 0; i--) {
      const d = new Date(baseDate);
      d.setDate(d.getDate() - i);
      const dateKey = d.toISOString().split('T')[0];

      if (i === 0) {
        // Today (Nov 21): Metformin Morning taken, Amlodipine Morning taken. Afternoon pending.
        adherenceHistory[dateKey] = {
          date: dateKey,
          status: 'partial', // partial until all doses confirmed
          doses: {
            'med-01_morning': { taken: true, time: "08:35:12", confirmedBy: "patient" },
            'med-02_morning': { taken: true, time: "08:12:05", confirmedBy: "patient" },
            'med-04_afternoon': { taken: false, scheduled: "13:30", confirmedBy: null },
            'med-01_night': { taken: false, scheduled: "20:30", confirmedBy: null },
            'med-03_night': { taken: false, scheduled: "21:30", confirmedBy: null }
          }
        };
      } else if (i === 1) {
        // Yesterday (Nov 20): All completed!
        adherenceHistory[dateKey] = {
          date: dateKey,
          status: 'all_taken',
          doses: {
            'med-01_morning': { taken: true, time: "08:40:00", confirmedBy: "patient" },
            'med-02_morning': { taken: true, time: "08:15:00", confirmedBy: "patient" },
            'med-04_afternoon': { taken: true, time: "13:45:00", confirmedBy: "patient" },
            'med-01_night': { taken: true, time: "20:45:00", confirmedBy: "patient" },
            'med-03_night': { taken: true, time: "21:40:00", confirmedBy: "patient" }
          }
        };
      } else if (i === 4) {
        // 4 days ago (Nov 17): Missed confirmation evening dose! (Red day for demo)
        adherenceHistory[dateKey] = {
          date: dateKey,
          status: 'unconfirmed',
          doses: {
            'med-01_morning': { taken: true, time: "08:30:00", confirmedBy: "patient" },
            'med-02_morning': { taken: true, time: "08:10:00", confirmedBy: "patient" },
            'med-04_afternoon': { taken: true, time: "13:30:00", confirmedBy: "patient" },
            'med-01_night': { taken: false, scheduled: "20:30", confirmedBy: null, alertGenerated: true },
            'med-03_night': { taken: true, time: "22:15:00", confirmedBy: "caregiver" }
          }
        };
      } else if (i === 12) {
        // 12 days ago (Nov 9): Partial pending
        adherenceHistory[dateKey] = {
          date: dateKey,
          status: 'partial',
          doses: {
            'med-01_morning': { taken: true, time: "08:45:00", confirmedBy: "patient" },
            'med-02_morning': { taken: true, time: "08:20:00", confirmedBy: "patient" },
            'med-04_afternoon': { taken: false, scheduled: "13:30", confirmedBy: null },
            'med-01_night': { taken: true, time: "20:30:00", confirmedBy: "patient" },
            'med-03_night': { taken: true, time: "21:30:00", confirmedBy: "patient" }
          }
        };
      } else {
        // All other days: fully compliant green
        adherenceHistory[dateKey] = {
          date: dateKey,
          status: 'all_taken',
          doses: {
            'med-01_morning': { taken: true, time: "08:30:00", confirmedBy: "patient" },
            'med-02_morning': { taken: true, time: "08:05:00", confirmedBy: "patient" },
            'med-04_afternoon': { taken: true, time: "13:35:00", confirmedBy: "patient" },
            'med-01_night': { taken: true, time: "20:35:00", confirmedBy: "patient" },
            'med-03_night': { taken: true, time: "21:35:00", confirmedBy: "patient" }
          }
        };
      }
    }

    return {
      authSession: null, // Initial session is null until user logs in
      currentRole: null, // Protected until login
      user: JSON.parse(JSON.stringify(INITIAL_DATA.currentUser)),
      guardians: JSON.parse(JSON.stringify(INITIAL_DATA.guardians)),
      admin: JSON.parse(JSON.stringify(INITIAL_DATA.admin)),
      medicines: JSON.parse(JSON.stringify(INITIAL_DATA.medicines)),
      prescriptions: JSON.parse(JSON.stringify(INITIAL_DATA.prescriptions)),
      emergencyCard: JSON.parse(JSON.stringify(INITIAL_DATA.emergencyCard)),
      timeline: JSON.parse(JSON.stringify(INITIAL_DATA.timeline)),
      caregiverLogs: JSON.parse(JSON.stringify(INITIAL_DATA.caregiverLogs)),
      adherenceHistory: adherenceHistory,
      todayStr: INITIAL_DATA.demoToday,
      snoozedUntil: null,
      alerts: [
        {
          id: "alt-01",
          type: "LOW_STOCK",
          severity: "warning",
          title: "Low Medicine Stock",
          titleHindi: "दवा का कम स्टॉक",
          message: "Atorvastatin Calcium has only 5 tablets remaining (~5 days left).",
          messageHindi: "एटोरवास्टेटिन की केवल 5 गोलियां बची हैं (~5 दिन)।",
          medicineId: "med-03",
          timestamp: "2026-11-21T07:00:00"
        },
        {
          id: "alt-02",
          type: "EXPIRY_WARNING",
          severity: "info",
          title: "Upcoming Medicine Expiry",
          titleHindi: "दवा की समाप्ति निकट है",
          message: "Multivitamin Silver 50+ expires on 15-Dec-2026 (in 24 days).",
          messageHindi: "मल्टीविटामिन 15-दिसंबर-2026 को समाप्त (एक्सपायर) होने वाली है।",
          medicineId: "med-04",
          timestamp: "2026-11-21T07:00:00"
        }
      ],
      notifications: [
        {
          id: "notif-01",
          read: false,
          timestamp: "2026-11-21T08:35:12",
          title: "Dose Confirmed by Ramesh-ji",
          message: "Metformin 500mg morning dose confirmed on time at 08:35 AM.",
          type: "DOSE_CONFIRMED"
        },
        {
          id: "notif-02",
          read: false,
          timestamp: "2026-11-21T08:12:05",
          title: "Dose Confirmed by Ramesh-ji",
          message: "Amlodipine 5mg morning dose confirmed on time at 08:12 AM.",
          type: "DOSE_CONFIRMED"
        }
      ],
      preferences: {
        fontSize: 'normal', // normal, large, xlarge
        highContrast: false,
        reducedMotion: false,
        soundEnabled: true
      },
      offlineQueue: [],
      isOnline: navigator.onLine !== undefined ? navigator.onLine : true
    };
  }

  initNetworkMonitoring() {
    window.addEventListener('online', () => {
      this.state.isOnline = true;
      this.processOfflineQueue();
      this.saveState();
      window.dispatchEvent(new CustomEvent('networkStatusChanged', { detail: { isOnline: true } }));
    });
    window.addEventListener('offline', () => {
      this.state.isOnline = false;
      this.saveState();
      window.dispatchEvent(new CustomEvent('networkStatusChanged', { detail: { isOnline: false } }));
    });
  }

  processOfflineQueue() {
    if (this.state.offlineQueue && this.state.offlineQueue.length > 0) {
      console.log(`Processing ${this.state.offlineQueue.length} queued offline actions...`);
      // Re-apply actions idempotently
      this.state.offlineQueue = [];
      this.addNotification({
        title: "Synchronized",
        message: "Offline dose confirmations successfully synchronized.",
        type: "SYNC"
      });
    }
  }

  // Authentication & Session Management
  getAuthSession() {
    if (this.state.authSession) return this.state.authSession;
    try {
      const stored = localStorage.getItem('meditrack_auth_session');
      if (stored) {
        this.state.authSession = JSON.parse(stored);
        return this.state.authSession;
      }
    } catch (e) {}
    return null;
  }

  getAuthUser() {
    const session = this.getAuthSession();
    return session ? session.user : null;
  }

  isAuthenticated() {
    return this.getAuthSession() !== null;
  }

  login(sessionObj) {
    this.state.authSession = sessionObj;
    this.state.currentRole = sessionObj.user.role;
    localStorage.setItem('meditrack_auth_session', JSON.stringify(sessionObj));
    this.saveState();
    window.dispatchEvent(new CustomEvent('authChanged', { detail: { session: sessionObj } }));
    return true;
  }

  logout() {
    this.state.authSession = null;
    this.state.currentRole = null;
    localStorage.removeItem('meditrack_auth_session');
    if (window.supabaseService) {
      window.supabaseService.signOut();
    }
    this.saveState();
    window.dispatchEvent(new CustomEvent('authChanged', { detail: { session: null } }));
    return true;
  }

  // Role Access Guard: Prevent unauthorized access to other roles' dashboards
  canAccessRole(targetRole) {
    if (!this.isAuthenticated()) return false;
    const user = this.getAuthUser();
    if (!user) return false;

    // Admin has access to everything
    if (user.role === ROLES.ADMIN) return true;

    // Patient can only access Patient portal
    if (user.role === ROLES.PATIENT) {
      return targetRole === ROLES.PATIENT;
    }

    // Guardian can access Guardian portal
    if (user.role === ROLES.GUARDIAN) {
      return targetRole === ROLES.GUARDIAN;
    }

    return false;
  }

  // Role Management
  getRole() {
    if (!this.isAuthenticated()) return null;
    return this.state.currentRole || (this.getAuthUser() ? this.getAuthUser().role : null);
  }

  setRole(role) {
    if (!this.canAccessRole(role)) {
      console.warn(`Unauthorized attempt to switch to role: ${role}`);
      return false;
    }
    if (Object.values(ROLES).includes(role)) {
      this.state.currentRole = role;
      this.saveState();
      window.dispatchEvent(new CustomEvent('roleChanged', { detail: { role } }));
      return true;
    }
    return false;
  }

  // Dose Confirmation
  confirmDose(medicineId, timeSlot, dateStr = null, confirmedBy = 'patient') {
    const today = dateStr || this.state.todayStr || "2026-11-21";
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    const doseKey = `${medicineId}_${timeSlot}`;

    if (!this.state.adherenceHistory[today]) {
      this.state.adherenceHistory[today] = {
        date: today,
        status: 'partial',
        doses: {}
      };
    }

    // Record confirmation
    this.state.adherenceHistory[today].doses[doseKey] = {
      taken: true,
      time: timeStr,
      confirmedBy: confirmedBy,
      timestamp: `${today}T${timeStr}`
    };

    // Find medicine and decrement stock
    const med = this.state.medicines.find(m => m.id === medicineId);
    let medName = medicineId;
    if (med) {
      medName = med.brandName || med.name;
      if (med.stock && med.stock.currentQty > 0) {
        med.stock.currentQty -= 1;
        // Check if low stock threshold breached
        if (med.stock.currentQty <= med.stock.reorderThreshold) {
          this.triggerLowStockAlert(med);
        }
      }
    }

    // Recalculate today's status
    this.recalculateDailyStatus(today);

    // Notify connected guardians
    const guardianNotice = {
      id: `notif-${Date.now()}`,
      read: false,
      timestamp: `${today}T${timeStr}`,
      title: confirmedBy === 'patient' ? "Dose Confirmed by Ramesh-ji" : "Caregiver Recorded Dose",
      message: `${medName} (${timeSlot}) recorded at ${timeStr.slice(0, 5)} by ${confirmedBy}. Stock now ${med?.stock?.currentQty || 'N/A'}.`,
      type: "DOSE_CONFIRMED",
      medicineId: medicineId
    };
    this.state.notifications.unshift(guardianNotice);

    // If offline, queue for sync
    if (!this.state.isOnline) {
      this.state.offlineQueue.push({
        action: 'CONFIRM_DOSE',
        medicineId,
        timeSlot,
        date: today,
        confirmedBy,
        timestamp: `${today}T${timeStr}`
      });
    }

    // Add activity to timeline
    this.state.timeline.unshift({
      id: `tl-${Date.now()}`,
      timestamp: `${today}T${timeStr}`,
      actor: confirmedBy === 'patient' ? "Ramesh Sharma (Patient)" : "Caregiver",
      type: "DOSE_TAKEN",
      details: `${medName} dose confirmed for ${timeSlot}. Stock reduced to ${med?.stock?.currentQty || 'N/A'}.`,
      detailsHindi: `${medName} की खुराक (${timeSlot}) दर्ज की गई। शेष गोलियां: ${med?.stock?.currentQty || 'N/A'}।`
    });

    this.saveState();
    return { success: true, medicine: med, timeStr };
  }

  recalculateDailyStatus(dateStr) {
    const dayRecord = this.state.adherenceHistory[dateStr];
    if (!dayRecord) return;

    // Build list of all required scheduled doses for this day
    const requiredDoseKeys = [];
    this.state.medicines.forEach(m => {
      if (m.active && !m.isSOS) {
        m.schedule.forEach(s => {
          requiredDoseKeys.push(`${m.id}_${s.timeSlot}`);
        });
      }
    });

    let takenCount = 0;
    let missedCount = 0;

    requiredDoseKeys.forEach(key => {
      const dose = dayRecord.doses[key];
      if (dose && dose.taken) {
        takenCount++;
      } else if (dose && dose.alertGenerated) {
        missedCount++;
      }
    });

    if (takenCount === requiredDoseKeys.length) {
      dayRecord.status = 'all_taken'; // Green
    } else if (missedCount > 0) {
      dayRecord.status = 'unconfirmed'; // Red
    } else {
      dayRecord.status = 'partial'; // Yellow
    }
  }

  triggerLowStockAlert(med) {
    // Avoid duplicate alerts
    const existing = this.state.alerts.find(a => a.type === 'LOW_STOCK' && a.medicineId === med.id);
    if (!existing) {
      this.state.alerts.unshift({
        id: `alt-${Date.now()}`,
        type: "LOW_STOCK",
        severity: "warning",
        title: "Low Medicine Stock",
        titleHindi: "दवा का कम स्टॉक",
        message: `${med.brandName || med.name} has only ${med.stock.currentQty} ${med.stock.unit} remaining.`,
        messageHindi: `${med.brandName || med.name} की केवल ${med.stock.currentQty} दवाएं बची हैं।`,
        medicineId: med.id,
        timestamp: new Date().toISOString()
      });
    }
  }

  snoozeReminder(minutes = 15) {
    const snoozeTime = new Date(Date.now() + minutes * 60 * 1000);
    this.state.snoozedUntil = snoozeTime.toISOString();
    this.saveState();
    return snoozeTime;
  }

  // Guardian stock adjustment
  updateStock(medicineId, newQty, reason, guardianName = "Priya Sharma") {
    const med = this.state.medicines.find(m => m.id === medicineId);
    if (!med) return false;

    const oldQty = med.stock.currentQty;
    med.stock.currentQty = parseInt(newQty, 10);
    med.stock.refillDate = new Date().toISOString().split('T')[0];

    // Remove low stock alert if resolved
    if (med.stock.currentQty > med.stock.reorderThreshold) {
      this.state.alerts = this.state.alerts.filter(a => !(a.type === 'LOW_STOCK' && a.medicineId === med.id));
    } else {
      this.triggerLowStockAlert(med);
    }

    // Add to timeline
    this.state.timeline.unshift({
      id: `tl-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: `${guardianName} (Guardian)`,
      type: "STOCK_ADJUSTED",
      details: `${med.brandName || med.name} stock changed from ${oldQty} to ${newQty} ${med.stock.unit}. Note: ${reason}`,
      detailsHindi: `${med.brandName || med.name} का स्टॉक ${oldQty} से बदलकर ${newQty} किया गया। टिप्पणी: ${reason}`
    });

    this.saveState();
    return true;
  }

  // Add / Edit Medicine (Guardian only)
  saveMedicine(medData) {
    const index = this.state.medicines.findIndex(m => m.id === medData.id);
    const now = new Date().toISOString();

    if (index >= 0) {
      this.state.medicines[index] = { ...this.state.medicines[index], ...medData, lastUpdated: now };
      this.state.timeline.unshift({
        id: `tl-${Date.now()}`,
        timestamp: now,
        actor: "Priya Sharma (Guardian)",
        type: "MED_UPDATED",
        details: `Updated details for ${medData.brandName || medData.name}.`,
        detailsHindi: `${medData.brandName || medData.name} का विवरण संशोधित किया गया।`
      });
    } else {
      const newMed = {
        ...medData,
        id: `med-${Date.now()}`,
        active: true,
        lastUpdated: now
      };
      this.state.medicines.push(newMed);
      this.state.timeline.unshift({
        id: `tl-${Date.now()}`,
        timestamp: now,
        actor: "Priya Sharma (Guardian)",
        type: "MED_ADDED",
        details: `Added new medicine: ${newMed.brandName || newMed.name}.`,
        detailsHindi: `नई दवा जोड़ी गई: ${newMed.brandName || newMed.name}।`
      });
    }

    this.saveState();
    return true;
  }

  // Prescription storage
  addPrescription(rxData) {
    const newRx = {
      ...rxData,
      id: `rx-${Date.now()}`,
      date: rxData.date || new Date().toISOString().split('T')[0]
    };
    this.state.prescriptions.unshift(newRx);

    this.state.timeline.unshift({
      id: `tl-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: "Priya Sharma (Guardian)",
      type: "PRESCRIPTION_UPLOADED",
      details: `Stored new prescription from ${newRx.doctorName} (${newRx.clinic || 'Clinic'}).`,
      detailsHindi: `${newRx.doctorName} का नया मेडिकल पर्चा अपलोड किया गया।`
    });

    this.saveState();
    return newRx;
  }

  // Guardian Connection Pairing Workflow
  connectPatient(code, guardianId = "grd-priya-01") {
    if (code.toUpperCase().trim() === this.state.user.connectionCode) {
      // Find or add guardian
      const existing = this.state.user.connectedGuardians.find(g => g.id === guardianId);
      if (existing) {
        existing.status = 'connected';
      } else {
        this.state.user.connectedGuardians.push({
          id: guardianId,
          name: "Priya Sharma",
          relationship: "Daughter",
          phone: "+91 98765 43210",
          status: "connected",
          connectedDate: new Date().toISOString().split('T')[0],
          permissions: {
            viewSchedule: true,
            manageMedicines: true,
            manageStock: true,
            receiveAlerts: true,
            viewPrescriptions: true,
            emergencyAccess: true
          }
        });
      }

      this.addNotification({
        title: "Guardian Connected",
        message: "Priya Sharma has been paired successfully to monitor medication routine.",
        type: "PAIRING"
      });

      this.saveState();
      return { success: true, message: "Connected successfully!" };
    }
    return { success: false, message: "Invalid 6-digit connection code." };
  }

  generateNewCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'RAM-';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    this.state.user.connectionCode = code;
    this.saveState();
    return code;
  }

  // Caregiver Log
  addCaregiverLog(action, notes, followUpNeeded = false) {
    const log = {
      id: `cgl-${Date.now()}`,
      timestamp: new Date().toISOString(),
      guardianName: "Priya Sharma",
      action: action,
      actionHindi: action,
      notes: notes,
      followUpNeeded: followUpNeeded
    };
    this.state.caregiverLogs.unshift(log);
    this.saveState();
    return log;
  }

  addNotification(notif) {
    this.state.notifications.unshift({
      id: `notif-${Date.now()}`,
      read: false,
      timestamp: new Date().toISOString(),
      ...notif
    });
    this.saveState();
  }

  clearAlert(alertId) {
    this.state.alerts = this.state.alerts.filter(a => a.id !== alertId);
    this.saveState();
  }

  // Preferences
  setFontSize(size) {
    if (['normal', 'large', 'xlarge'].includes(size)) {
      this.state.preferences.fontSize = size;
      document.body.classList.remove('font-normal', 'font-large', 'font-xlarge');
      document.body.classList.add(`font-${size}`);
      this.saveState();
    }
  }

  setHighContrast(enabled) {
    this.state.preferences.highContrast = !!enabled;
    if (this.state.preferences.highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
    this.saveState();
  }

  setReducedMotion(enabled) {
    this.state.preferences.reducedMotion = !!enabled;
    if (this.state.preferences.reducedMotion) {
      document.body.classList.add('reduced-motion');
    } else {
      document.body.classList.remove('reduced-motion');
    }
    this.saveState();
  }

  // Reset to initial demo state
  resetToDefault() {
    this.state = this.createInitialState();
    this.saveState();
    location.reload();
  }
}

const stateManager = new StateManager();
window.stateManager = stateManager;
