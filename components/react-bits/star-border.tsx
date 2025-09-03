'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface StarBorderProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
}

export const StarBorder: React.FC<StarBorderProps> = ({ 
  children, 
  className = "",
  color = "#667eea"
}) => {
  return (
    <motion.div
      className={`relative ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="absolute inset-0 rounded-lg"
        style={{
          background: `linear-gradient(45deg, ${color}, transparent, ${color})`,
          padding: '2px',
        }}
        animate={{
          background: [
            `linear-gradient(0deg, ${color}, transparent, ${color})`,
            `linear-gradient(90deg, ${color}, transparent, ${color})`,
            `linear-gradient(180deg, ${color}, transparent, ${color})`,
            `linear-gradient(270deg, ${color}, transparent, ${color})`,
            `linear-gradient(360deg, ${color}, transparent, ${color})`,
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <div className="bg-background rounded-lg h-full w-full">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};