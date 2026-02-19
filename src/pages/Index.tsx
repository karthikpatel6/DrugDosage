import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dna, FlaskConical, Loader2, Sparkles, Cpu, Zap, Radio, Search, Activity, Shield } from "lucide-react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import VCFUploader from "@/components/VCFUploader";
import DrugSelector from "@/components/DrugSelector";
import DrugImageScanner from "@/components/DrugImageScanner";
import CustomDrugInput from "@/components/CustomDrugInput";
import ResultsDisplay from "@/components/ResultsDisplay";
import ParticleField from "@/components/ParticleField";
import CyberHUD from "@/components/CyberHUD";
import { analyzePatient } from "@/lib/analysis";
import type { SupportedDrug, AnalysisResult } from "@/lib/types";

const Index = () => {
  const [vcfContent, setVcfContent] = useState<string | null>(null);
  const [vcfFileName, setVcfFileName] = useState<string | null>(null);
  const [selectedDrugs, setSelectedDrugs] = useState<SupportedDrug[]>([]);
  const [results, setResults] = useState<AnalysisResult[] | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const analysisRef = useRef<HTMLDivElement>(null);

  const handleGetStarted = () => {
    analysisRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleFileAccepted = (content: string, fileName: string) => {
    setVcfContent(content);
    setVcfFileName(fileName);
    setResults(null);
  };

  const handleDrugIdentified = (drug: SupportedDrug) => {
    if (!selectedDrugs.includes(drug)) {
      setSelectedDrugs(prev => [...prev, drug]);
    }
  };

  const handleAnalyze = async () => {
    if (!vcfContent || selectedDrugs.length === 0) return;
    setIsAnalyzing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const analysisResults = analyzePatient(vcfContent, selectedDrugs);
    setResults(analysisResults);
    setIsAnalyzing(false);
  };

  const canAnalyze = vcfContent && selectedDrugs.length > 0 && !isAnalyzing;

  return (
    <div className="min-h-screen bg-background relative selection:bg-cyber-cyan/30 selection:text-white">
      {/* Global particle field */}
      <ParticleField />

      {/* HUD overlay */}
      <CyberHUD />

      {/* Premium Navbar */}
      <Navbar onGetStarted={handleGetStarted} />

      <HeroSection onGetStarted={handleGetStarted} />

      {/* Analysis Section */}
      <section ref={analysisRef} className="relative z-10 py-32 px-6">
        <div className="container mx-auto max-w-3xl">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-cyber-cyan/20 bg-cyber-cyan/[0.04] backdrop-blur-md mb-6"
            >
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                >
                  <Cpu className="w-4 h-4 text-cyber-cyan" />
                </motion.div>
                <motion.div
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-cyber-cyan/20 blur-sm rounded-full"
                />
              </div>
              <span className="text-[10px] font-display font-bold text-cyber-cyan tracking-[0.2em] uppercase">
                Neural Analysis Console
              </span>
            </motion.div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-black text-foreground tracking-tight leading-tight">
              Analyze Patient{" "}
              <span className="text-gradient-brand">Genomics</span>
            </h2>

            <p className="text-muted-foreground mt-5 max-w-xl mx-auto text-lg leading-relaxed font-light">
              Upload genomic VCF data and select target medications to generate a high-precision risk assessment report.
            </p>

            {/* Decorative line */}
            <div className="relative h-px w-48 mx-auto mt-10">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyber-cyan/30 to-transparent" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-cyber-cyan shadow-[0_0_10px_hsl(175_100%_50%)]" />
            </div>
          </motion.div>

          <div className="space-y-10">
            {/* Step 1: VCF Upload */}
            <div className="space-y-4">
              <VCFUploader onFileAccepted={handleFileAccepted} />
            </div>

            {/* Step 2: Drug Identification & Selection */}
            <div className="space-y-8 pt-4">
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border/40 to-transparent" />
                <div className="text-[10px] font-mono text-muted-foreground/30 tracking-[0.4em] uppercase">
                  Drug Specification Phase
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border/40 to-transparent" />
              </div>

              {/* A: Visual Recognition */}
              <DrugImageScanner
                onDrugIdentified={handleDrugIdentified}
                selectedDrugs={selectedDrugs}
              />

              {/* B: Query-based Search (NEW) */}
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-border/20 border-dashed" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-background px-4 text-[10px] font-display font-bold text-muted-foreground/40 tracking-[0.2em] uppercase rounded-full border border-border/20">
                    OR
                  </span>
                </div>
              </div>

              <CustomDrugInput
                onDrugAdded={handleDrugIdentified}
                selectedDrugs={selectedDrugs}
              />

              {/* C: Manual Manifest Selection */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyber-cyan/40" />
                    <span className="text-[10px] font-display font-bold text-muted-foreground/50 tracking-widest uppercase">
                      Supported Medication Matrix
                    </span>
                  </div>
                  <div className="h-px flex-1 mx-4 bg-border/20" />
                </div>
                <DrugSelector selectedDrugs={selectedDrugs} onSelectionChange={setSelectedDrugs} />
              </div>
            </div>

            {/* Final Stage: Execution */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="pt-8"
            >
              <div className="glass-panel-strong rounded-3xl p-1 relative overflow-hidden group">
                {/* Background glow for button area */}
                <div className="absolute inset-0 bg-cyber-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                <motion.button
                  onClick={handleAnalyze}
                  disabled={!canAnalyze}
                  whileHover={canAnalyze ? { scale: 1.01, y: -2 } : {}}
                  whileTap={canAnalyze ? { scale: 0.99 } : {}}
                  className={`relative w-full py-6 rounded-2xl text-lg font-display font-black tracking-[0.2em] uppercase transition-all duration-500 flex items-center justify-center gap-4 overflow-hidden ${canAnalyze
                    ? "gradient-accent text-accent-foreground glow-teal shadow-2xl"
                    : "bg-muted/30 text-muted-foreground/30 cursor-not-allowed border border-border/20"
                    }`}
                >
                  {/* Subtle scan line on the button */}
                  {canAnalyze && (
                    <motion.div
                      className="absolute inset-0"
                      style={{
                        background: "linear-gradient(90deg, transparent, hsl(0 0% 100% / 0.1), transparent)",
                      }}
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{ duration: 3, repeat: Infinity, repeatDelay: 1 }}
                    />
                  )}

                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span className="relative z-10">Cross-referencing Alleles...</span>
                      <motion.div
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="text-xs font-mono"
                      >
                        [WAIT]
                      </motion.div>
                    </>
                  ) : (
                    <>
                      <Zap className="w-6 h-6 relative z-10" />
                      <span className="relative z-10 text-xl font-black">Run Analysis Engine</span>
                    </>
                  )}
                </motion.button>
              </div>

              {/* Real-time Telemetry Indicators */}
              <div className="flex items-center justify-between mt-6 px-4">
                <div className="flex gap-6">
                  <div className={`flex items-center gap-2 text-[9px] font-mono tracking-widest uppercase transition-colors duration-500 ${vcfContent ? "text-cyber-cyan" : "text-muted-foreground/30"}`}>
                    <div className={`w-1 h-1 rounded-full ${vcfContent ? "bg-cyber-cyan animate-pulse" : "bg-muted-foreground/20"}`} />
                    Genome: {vcfContent ? "SYNCED" : "OFFLINE"}
                  </div>
                  <div className={`flex items-center gap-2 text-[9px] font-mono tracking-widest uppercase transition-colors duration-500 ${selectedDrugs.length > 0 ? "text-cyber-cyan" : "text-muted-foreground/30"}`}>
                    <div className={`w-1 h-1 rounded-full ${selectedDrugs.length > 0 ? "bg-cyber-cyan animate-pulse" : "bg-muted-foreground/20"}`} />
                    Matrix: {selectedDrugs.length}/{selectedDrugs.length > 6 ? selectedDrugs.length : 6} TARGETS
                  </div>
                </div>
                <div className="text-[9px] font-mono text-muted-foreground/20 tracking-widest uppercase">
                  BETA-V1.0.4 // ENCRYPTION ENABLED
                </div>
              </div>
            </motion.div>
          </div>

          {/* Results Display Portal */}
          <AnimatePresence>
            {results && (
              <motion.div
                initial={{ opacity: 0, y: 60, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -40, scale: 0.95 }}
                transition={{ type: "spring", damping: 25, stiffness: 120 }}
                className="mt-24 relative"
              >
                {/* Visual anchor for results */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                  <motion.div
                    animate={{ y: [0, 5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <FlaskConical className="w-5 h-5 text-cyber-cyan" />
                  </motion.div>
                  <div className="w-px h-8 bg-gradient-to-b from-cyber-cyan/50 to-transparent" />
                </div>

                <div className="glass-panel-strong rounded-[2.5rem] p-1 shadow-2xl border-cyber-cyan/10">
                  <div className="bg-background/40 rounded-[2.2rem] p-8 backdrop-blur-3xl overflow-hidden relative">
                    {/* Decorative glow inside results container */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-cyber-cyan/5 blur-[100px] rounded-full -mr-32 -mt-32" />

                    <ResultsDisplay results={results} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Futuristic Footer */}
      <footer className="relative z-10 border-t border-border/30 bg-background/40 backdrop-blur-md pt-20 pb-12 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center glow-teal-sm">
                  <Dna className="w-5 h-5 text-accent-foreground" />
                </div>
                <span className="text-2xl font-display font-bold text-foreground tracking-wider">
                  Pharma<span className="text-gradient-brand">Guard</span>
                </span>
              </div>
              <p className="text-sm text-muted-foreground/60 leading-relaxed max-w-xs">
                Next-generation pharmacogenomic intelligence platform for precision medicine and explainable AI risk assessment.
              </p>
            </div>

            <div className="space-y-6">
              <h4 className="text-xs font-display font-bold text-foreground/80 tracking-[0.2em] uppercase">
                Platform Navigation
              </h4>
              <ul className="space-y-3 text-xs font-mono text-muted-foreground/50">
                <li className="hover:text-cyber-cyan cursor-pointer transition-colors">&gt; SYSTEM_OVERVIEW</li>
                <li className="hover:text-cyber-cyan cursor-pointer transition-colors">&gt; GENOMIC_SPECIFICATIONS</li>
                <li className="hover:text-cyber-cyan cursor-pointer transition-colors">&gt; API_INTEGRATION</li>
                <li className="hover:text-cyber-cyan cursor-pointer transition-colors">&gt; COMPLIANCE_PROTOCOLS</li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-xs font-display font-bold text-foreground/80 tracking-[0.2em] uppercase">
                Terminal Status
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-[10px] font-mono text-muted-foreground/40">
                  <div className="w-1.5 h-1.5 rounded-full bg-risk-safe animate-pulse shadow-[0_0_8px_hsl(152_70%_45%)]" />
                  CORE ENGINE: OPERATIONAL
                </div>
                <div className="flex items-center gap-3 text-[10px] font-mono text-muted-foreground/40">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyber-purple animate-pulse shadow-[0_0_8px_hsl(270_80%_60%)]" />
                  AI SUBSYSTEM: SYNCED
                </div>
                <div className="flex items-center gap-3 text-[10px] font-mono text-muted-foreground/40">
                  <div className="w-1.5 h-1.5 rounded-full bg-risk-adjust animate-pulse" />
                  LATENCY: 14MS
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-border/20 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col items-center md:items-start">
              <p className="text-[10px] text-muted-foreground/40 font-mono tracking-widest">
                RIFT 2026 // PHARMACOGENOMICS & EXPLAINABLE AI TRACK
              </p>
              <p className="text-[9px] text-muted-foreground/20 mt-1 uppercase tracking-tighter">
                &copy; 2026 NEURAL_MED_SYSTEMS. ALL RIGHTS RESERVED.
              </p>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-lg bg-border/20 flex items-center justify-center hover:bg-border/40 transition-colors cursor-pointer text-muted-foreground/40">
                <Activity className="w-4 h-4" />
              </div>
              <div className="w-8 h-8 rounded-lg bg-border/20 flex items-center justify-center hover:bg-border/40 transition-colors cursor-pointer text-muted-foreground/40">
                <Shield className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
