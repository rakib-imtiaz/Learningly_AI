'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Rocket, Brain, Zap } from 'lucide-react';
import { NavigationHeader } from './navigation-header';
import { Typewriter, SlideIn, FadeContent, DecryptedText } from '@/components/react-bits';

export const HeroSection: React.FC = () => {
  return (
    <>
      <NavigationHeader />
      <section className="relative min-h-screen flex items-center justify-center text-center bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background"></div>
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image 
            src="/images/landing/hero/hero-ai-learning-platform.png" 
            alt="AI Learning Platform"
            fill
            priority
            className="object-cover opacity-30 blur-[2px]"
          />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <SlideIn direction="down" delay={0.1}>
            <div className="mb-4">
              <span className="inline-block px-3 py-1.5 bg-gradient-to-r from-electric-blue to-purple text-white text-xs font-bold rounded-full mb-3">
                🚀 #1 AI Study Tool for Students
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white leading-tight mb-4">
              <DecryptedText 
                text="Stop Cramming, Start Learning"
                speed={80}
                maxIterations={15}
                sequential={true}
                revealDirection="center"
                useOriginalCharsOnly={true}
                className="text-white"
                encryptedClassName="text-gray-500"
                animateOn="view"
                parentClassName="cursor-pointer"
              />
            </h1>
          </SlideIn>
          
          <SlideIn direction="down" delay={0.3}>
            <div className="max-w-3xl mx-auto mb-6">
              <Typewriter 
                text={[
                  "Turn any boring textbook into interactive study materials in seconds! 📚✨",
                  "Generate quizzes, flashcards, and summaries that actually make sense! 🧠💡",
                  "Study smarter, not harder. Your future self will thank you! 🎯🚀",
                  "Join 1M+ students who've already upgraded their study game! ⚡🔥"
                ]}
                speed={50}
                loop={true}
                className="text-sm md:text-base lg:text-lg text-gray-300 font-medium"
              />
            </div>
          </SlideIn>

          <FadeContent delay={0.6}>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-8">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" className="px-6 py-4 text-base font-bold bg-gradient-to-r from-electric-blue to-purple hover:from-electric-blue/90 hover:to-purple/90 text-white shadow-2xl shadow-electric-blue/25">
                  <Rocket className="mr-2 h-5 w-5" />
                  Start Studying Smarter - Free!
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="outline" size="lg" className="px-6 py-4 text-base font-bold border-2 border-lime-green text-lime-green hover:bg-lime-green hover:text-black">
                  <Brain className="mr-2 h-5 w-5" />
                  See How It Works
                </Button>
              </motion.div>
            </div>
          </FadeContent>

          <FadeContent delay={0.8}>
            <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                                  <Zap className="h-3 w-3 text-lime-green" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                                  <Zap className="h-3 w-3 text-electric-blue" />
                <span>Setup in 30 seconds</span>
              </div>
              <div className="flex items-center gap-2">
                                  <Zap className="h-3 w-3 text-purple" />
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
