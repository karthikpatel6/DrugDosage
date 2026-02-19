import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, AlertTriangle, Skull, Ban, HelpCircle,
  ChevronDown, ChevronUp, Copy, Download, Check,
  FlaskConical, Dna, Stethoscope, BookOpen, Activity,
} from "lucide-react";
import type { AnalysisResult, RiskLabel } from "@/lib/types";

interface ResultsDisplayProps {
  results: AnalysisResult[];
}

const RISK_CONFIG: Record<
  RiskLabel,
  { icon: typeof Shield; gradient: string; textClass: string; bgClass: string; ring: string; glowColor: string }
> = {
  Safe: { icon: Shield, gradient: "gradient-risk-safe", textClass: "text-risk-safe", bgClass: "bg-risk-safe/10", ring: "ring-risk-safe/30", glowColor: "152 70% 45%" },
  "Adjust Dosage": { icon: AlertTriangle, gradient: "gradient-risk-adjust", textClass: "text-risk-adjust", bgClass: "bg-risk-adjust/10", ring: "ring-risk-adjust/30", glowColor: "38 95% 50%" },
  Toxic: { icon: Skull, gradient: "gradient-risk-toxic", textClass: "text-risk-toxic", bgClass: "bg-risk-toxic/10", ring: "ring-risk-toxic/30", glowColor: "0 80% 55%" },
  Ineffective: { icon: Ban, gradient: "gradient-risk-ineffective", textClass: "text-risk-ineffective", bgClass: "bg-risk-ineffective/10", ring: "ring-risk-ineffective/30", glowColor: "25 95% 53%" },
  Unknown: { icon: HelpCircle, gradient: "bg-risk-unknown", textClass: "text-risk-unknown", bgClass: "bg-risk-unknown/10", ring: "ring-risk-unknown/30", glowColor: "220 15% 55%" },
};

