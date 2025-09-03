'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface BounceProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export const Bounce: React.FC<BounceProps> = ({ 
  children, 
  delay = 0,
  className = ""
}) => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, scale: 0.3 }}
      animate={inView ? { 
        opacity: 1, 
        scale: 1,
      } : {}}
      transition={{ 
        duration: 0.6,
        delay,
        type: "spring",
        bounce: 0.4
      }}
    >
      {children}
    </motion.div>
  );
};