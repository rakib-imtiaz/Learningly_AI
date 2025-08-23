'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Check, 
  X, 
  Lightbulb,
  ArrowRight, 
  BookOpen,
  Copy,
  Info
} from 'lucide-react';
import { SlideIn } from '@/components/react-bits';
import { cn } from '@/lib/utils';
import ShinyText from '@/components/react-bits/shiny-text';

const demos = {
  quiz: {
    title: 'Interactive Quiz',
    icon: BookOpen,
    image: "/images/landing/study-flow/study-flow-quiz-demo.png",
    data: [
      {
        question: "What is the primary function of machine learning algorithms?",
        options: [
          "To replace human intelligence",
          "To learn patterns from data and make predictions",
          "To store large amounts of data",
          "To create websites"
        ],
        correct: 1,
        explanation: "Machine learning algorithms analyze data to identify patterns and make predictions or decisions without being explicitly programmed for each specific task."
      },
      {
        question: "Which type of learning uses labeled training data?",
        options: [
          "Unsupervised learning",
          "Reinforcement learning", 
          "Supervised learning",
          "Deep learning"
        ],
        correct: 2,
        explanation: "Supervised learning uses labeled training data where the algorithm learns from input-output pairs to make predictions on new, unseen data."
      }
    ],
  },
  flashcards: {
    title: 'Smart Flashcards',
    icon: Copy,
    image: "/images/landing/study-flow/study-flow-flashcard-demo.png",
    data: [
      {
        front: "What is Artificial Intelligence?",
        back: "AI is the simulation of human intelligence in machines that are programmed to think and learn like humans. It includes machine learning, natural language processing, and computer vision."
      },
      {
        front: "Define Neural Networks",
        back: "Neural networks are computing systems inspired by biological neural networks. They consist of interconnected nodes (neurons) that process information and learn patterns from data."
      },
      {
        front: "What is Deep Learning?",
        back: "Deep learning is a subset of machine learning that uses neural networks with multiple layers to analyze and learn from complex data patterns, especially useful for image and speech recognition."
      }
    ]
  }
};

type DemoType = 'quiz' | 'flashcards';

