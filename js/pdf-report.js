/**
 * MediTrack - Doctor Visit Report PDF Generator
 * Uses jsPDF and autoTable to generate professional clinical summaries
 */

class DoctorReportGenerator {
  generatePDF() {
    if (!window.jspdf || !window.jspdf.jsPDF) {
      alert("jsPDF library is loading. Please check network connection or try again.");
      return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const state = window.stateManager ? window.stateManager.state : null;
    if (!state) return;

    const patient = state.user;
    const stats = window.adherenceEngine ? window.adherenceEngine.get30DayStats() : { adherenceRate: 92, totalConfirmedDoses: 124, totalUnconfirmedDoses: 3 };

    // Colors
    const teal = [26, 107, 112];
    const sage = [95, 141, 123];
    const dark = [31, 37, 34];
    const red = [197, 48, 48];

    let currentY = 15;

    // Header Banner
    doc.setFillColor(26, 107, 112);
    doc.rect(0, 0, 210, 26, 'F');

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text("MediTrack - Doctor Consultation Report", 14, 12);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(230, 245, 243);
    doc.text("Comprehensive Medication Adherence, Regimen & Inventory Summary", 14, 18);
    doc.text(`Generated: ${state.todayStr || "2026-11-21"} | Fictional Clinical Demonstration`, 130, 18);

    currentY = 34;

    // Patient Demographics Box
    doc.setDrawColor(200, 215, 210);
    doc.setFillColor(250, 249, 245);
    doc.roundedRect(14, currentY, 182, 32, 2, 2, 'FD');

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(26, 107, 112);
    doc.text(`Patient: ${patient.name} (${patient.gender}, Age: ${patient.age})`, 18, currentY + 7);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(50, 50, 50);
    doc.text(`Blood Group: ${state.emergencyCard.bloodGroup}  |  Phone: ${patient.phone}`, 18, currentY + 14);
    doc.text(`Chronic Conditions: ${state.emergencyCard.chronicConditions.join(', ')}`, 18, currentY + 20);
    doc.text(`Known Allergies: ${state.emergencyCard.allergies.join(', ')}`, 18, currentY + 26);

    currentY += 40;

    // Adherence Executive Summary
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(26, 107, 112);
    doc.text("1. Medication Adherence Summary (Past 30 Days)", 14, currentY);

    currentY += 4;

    const adherenceData = [
      ["30-Day Adherence Rate", `${stats.adherenceRate}%`],
      ["Total Confirmed Doses", `${stats.totalConfirmedDoses} doses confirmed by patient/guardian`],
      ["Unconfirmed / Overdue Doses", `${stats.totalUnconfirmedDoses} unconfirmed alerts logged`],
      ["Primary Caregiver Contact", "Priya Sharma (Daughter) - +91 98765 43210"]
    ];

    if (doc.autoTable) {
      doc.autoTable({
        startY: currentY,
        head: [["Metric", "Clinical Record"]],
        body: adherenceData,
        theme: 'striped',
        headStyles: { fillColor: teal, textColor: 255 },
        styles: { fontSize: 9, cellPadding: 3 },
        margin: { left: 14, right: 14 }
      });
      currentY = doc.lastAutoTable.finalY + 10;
    }

    // Active Medications Table
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(26, 107, 112);
    doc.text("2. Current Active Prescribed Regimen", 14, currentY);

    currentY += 4;

    const medRows = state.medicines.map(m => [
      m.brandName || m.name,
      m.dosage,
      m.schedule.map(s => `${s.timeSlot.toUpperCase()} (${s.time})`).join(', ') || 'SOS (As Needed)',
      m.instructions,
      m.prescribedBy
    ]);

    if (doc.autoTable) {
      doc.autoTable({
        startY: currentY,
        head: [["Medicine", "Dosage", "Timing", "Patient Instructions", "Prescribed By"]],
        body: medRows,
        theme: 'grid',
        headStyles: { fillColor: sage, textColor: 255 },
        styles: { fontSize: 8.5, cellPadding: 2.5 },
        margin: { left: 14, right: 14 }
      });
      currentY = doc.lastAutoTable.finalY + 10;
    }

    // Page Break Check
    if (currentY > 220) {
      doc.addPage();
      currentY = 20;
    }

    // Stock & Expiry Information
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(26, 107, 112);
    doc.text("3. Current Medicine Stock & Expiry Tracking", 14, currentY);

    currentY += 4;

    const stockRows = state.medicines.map(m => {
      const dailyDoses = m.schedule.length || 1;
      const daysLeft = Math.floor(m.stock.currentQty / dailyDoses);
      return [
        m.brandName || m.name,
        `${m.stock.currentQty} ${m.stock.unit}`,
        `~${daysLeft} days remaining`,
        m.stock.expiryDate,
        daysLeft <= 7 ? "LOW STOCK" : "Adequate"
      ];
    });

    if (doc.autoTable) {
      doc.autoTable({
        startY: currentY,
        head: [["Medicine", "Current Stock", "Estimated Supply", "Expiry Date", "Inventory Status"]],
        body: stockRows,
        theme: 'striped',
        headStyles: { fillColor: teal, textColor: 255 },
        styles: { fontSize: 8.5, cellPadding: 2.5 },
        margin: { left: 14, right: 14 }
      });
      currentY = doc.lastAutoTable.finalY + 10;
    }

    // Timeline of Changes
    if (currentY > 230) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(26, 107, 112);
    doc.text("4. Recent Medication Changes & Safety Timeline", 14, currentY);

    currentY += 4;

    const timelineRows = state.timeline.slice(0, 5).map(t => [
      t.timestamp.replace('T', ' ').slice(0, 16),
      t.actor,
      t.type,
      t.details
    ]);

    if (doc.autoTable) {
      doc.autoTable({
        startY: currentY,
        head: [["Date & Time", "Actor", "Event Type", "Audit Record"]],
        body: timelineRows,
        theme: 'grid',
        headStyles: { fillColor: sage, textColor: 255 },
        styles: { fontSize: 8, cellPadding: 2.5 },
        margin: { left: 14, right: 14 }
      });
      currentY = doc.lastAutoTable.finalY + 12;
    }

    // Regulatory / Safety Disclaimer
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }

    doc.setDrawColor(210, 210, 210);
    doc.line(14, currentY, 196, currentY);
    currentY += 5;

    doc.setFont("helvetica", "italic");
    doc.setFontSize(7.5);
    doc.setTextColor(110, 110, 110);
    doc.text("CLINICAL NOTE & DISCLAIMER: This document distinguishes prescribed dosage regimens from patient-confirmed actions.", 14, currentY);
    doc.text("An unconfirmed dose indicates no digital confirmation was logged within the grace period; it does not constitute clinical proof of omission.", 14, currentY + 4);
    doc.text("MediTrack is a patient adherence companion and does not offer medical advice. Consult prescribing physicians for medical changes.", 14, currentY + 8);

    // Doctor signature line
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(60, 60, 60);
    doc.text("Consulting Physician Signature: ____________________________________", 100, currentY + 18);
    doc.text("Date: ________________________", 100, currentY + 24);

    // Save PDF
    doc.save(`MediTrack_Doctor_Report_Ramesh_Sharma_${state.todayStr || '2026-11-21'}.pdf`);
  }
}

const doctorReportGenerator = new DoctorReportGenerator();
window.doctorReportGenerator = doctorReportGenerator;
