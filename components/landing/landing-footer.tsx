'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Zap, Twitter, Github, Linkedin } from 'lucide-react';
import Link from 'next/link';

const footerLinks = {
  company: [
    { name: 'About', href: '#' },
    { name: 'Blog', href: '#' },
    { name: 'Contact', href: '#contact' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
    { name: 'FAQ', href: '#faq' },
  ],
};

const socialLinks = [
  { name: 'Twitter', icon: Twitter, href: '#' },
  { name: 'GitHub', icon: Github, href: '#' },
  { name: 'LinkedIn', icon: Linkedin, href: '#' },
];

export const LandingFooter: React.FC = () => {
  return (
    <footer className="w-full bg-gray-900 border-t border-white/10">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <div className="flex items-center space-x-2">
              <Zap className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-white">Learningly AI</span>
            </div>
            <p className="mt-4 text-gray-400 max-w-sm">
              Transform your study materials into interactive content with the power of AI.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:col-span-5 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-white">Company</h3>
              <ul className="mt-4 space-y-2">
                {footerLinks.company.map(item => (
                  <li key={item.name}>
                    <Link href={item.href} className="text-gray-400 hover:text-primary transition-colors">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white">Legal</h3>
              <ul className="mt-4 space-y-2">
                {footerLinks.legal.map(item => (
                  <li key={item.name}>
                    <Link href={item.href} className="text-gray-400 hover:text-primary transition-colors">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-3">
            <h3 className="font-semibold text-white">Get the latest news, updates, and tips.</h3>
            <div className="mt-4 flex flex-col sm:flex-row gap-2">
              <Input type="email" placeholder="Enter your email" className="flex-1 bg-gray-800 border-gray-700 text-white" />
              <Button className="bg-primary hover:bg-primary/90 text-white font-bold">Subscribe</Button>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Learningly AI, Inc. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            {socialLinks.map(link => (
              <Link key={link.name} href={link.href} className="text-gray-500 hover:text-primary transition-colors">
                <link.icon className="h-5 w-5" />
                <span className="sr-only">{link.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
