'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface FlipCardProps {
  front: React.ReactNode;
  back: React.ReactNode;
  className?: string;
}

export const FlipCard: React.FC<FlipCardProps> = ({ 
  front, 
  back, 
  className = ""
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className={`relative cursor-pointer ${className}`}
      style={{ perspective: '1000px' }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 w-full h-full backface-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {front}
        </div>
        
        {/* Back */}
        <div
          className="absolute inset-0 w-full h-full backface-hidden"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          {back}
        </div>
      </motion.div>
    </div>
  );
};