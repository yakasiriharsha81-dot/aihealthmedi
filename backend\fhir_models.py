"""
MediMate AI - FHIR R4 & ABDM-Inspired Pydantic Schemas
Defines structured entities for Patient, DocumentReference, Observation,
MedicationStatement, DiagnosticReport, and Provenance.
"""

from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field
from datetime import datetime


class Coding(BaseModel):
    system: Optional[str] = None
    code: Optional[str] = None
    display: Optional[str] = None


class CodeableConcept(BaseModel):
    coding: Optional[List[Coding]] = None
    text: Optional[str] = None


class Identifier(BaseModel):
    system: Optional[str] = None
    value: str
    use: Optional[str] = "usual"
    type: Optional[CodeableConcept] = None


class Reference(BaseModel):
    reference: str
    display: Optional[str] = None


class Quantity(BaseModel):
    value: float
    unit: str
    system: Optional[str] = "http://unitsofmeasure.org"
    code: Optional[str] = None


class ReferenceRange(BaseModel):
    low: Optional[Quantity] = None
    high: Optional[Quantity] = None
    text: Optional[str] = None


class PatientResource(BaseModel):
    resourceType: str = "Patient"
    id: str
    identifier: List[Identifier] = Field(default_factory=list)
    name: List[Dict[str, Any]] = Field(default_factory=list)
    gender: Optional[str] = "unknown"
    birthDate: Optional[str] = None
    active: bool = True


class ObservationResource(BaseModel):
    resourceType: str = "Observation"
    id: str
    status: str = "final"  # final | preliminary
    category: Optional[List[CodeableConcept]] = None
    code: CodeableConcept
    subject: Reference
    derivedFrom: Optional[List[Reference]] = None
    valueQuantity: Optional[Quantity] = None
    valueString: Optional[str] = None
    referenceRange: Optional[List[ReferenceRange]] = None
    interpretation: Optional[List[CodeableConcept]] = None
    extension: Optional[List[Dict[str, Any]]] = None


class MedicationStatementResource(BaseModel):
    resourceType: str = "MedicationStatement"
    id: str
    status: str = "active"
    medicationCodeableConcept: CodeableConcept
    subject: Reference
    dosage: Optional[List[Dict[str, Any]]] = None
    extension: Optional[List[Dict[str, Any]]] = None


class DocumentReferenceResource(BaseModel):
    resourceType: str = "DocumentReference"
    id: str
    status: str = "current"
    docStatus: str = "final"
    type: CodeableConcept
    subject: Reference
    date: str
    author: Optional[List[Reference]] = None


class ProvenanceResource(BaseModel):
    resourceType: str = "Provenance"
    id: str
    target: List[Reference]
    recorded: str = Field(default_factory=lambda: datetime.utcnow().isoformat() + "Z")
    activity: Optional[CodeableConcept] = None
    agent: List[Dict[str, Any]]
    entity: Optional[List[Dict[str, Any]]] = None


class BundleResource(BaseModel):
    resourceType: str = "Bundle"
    id: str
    type: str = "document"
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat() + "Z")
    entry: List[Dict[str, Any]]
