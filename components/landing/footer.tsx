"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export function LandingFooter() {
  const footerLinks = [
    { label: "Terms", href: "/terms" },
    { label: "Privacy", href: "/privacy" },
    { label: "Help", href: "/help" },
  ];

  return (
    <footer className="border-t border-white/10 bg-gray-900 py-8">
      <div className="container mx-auto flex flex-col items-center justify-between px-4 sm:flex-row">
        <div className="flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-600">
            <span className="text-sm font-bold text-white">L</span>
          </div>
          <span className="text-lg font-bold text-white">Learningly AI</span>
        </div>
        <motion.div 
          className="mt-4 sm:mt-0"
          whileHover={{ scale: 1.05 }}
        >
          <p className="text-center text-sm text-gray-400">
            Supercharge your learning journey.
          </p>
        </motion.div>
        <div className="mt-4 flex space-x-6 sm:mt-0">
          {footerLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm text-gray-400 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-8 border-t border-white/10 pt-8 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Learningly AI. All rights reserved.
      </div>
    </footer>
  );
}
