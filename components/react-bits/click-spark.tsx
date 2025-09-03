'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ClickSparkProps {
  children: React.ReactNode;
  sparkColor?: string;
  sparkCount?: number;
  className?: string;
}

interface Spark {
  id: number;
  x: number;
  y: number;
}

export const ClickSpark: React.FC<ClickSparkProps> = ({ 
  children, 
  sparkColor = "#ff6b6b",
  sparkCount = 12,
  className = ""
}) => {
  const [sparks, setSparks] = useState<Spark[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newSparks = Array.from({ length: sparkCount }, (_, i) => ({
      id: Date.now() + i,
      x,
      y,
    }));

    setSparks(prev => [...prev, ...newSparks]);

    // Remove sparks after animation
    setTimeout(() => {
      setSparks(prev => prev.filter(spark => !newSparks.includes(spark)));
    }, 600);
  };

  return (
    <div className={`relative overflow-hidden ${className}`} onClick={handleClick}>
      {children}
      <AnimatePresence>
        {sparks.map((spark, index) => (
          <motion.div
            key={spark.id}
            className="absolute pointer-events-none"
            style={{
              left: spark.x,
              top: spark.y,
              width: 4,
              height: 4,
              backgroundColor: sparkColor,
              borderRadius: '50%',
            }}
            initial={{
              scale: 0,
              x: 0,
              y: 0,
              opacity: 1,
            }}
            animate={{
              scale: [0, 1, 0],
              x: (Math.cos((index * 360) / sparkCount * Math.PI / 180) * 50),
              y: (Math.sin((index * 360) / sparkCount * Math.PI / 180) * 50),
              opacity: [1, 1, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.6,
              ease: "easeOut",
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};