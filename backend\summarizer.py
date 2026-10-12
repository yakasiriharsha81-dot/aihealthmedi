"""
MediMate AI - Grounded Clinical Summarizer Engine
Produces factual plain-language summaries strictly grounded in extracted medical text.
Supports English and Telugu with deterministic fallbacks.
"""

from typing import Dict, Any, List


class ClinicalSummarizer:
    def __init__(self, api_key: str = None):
        self.api_key = api_key

    def generate_summary(self, doc_data: Dict[str, Any], language: str = "en") -> Dict[str, Any]:
        """
        Generate grounded clinical summary based ONLY on verified extracted facts.
        """
        fields = doc_data.get("extractedFields", [])
        doc_type = doc_data.get("documentType", "Medical Document")
        facility = doc_data.get("facility", "Healthcare Facility")
        doc_date = doc_data.get("documentDate", "Recent Date")

        obs_items = [f for f in fields if f.get("fieldType") == "Observation"]
        med_items = [f for f in fields if f.get("fieldType") == "Medication"]
        uncertain_items = [f for f in fields if f.get("needsVerification") or not f.get("userVerified")]

        if language == "te":
            return self._generate_telugu_summary(doc_type, facility, doc_date, obs_items, med_items, uncertain_items)
        return self._generate_english_summary(doc_type, facility, doc_date, obs_items, med_items, uncertain_items)

    def _generate_english_summary(self, doc_type, facility, doc_date, obs_items, med_items, uncertain_items) -> Dict[str, Any]:
        lines = [f"This {doc_type.lower()} from {facility} is dated {doc_date}."]

        if obs_items:
            obs_details = []
            for obs in obs_items:
                name = obs.get("testName", "Test")
                val = obs.get("value", "")
                unit = obs.get("unit", "")
                ref = obs.get("referenceRangeText", "")
                interp = obs.get("interpretation", "")
                obs_details.append(f"{name} ({val} {unit}, printed reference: {ref}) reported as {interp.lower() or 'noted'}")
            lines.append("Laboratory Observations: " + "; ".join(obs_details) + ".")

        if med_items:
            med_details = []
            for m in med_items:
                med_name = m.get("medicineName", "Medicine")
                dosage = m.get("dosage", "")
                freq = m.get("frequency", "")
                med_details.append(f"{med_name} {dosage} ({freq})")
            lines.append("Prescribed Medications: " + ", ".join(med_details) + ".")

        if uncertain_items:
            lines.append(f"Notice: {len(uncertain_items)} field(s) have been flagged as 'Needs Verification' due to ambiguous handwriting or low optical confidence. Please verify these against your source document.")

        plain_language = " ".join(lines)

        doctor_questions = [
            "What do these findings mean in the context of my overall medical history and symptoms?",
            "Are there lifestyle or dietary changes you recommend based on these results?",
            "When should follow-up diagnostic tests or consultations be scheduled?"
        ]

        if med_items:
            doctor_questions.append("Can you confirm the exact timing and duration for the prescribed medications?")

        return {
            "headline": f"{doc_type} Plain-Language Summary",
            "plainLanguage": plain_language,
            "safetyNote": "Important Medical Notice: MediMate AI provides informational summaries only. Reference intervals vary across laboratories. A test result alone does not establish a diagnosis. Always consult your qualified healthcare provider.",
            "doctorQuestions": doctor_questions,
            "factsExtractedCount": len(obs_items) + len(med_items),
            "uncertainCount": len(uncertain_items)
        }

    def _generate_telugu_summary(self, doc_type, facility, doc_date, obs_items, med_items, uncertain_items) -> Dict[str, Any]:
        lines = [f"ఈ పత్రం {facility} నుండి {doc_date} నాటి {doc_type}."]

        if obs_items:
            obs_details = []
            for obs in obs_items:
                name = obs.get("testName", "పరీక్ష")
                val = obs.get("value", "")
                unit = obs.get("unit", "")
                interp = obs.get("interpretation", "")
                obs_details.append(f"{name} ({val} {unit}) - {interp}")
            lines.append("ల్యాబ్ ఫలితాలు: " + "; ".join(obs_details) + ".")

        if med_items:
            med_details = []
            for m in med_items:
                med_name = m.get("medicineName", "మందు")
                dosage = m.get("dosage", "")
                freq = m.get("frequency", "")
                med_details.append(f"{med_name} {dosage} ({freq})")
            lines.append("సూచించిన మందులు: " + ", ".join(med_details) + ".")

        if uncertain_items:
            lines.append("గమనిక: కొన్ని వివరాలు చేతిరాత అస్పష్టత వల్ల ధృవీకరణ అవసరం (Needs Verification) గా గుర్తించబడ్డాయి.")

        plain_language = " ".join(lines)

        return {
            "headline": f"{doc_type} సారాంశం (Plain-Language Summary)",
            "plainLanguage": plain_language,
            "safetyNote": "ముఖ్య గమనిక: మెడిమేట్ ఎఐ వ్యాధి నిర్ధారణ చేయదు లేదా మందులను మార్చదు. ఎల్లప్పుడూ మీ వైద్యులను సంప్రదించి నిర్ణయాలు తీసుకోండి.",
            "doctorQuestions": [
                "ఈ పరీక్ష ఫలితాల ఆధారంగా జీవనశైలిలో ఎలాంటి మార్పులు అవసరం?",
                "సూచించిన మందులను ఏ సమయాల్లో మరియు ఎన్ని రోజుల పాటు వాడాలి?",
                "తదుపరి పరీక్షలను ఎప్పుడు చేయించుకోవాలి?"
            ],
            "factsExtractedCount": len(obs_items) + len(med_items),
            "uncertainCount": len(uncertain_items)
        }
