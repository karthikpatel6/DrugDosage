import { motion } from "framer-motion";

const CyberHUD = () => {
    return (
        <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
            {/* Top-left HUD corner */}
            <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="absolute top-4 left-4"
            >
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                    <path d="M0 20 L0 0 L20 0" stroke="hsl(175 100% 50%)" strokeWidth="1.5" strokeOpacity="0.4" />
                    <path d="M0 30 L0 10 L10 10" stroke="hsl(175 100% 50%)" strokeWidth="0.5" strokeOpacity="0.2" />
                </svg>
            </motion.div>

            {/* Top-right HUD corner */}
            <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="absolute top-4 right-4"
            >
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                    <path d="M80 20 L80 0 L60 0" stroke="hsl(175 100% 50%)" strokeWidth="1.5" strokeOpacity="0.4" />
                    <path d="M80 30 L80 10 L70 10" stroke="hsl(175 100% 50%)" strokeWidth="0.5" strokeOpacity="0.2" />
                </svg>
            </motion.div>

            {/* Bottom-left HUD corner */}
            <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.7 }}
                className="absolute bottom-4 left-4"
            >
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                    <path d="M0 60 L0 80 L20 80" stroke="hsl(175 100% 50%)" strokeWidth="1.5" strokeOpacity="0.4" />
                </svg>
            </motion.div>

            {/* Bottom-right HUD corner */}
            <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.7 }}
                className="absolute bottom-4 right-4"
            >
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                    <path d="M80 60 L80 80 L60 80" stroke="hsl(175 100% 50%)" strokeWidth="1.5" strokeOpacity="0.4" />
                </svg>
            </motion.div>

            {/* Side scan lines */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.15 }}
                transition={{ duration: 2, delay: 1 }}
                className="absolute left-0 top-0 bottom-0 w-px"
                style={{
                    background: `repeating-linear-gradient(
            180deg,
            transparent,
            transparent 8px,
            hsl(175 100% 50% / 0.3) 8px,
            hsl(175 100% 50% / 0.3) 9px
          )`,
                }}
            />
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.15 }}
                transition={{ duration: 2, delay: 1 }}
                className="absolute right-0 top-0 bottom-0 w-px"
                style={{
                    background: `repeating-linear-gradient(
            180deg,
            transparent,
            transparent 8px,
            hsl(175 100% 50% / 0.3) 8px,
            hsl(175 100% 50% / 0.3) 9px
          )`,
                }}
            />
        </div>
    );
};

export default CyberHUD;
