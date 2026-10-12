// MediMate AI - Synthetic Sample Data & Presets
// Realistic, strictly de-identified healthcare documents for demonstration

const SAMPLE_DOCUMENTS = [
  {
    id: "doc-sample-001",
    documentType: "Diagnostic Lab Report",
    fileName: "Metropolis_Lab_Report_Lipid_Glucose_2026-08-15.pdf",
    documentDate: "2026-08-15",
    facility: "Metropolis Healthcare & Diagnostic Center, Hyderabad",
    clinician: "Dr. K. Srinivas Rao, MD (Internal Medicine)",
    patient: {
      id: "P-88421",
      name: "S. V. Sharma (Demo Patient)",
      age: 48,
      gender: "Male",
      mockAbhaId: "91-4821-9034-7102 (DEMO / MOCK)"
    },
    rawText: `METROPOLIS HEALTHCARE & DIAGNOSTIC CENTER
Plot 42, Road No. 3, Banjara Hills, Hyderabad - 500034
NABH & NABL ACCREDITED LABORATORY

PATIENT INFORMATION:
Patient Name: S. V. Sharma (Demo)    Age/Gender: 48 Y / Male
Ref By: Dr. K. Srinivas Rao, MD      Sample Collected: 15-Aug-2026 07:30 AM
Lab ID: MET-HYD-2026-88421           Report Released:  15-Aug-2026 02:45 PM

DEPARTMENT OF CLINICAL BIOCHEMISTRY

TEST NAME                          RESULT      UNIT        REFERENCE INTERVAL
---------------------------------------------------------------------------------
Fasting Blood Sugar (Glucose)       138 *      mg/dL       70.0 - 99.0
Post Prandial Blood Sugar (PPBS)   192 *      mg/dL       70.0 - 139.0
Glycated Hemoglobin (HbA1c)        7.4 *      %           4.0 - 5.6
  Estimated Avg Glucose (eAG)      166        mg/dL       -

LIPID PROFILE:
Total Cholesterol                  224 *      mg/dL       < 200.0
Triglycerides                      210 *      mg/dL       < 150.0
HDL Cholesterol (Good)             38  *      mg/dL       40.0 - 60.0
LDL Cholesterol (Calculated)       144 *      mg/dL       < 100.0
VLDL Cholesterol                   42         mg/dL       < 30.0
Total Chol / HDL Ratio             5.89       Ratio       3.3 - 4.4

RENAL FUNCTION:
Serum Creatinine                   0.92       mg/dL       0.70 - 1.20
Blood Urea                         24.0       mg/dL       15.0 - 40.0

NOTES / CLINICAL INTERPRETATION:
* Marked values indicate results outside the laboratory's standard reference interval.
Biological reference intervals vary by laboratory, reagent lot, and measurement methodology.
These results alone do not constitute a clinical diagnosis. Correlate clinically.

Authorized Signatory:
Dr. Ananya Reddy, MD (Pathology)`,
    processingStatus: "verified",
    extractedFields: [
      {
        id: "ef-1",
        fieldType: "Observation",
        testName: "Fasting Blood Sugar",
        testCode: "1558-6",
        value: "138",
        unit: "mg/dL",
        referenceLow: 70.0,
        referenceHigh: 99.0,
        referenceRangeText: "70.0 - 99.0 mg/dL",
        interpretation: "Above Reference Interval",
        status: "high",
        sourceText: "Fasting Blood Sugar (Glucose) 138 * mg/dL 70.0 - 99.0",
        confidence: 0.98,
        userVerified: true,
        pageNumber: 1
      },
      {
        id: "ef-2",
        fieldType: "Observation",
        testName: "Post Prandial Blood Sugar (PPBS)",
        testCode: "14771-0",
        value: "192",
        unit: "mg/dL",
        referenceLow: 70.0,
        referenceHigh: 139.0,
        referenceRangeText: "70.0 - 139.0 mg/dL",
        interpretation: "Above Reference Interval",
        status: "high",
        sourceText: "Post Prandial Blood Sugar (PPBS) 192 * mg/dL 70.0 - 139.0",
        confidence: 0.97,
        userVerified: true,
        pageNumber: 1
      },
      {
        id: "ef-3",
        fieldType: "Observation",
        testName: "Glycated Hemoglobin (HbA1c)",
        testCode: "4548-4",
        value: "7.4",
        unit: "%",
        referenceLow: 4.0,
        referenceHigh: 5.6,
        referenceRangeText: "4.0 - 5.6 %",
        interpretation: "Above Reference Interval",
        status: "high",
        sourceText: "Glycated Hemoglobin (HbA1c) 7.4 * % 4.0 - 5.6",
        confidence: 0.99,
        userVerified: true,
        pageNumber: 1
      },
      {
        id: "ef-4",
        fieldType: "Observation",
        testName: "Total Cholesterol",
        testCode: "2093-3",
        value: "224",
        unit: "mg/dL",
        referenceLow: null,
        referenceHigh: 200.0,
        referenceRangeText: "< 200.0 mg/dL",
        interpretation: "Above Reference Interval",
        status: "high",
        sourceText: "Total Cholesterol 224 * mg/dL < 200.0",
        confidence: 0.96,
        userVerified: true,
        pageNumber: 1
      },
      {
        id: "ef-5",
        fieldType: "Observation",
        testName: "Triglycerides",
        testCode: "2571-8",
        value: "210",
        unit: "mg/dL",
        referenceLow: null,
        referenceHigh: 150.0,
        referenceRangeText: "< 150.0 mg/dL",
        interpretation: "Above Reference Interval",
        status: "high",
        sourceText: "Triglycerides 210 * mg/dL < 150.0",
        confidence: 0.95,
        userVerified: true,
        pageNumber: 1
      },
      {
        id: "ef-6",
        fieldType: "Observation",
        testName: "HDL Cholesterol",
        testCode: "2085-9",
        value: "38",
        unit: "mg/dL",
        referenceLow: 40.0,
        referenceHigh: 60.0,
        referenceRangeText: "40.0 - 60.0 mg/dL",
        interpretation: "Below Reference Interval",
        status: "low",
        sourceText: "HDL Cholesterol (Good) 38 * mg/dL 40.0 - 60.0",
        confidence: 0.94,
        userVerified: true,
        pageNumber: 1
      },
      {
        id: "ef-7",
        fieldType: "Observation",
        testName: "Serum Creatinine",
        testCode: "2160-0",
        value: "0.92",
        unit: "mg/dL",
        referenceLow: 0.70,
        referenceHigh: 1.20,
        referenceRangeText: "0.70 - 1.20 mg/dL",
        interpretation: "Within Stated Range",
        status: "normal",
        sourceText: "Serum Creatinine 0.92 mg/dL 0.70 - 1.20",
        confidence: 0.98,
        userVerified: true,
        pageNumber: 1
      }
    ],
    summaryEn: {
      headline: "Routine Blood Glucose & Lipid Profile Lab Summary",
      plainLanguage: "This document is a blood test report from Metropolis Healthcare dated August 15, 2026. Comparing the printed results with the laboratory's printed reference ranges: Fasting Blood Sugar (138 mg/dL), Post-Prandial Blood Sugar (192 mg/dL), and HbA1c (7.4%) are reported above the stated reference intervals (70-99 mg/dL, 70-139 mg/dL, and 4.0-5.6% respectively). In the lipid panel, Total Cholesterol (224 mg/dL) and Triglycerides (210 mg/dL) are above the printed desired bounds (<200 and <150 mg/dL), while HDL (Good Cholesterol, 38 mg/dL) is below the stated range (40-60 mg/dL). Kidney function marker Serum Creatinine (0.92 mg/dL) is within the normal printed interval (0.70-1.20 mg/dL).",
      safetyNote: "Important: Reference intervals vary by laboratory and instrumentation. A laboratory value alone does not establish a medical diagnosis or condition. Please share this report with Dr. K. Srinivas Rao or your physician for personalized clinical context.",
      doctorQuestions: [
        "What do the elevated blood sugar and HbA1c (7.4%) values indicate in my specific clinical context?",
        "Do you recommend dietary adjustments, exercise modifications, or medication regarding my lipid numbers?",
        "When should I repeat these fasting tests to monitor my levels?"
      ],
      factsExtractedCount: 7,
      uncertainCount: 0
    },
    summaryTe: {
      headline: "రక్తంలో చక్కెర & లిపిడ్ ప్రొఫైల్ ల్యాబ్ సారాంశం (Lab Summary)",
      plainLanguage: "ఈ నివేదిక ఆగస్టు 15, 2026 నాటి మెట్రోపాలిస్ హెల్త్‌కేర్ ల్యాబ్ పరీక్ష నివేదిక. రిపోర్టులో ముద్రించిన సూచన పరిమితులతో (Reference Intervals) పోల్చినప్పుడు: ఖాళీ కడుపు చక్కెర (Fasting Glucose - 138 mg/dL), భోజనం తర్వాత చక్కెర (PPBS - 192 mg/dL) మరియు HbA1c (7.4%) లు ఆ ల్యాబ్ సాధారణ పరిమితుల కంటే ఎక్కువగా నమోదయ్యాయి. లిపిడ్ పరీక్షలో కొలెస్ట్రాల్ (224 mg/dL) మరియు ట్రైగ్లిజరైడ్స్ (210 mg/dL) సూచించిన పరిమితి కంటే ఎక్కువగా ఉన్నాయి. మంచి కొలెస్ట్రాల్ HDL (38 mg/dL) సాధారణ పరిమితి (40-60 mg/dL) కంటే తక్కువగా ఉంది. కిడ్నీ పనితీరును సూచించే సీరం క్రియాటినిన్ (0.92 mg/dL) సాధారణ పరిమితిలోనే ఉంది.",
      safetyNote: "గమనిక: ల్యాబ్ కొలత ప్రమాణాలు ప్రయోగశాలను బట్టి మారుతుంటాయి. కేవలం ల్యాబ్ నివేదిక ఆధారంగా ఎటువంటి వైద్య నిర్ధారణ లేదా చికిత్సా నిర్ణయాలు తీసుకోరాదు. దయచేసి పూర్తి వివరాల కోసం మీ వైద్యులను సంప్రదించండి.",
      doctorQuestions: [
        "నా రక్తంలో చక్కెర మరియు HbA1c (7.4%) స్థాయిలకు సంబంధించి మీ సలహా ఏమిటి?",
        "కొలెస్ట్రాల్ నియంత్రణ కోసం ఆహారపు అలవాట్లలో లేదా వ్యాయామంలో ఎలాంటి మార్పులు అవసరం?",
        "ఈ పరీక్షలను మళ్లీ ఎప్పుడు చేయించుకోవాలి?"
      ],
      factsExtractedCount: 7,
      uncertainCount: 0
    }
  },

  {
    id: "doc-sample-002",
    documentType: "Prescription",
    fileName: "Apollo_Clinic_Prescription_Dr_Sharma_2026-08-16.png",
    documentDate: "2026-08-16",
    facility: "Apollo Clinic, Jubilee Hills, Hyderabad",
    clinician: "Dr. K. Srinivas Rao, MD, DM (Consultant Physician)",
    patient: {
      id: "P-88421",
      name: "S. V. Sharma (Demo Patient)",
      age: 48,
      gender: "Male",
      mockAbhaId: "91-4821-9034-7102 (DEMO / MOCK)"
    },
    rawText: `APOLLO CLINIC - JUBILEE HILLS
Reg No: TS-MED-49120 | Phone: +91 40 2360 7777

PATIENT: S. V. Sharma | Age: 48 / M | Date: 16-Aug-2026
Diagnosis / Clinical Notes as written:
Essential Hypertension & Type 2 Diabetes Mellitus (Uncomplicated)

Rx (MEDICATIONS):
1. Tab. Metformin 500mg
   Dosage: 500 mg | Route: Oral | Frequency: Once daily after dinner (OD) | Duration: 30 days
   Instructions: Take with or immediately after food.

2. Tab. Atorvastatin 10mg
   Dosage: 10 mg | Route: Oral | Frequency: Once daily at bedtime (OD) | Duration: 30 days
   Instructions: Bedtime administration recommended.

3. Tab. Telmisartan 40mg
   Dosage: 40 mg | Route: Oral | Frequency: Once daily in morning (OD) | Duration: 30 days
   Instructions: Monitor BP periodically.

4. Dietary Advice:
   Low glycemic diet, salt restriction (<5g/day), brisk walking 30 min/day.
   Review after 30 days with repeat Fasting Glucose & BP log.

Dr. K. Srinivas Rao, MD
Signature Verified`,
    processingStatus: "verified",
    extractedFields: [
      {
        id: "ef-201",
        fieldType: "Diagnosis",
        name: "Diagnosis as written",
        value: "Essential Hypertension & Type 2 Diabetes Mellitus (Uncomplicated)",
        confidence: 0.95,
        userVerified: true,
        sourceText: "Essential Hypertension & Type 2 Diabetes Mellitus (Uncomplicated)"
      },
      {
        id: "ef-202",
        fieldType: "Medication",
        medicineName: "Metformin",
        dosage: "500 mg",
        route: "Oral",
        frequency: "Once daily after dinner (OD)",
        duration: "30 days",
        instructions: "Take with or immediately after food",
        confidence: 0.98,
        userVerified: true,
        sourceText: "Tab. Metformin 500mg - Once daily after dinner (OD) - 30 days"
      },
      {
        id: "ef-203",
        fieldType: "Medication",
        medicineName: "Atorvastatin",
        dosage: "10 mg",
        route: "Oral",
        frequency: "Once daily at bedtime (OD)",
        duration: "30 days",
        instructions: "Bedtime administration recommended",
        confidence: 0.97,
        userVerified: true,
        sourceText: "Tab. Atorvastatin 10mg - Once daily at bedtime (OD) - 30 days"
      },
      {
        id: "ef-204",
        fieldType: "Medication",
        medicineName: "Telmisartan",
        dosage: "40 mg",
        route: "Oral",
        frequency: "Once daily in morning (OD)",
        duration: "30 days",
        instructions: "Monitor BP periodically",
        confidence: 0.96,
        userVerified: true,
        sourceText: "Tab. Telmisartan 40mg - Once daily in morning (OD) - 30 days"
      }
    ],
    summaryEn: {
      headline: "Prescription Record Summary",
      plainLanguage: "This document is an outpatient prescription from Apollo Clinic issued on August 16, 2026 by Dr. K. Srinivas Rao. The diagnosis written on the source document is 'Essential Hypertension & Type 2 Diabetes Mellitus (Uncomplicated)'. Three oral medications are prescribed for a 30-day course: Metformin (500mg, once daily after dinner), Atorvastatin (10mg, once daily at night), and Telmisartan (40mg, once daily in the morning). The document also notes lifestyle recommendations including a low-glycemic, reduced-salt diet and 30 minutes of daily brisk walking, with a planned clinical review in 30 days.",
      safetyNote: "Safety Guardrail: MediMate AI does not recommend, alter, or prescribe medications. Take medicines strictly as directed by your clinician and pharmacist. If you experience adverse reactions, contact your doctor immediately.",
      doctorQuestions: [
        "What are the common side effects of these medications to be aware of?",
        "Should I maintain a daily home blood pressure and blood sugar log?",
        "How should I take these medications if I miss a dose?"
      ],
      factsExtractedCount: 4,
      uncertainCount: 0
    },
    summaryTe: {
      headline: "వైద్యుల ప్రిస్క్రిప్షన్ సారాంశం (Prescription Summary)",
      plainLanguage: "ఈ పత్రం ఆగస్టు 16, 2026 నాటి అపోలో క్లినిక్ డాక్టర్ కె. శ్రీనివాస్ రావు గారి ప్రిస్క్రిప్షన్. ఇందులో పేర్కొన్న వ్యాధి నిర్ధారణ: హైపర్‌టెన్షన్ (రక్తపోటు) మరియు టైప్ 2 డయాబెటిస్. 30 రోజుల కాలపరిమితికి 3 ఔషధాలు సూచించబడ్డాయి: మెట్‌ఫార్మిన్ (Metformin 500mg - రాత్రి భోజనం తర్వాత), అటోర్వాస్టాటిన్ (Atorvastatin 10mg - రాత్రి పడుకునే ముందు), మరియు టెల్మిసార్టన్ (Telmisartan 40mg - ఉదయం పూట). ఉప్పు తక్కువగా తీసుకోవడం మరియు రోజుకు 30 నిమిషాల నడక వంటి జీవనశైలి మార్పులు సూచించారు.",
      safetyNote: "ముఖ్య గమనిక: మెడిమేట్ ఎఐ ఎట్టి పరిస్థితుల్లోనూ మందులను మార్చదు లేదా కొత్తవి సూచించదు. డాక్టర్ మరియు ఫార్మసిస్ట్ సూచించిన విధంగానే మందులు వాడండి.",
      doctorQuestions: [
        "ఈ మందుల వల్ల ఏవైనా సాధారణ దుష్ప్రభావాలు (Side Effects) ఉంటాయా?",
        "ఇంట్లోనే రోజూ రక్తపోటు మరియు షుగర్ రికార్డు నమోదు చేసుకోవాలా?",
        "ఏదైనా సమయంలో మందు తీసుకోవడం మర్చిపోతే ఏమి చేయాలి?"
      ],
      factsExtractedCount: 4,
      uncertainCount: 0
    }
  },

  {
    id: "doc-sample-003",
    documentType: "Diagnostic Lab Report",
    fileName: "Metropolis_Lab_Followup_Glucose_Lipid_2026-11-20.pdf",
    documentDate: "2026-11-20",
    facility: "Metropolis Healthcare & Diagnostic Center, Hyderabad",
    clinician: "Dr. K. Srinivas Rao, MD (Internal Medicine)",
    patient: {
      id: "P-88421",
      name: "S. V. Sharma (Demo Patient)",
      age: 48,
      gender: "Male",
      mockAbhaId: "91-4821-9034-7102 (DEMO / MOCK)"
    },
    rawText: `METROPOLIS HEALTHCARE & DIAGNOSTIC CENTER
Plot 42, Road No. 3, Banjara Hills, Hyderabad - 500034
NABH & NABL ACCREDITED LABORATORY

PATIENT INFORMATION:
Patient Name: S. V. Sharma (Demo)    Age/Gender: 48 Y / Male
Ref By: Dr. K. Srinivas Rao, MD      Sample Collected: 20-Nov-2026 07:45 AM
Lab ID: MET-HYD-2026-94302           Report Released:  20-Nov-2026 03:00 PM

FOLLOW-UP 3-MONTH BIOCHEMISTRY PANEL

TEST NAME                          RESULT      UNIT        REFERENCE INTERVAL
---------------------------------------------------------------------------------
Fasting Blood Sugar (Glucose)       108 *      mg/dL       70.0 - 99.0
Post Prandial Blood Sugar (PPBS)   146 *      mg/dL       70.0 - 139.0
Glycated Hemoglobin (HbA1c)        6.6 *      %           4.0 - 5.6
Total Cholesterol                  182        mg/dL       < 200.0
Triglycerides                      158 *      mg/dL       < 150.0
HDL Cholesterol (Good)             44         mg/dL       40.0 - 60.0
LDL Cholesterol (Calculated)       106 *      mg/dL       < 100.0
Serum Creatinine                   0.88       mg/dL       0.70 - 1.20

NOTE: Marked values indicate findings relative to stated laboratory interval.
Trend comparison compatible with earlier panel MET-HYD-2026-88421.`,
    processingStatus: "verified",
    extractedFields: [
      {
        id: "ef-301",
        fieldType: "Observation",
        testName: "Fasting Blood Sugar",
        testCode: "1558-6",
        value: "108",
        unit: "mg/dL",
        referenceLow: 70.0,
        referenceHigh: 99.0,
        referenceRangeText: "70.0 - 99.0 mg/dL",
        interpretation: "Slightly Above Reference Interval",
        status: "high",
        sourceText: "Fasting Blood Sugar (Glucose) 108 * mg/dL 70.0 - 99.0",
        confidence: 0.99,
        userVerified: true,
        pageNumber: 1
      },
      {
        id: "ef-302",
        fieldType: "Observation",
        testName: "Post Prandial Blood Sugar (PPBS)",
        testCode: "14771-0",
        value: "146",
        unit: "mg/dL",
        referenceLow: 70.0,
        referenceHigh: 139.0,
        referenceRangeText: "70.0 - 139.0 mg/dL",
        interpretation: "Slightly Above Reference Interval",
        status: "high",
        sourceText: "Post Prandial Blood Sugar (PPBS) 146 * mg/dL 70.0 - 139.0",
        confidence: 0.98,
        userVerified: true,
        pageNumber: 1
      },
      {
        id: "ef-303",
        fieldType: "Observation",
        testName: "Glycated Hemoglobin (HbA1c)",
        testCode: "4548-4",
        value: "6.6",
        unit: "%",
        referenceLow: 4.0,
        referenceHigh: 5.6,
        referenceRangeText: "4.0 - 5.6 %",
        interpretation: "Above Reference Interval",
        status: "high",
        sourceText: "Glycated Hemoglobin (HbA1c) 6.6 * % 4.0 - 5.6",
        confidence: 0.99,
        userVerified: true,
        pageNumber: 1
      },
      {
        id: "ef-304",
        fieldType: "Observation",
        testName: "Total Cholesterol",
        testCode: "2093-3",
        value: "182",
        unit: "mg/dL",
        referenceLow: null,
        referenceHigh: 200.0,
        referenceRangeText: "< 200.0 mg/dL",
        interpretation: "Within Stated Range",
        status: "normal",
        sourceText: "Total Cholesterol 182 mg/dL < 200.0",
        confidence: 0.97,
        userVerified: true,
        pageNumber: 1
      },
      {
        id: "ef-305",
        fieldType: "Observation",
        testName: "HDL Cholesterol",
        testCode: "2085-9",
        value: "44",
        unit: "mg/dL",
        referenceLow: 40.0,
        referenceHigh: 60.0,
        referenceRangeText: "40.0 - 60.0 mg/dL",
        interpretation: "Within Stated Range",
        status: "normal",
        sourceText: "HDL Cholesterol (Good) 44 mg/dL 40.0 - 60.0",
        confidence: 0.96,
        userVerified: true,
        pageNumber: 1
      }
    ],
    summaryEn: {
      headline: "3-Month Follow-Up Lab Results Summary",
      plainLanguage: "This 3-month follow-up report from Metropolis Healthcare dated November 20, 2026 shows progress compared to the August 15 panel. Fasting Blood Sugar is reported at 108 mg/dL (decreased from 138 mg/dL in August, still slightly above the 70-99 mg/dL reference limit) and HbA1c is reported at 6.6% (decreased from 7.4% in August). Total Cholesterol (182 mg/dL) and HDL Good Cholesterol (44 mg/dL) are now within the laboratory's printed normal ranges.",
      safetyNote: "Clinical Notice: Trend changes should be reviewed by your prescribing physician. Do not stop or alter prescribed medications based solely on laboratory values without consulting your clinician.",
      doctorQuestions: [
        "Given the downward trend in HbA1c (7.4% down to 6.6%) and Total Cholesterol (224 to 182 mg/dL), should my current care plan continue unchanged?",
        "Do you recommend continuing the current dosage of Metformin and Atorvastatin?"
      ],
      factsExtractedCount: 5,
      uncertainCount: 0
    },
    summaryTe: {
      headline: "3-నెలల ఫాలో-అప్ ల్యాబ్ సారాంశం (Follow-up Summary)",
      plainLanguage: "నవంబర్ 20, 2026 నాటి ఈ ఫాలో-అప్ నివేదిక ఆగస్టు నెల నివేదికతో పోలిస్తే గణనీయమైన మార్పును సూచిస్తోంది. ఖాళీ కడుపు చక్కెర స్థాయి (Fasting Glucose) 138 నుండి 108 mg/dL కి తగ్గింది (ఇప్పటికీ 99 mg/dL సాధారణ పరిమితి కంటే కాస్త ఎక్కువ). HbA1c స్థాయి 7.4% నుండి 6.6% కి తగ్గింది. మొత్తం కొలెస్ట్రాల్ (182 mg/dL) మరియు HDL మంచి కొలెస్ట్రాల్ (44 mg/dL) ఇప్పుడు ఆ ల్యాబ్ సాధారణ పరిమితిలోనే ఉన్నాయి.",
      safetyNote: "క్లినికల్ నోటీసు: మార్పులను మీ వైద్యులకు చూపించండి. వారి అనుమతి లేకుండా మందులు మార్చడం గానీ ఆపడం గానీ చేయవద్దు.",
      doctorQuestions: [
        "షుగర్ మరియు కొలెస్ట్రాల్ స్థాయిలు మెరుగుపడినందున ప్రస్తుత ఔషధ ప్రణాళికను ఇలాగే కొనసాగించవచ్చా?",
        "తదుపరి పరీక్షలు ఎప్పుడు చేయించుకోవాలి?"
      ],
      factsExtractedCount: 5,
      uncertainCount: 0
    }
  }
];

