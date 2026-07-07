'use client';

import React from "react";
import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#fdfbf7]/90 dark:bg-bg-vanilla-cream/90 backdrop-blur-md">
      <div className="relative flex flex-col items-center gap-4">
        <div className="relative w-16 h-16">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 rounded-full border-2 border-primary-pink/30"
          />
          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-0 rounded-full border-t-2 border-primary-pink"
          />
          <div className="absolute inset-0 flex items-center justify-center text-primary-pink">
            <svg
              className="w-7 h-7 stroke-[1.5]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2v4M12 8h.01M3 16h18M5 16v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5M19 12v4M5 12v4" />
              <path d="M7 12a5 5 0 0 1 10 0" />
            </svg>
          </div>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent-chocolate dark:text-white animate-pulse">
          Preparing Sweetness...
        </span>
      </div>
    </div>
  );
}
