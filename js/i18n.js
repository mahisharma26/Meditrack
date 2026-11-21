/**
 * MediTrack - Internationalization Engine (English & Hindi)
 */

const TRANSLATIONS = {
  en: {
    // Brand & Header
    app_name: "MediTrack",
    app_tagline: "Your Family's Medication Companion",
    role_patient: "Patient Portal",
    role_guardian: "Guardian Portal",
    role_admin: "Admin & Demo Hub",
    switch_role: "Switch Portal",
    demo_mode_badge: "Demonstration Mode",
    connected_to: "Connected to",
    online: "Online",
    offline: "Offline",
    syncing: "Syncing...",
    synced: "Data Synced",
    font_size: "Text Size",
    font_normal: "Normal (18px)",
    font_large: "Large (21px)",
    font_xlarge: "Extra Large (24px)",
    high_contrast: "High Contrast",
    reduced_motion: "Reduce Motion",
    sound_alerts: "Voice & Audio Chimes",
    language: "Language",

    // Patient Navigation
    nav_home: "Home",
    nav_medicines: "My Medicines",
    nav_schedule: "My Schedule",
    nav_progress: "My Progress",
    nav_prescriptions: "My Prescriptions",
    nav_settings: "Settings",

    // Patient Greeting & Next Dose Hero
    greeting_morning: "Good morning",
    greeting_afternoon: "Good afternoon",
    greeting_evening: "Good evening",
    greeting_night: "Good night",
    today_is: "Today is",
    hero_title: "YOUR NEXT MEDICINE",
    status_due_now: "DUE RIGHT NOW",
    status_due_in: "Due in",
    status_overdue: "Pending Confirmation",
    status_taken_already: "Taken for this slot",
    status_all_done_today: "All scheduled medicines taken for today! Wonderful job.",
    take_dose_btn: "I HAVE TAKEN IT",
    remind_later_btn: "REMIND ME LATER",
    contact_guardian_btn: "CONTACT GUARDIAN",
    dose_amount: "Dose Amount",
    how_to_take: "How to take",
    prescribed_by: "Prescribed by",
    dose_confirmed_toast: "Dose recorded successfully! Your guardian Priya has been updated.",
    snooze_toast: "Reminder snoozed for 15 minutes. We will remind you again.",

    // Dose Counts & Progress
    doses_today: "Today's Routine",
    taken_count: "Taken",
    upcoming_count: "Upcoming",
    pending_count: "Pending / Overdue",
    daily_progress: "Daily Adherence",
    all_doses_complete: "All doses complete today!",

    // Quick Action Modals
    confirm_dose_title: "Confirm Taking Medicine",
    confirm_dose_msg: "Did you just take this medicine as prescribed?",
    confirm_yes: "Yes, I Have Taken It",
    confirm_no: "Cancel / Not Yet",
    snooze_title: "Snooze Reminder",
    snooze_15: "Snooze 15 Minutes",
    snooze_30: "Snooze 30 Minutes",
    snooze_60: "Snooze 1 Hour",
    contact_title: "Contact Your Guardian",
    contact_subtitle: "Your daughter Priya is connected to support you anytime.",
    call_guardian_btn: "Call Priya Now (+91 98765 43210)",
    send_sos_btn: "Send Need Help Message",
    sos_sent_msg: "Notification sent to Priya's phone: 'Papa needs assistance with medicine'.",

    // Pill Passport
    passport_title: "Pill Passport (Visual Medicine Guide)",
    passport_subtitle: "Visual reference photographs and details to help identify your daily medicines.",
    passport_disclaimer: "IMPORTANT: Pill Passport photographs and visual descriptions are for patient reference and convenience only. Visual traits alone cannot medically verify a pill. Never take unidentified medicines. Always follow doctor's prescription.",
    pill_shape: "Shape",
    pill_color: "Color",
    pill_markings: "Markings",
    pill_type: "Form",
    stock_remaining: "Stock Remaining",
    days_left: "days left",
    days_stock: "Days of stock remaining",
    supply_low_notice: "Your medicine supply is running low. Please contact your guardian to refill.",
    patient_read_only_note: "Prescription instructions are locked by your doctor and guardian for your safety.",

    // Patient Schedule
    schedule_title: "Today's Medication Schedule",
    slot_morning: "Morning (8:00 AM - 10:00 AM)",
    slot_afternoon: "Afternoon (1:00 PM - 2:30 PM)",
    slot_evening: "Evening (6:00 PM - 8:00 PM)",
    slot_night: "Night Bedtime (9:00 PM - 10:30 PM)",
    slot_sos: "SOS (As Needed for Pain)",
    confirmed_at: "Confirmed at",
    scheduled_at: "Scheduled at",

    // Patient Progress & Heatmap
    memory_map_title: "Medication Memory Map",
    memory_map_subtitle: "Simple monthly view of your medication routine and adherence.",
    heatmap_green: "All Doses Confirmed",
    heatmap_yellow: "Some Doses Pending",
    heatmap_red: "Dose Not Confirmed",
    heatmap_grey: "No Medicine Scheduled",
    weekly_adherence: "Weekly Adherence",
    monthly_adherence: "Monthly Adherence",
    total_confirmed_doses: "Total Confirmed Doses",
    total_unconfirmed_doses: "Total Unconfirmed Doses",
    unconfirmed_clarification: "Note: An unconfirmed dose indicates no button was pressed, not proof that the medicine was skipped.",

    // Patient Prescriptions
    prescriptions_title: "My Prescriptions Vault",
    prescriptions_subtitle: "Doctor consultation slips and valid medical prescriptions stored by your family.",
    view_prescription_btn: "View Details & Print",
    doctor_clinic: "Doctor & Clinic",
    prescription_date: "Date",
    diagnosis: "Diagnosis",
    linked_meds: "Associated Medicines",
    dr_notes: "Doctor's Advice & Notes",

    // Emergency Card
    emergency_card_title: "Emergency Medical Card",
    emergency_card_subtitle: "Vital health information for emergency responders and doctors.",
    emergency_disclaimer: "Privacy Notice: Emergency medical information is stored locally on this device for rapid first-responder reference during medical emergencies.",
    blood_group: "Blood Group",
    chronic_conditions: "Chronic Conditions",
    known_allergies: "Known Drug Allergies",
    emergency_contacts: "Emergency Contacts",
    preferred_hospital: "Preferred Hospital",
    insurance_details: "Health Insurance",
    print_card: "Print Emergency Card",

    // Voice Assistant
    voice_title: "MediTrack Voice Companion",
    voice_tap_to_speak: "Tap microphone to speak",
    voice_listening: "Listening carefully... Please speak now",
    voice_processing: "Understanding your request...",
    voice_stop_btn: "Stop Listening",
    voice_english_hint: 'Say: "What medicines do I have today?", "What is my next medicine?", "I have taken my medicine", or "Call my guardian".',
    voice_hindi_hint: 'बोलें: "आज मेरी कौन सी दवाएं हैं?", "मेरी अगली दवा क्या है?", "मैंने दवा ले ली है", या "गार्जियन को फोन करें"।',
    voice_confirm_action: "Voice Action Confirmation Required",
    voice_confirm_desc: "Did you just take your scheduled medicine? Please press Confirm to log.",

    // Guardian Portal
    guardian_overview: "Guardian Dashboard",
    guardian_overview_sub: "Remote medication monitoring, adherence tracking and inventory management for Ramesh Sharma.",
    active_alerts: "Active Attention Alerts",
    no_alerts: "No active alerts. All medications and stocks are currently well-managed.",
    alert_dose_unconfirmed: "Dose not confirmed: Ramesh-ji has not confirmed scheduled dose within the 45-minute grace period.",
    alert_low_stock: "Low stock alert: Atorvastatin Calcium has only 5 tablets remaining (~5 days left).",
    alert_expiry: "Upcoming expiry alert: Multivitamin Silver 50+ approaches expiry date within 30 days.",
    patient_adherence_today: "Today's Patient Adherence",
    recent_patient_activity: "Recent Patient Actions",
    guardian_actions: "Guardian Actions",
    add_medicine: "Add New Medicine",
    manage_stock_btn: "Adjust Stock & Refill",
    upload_rx_btn: "Upload Prescription",
    export_pdf_btn: "Download Doctor Visit Report (PDF)",
    guardian_patient_selector: "Select Patient Profile",

    // Guardian Stock & Expiry
    stock_management_title: "Medicine Stock & Expiry Guardian",
    stock_table_medicine: "Medicine Name",
    stock_table_current: "Current Quantity",
    stock_table_threshold: "Reorder Level",
    stock_table_days_left: "Est. Days Remaining",
    stock_table_expiry: "Expiry Date",
    stock_table_status: "Status",
    stock_table_actions: "Actions",
    status_good: "Adequate Stock",
    status_low: "Low Stock - Reorder Soon",
    status_critical: "Critically Low",
    status_expiring_soon: "Expiring Soon",
    status_expired: "Expired - Do Not Use",
    expired_warning_banner: "Expired medicines are marked unsafe and will not be displayed as available for patient use.",
    stock_adjust_modal_title: "Adjust Stock / Record Refill",
    new_quantity: "New Total Quantity",
    reason_for_change: "Reason for Adjustment / Pharmacy Note",

    // Guardian Connect & Family Circle
    guardian_connect_title: "Guardian Connect & Family Circle",
    guardian_connect_sub: "Pair family members, assign caregiver roles, and configure medication permissions.",
    my_connection_code: "Patient Connection Code",
    share_code_hint: "Share this 6-digit code with your daughter or family member to authorize caregiver access.",
    generate_new_code: "Generate New Code",
    authorized_guardians_list: "Authorized Family Caregivers",
    disconnect_guardian: "Revoke Access",
    pair_patient_title: "Connect to a New Patient",
    enter_patient_code: "Enter Patient's 6-Digit Code",
    connect_btn: "Send Connection Request",
    permission_view_sched: "View Medication Schedule",
    permission_edit_meds: "Add / Edit Medicines",
    permission_stock: "Manage Inventory & Stock",
    permission_alerts: "Receive Missed-Dose Alerts",
    permission_prescriptions: "View & Upload Prescriptions",

    // Timeline & Caregiver Log
    timeline_title: "Medicine Change & Safety Timeline",
    timeline_subtitle: "Comprehensive audit trail of all prescription adjustments, dosage changes, and refills.",
    caregiver_log_title: "Caregiver Follow-Up Log",
    caregiver_log_sub: "Record phone calls, doctor visit notes, and check-in logs for Ramesh-ji.",
    add_log_btn: "Record New Follow-Up Action",

    // Admin & Demo
    admin_title: "MediTrack Demonstration Hub",
    admin_sub: "Simulate real-world senior care scenarios, inspect role data boundaries, or reset demo state.",
    scenario_1: "Scenario 1: Normal Morning (Next Dose: Metformin at 8:30 AM)",
    scenario_2: "Scenario 2: Overdue Dose Alert (Simulate 45-min grace lapse -> Guardian Alert)",
    scenario_3: "Scenario 3: Low Stock Warning (Atorvastatin 5 pills left)",
    scenario_4: "Scenario 4: Mark Morning Dose Taken via Patient Portal",
    reset_data_btn: "Reset Demo Data to Default State",

    // Common Buttons & Labels
    save: "Save Changes",
    cancel: "Cancel",
    close: "Close",
    print: "Print Document",
    download: "Download",
    edit: "Edit",
    delete: "Delete",
    back_to_dashboard: "Back to Dashboard",
    disclaimer_fictional: "FICTIONAL DEMO: All patient profiles, doctor names, and medical data shown are synthetic and for demonstration purposes only.",
    medical_safety_notice: "Medical Notice: MediTrack is a supportive reminder tool. Never change prescribed doses or medications without consulting a licensed physician."
  },

  hi: {
    // Brand & Header
    app_name: "मेडीट्रैक (MediTrack)",
    app_tagline: "आपके परिवार का दवा साथी",
    role_patient: "मरीज पोर्टल (Patient)",
    role_guardian: "गार्जियन पोर्टल (Guardian)",
    role_admin: "एडमिन एवं डेमो केंद्र",
    switch_role: "पोर्टल बदलें",
    demo_mode_badge: "प्रदर्शन मोड",
    connected_to: "जुड़े हुए हैं",
    online: "ऑनलाइन",
    offline: "ऑफ़लाइन",
    syncing: "सिंक हो रहा है...",
    synced: "डेटा सुरक्षित है",
    font_size: "अक्षर आकार",
    font_normal: "सामान्य (18px)",
    font_large: "बड़ा (21px)",
    font_xlarge: "बहुत बड़ा (24px)",
    high_contrast: "उच्च कंट्रास्ट",
    reduced_motion: "कम गति (Reduced Motion)",
    sound_alerts: "ध्वनि व आवाज सहायता",
    language: "भाषा (Language)",

    // Patient Navigation
    nav_home: "मुख्य पृष्ठ",
    nav_medicines: "मेरी दवाएं",
    nav_schedule: "समय सारणी",
    nav_progress: "दवा ट्रैकर",
    nav_prescriptions: "डॉक्टर के पर्चे",
    nav_settings: "सेटिंग्स",

    // Patient Greeting & Next Dose Hero
    greeting_morning: "सुप्रभात",
    greeting_afternoon: "नमस्कार",
    greeting_evening: "शुभ संध्या",
    greeting_night: "शुभ रात्रि",
    today_is: "आज की तारीख",
    hero_title: "आपकी अगली दवा",
    status_due_now: "दवा लेने का समय हो गया है",
    status_due_in: "बाकी समय",
    status_overdue: "पुष्टि लंबित (लंबित दवा)",
    status_taken_already: "यह दवा ले ली गई है",
    status_all_done_today: "आज की सभी तय दवाएं ले ली गई हैं! बहुत बढ़िया।",
    take_dose_btn: "मैंने दवा ले ली है",
    remind_later_btn: "मुझे बाद में याद दिलाएं",
    contact_guardian_btn: "गार्जियन से संपर्क करें",
    dose_amount: "खुराक की मात्रा",
    how_to_take: "लेने का तरीका",
    prescribed_by: "डॉक्टर द्वारा अनुशंसित",
    dose_confirmed_toast: "दवा दर्ज कर ली गई है! आपकी बेटी प्रिया को सूचना मिल गई है।",
    snooze_toast: "15 मिनट के लिए रीमाइंडर आगे बढ़ाया गया। हम फिर याद दिलाएंगे।",

    // Dose Counts & Progress
    doses_today: "आज की दिनचर्या",
    taken_count: "ली गई",
    upcoming_count: "आने वाली",
    pending_count: "पुष्टि लंबित",
    daily_progress: "आज की नियमितता",
    all_doses_complete: "आज की सभी दवाएं पूरी हुईं!",

    // Quick Action Modals
    confirm_dose_title: "दवा लेने की पुष्टि करें",
    confirm_dose_msg: "क्या आपने डॉक्टर के निर्देशानुसार यह दवा ले ली है?",
    confirm_yes: "हाँ, मैंने ले ली है",
    confirm_no: "रद्द करें / अभी नहीं",
    snooze_title: "रीमाइंडर आगे बढ़ाएं",
    snooze_15: "15 मिनट बाद याद दिलाएं",
    snooze_30: "30 मिनट बाद याद दिलाएं",
    snooze_60: "1 घंटे बाद याद दिलाएं",
    contact_title: "गार्जियन से संपर्क करें",
    contact_subtitle: "आपकी बेटी प्रिया किसी भी समय मदद के लिए जुड़ी हुई हैं।",
    call_guardian_btn: "प्रिया को फोन करें (+91 98765 43210)",
    send_sos_btn: "मदद का संदेश भेजें",
    sos_sent_msg: "प्रिया के फोन पर संदेश भेजा गया: 'पापा को दवा में मदद चाहिए'।",

    // Pill Passport
    passport_title: "पिल पासपोर्ट (सचित्र दवा पहचान)",
    passport_subtitle: "आपकी दवाओं की पहचान के लिए सुरक्षित फोटो और विवरण।",
    passport_disclaimer: "महत्वपूर्ण सूचना: पिल पासपोर्ट की तस्वीरें केवल मरीज की पहचान सुविधा के लिए हैं। केवल रूप-रंग से दवा की चिकित्सीय पुष्टि नहीं हो सकती। बिना पहचान वाली दवा कभी न लें। हमेशा डॉक्टर के पर्चे का पालन करें।",
    pill_shape: "आकार",
    pill_color: "रंग",
    pill_markings: "निशान",
    pill_type: "प्रकार",
    stock_remaining: "बचा हुआ स्टॉक",
    days_left: "दिन शेष",
    days_stock: "दवा कितने दिन चलेगी",
    supply_low_notice: "आपकी दवा का स्टॉक कम हो रहा है। कृपया नए पत्ते के लिए अपने गार्जियन से कहें।",
    patient_read_only_note: "आपकी सुरक्षा हेतु खुराक का विवरण केवल डॉक्टर व गार्जियन द्वारा बदला जा सकता है।",

    // Patient Schedule
    schedule_title: "आज की दवा समय सारणी",
    slot_morning: "सुबह (8:00 AM - 10:00 AM)",
    slot_afternoon: "दोपहर (1:00 PM - 2:30 PM)",
    slot_evening: "शाम (6:00 PM - 8:00 PM)",
    slot_night: "रात सोने से पहले (9:00 PM - 10:30 PM)",
    slot_sos: "जरूरत पड़ने पर (दर्द निवारक SOS)",
    confirmed_at: "लेने का समय दर्ज",
    scheduled_at: "नियत समय",

    // Patient Progress & Heatmap
    memory_map_title: "दवा मेमोरी मैप (कैलेंडर)",
    memory_map_subtitle: "महीने भर की दवा नियमितता का सरल दृश्य।",
    heatmap_green: "सभी दवाएं ली गईं",
    heatmap_yellow: "कुछ दवाएं बाकी हैं",
    heatmap_red: "दवा की पुष्टि नहीं हुई",
    heatmap_grey: "कोई दवा निर्धारित नहीं",
    weekly_adherence: "साप्ताहिक नियमितता",
    monthly_adherence: "मासिक नियमितता",
    total_confirmed_doses: "कुल ली गई दवाएं",
    total_unconfirmed_doses: "अपुष्ट दवाएं",
    unconfirmed_clarification: "ध्यान दें: अपुष्ट खुराक का अर्थ है कि बटन नहीं दबाया गया, इसका अर्थ यह नहीं कि दवा नहीं ली गई।",

    // Patient Prescriptions
    prescriptions_title: "डॉक्टर के पर्चे (तिजोरी)",
    prescriptions_subtitle: "परिवार द्वारा सुरक्षित रखे गए डॉक्टर के अधिकृत पर्चे।",
    view_prescription_btn: "पर्चा देखें व प्रिंट करें",
    doctor_clinic: "डॉक्टर एवं अस्पताल",
    prescription_date: "तारीख",
    diagnosis: "निदान (बीमारी)",
    linked_meds: "संबंधित दवाएं",
    dr_notes: "डॉक्टर की विशेष सलाह",

    // Emergency Card
    emergency_card_title: "आपातकालीन मेडिकल कार्ड",
    emergency_card_subtitle: "आपातकाल में डॉक्टर व सहायक के लिए जरूरी स्वास्थ्य जानकारी।",
    emergency_disclaimer: "गोपनीयता सूचना: यह आपातकालीन जानकारी त्वरित सहायता के लिए इस उपकरण में सुरक्षित रखी गई है।",
    blood_group: "रक्त समूह (Blood Group)",
    chronic_conditions: "दीर्घकालिक बीमारियां",
    known_allergies: "दवाओं से एलर्जी",
    emergency_contacts: "आपातकालीन संपर्क",
    preferred_hospital: "पसंदीदा अस्पताल",
    insurance_details: "स्वास्थ्य बीमा",
    print_card: "कार्ड प्रिंट करें",

    // Voice Assistant
    voice_title: "मेडीट्रैक आवाज साथी (Voice)",
    voice_tap_to_speak: "बोलने के लिए माइक बटन दबाएं",
    voice_listening: "सुन रहे हैं... कृपया अब बोलें",
    voice_processing: "आपकी बात समझी जा रही है...",
    voice_stop_btn: "सुनना बंद करें",
    voice_english_hint: 'Say: "What medicines do I have today?", "What is my next medicine?", "I have taken my medicine", or "Call my guardian".',
    voice_hindi_hint: 'बोलें: "आज मेरी कौन सी दवाएं हैं?", "मेरी अगली दवा क्या है?", "मैंने दवा ले ली है", या "गार्जियन को फोन करें"।',
    voice_confirm_action: "आवाज से पुष्टि आवश्यक है",
    voice_confirm_desc: "क्या आपने तय दवा ले ली है? कृपया दर्ज करने के लिए पुष्टि दबाएं।",

    // Guardian Portal
    guardian_overview: "गार्जियन डैशबोर्ड",
    guardian_overview_sub: "रमेश शर्मा जी की दवा दिनचर्या, नियमितता एवं स्टॉक की दूरस्थ निगरानी।",
    active_alerts: "ध्यान देने योग्य सूचनाएं",
    no_alerts: "कोई आपात चेतावनी नहीं। सभी दवाएं एवं स्टॉक व्यवस्थित हैं।",
    alert_dose_unconfirmed: "खुराक अपुष्ट: रमेश जी ने 45 मिनट की छूट सीमा में दवा लेने की पुष्टि नहीं की।",
    alert_low_stock: "कम स्टॉक चेतावनी: एटोरवास्टेटिन की केवल 5 गोलियां बची हैं (~5 दिन)।",
    alert_expiry: "समाप्ति चेतावनी: मल्टीविटामिन 30 दिनों में समाप्त (एक्सपायर) होने वाली है।",
    patient_adherence_today: "मरीज की आज की नियमितता",
    recent_patient_activity: "मरीज की हालिया गतिविधियां",
    guardian_actions: "गार्जियन कार्य",
    add_medicine: "नई दवा जोड़ें",
    manage_stock_btn: "स्टॉक व नया पत्ता दर्ज करें",
    upload_rx_btn: "पर्चा अपलोड करें",
    export_pdf_btn: "डॉक्टर विजिट रिपोर्ट (PDF) डाउनलोड करें",
    guardian_patient_selector: "मरीज चुनें",

    // Guardian Stock & Expiry
    stock_management_title: "दवा स्टॉक एवं समाप्ति प्रबंधन",
    stock_table_medicine: "दवा का नाम",
    stock_table_current: "वर्तमान मात्रा",
    stock_table_threshold: "पुनः ऑर्डर सीमा",
    stock_table_days_left: "अनुमानित शेष दिन",
    stock_table_expiry: "समाप्ति तिथि (Expiry)",
    stock_table_status: "स्थिति",
    stock_table_actions: "कार्य",
    status_good: "पर्याप्त स्टॉक",
    status_low: "कम स्टॉक - जल्द खरीदें",
    status_critical: "अति कम स्टॉक",
    status_expiring_soon: "जल्द समाप्त होगी",
    status_expired: "अवधि समाप्त (Expired) - न दें",
    expired_warning_banner: "अवधि समाप्त (एक्सपायर) दवाएं असुरक्षित हैं और मरीज को लेने के लिए नहीं दिखाई जाएंगी।",
    stock_adjust_modal_title: "स्टॉक सुधार / नया पत्ता जोड़ें",
    new_quantity: "नई कुल गोलियां / मात्रा",
    reason_for_change: "बदलाव का कारण / मेडिकल स्टोर विवरण",

    // Guardian Connect & Family Circle
    guardian_connect_title: "गार्जियन कनेक्ट एवं परिवार सर्कल",
    guardian_connect_sub: "परिवार के सदस्यों को जोड़ें और दवाओं की अनुमति तय करें।",
    my_connection_code: "मरीज कनेक्शन कोड",
    share_code_hint: "देखभाल की अनुमति देने के लिए यह 6 अंकों का कोड अपनी बेटी या परिवारजन को दें।",
    generate_new_code: "नया कोड बनाएं",
    authorized_guardians_list: "अधिकृत पारिवारिक देखभालकर्ता",
    disconnect_guardian: "अनुमति हटाएं",
    pair_patient_title: "नए मरीज से जुड़ें",
    enter_patient_code: "मरीज का 6 अंकों का कोड दर्ज करें",
    connect_btn: "कनेक्शन अनुरोध भेजें",
    permission_view_sched: "दवा समय सारणी देखना",
    permission_edit_meds: "दवाएं जोड़ना / बदलना",
    permission_stock: "स्टॉक प्रबंधन",
    permission_alerts: "छूटी दवा की सूचना पाना",
    permission_prescriptions: "पर्चे देखना व अपलोड करना",

    // Timeline & Caregiver Log
    timeline_title: "दवा परिवर्तन एवं सुरक्षा इतिहास",
    timeline_subtitle: "दवाओं के बदलाव, खुराक संशोधन एवं नए पत्तों का संपूर्ण प्रमाण।",
    caregiver_log_title: "देखभालकर्ता फॉलो-अप लॉग",
    caregiver_log_sub: "रमेश जी के साथ हुई बातचीत, डॉक्टर सलाह और दैनिक जांच का रिकॉर्ड।",
    add_log_btn: "नया देखभाल कार्य दर्ज करें",

    // Admin & Demo
    admin_title: "मेडीट्रैक प्रदर्शन एवं नियंत्रण केंद्र",
    admin_sub: "बुजुर्ग देखभाल परिदृश्यों का त्वरित परीक्षण करें या डेटा रीसेट करें।",
    scenario_1: "परिदृश्य 1: सामान्य सुबह (अगली दवा: मेटफॉर्मिन 8:30 AM)",
    scenario_2: "परिदृश्य 2: अपुष्ट खुराक चेतावनी (45 मिनट बीतने पर गार्जियन अलर्ट)",
    scenario_3: "परिदृश्य 3: कम स्टॉक चेतावनी (एटोरवास्टेटिन की 5 गोलियां बची)",
    scenario_4: "परिदृश्य 4: मरीज पोर्टल से सुबह की दवा लेना",
    reset_data_btn: "डेमो डेटा रीसेट करें",

    // Common Buttons & Labels
    save: "सुरक्षित करें",
    cancel: "रद्द करें",
    close: "बंद करें",
    print: "दस्तावेज प्रिंट करें",
    download: "डाउनलोड",
    edit: "संशोधित करें",
    delete: "हटाएं",
    back_to_dashboard: "डैशबोर्ड पर लौटें",
    disclaimer_fictional: "काल्पनिक प्रदर्शन: दिखाए गए सभी नाम, डॉक्टर और दवा विवरण केवल तकनीकी प्रदर्शन के लिए हैं।",
    medical_safety_notice: "चिकित्सीय सूचना: मेडीट्रैक एक सहायक रीमाइंडर है। डॉक्टर की सलाह के बिना कभी भी दवा या खुराक न बदलें।"
  }
};

