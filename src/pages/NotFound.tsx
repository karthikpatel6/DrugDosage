import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background cyber-grid relative overflow-hidden">
      {/* Background orbs */}
      <motion.div
        animate={{ x: [0, 20, -10, 0], y: [0, -15, 10, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute top-1/4 left-1/4 w-[300px] h-[300px] rounded-full"
        style={{ background: "radial-gradient(circle, hsl(0 80% 55% / 0.05), transparent 70%)", filter: "blur(40px)" }}
      />

      <div className="text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-destructive/70" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-3 text-6xl font-display font-black text-foreground tracking-tight"
        >
          4<span className="text-gradient-brand">0</span>4
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-2 text-xl text-foreground/70 font-display tracking-wide"
        >
          Route Not Found
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-8 text-sm text-muted-foreground font-mono"
        >
          {location.pathname}
        </motion.p>

        <motion.a
          href="/"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-2 gradient-accent text-accent-foreground px-6 py-3 rounded-xl font-display font-bold tracking-wider uppercase text-sm glow-teal-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Base
        </motion.a>
      </div>
    </div>
  );
};

export default NotFound;
