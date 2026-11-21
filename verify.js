const fs = require('fs');
const path = require('path');

const baseDir = __dirname;
let errors = [];

// 1. Check index.html exists
const indexPath = path.join(baseDir, 'index.html');
if (!fs.existsSync(indexPath)) {
  errors.push('index.html is missing!');
} else {
  const indexContent = fs.readFileSync(indexPath, 'utf-8');

  // Check script tags
  const scriptRegex = /<script\s+src="([^"]+)"/g;
  let match;
  while ((match = scriptRegex.exec(indexContent)) !== null) {
    const src = match[1];
    if (!src.startsWith('http')) {
      const scriptFile = path.join(baseDir, src);
      if (!fs.existsSync(scriptFile)) {
        errors.push(`Referenced script missing: ${src}`);
      } else {
        console.log(`[PASS] Script found: ${src}`);
      }
    }
  }

  // Check stylesheet tags
  const cssRegex = /<link\s+rel="stylesheet"\s+href="([^"]+)"/g;
  while ((match = cssRegex.exec(indexContent)) !== null) {
    const href = match[1];
    if (!href.startsWith('http')) {
      const cssFile = path.join(baseDir, href);
      if (!fs.existsSync(cssFile)) {
        errors.push(`Referenced stylesheet missing: ${href}`);
      } else {
        console.log(`[PASS] Stylesheet found: ${href}`);
      }
    }
  }

  // Check critical element IDs
  const requiredIds = [
    'portal-auth',
    'portal-patient',
    'portal-guardian',
    'portal-admin',
    'signInForm',
    'registerForm',
    'forgotPasswordForm',
    'userHeaderProfile',
    'logoutBtn',
    'unauthorizedModal',
    'heroNextDoseContainer',
    'patientDoseCounts',
    'todayScheduleList',
    'pillPassportGrid',
    'patientHeatmapContainer',
    'patientAdherenceStats',
    'patientPrescriptionsList',
    'guardianAlertsContainer',
    'adherenceDonutChart',
    'guardianRecentActivityList',
    'guardianMedicinesList',
    'guardianStockTableBody',
    'guardianPrescriptionVaultGrid',
    'guardianHeatmapContainer',
    'guardianTimelineList',
    'voiceMicBtn',
    'voiceTranscript',
    'confirmDoseModal',
    'snoozeModal',
    'contactGuardianModal',
    'adjustStockModal',
    'addMedicineModal',
    'uploadPrescriptionModal',
    'emergencyCardModal'
  ];

  requiredIds.forEach(id => {
    if (!indexContent.includes(`id="${id}"`)) {
      errors.push(`Missing required HTML ID: #${id}`);
    } else {
      console.log(`[PASS] ID verified: #${id}`);
    }
  });
}

// 2. Check SVG Pill graphics
const pillDir = path.join(baseDir, 'assets', 'pills');
const expectedPills = [
  'metformin.svg',
  'amlodipine.svg',
  'atorvastatin.svg',
  'multivitamin.svg',
  'paracetamol.svg',
  'generic-pill.svg'
];

expectedPills.forEach(p => {
  const file = path.join(pillDir, p);
  if (!fs.existsSync(file)) {
    errors.push(`Missing pill asset: ${p}`);
  } else {
    console.log(`[PASS] Asset found: ${p}`);
  }
});

// 3. Check Vercel & Supabase Deployment Assets
const deploymentFiles = [
  'vercel.json',
  '.env.example',
  'supabase_schema.sql',
  'js/supabase.js'
];

deploymentFiles.forEach(f => {
  const file = path.join(baseDir, f);
  if (!fs.existsSync(file)) {
    errors.push(`Missing deployment configuration file: ${f}`);
  } else {
    console.log(`[PASS] Deployment file verified: ${f}`);
  }
});

console.log('\n--- VERIFICATION SUMMARY ---');
if (errors.length > 0) {
  console.error(`FAILED with ${errors.length} errors:`);
  errors.forEach(e => console.error('  - ' + e));
  process.exit(1);
} else {
  console.log('ALL INTEGRITY CHECKS PASSED PERFECTLY (0 errors)!');

  // Prepare "public" output directory for Vercel
  try {
    const publicDir = path.join(baseDir, 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    fs.copyFileSync(path.join(baseDir, 'index.html'), path.join(publicDir, 'index.html'));

    ['css', 'js', 'assets'].forEach(dir => {
      const src = path.join(baseDir, dir);
      const dest = path.join(publicDir, dir);
      if (fs.existsSync(src)) {
        fs.cpSync(src, dest, { recursive: true, force: true });
      }
    });

    console.log('[PASS] Output Directory "public" prepared and verified for Vercel static build!');
  } catch (err) {
    console.warn('Notice: Could not sync public directory, root files will be used:', err);
  }

  process.exit(0);
}
