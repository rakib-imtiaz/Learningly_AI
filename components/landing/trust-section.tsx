'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Marquee from '@/components/ui/marquee';
import Image from 'next/image';

const universityLogos = [
  { 
    name: 'MIT', 
    src: '/images/logos/university_logos/Massachusetts_Institute_of_Technology-Logo.wine.png',
    fallback: 'MIT'
  },
  { 
    name: 'Harvard', 
    src: '/images/logos/university_logos/Harvard_University-Logo.wine.png',
    fallback: 'Harvard'
  },
  { 
    name: 'Stanford', 
    src: '/images/logos/university_logos/Stanford_University-Logo.wine.png',
    fallback: 'Stanford'
  },
  { 
    name: 'Oxford', 
    src: '/images/logos/university_logos/University_of_Oxford-Logo.wine.png',
    fallback: 'Oxford'
  },
  { 
    name: 'Cambridge', 
    src: '/images/logos/university_logos/University_of_Cambridge-Logo.wine.png',
    fallback: 'Cambridge'
  },
  { 
    name: 'Columbia', 
    src: '/images/logos/university_logos/Columbia_University-Logo.wine.png',
    fallback: 'Columbia'
  },
  { 
    name: 'Princeton', 
    src: '/images/logos/university_logos/Princeton_University-Logo.wine.png',
    fallback: 'Princeton'
  },
  { 
    name: 'Penn', 
    src: '/images/logos/university_logos/University_of_Pennsylvania-Logo.wine.svg',
    fallback: 'Penn'
  },
  { 
    name: 'McGill', 
    src: '/images/logos/university_logos/McGill_University-Logo.wine.png',
    fallback: 'McGill'
  },
  { 
    name: 'Bristol', 
    src: '/images/logos/university_logos/University_of_Bristol-Logo.wine.png',
    fallback: 'Bristol'
  },
];

const LogoItem = ({ logo }: { logo: typeof universityLogos[0] }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="flex items-center justify-center px-6 h-28 transition-all duration-300"
  >
    <div className="w-56 h-24 bg-white rounded-xl flex items-center justify-center border-2 border-gray-200 hover:border-electric-blue/50 transition-colors p-6 shadow-lg hover:shadow-xl">
      <Image
        src={logo.src}
        alt={logo.name}
        width={220}
        height={100}
        className="object-contain w-full h-full max-w-[200px] max-h-[80px]"
        onError={(e) => {
          // Fallback to text if image fails to load
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const parent = target.parentElement;
          if (parent) {
            parent.innerHTML = `<span class="text-gray-700 text-lg font-bold">${logo.fallback}</span>`;
          }
        }}
      />
    </div>
  </motion.div>
);

export const TrustSection: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-slate-800 overflow-hidden">
      <div className="container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Trusted by <span className="text-electric-blue">1M+</span> students who actually{' '}
            <span className="text-lime-green">get it</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            From Ivy League to community college, students everywhere are ditching the old study methods for something that actually works! 🎓✨
          </p>
        </motion.div>
        
        <div className="relative">
                  <Marquee 
          className="py-8" 
          pauseOnHover={true}
          repeat={3}
          style={{ '--duration': '40s' } as React.CSSProperties}
        >
            {universityLogos.map((logo, index) => (
              <LogoItem key={`${logo.name}-${index}`} logo={logo} />
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
};
