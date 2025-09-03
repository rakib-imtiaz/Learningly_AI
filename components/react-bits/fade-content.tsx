'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

interface FadeContentProps {
  children: React.ReactNode;
  blur?: boolean;
  delay?: number;
  duration?: number;
  className?: string;
}

export const FadeContent: React.FC<FadeContentProps> = ({ 
  children, 
  blur = false, 
  delay = 0,
  duration = 0.6,
  className = ""
}) => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={shouldReduceMotion ? {} : { 
        opacity: 0, 
        y: 20,
        filter: blur ? 'blur(10px)' : 'blur(0px)'
      }}
      animate={inView ? { 
        opacity: 1, 
        y: 0,
        filter: 'blur(0px)'
      } : {}}
      transition={shouldReduceMotion ? { duration: 0 } : { 
        duration,
        delay,
        ease: "easeOut"
      }}
    >
      {children}
    </motion.div>
  );
};