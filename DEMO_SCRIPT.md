# MediMate AI — 2-to-3 Minute Presentation & Demo Script

**Role / Persona**: Senior Full-Stack Developer & Health AI Engineer  
**Audience**: Hackathon Judges, Clinicians, and Evaluators  
**Goal**: Demonstrate the end-to-end workflow: Upload → OCR/Extraction → Verification → Bilingual Summary → Timeline → Trends → FHIR Export.

---

### Step 1: Introduction & Problem Context (30 seconds)
> *"Good morning judges. Healthcare records in India are notoriously fragmented—patients carry physical files, WhatsApp PDFs, and lab reports across different clinics. When patients look at these records, dense clinical jargon and printed reference intervals cause unnecessary anxiety or dangerous confusion.*
>
> *Introducing **MediMate AI**—an AI-powered personal health copilot designed strictly as an information organization and comprehension tool, not a diagnostic system. Let me demonstrate how it works."*

---

### Step 2: Dashboard & Fast Upload (45 seconds)
> *(Open Dashboard)*
> *"Here on our dashboard, patients see their total documents, tracked observations, and any items requiring review. Notice our persistent Medical Safety Notice and clearly labeled Mock ABHA identifier.*
>
> *(Click 'Upload Record')*
> *We accept PDFs, JPGs, and PNGs with both client and server-side size and MIME validation. Let's upload a prescription with handwritten notes—or click our instant demo button.*
>
> *(Click 'Care Clinic Prescription' Fast Demo)*
> *The pipeline immediately verifies file integrity, executes OCR, and structures clinical entities."*

---

### Step 3: Human-in-the-Loop Review & Uncertainty Handling (45 seconds)
> *(Show Verification & Review Screen)*
> *"Crucially, MediMate AI adheres to healthcare safety: **we never guess illegible handwriting or drug dosages.** Notice on the right: Ecosprin and Metoprolol were extracted with high confidence, but the third medication has been flagged with an amber badge: **'Needs Verification'** because the doctor's handwriting was unclear.*
>
> *The patient can inspect the raw source text on the left, edit the value directly, or consult their pharmacist before saving."*

---

### Step 4: Grounded Summaries & Telugu Multilingual Toggle (30 seconds)
> *(Scroll down to AI Summary Card)*
> *"Our AI summarization layer produces calm, plain-language explanations grounded strictly in what the report actually says. It compares lab results against the report's printed reference range, reminds the patient that lab calibrations vary, and generates specific questions to ask their doctor.*
>
> *(Click 'తెలుగు' in top bar)*
> *With one click, the entire interface and summary toggle seamlessly into Telugu (తెలుగు), keeping medicine names and dosages strictly intact."*

---

### Step 5: Timeline, Trends & ABDM / FHIR Readiness (30 seconds)
> *(Click 'Confirm & Save to Timeline')*
> *"The verified document is now saved to the patient's chronological timeline.*
>
> *(Click 'Lab Trends')*
> *Here, compatible lab tests like Fasting Blood Sugar or HbA1c are plotted over time against normal reference boundaries.*
>
> *(Click 'ABDM / FHIR' tab or modal)*
> *Finally, MediMate AI is ready for India's digital health ecosystem. Every record produces an ABDM-inspired HL7 FHIR R4 Bundle containing Patient, Observation, and MedicationStatement resources, alongside complete provenance audit trails.*
>
> *Thank you—I welcome your questions!"*
