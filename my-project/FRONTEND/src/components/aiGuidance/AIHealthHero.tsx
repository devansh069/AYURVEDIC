// src/components/aiGuidance/AIHealthHero.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { FiBot, FiHeart, FiDroplet, FiCheckCircle } from 'react-icons/fi';

const badges = [
  { icon: <FiBot className="w-5 h-5" />, label: 'AI Recommendations' },
  { icon: <FiHeart className="w-5 h-5" />, label: 'Dosha Intelligence' },
  { icon: <FiDroplet className="w-5 h-5" />, label: 'Recovery Guidance' },
  { icon: <FiCheckCircle className="w-5 h-5" />, label: 'Personalized Wellness' },
];

const AIHealthHero: React.FC = () => {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center bg-gradient-to-r from-primary/10 via-secondary/5 to-accent/10 overflow-hidden">
      {/* Floating health cards */}
      <motion.div
        className="absolute top-10 left-10 w-32 h-32 bg-white/30 backdrop-blur-lg rounded-xl shadow-lg border border-white/20"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 12, ease: 'linear' }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-24 h-24 bg-white/30 backdrop-blur-lg rounded-xl shadow-lg border border-white/20"
        animate={{ y: [-20, 20, -20] }}
        transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
      />
      <div className="relative z-10 text-center px-4 max-w-4xl">
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-primary"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          AI Powered Ayurveda Health Guidance
        </motion.h1>
        <motion.p
          className="mt-4 text-lg md:text-xl text-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Receive personalized wellness recommendations, health insights, recovery guidance, diet plans, lifestyle suggestions and Ayurveda intelligence powered by smart health analysis.
        </motion.p>
        <motion.div className="mt-6 flex flex-col sm:flex-row justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <button className="px-6 py-2 bg-primary text-white rounded-full hover:bg-primary/80 transition">
            Start Health Analysis
          </button>
          <button className="px-6 py-2 bg-accent text-white rounded-full hover:bg-accent/80 transition">
            Explore Wellness Plans
          </button>
        </motion.div>
        <motion.div className="mt-8 flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          {badges.map((b, i) => (
            <span key={i} className="flex items-center gap-1 px-3 py-1 bg-white/30 backdrop-blur-md rounded-full text-sm font-medium text-text">
              {b.icon}{b.label}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default AIHealthHero;
