'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface FloatingShapesProps {
  className?: string;
}

export const FloatingShapes: React.FC<FloatingShapesProps> = ({ className = "" }) => {
  const shapes = [
    { id: 1, size: 60, x: '10%', y: '20%', color: 'bg-blue-500/20', duration: 8 },
    { id: 2, size: 40, x: '80%', y: '10%', color: 'bg-purple-500/20', duration: 10 },
    { id: 3, size: 80, x: '70%', y: '60%', color: 'bg-green-500/20', duration: 12 },
    { id: 4, size: 50, x: '20%', y: '70%', color: 'bg-pink-500/20', duration: 9 },
    { id: 5, size: 35, x: '90%', y: '80%', color: 'bg-yellow-500/20', duration: 7 },
    { id: 6, size: 70, x: '5%', y: '50%', color: 'bg-indigo-500/20', duration: 11 },
  ];

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          className={`absolute rounded-full ${shape.color} backdrop-blur-sm`}
          style={{
            width: shape.size,
            height: shape.size,
            left: shape.x,
            top: shape.y,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 15, 0],
            rotate: [0, 180, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: shape.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: shape.id * 0.5,
          }}
        />
      ))}
    </div>
  );
};