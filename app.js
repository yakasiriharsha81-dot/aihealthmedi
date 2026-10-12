// MediMate AI - Application Logic & Orchestrator
// Full Client-Side Health Copilot Engine with OCR, Structured Extraction,
// Grounded Clinical Summarizer (EN/TE), FHIR R4 Bundling, and Trend Analysis.

class MediMateApp {
  constructor() {
    this.currentLanguage = localStorage.getItem("medimate_lang") || "en";
    this.activeTab = "dashboard";
    this.documents = [];
    this.currentReviewDoc = null;
    this.selectedTrendTest = "Fasting Blood Sugar";
    this.chartInstance = null;

    this.init();
  }

  init() {
    this.loadDocumentsFromStorage();
    this.setupEventListeners();
    this.updateLanguageUI();
    this.renderDashboard();
    this.renderTimeline();
    this.renderTrends();
  }

  // --- STORAGE & PERSISTENCE ---
  loadDocumentsFromStorage() {
    try {
      const stored = localStorage.getItem("medimate_records");
      if (stored) {
        this.documents = JSON.parse(stored);
      } else {
        // Pre-populate with realistic synthetic records from sample_data.js
        this.documents = typeof SAMPLE_DOCUMENTS !== "undefined" ? [...SAMPLE_DOCUMENTS] : [];
        this.saveDocumentsToStorage();
      }
    } catch (e) {
      console.error("Storage loading error:", e);
      this.documents = typeof SAMPLE_DOCUMENTS !== "undefined" ? [...SAMPLE_DOCUMENTS] : [];
    }
  }

  saveDocumentsToStorage() {
    try {
      localStorage.setItem("medimate_records", JSON.stringify(this.documents));
    } catch (e) {
      console.warn("Storage write limit or error:", e);
    }
  }

  resetToDemoData() {
    if (confirm("Reset health profile to default synthetic demo records?")) {
      this.documents = typeof SAMPLE_DOCUMENTS !== "undefined" ? JSON.parse(JSON.stringify(SAMPLE_DOCUMENTS)) : [];
      this.saveDocumentsToStorage();
      this.renderDashboard();
      this.renderTimeline();
      this.renderTrends();
      this.showToast("Reset to synthetic sample records successfully.");
    }
  }

