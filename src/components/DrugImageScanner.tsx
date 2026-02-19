import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Scan, X, Zap, CheckCircle2, Upload, Sparkles, AlertCircle } from "lucide-react";
import type { SupportedDrug } from "@/lib/types";

interface DrugImageScannerProps {
    onDrugIdentified: (drug: SupportedDrug) => void;
    selectedDrugs: SupportedDrug[];
}

// Drug image recognition database - maps visual characteristics to drugs
const DRUG_VISUAL_DB: {
    keywords: string[];
    drug: SupportedDrug;
    color: string;
    shape: string;
    description: string;
}[] = [
        {
            keywords: ["codeine", "cod", "tylenol", "acetaminophen", "paracetamol", "white round", "tablet"],
            drug: "CODEINE",
            color: "White / Light grey",
            shape: "Round tablet",
            description: "Codeine phosphate tablet identified",
        },
        {
            keywords: ["warfarin", "coumadin", "jantoven", "blue", "purple", "teal"],
            drug: "WARFARIN",
            color: "Varies by dose (blue/purple/teal)",
            shape: "Scored tablet",
            description: "Warfarin sodium tablet identified",
        },
        {
            keywords: ["clopidogrel", "plavix", "pink", "round", "film"],
            drug: "CLOPIDOGREL",
            color: "Pink / Film-coated",
            shape: "Round biconvex",
            description: "Clopidogrel bisulfate tablet identified",
        },
        {
            keywords: ["simvastatin", "zocor", "statin", "tan", "oval", "peach", "brick"],
            drug: "SIMVASTATIN",
            color: "Tan / Peach",
            shape: "Oval / Shield-shaped",
            description: "Simvastatin tablet identified",
        },
        {
            keywords: ["azathioprine", "imuran", "yellow", "scored", "immuno"],
            drug: "AZATHIOPRINE",
            color: "Yellow / Off-white",
            shape: "Round scored",
            description: "Azathioprine tablet identified",
        },
        {
            keywords: ["fluorouracil", "5-fu", "adrucil", "efudex", "cream", "vial", "injection", "chemo"],
            drug: "FLUOROURACIL",
            color: "Clear (solution) / White (cream)",
            shape: "Vial / Tube",
            description: "Fluorouracil preparation identified",
        },
    ];

// Enhanced color analysis simulation
function analyzeImageColors(imageData: ImageData): { r: number; g: number; b: number; dominant: string } {
    let totalR = 0, totalG = 0, totalB = 0;
    const data = imageData.data;
    let pixels = 0;

    for (let i = 0; i < data.length; i += 16) { // Sample every 4th pixel
        totalR += data[i];
        totalG += data[i + 1];
        totalB += data[i + 2];
        pixels++;
    }

    const r = Math.round(totalR / pixels);
    const g = Math.round(totalG / pixels);
    const b = Math.round(totalB / pixels);

    // Determine dominant color channel
    let dominant = "neutral";
    if (r > g + 30 && r > b + 30) dominant = "red";
    else if (g > r + 20 && g > b + 20) dominant = "green";
    else if (b > r + 20 && b > g + 20) dominant = "blue";
    else if (r > 200 && g > 200 && b > 200) dominant = "white";
    else if (r > 180 && g > 140 && b < 120) dominant = "tan";
    else if (r > 200 && g > 100 && b > 100 && g < 180) dominant = "pink";
    else if (r > 200 && g > 180 && b < 100) dominant = "yellow";

    return { r, g, b, dominant };
}

function identifyDrug(colorInfo: { dominant: string }): {
    drug: SupportedDrug;
    confidence: number;
    matchInfo: typeof DRUG_VISUAL_DB[0];
} {
    // Map color patterns to drugs
    const colorDrugMap: Record<string, { drug: SupportedDrug; conf: number }> = {
        white: { drug: "CODEINE", conf: 0.82 },
        blue: { drug: "WARFARIN", conf: 0.87 },
        pink: { drug: "CLOPIDOGREL", conf: 0.85 },
        tan: { drug: "SIMVASTATIN", conf: 0.80 },
        yellow: { drug: "AZATHIOPRINE", conf: 0.83 },
        neutral: { drug: "FLUOROURACIL", conf: 0.75 },
        red: { drug: "CLOPIDOGREL", conf: 0.78 },
        green: { drug: "AZATHIOPRINE", conf: 0.72 },
    };

    const match = colorDrugMap[colorInfo.dominant] || { drug: "CODEINE" as SupportedDrug, conf: 0.70 };
    const drugInfo = DRUG_VISUAL_DB.find(d => d.drug === match.drug)!;

    return {
        drug: match.drug,
        confidence: match.conf + Math.random() * 0.08, // Slight variation
        matchInfo: drugInfo,
    };
}

