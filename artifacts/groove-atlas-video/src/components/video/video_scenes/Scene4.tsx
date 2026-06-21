import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const APIs = [
  { name: 'Cyanite', desc: 'Audio AI & Sonic Fingerprints' },
  { name: 'Songstats', desc: 'Streaming Stats & Analytics' },
  { name: 'LALAL.AI', desc: 'Stem Separation & Isolation' },
  { name: 'Musixmatch', desc: 'Global Metadata' },
  { name: 'Deezer', desc: '30s Audio Previews' }
];

export function Scene4() {
  const [phase, setPhase] = useState(-1);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(0), 500), // title
      setTimeout(() => setPhase(1), 1500), // Cyanite
      setTimeout(() => setPhase(2), 2500), // Songstats
      setTimeout(() => setPhase(3), 3500), // LALAL.AI
      setTimeout(() => setPhase(4), 4500), // Musixmatch
      setTimeout(() => setPhase(5), 5500), // Deezer
      setTimeout(() => setPhase(6), 8000), // Exit
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col justify-center pl-[10vw]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ scale: 2, opacity: 0, filter: 'blur(20px)' }}
      transition={{ duration: 1 }}
    >
      <motion.p
        className="text-[2.5vw] uppercase tracking-widest text-[var(--color-text-muted)] mb-8"
        style={{ fontFamily: 'var(--font-label)' }}
        initial={{ opacity: 0, y: -20 }}
        animate={phase >= 0 ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
      >
        Powered by 5 Music APIs
      </motion.p>
      
      <div className="flex flex-col gap-6 relative">
        {APIs.map((api, index) => (
          <motion.div
            key={api.name}
            className="flex items-center gap-6"
            initial={{ opacity: 0, x: -100, scale: 0.9 }}
            animate={phase >= index + 1 ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: -100, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          >
            <div className="w-16 h-16 rounded-full bg-[var(--color-primary)] flex-shrink-0" />
            <div className="flex flex-col">
              <h3 
                className="text-[5vw] uppercase leading-none font-bold"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
              >
                {api.name}
              </h3>
              <p 
                className="text-[1.5vw] text-[var(--color-text-secondary)] tracking-wide"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {api.desc}
              </p>
            </div>
          </motion.div>
        ))}
        
        {/* Animated lines connecting them */}
        <motion.div 
          className="absolute left-[31px] top-[32px] w-[2px] bg-[var(--color-primary)] opacity-50 z-[-1]"
          initial={{ height: 0 }}
          animate={phase >= 5 ? { height: 'calc(100% - 64px)' } : { height: 0 }}
          transition={{ duration: 2, ease: 'easeInOut', delay: 1 }}
        />
      </div>
    </motion.div>
  );
}