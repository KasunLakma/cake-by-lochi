'use client';

import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Calendar, Sparkles, Sparkle } from "lucide-react";

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  // Track scroll position inside the hero section for parallax effects
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });

  // Parallax calculations mapped to scroll progress
  const yMain = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const scaleMain = useTransform(scrollYProgress, [0, 1], [1, 1.06]);
  const yCard = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const rotateCard = useTransform(scrollYProgress, [0, 1], [-2, 3]);
  const yBgBlob = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const scaleBgBlob = useTransform(scrollYProgress, [0, 1], [1, 1.25]);

  // Main heading word-by-word stagger configuration
  const headingText = "Handcrafted Elegance in Every Bite";
  const words = headingText.split(" ");

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      }
    }
  };

  const wordVariants = {
    hidden: { 
      opacity: 0, 
      y: 40,
      rotateX: 20
    },
    visible: { 
      opacity: 1, 
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number] // Premium smooth easing curve
      }
    }
  };

  return (
    <section 
      ref={sectionRef} 
      className="relative w-full min-h-[90vh] lg:min-h-screen flex items-center justify-center overflow-hidden py-24 md:py-32 px-4 md:px-8 lg:px-12 bg-bg-vanilla dark:bg-bg-vanilla-cream transition-colors duration-500"
    >
      
      {/* Background Ambience Blobs */}
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[60vw] h-[60vw] max-w-[800px] rounded-full bg-radial from-primary-pink/15 via-primary-pink-soft/5 to-transparent blur-3xl opacity-80 dark:opacity-60" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[50vw] h-[50vw] max-w-[600px] rounded-full bg-radial from-gold-accent-soft/20 via-primary-pink-soft/5 to-transparent blur-3xl opacity-60 dark:opacity-40" />
      </div>

      {/* Main Grid Layout */}
      <div className="relative w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center z-10">
        
        {/* Left Column: Premium Brand Messaging */}
        <div className="col-span-1 lg:col-span-6 flex flex-col gap-6 items-start text-left">
          
          {/* Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary-pink/15 dark:bg-primary-pink/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-primary-pink-deep dark:text-primary-pink border border-primary-pink/20"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary-pink-deep dark:text-primary-pink fill-primary-pink/20" />
            Artisanal Dessert Studio
          </motion.div>

          {/* Staggered Heading Reveal */}
          <motion.h1 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-accent-chocolate dark:text-white leading-[1.08] perspective-1000"
          >
            {words.map((word, idx) => (
              <span key={idx} className="inline-block overflow-hidden pb-1 mr-3 md:mr-4">
                <motion.span variants={wordVariants} className="inline-block origin-bottom">
                  {word}
                </motion.span>
              </span>
            ))}
          </motion.h1>

          {/* Subheading description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-base md:text-lg text-accent-chocolate-light dark:text-accent-chocolate-light/80 max-w-lg leading-relaxed font-normal"
          >
            Crafting bespoke luxury confections that double as sculptural masterpieces. Every cake is custom-tailored with organic farm-to-table ingredients and timeless Parisian elegance.
          </motion.p>

          {/* Call to Actions (CTAs) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap gap-4 items-center mt-2 w-full sm:w-auto"
          >
            {/* Primary Action Button */}
            <motion.div
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto"
            >
              <Link 
                href="/catalog" 
                className="w-full sm:w-auto glass-button px-8 py-4 text-base font-semibold border-white/50 bg-primary-pink/15 dark:bg-primary-pink/10 hover:bg-primary-pink/25 hover:border-primary-pink/40 shadow-lg text-accent-chocolate dark:text-white"
              >
                Explore Catalog
                <ArrowRight className="w-5 h-5 text-primary-pink-deep dark:text-primary-pink" />
              </Link>
            </motion.div>

            {/* Secondary Action Button */}
            <motion.div
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto"
            >
              <Link 
                href="/book" 
                className="w-full sm:w-auto glass-button px-8 py-4 text-base font-semibold border-white/30 hover:bg-white/40 dark:hover:bg-white/10 shadow-md text-accent-chocolate dark:text-white"
              >
                <Calendar className="w-5 h-5 text-primary-pink-deep dark:text-primary-pink" />
                Book a Slot
              </Link>
            </motion.div>
          </motion.div>

          {/* Spacing Compliant Stat Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-3 gap-6 border-t border-accent-chocolate/10 dark:border-white/10 pt-8 mt-10 w-full"
          >
            <div>
              <span className="block text-2xl md:text-3xl font-serif font-bold text-accent-chocolate dark:text-white">100%</span>
              <span className="block text-[10px] md:text-xs uppercase tracking-widest text-accent-chocolate-light/80 dark:text-accent-chocolate-light/70 mt-1 font-medium">Bespoke Art</span>
            </div>
            <div>
              <span className="block text-2xl md:text-3xl font-serif font-bold text-accent-chocolate dark:text-white">15+</span>
              <span className="block text-[10px] md:text-xs uppercase tracking-widest text-accent-chocolate-light/80 dark:text-accent-chocolate-light/70 mt-1 font-medium">Years of Craft</span>
            </div>
            <div>
              <span className="block text-2xl md:text-3xl font-serif font-bold text-accent-chocolate dark:text-white">5-Star</span>
              <span className="block text-[10px] md:text-xs uppercase tracking-widest text-accent-chocolate-light/80 dark:text-accent-chocolate-light/70 mt-1 font-medium">Customer Care</span>
            </div>
          </motion.div>

        </div>

        {/* Right Column: Multi-Layered Immersive Parallax Image */}
        <div className="relative col-span-1 lg:col-span-6 flex items-center justify-center min-h-[450px] sm:min-h-[500px] lg:min-h-[600px] z-20">
          
          {/* Background Ambient Glow (Parallaxed) */}
          <motion.div 
            style={{ y: yBgBlob, scale: scaleBgBlob }}
            className="absolute w-[80%] h-[80%] rounded-full bg-radial from-primary-pink/30 via-primary-pink-soft/5 to-transparent blur-3xl z-0 pointer-events-none"
          />

          {/* Decorative Back Drop Dot Pattern */}
          <div className="absolute inset-0 bg-dot-pattern opacity-40 dark:opacity-20 z-0 pointer-events-none" />

          {/* Main Cake Image (Parallaxed & Scaled) */}
          <motion.div
            style={{ y: yMain, scale: scaleMain }}
            className="relative w-[80%] max-w-[420px] aspect-[4/5] rounded-[32px] md:rounded-[40px] overflow-hidden shadow-2xl z-10 border border-white/20"
          >
            <Image
              src="/cake_hero_main.png"
              alt="Bespoke Cake Artistry"
              fill
              priority
              className="object-cover"
              sizes="(max-w-768px) 100vw, 50vw"
            />
            {/* Light glare gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 pointer-events-none" />
          </motion.div>

          {/* Floating Glassmorphic Chef's Highlight Overlay Card */}
          <motion.div
            style={{ y: yCard, rotate: rotateCard }}
            className="absolute bottom-6 left-[2%] sm:left-[10%] max-w-[240px] rounded-2xl glass-card border border-white/50 p-4 shadow-2xl z-20 bg-bg-vanilla/95 dark:bg-bg-vanilla-cream/95 backdrop-blur-xl pointer-events-auto"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary-pink/20 rounded-xl text-primary-pink-deep">
                <Sparkle className="w-5 h-5 fill-primary-pink/40 text-primary-pink-deep" />
              </div>
              <div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-primary-pink-deep dark:text-primary-pink-soft">
                  Chef's Selection
                </span>
                <h4 className="font-serif font-bold text-sm text-accent-chocolate dark:text-white mt-0.5 leading-snug">
                  The Rose Gold Truffle
                </h4>
                <p className="text-[11px] text-accent-chocolate-light/95 dark:text-accent-chocolate-light/80 mt-1 leading-relaxed font-normal">
                  Organic rosewater wash, wild berry compote, signature white chocolate frost.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Floating Rose Gold Sparkle Element */}
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 360],
            }}
            transition={{ 
              y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 16, repeat: Infinity, ease: "linear" }
            }}
            className="absolute top-10 right-[5%] sm:right-[15%] p-3 rounded-full glass-card border border-white/60 shadow-lg text-gold-accent z-20 bg-white/40 backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 fill-gold-accent text-gold-accent" />
          </motion.div>
          
        </div>

      </div>

    </section>
  );
}
