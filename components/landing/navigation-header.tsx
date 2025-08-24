'use client';
import React from 'react';
import CardNav from './CardNav';
import { Zap } from 'lucide-react';

export const NavigationHeader: React.FC = () => {
    const items = [
      {
        label: "Features",
        bgColor: "#0D0716",
        textColor: "#fff",
        links: [
          { label: "Reading & Summaries", ariaLabel: "Reading & Summaries", href: "#features" },
          { label: "Smarter Writing Tools", ariaLabel: "Smarter Writing Tools", href: "#features" },
          { label: "Exam-Prep Powerhouse", ariaLabel: "Exam-Prep Powerhouse", href: "#features" },
        ]
      },
      {
        label: "Resources", 
        bgColor: "#170D27",
        textColor: "#fff",
        links: [
          { label: "Pricing", ariaLabel: "Pricing", href: "#pricing" },
          { label: "FAQ", ariaLabel: "FAQ", href: "#faq" },
          { label: "Testimonials", ariaLabel: "Testimonials", href: "#testimonials" },
        ]
      },
      {
        label: "Account",
        bgColor: "#271E37", 
        textColor: "#fff",
        links: [
          { label: "Sign In", ariaLabel: "Sign In", href: "/account" },
          { label: "Sign Up", ariaLabel: "Sign Up", href: "/account" },
        ]
      }
    ];

    const logoComponent = (
      <div className="flex items-center space-x-2 cursor-pointer">
        <Zap className="h-7 w-7 text-blue-500" />
        <span className="text-xl font-bold text-white">Learningly AI</span>
      </div>
    );
  
    return (
      <CardNav
        logoComponent={logoComponent}
        items={items}
        baseColor="transparent"
        menuColor="#fff"
        buttonBgColor="#1E40AF"
        buttonTextColor="#fff"
        ease="power3.out"
      />
    );
  };
  
