'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Mail } from 'lucide-react';
import { ContactForm } from './contact-form';
import { DotPattern } from '@/components/ui/dot-pattern';
import { cn } from '@/lib/utils';

const BentoCard = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.8 }}
    className={cn(
      "bg-gray-900/50 border border-white/10 rounded-2xl p-8 flex flex-col",
      className
    )}
  >
    {children}
  </motion.div>
);

export const CTASection: React.FC = () => {
  return (
    <section id="contact" className="py-24 bg-black relative">
      <DotPattern className="absolute inset-0 opacity-10" />
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8">
          <BentoCard className="lg:col-span-1">
            <Mail className="h-12 w-12 text-blue-500 mb-6" />
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
              Get in Touch
            </h2>
            <p className="text-gray-400 leading-relaxed">
              Have a question or want to learn more? Send us a message, and we'll get back to you soon.
            </p>
          </BentoCard>

          <BentoCard className="lg:col-span-2">
            <ContactForm />
          </BentoCard>
        </div>
      </div>
    </section>
  );
};
