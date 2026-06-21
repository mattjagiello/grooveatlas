import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene5() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 1000),
      setTimeout(() => setPhase(2), 2500),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center bg-[var(--color-bg-dark)] overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
    >
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,var(--color-primary)_0%,transparent_70%)]" />
      
      <div className="text-center flex flex-col items-center z-10 relative">
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        >
          <h1 
            className="text-[15vw] font-bold leading-none tracking-tight uppercase text-[var(--color-text-inverse)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            GROOVE<br/>ATLAS
          </h1>
        </motion.div>
        
        <motion.div
          className="h-[2px] bg-[var(--color-primary)] mt-8 mb-8"
          initial={{ width: 0 }}
          animate={phase >= 1 ? { width: '40vw' } : { width: 0 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
        />
        
        <motion.p
          className="text-[3vw] text-[var(--color-primary)] uppercase tracking-[0.2em]"
          style={{ fontFamily: 'var(--font-label)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 1 }}
        >
          The encyclopedia of rhythm
        </motion.p>
      </div>
    </motion.div>
  );
}