const QuizComponent = ({
  data,
  current,
  onNext,
}: {
  data: (typeof demos)['quiz']['data'];
  current: number;
  onNext: () => void;
}) => {
  const [selected, setSelected] = useState<number | null>(null);
  const isCorrect = selected === data[current].correct;

  return (
    <Card className="w-full rounded-2xl border-2 border-transparent bg-muted/50 p-8">
      <h3 className="font-heading text-xl font-semibold text-foreground">{data[current].question}</h3>
      <div className="mt-6 space-y-3">
        {data[current].options.map((option, index) => (
          <motion.button
            key={index}
            onClick={() => setSelected(index)}
            disabled={selected !== null}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg border-2 p-4 text-left transition-all",
              selected === null && "hover:border-primary/50 hover:bg-black/5",
              selected !== null && index === data[current].correct && "border-green-500 bg-green-50 text-green-700",
              selected !== null && selected === index && index !== data[current].correct && "border-red-500 bg-red-50 text-red-700",
              selected !== null && selected !== index && "opacity-50"
            )}
            whileTap={{ scale: selected === null ? 0.98 : 1 }}
          >
            <div className={cn("flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2", selected !== null && index === data[current].correct && "border-green-500 bg-green-500 text-white", selected !== null && selected === index && index !== data[current].correct && "border-red-500 bg-red-500 text-white")}>
              {selected !== null && index === data[current].correct && <Check size={14} />}
              {selected !== null && selected === index && index !== data[current].correct && <X size={14} />}
            </div>
            <span>{option}</span>
          </motion.button>
        ))}
      </div>
      <AnimatePresence>
        {selected !== null && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-6"
          >
            <div className="rounded-lg bg-black/5 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-black/5 text-black">
                  <Info size={18} />
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-foreground">Explanation</h4>
                  <p className="mt-1 text-sm text-muted-foreground">{data[current].explanation}</p>
                </div>
              </div>
            </div>
            <Button onClick={onNext} className="mt-4 w-full">
              Next Question <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

const FlashcardComponent = ({
  data,
  current,
  onNext,
}: {
  data: (typeof demos)['flashcards']['data'];
  current: number;
  onNext: () => void;
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="w-full">
      <div style={{ perspective: '1000px' }} className="h-80 w-full">
        <motion.div
          className="relative h-full w-full"
          style={{ transformStyle: 'preserve-3d' }}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          {/* Front */}
          <div className="absolute inset-0 h-full w-full rounded-2xl bg-muted/50 p-8 text-center shadow-sm" style={{ backfaceVisibility: 'hidden' }}>
            <div className="flex h-full flex-col items-center justify-center">
              <p className="font-heading text-2xl font-semibold text-foreground">{data[current].front}</p>
            </div>
          </div>
          {/* Back */}
          <div className="absolute inset-0 h-full w-full rounded-2xl bg-primary/10 p-8 text-center shadow-sm" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
            <div className="flex h-full flex-col items-center justify-center">
              <p className="text-lg text-muted-foreground">{data[current].back}</p>
            </div>
          </div>
        </motion.div>
      </div>
      <Button onClick={onNext} className="mt-6 w-full">
        Next Card <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};

export const StudyFlowSection: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState<DemoType>('quiz');
  const [currentIndices, setCurrentIndices] = useState({ quiz: 0, flashcards: 0 });

  const handleNext = (type: DemoType) => {
    setCurrentIndices(prev => ({
      ...prev,
      [type]: (prev[type] + 1) % demos[type].data.length,
    }));
  };
  
  const progress = useMemo(() => {
    const total = demos[activeDemo].data.length;
    const current = currentIndices[activeDemo];
    return ((current + 1) / total) * 100;
  }, [activeDemo, currentIndices]);

  const DemoContent = activeDemo === 'quiz' ? QuizComponent : FlashcardComponent;
  const demoData = demos[activeDemo].data;
  
  return (
    <section className="w-full py-24">
      <div className="container mx-auto px-4">
        <SlideIn direction="down" className="text-center">
          <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/10 py-2 px-4 text-sm font-medium text-primary">
            Interactive Learning
          </Badge>
          <ShinyText 
            text="Experience Learning That Adapts to You" 
            disabled={false} 
            speed={3} 
            className="font-heading text-4xl font-bold tracking-tighter md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-electric-blue via-purple to-lime-green"
          />
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Our AI-powered tools are not just smart, they're designed to make your study sessions more effective and engaging.
          </p>
        </SlideIn>

        <div className="mt-12 flex justify-center">
          <div className="rounded-lg bg-muted/50 p-1.5">
            {(Object.keys(demos) as DemoType[]).map(key => {
              const Icon = demos[key].icon;
              return (
                <Button 
                  key={key} 
                  variant={activeDemo === key ? "secondary" : "ghost"}
                  onClick={() => setActiveDemo(key)}
                  className="w-40"
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {demos[key].title}
                </Button>
              )
            })}
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-3xl">
          <div className="relative h-96 w-full mb-4">
            <Image
              src={demos[activeDemo].image}
              alt={demos[activeDemo].title}
              layout="fill"
              objectFit="contain"
              className="rounded-lg"
            />
          </div>
          <div className="mb-4 rounded-2xl border-2 border-transparent bg-muted/50 p-4">
            <div className="flex items-center justify-between text-sm">
              <p className="font-medium text-muted-foreground">
                Progress: <span className="font-semibold text-foreground">{currentIndices[activeDemo] + 1} / {demoData.length}</span>
              </p>
              <div className="w-1/3">
                <Progress value={progress} />
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeDemo}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <DemoContent 
                // The conditional type assertion is complex for TS here.
                // We ensure data and component match through our state logic.
                // @ts-ignore 
                data={demoData} 
                current={currentIndices[activeDemo]} 
                onNext={() => handleNext(activeDemo)} 
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
