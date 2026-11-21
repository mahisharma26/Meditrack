# MediTrack – Your Family's Medication Companion

> An elderly-first, highly accessible healthcare web application designed to help senior patients manage their daily medicines with ease while allowing authorized family guardians to monitor routines, manage stock, and support patients remotely.

---

## 🌟 Key Features & Implementation Highlights

### 1. Elderly-First Accessible Design System
- **Warm, Soothing Palette**: Warm ivory backgrounds (`#FAF8F5`), calming muted teal (`#1A6B70`), soft sage green (`#4E7E6B`), and deep charcoal text (`#1C2421`) adhering to WCAG 2.1 AAA high-contrast standards (>7:1 contrast ratio).
- **No Overwhelming Information**: Zero neon colors, flashing animations, or crowded layouts. Clean rounded cards with generous spacing.
- **Large Action Targets**: Buttons have minimum 56px–72px touch targets with clear text labels and high-visibility icons.
- **Dynamic Text Size Switcher**: Instant adjustment between **Normal (18px)**, **Large (21px)**, and **Extra Large (24px)**.
- **High-Contrast Mode**: Single-click toggle for black-and-gold high-contrast view for low-vision seniors.
- **Reduced-Motion Mode**: Accessible toggle respecting users with vestibular sensitivities.
- **Keyboard Navigation**: High-visibility focus rings and accessible skip link.

---

### 2. Two Distinct Portals & Role Redirection
- **Patient Portal (`#portal-patient`)**: Ultra-streamlined interface for seniors with limited digital experience.
  - **Greeting & Live Time**: "Good morning, Ramesh-ji!" with current day and date.
  - **Next Scheduled Medicine Hero Card**: Prominently displays pill visual, time, dosage, and food instructions.
  - **Three Oversized Primary Buttons**:
    1. `I HAVE TAKEN IT` – Records exact timestamp, decrements stock, updates calendar heatmap, and notifies guardian.
    2. `REMIND ME LATER` – Snoozes for 15, 30, or 60 minutes with spoken feedback.
    3. `CONTACT GUARDIAN` – One-tap direct call or SOS alert to daughter Priya.
  - **Six Simple Navigation Sections**: Home, My Medicines (Pill Passport), My Schedule, My Progress (Memory Map), My Prescriptions, and Settings.
  - **Patient Safety Lock**: Patients cannot alter prescribed medical instructions without guardian/physician authorization.
- **Guardian Portal (`#portal-guardian`)**: Comprehensive caregiver monitoring dashboard.
  - **Connected Patient Selector & Status**: Monitoring Ramesh Sharma (Father, Age 74).
  - **Adherence Donut Chart**: Chart.js adherence visualization for 30-day compliance (92%).
  - **Active Attention Alerts**:
    - *Unconfirmed Dose Alerts*: Raised after a 45-minute grace period with the empathetic phrasing *"Dose not confirmed"* (explicitly distinguishing unconfirmed action from skipping).
    - *Low Stock Warnings*: Alerts with estimated days of supply remaining.
    - *Upcoming Expiry Warnings*: Alerts for medicines expiring within 30 days.
  - **Stock & Expiry Guardian**: Inventory table with manual stock adjustment and pharmacy purchase audit notes.
  - **Prescription Vault**: Digital document library with consultation slips, doctor names, clinics, and print preview.
  - **1-Click Doctor Visit PDF Report**: Generates and downloads a custom clinical summary PDF via `jsPDF` and `autoTable`.
  - **Timeline of Safety Changes**: Audit trail tracking additions, dosage edits, and refills with caregiver actor timestamps.
  - **Caregiver Activity Log**: Log phone calls, home visits, and follow-up notes.
- **Admin & Demonstration Hub (`#portal-admin`)**: Quick demo scenario triggers and state reset tool.

---

### 3. Signature Feature: Guardian Connect System
- **Pairing Workflow**:
  1. Patient views unique 6-character connection code (`RAMESH-702`).
  2. Guardian enters code in "Connect New Patient" dialog.
  3. System links dashboards in real time.
  4. Configurable permissions (View Schedule, Manage Stock, Edit Regimen, Emergency Access).

---

### 4. Signature Feature: Voice Assistant (English & Hindi)
- Powered by the **Web Speech API** (`SpeechRecognition` & `SpeechSynthesis`).
- Works in **English** (`en-US`) and **Hindi** (`hi-IN`).
- Supported Voice Commands:
  - *"What medicines do I have today?"* / *"आज मेरी कौन सी दवाएं हैं?"*
  - *"What is my next medicine?"* / *"मेरी अगली दवा क्या है?"*
  - *"I have taken my medicine"* / *"मैंने दवा ले ली है"* (Safety rule: Prompts confirmation modal before modifying records!)
  - *"Remind me later"* / *"मुझे बाद में याद दिलाएं"*
  - *"Call my guardian"* / *"गार्जियन को फोन करें"*
