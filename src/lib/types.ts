export type RiskLabel = "Safe" | "Adjust Dosage" | "Toxic" | "Ineffective" | "Unknown";
export type Severity = "none" | "low" | "moderate" | "high" | "critical";
export type Phenotype = "PM" | "IM" | "NM" | "RM" | "URM" | "Unknown";

export const SUPPORTED_DRUGS = [
  "CODEINE",
  "WARFARIN",
  "CLOPIDOGREL",
  "SIMVASTATIN",
  "AZATHIOPRINE",
  "FLUOROURACIL",
] as const;

export type SupportedDrug = (typeof SUPPORTED_DRUGS)[number];

export const PHARMACOGENES = [
  "CYP2D6",
  "CYP2C19",
  "CYP2C9",
  "SLCO1B1",
  "TPMT",
  "DPYD",
] as const;

export interface DetectedVariant {
  rsid: string;
  gene: string;
  chromosome: string;
  position: number;
  ref: string;
  alt: string;
  genotype: string;
  clinical_significance: string;
}

export interface RiskAssessment {
  risk_label: RiskLabel;
  confidence_score: number;
  severity: Severity;
}

export interface PharmacogenomicProfile {
  primary_gene: string;
  diplotype: string;
  phenotype: Phenotype;
  detected_variants: DetectedVariant[];
}

export interface ClinicalRecommendation {
  action: string;
  dosing_guidance: string;
  alternative_drugs: string[];
  monitoring_requirements: string;
  cpic_guideline_reference: string;
}

export interface LLMExplanation {
  summary: string;
  mechanism: string;
  evidence_level: string;
  citations: string[];
}

export interface QualityMetrics {
  vcf_parsing_success: boolean;
  variants_detected: number;
  genes_analyzed: number;
  analysis_timestamp: string;
}

export interface AnalysisResult {
  patient_id: string;
  drug: string;
  timestamp: string;
  risk_assessment: RiskAssessment;
  pharmacogenomic_profile: PharmacogenomicProfile;
  clinical_recommendation: ClinicalRecommendation;
  llm_generated_explanation: LLMExplanation;
  quality_metrics: QualityMetrics;
}
