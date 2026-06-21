import { motion, AnimatePresence } from 'framer-motion';
import { useVideoPlayer } from '@/lib/video';
import { Scene1 } from './video_scenes/Scene1';
import { Scene2 } from './video_scenes/Scene2';
import { Scene3 } from './video_scenes/Scene3';
import { Scene4 } from './video_scenes/Scene4';
import { Scene5 } from './video_scenes/Scene5';

const SCENE_DURATIONS = {
  open: 6000,
  scale: 6000,
  tech: 8000,
  apis: 12000,
  close: 8000
};

export default function VideoTemplate() {
  const { currentScene } = useVideoPlayer({ durations: SCENE_DURATIONS });

  return (
    <div className="relative w-full h-screen overflow-hidden" style={{ backgroundColor: 'var(--color-bg-light)' }}>
      {/* Persistent background layers */}
      <div className="absolute inset-0">
        <motion.div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/stucco.png")' }}
        />
        
        {/* Animated gradient blob */}
        <motion.div 
          className="absolute w-[80vw] h-[80vw] rounded-full blur-[100px] opacity-20"
          style={{ background: 'var(--color-primary)' }}
          animate={{ 
            x: ['-20vw', '40vw', '10vw'], 
            y: ['-20vh', '30vh', '-10vh'],
            scale: [1, 1.2, 0.9]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
        
        <motion.div 
          className="absolute w-[60vw] h-[60vw] rounded-full blur-[120px] opacity-10 right-0 bottom-0"
          style={{ background: 'var(--color-text-primary)' }}
          animate={{ 
            x: ['10vw', '-30vw', '0vw'], 
            y: ['10vh', '-40vh', '0vh']
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <AnimatePresence mode="popLayout">
        {currentScene === 0 && <Scene1 key="open" />}
        {currentScene === 1 && <Scene2 key="scale" />}
        {currentScene === 2 && <Scene3 key="tech" />}
        {currentScene === 3 && <Scene4 key="apis" />}
        {currentScene === 4 && <Scene5 key="close" />}
      </AnimatePresence>
    </div>
  );
}