'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface AnimatedContentProps {
  children: React.ReactNode;
  direction?: 'vertical' | 'horizontal' | 'up' | 'down' | 'left' | 'right';
  distance?: number;
  delay?: number;
  duration?: number;
  className?: string;
}

export const AnimatedContent: React.FC<AnimatedContentProps> = ({ 
  children, 
  direction = 'up',
  distance = 50,
  delay = 0,
  duration = 0.6,
  className = ""
}) => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const getInitialPosition = () => {
    switch (direction) {
      case 'vertical':
      case 'up':
        return { x: 0, y: distance };
      case 'down':
        return { x: 0, y: -distance };
      case 'horizontal':
      case 'right':
        return { x: -distance, y: 0 };
      case 'left':
        return { x: distance, y: 0 };
      default:
        return { x: 0, y: distance };
    }
  };

  const initial = getInitialPosition();

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ 
        opacity: 0, 
        ...initial
      }}
      animate={inView ? { 
        opacity: 1, 
        x: 0,
        y: 0
      } : {}}
      transition={{ 
        duration,
        delay,
        ease: "easeOut"
      }}
    >
      {children}
    </motion.div>
  );
};