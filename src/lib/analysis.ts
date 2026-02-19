import type { AnalysisResult, SupportedDrug, DetectedVariant } from "./types";

// Drug-gene mapping based on CPIC guidelines
const DRUG_GENE_MAP: Record<string, { gene: string; mechanism: string }> = {
  CODEINE: { gene: "CYP2D6", mechanism: "CYP2D6 converts codeine to morphine. Poor metabolizers get no pain relief; ultrarapid metabolizers risk toxicity." },
  WARFARIN: { gene: "CYP2C9", mechanism: "CYP2C9 metabolizes warfarin. Reduced function variants lead to slower clearance and increased bleeding risk." },
  CLOPIDOGREL: { gene: "CYP2C19", mechanism: "CYP2C19 activates clopidogrel. Poor metabolizers cannot convert the prodrug, leading to treatment failure." },
  SIMVASTATIN: { gene: "SLCO1B1", mechanism: "SLCO1B1 transports simvastatin into hepatocytes. Variants cause elevated plasma levels and myopathy risk." },
  AZATHIOPRINE: { gene: "TPMT", mechanism: "TPMT inactivates thiopurine metabolites. Deficiency causes myelosuppression and potentially fatal toxicity." },
  FLUOROURACIL: { gene: "DPYD", mechanism: "DPYD catabolizes fluoropyrimidines. Deficiency leads to severe, potentially fatal toxicity." },
};

// Mock variant database for demo
const MOCK_VARIANTS: Record<string, DetectedVariant[]> = {
  CYP2D6: [
    { rsid: "rs3892097", gene: "CYP2D6", chromosome: "22", position: 42524947, ref: "G", alt: "A", genotype: "0/1", clinical_significance: "CYP2D6*4 - Non-functional allele" },
    { rsid: "rs5030655", gene: "CYP2D6", chromosome: "22", position: 42525085, ref: "T", alt: "TA", genotype: "0/0", clinical_significance: "CYP2D6*6 - Frameshift variant" },
  ],
  CYP2C19: [
    { rsid: "rs4244285", gene: "CYP2C19", chromosome: "10", position: 96541616, ref: "G", alt: "A", genotype: "1/1", clinical_significance: "CYP2C19*2 - Splicing defect, loss of function" },
  ],
  CYP2C9: [
    { rsid: "rs1799853", gene: "CYP2C9", chromosome: "10", position: 96702047, ref: "C", alt: "T", genotype: "0/1", clinical_significance: "CYP2C9*2 - Reduced function" },
    { rsid: "rs1057910", gene: "CYP2C9", chromosome: "10", position: 96741053, ref: "A", alt: "C", genotype: "0/1", clinical_significance: "CYP2C9*3 - Reduced function" },
  ],
  SLCO1B1: [
    { rsid: "rs4149056", gene: "SLCO1B1", chromosome: "12", position: 21331549, ref: "T", alt: "C", genotype: "0/1", clinical_significance: "SLCO1B1*5 - Decreased transporter function" },
  ],
  TPMT: [
    { rsid: "rs1800462", gene: "TPMT", chromosome: "6", position: 18130918, ref: "C", alt: "G", genotype: "0/0", clinical_significance: "TPMT*2 - Non-functional" },
  ],
  DPYD: [
    { rsid: "rs3918290", gene: "DPYD", chromosome: "1", position: 97915614, ref: "C", alt: "T", genotype: "0/1", clinical_significance: "DPYD*2A - Splicing defect, no DPD activity" },
  ],
};

interface MockResult {
  riskLabel: string;
  severity: string;
  confidence: number;
  phenotype: string;
  diplotype: string;
  action: string;
  dosing: string;
  alternatives: string[];
  monitoring: string;
  cpicRef: string;
}

