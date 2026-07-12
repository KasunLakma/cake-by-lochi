'use client';

import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Sparkles } from "lucide-react";
import { Sacramento } from "next/font/google";

const sacramento = Sacramento({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const headingText = "Handcrafted Elegance in Every Bite";
  const words = headingText.split(" ");

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.03,
      }
    }
  };

  const charVariants = {
    hidden: { 
      opacity: 0, 
      y: 15,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number]
      }
    }
  };

  return (
    <section 
      ref={sectionRef} 
      className="relative w-full min-h-screen flex items-center justify-center overflow-visible pt-[140px] md:pt-[180px] pb-32 px-4 md:px-8 lg:px-12 transition-colors duration-500"
    >
      {/* Collage Grid */}
      <div 
        className="absolute inset-0 grid grid-cols-2 md:grid-cols-4 gap-0 space-x-0 z-10"
        style={{ clipPath: 'url(#hero-clip-path)', marginTop: '75px' }}
      >
        <div className="relative h-full w-full overflow-hidden">
          <Image 
            src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1920&auto=format&fit=crop" 
            alt="High-end Bakery Creations" 
            fill 
            className="object-cover object-center filter brightness-95" 
            priority 
          />
        </div>
        <div className="relative h-full w-full overflow-hidden">
          <Image 
            src="/cake_cat_celebration.png" 
            alt="Luxury Cake Displays" 
            fill 
            className="object-cover object-center filter brightness-90" 
            priority 
          />
        </div>
        <div className="relative h-full w-full overflow-hidden">
          <Image 
            src="/cake_cat_cupcake.png" 
            alt="Custom Cupcakes" 
            fill 
            className="object-cover object-center filter brightness-90" 
            priority 
          />
        </div>
        <div className="relative h-full w-full overflow-hidden">
          <Image 
            src="/cake_cat_dietary.png" 
            alt="Artisanal Bakes & Gift Boxes" 
            fill 
            className="object-cover object-center filter brightness-90" 
            priority 
          />
        </div>
        {/* Soft blur divider */}
        <div className="absolute top-0 bottom-0 left-[50%] md:left-[25%] w-[2px] bg-white/20 backdrop-blur-sm shadow-[0_0_8px_rgba(255,255,255,0.4)] z-10" />
      </div>

      {/* Main Content (Centered Typography, CTAs, and Metrics) */}
      <div className="relative w-full max-w-4xl mx-auto z-30 flex flex-col items-center text-center gap-8">
        
        {/* Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-1.5 rounded-full bg-primary-pink/20 dark:bg-primary-pink/15 px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-white border border-white/30 shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-pink-200 fill-pink-200/25" />
          Artisanal Dessert Studio
        </motion.div>

        {/* Staggered Heading Reveal (Character-by-character, keeping words intact) */}
        <motion.h1 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08] max-w-3xl text-center mx-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
        >
          {words.map((word, wordIdx) => (
            <span key={wordIdx} className="inline-block whitespace-nowrap mr-3 md:mr-4">
              {Array.from(word).map((char, charIdx) => (
                <motion.span 
                  key={charIdx} 
                  variants={charVariants} 
                  className="inline-block origin-center"
                >
                  {char}
                </motion.span>
              ))}
            </span>
          ))}
        </motion.h1>

        {/* Subheading description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-base md:text-lg text-white/90 max-w-xl leading-relaxed font-normal drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]"
        >
          Crafting bespoke luxury confections that double as sculptural masterpieces. Every cake is custom-tailored with organic farm-to-table ingredients and timeless Parisian elegance.
        </motion.p>

        {/* Call to Actions (CTAs) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap gap-4 items-center justify-center mt-2 w-full sm:w-auto"
        >
          {/* Primary Action Button with light sweep on hover */}
          <motion.div
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full sm:w-auto"
          >
            <Link 
              href="/catalog" 
              className="group relative w-full sm:w-auto glass-button px-8 py-4 text-base font-semibold border-white/50 bg-white/40 dark:bg-white/10 hover:bg-primary-pink/15 hover:border-primary-pink/30 shadow-lg text-white overflow-hidden"
            >
              {/* Shine Sweep Animation */}
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
              <span className="relative z-10 flex items-center gap-2">
                Explore Catalog
                <ArrowRight className="w-5 h-5 text-white" />
              </span>
            </Link>
          </motion.div>

          {/* Secondary Action Button with light sweep on hover */}
          <motion.div
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full sm:w-auto"
          >
            <Link 
              href="/book" 
              className="group relative w-full sm:w-auto glass-button px-8 py-4 text-base font-semibold border-white/30 bg-white/20 dark:bg-white/5 hover:bg-white/40 hover:border-white/50 shadow-md text-white overflow-hidden"
            >
              {/* Shine Sweep Animation */}
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
              <span className="relative z-10 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-white" />
                Book a Slot
              </span>
            </Link>
          </motion.div>
        </motion.div>

        {/* Stat Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-3 gap-6 border-t border-white/20 pt-8 mt-10 w-full max-w-xl"
        >
          <div>
            <span className="block text-2xl md:text-3xl font-serif font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">100%</span>
            <span className="block text-[10px] md:text-xs uppercase tracking-widest text-white/80 mt-1 font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]">Bespoke Art</span>
          </div>
          <div>
            <span className="block text-2xl md:text-3xl font-serif font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">15+</span>
            <span className="block text-[10px] md:text-xs uppercase tracking-widest text-white/80 mt-1 font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]">Years of Craft</span>
          </div>
          <div>
            <span className="block text-2xl md:text-3xl font-serif font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">5-Star</span>
            <span className="block text-[10px] md:text-xs uppercase tracking-widest text-white/80 mt-1 font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]">Customer Care</span>
          </div>
        </motion.div>

      </div>

      {/* Scalloped Wavy Divider with Glass Polish */}
      <div className="absolute bottom-0 left-0 right-0 z-40 pointer-events-none w-full block">
        <svg 
          viewBox="0 0 1440 120" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto translate-y-[2px]"
          preserveAspectRatio="none"
        >
          {/* Glass overlay with backdrop blur tracking the wave */}
          <path 
            d="M0,60 C240,110 480,110 720,60 C960,10 1200,10 1440,60 L1440,120 L0,120 Z" 
            fill="rgba(255, 253, 249, 0.35)" 
            className="backdrop-blur-md"
          />
          {/* Translucent white border tracking the edge */}
          <path 
            d="M0,60 C240,110 480,110 720,60 C960,10 1200,10 1440,60" 
            stroke="rgba(255, 255, 255, 0.65)" 
            strokeWidth="3"
            fill="none"
            className="drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
          />
          {/* Main solid bottom wave */}
          <path 
            d="M0,64 C240,114 480,114 720,64 C960,14 1200,14 1440,64 L1440,120 L0,120 Z" 
            fill="var(--bg-vanilla)" 
            className="transition-colors duration-500 fill-bg-vanilla dark:fill-bg-vanilla-cream"
          />
        </svg>
      </div>

      {/* Responsive Clip Path Definition */}
      <svg className="absolute w-0 h-0 pointer-events-none">
        <defs>
          <clipPath id="hero-clip-path" clipPathUnits="objectBoundingBox">
            <path d="M 0,0.038 C 0.111,0 0.222,0 0.333,0.038 C 0.416,0.073 0.583,0.073 0.666,0.038 C 0.777,0 0.888,0 1,0.038 L 1,1 L 0,1 Z" />
          </clipPath>
        </defs>
      </svg>
    </section>
  );
}
