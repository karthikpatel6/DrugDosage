import { motion } from "framer-motion";
import { Shield, Dna, FlaskConical, ArrowDown, Zap, Cpu, Activity } from "lucide-react";

interface HeroSectionProps {
  onGetStarted: () => void;
}

const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen gradient-hero cyber-grid dna-pattern flex items-center overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -30, 20, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 left-[10%] w-[500px] h-[500px] rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(175 100% 50% / 0.06), transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <motion.div
          animate={{
            x: [0, -40, 25, 0],
            y: [0, 25, -30, 0],
            scale: [1, 0.95, 1.1, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-10 right-[10%] w-[600px] h-[600px] rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(210 100% 60% / 0.05), transparent 70%)",
            filter: "blur(50px)",
          }}
        />
        <motion.div
          animate={{
            x: [0, 20, -15, 0],
            y: [0, -20, 15, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[40%] left-[50%] w-[300px] h-[300px] rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(270 80% 60% / 0.04), transparent 70%)",
            filter: "blur(30px)",
          }}
        />
      </div>

      {/* Orbiting elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="w-[500px] h-[500px] md:w-[700px] md:h-[700px]"
          >
            <div className="absolute top-0 left-1/2 w-1.5 h-1.5 rounded-full bg-cyber-cyan/30 shadow-[0_0_8px_hsl(175_100%_50%_/_0.3)]" />
            <div className="absolute bottom-0 left-1/2 w-1 h-1 rounded-full bg-cyber-blue/20" />
          </motion.div>
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 w-[400px] h-[400px] md:w-[550px] md:h-[550px] m-auto"
          >
            <div className="absolute top-1/2 left-0 w-1 h-1 rounded-full bg-cyber-purple/25" />
            <div className="absolute top-0 right-1/4 w-1.5 h-1.5 rounded-full bg-cyber-cyan/20" />
          </motion.div>

          {/* Orbit rings */}
          <div className="absolute inset-0 w-[500px] h-[500px] md:w-[700px] md:h-[700px] m-auto rounded-full border border-cyber-cyan/[0.04]" />
          <div className="absolute inset-0 w-[400px] h-[400px] md:w-[550px] md:h-[550px] m-auto rounded-full border border-cyber-purple/[0.04]" />
          <div className="absolute inset-0 w-[300px] h-[300px] md:w-[400px] md:h-[400px] m-auto rounded-full border border-cyber-blue/[0.03]" />
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Status badge */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-cyber-cyan/20 bg-cyber-cyan/[0.04] backdrop-blur-sm mb-8">
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-cyber-cyan shadow-[0_0_8px_hsl(175_100%_50%_/_0.5)]"
              />
              <span className="text-sm font-display font-medium text-cyber-cyan tracking-[0.15em] uppercase">
                Pharmacogenomic Risk Prediction
              </span>
              <Cpu className="w-4 h-4 text-cyber-cyan/60" />
            </div>
          </motion.div>

          {/* Main title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="text-6xl md:text-8xl lg:text-9xl font-display font-black tracking-tight text-foreground mb-6 leading-[0.9]"
          >
            Pharma
            <span className="text-gradient-brand">Guard</span>
          </motion.h1>

          {/* Subtitle with typing effect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
          >
            <p className="text-lg md:text-xl text-foreground/50 max-w-2xl mx-auto mb-4 leading-relaxed font-light tracking-wide">
              AI-powered analysis of patient genetic data to predict drug metabolism risks.
            </p>
            <p className="text-sm text-foreground/30 max-w-xl mx-auto mb-12 font-mono tracking-wider">
              {'>'} Upload VCF files • Select medications • Get clinical recommendations
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              onClick={onGetStarted}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="group relative gradient-accent px-10 py-4.5 rounded-xl text-accent-foreground font-display font-bold text-lg tracking-wider uppercase glow-teal transition-all duration-300 flex items-center gap-3 overflow-hidden"
            >
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: "linear-gradient(90deg, transparent, hsl(0 0% 100% / 0.1), transparent)",
                }}
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              />
              <Zap className="w-5 h-5 relative z-10" />
              <span className="relative z-10">Start Analysis</span>
            </motion.button>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-20 flex justify-center gap-10 md:gap-16"
          >
            {[
              { icon: Dna, label: "6 Pharmacogenes", value: "06" },
              { icon: FlaskConical, label: "6 Critical Drugs", value: "06" },
              { icon: Shield, label: "CPIC Aligned", value: "✓" },
              { icon: Activity, label: "Real-time AI", value: "●" },
            ].map(({ icon: Icon, label, value }, index) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + index * 0.1 }}
                className="flex flex-col items-center gap-2 group"
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-foreground/[0.03] border border-foreground/[0.06] flex items-center justify-center group-hover:border-cyber-cyan/20 group-hover:bg-cyber-cyan/[0.03] transition-all duration-500">
                    <Icon className="w-5 h-5 text-foreground/30 group-hover:text-cyber-cyan/60 transition-colors duration-500" />
                  </div>
                </div>
                <span className="text-xs text-foreground/25 font-mono tracking-wider group-hover:text-foreground/40 transition-colors">{label}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2 }}
            className="mt-16 flex flex-col items-center gap-2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowDown className="w-5 h-5 text-foreground/15" />
            </motion.div>
            <span className="text-[10px] font-mono text-foreground/10 tracking-[0.3em] uppercase">Scroll</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
