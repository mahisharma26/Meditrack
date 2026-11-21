/**
 * MediTrack - Notification System & Web Audio Chime Synthesizer
 * Browser Notification API + In-App Notification Center + Gentle Audio Chimes
 */

class NotificationManager {
  constructor() {
    this.audioCtx = null;
    this.hasBrowserPermission = false;
    this.checkPermission();
  }

  checkPermission() {
    if ("Notification" in window) {
      this.hasBrowserPermission = Notification.permission === "granted";
    }
  }

  async requestPermission() {
    if (!("Notification" in window)) {
      alert("Browser notifications are not supported by this browser.");
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      this.hasBrowserPermission = permission === "granted";
      if (this.hasBrowserPermission) {
        this.send("MediTrack Notifications Active", "You will now receive timely reminders for Ramesh-ji's daily medications.");
      }
      return this.hasBrowserPermission;
    } catch (e) {
      console.warn("Notification permission request error:", e);
      return false;
    }
  }

  // Play gentle, comfortable sound chime using Web Audio API (sine waves)
  playChime(type = 'normal') {
    if (!window.stateManager || !window.stateManager.state.preferences.soundEnabled) return;

    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;

      if (!this.audioCtx) {
        this.audioCtx = new AudioContext();
      }

      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const now = this.audioCtx.currentTime;

      if (type === 'urgent') {
        // Double gentle chime for alert
        this.createTone(520, now, 0.2);
        this.createTone(660, now + 0.25, 0.35);
      } else {
        // Calm pleasant harmonic chime for medicine reminder
        this.createTone(440, now, 0.25);
        this.createTone(554.37, now + 0.15, 0.3);
        this.createTone(659.25, now + 0.3, 0.45);
      }
    } catch (e) {
      console.warn("Audio chime playback error:", e);
    }
  }

  createTone(freq, startTime, duration) {
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.exponentialRampToValueAtTime(0.18, startTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  send(title, body, icon = "assets/pills/generic-pill.svg") {
    // 1. In-app state notification
    if (window.stateManager) {
      window.stateManager.addNotification({
        title,
        message: body,
        type: "SYSTEM"
      });
    }

    // 2. Play gentle audio chime
    this.playChime();

    // 3. Browser system notification if supported & permitted
    if (this.hasBrowserPermission && "Notification" in window) {
      try {
        new Notification(title, {
          body,
          icon,
          badge: icon,
          vibrate: [200, 100, 200]
        });
      } catch (e) {
        console.warn("Native notification dispatch error:", e);
      }
    }

    // 4. Update UI bell badge
    this.renderNotificationCenter();
  }

  renderNotificationCenter() {
    const listEl = document.getElementById('notificationList');
    const badgeEl = document.getElementById('notificationBadge');
    if (!listEl) return;

    const notifs = window.stateManager ? window.stateManager.state.notifications : [];
    const unreadCount = notifs.filter(n => !n.read).length;

    if (badgeEl) {
      badgeEl.textContent = unreadCount;
      badgeEl.classList.toggle('d-none', unreadCount === 0);
    }

    if (notifs.length === 0) {
      listEl.innerHTML = `<li class="p-3 text-center text-muted">No recent notifications</li>`;
      return;
    }

    listEl.innerHTML = notifs.slice(0, 8).map(n => `
      <li class="dropdown-item p-3 border-bottom text-wrap ${n.read ? 'opacity-75' : 'bg-light'}">
        <div class="d-flex justify-content-between align-items-center mb-1">
          <strong class="fs-6">${n.title}</strong>
          <small class="text-muted">${n.timestamp ? n.timestamp.slice(11, 16) : ''}</small>
        </div>
        <p class="mb-0 small text-secondary">${n.message}</p>
      </li>
    `).join('');
  }

  markAllAsRead() {
    if (window.stateManager) {
      window.stateManager.state.notifications.forEach(n => n.read = true);
      window.stateManager.saveState();
      this.renderNotificationCenter();
    }
  }
}

const notificationManager = new NotificationManager();
window.notificationManager = notificationManager;
