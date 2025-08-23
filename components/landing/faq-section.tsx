'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ShinyText } from '@/components/react-bits';

const faqs = [
  {
    question: "What is Learningly AI?",
    answer: "Learningly AI is an intelligent study platform that transforms your learning materials into interactive content. It uses advanced AI to create summaries, quizzes, flashcards, and provides personalized tutoring to help you study smarter, not harder! 🚀"
  },
  {
    question: "Does Learningly AI support exam preparation?",
    answer: "Absolutely! Our AI generates practice questions, creates comprehensive study guides, and adapts to your learning style. Whether you're prepping for finals, standardized tests, or professional certifications, we've got you covered! 📚✨"
  },
  {
    question: "Can Learningly AI help with STEM subjects?",
    answer: "Yes! Our AI excels at breaking down complex STEM concepts into digestible explanations. From calculus to chemistry, physics to programming - we make the toughest subjects easier to understand with visual explanations and step-by-step breakdowns! 🧮🔬"
  },
  {
    question: "How accurate are the AI-generated summaries?",
    answer: "Our AI is trained on millions of educational documents and continuously improved. The summaries maintain the core concepts while making them more accessible. You can always review and edit them to ensure they match your specific needs! ✅"
  },
  {
    question: "Is my data secure and private?",
    answer: "Your privacy is our top priority! All your documents and study materials are encrypted and stored securely. We never share your personal data with third parties, and you have full control over your content. 🔒"
  },
  {
    question: "Can I use Learningly AI on my mobile device?",
    answer: "Yes! Learningly AI works seamlessly across all devices - desktop, tablet, and mobile. Study on the go with our responsive design that adapts to any screen size! 📱💻"
  }
];

export const FAQSection: React.FC = () => {
  return (
    <section id="faq" className="py-24 bg-gradient-to-b from-background via-slate-800/20 to-background">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-electric-blue to-purple text-white text-sm font-bold rounded-full mb-6">
              ❓ Got Questions?
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6">
              <ShinyText
                text="Frequently Asked Questions"
                disabled={false}
                speed={3}
                className="text-transparent bg-clip-text bg-gradient-to-r from-electric-blue via-purple to-lime-green font-extrabold"
              />
            </h2>
            <p className="text-xl text-gray-400 leading-relaxed">
              Everything you need to know about Learningly AI. Can't find what you're looking for? Just reach out to our support team! 🎓✨
            </p>
          </motion.div>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <AccordionItem
                  value={`item-${index}`}
                  className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-white/10 rounded-xl px-6 py-4"
                >
                  <AccordionTrigger className="text-left text-lg font-semibold text-white hover:text-electric-blue transition-colors">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-300 leading-relaxed pt-2">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};
