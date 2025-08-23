'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  HelpCircle, 
  CreditCard, 
  MessageCircle, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: FileText,
    title: "Smart Summaries",
    description: "Turn that 50-page chapter into a 2-minute read that actually sticks in your brain! 📚✨",
    color: "text-electric-blue",
    shadowColor: "shadow-electric-blue/30",
    image: "/images/landing/features/features-smart-summaries.png"
  },
  {
    icon: HelpCircle,
    title: "Interactive Quizzes",
    description: "Test yourself with AI-generated questions that adapt to your level. No more guessing what's on the exam! 🎯🧠",
    color: "text-purple",
    shadowColor: "shadow-purple/30",
    image: "/images/landing/features/features-interactive-quizzes.png"
  },
  {
    icon: CreditCard,
    title: "AI Flashcards",
    description: "Create perfect flashcards in seconds. Your memory will thank you when finals roll around! 🧠💡",
    color: "text-lime-green",
    shadowColor: "shadow-lime-green/30",
    image: "/images/landing/features/features-ai-flashcards.png"
  },
  {
    icon: MessageCircle,
    title: "AI Study Buddy",
    description: "Got a question at 2 AM? Your AI tutor is always awake and ready to explain anything! 🤖💬",
    color: "text-orange-400",
    shadowColor: "shadow-orange-400/30",
    image: "/images/landing/features/features-ai-chat.png"
  }
];

const FeatureCard = ({ icon: Icon, title, description, color, shadowColor, image }: (typeof features)[0]) => (
  <motion.div
    whileHover={{ y: -8, scale: 1.02 }}
    transition={{ type: "spring", stiffness: 300 }}
    className="h-full"
  >
    <Card className={cn(
      "relative overflow-hidden h-full w-full rounded-2xl p-6 transition-all duration-300 bg-gradient-to-br from-gray-900/60 to-gray-800/40 border border-white/10",
      `hover:border-electric-blue/50 hover:shadow-2xl ${shadowColor}`
    )}>
      <div className="relative h-40 w-full mb-6 rounded-lg overflow-hidden bg-gradient-to-br from-electric-blue/10 to-purple/10">
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon className={cn("h-16 w-16", color)} />
        </div>
      </div>
      <Icon className={cn("h-10 w-10 mb-4", color)} />
      <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
      <p className="text-gray-300 mb-6 text-base leading-relaxed">{description}</p>
      <Button variant="outline" className={`mt-auto border-gray-700 hover:bg-electric-blue hover:text-white hover:border-electric-blue transition-all duration-300`}>
        Try This Feature <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </Card>
  </motion.div>
);

export const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="py-24 bg-gradient-to-b from-background via-slate-800/20 to-background">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-electric-blue to-purple text-white text-sm font-bold rounded-full mb-6">
              🚀 Your Study Game Changer
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6">
              Everything you need to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-blue via-purple to-lime-green">
                crush your exams
              </span>
            </h2>
            <p className="text-xl text-gray-400 leading-relaxed">
              Stop struggling with boring study methods. Our AI-powered tools turn any subject into an engaging learning experience that actually works! 📚✨
            </p>
          </motion.div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <FeatureCard {...feature} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
