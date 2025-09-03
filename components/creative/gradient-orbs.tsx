'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface GradientOrbsProps {
  className?: string;
}

export const GradientOrbs: React.FC<GradientOrbsProps> = ({ className = "" }) => {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Large orb */}
      <motion.div
        className="absolute w-96 h-96 rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(147, 51, 234, 0.4) 0%, rgba(59, 130, 246, 0.4) 50%, transparent 100%)',
          left: '-10%',
          top: '-10%',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Medium orb */}
      <motion.div
        className="absolute w-64 h-64 rounded-full opacity-25"
        style={{
          background: 'radial-gradient(circle, rgba(236, 72, 153, 0.4) 0%, rgba(168, 85, 247, 0.4) 50%, transparent 100%)',
          right: '-5%',
          top: '20%',
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.25, 0.4, 0.25],
          x: [0, -20, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />
      
      {/* Small orb */}
      <motion.div
        className="absolute w-48 h-48 rounded-full opacity-30"
        style={{
          background: 'radial-gradient(circle, rgba(34, 197, 94, 0.4) 0%, rgba(59, 130, 246, 0.4) 50%, transparent 100%)',
          left: '60%',
          bottom: '10%',
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 4,
        }}
      />
    </div>
  );
};