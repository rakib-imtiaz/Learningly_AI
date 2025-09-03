'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface GlitchTextProps {
  text: string;
  className?: string;
  glitchOnHover?: boolean;
}

export const GlitchText: React.FC<GlitchTextProps> = ({ 
  text, 
  className = "",
  glitchOnHover = false 
}) => {
  const [isGlitching, setIsGlitching] = useState(false);
  const [glitchText, setGlitchText] = useState(text);

  const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isGlitching) {
      interval = setInterval(() => {
        const shouldGlitch = Math.random() > 0.8;
        if (shouldGlitch) {
          const newText = text
            .split('')
            .map(char => 
              Math.random() > 0.9 && char !== ' ' 
                ? glitchChars[Math.floor(Math.random() * glitchChars.length)]
                : char
            )
            .join('');
          setGlitchText(newText);
          
          setTimeout(() => setGlitchText(text), 100);
        }
      }, 200);
    }

    return () => clearInterval(interval);
  }, [isGlitching, text]);

  useEffect(() => {
    if (!glitchOnHover) {
      const timer = setInterval(() => {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 500);
      }, 3000);
      
      return () => clearInterval(timer);
    }
  }, [glitchOnHover]);

  return (
    <motion.span
      className={`relative inline-block ${className}`}
      onMouseEnter={() => glitchOnHover && setIsGlitching(true)}
      onMouseLeave={() => glitchOnHover && setIsGlitching(false)}
      style={{
        textShadow: isGlitching 
          ? '2px 0 #ff0000, -2px 0 #00ffff, 0 2px #ffff00' 
          : 'none',
      }}
    >
      {glitchText}
      {isGlitching && (
        <>
          <span
            className="absolute top-0 left-0 text-red-500 opacity-70"
            style={{ transform: 'translate(1px, 0)' }}
          >
            {text}
          </span>
          <span
            className="absolute top-0 left-0 text-cyan-500 opacity-70"
            style={{ transform: 'translate(-1px, 0)' }}
          >
            {text}
          </span>
        </>
      )}
    </motion.span>
  );
};