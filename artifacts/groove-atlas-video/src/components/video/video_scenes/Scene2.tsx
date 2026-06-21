import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene2() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 800),
      setTimeout(() => setPhase(2), 2500),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center bg-[var(--color-bg-dark)]"
      initial={{ clipPath: 'circle(0% at 100% 50%)' }}
      animate={{ clipPath: 'circle(150% at 100% 50%)' }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200, delay: 0.3 }}
          className="mb-12"
        >
          <h2 
            className="text-[15vw] leading-none text-[var(--color-text-inverse)] font-bold tracking-tighter"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            169
          </h2>
          <p 
            className="text-[3vw] uppercase tracking-[0.2em] text-[var(--color-primary)]"
            style={{ fontFamily: 'var(--font-label)' }}
          >
            Drummers Catalogued
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 50 }}
          animate={phase >= 1 ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.5, y: 50 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        >
          <h2 
            className="text-[15vw] leading-none text-stroke-inverse font-bold tracking-tighter"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            407
          </h2>
          <p 
            className="text-[3vw] uppercase tracking-[0.2em] text-[var(--color-bg-muted)]"
            style={{ fontFamily: 'var(--font-label)' }}
          >
            Songs Analyzed
          </p>
        </motion.div>

        <motion.div 
          className="absolute bottom-[10vh] left-0 w-full text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-[1.5vw] text-[var(--color-bg-light)] opacity-60" style={{ fontFamily: 'var(--font-body)' }}>
            Across Jazz, Funk, Rock, Latin, Soul, and Hip-Hop history.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}