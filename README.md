# MediMate AI — AI-Powered Personal Health Copilot

> **Your Health Records. Simplified by AI.**  
> *A hackathon prototype designed for patients and caregivers to organize medical documents, extract visible details, verify uncertain fields, and generate cautious plain-language summaries in English and Telugu.*

---

## ⚠️ Medical Safety Notice
> **MediMate AI helps organize and explain information in medical documents. It does not diagnose conditions or replace professional medical advice. Check extracted information against the original document and consult a qualified healthcare professional about medical decisions.**

---

## 🌟 Key Features

1. **Document Upload & OCR Processing**:
   - Supports **PDF**, **JPG**, and **PNG** records up to 15MB.
   - Client and server-side file format and size validation.
   - Direct text extraction for embedded PDFs and optical character recognition (OCR) for scanned images and paper prescriptions.

2. **Structured Clinical Extraction Layer**:
   - Extracts: Document Type, Patient Identifier, Date, Clinician/Facility, Observations (Test Name, Result, Unit, Biological Reference Interval), Medications (Name, Dosage, Route, Frequency, Duration), and Diagnosis as written.
   - Preserves original raw text and provenance for complete auditability.

3. **Human-in-the-Loop Verification & Review Screen**:
   - **Never guesses** illegible handwriting or ambiguous medicine names.
   - Automatically marks uncertain entries with an amber badge: `⚠ Needs Verification`.
   - Side-by-side split screen showing raw source document against structured fields with inline editing.

4. **Fact-Grounded AI Health Summary**:
   - Written in calm, accessible, non-alarming everyday language.
   - Cross-references lab values with the **printed reference interval on that specific report** (indicating below, within, or above).
   - Explains that reference intervals vary by laboratory and instrumentation.
   - Formulates specific questions for the patient to ask their doctor.
   - Strictly non-diagnostic; does not alter or prescribe medications.

5. **Bilingual English & Telugu (తెలుగు) Support**:
   - Instant language toggle for summaries and key interface elements.
   - Preserves numerical values, units, dates, and medication names faithfully without transliteration errors.

6. **Unified Health Profile & Chronological Timeline**:
   - Visual timeline of prior health records with document type filters (All, Lab Reports, Prescriptions, Discharge Summaries).
   - Allows users to open past records, inspect details, and remove records securely.

7. **Compatible Test Results Trend Visualization**:
   - Interactive Chart.js charts comparing compatible lab measurements over time (e.g., Fasting Glucose, HbA1c, Cholesterol) across multiple visits.
   - Shows normal reference interval boundary bands.
   - Emphasizes that comparisons are valid only for compatible tests and units.

8. **ABDM / FHIR R4 Readiness**:
   - Structured JSON schema adhering to HL7 FHIR R4 and NRCeS ABDM standards:
     - `Patient` (with clearly labeled **Mock ABHA: 91-4821-9034-7102**)
     - `DocumentReference`
     - `Observation` (with LOINC codes)
     - `MedicationStatement` (with RxNorm coding)
     - `Provenance` (tracking extraction timestamp and review status)
   - Interactive JSON viewer with one-click copy and download.

---

## 🚀 Quick Start Instructions

### Option 1: Instant Browser Launch (Zero Dependencies)
The frontend application is completely self-contained and ready to run immediately in any modern web browser:
1. Navigate to: `c:\Users\yakas\OneDrive\Desktop\medimate-ai\`
2. Double-click or open `index.html` in your browser (Chrome, Edge, Firefox).
3. The dashboard loads pre-populated with realistic synthetic demo records!
4. Click **Fast Demo** on the upload page to test immediate extraction and review.

### Option 2: Full-Stack Python Backend
To run the companion FastAPI REST API with OCR extraction:
1. Open PowerShell or Terminal in `c:\Users\yakas\OneDrive\Desktop\medimate-ai\backend`:
   ```bash
   cd c:\Users\yakas\OneDrive\Desktop\medimate-ai\backend
   pip install -r requirements.txt
   uvicorn app:app --reload --port 8000
   ```
2. The interactive API documentation will be available at `http://localhost:8000/docs`.

---

## 📁 Repository Structure

```
medimate-ai/
├── index.html                   # Main responsive web application
├── app.css                      # Premium healthcare design system & dark mode
├── app.js                       # Core application controller & state machine
├── fhir.js                      # ABDM / FHIR R4 resource generation & provenance
├── sample_data.js               # Synthetic medical datasets (Metropolis Lab, Apollo Prescription)
├── sample_documents/            # Printable synthetic test files
│   ├── sample_lab_report.html
│   ├── sample_prescription.html
│   └── sample_discharge_summary.html
├── backend/                     # Python FastAPI server
│   ├── app.py                   # REST endpoints (/upload, /extract, /summarize)
│   ├── ocr_engine.py            # PDF direct parser + Tesseract OCR fallback
│   ├── fhir_models.py           # Pydantic schemas for FHIR R4
│   ├── summarizer.py            # Grounded summarizer engine with Telugu support
│   ├── requirements.txt         # Python dependencies
│   └── .env.example             # Environment variable template
├── ARCHITECTURE.md              # System architecture & safety boundaries
├── DEMO_SCRIPT.md               # 2-3 minute presentation script for judges
└── README.md                    # Project documentation
```

---

## 🔒 Privacy, Security & Compliance Safeguards

- **De-identified Synthetic Data**: All demo documents utilize fictitious names and synthetic clinical values.
- **Client-Side SHA-256**: Uploaded documents are hashed locally for integrity verification.
- **Local Storage Persistence**: In prototype mode, records are stored in browser `localStorage`; no medical data is transmitted to unauthorized cloud servers.
- **Delete Record Control**: Users retain full authority to remove any health record and its associated observation history at any time.
- **ABDM Mock Disclaimer**: The ABHA identifier is clearly marked `DEMO / MOCK ABHA`. Live ABDM integration requires authorized Indian National Health Authority (NHA) gateway onboarding.

---

## 🏆 Hackathon Alignment Summary

| Hackathon Requirement | Implementation Status | Evidence / Location |
|---|---|---|
| Responsive Web App | ✅ Complete | Modern responsive UI (`index.html`, `app.css`) |
| PDF & Image OCR | ✅ Complete | PDF text parsing + OCR fallback (`app.js`, `ocr_engine.py`) |
| Human-in-the-Loop Review | ✅ Complete | Editable split review screen with uncertainty flags |
| Grounded Plain-Language Summary | ✅ Complete | Summaries based solely on document facts (`summarizer.py`) |
| English & Telugu Support | ✅ Complete | Real-time bilingual toggle (`app.js`, `sample_data.js`) |
| Unified Health Timeline | ✅ Complete | Chronological stream with filters and detail views |
| Compatible Results Comparison | ✅ Complete | Interactive Chart.js trend charts with reference bands |
| ABDM / FHIR Schema | ✅ Complete | FHIR R4 resources with provenance and Mock ABHA (`fhir.js`) |
| Prominent Safety Notice | ✅ Complete | Persistent top alert banner and clinical disclaimers |
