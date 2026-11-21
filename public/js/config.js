/**
 * MediTrack - Configuration and Default Demonstration Data
 * Fictional demonstration data for Ramesh Sharma (Patient) and Priya Sharma (Guardian)
 */

const CONFIG = {
  APP_NAME: "MediTrack",
  APP_TAGLINE: "Your Family's Medication Companion",
  GRACE_PERIOD_MINUTES: 45, // Alert generated if dose not confirmed 45 min after scheduled time
  LOW_STOCK_THRESHOLD_DAYS: 7, // Alert if less than 7 days of medication remaining
  EXPIRY_WARNING_DAYS: 30, // Alert if medicine expires within 30 days
  VERSION: "1.1.0",
  // Supabase Configuration Placeholders (injected via .env / window.ENV)
  SUPABASE_URL: window.ENV?.SUPABASE_URL || "",
  SUPABASE_ANON_KEY: window.ENV?.SUPABASE_ANON_KEY || ""
};

const DEMO_CREDENTIALS = {
  patient: {
    email: "ramesh@meditrack.demo",
    name: "Ramesh Sharma",
    role: "patient",
    description: "Elderly Patient (Age 74) - Type-2 Diabetes & Hypertension"
  },
  guardian: {
    email: "priya@meditrack.demo",
    name: "Priya Sharma",
    role: "guardian",
    description: "Family Guardian & Daughter - Caregiver Monitoring"
  },
  admin: {
    email: "admin@meditrack.demo",
    name: "Dr. Ananya Sen / Admin",
    role: "admin",
    description: "System & Clinical Administrator"
  }
};

const ROLES = {
  PATIENT: 'patient',
  GUARDIAN: 'guardian',
  ADMIN: 'admin'
};

