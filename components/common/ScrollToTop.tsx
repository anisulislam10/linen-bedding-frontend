import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp } from 'lucide-react';

const ScrollToTop: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            // Show button after 300px
            const winScroll = document.documentElement.scrollTop;
            setIsVisible(winScroll > 300);

            // Calculate progress
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            if (height > 0) {
                setProgress(winScroll / height);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    // SVG Circle properties
    const radius = 20;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - progress * circumference;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.5, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, y: 20 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 z-[150] flex items-center justify-center w-14 h-14 bg-white rounded-full shadow-2xl border border-sage/10 focus:outline-none group"
                    aria-label="Scroll to top"
                >
                    {/* Progress Circle Wrapper */}
                    <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
                        <circle
                            cx="28"
                            cy="28"
                            r={radius}
                            stroke="currentColor"
                            strokeWidth="3"
                            fill="transparent"
                            className="text-sage/10"
                        />
                        <motion.circle
                            cx="28"
                            cy="28"
                            r={radius}
                            stroke="currentColor"
                            strokeWidth="3"
                            fill="transparent"
                            strokeDasharray={circumference}
                            animate={{ strokeDashoffset: offset }}
                            transition={{ duration: 0.1, ease: "linear" }}
                            className="text-sage"
                            strokeLinecap="round"
                        />
                    </svg>

                    <ChevronUp className="h-6 w-6 text-primary group-hover:text-sage transition-colors" />
                </motion.button>
            )}
        </AnimatePresence>
    );
};

export default ScrollToTop;
