# MediTrack – Your Family's Medication Companion

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-success?style=for-the-badge&logo=vercel)](https://meditrack-vtw8-hl12g7nw8-mahisharma26.vercel.app/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/mahisharma26/Meditrack)

> **Live Production Website:** [https://meditrack-vtw8-hl12g7nw8-mahisharma26.vercel.app/](https://meditrack-vtw8-hl12g7nw8-mahisharma26.vercel.app/)  
> An elderly-first, highly accessible healthcare web application designed to help senior patients manage their daily medicines with ease while allowing authorized family guardians to monitor routines, manage stock, and support patients remotely.

---

## 🌟 Key Features & Updates

### 1. Proper Role-Based Authentication System
- **Login Page as Entry Point**: When unauthenticated, users are greeted with a clean, elderly-friendly login portal with tabs for **Sign In**, **Register New Account**, and **Forgot Password**.
- **Role Redirection**: After authenticating, users are automatically directed to their authorized dashboard:
  - 👴 **Patient** -> Patient Dashboard (`#portal-patient`)
  - 👩‍💼 **Guardian** -> Caregiver Dashboard (`#portal-guardian`)
  - ⚙️ **Admin** -> Clinical & Demo Hub (`#portal-admin`)
- **Strict Role-Access Guards**: Patients cannot access guardian administration or inventory tools; Guardians cannot alter unauthorized accounts. Unauthorized URL or dashboard attempts trigger an **Access Restricted** barrier.
- **Judge & Demonstration Fast-Track**: Prominent 1-click test login buttons on the login screen for:
  - **Ramesh Sharma (Patient)** &bull; Age 74
  - **Priya Sharma (Guardian)** &bull; Daughter & Primary Caregiver
  - **Dr. Ananya Sen (Admin)** &bull; Healthcare Administrator
- **Logout Functionality**: Dedicated Logout button in the header that clears sessions, tears down active state, and safely returns to the login screen.
- **Supabase Cloud Authentication & PostgreSQL RLS**:
  - Connected via `@supabase/supabase-js`.
  - When configured in `.env`, uses Supabase Auth + PostgreSQL Row Level Security (RLS) policies.
  - When Supabase is not configured, automatically runs in a clearly marked **Prototype Demo Authentication** mode (client-side mock) for evaluation without breaking.

---

### 2. Voice Assistant – Light Mint & Pale Sage Update
- **Soothing Light Palette**: Replaced the previous dark teal container with a soft, light mint / pale sage green gradient (`#EAF5F1` to `#F4FAF7`) and a subtle sage border (`#C4DFD5`).
- **High-Contrast Typography**: Body text and questions in deep charcoal (`#1C2421`) ensuring maximum readability for seniors.
- **Microphone Button**: Large 84px touch button with crisp muted teal icon (`#1A6B70`), off-white background, and high-visibility pulsing ring when listening.
- **Readable Bubbles**: Live transcription bubble on warm white (`#FFFFFF`) with sage border, and spoken assistant answers on soft mint (`#D8EFE6`).
- **Interactive Simulation Chips**: Muted teal outline chips allowing zero-hardware speech simulation in any browser.

---

### 3. Elderly-First Accessible Design System
- **Warm, Soothing Palette**: Warm ivory backgrounds (`#FAF8F5`), calming muted teal (`#1A6B70`), soft sage green (`#4E7E6B`), and deep charcoal text (`#1C2421`) adhering to WCAG 2.1 AAA high-contrast standards (>7:1 contrast ratio).
- **Dynamic Text Size Switcher**: Instant adjustment between **Normal (18px)**, **Large (21px)**, and **Extra Large (24px)**.
- **High-Contrast Mode**: Single-click toggle for black-and-gold high-contrast view for low-vision seniors.
- **Reduced-Motion Mode**: Accessible toggle respecting users with vestibular sensitivities.
- **Keyboard Navigation**: High-visibility focus rings and accessible skip link.

---

### 4. Patient Portal
- **Next Scheduled Medicine Hero Card**: Prominently displays pill visual, time, dosage, and food instructions.
- **Three Oversized Primary Buttons**:
  1. `I HAVE TAKEN IT` – Records exact timestamp, decrements stock, updates calendar heatmap, and notifies guardian.
  2. `REMIND ME LATER` – Snoozes for 15, 30, or 60 minutes with spoken feedback.
  3. `CONTACT GUARDIAN` – One-tap direct call or SOS alert to daughter Priya.
- **Six Navigation Sections**: Home, My Medicines (Pill Passport), My Schedule, My Progress (Memory Map), My Prescriptions, and Settings.
- **Safety Lock**: Prescription instructions are view-only for patients; patients cannot independently modify prescribed dosages.

---

### 5. Guardian Portal
- **Caregiver Dashboard**: Monitoring Ramesh Sharma (Father, Age 74).
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

---

## ☁️ Vercel Deployment Instructions

Follow these step-by-step instructions to deploy MediTrack to Vercel:

### Step 1: Push Project to GitHub

1. Open your terminal in the MediTrack project folder:
   ```powershell
   cd C:\Users\ASUS\.gemini\antigravity\scratch\meditrack
   ```
2. Create a new repository on [GitHub](https://github.com/new) named `meditrack`.
3. Link your remote repository and push:
   ```bash
   git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/meditrack.git
   git branch -M main
   git push -u origin main
   ```

---

### Step 2: Connect Supabase (Optional for Cloud Database & Auth)

1. Sign in to [Supabase](https://supabase.com) and click **New Project**.
2. Go to **SQL Editor** -> **New Query**.
3. Open `supabase_schema.sql` from this project, copy the full contents, paste into the Supabase SQL editor, and click **Run**.
4. Go to **Project Settings** -> **API** and copy:
   - **Project URL** (`https://xyzcompany.supabase.co`)
   - **anon public key** (`eyJhbGciOiJIUz...`)

---

### Step 3: Import Project to Vercel

1. Log in to your [Vercel Dashboard](https://vercel.com).
2. Click **Add New...** -> **Project**.
3. Select your GitHub repository `meditrack` and click **Import**.
4. Configure Build and Output Settings:
   - **Framework Preset**: `Other`
   - **Build Command**: `node verify.js` (or leave default)
   - **Output Directory**: `.` (Root directory)
5. Expand the **Environment Variables** section and add:
   - `SUPABASE_URL`: Your Supabase Project URL
   - `SUPABASE_ANON_KEY`: Your Supabase anon public key
6. Click **Deploy**.

---

### Step 4: Testing Your Live Deployment

1. Once the deployment finishes, Vercel will provide your live URL (e.g., `https://meditrack-xyz.vercel.app`).
2. Open the URL:
   - You will see the **MediTrack Login Portal**.
   - Click **`👴 Ramesh Sharma (Patient)`** under **Demonstration Quick-Login**.
   - You will be redirected to the **Patient Portal**.
   - Test marking a dose as taken, testing voice simulation, and viewing the Pill Passport.
   - Click **Log Out** in the header.
   - Click **`👩‍💼 Priya Sharma (Guardian)`** to view the caregiver dashboard, adherence donut chart, and generate the Doctor Visit PDF.

---

## 🧪 Local Testing & Verification

Run the automated integrity verification:
```powershell
cd C:\Users\ASUS\.gemini\antigravity\scratch\meditrack
node verify.js
node test_auth_flow.js
```

Start the local server:
```powershell
node dev-server.js
```
Then visit: `http://localhost:3000` (or `http://127.0.0.1:3000`).

---
*Built with care for seniors and their families.*
