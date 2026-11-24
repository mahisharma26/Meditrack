# 💊 MediTrack – Your Family's Medication Companion

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-success?style=for-the-badge&logo=vercel)](https://meditrack-vtw8-hl12g7nw8-mahisharma26.vercel.app/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/mahisharma26/Meditrack)
[![Accessibility](https://img.shields.io/badge/WCAG_2.1-AAA_Compliant-blue?style=for-the-badge)](https://www.w3.org/WAI/standards-guidelines/wcag/)

> **Live Website:** [https://meditrack-vtw8-hl12g7nw8-mahisharma26.vercel.app/](https://meditrack-vtw8-hl12g7nw8-mahisharma26.vercel.app/)  
> An accessible, elderly-first healthcare web application designed to help senior patients manage their daily medicines easily while allowing family guardians to monitor routines, manage stock, and provide support remotely.

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Design Philosophy](#-design-philosophy)
- [Key Features](#-key-features)
  - [1. Patient Portal](#1-patient-portal)
  - [2. Guardian Portal](#2-guardian-portal)
  - [3. Voice Assistant (English & Hindi)](#3-voice-assistant-english--hindi)
  - [4. Pill Passport](#4-pill-passport)
  - [5. Memory Map & Adherence Calendar](#5-memory-map--adherence-calendar)
  - [6. Stock & Expiry Guardian](#6-stock--expiry-guardian)
  - [7. Emergency Medical Card](#7-emergency-medical-card)
- [Quick Demo for Judges & Evaluators](#-quick-demo-for-judges--evaluators)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Running Locally](#-running-locally)
- [Deployment Guide](#-deployment-guide)

---

## 📖 Overview

Many elderly patients struggle with complex medication routines, confusing pill bottles, and missed doses. **MediTrack** bridges the gap between seniors and their families:

- **For Elderly Patients:** A clean, distraction-free interface with large text, clear visual pill cards, voice assistance, and simple one-tap confirmations.
- **For Family Guardians:** A real-time monitoring dashboard showing today's adherence, overdue dose alerts, remaining stock counts, upcoming expiry warnings, and downloadable doctor visit reports.

---

## 🎨 Design Philosophy

Built from the ground up for seniors and individuals with limited digital experience:

| Principle | How MediTrack Implements It |
| :--- | :--- |
| **Elderly-First Palette** | Warm ivory (`#FAF8F5`), calming muted teal (`#1A6B70`), and soft sage green (`#4E7E6B`). No harsh neon colors or flashing animations. |
| **High Contrast Typography** | Deep charcoal text (`#1C2421`) exceeding WCAG 2.1 AAA contrast ratio (>7:1). Default body text starts at 18px. |
| **Text Size Switcher** | Instant adjustment between **Normal (18px)**, **Large (21px)**, and **Extra Large (24px)**. |
| **High-Contrast Mode** | Single-click black-and-gold mode for users with low vision. |
| **Reduced Motion** | One-click toggle respecting users with vestibular sensitivity. |
| **Large Touch Targets** | Primary action buttons are 56px–72px tall with prominent icons and clear text labels. |

---

## 🚀 Key Features

### 1. Patient Portal
The simplest part of the application, designed for zero cognitive strain:
- **Next Medicine Hero Card:** Prominently highlights the next scheduled dose, pill photograph, exact time, and food instructions (e.g., *"Take with warm water after breakfast"*).
- **Three Large Action Buttons:**
  1. `I HAVE TAKEN IT` – Records confirmation with exact timestamp, decrements medicine stock, updates the adherence heatmap, and notifies family.
  2. `REMIND ME LATER` – Snoozes the reminder for 15, 30, or 60 minutes with spoken voice acknowledgment.
  3. `CONTACT GUARDIAN` – One-tap direct call or SOS help note sent to daughter Priya.
- **Safety Lock:** Prescribed instructions are locked; patients cannot independently modify prescribed dosages without authorization.

---

### 2. Guardian Portal
A comprehensive command hub for family caregivers:
- **Adherence Donut Chart:** Visual 30-day compliance tracking (powered by Chart.js).
- **Active Attention Alerts:**
  - *Dose Not Confirmed Alerts:* Raised after a 45-minute grace period with empathetic phrasing (*"Dose not confirmed"* instead of assuming omission).
  - *Low Stock Warnings:* Shows estimated days of medication supply remaining.
  - *Upcoming Expiry Warnings:* Flags medicines approaching expiry within 30 days.
- **Prescription Vault:** Digital library storing doctor consultation slips with print preview.
- **Doctor Visit Report (PDF):** Generates and downloads a custom clinical summary PDF via jsPDF with medication lists, adherence rates, and doctor signature lines.
- **Caregiver Activity Log:** Records phone check-ins, home visits, and follow-up notes.

---

### 3. Voice Assistant (English & Hindi)
- Powered by the browser **Web Speech API** (`SpeechRecognition` & `SpeechSynthesis`).
- Works in **English** (`en-US`) and **Hindi** (`hi-IN`).
- **Lighter Soothing Theme:** Soft mint and pale sage container (`#EAF5F1` to `#F4FAF7`) with deep charcoal text for comfortable contrast.
- **Supported Voice Commands:**
  - *"What medicines do I have today?"* / *"आज मेरी कौन सी दवाएं हैं?"*
  - *"What is my next medicine?"* / *"मेरी अगली दवा क्या है?"*
  - *"I have taken my medicine"* / *"मैंने दवा ले ली है"* *(Safety safeguard: triggers confirmation modal before modifying records!)*
  - *"Remind me later"* / *"मुझे बाद में याद दिलाएं"*
  - *"Call my guardian"* / *"गार्जियन को फोन करें"*
- **Simulation Chips:** Interactive quick-click chips for testing voice interactions on devices without microphone permissions.

---

### 4. Pill Passport
Visual identification guide for daily medicines:
- Realistic vector pill illustrations (Metformin, Amlodipine, Atorvastatin, Multivitamin, Paracetamol).
- Detailed attributes: color, shape, markings/imprints, dosage strength, and remaining days of stock.
- **Medical Safety Disclaimer:** Clearly states that visual traits alone cannot medically verify a pill and warns against taking unidentified medication.

---

### 5. Memory Map & Adherence Calendar
- Monthly calendar heatmap with accessible status indicators:
  - 🟢 **Green:** All scheduled doses confirmed.
  - 🟡 **Yellow:** Some doses pending / routine in progress.
  - 🔴 **Red:** Dose unconfirmed past grace period.
  - ⚪ **Grey:** No medication scheduled.
- Never communicates status through color alone (includes clear status icons).

---

### 6. Stock & Expiry Guardian
- Automatic stock deduction upon dose confirmation.
- Calculates estimated days of supply: `currentQty / dailyDoseCount`.
- Expired medicines are marked unsafe and blocked from appearing as available for patient use.
- Stock adjustment audit trail recording reasons for manual changes.

---

### 7. Emergency Medical Card
- One-click modal containing blood group (`B+`), severe drug allergies (`Penicillin`, `Sulfa`), chronic conditions, emergency contacts, and preferred hospital.
- Includes clean `@media print` formatting for a physical printed wallet card.

---

## 🎯 Quick Demo for Judges & Evaluators

You can test the entire workflow directly on the live website:  
👉 **[Open Live Demo](https://meditrack-vtw8-hl12g7nw8-mahisharma26.vercel.app/)**

### 1-Click Test Accounts
On the initial login screen, look at the **"Demonstration & Judges Quick-Login"** box:
- `👴 Ramesh Sharma (Patient)` $\rightarrow$ Opens the Patient Dashboard.
- `👩‍💼 Priya Sharma (Guardian)` $\rightarrow$ Opens the Caregiver Dashboard.
- `⚙️ Dr. Ananya Sen (Admin)` $\rightarrow$ Opens the Clinical Demo Hub.

### Suggested Evaluation Flow:
1. **Sign in as Ramesh (Patient):**
   - View next due dose: *Metformin 500mg* with pill photo and meal instructions.
   - Click the green button **"I HAVE TAKEN IT"** and confirm.
   - Notice the gentle audio chime, updated progress bar, and updated heatmap.
2. **Test Voice Interaction:**
   - Tap the microphone button or click any simulation chip (e.g., *"What is my next medicine?"*).
   - Listen to the audio response and note the live transcription bubble.
3. **Switch to Hindi Mode:**
   - Change the language dropdown to **हिंदी (Hindi)**.
   - The entire UI—navigation, reminder cards, buttons, and voice responses—translates instantly.
4. **Sign out & Sign in as Priya (Guardian):**
   - Click **Log Out** in the header.
   - Click **Priya Sharma (Guardian)**.
   - View the updated adherence donut chart, low stock alerts, and recent patient activity feed.
   - Click **"Download Doctor Visit Report (PDF)"** to download the clinical summary.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Core** | HTML5, CSS3, JavaScript (ES6+ Modular) |
| **Styling & Icons** | Custom Elderly-First CSS, Bootstrap 5.3, Bootstrap Icons |
| **Visual Charts** | Chart.js 4.4 |
| **PDF Generation** | jsPDF 2.5, jsPDF-AutoTable |
| **Voice & Audio** | Web Speech API (`SpeechRecognition`, `SpeechSynthesis`), Web Audio API |
| **Authentication & Cloud** | Supabase Auth, PostgreSQL with Row Level Security (RLS) *(plus client mock fallback)* |
| **Hosting & CDN** | Vercel Global Edge Network |

---

## 📁 Project Structure

```text
meditrack/
├── index.html               # Main application shell with all portals & modals
├── public/                  # Vercel deployment output bundle
├── css/
│   ├── main.css             # Elderly design tokens, WCAG AAA colors, typography
│   ├── patient.css          # Next-dose hero card, large buttons, pill passport
│   ├── guardian.css         # Caregiver dashboard, alerts, stock tables
│   └── components.css       # Voice visualizer, calendar heatmap, emergency card
├── js/
│   ├── config.js            # Fictional demo data (Ramesh & Priya Sharma)
│   ├── supabase.js          # Supabase cloud authentication & mock fallback
│   ├── i18n.js              # English & Hindi translation dictionary
│   ├── state.js             # LocalStorage state management & role guards
│   ├── voice.js             # Web Speech API voice assistant engine
│   ├── notifications.js     # Web Audio harmonic chimes & notification center
│   ├── adherence.js         # Adherence calculations & calendar heatmap
│   ├── pdf-report.js        # Doctor Visit Report PDF generator
│   ├── patient-portal.js    # Patient portal views & actions
│   ├── guardian-portal.js   # Guardian portal views & inventory management
│   ├── admin-portal.js      # Admin demo hub & scenario runner
│   └── app.js               # Main application coordinator & routing
├── assets/
│   └── pills/               # Realistic SVG pill illustrations
├── supabase_schema.sql      # PostgreSQL schema with Row Level Security policies
├── vercel.json              # Vercel static routing & security headers
├── verify.js                # Production build integrity verification script
├── test_auth_flow.js        # Automated unit test suite
└── README.md                # Project documentation
```

---

## 💻 Running Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)

### Steps
1. **Clone the repository:**
   ```bash
   git clone https://github.com/mahisharma26/Meditrack.git
   cd Meditrack
   ```

2. **Run verification & tests:**
   ```bash
   node verify.js
   node test_auth_flow.js
   ```

3. **Start local preview:**
   You can open `index.html` directly in your browser, or start a local server:
   ```bash
   npx serve .
   ```
   Then visit `http://localhost:3000`.

---

## ☁️ Deployment Guide

### Deploying on Vercel
1. Fork or push this repository to your GitHub account.
2. Sign in to [Vercel](https://vercel.com) and click **"Add New..." $\rightarrow$ "Project"**.
3. Import your `Meditrack` repository.
4. Set **Framework Preset** to `Other`.
5. Click **Deploy**. Vercel will build and publish your site in ~15 seconds.

### Connecting Supabase (Optional)
1. Create a project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor**, paste the contents of `supabase_schema.sql`, and click **Run**.
3. In Vercel Project Settings $\rightarrow$ **Environment Variables**, add:
   - `SUPABASE_URL` = `https://your-project.supabase.co`
   - `SUPABASE_ANON_KEY` = `your-anon-public-key`
4. Redeploy the project.

---

## 📄 License & Medical Disclaimer

- **License:** Open-source under the [MIT License](LICENSE).
- **Disclaimer:** *MediTrack is an adherence companion and family reminder tool. It does not provide medical diagnosis, treatment, or clinical advice. Always follow instructions from licensed healthcare professionals.*