// Presets for demo testing uploads
const DEMO_UPLOAD_PRESETS = {
  prescription_scanned: {
    fileName: "Dr_Patel_Prescription_Handwritten_Notes.jpg",
    documentType: "Prescription",
    documentDate: "2026-10-02",
    facility: "Care Clinics, Somajiguda, Hyderabad",
    clinician: "Dr. R. Patel, MD (Cardiologist)",
    rawText: `CARE CLINICS - CARDIOLOGY
Patient: Demo Patient | Date: 02-Oct-2026

Rx:
1. Ecosprin 75mg - OD after lunch x 30 days
2. Metoprolol 25mg - BD x 30 days
3. [Needs Verification: Handwriting unclear: ~Rosuvastatin? 10mg / 20mg?] - Bedtime
4. BP today: 132/84 mmHg

Review in 4 weeks.`,
    extractedFields: [
      {
        id: "up-1",
        fieldType: "Medication",
        medicineName: "Ecosprin",
        dosage: "75 mg",
        route: "Oral",
        frequency: "Once daily after lunch (OD)",
        duration: "30 days",
        confidence: 0.96,
        userVerified: true,
        sourceText: "Ecosprin 75mg - OD after lunch x 30 days"
      },
      {
        id: "up-2",
        fieldType: "Medication",
        medicineName: "Metoprolol",
        dosage: "25 mg",
        route: "Oral",
        frequency: "Twice daily (BD)",
        duration: "30 days",
        confidence: 0.94,
        userVerified: true,
        sourceText: "Metoprolol 25mg - BD x 30 days"
      },
      {
        id: "up-3",
        fieldType: "Medication",
        medicineName: "Rosuvastatin [Uncertain Dosage]",
        dosage: "10 mg or 20 mg? (Unclear handwriting)",
        route: "Oral",
        frequency: "Bedtime",
        duration: "30 days",
        confidence: 0.42, // LOW CONFIDENCE -> Needs verification!
        userVerified: false,
        needsVerification: true,
        sourceText: "[Handwriting unclear: ~Rosuvastatin? 10mg / 20mg?] - Bedtime"
      },
      {
        id: "up-4",
        fieldType: "Observation",
        testName: "Blood Pressure",
        testCode: "85354-9",
        value: "132/84",
        unit: "mmHg",
        referenceLow: null,
        referenceHigh: null,
        referenceRangeText: "< 120/80 mmHg (AHA reference guideline)",
        interpretation: "Above Standard Guideline",
        status: "high",
        confidence: 0.91,
        userVerified: true,
        sourceText: "BP today: 132/84 mmHg"
      }
    ],
    summaryEn: {
      headline: "Prescription with Flagged Handwritten Field",
      plainLanguage: "This outpatient prescription from Care Clinics dated October 2, 2026 notes two clear medications: Ecosprin 75mg (once daily after lunch) and Metoprolol 25mg (twice daily). A third handwritten medication appears to indicate a statin (possibly Rosuvastatin), but the exact dosage (10mg vs 20mg) is ambiguous in the source handwriting and has been marked 'Needs verification'. A clinic blood pressure reading of 132/84 mmHg is noted.",
      safetyNote: "CRITICAL SAFETY RULE: Never guess unclear handwriting or dosages. Please verify the third medication directly with your prescribing clinician or dispensing pharmacist before taking it.",
      doctorQuestions: [
        "Could you please confirm the exact name and dosage of the bedtime statin medication?",
        "Are there specific symptoms I should watch for while taking Metoprolol?"
      ],
      factsExtractedCount: 3,
      uncertainCount: 1
    },
    summaryTe: {
      headline: "ధృవీకరణ అవసరమైన ప్రిస్క్రిప్షన్ సారాంశం",
      plainLanguage: "కేర్ క్లినిక్స్ నుండి అక్టోబర్ 2, 2026 నాటి ప్రిస్క్రిప్షన్. ఇందులో ఈకోస్ప్రిన్ (Ecosprin 75mg) మరియు మెటోప్రొలాల్ (Metoprolol 25mg) స్పష్టంగా ఉన్నాయి. అయితే మూడవ ఔషధం (రోసువాస్టాటిన్ అనుమానం) యొక్క మోతాదు చేతిరాత స్పష్టంగా లేనందున 'ధృవీకరణ అవసరం (Needs Verification)' గా గుర్తించబడింది. రక్తపోటు 132/84 mmHg గా నమోదైంది.",
      safetyNote: "ముఖ్య హెచ్చరిక: అస్పష్టమైన చేతిరాతను సొంతంగా ఊహించకూడదు. దయచేసి డాక్టర్ లేదా ఫార్మసిస్ట్‌ను సంప్రదించి సరైన మోతాదును మాత్రమే నిర్ధారించుకోండి.",
      doctorQuestions: [
        "రాత్రి పూట వేసుకోవలసిన ఔషధం మరియు మోతాదును దయచేసి స్పష్టం చేయగలరా?",
        "మెటోప్రొలాల్ వాడుతున్నప్పుడు ఏవైనా జాగ్రత్తలు పాటించాలా?"
      ],
      factsExtractedCount: 3,
      uncertainCount: 1
    }
  }
};
