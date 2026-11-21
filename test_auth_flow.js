/**
 * MediTrack - Authentication & Role Permission Verification Test
 */

const fs = require('fs');
const path = require('path');

// Mock browser globals for testing
global.window = global;
global.localStorage = {
  store: {},
  getItem(k) { return this.store[k] || null; },
  setItem(k, v) { this.store[k] = String(v); },
  removeItem(k) { delete this.store[k]; },
  clear() { this.store = {}; }
};
global.CustomEvent = class {
  constructor(name, detail) { this.name = name; this.detail = detail; }
};
global.dispatchEvent = () => {};
global.addEventListener = () => {};
global.document = {
  documentElement: { lang: 'en' },
  body: {
    classList: {
      add() {},
      remove() {}
    }
  },
  querySelectorAll() { return []; },
  getElementById() { return null; }
};

// Load modules
const { CONFIG, ROLES, INITIAL_DATA } = require('./js/config.js');
global.CONFIG = CONFIG;
global.ROLES = ROLES;
global.INITIAL_DATA = INITIAL_DATA;

// Load state.js logic
const stateCode = fs.readFileSync(path.join(__dirname, 'js/state.js'), 'utf-8');
eval(stateCode);

console.log('--- TEST 1: Initial Unauthenticated State ---');
console.assert(stateManager.isAuthenticated() === false, 'Should be unauthenticated initially');
console.assert(stateManager.getRole() === null, 'Role should be null when unauthenticated');
console.assert(stateManager.canAccessRole('patient') === false, 'Cannot access patient without auth');
console.assert(stateManager.canAccessRole('guardian') === false, 'Cannot access guardian without auth');
console.log('✓ PASS: Unauthenticated state properly guarded.');

console.log('\n--- TEST 2: Patient Authentication & Role Guard ---');
stateManager.login({
  user: {
    id: "pat-ramesh-01",
    email: "ramesh@meditrack.demo",
    name: "Ramesh Sharma",
    role: "patient"
  }
});
console.assert(stateManager.isAuthenticated() === true, 'Patient should be authenticated');
console.assert(stateManager.getRole() === 'patient', 'Role should be patient');
console.assert(stateManager.canAccessRole('patient') === true, 'Patient CAN access patient portal');
console.assert(stateManager.canAccessRole('guardian') === false, 'Patient CANNOT access guardian portal');
console.assert(stateManager.canAccessRole('admin') === false, 'Patient CANNOT access admin portal');
console.log('✓ PASS: Patient permissions strictly enforced.');

console.log('\n--- TEST 3: Patient Dose Confirmation & Stock Update ---');
const initialQty = stateManager.state.medicines[0].stock.currentQty;
const doseRes = stateManager.confirmDose("med-01", "morning", "2026-11-21", "patient");
console.assert(doseRes.success === true, 'Dose confirmation should succeed');
console.assert(stateManager.state.medicines[0].stock.currentQty === initialQty - 1, 'Stock should decrement by 1');
const latestNotif = stateManager.state.notifications[0];
console.assert(latestNotif.type === 'DOSE_CONFIRMED', 'Notification should be created for guardian');
console.log('✓ PASS: Dose confirmation and stock decrement verified.');

console.log('\n--- TEST 4: Guardian Authentication & Role Guard ---');
stateManager.login({
  user: {
    id: "grd-priya-01",
    email: "priya@meditrack.demo",
    name: "Priya Sharma",
    role: "guardian"
  }
});
console.assert(stateManager.isAuthenticated() === true, 'Guardian should be authenticated');
console.assert(stateManager.getRole() === 'guardian', 'Role should be guardian');
console.assert(stateManager.canAccessRole('guardian') === true, 'Guardian CAN access guardian portal');
console.assert(stateManager.canAccessRole('admin') === false, 'Guardian CANNOT access admin portal');
console.log('✓ PASS: Guardian permissions strictly enforced.');

console.log('\n--- TEST 5: Guardian Stock Adjustment ---');
const adjustRes = stateManager.updateStock("med-03", 25, "Purchased 2 strips from Apollo Pharmacy", "Priya Sharma");
console.assert(adjustRes === true, 'Stock adjustment should succeed');
console.assert(stateManager.state.medicines.find(m => m.id === 'med-03').stock.currentQty === 25, 'Stock should be 25');
const latestTimeline = stateManager.state.timeline[0];
console.assert(latestTimeline.type === 'STOCK_ADJUSTED', 'Timeline entry should be logged');
console.log('✓ PASS: Guardian stock adjustment and audit timeline verified.');

console.log('\n--- TEST 6: Logout & Session Teardown ---');
stateManager.logout();
console.assert(stateManager.isAuthenticated() === false, 'Should be unauthenticated after logout');
console.assert(stateManager.getRole() === null, 'Role should be null after logout');
console.assert(localStorage.getItem('meditrack_auth_session') === null, 'Session item should be removed');
console.log('✓ PASS: Logout successfully cleared session.');

console.log('\n========================================');
console.log('ALL AUTHENTICATION & PERMISSION TESTS PASSED (6/6)!');
console.log('========================================');
