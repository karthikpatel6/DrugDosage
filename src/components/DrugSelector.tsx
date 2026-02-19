import { motion, AnimatePresence } from "framer-motion";
import { Pill, Sparkles } from "lucide-react";
import { SUPPORTED_DRUGS, type SupportedDrug } from "@/lib/types";

interface DrugSelectorProps {
  selectedDrugs: SupportedDrug[];
  onSelectionChange: (drugs: SupportedDrug[]) => void;
}

const DRUG_INFO: Record<SupportedDrug, { desc: string; gene: string; risk: string; icon: string }> = {
  CODEINE: { desc: "Pain relief (opioid)", gene: "CYP2D6", risk: "Metabolism variance", icon: "💊" },
  WARFARIN: { desc: "Blood thinner", gene: "CYP2C9", risk: "Bleeding risk", icon: "🩸" },
  CLOPIDOGREL: { desc: "Antiplatelet", gene: "CYP2C19", risk: "Activation failure", icon: "🫀" },
  SIMVASTATIN: { desc: "Cholesterol", gene: "SLCO1B1", risk: "Myopathy risk", icon: "⚗️" },
  AZATHIOPRINE: { desc: "Immunosuppressant", gene: "TPMT", risk: "Myelosuppression", icon: "🛡️" },
  FLUOROURACIL: { desc: "Chemotherapy", gene: "DPYD", risk: "Severe toxicity", icon: "⚠️" },
};

const DrugSelector = ({ selectedDrugs, onSelectionChange }: DrugSelectorProps) => {
  const toggle = (drug: SupportedDrug) => {
    if (selectedDrugs.includes(drug)) {
      onSelectionChange(selectedDrugs.filter((d) => d !== drug));
    } else {
      onSelectionChange([...selectedDrugs, drug]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-cyber-blue/10 flex items-center justify-center border border-cyber-blue/20">
          <Pill className="w-4 h-4 text-cyber-blue" />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-semibold text-foreground font-display tracking-wide">
            2. Select Medications
          </label>
          <span className="text-xs text-muted-foreground">
            Choose drugs to analyze • {selectedDrugs.length}/{SUPPORTED_DRUGS.length} selected
          </span>
        </div>
        <AnimatePresence>
          {selectedDrugs.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyber-cyan/10 border border-cyber-cyan/20"
            >
              <Sparkles className="w-3 h-3 text-cyber-cyan" />
              <span className="text-xs font-mono font-bold text-cyber-cyan">{selectedDrugs.length}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {SUPPORTED_DRUGS.map((drug, index) => {
          const isSelected = selectedDrugs.includes(drug);
          const info = DRUG_INFO[drug];

          return (
            <motion.button
              key={drug}
              onClick={() => toggle(drug)}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -2, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.97 }}
              className={`relative flex flex-col items-start p-4 rounded-xl border text-left transition-all duration-300 overflow-hidden group ${isSelected
                  ? "border-cyber-cyan/40 bg-cyber-cyan/[0.06] ring-1 ring-cyber-cyan/20 shadow-[0_0_20px_hsl(175_100%_50%_/_0.06)]"
                  : "border-border/60 bg-card/50 hover:border-foreground/15 hover:bg-foreground/[0.02]"
                }`}
            >
              {/* Shimmer on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(135deg, transparent 40%, hsl(175 100% 50% / 0.02) 50%, transparent 60%)",
                  }}
                />
              </div>

              {/* Drug icon and name */}
              <div className="flex items-center gap-2.5 w-full mb-2 relative z-10">
                <span className="text-lg">{info.icon}</span>
                <span className={`text-sm font-display font-bold tracking-wide ${isSelected ? "text-foreground" : "text-foreground/80"}`}>
                  {drug}
                </span>
              </div>

              {/* Description */}
              <span className="text-xs text-muted-foreground mb-1 relative z-10">{info.desc}</span>

              {/* Gene tag */}
              <span className={`text-[10px] font-mono tracking-wider px-2 py-0.5 rounded-md relative z-10 ${isSelected
                  ? "bg-cyber-cyan/10 text-cyber-cyan/80"
                  : "bg-muted/30 text-muted-foreground/60"
                }`}>
                {info.gene}
              </span>

              {/* Selected indicator */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full gradient-accent flex items-center justify-center"
                    style={{ boxShadow: "0 0 10px hsl(175 100% 50% / 0.3)" }}
                  >
                    <span className="text-accent-foreground text-xs font-bold">✓</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bottom glow line for selected */}
              {isSelected && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  className="absolute bottom-0 left-0 right-0 h-[2px] gradient-accent"
                  style={{ boxShadow: "0 0 8px hsl(175 100% 50% / 0.3)" }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default DrugSelector;
