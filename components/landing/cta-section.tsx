'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { ContactForm } from './contact-form';
import { Rocket, Brain, Zap } from 'lucide-react';

export const CTASection: React.FC = () => {
  return (
    <section id="contact" className="py-24 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-electric-blue to-purple text-white text-sm font-bold rounded-full mb-6">
              🚀 Ready to Transform Your Study Game?
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6">
              Stop <span className="text-electric-blue">struggling</span>, start{' '}
              <span className="text-lime-green">succeeding</span>
            </h2>
            <p className="text-xl text-gray-400 leading-relaxed mb-8">
              Join over 1 million students who've already upgraded their study game with Learningly AI. Your future self will thank you for starting today! 🎓✨
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-xl font-bold bg-gradient-to-r from-electric-blue to-purple hover:from-electric-blue/90 hover:to-purple/90 text-white shadow-2xl shadow-electric-blue/25">
                <Rocket className="mr-3 h-6 w-6" />
                Start Studying Smarter - Free!
              </Button>
              <Button variant="outline" size="lg" className="text-xl font-bold border-2 border-lime-green text-lime-green hover:bg-lime-green hover:text-black">
                <Brain className="mr-3 h-6 w-6" />
                See How It Works
              </Button>
            </div>
            <div className="flex flex-wrap gap-6 mt-6 text-sm text-gray-400">
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
          </motion.div>
          <ContactForm />
        </div>
      </div>
    </section>
  );
};