/* ───── Detail Section ───── */
const DetailSection = ({ icon: Icon, title, children }: { icon: typeof Shield; title: string; children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="rounded-xl bg-background/50 border border-border/50 p-5 holo-shimmer overflow-hidden"
  >
    <div className="flex items-center gap-2.5 mb-3">
      <div className="w-8 h-8 rounded-lg bg-cyber-cyan/8 border border-cyber-cyan/15 flex items-center justify-center">
        <Icon className="w-4 h-4 text-cyber-cyan/80" />
      </div>
      <span className="text-sm font-display font-bold text-foreground tracking-wide">{title}</span>
    </div>
    {children}
  </motion.div>
);

/* ───── Result Card ───── */
const ResultCard = ({ result, index }: { result: AnalysisResult; index: number }) => {
  const [expanded, setExpanded] = useState(false);
  const config = RISK_CONFIG[result.risk_assessment.risk_label];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      layout
      className="glass-panel-strong rounded-2xl overflow-hidden card-hover group"
    >
      {/* Top color strip with glow */}
      <div className="relative">
        <div className={`h-1 ${config.gradient}`} />
        <div
          className={`absolute top-0 left-0 right-0 h-1 ${config.gradient} blur-sm`}
          style={{ opacity: 0.5 }}
        />
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Animated risk icon */}
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              className={`w-16 h-16 rounded-2xl ${config.gradient} flex items-center justify-center shrink-0 relative`}
              style={{ boxShadow: `0 0 25px hsl(${config.glowColor} / 0.2)` }}
            >
              <Icon className="w-8 h-8 text-white relative z-10" />
              <motion.div
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-2xl"
                style={{ boxShadow: `inset 0 0 15px hsl(0 0% 100% / 0.1)` }}
              />
            </motion.div>
            <div>
              <h3 className="text-xl font-display font-bold text-foreground tracking-wide">{result.drug}</h3>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-xs font-mono text-cyber-cyan/70 px-2 py-0.5 rounded-md bg-cyber-cyan/5 border border-cyber-cyan/10">
                  {result.pharmacogenomic_profile.primary_gene}
                </span>
                <span className="text-xs text-muted-foreground font-mono">
                  {result.pharmacogenomic_profile.diplotype}
                </span>
                <span className="text-xs text-muted-foreground">·</span>
                <span className="text-xs text-muted-foreground">
                  {result.pharmacogenomic_profile.phenotype}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right shrink-0">
            <motion.span
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + 0.3 }}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-display font-bold ring-1 tracking-wide ${config.bgClass} ${config.textClass} ${config.ring}`}
              style={{ boxShadow: `0 0 15px hsl(${config.glowColor} / 0.1)` }}
            >
              <Icon className="w-3.5 h-3.5" />
              {result.risk_assessment.risk_label}
            </motion.span>
            <p className="text-[10px] text-muted-foreground mt-2 font-mono tracking-wider">
              {Math.round(result.risk_assessment.confidence_score * 100)}% CONF · {result.risk_assessment.severity.toUpperCase()}
            </p>
          </div>
        </div>

        {/* Confidence bar */}
        <div className="mt-6 mb-5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-mono text-muted-foreground/60 tracking-widest uppercase">
              Confidence Level
            </span>
            <span className="text-[10px] font-mono text-muted-foreground/60">
              {Math.round(result.risk_assessment.confidence_score * 100)}%
            </span>
          </div>
          <div className="h-2 rounded-full bg-muted/30 overflow-hidden border border-border/30">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${result.risk_assessment.confidence_score * 100}%` }}
              transition={{ duration: 1.2, delay: index * 0.1 + 0.3, ease: [0.22, 1, 0.36, 1] }}
              className={`h-full rounded-full ${config.gradient} relative`}
            >
              <motion.div
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 rounded-full"
                style={{
                  background: "linear-gradient(90deg, transparent, hsl(0 0% 100% / 0.15), transparent)",
                }}
              />
            </motion.div>
          </div>
        </div>

        <p className="text-sm text-foreground/65 leading-relaxed">
          {result.llm_generated_explanation.summary}
        </p>

        <motion.button
          onClick={() => setExpanded(!expanded)}
          whileHover={{ x: 3 }}
          className="mt-5 flex items-center gap-2 text-sm font-display font-bold text-cyber-cyan/80 hover:text-cyber-cyan transition-colors tracking-wide"
        >
          <Activity className="w-4 h-4" />
          {expanded ? "Hide Details" : "View Full Report"}
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </motion.button>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 space-y-4 border-t border-border/30 pt-5">
              <DetailSection icon={Stethoscope} title="Clinical Recommendation">
                <p className="text-sm font-semibold text-foreground">{result.clinical_recommendation.action}</p>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{result.clinical_recommendation.dosing_guidance}</p>
                {result.clinical_recommendation.alternative_drugs.length > 0 && (
                  <div className="mt-4">
                    <span className="text-[10px] font-display font-bold text-muted-foreground/70 uppercase tracking-[0.15em]">Alternatives</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {result.clinical_recommendation.alternative_drugs.map((d) => (
                        <motion.span
                          key={d}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="px-3 py-1.5 rounded-lg bg-muted/30 border border-border/50 text-xs font-semibold text-foreground/80"
                        >
                          {d}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-4">
                  <strong className="text-foreground/60 font-display">Monitoring:</strong>{" "}
                  {result.clinical_recommendation.monitoring_requirements}
                </p>
              </DetailSection>

              <DetailSection icon={Dna} title="Biological Mechanism">
                <p className="text-sm text-muted-foreground leading-relaxed">{result.llm_generated_explanation.mechanism}</p>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-1.5 mt-3 text-xs font-display font-bold text-cyber-cyan/80 bg-cyber-cyan/5 border border-cyber-cyan/15 px-3 py-1.5 rounded-lg tracking-wide"
                >
                  <Shield className="w-3 h-3" />
                  {result.llm_generated_explanation.evidence_level}
                </motion.span>
              </DetailSection>

              <DetailSection icon={FlaskConical} title="Detected Variants">
                {result.pharmacogenomic_profile.detected_variants.length > 0 ? (
                  <div className="space-y-2">
                    {result.pharmacogenomic_profile.detected_variants.map((v, vi) => (
                      <motion.div
                        key={v.rsid}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: vi * 0.05 }}
                        className="flex items-start justify-between text-xs bg-background/60 rounded-xl p-4 border border-border/40 hover:border-cyber-cyan/15 transition-colors"
                      >
                        <div>
                          <span className="font-mono font-bold text-foreground">{v.rsid}</span>
                          <span className="text-muted-foreground ml-2 font-mono">Chr{v.chromosome}:{v.position.toLocaleString()}</span>
                          <p className="text-muted-foreground mt-1.5">{v.clinical_significance}</p>
                        </div>
                        <span className="font-mono font-semibold text-foreground shrink-0 ml-4 bg-muted/40 px-3 py-1 rounded-lg border border-border/40">
                          {v.ref}→{v.alt} ({v.genotype})
                        </span>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">No risk variants detected</p>
                )}
              </DetailSection>

              <DetailSection icon={BookOpen} title="References">
                <ul className="space-y-2">
                  {result.llm_generated_explanation.citations.map((c, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-2.5">
                      <span className="shrink-0 w-6 h-6 rounded-lg bg-muted/40 border border-border/40 flex items-center justify-center text-[10px] font-display font-bold text-foreground/50">
                        {i + 1}
                      </span>
                      <span className="pt-0.5">{c}</span>
                    </li>
                  ))}
                </ul>
              </DetailSection>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ───── Results Display ───── */
const ResultsDisplay = ({ results }: ResultsDisplayProps) => {
  const [copied, setCopied] = useState(false);
  const jsonOutput = JSON.stringify(results, null, 2);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(jsonOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonOutput], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pharmaguard_results_${results[0]?.patient_id || "analysis"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground tracking-wide">Analysis Results</h2>
          <p className="text-sm text-muted-foreground mt-1 font-mono">
            {results.length} medication{results.length !== 1 ? "s" : ""} analyzed ·{" "}
            <span className="text-cyber-cyan/60">{new Date().toLocaleTimeString()}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border/60 bg-card/50 text-sm font-semibold text-foreground/80 hover:bg-foreground/[0.03] hover:border-foreground/15 transition-all duration-200"
          >
            {copied ? <Check className="w-4 h-4 text-risk-safe" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied!" : "Copy JSON"}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-accent text-accent-foreground text-sm font-display font-bold tracking-wide hover:opacity-90 transition-opacity glow-teal-sm"
          >
            <Download className="w-4 h-4" />
            Export
          </motion.button>
        </div>
      </motion.div>

      {/* Result cards */}
      <div className="space-y-5">
        {results.map((result, i) => (
          <ResultCard key={`${result.drug}-${i}`} result={result} index={i} />
        ))}
      </div>

      {/* Raw JSON */}
      <motion.details
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="glass-panel-strong rounded-2xl overflow-hidden group"
      >
        <summary className="px-6 py-4 cursor-pointer text-sm font-display font-bold text-foreground/80 hover:bg-foreground/[0.02] transition-colors flex items-center gap-2 tracking-wide">
          <span className="font-mono text-xs text-cyber-cyan/60">{"{ }"}</span>
          Raw JSON Output
          <span className="text-[10px] font-mono text-muted-foreground/40 ml-2">—click to expand</span>
        </summary>
        <div className="px-6 pb-6">
          <pre className="bg-background/60 border border-border/30 rounded-xl p-5 overflow-x-auto text-xs font-mono text-foreground/60 max-h-96 overflow-y-auto leading-relaxed">
            {jsonOutput}
          </pre>
        </div>
      </motion.details>
    </div>
  );
};

export default ResultsDisplay;
