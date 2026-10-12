// MediMate AI - ABDM / FHIR R4-Inspired Resource Generator & Provenance Tracker
// Note: This module implements a FHIR R4 & Ayushman Bharat Digital Mission (ABDM) inspired
// resource structure. Mock ABHA IDs and resources are for demonstration and hackathon readiness.

const FHIR_SYSTEMS = {
  ABHA: "https://healthid.ndhm.gov.in",
  LOINC: "http://loinc.org",
  SNOMED_CT: "http://snomed.info/sct",
  RXNORM: "http://www.nlm.nih.gov/research/umls/rxnorm",
  UCUM: "http://unitsofmeasure.org",
  MEDIMATE_PROVENANCE: "https://medimate.ai/fhir/provenance"
};

/**
 * Generate FHIR R4 Patient Resource with Demo ABHA ID
 */
function createFhirPatient(patientData = {}) {
  const patientId = patientData.id || "pat-" + Math.random().toString(36).substring(2, 9);
  return {
    resourceType: "Patient",
    id: patientId,
    meta: {
      profile: [
        "https://nrces.in/ndhm/fhir/r4/StructureDefinition/Patient"
      ],
      lastUpdated: new Date().toISOString()
    },
    identifier: [
      {
        type: {
          coding: [
            {
              system: "http://terminology.hl7.org/CodeSystem/v2-0203",
              code: "MR",
              display: "Medical Record Number"
            }
          ]
        },
        system: "https://medimate.ai/patient-id",
        value: patientId
      },
      {
        type: {
          coding: [
            {
              system: "https://nrces.in/ndhm/fhir/r4/StructureDefinition/IdentifierType",
              code: "ABHA",
              display: "Ayushman Bharat Health Account (Mock / Demo)"
            }
          ]
        },
        system: FHIR_SYSTEMS.ABHA,
        value: patientData.mockAbhaId || "91-4821-9034-7102 (DEMO / MOCK)",
        use: "temp"
      }
    ],
    name: [
      {
        use: "official",
        text: patientData.name || "Demo Patient (De-identified)"
      }
    ],
    gender: (patientData.gender || "other").toLowerCase(),
    birthDate: patientData.birthDate || "1978-05-12",
    active: true
  };
}

/**
 * Generate FHIR R4 DocumentReference Resource
 */
function createFhirDocumentReference(docData, patientId) {
  return {
    resourceType: "DocumentReference",
    id: "docref-" + (docData.id || Math.random().toString(36).substring(2, 9)),
    status: "current",
    docStatus: docData.processingStatus === "verified" ? "final" : "preliminary",
    type: {
      coding: [
        {
          system: "http://loinc.org",
          code: docData.documentType === "Prescription" ? "57833-6" : "11502-2",
          display: docData.documentType || "Health Record Document"
        }
      ],
      text: docData.documentType
    },
    subject: {
      reference: `Patient/${patientId}`
    },
    date: docData.documentDate ? new Date(docData.documentDate).toISOString() : new Date().toISOString(),
    author: [
      {
        display: docData.clinician || docData.facility || "Healthcare Provider"
      }
    ],
    content: [
      {
        attachment: {
          contentType: docData.fileName?.endsWith(".pdf") ? "application/pdf" : "image/jpeg",
          title: docData.fileName || "Uploaded Health Document",
          creation: new Date().toISOString()
        }
      }
    ]
  };
}

/**
 * Generate FHIR R4 Observation Resource for a Lab Test
 */
function createFhirObservation(field, patientId, docRefId) {
  const obsId = "obs-" + (field.id || Math.random().toString(36).substring(2, 9));
  const numericVal = parseFloat(field.value);

  const observation = {
    resourceType: "Observation",
    id: obsId,
    meta: {
      profile: [
        "https://nrces.in/ndhm/fhir/r4/StructureDefinition/Observation"
      ]
    },
    status: field.userVerified ? "final" : "preliminary",
    category: [
      {
        coding: [
          {
            system: "http://terminology.hl7.org/CodeSystem/observation-category",
            code: "laboratory",
            display: "Laboratory"
          }
        ]
      }
    ],
    code: {
      coding: [
        {
          system: FHIR_SYSTEMS.LOINC,
          code: field.testCode || "UNK-CODE",
          display: field.testName || "Clinical Test"
        }
      ],
      text: field.testName
    },
    subject: {
      reference: `Patient/${patientId}`
    },
    derivedFrom: [
      {
        reference: `DocumentReference/${docRefId}`
      }
    ],
    valueQuantity: !isNaN(numericVal) ? {
      value: numericVal,
      unit: field.unit || "",
      system: FHIR_SYSTEMS.UCUM,
      code: field.unit || ""
    } : undefined,
    valueString: isNaN(numericVal) ? String(field.value) : undefined,
    referenceRange: (field.referenceLow !== null || field.referenceHigh !== null) ? [
      {
        low: field.referenceLow !== null ? { value: field.referenceLow, unit: field.unit } : undefined,
        high: field.referenceHigh !== null ? { value: field.referenceHigh, unit: field.unit } : undefined,
        text: field.referenceRangeText || ""
      }
    ] : undefined,
    interpretation: field.interpretation ? [
      {
        text: field.interpretation
      }
    ] : undefined,
    extension: [
      {
        url: `${FHIR_SYSTEMS.MEDIMATE_PROVENANCE}/extraction-confidence`,
        valueDecimal: field.confidence || 0.95
      },
      {
        url: `${FHIR_SYSTEMS.MEDIMATE_PROVENANCE}/user-verified`,
        valueBoolean: Boolean(field.userVerified)
      },
      {
        url: `${FHIR_SYSTEMS.MEDIMATE_PROVENANCE}/source-text`,
        valueString: field.sourceText || ""
      }
    ]
  };

  return observation;
}