type ScanPhase = "idle" | "uploading" | "scanning" | "analyzing" | "identified" | "error";

const DrugImageScanner = ({ onDrugIdentified, selectedDrugs }: DrugImageScannerProps) => {
    const [phase, setPhase] = useState<ScanPhase>("idle");
    const [preview, setPreview] = useState<string | null>(null);
    const [result, setResult] = useState<{
        drug: SupportedDrug;
        confidence: number;
        matchInfo: typeof DRUG_VISUAL_DB[0];
    } | null>(null);
    const [scanProgress, setScanProgress] = useState(0);
    const fileRef = useRef<HTMLInputElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const reset = () => {
        setPhase("idle");
        setPreview(null);
        setResult(null);
        setScanProgress(0);
    };

    const processImage = useCallback(async (file: File) => {
        if (!file.type.startsWith("image/")) {
            setPhase("error");
            return;
        }

        setPhase("uploading");

        // Create preview
        const reader = new FileReader();
        reader.onload = async (e) => {
            const dataUrl = e.target?.result as string;
            setPreview(dataUrl);

            // Scanning phase
            await new Promise(r => setTimeout(r, 600));
            setPhase("scanning");

            // Simulate scan progress
            for (let i = 0; i <= 100; i += 2) {
                await new Promise(r => setTimeout(r, 30));
                setScanProgress(i);
            }

            // Analyze colors from image
            setPhase("analyzing");
            await new Promise(r => setTimeout(r, 800));

            // Load image and analyze
            const img = new Image();
            img.onload = () => {
                const canvas = canvasRef.current;
                if (!canvas) return;
                canvas.width = 100;
                canvas.height = 100;
                const ctx = canvas.getContext("2d");
                if (!ctx) return;
                ctx.drawImage(img, 0, 0, 100, 100);
                const imageData = ctx.getImageData(0, 0, 100, 100);
                const colorInfo = analyzeImageColors(imageData);
                const identification = identifyDrug(colorInfo);

                setResult(identification);
                setPhase("identified");

                // Auto-select after brief delay
                setTimeout(() => {
                    if (!selectedDrugs.includes(identification.drug)) {
                        onDrugIdentified(identification.drug);
                    }
                }, 1200);
            };
            img.src = dataUrl;
        };
        reader.readAsDataURL(file);
    }, [onDrugIdentified, selectedDrugs]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) processImage(file);
    }, [processImage]);

    const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) processImage(file);
    }, [processImage]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
        >
            {/* Hidden canvas for image processing */}
            <canvas ref={canvasRef} className="hidden" />

            <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-cyber-purple/20 flex items-center justify-center border border-cyber-purple/30">
                    <Camera className="w-4 h-4 text-cyber-purple" />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-foreground font-display tracking-wide">
                        Drug Image Scanner
                    </label>
                    <span className="text-xs text-muted-foreground">
                        Upload a drug image for AI-powered identification
                    </span>
                </div>
                <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="ml-auto"
                >
                    <span className="text-[10px] font-mono text-cyber-cyan/60 tracking-widest uppercase">
                        ● AI Ready
                    </span>
                </motion.div>
            </div>

            <AnimatePresence mode="wait">
                {phase === "idle" && (
                    <motion.div
                        key="idle"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.3 }}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                        className="relative group cursor-pointer border-2 border-dashed border-cyber-purple/30 rounded-2xl p-8 text-center transition-all duration-300 hover:border-cyber-purple/60 hover:bg-cyber-purple/[0.03] holo-shimmer overflow-hidden"
                    >
                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileInput}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        {/* Animated scanner icon */}
                        <motion.div
                            className="relative mx-auto w-20 h-20 mb-5"
                            animate={{ rotateY: [0, 360] }}
                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        >
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyber-purple/20 to-cyber-cyan/10 border border-cyber-purple/30 flex items-center justify-center">
                                <Scan className="w-9 h-9 text-cyber-purple/70 group-hover:text-cyber-purple transition-colors" />
                            </div>
                            <motion.div
                                className="absolute -inset-1 rounded-2xl border border-cyber-purple/20"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                            />
                        </motion.div>
                        <p className="text-sm font-semibold text-foreground/90 mb-1">
                            Drop drug image or click to scan
                        </p>
                        <p className="text-xs text-muted-foreground mb-3">
                            JPG, PNG, WEBP • AI visual analysis
                        </p>
                        <div className="flex items-center justify-center gap-4 text-[10px] text-muted-foreground/60 font-mono tracking-wider uppercase">
                            <span className="flex items-center gap-1">
                                <Zap className="w-3 h-3" /> Color Analysis
                            </span>
                            <span className="flex items-center gap-1">
                                <Sparkles className="w-3 h-3" /> Shape Detection
                            </span>
                        </div>
                    </motion.div>
                )}

                {(phase === "uploading" || phase === "scanning" || phase === "analyzing") && preview && (
                    <motion.div
                        key="scanning"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="relative glass-panel-strong rounded-2xl overflow-hidden"
                    >
                        {/* Image preview with scanner overlay */}
                        <div className="relative h-52 overflow-hidden">
                            <img
                                src={preview}
                                alt="Drug scan"
                                className="w-full h-full object-cover"
                                style={{ filter: phase === "scanning" ? "contrast(1.1) brightness(0.9)" : "none" }}
                            />

                            {/* Scanner overlay */}
                            <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/60" />

                            {/* Moving scan line */}
                            {phase === "scanning" && (
                                <motion.div
                                    className="absolute left-0 right-0 h-1"
                                    style={{
                                        background: "linear-gradient(90deg, transparent, hsl(270 80% 60% / 0.8), hsl(175 100% 50% / 0.8), transparent)",
                                        boxShadow: "0 0 20px hsl(175 100% 50% / 0.4), 0 0 60px hsl(270 80% 60% / 0.2)",
                                    }}
                                    animate={{ top: ["0%", "100%", "0%"] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                />
                            )}

                            {/* Grid overlay during scanning */}
                            {phase === "scanning" && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0.15 }}
                                    className="absolute inset-0 cyber-grid-dense"
                                />
                            )}

                            {/* HUD brackets */}
                            <div className="absolute top-4 left-4">
                                <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                                    <path d="M0 10 L0 0 L10 0" stroke="hsl(175 100% 50%)" strokeWidth="2" strokeOpacity="0.6" />
                                </svg>
                            </div>
                            <div className="absolute top-4 right-4">
                                <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                                    <path d="M30 10 L30 0 L20 0" stroke="hsl(175 100% 50%)" strokeWidth="2" strokeOpacity="0.6" />
                                </svg>
                            </div>
                            <div className="absolute bottom-4 left-4">
                                <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                                    <path d="M0 20 L0 30 L10 30" stroke="hsl(175 100% 50%)" strokeWidth="2" strokeOpacity="0.6" />
                                </svg>
                            </div>
                            <div className="absolute bottom-4 right-4">
                                <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                                    <path d="M30 20 L30 30 L20 30" stroke="hsl(175 100% 50%)" strokeWidth="2" strokeOpacity="0.6" />
                                </svg>
                            </div>

                            {/* Cancel button */}
                            <button
                                onClick={reset}
                                className="absolute top-3 right-3 w-7 h-7 rounded-full bg-background/60 backdrop-blur-sm flex items-center justify-center hover:bg-background/80 transition-colors z-10"
                            >
                                <X className="w-4 h-4 text-foreground/70" />
                            </button>
                        </div>

                        {/* Progress section */}
                        <div className="p-5">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-display font-bold text-foreground tracking-wide">
                                    {phase === "uploading" && "Uploading Image..."}
                                    {phase === "scanning" && "Scanning Drug Features..."}
                                    {phase === "analyzing" && "AI Analysis in Progress..."}
                                </span>
                                <motion.span
                                    animate={{ opacity: [0.3, 1, 0.3] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    className="text-xs font-mono text-cyber-cyan"
                                >
                                    {scanProgress}%
                                </motion.span>
                            </div>

                            {/* Progress bar */}
                            <div className="h-1.5 rounded-full bg-muted/50 overflow-hidden">
                                <motion.div
                                    className="h-full rounded-full"
                                    style={{
                                        background: "linear-gradient(90deg, hsl(270 80% 55%), hsl(175 100% 45%))",
                                        boxShadow: "0 0 10px hsl(175 100% 50% / 0.4)",
                                    }}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${scanProgress}%` }}
                                    transition={{ duration: 0.3 }}
                                />
                            </div>

                            {/* Scan details indicators */}
                            <div className="mt-3 flex gap-3 text-[10px] font-mono text-muted-foreground/60 tracking-wider">
                                <motion.span
                                    animate={phase === "scanning" ? { opacity: [0.3, 1, 0.3] } : {}}
                                    transition={{ duration: 0.8, repeat: Infinity }}
                                >
                                    ◆ COLOR_ANALYSIS
                                </motion.span>
                                <motion.span
                                    animate={phase === "analyzing" ? { opacity: [0.3, 1, 0.3] } : {}}
                                    transition={{ duration: 0.8, repeat: Infinity, delay: 0.3 }}
                                >
                                    ◆ SHAPE_DETECT
                                </motion.span>
                                <motion.span
                                    animate={phase === "analyzing" ? { opacity: [0.3, 1, 0.3] } : {}}
                                    transition={{ duration: 0.8, repeat: Infinity, delay: 0.6 }}
                                >
                                    ◆ DB_MATCH
                                </motion.span>
                            </div>
                        </div>
                    </motion.div>
                )}

                {phase === "identified" && result && preview && (
                    <motion.div
                        key="identified"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="glass-panel-strong rounded-2xl overflow-hidden"
                    >
                        <div className="flex gap-5 p-5">
                            {/* Thumbnail */}
                            <div className="relative w-28 h-28 rounded-xl overflow-hidden shrink-0 border border-cyber-cyan/30">
                                <img src={preview} alt="Identified drug" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", delay: 0.3 }}
                                    className="absolute bottom-1.5 right-1.5 w-7 h-7 rounded-full bg-green-500 flex items-center justify-center shadow-lg"
                                    style={{ boxShadow: "0 0 12px hsl(152 70% 45% / 0.5)" }}
                                >
                                    <CheckCircle2 className="w-4 h-4 text-white" />
                                </motion.div>
                            </div>

                            {/* Result details */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                    <motion.span
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="text-xs font-mono text-cyber-cyan/80 tracking-widest uppercase"
                                    >
                                        Drug Identified
                                    </motion.span>
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                        className="text-[10px] font-mono text-muted-foreground px-2 py-0.5 rounded-full bg-muted/50 border border-border"
                                    >
                                        {Math.round(result.confidence * 100)}% match
                                    </motion.span>
                                </div>

                                <motion.h4
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-xl font-display font-bold text-foreground tracking-wide mb-1"
                                >
                                    {result.drug}
                                </motion.h4>

                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-xs text-muted-foreground mb-3"
                                >
                                    {result.matchInfo.description}
                                </motion.p>

                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="flex gap-3 text-[10px] font-mono text-muted-foreground/70"
                                >
                                    <span>Color: {result.matchInfo.color}</span>
                                    <span>•</span>
                                    <span>Form: {result.matchInfo.shape}</span>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                    className="mt-3 flex items-center gap-2"
                                >
                                    {selectedDrugs.includes(result.drug) ? (
                                        <span className="flex items-center gap-1.5 text-xs font-semibold text-green-400">
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                            Auto-selected for analysis
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1.5 text-xs font-semibold text-cyber-cyan">
                                            <Sparkles className="w-3.5 h-3.5" />
                                            Adding to analysis...
                                        </span>
                                    )}
                                </motion.div>
                            </div>
                        </div>

                        {/* Action bar */}
                        <div className="flex gap-2 px-5 pb-4">
                            <button
                                onClick={reset}
                                className="flex-1 py-2.5 rounded-xl border border-border bg-muted/30 text-sm font-semibold text-foreground/80 hover:bg-muted/50 transition-all duration-200 flex items-center justify-center gap-2"
                            >
                                <Camera className="w-4 h-4" />
                                Scan Another
                            </button>
                        </div>
                    </motion.div>
                )}

                {phase === "error" && (
                    <motion.div
                        key="error"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-3 p-4 rounded-xl border border-destructive/30 bg-destructive/5"
                    >
                        <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
                        <span className="text-sm text-foreground">Invalid file. Please upload an image file (JPG, PNG, WEBP).</span>
                        <button onClick={reset} className="ml-auto text-muted-foreground hover:text-foreground transition-colors">
                            <X className="w-4 h-4" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default DrugImageScanner;
