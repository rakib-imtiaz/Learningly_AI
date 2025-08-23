'use client';

import React from 'react';
import { HeroSection } from '@/components/landing/hero-section';
import { TrustSection } from '@/components/landing/trust-section';
import { FeaturesSection } from '@/components/landing/features-section';
import { StudyFlowSection } from '@/components/landing/study-flow-section';
import { HowItWorksSection } from '@/components/landing/how-it-works-section';
import { TestimonialsSection } from '@/components/landing/testimonials-section';
import { PricingSection } from '@/components/landing/pricing-section';
import { FAQSection } from '@/components/landing/faq-section';
import { CTASection } from '@/components/landing/cta-section';
import { LandingFooter } from '@/components/landing/landing-footer';
import { ScrollReveal } from '@/components/creative/scroll-reveal';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <TrustSection />
      <ScrollReveal>
        <FeaturesSection />
      </ScrollReveal>
      <ScrollReveal direction="up" delay={0.2}>
        <StudyFlowSection />
      </ScrollReveal>
      <ScrollReveal direction="up" delay={0.2}>
        <HowItWorksSection />
      </ScrollReveal>
      <ScrollReveal direction="up" delay={0.3}>
        <TestimonialsSection />
      </ScrollReveal>
      <ScrollReveal direction="down" delay={0.2}>
        <PricingSection />
      </ScrollReveal>
      <ScrollReveal>
        <FAQSection />
      </ScrollReveal>
      <ScrollReveal>
        <CTASection />
      </ScrollReveal>
      <ScrollReveal direction="up">
        <LandingFooter />
      </ScrollReveal>
    </div>
  );
}