/**
 * Generate FHIR R4 MedicationStatement Resource
 */
function createFhirMedicationStatement(field, patientId, docRefId) {
  const medId = "med-" + (field.id || Math.random().toString(36).substring(2, 9));
  return {
    resourceType: "MedicationStatement",
    id: medId,
    meta: {
      profile: [
        "https://nrces.in/ndhm/fhir/r4/StructureDefinition/MedicationStatement"
      ]
    },
    status: "active",
    medicationCodeableConcept: {
      coding: [
        {
          system: FHIR_SYSTEMS.RXNORM,
          display: field.medicineName || "Prescribed Medication"
        }
      ],
      text: field.medicineName
    },
    subject: {
      reference: `Patient/${patientId}`
    },
    derivedFrom: [
      {
        reference: `DocumentReference/${docRefId}`
      }
    ],
    dosage: [
      {
        text: `${field.dosage || ""} - ${field.frequency || ""} - ${field.duration || ""}`.trim(),
        route: field.route ? { text: field.route } : undefined,
        patientInstruction: field.instructions || undefined
      }
    ],
    extension: [
      {
        url: `${FHIR_SYSTEMS.MEDIMATE_PROVENANCE}/needs-verification`,
        valueBoolean: Boolean(field.needsVerification)
      },
      {
        url: `${FHIR_SYSTEMS.MEDIMATE_PROVENANCE}/confidence`,
        valueDecimal: field.confidence || 0.9
      },
      {
        url: `${FHIR_SYSTEMS.MEDIMATE_PROVENANCE}/source-text`,
        valueString: field.sourceText || ""
      }
    ]
  };
}

/**
 * Generate a Complete FHIR R4 Bundle with Provenance Record
 */
function generateDocumentFhirBundle(doc) {
  const patient = createFhirPatient(doc.patient);
  const docRef = createFhirDocumentReference(doc, patient.id);
  const bundleEntries = [
    { fullUrl: `urn:uuid:${patient.id}`, resource: patient },
    { fullUrl: `urn:uuid:${docRef.id}`, resource: docRef }
  ];

  const extracted = doc.extractedFields || [];
  extracted.forEach(field => {
    if (field.fieldType === "Observation") {
      const obs = createFhirObservation(field, patient.id, docRef.id);
      bundleEntries.push({ fullUrl: `urn:uuid:${obs.id}`, resource: obs });
    } else if (field.fieldType === "Medication") {
      const med = createFhirMedicationStatement(field, patient.id, docRef.id);
      bundleEntries.push({ fullUrl: `urn:uuid:${med.id}`, resource: med });
    }
  });

  // FHIR Provenance Resource
  const provenance = {
    resourceType: "Provenance",
    id: "prov-" + (doc.id || Math.random().toString(36).substring(2, 9)),
    target: [
      { reference: `DocumentReference/${docRef.id}` }
    ],
    recorded: new Date().toISOString(),
    activity: {
      coding: [
        {
          system: "http://terminology.hl7.org/CodeSystem/v3-DataOperation",
          code: "CREATE",
          display: "Extraction and Clinical Verification"
        }
      ]
    },
    agent: [
      {
        type: {
          coding: [
            {
              system: "http://terminology.hl7.org/CodeSystem/provenance-participant-type",
              code: "author",
              display: "MediMate AI Pipeline & User Reviewer"
            }
          ]
        },
        who: {
          display: "MediMate AI Copilot (Client-Side OCR + Clinician Review)"
        }
      }
    ],
    entity: [
      {
        role: "source",
        what: {
          display: `Original File: ${doc.fileName || "unknown"}`
        }
      }
    ]
  };

  bundleEntries.push({ fullUrl: `urn:uuid:${provenance.id}`, resource: provenance });

  return {
    resourceType: "Bundle",
    id: "bundle-" + (doc.id || Math.random().toString(36).substring(2, 9)),
    type: "document",
    timestamp: new Date().toISOString(),
    entry: bundleEntries,
    meta: {
      tag: [
        {
          system: "https://medimate.ai/tags",
          code: "abdm-mock-readiness",
          display: "ABDM / FHIR-Inspired Structure (Hackathon Demonstration)"
        }
      ]
    }
  };
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    FHIR_SYSTEMS,
    createFhirPatient,
    createFhirDocumentReference,
    createFhirObservation,
    createFhirMedicationStatement,
    generateDocumentFhirBundle
  };
}