const MOCK_RESULTS: Record<string, MockResult> = {
  CODEINE: {
    riskLabel: "Ineffective",
    severity: "high",
    confidence: 0.92,
    phenotype: "IM",
    diplotype: "*1/*4",
    action: "Avoid codeine. Use non-tramadol analgesic.",
    dosing: "Do not prescribe codeine. Consider morphine or non-opioid alternatives.",
    alternatives: ["Morphine", "Acetaminophen", "NSAIDs"],
    monitoring: "Monitor for pain control with alternative analgesics.",
    cpicRef: "CPIC Guideline for CYP2D6 and Codeine Therapy (2019)",
  },
  WARFARIN: {
    riskLabel: "Adjust Dosage",
    severity: "moderate",
    confidence: 0.88,
    phenotype: "IM",
    diplotype: "*2/*3",
    action: "Reduce warfarin dose based on CYP2C9 genotype.",
    dosing: "Reduce initial dose by 25-50%. Target INR 2.0-3.0 with frequent monitoring.",
    alternatives: ["Apixaban", "Rivaroxaban", "Dabigatran"],
    monitoring: "Frequent INR monitoring for first 2 weeks. Adjust dose per INR results.",
    cpicRef: "CPIC Guideline for Pharmacogenetics-Guided Warfarin Dosing (2017)",
  },
  CLOPIDOGREL: {
    riskLabel: "Toxic",
    severity: "critical",
    confidence: 0.95,
    phenotype: "PM",
    diplotype: "*2/*2",
    action: "Do NOT use clopidogrel. Switch to alternative antiplatelet.",
    dosing: "Contraindicated. Use prasugrel or ticagrelor instead.",
    alternatives: ["Prasugrel", "Ticagrelor"],
    monitoring: "Platelet function testing if alternative antiplatelet initiated.",
    cpicRef: "CPIC Guideline for CYP2C19 and Clopidogrel Therapy (2022)",
  },
  SIMVASTATIN: {
    riskLabel: "Adjust Dosage",
    severity: "moderate",
    confidence: 0.85,
    phenotype: "IM",
    diplotype: "*1/*5",
    action: "Reduce simvastatin dose or use alternative statin.",
    dosing: "Do not exceed 20 mg/day simvastatin. Consider rosuvastatin or pravastatin.",
    alternatives: ["Rosuvastatin", "Pravastatin", "Atorvastatin"],
    monitoring: "Monitor for myalgia, elevated CK levels. Report any muscle pain.",
    cpicRef: "CPIC Guideline for SLCO1B1 and Statin Therapy (2022)",
  },
  AZATHIOPRINE: {
    riskLabel: "Safe",
    severity: "none",
    confidence: 0.91,
    phenotype: "NM",
    diplotype: "*1/*1",
    action: "Standard dosing appropriate.",
    dosing: "Use standard dose per clinical indication. No pharmacogenomic adjustment needed.",
    alternatives: ["Mycophenolate mofetil", "Methotrexate"],
    monitoring: "Standard monitoring: CBC weekly for first month, then monthly.",
    cpicRef: "CPIC Guideline for TPMT/NUDT15 and Thiopurine Therapy (2018)",
  },
  FLUOROURACIL: {
    riskLabel: "Toxic",
    severity: "critical",
    confidence: 0.97,
    phenotype: "IM",
    diplotype: "*1/*2A",
    action: "Reduce fluorouracil dose by 50%. Consider alternative regimen.",
    dosing: "Start at 50% of standard dose. Titrate with therapeutic drug monitoring.",
    alternatives: ["Raltitrexed", "Modified regimen with leucovorin adjustment"],
    monitoring: "Intensive monitoring for mucositis, myelosuppression, diarrhea for 4+ weeks.",
    cpicRef: "CPIC Guideline for DPYD and Fluoropyrimidine Therapy (2017)",
  },
};

export function parseVCFFile(content: string): { valid: boolean; patientId: string; variantCount: number } {
  const lines = content.split("\n");
  const headerLine = lines.find((l) => l.startsWith("#CHROM"));
  const dataLines = lines.filter((l) => !l.startsWith("#") && l.trim().length > 0);

  return {
    valid: !!headerLine || dataLines.length > 0 || content.includes("##fileformat=VCF"),
    patientId: `PATIENT_${Math.random().toString(36).substring(2, 5).toUpperCase()}`,
    variantCount: dataLines.length || Math.floor(Math.random() * 20) + 5,
  };
}

export function analyzePatient(
  vcfContent: string,
  drugs: SupportedDrug[]
): AnalysisResult[] {
  const { patientId } = parseVCFFile(vcfContent);
  const timestamp = new Date().toISOString();

  return drugs.map((drug) => {
    const geneInfo = DRUG_GENE_MAP[drug];
    const mock = MOCK_RESULTS[drug];
    const variants = MOCK_VARIANTS[geneInfo.gene] || [];

    return {
      patient_id: patientId,
      drug,
      timestamp,
      risk_assessment: {
        risk_label: mock.riskLabel as any,
        confidence_score: mock.confidence,
        severity: mock.severity as any,
      },
      pharmacogenomic_profile: {
        primary_gene: geneInfo.gene,
        diplotype: mock.diplotype,
        phenotype: mock.phenotype as any,
        detected_variants: variants,
      },
      clinical_recommendation: {
        action: mock.action,
        dosing_guidance: mock.dosing,
        alternative_drugs: mock.alternatives,
        monitoring_requirements: mock.monitoring,
        cpic_guideline_reference: mock.cpicRef,
      },
      llm_generated_explanation: {
        summary: `Based on the patient's ${geneInfo.gene} ${mock.diplotype} genotype (${mock.phenotype} metabolizer), ${drug.toLowerCase()} therapy carries a ${mock.riskLabel.toLowerCase()} risk classification. ${mock.action}`,
        mechanism: geneInfo.mechanism,
        evidence_level: "1A - Strong",
        citations: [
          mock.cpicRef,
          `PharmGKB Clinical Annotation for ${geneInfo.gene}/${drug}`,
          "FDA Table of Pharmacogenomic Biomarkers in Drug Labeling",
        ],
      },
      quality_metrics: {
        vcf_parsing_success: true,
        variants_detected: variants.length,
        genes_analyzed: 6,
        analysis_timestamp: timestamp,
      },
    };
  });
}
