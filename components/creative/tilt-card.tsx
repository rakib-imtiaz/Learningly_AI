'use client';

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  tiltMaxAngleX?: number;
  tiltMaxAngleY?: number;
  perspective?: number;
  scale?: number;
  speed?: number;
}

export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className = "",
  tiltMaxAngleX = 15,
  tiltMaxAngleY = 15,
  perspective = 1000,
  scale = 1.05,
  speed = 400,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: speed, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: speed, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [tiltMaxAngleX, -tiltMaxAngleX]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-tiltMaxAngleY, tiltMaxAngleY]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective,
      }}
      animate={{ scale: isHovered ? scale : 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className={className}
    >
      <div style={{ transform: 'translateZ(50px)' }}>
        {children}
      </div>
    </motion.div>
  );
};