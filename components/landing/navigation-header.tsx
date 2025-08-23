'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Menu, X, Home, Star, DollarSign, HelpCircle, MessageSquare, Mail, LogIn, UserPlus } from 'lucide-react';

export const NavigationHeader: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navLinks = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Features', href: '#features', icon: Star },
    { name: 'Pricing', href: '#pricing', icon: DollarSign },
    { name: 'FAQ', href: '#faq', icon: HelpCircle },
    { name: 'Testimonials', href: '#testimonials', icon: MessageSquare },
    { name: 'Contact', href: '#contact', icon: Mail },
  ];

  return (
    <>
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/10"
      >
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <Link href="/" passHref>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <Zap className="h-8 w-8 text-electric-blue" />
              <span className="text-2xl font-bold text-white">Learningly AI</span>
            </motion.div>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const IconComponent = link.icon;
              return (
                <Link key={link.name} href={link.href} passHref>
                  <motion.span 
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center space-x-2 text-gray-300 hover:text-electric-blue transition-colors cursor-pointer"
                  >
                    <IconComponent className="h-4 w-4" />
                    <span>{link.name}</span>
                  </motion.span>
                </Link>
              );
            })}
          </nav>
          
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/account" passHref>
              <Button variant="outline" className="text-lg flex items-center space-x-2">
                <LogIn className="h-4 w-4" />
                <span>Log In</span>
              </Button>
            </Link>
            <Link href="/account" passHref>
              <Button className="text-lg bg-gradient-to-r from-electric-blue to-purple hover:from-electric-blue/90 hover:to-purple/90 text-white flex items-center space-x-2">
                <UserPlus className="h-4 w-4" />
                <span>Sign Up</span>
              </Button>
            </Link>
          </div>
          
          <div className="md:hidden">
            <Button variant="ghost" onClick={() => setIsMenuOpen(true)}>
              <Menu className="h-6 w-6 text-white" />
            </Button>
          </div>
        </div>
      </motion.header>
      
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 md:hidden"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 h-full w-80 bg-gray-900 border-l border-white/10 p-6"
            >
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-white">Menu</span>
                <Button variant="ghost" onClick={() => setIsMenuOpen(false)}>
                  <X className="h-6 w-6 text-white" />
                </Button>
              </div>
              
              <nav className="mt-8 flex flex-col space-y-6">
                {navLinks.map((link) => {
                  const IconComponent = link.icon;
                  return (
                    <Link key={link.name} href={link.href} passHref>
                      <span 
                        onClick={() => setIsMenuOpen(false)} 
                        className="flex items-center space-x-3 text-2xl text-gray-300 hover:text-electric-blue transition-colors cursor-pointer"
                      >
                        <IconComponent className="h-6 w-6" />
                        <span>{link.name}</span>
                      </span>
                    </Link>
                  );
                })}
              </nav>
              
              <div className="mt-8 pt-6 border-t border-gray-700 flex flex-col space-y-4">
                <Link href="/account" passHref>
                  <Button variant="outline" className="w-full text-lg flex items-center justify-center space-x-2">
                    <LogIn className="h-5 w-5" />
                    <span>Log In</span>
                  </Button>
                </Link>
                <Link href="/account" passHref>
                  <Button className="w-full text-lg bg-gradient-to-r from-electric-blue to-purple hover:from-electric-blue/90 hover:to-purple/90 text-white flex items-center justify-center space-x-2">
                    <UserPlus className="h-5 w-5" />
                    <span>Sign Up</span>
                  </Button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
