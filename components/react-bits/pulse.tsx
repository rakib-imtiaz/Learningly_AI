'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface PulseProps {
  children: React.ReactNode;
  className?: string;
  scale?: number;
  duration?: number;
}

export const Pulse: React.FC<PulseProps> = ({ 
  children, 
  className = "",
  scale = 1.05,
  duration = 2
}) => {
  const { ref, inView } = useInView({
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      className={className}
      animate={inView ? {
        scale: [1, scale, 1],
      } : {}}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
};