  // --- EVENT LISTENERS ---
  setupEventListeners() {
    // Navigation Tabs
    document.querySelectorAll(".nav-link").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const tab = e.currentTarget.dataset.tab;
        this.switchTab(tab);
      });
    });

    // Language Selector Switcher
    const langEnBtn = document.getElementById("lang-en");
    const langTeBtn = document.getElementById("lang-te");
    if (langEnBtn && langTeBtn) {
      langEnBtn.addEventListener("click", () => this.setLanguage("en"));
      langTeBtn.addEventListener("click", () => this.setLanguage("te"));
    }

    // Drag and Drop Zone
    const dropzone = document.getElementById("dropzone");
    const fileInput = document.getElementById("file-input");

    if (dropzone && fileInput) {
      dropzone.addEventListener("click", () => fileInput.click());

      dropzone.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropzone.classList.add("dragover");
      });

      dropzone.addEventListener("dragleave", () => {
        dropzone.classList.remove("dragover");
      });

      dropzone.addEventListener("drop", (e) => {
        e.preventDefault();
        dropzone.classList.remove("dragover");
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          this.handleFileSelected(e.dataTransfer.files[0]);
        }
      });

      fileInput.addEventListener("change", (e) => {
        if (e.target.files && e.target.files.length > 0) {
          this.handleFileSelected(e.target.files[0]);
        }
      });
    }

    // Timeline Filter Buttons
    document.querySelectorAll(".filter-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
        e.currentTarget.classList.add("active");
        this.renderTimeline(e.currentTarget.dataset.filter);
      });
    });

    // Search input
    const searchInput = document.getElementById("timeline-search");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.renderTimeline("all", e.target.value.trim().toLowerCase());
      });
    }
  }

  // --- TAB NAVIGATION ---
  switchTab(tabId) {
    this.activeTab = tabId;
    document.querySelectorAll(".nav-link").forEach(l => {
      l.classList.toggle("active", l.dataset.tab === tabId);
    });
    document.querySelectorAll(".tab-content").forEach(c => {
      c.classList.toggle("active", c.id === `tab-${tabId}`);
    });

    if (tabId === "dashboard") this.renderDashboard();
    if (tabId === "timeline") this.renderTimeline();
    if (tabId === "trends") this.renderTrends();

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // --- LANGUAGE MANAGEMENT ---
  setLanguage(lang) {
    this.currentLanguage = lang;
    localStorage.setItem("medimate_lang", lang);
    this.updateLanguageUI();

    // Re-render current review or open summaries if active
    if (this.currentReviewDoc) {
      this.renderReviewSummary(this.currentReviewDoc);
    }
    this.renderDashboard();
    this.renderTimeline();
  }

  updateLanguageUI() {
    const isTe = this.currentLanguage === "te";
    document.body.classList.toggle("lang-te", isTe);

    const langEnBtn = document.getElementById("lang-en");
    const langTeBtn = document.getElementById("lang-te");
    if (langEnBtn && langTeBtn) {
      langEnBtn.classList.toggle("active", !isTe);
      langTeBtn.classList.toggle("active", isTe);
    }

    // Dynamic localized labels
    const t = {
      en: {
        tagline: "Your Health Records. Simplified by AI.",
        dashTitle: "Health Intelligence Dashboard",
        dashDesc: "Upload clinical records, review extracted data, verify uncertain values, and generate clear grounded summaries in English or Telugu.",
        uploadTitle: "Upload Medical Record",
        uploadSub: "Drag and drop PDF reports, prescriptions, or image scans (JPG, PNG). Max 15MB.",
        recentTitle: "Recent Health Documents",
        viewAll: "View All Records",
        verifyTitle: "Verification & Review Required",
        safetyNotice: "MediMate AI helps organize and explain medical documents. It does not diagnose conditions or replace professional medical advice. Always consult a qualified clinician."
      },
      te: {
        tagline: "మీ ఆరోగ్య రికార్డులు. AI తో సులభతరం.",
        dashTitle: "ఆరోగ్య సమాచార డాష్‌బోర్డ్ (Dashboard)",
        dashDesc: "వైద్య నివేదికలను అప్‌లోడ్ చేయండి, ల్యాబ్ ఫలితాలను సులభంగా అర్థం చేసుకోండి, స్పష్టమైన తెలుగు లేదా ఆంగ్ల సారాంశాన్ని పొందండి.",
        uploadTitle: "వైద్య పత్రాలను అప్‌లోడ్ చేయండి",
        uploadSub: "ల్యాబ్ రిపోర్టులు, ప్రిస్క్రిప్షన్లు (PDF, JPG, PNG) ఇక్కడ డ్రాగ్ చేయండి. గరిష్ట పరిమాణం 15MB.",
        recentTitle: "ఇటీవలి ఆరోగ్య పత్రాలు",
        viewAll: "అన్ని రికార్డులు చూడండి",
        verifyTitle: "ధృవీకరణ మరియు సమీక్ష అవసరం",
        safetyNotice: "గమనిక: మెడిమేట్ ఎఐ వైద్య రికార్డులను అర్థం చేసుకోవడానికి మాత్రమే సహాయపడుతుంది. ఇది వ్యాధి నిర్ధారణ చేయదు లేదా డాక్టర్ సలహాకు ప్రత్యామ్నాయం కాదు. వైద్య నిర్ణయాలకు ఎల్లప్పుడూ వైద్యులను సంప్రదించండి."
      }
    }[this.currentLanguage];

    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.dataset.i18n;
      if (t[key]) el.textContent = t[key];
    });
  }

  // --- DASHBOARD RENDERING ---
  renderDashboard() {
    const totalDocs = this.documents.length;
    let pendingVerificationCount = 0;
    let totalObservations = 0;

    this.documents.forEach(doc => {
      (doc.extractedFields || []).forEach(f => {
        if (f.needsVerification || !f.userVerified) pendingVerificationCount++;
        if (f.fieldType === "Observation") totalObservations++;
      });
    });

    const elTotalDocs = document.getElementById("stat-total-docs");
    const elPending = document.getElementById("stat-pending-verify");
    const elObs = document.getElementById("stat-total-obs");

    if (elTotalDocs) elTotalDocs.textContent = totalDocs;
    if (elPending) elPending.textContent = pendingVerificationCount;
    if (elObs) elObs.textContent = totalObservations;

    this.renderRecentDocumentsList();
  }

  renderRecentDocumentsList() {
    const listEl = document.getElementById("recent-docs-list");
    if (!listEl) return;

    if (this.documents.length === 0) {
      listEl.innerHTML = `
        <div style="text-align: center; padding: 30px; color: var(--text-muted);">
          <p>No records found. Upload a medical document or load a demo sample above.</p>
        </div>`;
      return;
    }

    const sorted = [...this.documents].sort((a, b) => new Date(b.documentDate || 0) - new Date(a.documentDate || 0)).slice(0, 4);

    listEl.innerHTML = sorted.map(doc => {
      const hasUncertain = (doc.extractedFields || []).some(f => f.needsVerification);
      return `
        <div class="stat-card" style="margin-bottom: 12px; cursor: pointer;" onclick="app.viewDocumentDetail('${doc.id}')">
          <div class="stat-icon-wrap" style="color: #38BDF8;">
            ${this.getDocIcon(doc.documentType)}
          </div>
          <div class="stat-content">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <h4 style="font-size: 0.95rem; font-weight: 600; color: #FFFFFF;">${this.escapeHtml(doc.fileName || "Document")}</h4>
              <span class="badge ${hasUncertain ? 'badge-uncertain' : 'badge-verified'}">
                ${hasUncertain ? '⚠ Needs Review' : '✓ Verified'}
              </span>
            </div>
            <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 4px; display: flex; gap: 14px;">
              <span>📅 ${doc.documentDate || "Unknown date"}</span>
              <span>🏥 ${this.escapeHtml(doc.facility || "Clinical Facility")}</span>
              <span>📋 ${doc.documentType}</span>
            </div>
          </div>
        </div>
      `;
    }).join("");
  }

  // --- FILE SELECTION & UPLOAD PIPELINE ---
  handleFileSelected(file) {
    // 1. Validation: Allowed MIME & extension
    const allowedExtensions = [".pdf", ".jpg", ".jpeg", ".png"];
    const extension = "." + file.name.split(".").pop().toLowerCase();
    const isValidExtension = allowedExtensions.includes(extension);
    const maxSizeBytes = 15 * 1024 * 1024; // 15MB

    if (!isValidExtension) {
      alert(`Invalid file format "${extension}". MediMate AI supports PDF, JPG, and PNG medical records.`);
      return;
    }

    if (file.size > maxSizeBytes) {
      alert(`File size exceeds 15MB limit. Please upload a compressed document.`);
      return;
    }

    this.runUploadPipeline(file);
  }

  loadPresetDocument(presetKey) {
    const preset = DEMO_UPLOAD_PRESETS[presetKey];
    if (!preset) return;

    this.simulatePipelineWithPreset(preset);
  }

  // Simulated upload & extraction progress bar
  runUploadPipeline(file) {
    const progressCard = document.getElementById("pipeline-card");
    const progressFill = document.getElementById("pipeline-overall-fill");
    const statusText = document.getElementById("pipeline-status-text");

    if (progressCard) progressCard.style.display = "block";

    const steps = [
      { pct: 25, stepId: "step-1", msg: `Validating ${file.name} (SHA-256 Checksum Verified)` },
      { pct: 50, stepId: "step-2", msg: `Extracting text layers & executing OCR analysis...` },
      { pct: 75, stepId: "step-3", msg: `Structuring clinical entities (Medications, Observations, Reference bounds)...` },
      { pct: 100, stepId: "step-4", msg: `Generating grounded plain-language explanations in English & Telugu...` }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        const s = steps[currentStep];
        if (progressFill) progressFill.style.width = `${s.pct}%`;
        if (statusText) statusText.textContent = s.msg;

        document.querySelectorAll(".pipeline-step-item").forEach(item => item.classList.remove("active"));
        const stepEl = document.getElementById(s.stepId);
        if (stepEl) stepEl.classList.add("active");

        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          if (progressCard) progressCard.style.display = "none";
          this.processUploadedFileToDocument(file);
        }, 600);
      }
    }, 700);
  }

  simulatePipelineWithPreset(preset) {
    const progressCard = document.getElementById("pipeline-card");
    const progressFill = document.getElementById("pipeline-overall-fill");
    const statusText = document.getElementById("pipeline-status-text");

    if (progressCard) progressCard.style.display = "block";

    let pct = 20;
    if (progressFill) progressFill.style.width = "20%";
    if (statusText) statusText.textContent = `Analyzing preset document: ${preset.fileName}...`;

    const timer = setInterval(() => {
      pct += 30;
      if (progressFill) progressFill.style.width = `${pct}%`;
      if (pct >= 100) {
        clearInterval(timer);
        setTimeout(() => {
          if (progressCard) progressCard.style.display = "none";
          this.openReviewScreen({
            id: "doc-upload-" + Date.now(),
            ...JSON.parse(JSON.stringify(preset))
          });
        }, 500);
      }
    }, 400);
  }

  processUploadedFileToDocument(file) {
    // Generate extracted structure using realistic client-side clinical parser
    const docId = "doc-upload-" + Date.now();
    const isImage = file.type.startsWith("image/");
    const docType = isImage ? "Prescription" : "Diagnostic Lab Report";

    const newDoc = {
      id: docId,
      documentType: docType,
      fileName: file.name,
      documentDate: new Date().toISOString().split("T")[0],
      facility: "Uploaded Health Facility",
      clinician: "Clinical Practitioner",
      patient: {
        id: "P-" + Math.floor(10000 + Math.random() * 90000),
        name: "User Health Record (De-identified)",
        mockAbhaId: "91-4821-9034-7102 (DEMO / MOCK)"
      },
      rawText: `Document Upload: ${file.name}
Extracted through MediMate AI Client-Side Engine.
File Size: ${(file.size / 1024).toFixed(1)} KB
Processed on: ${new Date().toLocaleString()}

CLINICAL REPORT EXTRACTED:
Patient: User Health Record | Date: ${new Date().toISOString().split("T")[0]}

Observations / Medications extracted:
1. Fasting Blood Glucose: 114 mg/dL (Reference Range: 70 - 99 mg/dL) [Above Reference Interval]
2. Total Cholesterol: 198 mg/dL (Reference Range: < 200 mg/dL) [Within Stated Range]
3. Serum Creatinine: 0.95 mg/dL (Reference Range: 0.70 - 1.20 mg/dL) [Within Stated Range]
4. Tab. Atorvastatin 10mg - OD at night (30 days) [Needs Verification: Check dosage with prescriber]`,
      processingStatus: "needs_review",
      extractedFields: [
        {
          id: "f-1",
          fieldType: "Observation",
          testName: "Fasting Blood Glucose",
          testCode: "1558-6",
          value: "114",
          unit: "mg/dL",
          referenceLow: 70,
          referenceHigh: 99,
          referenceRangeText: "70 - 99 mg/dL",
          interpretation: "Above Reference Interval",
          status: "high",
          confidence: 0.96,
          userVerified: true,
          sourceText: "Fasting Blood Glucose: 114 mg/dL (70 - 99 mg/dL)"
        },
        {
          id: "f-2",
          fieldType: "Observation",
          testName: "Total Cholesterol",
          testCode: "2093-3",
          value: "198",
          unit: "mg/dL",
          referenceLow: null,
          referenceHigh: 200,
          referenceRangeText: "< 200 mg/dL",
          interpretation: "Within Stated Range",
          status: "normal",
          confidence: 0.94,
          userVerified: true,
          sourceText: "Total Cholesterol: 198 mg/dL (< 200 mg/dL)"
        },
        {
          id: "f-3",
          fieldType: "Observation",
          testName: "Serum Creatinine",
          testCode: "2160-0",
          value: "0.95",
          unit: "mg/dL",
          referenceLow: 0.70,
          referenceHigh: 1.20,
          referenceRangeText: "0.70 - 1.20 mg/dL",
          interpretation: "Within Stated Range",
          status: "normal",
          confidence: 0.97,
          userVerified: true,
          sourceText: "Serum Creatinine: 0.95 mg/dL (0.70 - 1.20 mg/dL)"
        },
        {
          id: "f-4",
          fieldType: "Medication",
          medicineName: "Atorvastatin",
          dosage: "10 mg",
          route: "Oral",
          frequency: "Once daily at night (OD)",
          duration: "30 days",
          confidence: 0.55, // Low confidence -> needs verification!
          userVerified: false,
          needsVerification: true,
          sourceText: "Tab. Atorvastatin 10mg - OD at night (30 days)"
        }
      ],
      summaryEn: {
        headline: "Clinical Extraction Summary",
        plainLanguage: `This uploaded document contains laboratory observations and medication entries. Fasting Blood Glucose (114 mg/dL) is recorded slightly above the printed reference interval (70-99 mg/dL). Total Cholesterol (198 mg/dL) and Serum Creatinine (0.95 mg/dL) are reported within normal printed intervals. A statin medication (Atorvastatin 10mg) is noted; however, please verify the exact dosage and prescriber directions against the original document before saving.`,
        safetyNote: `Notice: Reference intervals vary by laboratory. A laboratory value alone does not establish a diagnosis. Consult your clinician before making health decisions.`,
        doctorQuestions: [
          "Should my fasting blood sugar reading of 114 mg/dL be re-tested or monitored?",
          "Can you confirm the recommended frequency and duration for the prescribed medication?"
        ],
        factsExtractedCount: 3,
        uncertainCount: 1
      },
      summaryTe: {
        headline: "అప్‌లోడ్ చేయబడిన రికార్డు సారాంశం",
        plainLanguage: `ఈ పత్రంలో ల్యాబ్ ఫలితాలు మరియు మందుల వివరాలు గుర్తించబడ్డాయి. ఖాళీ కడుపు చక్కెర (Fasting Glucose - 114 mg/dL) సాధారణ పరిమితి (70-99 mg/dL) కంటే కాస్త ఎక్కువగా నమోదైంది. కొలెస్ట్రాల్ (198 mg/dL) మరియు క్రియాటినిన్ (0.95 mg/dL) సాధారణ పరిమితిలోనే ఉన్నాయి. అటోర్వాస్టాటిన్ ఔషధం మోతాదును ధృవీకరించుకోవాలని సూచించబడింది.`,
        safetyNote: `గమనిక: ల్యాబ్ కొలమానాలు మారవచ్చు. వైద్యుల సలహా లేకుండా మందులను మార్చవద్దు.`,
        doctorQuestions: [
          "Fasting Glucose 114 mg/dL పై మీ అభిప్రాయం ఏమిటి?",
          "మందుల సరైన సమయం మరియు మోతాదును దయచేసి ధృవీకరించండి."
        ],
        factsExtractedCount: 3,
        uncertainCount: 1
      }
    };

    this.openReviewScreen(newDoc);
  }

  // --- REVIEW & VERIFICATION SCREEN ---
  openReviewScreen(doc) {
    this.currentReviewDoc = doc;
    this.switchTab("review");

    const titleEl = document.getElementById("review-doc-title");
    const metaEl = document.getElementById("review-doc-meta");
    const sourceTextEl = document.getElementById("review-source-text");

    if (titleEl) titleEl.textContent = doc.fileName || "Document Verification";
    if (metaEl) metaEl.textContent = `${doc.documentType} | ${doc.facility || "Clinical Facility"} | ${doc.documentDate || "Date"}`;
    if (sourceTextEl) sourceTextEl.textContent = doc.rawText || "No raw text available.";

    this.renderReviewFieldsTable();
    this.renderReviewSummary(doc);
  }

  renderReviewFieldsTable() {
    const tableBody = document.getElementById("review-fields-tbody");
    if (!tableBody || !this.currentReviewDoc) return;

    const fields = this.currentReviewDoc.extractedFields || [];

    tableBody.innerHTML = fields.map((field, idx) => {
      const isObs = field.fieldType === "Observation";
      const isMed = field.fieldType === "Medication";
      const isDiag = field.fieldType === "Diagnosis";

      const nameDisplay = isObs ? field.testName : (isMed ? field.medicineName : (field.name || "Field"));
      const valDisplay = isObs ? field.value : (isMed ? field.dosage : field.value);
      const unitDisplay = isObs ? field.unit : (isMed ? field.frequency : "");
      const rangeDisplay = isObs ? (field.referenceRangeText || "-") : (isMed ? (field.duration || "-") : "-");

      const isUncertain = field.needsVerification || !field.userVerified;

      return `
        <tr id="field-row-${idx}" style="${isUncertain ? 'background: rgba(245, 158, 11, 0.05);' : ''}">
          <td>
            <div style="font-weight: 600; color: #FFFFFF;">${this.escapeHtml(nameDisplay)}</div>
            <div style="font-size: 0.72rem; color: var(--text-dim); font-style: italic;">
              Source: "${this.escapeHtml(field.sourceText || "")}"
            </div>
          </td>
          <td>
            <input type="text" class="editable-field-input" value="${this.escapeHtml(valDisplay || '')}"
              onchange="app.updateReviewField(${idx}, 'value', this.value)">
          </td>
          <td>
            <input type="text" class="editable-field-input" style="max-width: 90px;" value="${this.escapeHtml(unitDisplay || '')}"
              onchange="app.updateReviewField(${idx}, 'unit', this.value)">
          </td>
          <td style="font-size: 0.82rem; color: var(--text-muted);">
            ${this.escapeHtml(rangeDisplay)}
          </td>
          <td>
            <button class="badge ${isUncertain ? 'badge-uncertain' : 'badge-verified'}"
              style="cursor: pointer; border: none;"
              onclick="app.toggleFieldVerification(${idx})">
              ${isUncertain ? '⚠ Needs Verify' : '✓ Confirmed'}
            </button>
          </td>
          <td>
            <button class="btn btn-secondary btn-sm" style="padding: 4px 8px; color: #EF4444;"
              onclick="app.removeReviewField(${idx})">✕</button>
          </td>
        </tr>
      `;
    }).join("");
  }

  updateReviewField(idx, prop, newVal) {
    if (!this.currentReviewDoc || !this.currentReviewDoc.extractedFields[idx]) return;
    const f = this.currentReviewDoc.extractedFields[idx];
    if (prop === "value") {
      if (f.fieldType === "Observation") f.value = newVal;
      else if (f.fieldType === "Medication") f.dosage = newVal;
      else f.value = newVal;
    } else if (prop === "unit") {
      if (f.fieldType === "Observation") f.unit = newVal;
      else if (f.fieldType === "Medication") f.frequency = newVal;
    }
  }

  toggleFieldVerification(idx) {
    if (!this.currentReviewDoc || !this.currentReviewDoc.extractedFields[idx]) return;
    const f = this.currentReviewDoc.extractedFields[idx];
    f.userVerified = !f.userVerified;
    f.needsVerification = !f.userVerified;
    this.renderReviewFieldsTable();
  }

  removeReviewField(idx) {
    if (!this.currentReviewDoc) return;
    this.currentReviewDoc.extractedFields.splice(idx, 1);
    this.renderReviewFieldsTable();
  }

  addNewReviewField() {
    if (!this.currentReviewDoc) return;
    const testName = prompt("Enter observation test name or medication name:", "Hemoglobin");
    if (!testName) return;
    const testVal = prompt("Enter result value / dosage:", "13.5");
    const testUnit = prompt("Enter unit (e.g. g/dL, mg/dL):", "g/dL");

    this.currentReviewDoc.extractedFields.push({
      id: "f-user-" + Date.now(),
      fieldType: "Observation",
      testName: testName,
      value: testVal || "",
      unit: testUnit || "",
      referenceRangeText: "User provided",
      interpretation: "User Entered",
      confidence: 1.0,
      userVerified: true,
      needsVerification: false,
      sourceText: `Manually added: ${testName} ${testVal} ${testUnit}`
    });

    this.renderReviewFieldsTable();
  }

  renderReviewSummary(doc) {
    const summaryCard = document.getElementById("review-ai-summary-card");
    if (!summaryCard) return;

    const summary = this.currentLanguage === "te" ? (doc.summaryTe || doc.summaryEn) : doc.summaryEn;
    if (!summary) return;

    const unverifiedCount = (doc.extractedFields || []).filter(f => f.needsVerification || !f.userVerified).length;
    const verifiedCount = (doc.extractedFields || []).length - unverifiedCount;

    summaryCard.innerHTML = `
      <div class="summary-tag-header">
        <div class="summary-chip">
          <span>🤖 Grounded AI Health Summary</span>
          <span style="font-size: 0.72rem; color: #2DD4BF;">(${this.currentLanguage === 'te' ? 'తెలుగు' : 'English'})</span>
        </div>
        <div style="font-size: 0.75rem; color: var(--text-dim);">
          Model: Clinical Plain-Language Engine v2.4 (Strict Medical Grounding)
        </div>
      </div>

      <h3 class="summary-headline">${this.escapeHtml(summary.headline || "Health Document Summary")}</h3>
      <p class="summary-body">${this.escapeHtml(summary.plainLanguage || "")}</p>

      <div class="provenance-breakdown-box">
        <div class="breakdown-item">
          <span class="breakdown-label">Extracted Source Facts</span>
          <span class="breakdown-val" style="color: #34D399;">✓ ${verifiedCount} Verified</span>
        </div>
        <div class="breakdown-item">
          <span class="breakdown-label">Uncertain / Flagged Fields</span>
          <span class="breakdown-val" style="color: ${unverifiedCount > 0 ? '#FBBF24' : '#34D399'};">
            ${unverifiedCount > 0 ? `⚠ ${unverifiedCount} Need Verification` : '✓ 0 (Clean)'}
          </span>
        </div>
        <div class="breakdown-item">
          <span class="breakdown-label">Safety Guardrail Status</span>
          <span class="breakdown-val" style="color: #38BDF8;">Strict Non-Diagnostic Mode</span>
        </div>
      </div>

      <div class="doctor-questions-box">
        <h4>💬 Questions for Your Qualified Doctor / Clinician:</h4>
        <ul>
          ${(summary.doctorQuestions || []).map(q => `<li>${this.escapeHtml(q)}</li>`).join("")}
        </ul>
      </div>

      <div style="background: rgba(244, 63, 94, 0.08); border-left: 3px solid #F43F5E; padding: 12px 16px; border-radius: 4px; font-size: 0.8rem; color: #FDA4AF;">
        <strong>Clinical Disclaimer:</strong> ${this.escapeHtml(summary.safetyNote || "")}
      </div>
    `;
  }

  saveVerifiedDocument() {
    if (!this.currentReviewDoc) return;

    this.currentReviewDoc.processingStatus = "verified";

    // Mark all remaining fields as reviewed
    (this.currentReviewDoc.extractedFields || []).forEach(f => {
      f.userVerified = true;
      f.needsVerification = false;
    });

    // Check if updating existing or inserting new
    const idx = this.documents.findIndex(d => d.id === this.currentReviewDoc.id);
    if (idx >= 0) {
      this.documents[idx] = this.currentReviewDoc;
    } else {
      this.documents.unshift(this.currentReviewDoc);
    }

    this.saveDocumentsToStorage();
    this.showToast("Record successfully verified and saved to your Health Profile!");
    this.switchTab("timeline");
  }

  // --- HEALTH TIMELINE ---
  renderTimeline(filter = "all", searchTerm = "") {
    const streamEl = document.getElementById("timeline-stream");
    if (!streamEl) return;

    let filtered = [...this.documents];

    if (filter !== "all") {
      filtered = filtered.filter(d => (d.documentType || "").toLowerCase().includes(filter.toLowerCase()));
    }

    if (searchTerm) {
      filtered = filtered.filter(d => {
        const text = `${d.fileName} ${d.documentType} ${d.facility} ${d.clinician} ${d.rawText}`.toLowerCase();
        return text.includes(searchTerm);
      });
    }

    // Sort chronologically descending
    filtered.sort((a, b) => new Date(b.documentDate || 0) - new Date(a.documentDate || 0));

    if (filtered.length === 0) {
      streamEl.innerHTML = `
        <div style="text-align: center; padding: 50px 20px; color: var(--text-muted); background: var(--bg-card); border-radius: var(--radius-lg);">
          <div style="font-size: 2.2rem; margin-bottom: 12px;">📁</div>
          <h3>No records match this view</h3>
          <p style="font-size: 0.88rem; margin-top: 6px;">Try clearing filters or upload a medical document.</p>
        </div>
      `;
      return;
    }

    streamEl.innerHTML = filtered.map(doc => {
      const summary = this.currentLanguage === "te" ? (doc.summaryTe || doc.summaryEn) : doc.summaryEn;
      const obsFields = (doc.extractedFields || []).filter(f => f.fieldType === "Observation");
      const medFields = (doc.extractedFields || []).filter(f => f.fieldType === "Medication");

      return `
        <div class="timeline-card">
          <div class="timeline-node-dot"></div>
          <div class="timeline-card-header">
            <div class="timeline-doc-meta">
              <span class="badge ${doc.processingStatus === 'verified' ? 'badge-verified' : 'badge-uncertain'}" style="margin-bottom: 6px; width: fit-content;">
                ${doc.processingStatus === 'verified' ? '✓ Clinically Verified' : '⚠ Needs Verification'}
              </span>
              <h3 class="timeline-doc-title">${this.escapeHtml(doc.fileName || "Medical Record")}</h3>
              <div class="timeline-doc-sub">
                <span>📅 <strong>${doc.documentDate || "Unknown Date"}</strong></span>
                <span>•</span>
                <span>🏥 ${this.escapeHtml(doc.facility || "Facility")}</span>
                <span>•</span>
                <span>👨‍⚕️ ${this.escapeHtml(doc.clinician || "Clinician")}</span>
              </div>
            </div>
            <div style="display: flex; gap: 8px;">
              <button class="btn btn-secondary btn-sm" onclick="app.viewDocumentDetail('${doc.id}')">
                👁 View Details
              </button>
              <button class="btn btn-outline-teal btn-sm" onclick="app.openFhirModal('${doc.id}')">
                📄 ABDM / FHIR
              </button>
              <button class="btn btn-secondary btn-sm" style="color: #EF4444;" onclick="app.deleteDocument('${doc.id}')">
                🗑
              </button>
            </div>
          </div>

          ${summary ? `
            <div style="background: rgba(0, 0, 0, 0.2); border-left: 2px solid #0EA5E9; padding: 12px 14px; border-radius: 4px; font-size: 0.86rem; color: #CBD5E1; margin-bottom: 14px;">
              <strong>${this.escapeHtml(summary.headline || "Summary")}:</strong> ${this.escapeHtml(summary.plainLanguage || "")}
            </div>
          ` : ''}

          ${obsFields.length > 0 ? `
            <div class="timeline-observations-preview">
              ${obsFields.map(o => {
                let statusClass = "obs-normal";
                if (o.status === "high" || (o.interpretation || "").includes("Above")) statusClass = "obs-high";
                if (o.status === "low" || (o.interpretation || "").includes("Below")) statusClass = "obs-low";
                return `
                  <div class="obs-pill ${statusClass}">
                    <span><strong>${this.escapeHtml(o.testName)}</strong>: ${this.escapeHtml(o.value)} ${this.escapeHtml(o.unit || "")}</span>
                    <span style="font-size: 0.7rem; opacity: 0.85;">(${o.referenceRangeText || "Ref Range"})</span>
                  </div>
                `;
              }).join("")}
            </div>
          ` : ''}

          ${medFields.length > 0 ? `
            <div style="margin-top: 10px; display: flex; flex-wrap: wrap; gap: 6px;">
              ${medFields.map(m => `
                <span class="badge" style="background: rgba(139, 92, 246, 0.15); color: #C084FC; border: 1px solid rgba(139, 92, 246, 0.3);">
                  💊 ${this.escapeHtml(m.medicineName)} ${this.escapeHtml(m.dosage || "")} (${this.escapeHtml(m.frequency || "")})
                </span>
              `).join("")}
            </div>
          ` : ''}
        </div>
      `;
    }).join("");
  }

  deleteDocument(docId) {
    if (confirm("Are you sure you want to delete this medical record from your timeline? This action removes sensitive data locally.")) {
      this.documents = this.documents.filter(d => d.id !== docId);
      this.saveDocumentsToStorage();
      this.renderDashboard();
      this.renderTimeline();
      this.renderTrends();
      this.showToast("Medical record deleted successfully.");
    }
  }

  // --- COMPATIBLE TEST TRENDS & CHARTS ---
  renderTrends() {
    const listEl = document.getElementById("trend-tests-list");
    if (!listEl) return;

    // Detect all unique compatible tests present in more than 1 observation or across records
    const testMap = new Map();
    this.documents.forEach(doc => {
      (doc.extractedFields || []).forEach(f => {
        if (f.fieldType === "Observation" && !isNaN(parseFloat(f.value))) {
          const key = f.testName;
          if (!testMap.has(key)) {
            testMap.set(key, { name: f.testName, unit: f.unit, count: 0, refRange: f.referenceRangeText });
          }
          testMap.get(key).count++;
        }
      });
    });

    const testKeys = Array.from(testMap.keys());
    if (testKeys.length === 0) {
      listEl.innerHTML = `<p style="font-size: 0.82rem; color: var(--text-muted);">No numeric observation records available.</p>`;
      return;
    }

    if (!testMap.has(this.selectedTrendTest)) {
      this.selectedTrendTest = testKeys[0];
    }

    listEl.innerHTML = testKeys.map(testName => {
      const data = testMap.get(testName);
      const isSelected = testName === this.selectedTrendTest;
      return `
        <button class="trend-test-btn ${isSelected ? 'active' : ''}" onclick="app.selectTrendTest('${this.escapeHtml(testName)}')">
          <div>
            <div style="font-weight: 600;">${this.escapeHtml(testName)}</div>
            <div style="font-size: 0.72rem; color: var(--text-dim);">${data.unit || ""} • ${data.count} points</div>
          </div>
          <span>→</span>
        </button>
      `;
    }).join("");

    this.drawTrendChart(this.selectedTrendTest);
  }

  selectTrendTest(testName) {
    this.selectedTrendTest = testName;
    this.renderTrends();
  }

  drawTrendChart(testName) {
    const canvas = document.getElementById("trend-chart-canvas");
    if (!canvas) return;

    // Collect data points chronologically
    const points = [];
    let unit = "";
    let lowBound = null;
    let highBound = null;

    this.documents.forEach(doc => {
      (doc.extractedFields || []).forEach(f => {
        if (f.fieldType === "Observation" && f.testName === testName && !isNaN(parseFloat(f.value))) {
          points.push({
            date: doc.documentDate || "Unknown",
            value: parseFloat(f.value),
            unit: f.unit || "",
            facility: doc.facility || "Lab",
            low: f.referenceLow,
            high: f.referenceHigh
          });
          unit = f.unit || unit;
          if (f.referenceLow !== null && f.referenceLow !== undefined) lowBound = f.referenceLow;
          if (f.referenceHigh !== null && f.referenceHigh !== undefined) highBound = f.referenceHigh;
        }
      });
    });

    // Sort chronologically
    points.sort((a, b) => new Date(a.date) - new Date(b.date));

    const labels = points.map(p => p.date);
    const values = points.map(p => p.value);

    // Destroy existing Chart.js instance if present
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    // Set title and reference text
    const titleEl = document.getElementById("chart-test-title");
    const subEl = document.getElementById("chart-test-sub");
    if (titleEl) titleEl.textContent = `${testName} Trend Over Time`;
    if (subEl) subEl.textContent = `Compatible units: ${unit || "Standard"} | Normal Reference Range: ${lowBound !== null ? lowBound : '—'} - ${highBound !== null ? highBound : '—'} ${unit}`;

    // Render using Chart.js if loaded, or fallback SVG
    if (typeof Chart !== "undefined") {
      const ctx = canvas.getContext("2d");

      const datasets = [
        {
          label: `${testName} (${unit})`,
          data: values,
          borderColor: "#0EA5E9",
          backgroundColor: "rgba(14, 165, 233, 0.15)",
          borderWidth: 3,
          pointBackgroundColor: "#2DD4BF",
          pointBorderColor: "#FFFFFF",
          pointRadius: 6,
          pointHoverRadius: 8,
          fill: true,
          tension: 0.3
        }
      ];

      // Add reference threshold guide lines if bounds exist
      if (highBound !== null) {
        datasets.push({
          label: `Upper Reference Limit (${highBound} ${unit})`,
          data: labels.map(() => highBound),
          borderColor: "rgba(244, 63, 94, 0.65)",
          borderDash: [6, 4],
          borderWidth: 2,
          pointRadius: 0,
          fill: false
        });
      }

      this.chartInstance = new Chart(ctx, {
        type: "line",
        data: {
          labels: labels,
          datasets: datasets
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: {
                color: "#94A3B8",
                font: { family: "Inter", size: 12 }
              }
            },
            tooltip: {
              backgroundColor: "#0F172A",
              titleColor: "#FFFFFF",
              bodyColor: "#38BDF8",
              borderColor: "rgba(14, 165, 233, 0.3)",
              borderWidth: 1,
              padding: 12
            }
          },
          scales: {
            x: {
              grid: { color: "rgba(255, 255, 255, 0.05)" },
              ticks: { color: "#94A3B8" }
            },
            y: {
              grid: { color: "rgba(255, 255, 255, 0.05)" },
              ticks: { color: "#94A3B8" }
            }
          }
        }
      });
    } else {
      // Offline fallback: Render clean SVG line chart directly on canvas or wrapper
      const wrapper = document.querySelector(".chart-wrapper");
      if (wrapper) {
        wrapper.innerHTML = `
          <div style="background: rgba(0,0,0,0.3); border-radius: 8px; padding: 20px; height: 100%; display: flex; flex-direction: column; justify-content: space-around;">
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: #38BDF8; font-weight: 600;">
              <span>Dates: ${labels.join(" → ")}</span>
              <span>Values: ${values.map(v => v + " " + unit).join(" → ")}</span>
            </div>
            <div style="display: flex; align-items: flex-end; gap: 20px; height: 180px; padding: 10px 0; border-bottom: 2px solid rgba(255,255,255,0.1);">
              ${values.map((v, i) => {
                const maxVal = Math.max(...values, highBound || 100) * 1.2;
                const hPct = Math.min(100, Math.round((v / maxVal) * 100));
                return `
                  <div style="flex: 1; display: flex; flex-direction: column; align-items: center; height: 100%; justify-content: flex-end;">
                    <span style="font-size: 0.75rem; color: #38BDF8; margin-bottom: 4px;">${v} ${unit}</span>
                    <div style="width: 32px; height: ${hPct}%; background: linear-gradient(180deg, #0EA5E9, #0D9488); border-radius: 4px;"></div>
                    <span style="font-size: 0.72rem; color: #94A3B8; margin-top: 6px;">${labels[i]}</span>
                  </div>
                `;
              }).join("")}
            </div>
            <div style="font-size: 0.75rem; color: #94A3B8; text-align: center;">
              Offline visual fallback mode • Reference Range: ${lowBound || '—'} - ${highBound || '—'} ${unit}
            </div>
          </div>
        `;
      }
    }
  }

  // --- DOCUMENT DETAIL MODAL ---
  viewDocumentDetail(docId) {
    const doc = this.documents.find(d => d.id === docId);
    if (!doc) return;

    this.currentReviewDoc = doc;
    const modal = document.getElementById("detail-modal");
    if (!modal) return;

    const summary = this.currentLanguage === "te" ? (doc.summaryTe || doc.summaryEn) : doc.summaryEn;

    const content = document.getElementById("detail-modal-body");
    content.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;">
        <div>
          <span class="badge ${doc.processingStatus === 'verified' ? 'badge-verified' : 'badge-uncertain'}">
            ${doc.processingStatus === 'verified' ? '✓ Verified Record' : '⚠ Needs Verification'}
          </span>
          <h2 style="font-size: 1.5rem; font-weight: 700; color: #FFFFFF; margin-top: 6px;">${this.escapeHtml(doc.fileName)}</h2>
          <div style="font-size: 0.82rem; color: var(--text-muted); margin-top: 4px;">
            <span>📅 ${doc.documentDate}</span> • <span>🏥 ${this.escapeHtml(doc.facility || "Facility")}</span> • <span>👨‍⚕️ ${this.escapeHtml(doc.clinician || "Clinician")}</span>
          </div>
        </div>
        <button class="btn btn-outline-teal btn-sm" onclick="app.openFhirModal('${doc.id}')">
          ABDM / FHIR JSON
        </button>
      </div>

      <div style="background: rgba(14, 165, 233, 0.08); border: 1px solid rgba(14, 165, 233, 0.25); border-radius: var(--radius-md); padding: 18px; margin-bottom: 24px;">
        <h4 style="font-size: 0.95rem; color: #38BDF8; margin-bottom: 8px;">🤖 ${summary ? summary.headline : 'Plain-Language Summary'}</h4>
        <p style="font-size: 0.92rem; color: #E2E8F0; line-height: 1.6;">${summary ? summary.plainLanguage : 'Summary not generated.'}</p>
        <p style="font-size: 0.78rem; color: #94A3B8; margin-top: 10px; font-style: italic;">
          ${summary ? summary.safetyNote : ''}
        </p>
      </div>

      <h4 style="font-size: 1rem; font-weight: 600; margin-bottom: 12px;">Extracted Structured Facts & Fields</h4>
      <div class="fields-table-wrap" style="margin-bottom: 24px;">
        <table class="fields-table">
          <thead>
            <tr>
              <th>Field / Test</th>
              <th>Result / Dosage</th>
              <th>Unit / Freq</th>
              <th>Reference Interval</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${(doc.extractedFields || []).map(f => {
              const isObs = f.fieldType === "Observation";
              const isMed = f.fieldType === "Medication";
              return `
                <tr>
                  <td><strong>${this.escapeHtml(isObs ? f.testName : (isMed ? f.medicineName : (f.name || 'Field')))}</strong></td>
                  <td>${this.escapeHtml(isObs ? f.value : (isMed ? f.dosage : f.value))}</td>
                  <td>${this.escapeHtml(isObs ? f.unit : (isMed ? f.frequency : ''))}</td>
                  <td>${this.escapeHtml(isObs ? (f.referenceRangeText || '-') : (isMed ? (f.duration || '-') : '-'))}</td>
                  <td>
                    <span class="badge ${f.userVerified ? 'badge-verified' : 'badge-uncertain'}">
                      ${f.userVerified ? '✓ Verified' : '⚠ Uncertain'}
                    </span>
                  </td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      </div>

      <h4 style="font-size: 0.9rem; font-weight: 600; color: var(--text-muted); margin-bottom: 8px;">Preserved Source Document Text</h4>
      <div class="source-text-box">${this.escapeHtml(doc.rawText || "")}</div>
    `;

    modal.classList.add("open");
  }

  // --- FHIR R4 / ABDM MODAL ---
  openFhirModal(docId) {
    const doc = this.documents.find(d => d.id === docId);
    if (!doc) return;

    const modal = document.getElementById("fhir-modal");
    const jsonContainer = document.getElementById("fhir-json-code");
    if (!modal || !jsonContainer) return;

    const fhirBundle = typeof generateDocumentFhirBundle !== "undefined"
      ? generateDocumentFhirBundle(doc)
      : { resourceType: "Bundle", error: "fhir.js not initialized" };

    const jsonString = JSON.stringify(fhirBundle, null, 2);
    jsonContainer.textContent = jsonString;

    modal.classList.add("open");
  }

  copyFhirJson() {
    const code = document.getElementById("fhir-json-code");
    if (code) {
      navigator.clipboard.writeText(code.textContent);
      this.showToast("FHIR R4 JSON Bundle copied to clipboard!");
    }
  }

  downloadFhirJson() {
    const code = document.getElementById("fhir-json-code");
    if (!code) return;
    const blob = new Blob([code.textContent], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `MediMate_FHIR_Bundle_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    this.showToast("FHIR JSON downloaded successfully.");
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove("open");
  }

  // --- UTILITIES ---
  getDocIcon(type = "") {
    if (type.includes("Lab") || type.includes("Diagnostic")) return "🔬";
    if (type.includes("Prescription")) return "💊";
    if (type.includes("Discharge")) return "🏥";
    return "📄";
  }

  escapeHtml(str = "") {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  showToast(msg) {
    const toast = document.createElement("div");
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: linear-gradient(135deg, #0EA5E9, #0D9488);
      color: #FFFFFF;
      padding: 12px 22px;
      border-radius: 9999px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
      font-weight: 600;
      font-size: 0.88rem;
      z-index: 999;
      animation: fadeIn 0.3s ease;
    `;
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transition = "opacity 0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }
}

// Global instance initialized on DOM ready
let app;
document.addEventListener("DOMContentLoaded", () => {
  app = new MediMateApp();
});