class I18nManager {
  constructor() {
    this.currentLang = localStorage.getItem('meditrack_lang') || 'en';
  }

  getLang() {
    return this.currentLang;
  }

  setLang(lang) {
    if (lang !== 'en' && lang !== 'hi') lang = 'en';
    this.currentLang = lang;
    localStorage.setItem('meditrack_lang', lang);
    document.documentElement.lang = lang;
    this.applyTranslations();
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
  }

  t(key, fallback = '') {
    const dict = TRANSLATIONS[this.currentLang] || TRANSLATIONS.en;
    if (dict[key] !== undefined) return dict[key];
    if (TRANSLATIONS.en[key] !== undefined) return TRANSLATIONS.en[key];
    return fallback || key;
  }

  applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const text = this.t(key);
      if (text) {
        if (el.tagName === 'INPUT' && (el.type === 'button' || el.type === 'submit')) {
          el.value = text;
        } else if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = text;
        } else {
          el.textContent = text;
        }
      }
    });

    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      const text = this.t(key);
      if (text) el.title = text;
    });

    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
      const key = el.getAttribute('data-i18n-aria');
      const text = this.t(key);
      if (text) el.setAttribute('aria-label', text);
    });
  }
}

const i18n = new I18nManager();
window.i18n = i18n;
