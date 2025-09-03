'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface AuroraProps {
  colorStops?: string[];
  className?: string;
  children?: React.ReactNode;
}

export const Aurora: React.FC<AuroraProps> = ({ 
  colorStops = ["#667eea", "#764ba2"], 
  className = "",
  children 
}) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div
        className="absolute inset-0 opacity-50"
        animate={{
          background: [
            `linear-gradient(45deg, ${colorStops[0]}, ${colorStops[1]})`,
            `linear-gradient(45deg, ${colorStops[1]}, ${colorStops[0]})`,
            `linear-gradient(45deg, ${colorStops[0]}, ${colorStops[1]})`,
          ],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          background: [
            `radial-gradient(circle at 20% 80%, ${colorStops[0]}40 0%, transparent 50%)`,
            `radial-gradient(circle at 80% 20%, ${colorStops[1]}40 0%, transparent 50%)`,
            `radial-gradient(circle at 40% 40%, ${colorStops[0]}40 0%, transparent 50%)`,
          ],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};