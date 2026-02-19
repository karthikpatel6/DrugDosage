import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, AlertCircle, Lightbulb, Check, X, Pill, Sparkles, ChevronRight } from "lucide-react";
import type { SupportedDrug } from "@/lib/types";

interface CustomDrugInputProps {
    onDrugAdded: (drug: SupportedDrug) => void;
    selectedDrugs: SupportedDrug[];
}

// Extended drug name database for fuzzy matching
const DRUG_DATABASE: {
    canonical: SupportedDrug;
    aliases: string[];
    category: string;
}[] = [
        {
            canonical: "CODEINE",
            aliases: [
                "codeine", "codien", "codine", "codein", "codeene", "coedine", "codiene",
                "tylenol 3", "tylenol3", "co-codamol", "cocodamol", "codeine phosphate",
                "methylmorphine", "codipar", "codiphen", "panadeine",
            ],
            category: "Opioid analgesic",
        },
        {
            canonical: "WARFARIN",
            aliases: [
                "warfarin", "warfrin", "warfarine", "worfarin", "warfaran", "warferin",
                "coumadin", "jantoven", "marevan", "waran", "warfilone",
                "warfarin sodium", "warfarin potassium",
            ],
            category: "Anticoagulant",
        },
        {
            canonical: "CLOPIDOGREL",
            aliases: [
                "clopidogrel", "clopidogrl", "clopidogral", "clopidogel", "clopidorel",
                "clopidogrell", "clpidogrel", "clopidogre", "clopidgrel",
                "plavix", "iscover", "clopivas", "clopilet", "deplatt",
                "clopidogrel bisulfate", "clopidogrel bisulphate",
            ],
            category: "Antiplatelet",
        },
        {
            canonical: "SIMVASTATIN",
            aliases: [
                "simvastatin", "simvastain", "simvastin", "simvastaton", "simvastatine",
                "simvastein", "simvstation", "simvastattin", "simvastati",
                "zocor", "simvacor", "simvacard", "simvador", "simlup",
            ],
            category: "Statin (cholesterol)",
        },
        {
            canonical: "AZATHIOPRINE",
            aliases: [
                "azathioprine", "azathioprin", "azathioprne", "azathioprime",
                "azathiprine", "azathiopirne", "azathioprrine", "azathioprinee",
                "imuran", "azasan", "imurel", "azapress", "thioprine",
            ],
            category: "Immunosuppressant",
        },
        {
            canonical: "FLUOROURACIL",
            aliases: [
                "fluorouracil", "fluorourasil", "fluorouracl", "floruracil",
                "flourouracil", "fluourouracil", "fluouracil", "fluororacil",
                "5-fu", "5fu", "adrucil", "efudex", "carac", "fluoroplex",
                "five-fu", "5-fluorouracil",
            ],
            category: "Chemotherapy",
        },
    ];

// Levenshtein distance for fuzzy matching
function levenshtein(a: string, b: string): number {
    const matrix: number[][] = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }
    return matrix[b.length][a.length];
}

interface DrugMatch {
    drug: SupportedDrug;
    alias: string;
    distance: number;
    category: string;
    matchType: "exact" | "alias" | "fuzzy";
}

function findDrugMatches(input: string): DrugMatch[] {
    const query = input.trim().toLowerCase();
    if (!query || query.length < 2) return [];

    const matches: DrugMatch[] = [];

    for (const entry of DRUG_DATABASE) {
        // Exact canonical match
        if (entry.canonical.toLowerCase() === query) {
            matches.push({
                drug: entry.canonical,
                alias: entry.canonical,
                distance: 0,
                category: entry.category,
                matchType: "exact",
            });
            continue;
        }

        // Exact alias match
        const exactAlias = entry.aliases.find(a => a === query);
        if (exactAlias) {
            matches.push({
                drug: entry.canonical,
                alias: exactAlias,
                distance: 0,
                category: entry.category,
                matchType: "alias",
            });
            continue;
        }

        // Fuzzy matching against canonical
        const canonDist = levenshtein(query, entry.canonical.toLowerCase());
        if (canonDist <= 3 || (query.length > 4 && canonDist <= Math.floor(query.length * 0.4))) {
            matches.push({
                drug: entry.canonical,
                alias: entry.canonical,
                distance: canonDist,
                category: entry.category,
                matchType: "fuzzy",
            });
            continue;
        }

        // Fuzzy matching against aliases
        let bestAliasDist = Infinity;
        let bestAlias = "";
        for (const alias of entry.aliases) {
            const dist = levenshtein(query, alias);
            if (dist < bestAliasDist) {
                bestAliasDist = dist;
                bestAlias = alias;
            }
            // Substring match
            if (alias.includes(query) || query.includes(alias)) {
                bestAliasDist = 1;
                bestAlias = alias;
                break;
            }
        }

        if (bestAliasDist <= 3 || (query.length > 4 && bestAliasDist <= Math.floor(query.length * 0.35))) {
            matches.push({
                drug: entry.canonical,
                alias: bestAlias,
                distance: bestAliasDist,
                category: entry.category,
                matchType: "fuzzy",
            });
        }
    }

    return matches.sort((a, b) => a.distance - b.distance).slice(0, 3);
}

