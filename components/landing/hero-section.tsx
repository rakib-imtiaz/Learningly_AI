'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Rocket, Brain, Zap } from 'lucide-react';
import { NavigationHeader } from './navigation-header';
import { Typewriter, SlideIn, FadeContent } from '@/components/react-bits';

export const HeroSection: React.FC = () => {
  return (
    <>
      <NavigationHeader />
      <section className="relative min-h-screen flex items-center justify-center text-center bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background"></div>
        <div className="container mx-auto px-6 relative z-10">
          <SlideIn direction="down" delay={0.1}>
            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-gradient-to-r from-electric-blue to-purple text-white text-sm font-bold rounded-full mb-4">
                🚀 #1 AI Study Tool for Students
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6">
              Stop <span className="text-electric-blue">Cramming</span>, Start{' '}
              <span className="text-lime-green">Learning</span>
            </h1>
          </SlideIn>
          
          <SlideIn direction="down" delay={0.3}>
            <div className="max-w-4xl mx-auto mb-8">
              <Typewriter 
                text={[
                  "Turn any boring textbook into interactive study materials in seconds! 📚✨",
                  "Generate quizzes, flashcards, and summaries that actually make sense! 🧠💡",
                  "Study smarter, not harder. Your future self will thank you! 🎯🚀",
                  "Join 1M+ students who've already upgraded their study game! ⚡🔥"
                ]}
                speed={50}
                loop={true}
                className="text-lg md:text-xl lg:text-2xl text-gray-300 font-medium"
              />
            </div>
          </SlideIn>

          <FadeContent delay={0.6}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" className="px-10 py-7 text-xl font-bold bg-gradient-to-r from-electric-blue to-purple hover:from-electric-blue/90 hover:to-purple/90 text-white shadow-2xl shadow-electric-blue/25">
                  <Rocket className="mr-3 h-6 w-6" />
                  Start Studying Smarter - Free!
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="outline" size="lg" className="px-10 py-7 text-xl font-bold border-2 border-lime-green text-lime-green hover:bg-lime-green hover:text-black">
                  <Brain className="mr-3 h-6 w-6" />
                  See How It Works
                </Button>
              </motion.div>
            </div>
          </FadeContent>

          <FadeContent delay={0.8}>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-lime-green" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-electric-blue" />
                <span>Setup in 30 seconds</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-purple" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </FadeContent>
        </div>
      </section>
    </>
  );
};

// Add this CSS to globals.css or a relevant stylesheet for the grid pattern
/*
.bg-grid-pattern {
  background-image: linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 40px 40px;
}
*/
