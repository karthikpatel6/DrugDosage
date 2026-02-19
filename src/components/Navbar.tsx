import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Dna, Activity, Shield, Menu, X, FlaskConical, Cpu, Zap } from "lucide-react";

interface NavbarProps {
    onGetStarted: () => void;
}

const Navbar = ({ onGetStarted }: NavbarProps) => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        setScrolled(latest > 50);
    });

    return (
        <>
            <motion.header
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                        ? "py-2"
                        : "py-4"
                    }`}
            >
                <div
                    className={`mx-auto max-w-7xl px-4 sm:px-6 transition-all duration-500 ${scrolled ? "" : ""
                        }`}
                >
                    <div
                        className={`flex items-center justify-between rounded-2xl px-5 py-3 transition-all duration-500 ${scrolled
                                ? "glass-panel-strong shadow-[0_4px_30px_hsl(225_20%_4%_/_0.5)]"
                                : "bg-transparent"
                            }`}
                    >
                        {/* Logo */}
                        <motion.div
                            className="flex items-center gap-3 cursor-pointer group"
                            whileHover={{ scale: 1.02 }}
                            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                        >
                            {/* Animated Logo Icon */}
                            <div className="relative">
                                <motion.div
                                    className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center relative overflow-hidden"
                                    style={{ boxShadow: "0 0 20px hsl(175 100% 50% / 0.2)" }}
                                    whileHover={{ rotate: 180 }}
                                    transition={{ duration: 0.6 }}
                                >
                                    <Dna className="w-5 h-5 text-accent-foreground relative z-10" />
                                    {/* Inner glow */}
                                    <motion.div
                                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="absolute inset-0 bg-white/5"
                                    />
                                </motion.div>
                                {/* Pulse ring */}
                                <motion.div
                                    animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                    className="absolute inset-0 rounded-xl border border-cyber-cyan/30"
                                />
                            </div>

                            {/* Company Name */}
                            <div className="flex flex-col">
                                <span className="text-lg font-display font-bold tracking-wider text-foreground leading-tight">
                                    Pharma<span className="text-gradient-brand">Guard</span>
                                </span>
                                <span className="text-[9px] font-mono text-muted-foreground/40 tracking-[0.25em] uppercase leading-tight">
                                    Genomic Intelligence
                                </span>
                            </div>
                        </motion.div>

                        {/* Center Navigation - Desktop */}
                        <nav className="hidden md:flex items-center gap-1">
                            {[
                                { label: "Analysis", icon: FlaskConical },
                                { label: "Pharmacogenes", icon: Dna },
                                { label: "AI Engine", icon: Cpu },
                            ].map(({ label, icon: Icon }, index) => (
                                <motion.button
                                    key={label}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 + index * 0.08 }}
                                    onClick={onGetStarted}
                                    className="group relative px-4 py-2 rounded-lg text-sm font-semibold text-foreground/50 hover:text-foreground/90 transition-all duration-300 flex items-center gap-2"
                                >
                                    <Icon className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-cyber-cyan/60 transition-colors" />
                                    <span className="tracking-wide">{label}</span>
                                    {/* Hover underline */}
                                    <motion.div
                                        className="absolute bottom-0.5 left-4 right-4 h-px bg-cyber-cyan/0 group-hover:bg-cyber-cyan/30 transition-all duration-300"
                                    />
                                </motion.button>
                            ))}
                        </nav>

                        {/* Right section */}
                        <div className="flex items-center gap-3">
                            {/* System status indicator */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-risk-safe/5 border border-risk-safe/15"
                            >
                                <motion.div
                                    animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="w-1.5 h-1.5 rounded-full bg-risk-safe shadow-[0_0_6px_hsl(152_70%_45%_/_0.5)]"
                                />
                                <span className="text-[10px] font-mono text-risk-safe/70 tracking-widest uppercase">
                                    Online
                                </span>
                            </motion.div>

                            {/* CTA Button */}
                            <motion.button
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 }}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={onGetStarted}
                                className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-accent text-accent-foreground text-xs font-display font-bold tracking-wider uppercase glow-teal-sm transition-all duration-300"
                            >
                                <Zap className="w-3.5 h-3.5" />
                                Analyze
                            </motion.button>

                            {/* Mobile menu toggle */}
                            <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="md:hidden w-9 h-9 rounded-lg bg-muted/30 flex items-center justify-center text-foreground/60 hover:text-foreground hover:bg-muted/50 transition-all"
                                onClick={() => setMobileOpen(!mobileOpen)}
                            >
                                {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                            </motion.button>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                <AnimatePresence>
                    {mobileOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            className="mx-4 mt-2 overflow-hidden"
                        >
                            <div className="glass-panel-strong rounded-2xl p-4 space-y-2">
                                {[
                                    { label: "Start Analysis", icon: FlaskConical },
                                    { label: "Pharmacogenes", icon: Dna },
                                    { label: "AI Engine", icon: Cpu },
                                ].map(({ label, icon: Icon }) => (
                                    <button
                                        key={label}
                                        onClick={() => {
                                            onGetStarted();
                                            setMobileOpen(false);
                                        }}
                                        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold text-foreground/70 hover:text-foreground hover:bg-foreground/[0.03] transition-all"
                                    >
                                        <Icon className="w-4 h-4 text-cyber-cyan/50" />
                                        {label}
                                    </button>
                                ))}
                                <div className="pt-2 border-t border-border/30">
                                    <button
                                        onClick={() => {
                                            onGetStarted();
                                            setMobileOpen(false);
                                        }}
                                        className="w-full py-3 rounded-xl gradient-accent text-accent-foreground text-sm font-display font-bold tracking-wider uppercase glow-teal-sm"
                                    >
                                        <Zap className="w-4 h-4 inline mr-2" />
                                        Quick Analyze
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.header>
        </>
    );
};

export default Navbar;
