# MediMate AI — System Architecture & Design Specification

## 1. High-Level System Architecture

MediMate AI is structured into four distinct modular layers:

```
[ User Document (PDF / JPG / PNG) ]
                │
                ▼
┌──────────────────────────────────────────────┐
│        1. Ingestion & Extraction Layer       │
│  - File type & size validation (< 15MB)      │
│  - PDF Direct Text Parsing (Text Layer)      │
│  - Optical Character Recognition (OCR)       │
│  - Raw Source Text Preservation              │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│     2. Clinical Entity Structuring & NLP     │
│  - Extraction: Lab tests, bounds, medicines  │
│  - Confidence Scoring & Uncertainty Flagging │
│  - "Needs Verification" for low confidence   │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│    3. Human-in-the-Loop Review Screen        │
│  - Split view: Raw source vs structured form │
│  - Inline editing of values, units, bounds   │
│  - User confirmation required before save    │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│   4. Grounded AI Summarization (EN & TE)     │
│  - Cautious plain-language explanation       │
│  - Comparison vs printed report ref intervals│
│  - Doctor questions formulation              │
│  - Bilingual rendering (English & Telugu)    │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│     5. Storage, Timeline & FHIR Bundling     │
│  - Chronological Health Timeline             │
│  - Compatible Test Trend Comparison (Chart)  │
│  - ABDM / FHIR R4 Bundle with Provenance     │
│  - Mock ABHA ID: 91-4821-9034-7102           │
└──────────────────────────────────────────────┘
```

---

## 2. ABDM / FHIR R4 Resource Mapping

| Medical Entity | FHIR Resource Type | Standard Coding System | Notes |
|---|---|---|---|
| Patient Profile | `Patient` | `https://healthid.ndhm.gov.in` | Uses Mock ABHA ID (`91-4821-9034-7102`) |
| Uploaded File | `DocumentReference` | `http://loinc.org` | Retains file MIME type and creation date |
| Lab Measurements | `Observation` | LOINC (e.g., `1558-6` Fasting Glucose) | Captures `valueQuantity`, `referenceRange`, and status |
| Prescribed Drugs | `MedicationStatement` | RxNorm / Generic mapping | Captures dosage, frequency, route, and duration |
| Clinical Visit | `Encounter` | Local clinic identifier | Maps consultation context |
| Extraction Audit | `Provenance` | HL7 V3 DataOperation | Records author, agent, file hash, and verification status |

---

## 3. Strict Clinical Guardrails

1. **Non-Diagnostic Constraint**: The summarizer is forbidden from inferring diagnoses not explicitly recorded by the attending clinician on the source record.
2. **Medication Modification Guard**: The system never advises modifying dosages or discontinuing medications.
3. **Reference Range Context**: Laboratory values are only evaluated in direct relation to the *printed reference interval on that specific laboratory's report*, with explicit notification that laboratory reference intervals vary across facilities.
4. **Uncertainty Transparency**: Low-confidence or handwritten text is never guessed; it is explicitly flagged for user inspection.
