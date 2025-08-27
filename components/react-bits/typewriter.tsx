'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';

interface TypewriterProps {
  text: string | string[];
  speed?: number;
  delay?: number;
  loop?: boolean;
  className?: string;
}

export const Typewriter: React.FC<TypewriterProps> = ({
  text,
  speed = 100,
  delay = 2000,
  loop = false,
  className = "",
}) => {
  const words = useMemo(() => Array.isArray(text) ? text : [text], [text]);
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);

  useEffect(() => {
    if (words.length === 0) return;

    if (index === words.length) {
      if (loop) {
        setIndex(0);
        return;
      }
      return;
    }

    if (subIndex === words[index].length + 1 && !reverse) {
      const wait = setTimeout(() => {
        setReverse(true);
      }, delay);
      return () => clearTimeout(wait);
    }

    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => prev + 1);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, Math.max(reverse ? speed / 2 : speed, 50));

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, words, speed, delay, loop]);

  return (
    <span className={className}>
      {`${words[index]?.substring(0, subIndex) || ''}`}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
        className="inline-block w-px h-6 bg-current ml-1 align-bottom"
      />
    </span>
  );
};