const CustomDrugInput = ({ onDrugAdded, selectedDrugs }: CustomDrugInputProps) => {
    const [query, setQuery] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [addedFeedback, setAddedFeedback] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const matches = useMemo(() => findDrugMatches(query), [query]);

    const hasExactMatch = matches.some(m => m.matchType === "exact" || m.matchType === "alias");
    const isAlreadySelected = matches.length > 0 && selectedDrugs.includes(matches[0].drug);

    const handleSelectMatch = useCallback((match: DrugMatch) => {
        if (selectedDrugs.includes(match.drug)) {
            setShowError(true);
            setErrorMsg(`${match.drug} is already selected for analysis.`);
            setTimeout(() => setShowError(false), 3000);
            return;
        }

        onDrugAdded(match.drug);
        setAddedFeedback(match.drug);
        setQuery("");
        setTimeout(() => setAddedFeedback(null), 2500);
    }, [selectedDrugs, onDrugAdded]);

    const handleSubmit = useCallback((e?: React.FormEvent) => {
        e?.preventDefault();
        const trimmed = query.trim();
        if (!trimmed) return;

        if (matches.length > 0) {
            handleSelectMatch(matches[0]);
        } else {
            setShowError(true);
            setErrorMsg(
                `"${trimmed}" is not recognized as a supported drug. Our system currently supports 6 pharmacogenomic drugs. Please check the spelling or try a brand name.`
            );
            setTimeout(() => setShowError(false), 5000);
        }
    }, [query, matches, handleSelectMatch]);

    const showSuggestions = isFocused && query.length >= 2 && matches.length > 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-cyber-purple/10 flex items-center justify-center border border-cyber-purple/20">
                    <Search className="w-4 h-4 text-cyber-purple" />
                </div>
                <div className="flex-1">
                    <label className="block text-sm font-semibold text-foreground font-display tracking-wide">
                        Search Another Drug
                    </label>
                    <span className="text-xs text-muted-foreground">
                        Type any drug name — we'll find the best match
                    </span>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground/40 tracking-wider uppercase">
                    Optional
                </span>
            </div>

            <form onSubmit={handleSubmit} className="relative">
                <div
                    className={`relative flex items-center rounded-xl border-2 transition-all duration-300 overflow-hidden ${isFocused
                            ? "border-cyber-purple/40 bg-cyber-purple/[0.03] shadow-[0_0_20px_hsl(270_80%_60%_/_0.06)]"
                            : "border-border/60 bg-card/30 hover:border-foreground/15"
                        }`}
                >
                    <div className="pl-4 pr-2">
                        <Pill className={`w-4 h-4 transition-colors duration-300 ${isFocused ? "text-cyber-purple/70" : "text-muted-foreground/40"}`} />
                    </div>

                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setShowError(false);
                        }}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                        placeholder="Enter drug name (e.g. plavix, coumadin, zocor...)"
                        className="flex-1 py-4 px-2 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/30 focus:outline-none font-mono tracking-wide"
                    />

                    {query && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            type="button"
                            onClick={() => { setQuery(""); setShowError(false); }}
                            className="mr-2 w-7 h-7 rounded-lg bg-muted/30 flex items-center justify-center text-muted-foreground/60 hover:text-foreground hover:bg-muted/50 transition-all"
                        >
                            <X className="w-3.5 h-3.5" />
                        </motion.button>
                    )}

                    <motion.button
                        type="submit"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        disabled={!query.trim()}
                        className={`mr-2 px-4 py-2 rounded-lg text-xs font-display font-bold tracking-wider uppercase transition-all duration-300 flex items-center gap-1.5 ${query.trim()
                                ? "gradient-accent text-accent-foreground glow-teal-sm"
                                : "bg-muted/20 text-muted-foreground/30 cursor-not-allowed"
                            }`}
                    >
                        <Plus className="w-3.5 h-3.5" />
                        Add
                    </motion.button>
                </div>

                {/* Suggestions dropdown */}
                <AnimatePresence>
                    {showSuggestions && (
                        <motion.div
                            initial={{ opacity: 0, y: -5, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -5, scale: 0.98 }}
                            transition={{ duration: 0.2 }}
                            className="absolute left-0 right-0 top-full mt-2 z-20 glass-panel-strong rounded-xl overflow-hidden shadow-[0_10px_40px_hsl(225_20%_4%_/_0.6)]"
                        >
                            <div className="p-2">
                                <div className="px-3 py-1.5 mb-1">
                                    <span className="text-[10px] font-display font-bold text-muted-foreground/50 tracking-[0.15em] uppercase">
                                        {hasExactMatch ? "Match Found" : "Did you mean...?"}
                                    </span>
                                </div>

                                {matches.map((match, i) => {
                                    const isSelected = selectedDrugs.includes(match.drug);
                                    return (
                                        <motion.button
                                            key={match.drug}
                                            type="button"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            onClick={() => handleSelectMatch(match)}
                                            disabled={isSelected}
                                            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all duration-200 group ${isSelected
                                                    ? "opacity-40 cursor-not-allowed"
                                                    : "hover:bg-foreground/[0.03] cursor-pointer"
                                                }`}
                                        >
                                            {/* Match quality indicator */}
                                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${match.matchType === "exact" || match.matchType === "alias"
                                                    ? "bg-risk-safe/10 border border-risk-safe/20"
                                                    : "bg-cyber-purple/10 border border-cyber-purple/20"
                                                }`}>
                                                {match.matchType === "exact" || match.matchType === "alias" ? (
                                                    <Check className="w-4 h-4 text-risk-safe" />
                                                ) : (
                                                    <Lightbulb className="w-4 h-4 text-cyber-purple" />
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-display font-bold text-foreground tracking-wide">
                                                        {match.drug}
                                                    </span>
                                                    {match.matchType === "fuzzy" && (
                                                        <span className="text-[9px] font-mono text-cyber-purple/60 bg-cyber-purple/10 px-1.5 py-0.5 rounded tracking-wider">
                                                            SUGGESTION
                                                        </span>
                                                    )}
                                                    {match.matchType === "alias" && (
                                                        <span className="text-[9px] font-mono text-risk-safe/60 bg-risk-safe/10 px-1.5 py-0.5 rounded tracking-wider">
                                                            BRAND MATCH
                                                        </span>
                                                    )}
                                                    {isSelected && (
                                                        <span className="text-[9px] font-mono text-muted-foreground bg-muted/30 px-1.5 py-0.5 rounded tracking-wider">
                                                            SELECTED
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-xs text-muted-foreground/60 mt-0.5 block">
                                                    {match.category}
                                                    {match.matchType === "fuzzy" && match.alias !== match.drug.toLowerCase() && (
                                                        <> · matched "{match.alias}"</>
                                                    )}
                                                </span>
                                            </div>

                                            {!isSelected && (
                                                <ChevronRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-cyber-cyan/50 transition-colors" />
                                            )}
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </form>

            {/* Error message */}
            <AnimatePresence>
                {showError && (
                    <motion.div
                        initial={{ opacity: 0, y: -5, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: "auto" }}
                        exit={{ opacity: 0, y: -5, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-3 p-4 rounded-xl border border-destructive/20 bg-destructive/5 overflow-hidden"
                    >
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-destructive/80 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm text-foreground/80 font-medium">{errorMsg}</p>
                                {query.trim() && matches.length === 0 && (
                                    <div className="mt-3">
                                        <span className="text-[10px] font-display font-bold text-muted-foreground/50 tracking-[0.15em] uppercase block mb-2">
                                            Supported Drugs
                                        </span>
                                        <div className="flex flex-wrap gap-1.5">
                                            {(["CODEINE", "WARFARIN", "CLOPIDOGREL", "SIMVASTATIN", "AZATHIOPRINE", "FLUOROURACIL"] as SupportedDrug[]).map(d => (
                                                <button
                                                    key={d}
                                                    type="button"
                                                    onClick={() => {
                                                        if (!selectedDrugs.includes(d)) {
                                                            onDrugAdded(d);
                                                            setAddedFeedback(d);
                                                            setQuery("");
                                                            setShowError(false);
                                                            setTimeout(() => setAddedFeedback(null), 2500);
                                                        }
                                                    }}
                                                    className={`text-[10px] font-mono px-2 py-1 rounded-lg border transition-all ${selectedDrugs.includes(d)
                                                            ? "border-border/30 text-muted-foreground/30 cursor-not-allowed"
                                                            : "border-border/50 text-foreground/60 hover:border-cyber-cyan/30 hover:text-cyber-cyan cursor-pointer"
                                                        }`}
                                                >
                                                    {d}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Success feedback */}
            <AnimatePresence>
                {addedFeedback && (
                    <motion.div
                        initial={{ opacity: 0, y: -5, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: "auto" }}
                        exit={{ opacity: 0, y: -5, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-3 p-3 rounded-xl border border-risk-safe/20 bg-risk-safe/5 overflow-hidden"
                    >
                        <div className="flex items-center gap-2.5">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                                className="w-7 h-7 rounded-full bg-risk-safe/20 flex items-center justify-center"
                            >
                                <Sparkles className="w-3.5 h-3.5 text-risk-safe" />
                            </motion.div>
                            <span className="text-sm font-semibold text-risk-safe/80">
                                {addedFeedback} added to analysis queue!
                            </span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default CustomDrugInput;
