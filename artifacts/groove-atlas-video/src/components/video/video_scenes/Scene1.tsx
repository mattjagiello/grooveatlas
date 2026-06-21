import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import coverImg from "@assets/generated_images/groove-atlas-cover.png";

export function Scene1() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 2000),
      setTimeout(() => setPhase(3), 3500),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col justify-center px-[10vw]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: '-10vw', filter: 'blur(10px)' }}
      transition={{ duration: 1 }}
    >
      <motion.div 
        className="absolute right-0 top-0 w-[50vw] h-[100vh] opacity-30 origin-right pointer-events-none"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
      >
        <img src={coverImg} alt="Cover" className="w-full h-full object-cover mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-bg-light)] to-transparent" />
      </motion.div>

      <motion.div
        initial={{ width: 0 }}
        animate={{ width: '10vw' }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="h-[4px] bg-[var(--color-primary)] mb-8 relative z-10"
      />
      
      <div className="relative z-10">
        <motion.h1 
          className="text-[12vw] font-bold leading-none tracking-tight uppercase"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
        >
          {'GROOVE'.split('').map((char, i) => (
            <motion.span key={`g-${i}`} className="inline-block"
              initial={{ opacity: 0, y: 100, rotateX: 90 }}
              animate={phase >= 1 ? { opacity: 1, y: 0, rotateX: 0 } : {}}
              transition={{ duration: 0.8, delay: i * 0.05, type: 'spring', damping: 20 }}
            >
              {char}
            </motion.span>
          ))}
        </motion.h1>
        
        <motion.h1 
          className="text-[12vw] font-bold leading-none tracking-tight uppercase -mt-4 text-stroke"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {'ATLAS'.split('').map((char, i) => (
            <motion.span key={`a-${i}`} className="inline-block"
              initial={{ opacity: 0, y: 100, rotateX: 90 }}
              animate={phase >= 1 ? { opacity: 1, y: 0, rotateX: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 + (i * 0.05), type: 'spring', damping: 20 }}
            >
              {char}
            </motion.span>
          ))}
        </motion.h1>
      </div>

      <motion.p
        className="text-[3vw] text-[var(--color-text-secondary)] mt-8 max-w-[60vw] relative z-10"
        style={{ fontFamily: 'var(--font-serif)' }}
        initial={{ opacity: 0, x: -50 }}
        animate={phase >= 2 ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        A mobile-first drum history & discovery app.
      </motion.p>
      
      <motion.div
        className="absolute right-[10vw] top-[50vh] transform -translate-y-1/2 z-20"
        initial={{ opacity: 0, scale: 0, rotate: -45 }}
        animate={phase >= 3 ? { opacity: 1, scale: 1, rotate: 15 } : {}}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        <div className="bg-[var(--color-bg-dark)] text-[var(--color-text-inverse)] px-8 py-4 rounded-full border border-[var(--color-primary)]">
          <p style={{ fontFamily: 'var(--font-label)' }} className="text-[2vw] uppercase tracking-wider">Built on Replit</p>
        </div>
      </motion.div>
    </motion.div>
  );
}