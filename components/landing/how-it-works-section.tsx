'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  Wand2, 
  BookOpen, 
  TrendingUp,
  Check
} from 'lucide-react';
import { SlideIn } from '@/components/react-bits';
import { cn } from '@/lib/utils';
import GradientText from '@/components/ui/gradient-text';
import ShinyText from '@/components/react-bits/shiny-text';

const steps = [
  {
    icon: Upload,
    title: "Upload Your Content",
    description: "Start by uploading your learning materials—PDFs, DOCX, PPTX, YouTube links, or just paste in text.",
    details: ["Support for 50+ file formats", "YouTube video transcription", "Drag & drop interface"],
    color: "text-black",
    bg: "bg-black/5",
    image: "/images/landing/how-it-works/how-it-works-upload.png"
  },
  {
    icon: Wand2,
    title: "AI Processes & Generates",
    description: "Our AI analyzes your content, understands the context, and generates personalized study materials in seconds.",
    details: ["Advanced NLP processing", "Context-aware generation", "Multiple difficulty levels"],
    color: "text-black",
    bg: "bg-black/5",
    image: "/images/landing/how-it-works/how-it-works-ai-processing.png"
  },
  {
    icon: BookOpen,
    title: "Study & Practice",
    description: "Engage with interactive quizzes, smart flashcards, and concise summaries tailored to your learning style.",
    details: ["Adaptive learning paths", "Spaced repetition for memory", "Interactive sessions"],
    color: "text-black",
    bg: "bg-black/5",
    image: "/images/landing/how-it-works/how-it-works-study-practice.png"
  },
  {
    icon: TrendingUp,
    title: "Track & Master",
    description: "Monitor your progress with detailed analytics, identify areas for improvement, and master your subjects.",
    details: ["Performance dashboards", "Weakness identification", "Personalized insights"],
    color: "text-black",
    bg: "bg-black/5",
    image: "/images/landing/how-it-works/how-it-works-track-master.png"
  },
];

const Step = ({ step, index, total }: { step: typeof steps[0], index: number, total: number }) => {
  const { ref, inView } = useInView({ threshold: 0.5, triggerOnce: true });
  const Icon = step.icon;

  return (
         <div ref={ref} className="flex items-start gap-6">
      <div className="relative flex flex-col items-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
                     className={cn("z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-700 bg-gray-800/50", step.bg)}
        >
                     <Icon className="h-5 w-5 text-white" />
        </motion.div>
                 {index < total - 1 && (
           <div className="absolute top-10 h-full w-1 bg-gray-600/30">
             <motion.div
               className="h-full w-full origin-top bg-gradient-to-b from-white to-transparent"
              initial={{ scaleY: 0 }}
              animate={inView ? { scaleY: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
            />
          </div>
        )}
      </div>

             <SlideIn direction={index % 2 === 0 ? 'left' : 'right'} delay={0.3} className="w-full pb-8">
                                   <div className="rounded-2xl bg-gray-900/50 border border-gray-700 p-3">
                     <div className="relative h-32 w-full mb-3">
            <Image
              src={step.image}
              alt={step.title}
              layout="fill"
              objectFit="contain"
              className="rounded-lg"
            />
          </div>
                     <Badge variant="outline" className="mb-2 border-white/30 bg-white/10 text-xs font-medium text-white">
             Step {index + 1}
           </Badge>
                     <h3 className="mb-2 font-heading text-lg font-semibold text-white">{step.title}</h3>
                       <p className="mb-2 text-xs text-gray-300">{step.description}</p>
                     <ul className="space-y-1">
             {step.details.map(detail => (
               <li key={detail} className="flex items-center text-xs text-gray-300">
                 <Check className="mr-1.5 h-2.5 w-2.5 text-lime-green" />
                 <span>{detail}</span>
               </li>
             ))}
           </ul>
        </div>
      </SlideIn>
    </div>
  );
};

export const HowItWorksSection: React.FC = () => {
  const { ref: headerRef, inView: headerInView } = useInView({ 
    threshold: 0.3, 
    triggerOnce: true 
  });

  return (
    <section className="w-full bg-background py-16">
      <div className="container mx-auto px-4">
        
        <div ref={headerRef} className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Badge variant="outline" className="mb-4 border-black/20 bg-black/5 py-2 px-4 text-sm font-medium text-black">
              How It Works
            </Badge>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
                                    <ShinyText
              text="From Content to Mastery in 4 Steps"
              disabled={false}
              speed={3}
              className="font-heading text-2xl font-bold tracking-tighter md:text-3xl lg:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-electric-blue via-purple to-lime-green"
            />
          </motion.div>
          
                     <motion.div
             initial={{ opacity: 0, y: 30 }}
             animate={headerInView ? { opacity: 1, y: 0 } : {}}
             transition={{ duration: 0.8, delay: 0.6 }}
           >
                           <p className="mx-auto mt-3 max-w-xl text-sm text-gray-300">
               Our streamlined process makes it effortless to transform your study materials into powerful, interactive learning tools.
             </p>
           </motion.div>
        </div>

                 <motion.div 
           className="relative mx-auto mt-8 max-w-2xl"
          initial={{ opacity: 0, y: 50 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <div className="space-y-0">
            {steps.map((step, index) => (
              <Step key={step.title} step={step} index={index} total={steps.length} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
