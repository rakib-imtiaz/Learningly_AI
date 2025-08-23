'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Marquee from '@/components/ui/marquee';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';
import { ShinyText } from '@/components/react-bits';

const testimonials = [
  {
    name: "Sarah Chen",
    degree: "MD Candidate",
    university: "Harvard Medical School",
    avatar: "/avatars/sarah.jpg",
    text: "Learningly AI saved my life during med school! The AI flashcards helped me memorize anatomy like magic. My grades went from B's to A's! 🩺✨",
  },
  {
    name: "Marcus Johnson",
    degree: "PhD, Computer Science",
    university: "Stanford University",
    avatar: "/avatars/marcus.jpg", 
    text: "As a CS professor, I'm blown away by how well this AI understands complex concepts. My students love the interactive quizzes! 💻🚀",
  },
  {
    name: "Emma Rodriguez",
    degree: "High School Student",
    university: "Phillips Exeter Academy",
    avatar: "/avatars/emma.jpg",
    text: "Finally, a study tool that doesn't make me want to fall asleep! The AI tutor explains things in ways I actually understand. Game changer! 🎓💡",
  },
  {
    name: "Dr. James Park",
    degree: "Corporate Trainer",
    university: "MIT Sloan",
    avatar: "/avatars/james.jpg",
    text: "We use Learningly AI for employee training, and it's revolutionized our onboarding. Everyone learns faster and retains more! 🏢📈",
  },
  {
    name: "Lisa Thompson",
    degree: "Juris Doctor Candidate",
    university: "Yale Law School",
    avatar: "/avatars/lisa.jpg",
    text: "Law school is brutal, but Learningly AI makes case law actually interesting! The summaries are gold for finals prep. ⚖️📚",
  },
  {
    name: "Ahmed Hassan",
    degree: "BSc, Economics",
    university: "London School of Economics",
    avatar: "/avatars/ahmed.jpg",
    text: "This platform creates personalized flashcards from my lecture notes. My study sessions are now 10x more effective! 📊🎯",
  }
];

const TestimonialCard = ({ name, degree, university, text, avatar }: typeof testimonials[0]) => (
  <div className="relative h-full w-96 flex-shrink-0 rounded-2xl p-6 bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-white/10 shadow-lg hover:shadow-2xl hover:border-electric-blue/30 transition-all duration-300">
    <div className="flex items-center gap-4 mb-4">
      <Avatar className="h-12 w-12">
        <AvatarImage src={avatar} alt={name} />
        <AvatarFallback className="bg-gradient-to-r from-electric-blue to-purple text-white font-bold">
          {name.split(' ').map(n => n[0]).join('')}
        </AvatarFallback>
      </Avatar>
      <div>
        <p className="text-lg font-bold text-white">{name}</p>
        <p className="text-sm text-gray-400">{degree}, {university}</p>
      </div>
    </div>
    <p className="text-gray-300 text-base leading-relaxed">{text}</p>
    <div className="mt-4 flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
      ))}
    </div>
  </div>
);

export const TestimonialsSection: React.FC = () => {
  return (
    <section id="testimonials" className="py-24 bg-gradient-to-b from-background via-slate-800/20 to-background">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-electric-blue to-purple text-white text-sm font-bold rounded-full mb-6">
              💬 Real Student Stories
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6">
              Students who{' '}
              <ShinyText 
                text="crushed their goals" 
                disabled={false} 
                speed={3} 
                className="text-transparent bg-clip-text bg-gradient-to-r from-electric-blue via-purple to-lime-green font-extrabold"
              />
            </h2>
            <p className="text-xl text-gray-400 leading-relaxed">
              Don't just take our word for it! Here's what real students are saying about how Learningly AI transformed their study game! 🎓✨
            </p>
          </motion.div>
        </div>

        <div className="relative">
          <Marquee pauseOnHover className="[--duration:80s]">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.name} {...testimonial} />
            ))}
          </Marquee>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
        </div>
      </div>
    </section>
  );
};
