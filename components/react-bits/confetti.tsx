'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfettiProps {
  trigger: boolean;
  colors?: string[];
  particleCount?: number;
  className?: string;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  rotation: number;
  velocity: { x: number; y: number };
}

export const Confetti: React.FC<ConfettiProps> = ({ 
  trigger, 
  colors = ['#667eea', '#764ba2', '#ff6b6b', '#4ecdc4', '#45b7d1'],
  particleCount = 50,
  className = ""
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (trigger) {
      const newParticles = Array.from({ length: particleCount }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * window.innerWidth,
        y: -10,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 10 + 5,
        rotation: Math.random() * 360,
        velocity: {
          x: (Math.random() - 0.5) * 4,
          y: Math.random() * 2 + 2,
        },
      }));

      setParticles(newParticles);

      // Remove particles after animation
      setTimeout(() => {
        setParticles([]);
      }, 3000);
    }
  }, [trigger, colors, particleCount]);

  return (
    <div className={`fixed inset-0 pointer-events-none z-50 ${className}`}>
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute"
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              borderRadius: '50%',
            }}
            initial={{
              opacity: 1,
              scale: 0,
              rotate: particle.rotation,
            }}
            animate={{
              opacity: [1, 1, 0],
              scale: [0, 1, 1],
              rotate: particle.rotation + 360,
              y: window.innerHeight + 100,
              x: particle.x + particle.velocity.x * 100,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 3,
              ease: "easeOut",
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};