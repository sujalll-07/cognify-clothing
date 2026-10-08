import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useProgress } from '@react-three/drei';

import HeroScene from '../../3d/HeroScene';

const textVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 1.2 + i * 0.15, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

export default function HeroSection() {
  const { progress } = useProgress();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (progress === 100) {
      const timer = setTimeout(() => setIsLoaded(true), 500);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  useEffect(() => {
    if (!isLoaded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isLoaded]);

  return (
    <>
      <motion.div 
        className="fixed top-0 left-0 w-full h-[100vh] bg-[#0D0D0D] z-50 flex items-center justify-center pointer-events-none"
        initial={{ y: 0 }}
        animate={{ y: isLoaded ? '-100%' : 0 }}
        transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.5 }}
      >
        <motion.div 
          animate={{ opacity: isLoaded ? 0 : 1 }}
          transition={{ duration: 0.5 }}
          className="text-cognify-gray tracking-[0.3em] uppercase text-xs font-medium flex flex-col items-center gap-4"
        >
          <span>Loading Experience</span>
          <div className="w-32 h-[1px] bg-cognify-border overflow-hidden relative">
            <motion.div 
              className="absolute top-0 left-0 bottom-0 bg-cognify-olive"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </motion.div>
      </motion.div>
      <section className="hero-section relative min-h-screen flex items-center overflow-hidden">
        <HeroScene />
      <div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 pt-32 pb-24 md:pt-40 md:pb-32 w-full">
        <div className="max-w-xl">
          {/* Label */}
          <motion.div
            custom={0}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            variants={textVariants}
            className="flex items-center gap-2 mb-6"
          >
            <div className="w-8 h-px bg-cognify-olive" />
            <span className="text-xs tracking-[0.3em] uppercase text-cognify-olive font-medium">
              New Collection
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            custom={1}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            variants={textVariants}
            className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter text-cognify-white leading-[0.95] mb-6"
          >
            STREET
            <br />
            <span className="text-cognify-offwhite">WEAR</span>
            <br />
            REIMAGINED
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            custom={2}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            variants={textVariants}
            className="text-cognify-gray text-sm md:text-base tracking-widest uppercase mb-10"
          >
            More than clothing. It's a mindset.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            custom={3}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            variants={textVariants}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link to="/shop" className="btn-primary flex items-center justify-center gap-2 group">
              Shop Now
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/shop" className="btn-secondary flex items-center justify-center gap-2">
              Explore Collection
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            custom={4}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            variants={textVariants}
            className="flex items-center gap-8 mt-16"
          >
            {[
              { value: '20+', label: 'Products' },
              { value: '4.6★', label: 'Avg Rating' },
              { value: 'Free', label: 'Returns' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-xl font-bold text-cognify-offwhite">{value}</div>
                <div className="text-xs text-cognify-gray tracking-widest uppercase">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-cognify-gray tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-px h-8 bg-gradient-to-b from-cognify-gray to-transparent"
        />
      </motion.div>
    </section>
    </>
  );
}