const INITIAL_DATA = {
  // Demo Users
  currentUser: {
    id: "pat-ramesh-01",
    role: ROLES.PATIENT,
    name: "Ramesh Sharma",
    nameHindi: "रमेश शर्मा",
    age: 74,
    gender: "Male",
    phone: "+91 98765 12345",
    emergencyContact: "+91 98765 43210",
    avatar: "👴",
    connectionCode: "RAMESH-702",
    connectedGuardians: [
      {
        id: "grd-priya-01",
        name: "Priya Sharma",
        nameHindi: "प्रिया शर्मा",
        relationship: "Daughter (बेटी)",
        phone: "+91 98765 43210",
        email: "priya.sharma@example.com",
        status: "connected",
        connectedDate: "2026-10-01",
        permissions: {
          viewSchedule: true,
          manageMedicines: true,
          manageStock: true,
          receiveAlerts: true,
          viewPrescriptions: true,
          emergencyAccess: true
        }
      }
    ]
  },

  guardians: [
    {
      id: "grd-priya-01",
      role: ROLES.GUARDIAN,
      name: "Priya Sharma",
      nameHindi: "प्रिया शर्मा",
      relationship: "Daughter",
      phone: "+91 98765 43210",
      avatar: "👩‍💼",
      assignedPatients: ["pat-ramesh-01"]
    }
  ],

  admin: {
    id: "adm-system-01",
    role: ROLES.ADMIN,
    name: "System Administrator",
    nameHindi: "सिस्टम व्यवस्थापक",
    avatar: "⚙️"
  },

  // Fictional Medicines
  medicines: [
    {
      id: "med-01",
      name: "Metformin Hydrochloride",
      brandName: "Glyciphage 500mg",
      category: "Diabetes (शुगर)",
      type: "Tablet",
      dosage: "500 mg",
      visual: {
        color: "White",
        colorHindi: "सफेद",
        shape: "Oval Scored",
        shapeHindi: "अंडाकार कटा हुआ",
        markings: "500 / MET",
        image: "assets/pills/metformin.svg"
      },
      instructions: "Take with or right after meals with half a glass of warm water.",
      instructionsHindi: "भोजन के तुरंत बाद आधे गिलास गुनगुने पानी के साथ लें।",
      mealRelation: "after_meal", // before_meal, with_meal, after_meal, empty_stomach
      schedule: [
        { timeSlot: "morning", time: "08:30", label: "Morning Breakfast", labelHindi: "सुबह नाश्ता" },
        { timeSlot: "night", time: "20:30", label: "Dinner", labelHindi: "रात का खाना" }
      ],
      stock: {
        currentQty: 26,
        unit: "tablets",
        reorderThreshold: 10,
        refillDate: "2026-11-10",
        expiryDate: "2027-08-15"
      },
      prescribedBy: "Dr. Sunita Gupta (Endocrinologist)",
      prescriptionId: "rx-02",
      active: true,
      lastUpdated: "2026-11-10T10:00:00"
    },
    {
      id: "med-02",
      name: "Amlodipine Besylate",
      brandName: "Amlokind 5mg",
      category: "Blood Pressure (बीपी)",
      type: "Tablet",
      dosage: "5 mg",
      visual: {
        color: "Pale Yellow",
        colorHindi: "हल्का पीला",
        shape: "Round Beveled",
        shapeHindi: "गोल उभरा हुआ",
        markings: "5 / AML",
        image: "assets/pills/amlodipine.svg"
      },
      instructions: "Take once daily in the morning, with or without food. Do not skip.",
      instructionsHindi: "रोजाना सुबह एक बार लें, खाने के साथ या बिना। छोड़ें नहीं।",
      mealRelation: "anytime",
      schedule: [
        { timeSlot: "morning", time: "08:00", label: "Morning", labelHindi: "सुबह" }
      ],
      stock: {
        currentQty: 18,
        unit: "tablets",
        reorderThreshold: 7,
        refillDate: "2026-11-05",
        expiryDate: "2027-04-10"
      },
      prescribedBy: "Dr. Rajesh Verma (Cardiologist)",
      prescriptionId: "rx-01",
      active: true,
      lastUpdated: "2026-11-05T09:30:00"
    },
    {
      id: "med-03",
      name: "Atorvastatin Calcium",
      brandName: "Atorva 20mg",
      category: "Cholesterol (कोलेस्ट्रॉल)",
      type: "Tablet",
      dosage: "20 mg",
      visual: {
        color: "White",
        colorHindi: "सफेद",
        shape: "Elliptical Smooth",
        shapeHindi: "दीर्घवृत्ताकार चिकना",
        markings: "ATV 20",
        image: "assets/pills/atorvastatin.svg"
      },
      instructions: "Take at bedtime with water. Avoid grapefruit juice.",
      instructionsHindi: "सोने से पहले पानी के साथ लें। चकोतरे के रस से बचें।",
      mealRelation: "before_bed",
      schedule: [
        { timeSlot: "night", time: "21:30", label: "Bedtime", labelHindi: "सोने के समय" }
      ],
      stock: {
        currentQty: 5, // LOW STOCK TRIGGER (5 days left)
        unit: "tablets",
        reorderThreshold: 7,
        refillDate: "2026-10-25",
        expiryDate: "2027-01-20"
      },
      prescribedBy: "Dr. Rajesh Verma (Cardiologist)",
      prescriptionId: "rx-01",
      active: true,
      lastUpdated: "2026-10-25T11:00:00"
    },
    {
      id: "med-04",
      name: "Multivitamin Silver 50+",
      brandName: "Becadexamin Silver",
      category: "Wellness & Bones (विटामिन)",
      type: "Capsule",
      dosage: "1 Softgel",
      visual: {
        color: "Amber Gold",
        colorHindi: "सुनहरा भूरा",
        shape: "Glossy Softgel",
        shapeHindi: "चमकदार सॉफ्टजेल कैप्सूल",
        markings: "Smooth",
        image: "assets/pills/multivitamin.svg"
      },
      instructions: "Take with water after lunch for best absorption.",
      instructionsHindi: "दोपहर के भोजन के बाद पानी के साथ लें।",
      mealRelation: "after_meal",
      schedule: [
        { timeSlot: "afternoon", time: "13:30", label: "After Lunch", labelHindi: "दोपहर खाने के बाद" }
      ],
      stock: {
        currentQty: 42,
        unit: "capsules",
        reorderThreshold: 10,
        refillDate: "2026-09-01",
        expiryDate: "2026-12-15" // UPCOMING EXPIRY (< 30 days from Nov 2026 local demo)
      },
      prescribedBy: "Dr. Sunita Gupta (Endocrinologist)",
      prescriptionId: "rx-02",
      active: true,
      lastUpdated: "2026-09-01T14:00:00"
    },
    {
      id: "med-05",
      name: "Paracetamol 650mg",
      brandName: "Dolo 650",
      category: "Joint Pain (दर्द निवारक SOS)",
      type: "Tablet",
      dosage: "650 mg",
      visual: {
        color: "White",
        colorHindi: "सफेद",
        shape: "Caplet Scored",
        shapeHindi: "कैपलेट कटा हुआ",
        markings: "DOLO 650",
        image: "assets/pills/paracetamol.svg"
      },
      instructions: "SOS only when knee or joint pain is severe. Maximum 2 tablets in 24 hours.",
      instructionsHindi: "केवल आवश्यकता पड़ने पर जोड़ों के दर्द में। 24 घंटे में अधिकतम 2 गोली।",
      mealRelation: "after_meal",
      schedule: [], // SOS / As needed
      stock: {
        currentQty: 10,
        unit: "tablets",
        reorderThreshold: 4,
        refillDate: "2026-10-15",
        expiryDate: "2027-11-30"
      },
      prescribedBy: "Dr. Rajesh Verma (Cardiologist)",
      prescriptionId: "rx-01",
      active: true,
      isSOS: true,
      lastUpdated: "2026-10-15T16:00:00"
    }
  ],

  // Prescriptions stored in Vault
  prescriptions: [
    {
      id: "rx-01",
      doctorName: "Dr. Rajesh Verma",
      specialty: "Senior Cardiologist, MD DM (Cardiology)",
      clinic: "Apollo Heart Centre, New Delhi",
      date: "2026-10-12",
      diagnosis: "Mild Essential Hypertension, Dyslipidemia",
      linkedMedicines: ["med-02", "med-03", "med-05"],
      notes: "Monitor BP weekly. Target sitting BP < 135/85 mmHg. Daily 30 min gentle walking.",
      notesHindi: "साप्ताहिक रूप से बीपी मापें। प्रतिदिन 30 मिनट हल्की सैर करें।",
      documentType: "prescription_card",
      fileName: "Rx_Apollo_Verma_Oct2026.pdf"
    },
    {
      id: "rx-02",
      doctorName: "Dr. Sunita Gupta",
      specialty: "Consultant Diabetologist & Endocrinologist",
      clinic: "Max Super Speciality Hospital, Saket",
      date: "2026-11-05",
      diagnosis: "Type 2 Diabetes Mellitus (HbA1c: 7.1%)",
      linkedMedicines: ["med-01", "med-04"],
      notes: "Strict low glycemic diet. Avoid refined sugar. Routine kidney function test in 3 months.",
      notesHindi: "कम चीनी वाला आहार। 3 महीने में किडनी की सामान्य जांच कराएं।",
      documentType: "prescription_card",
      fileName: "Rx_Max_Gupta_Nov2026.pdf"
    }
  ],

  // Emergency Medical Card Data
  emergencyCard: {
    patientName: "Ramesh Sharma",
    age: 74,
    gender: "Male",
    bloodGroup: "B+",
    chronicConditions: [
      "Type-2 Diabetes Mellitus (डायबिटीज)",
      "Mild Hypertension (उच्च रक्तचाप)",
      "Bilateral Knee Osteoarthritis (घुटने का दर्द)"
    ],
    allergies: [
      "Penicillin (पेनिसिलिन से एलर्जी - Severe Rashes)",
      "Sulfa Antibiotics (सल्फा दवाएं)"
    ],
    emergencyContacts: [
      {
        name: "Priya Sharma (Daughter)",
        relation: "Primary Guardian / Caregiver",
        phone: "+91 98765 43210"
      },
      {
        name: "Dr. Rajesh Verma",
        relation: "Primary Cardiologist",
        phone: "+91 98111 22334"
      }
    ],
    preferredHospital: "Max Super Speciality Hospital, Saket, New Delhi",
    medicalInsurance: "Star Health Senior Citizen Red Carpet - Policy #SH-882910-DEL",
    disclaimer: "This Emergency Medical Card is stored locally on the device for rapid first-responder reference during medical emergencies. Always verify with attending medical personnel."
  },

  // Audit Timeline of Changes
  timeline: [
    {
      id: "tl-01",
      timestamp: "2026-11-05T09:35:00",
      actor: "Priya Sharma (Guardian)",
      type: "MED_UPDATED",
      details: "Amlodipine dosage reviewed with Dr. Verma. Confirmed 5mg morning schedule.",
      detailsHindi: "डॉ. वर्मा के परामर्श से एम्लोडिपिन 5mg की खुराक सुबह तय की गई।"
    },
    {
      id: "tl-02",
      timestamp: "2026-11-10T10:15:00",
      actor: "Priya Sharma (Guardian)",
      type: "STOCK_REFILLED",
      details: "Purchased 2 strips (30 tablets) of Metformin 500mg. Stock updated to 28.",
      detailsHindi: "मेटफॉर्मिन 500mg की 30 गोलियां खरीदीं। स्टॉक 28 अपडेट किया।"
    },
    {
      id: "tl-03",
      timestamp: "2026-11-18T18:00:00",
      actor: "Priya Sharma (Guardian)",
      type: "PRESCRIPTION_UPLOADED",
      details: "Uploaded new prescription from Dr. Sunita Gupta dated 05-Nov-2026.",
      detailsHindi: "डॉ. सुनीता गुप्ता का नया पर्चा अपलोड किया।"
    }
  ],

  // Caregiver Follow-up notes
  caregiverLogs: [
    {
      id: "cgl-01",
      timestamp: "2026-11-20T19:30:00",
      guardianName: "Priya Sharma",
      action: "Phone Call Check-in",
      actionHindi: "फोन पर हालचाल लिया",
      notes: "Spoke with Papa. He had a healthy dinner and reported no knee pain today.",
      followUpNeeded: false
    },
    {
      id: "cgl-02",
      timestamp: "2026-11-19T14:15:00",
      guardianName: "Priya Sharma",
      action: "Stock Order Placed",
      actionHindi: "दवा का ऑर्डर दिया",
      notes: "Ordered Atorvastatin 20mg strip online from Apollo 247. Expected delivery Nov 22.",
      followUpNeeded: true
    }
  ],

  // Today's Date Anchor for Demonstration (Nov 21, 2026)
  demoToday: "2026-11-21"
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CONFIG, ROLES, INITIAL_DATA };
}