- Includes interactive quick-simulation buttons so voice logic can be tested in any browser without microphone hardware.

---

### 5. Pill Passport & Visual Identification
- Realistic SVG illustrations for all medicines:
  - *Metformin 500mg*: White scored oval tablet with `500 / MET` debossing.
  - *Amlodipine 5mg*: Pale yellow round tablet with `5 / AML` markings.
  - *Atorvastatin 20mg*: White elliptical tablet with `ATV 20` markings.
  - *Multivitamin Silver 50+*: Translucent amber-gold glossy softgel capsule.
  - *Paracetamol 650mg*: Scored caplet for SOS joint pain.
- Clear medical safety disclaimer: Pill Passport visuals are for patient reference only and cannot medically guarantee pill identity.

---

### 6. Medication Memory Map (Calendar Heatmap)
- Simple 30-day adherence calendar:
  - 🟢 **Green**: All scheduled doses confirmed.
  - 🟡 **Yellow**: Some doses pending / routine in progress.
  - 🔴 **Red**: One or more doses unconfirmed past grace period.
  - ⚪ **Grey**: No medication scheduled.
- Never relies on color alone (uses accessible status icons: checkmarks, clock, caution triangles).

---

### 7. Regional Language Mode – Hindi (हिंदी)
- Real-time language switcher changing all UI elements, headings, buttons, reminders, voice assistant prompts, and calendar labels.
- Preserves brand names and prescribed medical terms.

---

### 8. Emergency Medical Card
- One-click accessible modal containing blood group (`B+`), severe drug allergies (`Penicillin`, `Sulfa`), chronic conditions, primary doctor, daughter contact, and preferred hospital.
- Features clean, printer-friendly CSS (`@media print`).

---

### 9. Offline-First Architecture
- Persistent client-side data store backed by `localStorage` and `IndexedDB`.
- Real-time `online`/`offline` listener displaying a synchronization banner.
- Offline queue ensures idempotent synchronization when network reconnects.

---

## 🚀 How to Run the Application

### Option A: Direct Browser Launch
Open `index.html` directly in any modern web browser (Chrome, Edge, Firefox, Safari):
```
C:\Users\ASUS\.gemini\antigravity\scratch\meditrack\index.html
```

### Option B: Using the Included Node.js Static Server
Run the lightweight server included in the project:
```powershell
cd C:\Users\ASUS\.gemini\antigravity\scratch\meditrack
node server.js
```
Then visit: `http://localhost:3000` (or `http://127.0.0.1:3000`).

---

## 🧪 Demonstration Flow (Step-by-Step)

1. **Patient Morning Routine**:
   - Open the web app (defaults to **Patient Portal** for Ramesh Sharma).
   - View next dose: *Metformin 500mg* due right now with meal instructions and pill photograph.
   - Click the green button **"I HAVE TAKEN IT"**.
   - Confirm in the dialog. Notice the confirmation chime, updated progress bar, and updated calendar heatmap.

2. **Voice Interaction**:
   - Tap the microphone button or click any simulation chip:
     - Click *"What is my next medicine?"* -> Spoken answer and transcription appear.
     - Click *"I have taken my medicine"* -> Confirmation dialog opens safely.

3. **Switch to Guardian Portal**:
   - Click **`👩‍💼 Priya Sharma (Guardian)`** on the top demo bar.
   - Notice the recent activity feed showing: *"Dose Confirmed by Ramesh-ji at 08:35 AM"*.
   - View the 30-day adherence chart (Chart.js) and active alerts.
   - Click **"Download Doctor Visit Report (PDF)"** to download the clinical summary.

4. **Simulate Unconfirmed Dose Alert**:
   - Click **`2. Unconfirmed Dose Alert`** on the top demo bar.
   - The Guardian dashboard immediately displays a red alert: *"Dose not confirmed: Ramesh-ji has not confirmed scheduled dose within 45-minute grace period"*.
   - Caregivers can click *"Call Papa"* or *"Confirm Dose Taken (Spoke with Papa)"*.

5. **Test Hindi Mode**:
   - Change the language dropdown from `English` to `हिंदी`.
   - All navigation tabs, reminders, buttons, and voice responses instantly translate to Hindi.

---

## 🔒 Limitations & Note on Security
- This initial prototype stores records in local browser storage (`localStorage` & `IndexedDB`) for seamless offline operation and demonstration.
- In production, sensitive medical records require an authenticated backend (e.g. Node/Express, PostgreSQL, OAuth2/OIDC, and HIPAA/GDPR-compliant encrypted cloud storage).

---
*Built with care for seniors and their families.*
