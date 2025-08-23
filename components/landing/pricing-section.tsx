'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Check, Star, X, Coffee } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ShinyText } from '@/components/react-bits';

const plans = [
  {
    name: "Student Starter",
    description: "Perfect for trying out the basics",
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      "5 document uploads per month",
      "Basic AI summaries",
      "10 quiz questions per document",
      "Limited AI study buddy access",
    ],
    limitations: [
      "Watermarks on exports",
      "Standard support",
      "Feature usage caps",
    ],
    isPopular: false,
    image: "/images/landing/pricing/pricing-free-plan.png"
  },
  {
    name: "Study Pro",
    description: "For students serious about their grades",
    monthlyPrice: 10,
    yearlyPrice: 100,
    features: [
      "Unlimited document uploads",
      "Advanced AI summaries & insights",
      "Unlimited, adaptive quizzes",
      "Full access to AI study buddy",
      "No watermarks on exports",
      "Priority support",
      "No feature usage caps",
    ],
    limitations: [],
    isPopular: true,
    image: "/images/landing/pricing/pricing-premium-plan.png"
  }
];

export const PricingSection: React.FC = () => {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section id="pricing" className="py-24 bg-gradient-to-b from-background to-slate-800">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-electric-blue to-purple text-white text-sm font-bold rounded-full mb-6">
              💰 Student-Friendly Pricing
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6">
              Choose your{' '}
              <ShinyText 
                text="study upgrade" 
                disabled={false} 
                speed={3} 
                className="text-transparent bg-clip-text bg-gradient-to-r from-electric-blue via-purple to-lime-green font-extrabold"
              />
            </h2>
            <p className="text-xl text-gray-400 leading-relaxed">
              Start for free and upgrade when you're ready to take your grades to the next level! No hidden fees, no surprises. 🎓✨
            </p>
          </motion.div>
        </div>

        <div className="flex items-center justify-center space-x-4 mb-12">
          <span className={cn("text-lg font-medium", !isYearly ? "text-electric-blue" : "text-gray-400")}>Monthly</span>
          <Switch
            checked={isYearly}
            onCheckedChange={setIsYearly}
            aria-label="Toggle billing period"
            className="data-[state=checked]:bg-electric-blue"
          />
          <span className={cn("text-lg font-medium", isYearly ? "text-electric-blue" : "text-gray-400")}>
            Yearly (Save 17% - That's like 2 months free! 🎉)
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={cn(
                "relative flex flex-col rounded-2xl p-10 border transition-all duration-300 h-full",
                plan.isPopular 
                  ? "border-electric-blue/50 bg-gradient-to-br from-gray-900/60 to-gray-800/40 shadow-2xl shadow-electric-blue/20" 
                  : "border-gray-700 bg-gradient-to-br from-gray-900/40 to-gray-800/30 hover:border-gray-600"
              )}
            >
              {plan.isPopular && (
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-electric-blue to-purple text-white px-8 py-3 rounded-full text-sm font-bold shadow-xl z-10">
                  <Star className="inline-block mr-2 h-4 w-4" />
                  Most Popular Choice! 🚀
                </div>
              )}

              <div className="mb-8">
                <div className="relative h-48 w-full mb-8 rounded-xl overflow-hidden bg-gradient-to-br from-electric-blue/10 to-purple/10">
                  {plan.image && (
                    <Image
                      src={plan.image}
                      alt={plan.name}
                      fill
                      className="object-contain p-6 hover:scale-105 transition-transform duration-500"
                    />
                  )}
                </div>
                <h3 className="text-3xl font-bold text-white mb-3">{plan.name}</h3>
                <p className="text-gray-400 text-lg">{plan.description}</p>
              </div>

              <div className="mb-10">
                <div className="flex items-baseline">
                  <span className="text-6xl font-extrabold text-white">
                    ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                  </span>
                  <span className="ml-3 text-gray-400 text-xl">
                    /{isYearly ? 'year' : 'month'}
                  </span>
                </div>
                {plan.monthlyPrice > 0 && (
                  <p className="text-base text-gray-500 mt-3 flex items-center">
                    <Coffee className="h-5 w-5 mr-2" />
                    {isYearly ? 'That\'s only $8.33/month!' : 'Less than a coffee per day!'}
                  </p>
                )}
              </div>

              <ul className="space-y-4 flex-1 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <Check className="h-5 w-5 text-lime-green mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 leading-relaxed">{feature}</span>
                  </li>
                ))}
                {plan.limitations.map((limitation) => (
                   <li key={limitation} className="flex items-start">
                    <X className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-500 leading-relaxed">{limitation}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                size="lg" 
                className={cn(
                  "w-full text-lg font-bold py-6 transition-all duration-300",
                  plan.isPopular 
                  ? "bg-gradient-to-r from-electric-blue to-purple hover:from-electric-blue/90 hover:to-purple/90 text-white shadow-lg hover:shadow-xl"
                  : "bg-gray-700 hover:bg-gray-600 text-white border border-gray-600 hover:border-gray-500"
                )}
              >
                {plan.name === 'Student Starter' ? 'Start Free - No Credit Card!' : 'Upgrade to Pro - Boost Your Grades!'}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
