import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, X, AlertCircle, Check, Shield, Database } from "lucide-react";

interface VCFUploaderProps {
  onFileAccepted: (content: string, fileName: string) => void;
}

const VCFUploader = ({ onFileAccepted }: VCFUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [accepted, setAccepted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const processFile = useCallback(
    async (file: File) => {
      setError(null);

      if (!file.name.endsWith(".vcf")) {
        setError("Invalid file format. Please upload a .vcf file.");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError("File exceeds 5 MB limit.");
        return;
      }

      setIsProcessing(true);
      // Brief animation delay for the processing feel
      await new Promise(r => setTimeout(r, 800));

      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setFileName(file.name);
        setAccepted(true);
        setIsProcessing(false);
        onFileAccepted(content, file.name);
      };
      reader.readAsText(file);
    },
    [onFileAccepted]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const reset = () => {
    setFileName(null);
    setError(null);
    setAccepted(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-cyber-cyan/10 flex items-center justify-center border border-cyber-cyan/20">
          <Database className="w-4 h-4 text-cyber-cyan" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-foreground font-display tracking-wide">
            1. Upload VCF File
          </label>
          <span className="text-xs text-muted-foreground">Variant Call Format genomic data</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isProcessing ? (
          <motion.div
            key="processing"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="glass-panel-strong rounded-2xl p-8 text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-14 h-14 mx-auto mb-4 rounded-xl border-2 border-cyber-cyan/30 border-t-cyber-cyan flex items-center justify-center"
            />
            <p className="text-sm font-display font-bold text-foreground tracking-wide">
              Processing Genomic Data...
            </p>
            <motion.div
              className="mt-3 h-1 rounded-full bg-muted/50 overflow-hidden max-w-xs mx-auto"
            >
              <motion.div
                className="h-full rounded-full gradient-accent"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.8 }}
              />
            </motion.div>
          </motion.div>
        ) : accepted && fileName ? (
          <motion.div
            key="accepted"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="glass-panel-strong rounded-2xl p-5 hud-corners"
          >
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                className="w-12 h-12 rounded-xl bg-risk-safe/10 border border-risk-safe/30 flex items-center justify-center shrink-0"
                style={{ boxShadow: "0 0 15px hsl(152 70% 45% / 0.15)" }}
              >
                <Check className="w-6 h-6 text-risk-safe" />
              </motion.div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="w-4 h-4 text-risk-safe" />
                  <span className="text-sm font-semibold text-foreground truncate">{fileName}</span>
                </div>
                <div className="flex items-center gap-3 text-[10px] font-mono text-muted-foreground/60 tracking-wider">
                  <span className="flex items-center gap-1">
                    <Shield className="w-3 h-3" /> VALIDATED
                  </span>
                  <span>•</span>
                  <span>VCF FORMAT</span>
                  <span>•</span>
                  <span>READY</span>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={reset}
                className="w-8 h-8 rounded-lg bg-muted/30 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 cursor-pointer holo-shimmer overflow-hidden ${isDragging
                ? "border-cyber-cyan bg-cyber-cyan/[0.03] scale-[1.01] glow-teal-sm"
                : "border-border hover:border-cyber-cyan/40 hover:bg-foreground/[0.01]"
              }`}
          >
            <input
              type="file"
              accept=".vcf"
              onChange={handleFileInput}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />

            {/* Animated upload icon */}
            <motion.div
              className="relative mx-auto w-16 h-16 mb-5"
              animate={isDragging ? { y: -5, scale: 1.05 } : { y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute inset-0 rounded-2xl bg-foreground/[0.02] border border-foreground/[0.06] flex items-center justify-center">
                <Upload className="w-8 h-8 text-muted-foreground group-hover:text-cyber-cyan transition-colors" />
              </div>
              <motion.div
                animate={{ opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -inset-2 rounded-2xl border border-cyber-cyan/10"
              />
            </motion.div>

            <p className="text-base font-semibold text-foreground/90 mb-1">
              Drop your VCF file here or click to browse
            </p>
            <p className="text-xs text-muted-foreground">
              .vcf format • Max 5 MB • Secure client-side processing
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="flex items-center gap-2.5 mt-3 text-sm p-3 rounded-xl bg-destructive/5 border border-destructive/20"
          >
            <AlertCircle className="w-4 h-4 text-destructive shrink-0" />
            <span className="text-destructive/90">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default VCFUploader;
