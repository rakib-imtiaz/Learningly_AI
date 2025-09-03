'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export const ContactForm: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full max-w-lg mx-auto"
    >
      <form className="space-y-6">
        <div>
          <Label htmlFor="name" className="text-lg text-gray-300">Full Name</Label>
          <Input id="name" type="text" placeholder="John Doe" className="mt-2 bg-gray-800 border-gray-700 text-white" />
        </div>
        <div>
          <Label htmlFor="email" className="text-lg text-gray-300">Email Address</Label>
          <Input id="email" type="email" placeholder="john.doe@example.com" className="mt-2 bg-gray-800 border-gray-700 text-white" />
        </div>
        <div>
          <Label htmlFor="message" className="text-lg text-gray-300">Message</Label>
          <Textarea id="message" placeholder="Your message..." className="mt-2 bg-gray-800 border-gray-700 text-white" rows={5} />
        </div>
        <Button type="submit" size="lg" className="w-full text-lg font-bold bg-primary hover:bg-primary/90 text-white">
          Submit
        </Button>
      </form>
    </motion.div>
  );
};
