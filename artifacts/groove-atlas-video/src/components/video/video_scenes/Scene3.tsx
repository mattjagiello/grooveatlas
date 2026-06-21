import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene3() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 1000),
      setTimeout(() => setPhase(2), 2500),
      setTimeout(() => setPhase(3), 4000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col justify-center px-[10vw]"
      initial={{ opacity: 0, x: '20vw' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ x: '-100vw', opacity: 0 }}
      transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
    >
      <motion.p 
        className="text-[2vw] uppercase tracking-widest text-[var(--color-primary)] mb-4"
        style={{ fontFamily: 'var(--font-label)' }}
      >
        The Data Layer
      </motion.p>
      
      <div className="relative h-[25vh]">
        <motion.h2 
          className="text-[8vw] leading-none uppercase font-bold"
          style={{ fontFamily: 'var(--font-display)' }}
          initial={{ opacity: 0, y: 50 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ type: 'spring', damping: 20 }}
        >
          GraphQL Yoga API
        </motion.h2>
        
        <motion.div 
          className="absolute top-0 left-0 w-full h-full flex items-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={phase >= 2 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="w-[100vw] h-[2px] bg-[var(--color-text-primary)] absolute left-[-10vw] origin-left" />
        </motion.div>
      </div>

      <motion.h2 
        className="text-[8vw] leading-none uppercase font-bold text-stroke"
        style={{ fontFamily: 'var(--font-display)' }}
        initial={{ opacity: 0, y: 50 }}
        animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ type: 'spring', damping: 20 }}
      >
        + Typesense Search
      </motion.h2>
      
      <motion.div
        className="absolute right-[10vw] top-[20vh] w-[30vw] h-[60vh] border border-[var(--color-primary)] rounded-3xl opacity-20 pointer-events-none"
        initial={{ rotateY: 90, scale: 0.8 }}
        animate={{ rotateY: 0, scale: 1 }}
        transition={{ duration: 2, ease: 'easeOut' }}
        style={{ perspective: 1000 }}
      >
        {/* Mock API visual representation */}
        <div className="w-full h-full p-8 flex flex-col gap-4">
          <div className="w-full h-8 bg-[var(--color-text-primary)] rounded opacity-50" />
          <div className="w-3/4 h-8 bg-[var(--color-text-primary)] rounded opacity-30" />
          <div className="w-5/6 h-8 bg-[var(--color-text-primary)] rounded opacity-40" />
          <div className="w-full h-8 bg-[var(--color-text-primary)] rounded opacity-20" />
        </div>
      </motion.div>
    </motion.div>
  );
}