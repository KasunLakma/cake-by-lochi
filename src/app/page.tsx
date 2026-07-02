'use client';

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  MapPin, 
  Phone, 
  Mail, 
  ChevronRight, 
  Check 
} from "lucide-react";

// Custom inline Instagram icon component to avoid older lucide-react exports issues
const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

import MegaHeader from "../components/shared/mega-header";
import HeroSection from "../components/shared/hero-section";
import ProductCatalog from "../components/shared/product-catalog";
import Testimonials from "../components/shared/testimonials";

export default function Home() {
  const [emailInput, setEmailInput] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim() !== "") {
      setIsSubscribed(true);
      setEmailInput("");
      setTimeout(() => setIsSubscribed(false), 5000);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg-vanilla dark:bg-bg-vanilla-cream text-accent-chocolate dark:text-bg-vanilla transition-colors duration-500 overflow-x-hidden font-sans pt-20">
      
      {/* 1. Mega Navigation Header */}
      <MegaHeader />

      <main className="flex-1 w-full">
        
        {/* 2. Visually Striking Hero Section */}
        <HeroSection />

        {/* 3. Featured Products Showcase */}
        <ProductCatalog />

        {/* 4. Social Proof & Brand Story Layout */}
        <div className="flex flex-col">
          {/* Animated Customer Testimonials grid/slider & TikTok cake-decorating clip */}
          <Testimonials />
          
          {/* Dedicated Typography Block: About Us Brand Story */}
          <section className="relative w-full py-24 px-4 md:px-8 lg:px-12 bg-bg-vanilla-cream dark:bg-bg-vanilla-cream/40 transition-colors duration-500 border-t border-accent-chocolate/5 dark:border-white/5">
            <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
              <div className="absolute top-[20%] left-[10%] w-[30vw] h-[30vw] rounded-full bg-radial from-primary-pink/10 to-transparent blur-3xl opacity-50" />
              <div className="absolute bottom-[20%] right-[10%] w-[30vw] h-[30vw] rounded-full bg-radial from-gold-accent-soft/10 to-transparent blur-3xl opacity-40" />
            </div>
            
            <div className="relative w-full max-w-5xl mx-auto z-10 flex flex-col md:flex-row gap-12 items-center">
              <div className="flex-1 space-y-6">
                <span className="text-xs font-bold uppercase tracking-widest text-primary-pink-deep dark:text-primary-pink">
                  Our Story
                </span>
                <h2 className="font-serif text-3xl md:text-5xl font-bold text-accent-chocolate dark:text-white leading-tight">
                  Sculpting Sweet Memories
                </h2>
                <div className="space-y-4 text-sm text-accent-chocolate-light dark:text-bg-vanilla-cream/80 leading-relaxed font-normal">
                  <p>
                    At <strong className="text-accent-chocolate dark:text-white font-semibold">cake_by_lochi</strong>, we believe a dessert is not merely food—it is an experiential art installation. Founded by culinary designer Chef Lochi, our boutique West London atelier has redefined contemporary pastry by blending architectural form with delicate, natural flavor profiling.
                  </p>
                  <p>
                    Every creation is handmade using meticulously sourced, organic seasonal ingredients. From hand-painted gold leaf accents to intricate geometric frames, we approach each cake with a sculptor's precision and a pastry chef's devotion. Our passion is crafting showstopping centerpieces that capture the unique essence of your celebration and linger in memory long after the last slice is served.
                  </p>
                </div>
              </div>
              
              {/* Visual Frame using Glassmorphism */}
              <div className="w-full md:w-[350px] shrink-0 p-8 rounded-[32px] glass-card border border-white/40 bg-bg-vanilla/30 dark:bg-bg-vanilla-cream/20 shadow-xl text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-primary-pink/10 flex items-center justify-center text-primary-pink-deep dark:text-primary-pink">
                  <Sparkles className="w-8 h-8 fill-primary-pink/20" />
                </div>
                <h4 className="font-serif text-lg font-bold text-accent-chocolate dark:text-white">
                  Bespoke Design Philosophy
                </h4>
                <p className="text-xs text-accent-chocolate-light dark:text-bg-vanilla-cream/70 leading-relaxed italic">
                  "We do not bake cakes. We engineer sweet landmarks that anchor your most cherished moments in time."
                </p>
                <div className="pt-2 text-[10px] font-bold uppercase tracking-widest text-primary-pink-deep dark:text-primary-pink">
                  — Chef Lochi
                </div>
              </div>
            </div>
          </section>
        </div>

      </main>

      {/* 5. Footer */}
      <footer className="relative w-full bg-accent-chocolate dark:bg-accent-chocolate-deep text-bg-vanilla transition-colors duration-500 pt-20 pb-8 px-4 md:px-8 lg:px-12 z-10 border-t border-white/5">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.015] pointer-events-none" />

        <div className="relative w-full max-w-7xl mx-auto z-10">
          
          {/* Main Footer Links Block */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 pb-16 border-b border-white/10">
            
            {/* Col 1: Brand Info */}
            <div className="lg:col-span-4 space-y-4">
              <h3 className="font-serif text-2xl font-bold tracking-wide">
                cake<span className="text-primary-pink">_by_</span>lochi
              </h3>
              <p className="text-xs text-bg-vanilla-cream/70 max-w-xs leading-relaxed font-normal">
                Crafting luxury bespoke cake sculptures and delicate fine pastries designed to elevate life's special milestones.
              </p>
              
              {/* Instagram link icon */}
              <div className="flex gap-2 pt-2">
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 bg-white/5 hover:bg-primary-pink/20 rounded-full border border-white/10 text-bg-vanilla-cream transition-colors duration-300"
                  aria-label="Instagram Profile"
                >
                  <InstagramIcon className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Col 2: Navigation Links */}
            <div className="lg:col-span-2 space-y-4">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary-pink">
                Quick Navigation
              </h4>
              <ul className="space-y-2">
                {["Home", "Catalog", "Bespoke Studio", "Our Craft"].map((link) => (
                  <li key={link}>
                    <Link 
                      href={link === "Home" ? "/" : `/${link.toLowerCase().replace(" ", "-")}`}
                      className="text-xs text-bg-vanilla-cream/70 hover:text-white transition-colors duration-200 flex items-center gap-1 group font-medium"
                    >
                      <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3: Contact details */}
            <div className="lg:col-span-3 space-y-4">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary-pink">
                Dessert Atelier
              </h4>
              <ul className="space-y-3">
                <li className="flex gap-2 items-start text-xs text-bg-vanilla-cream/70 leading-relaxed font-normal">
                  <MapPin className="w-4 h-4 shrink-0 text-primary-pink-soft" />
                  12 Botanical Mews, West London, W11 4UA
                </li>
                <li className="flex gap-2 items-center text-xs text-bg-vanilla-cream/70 font-normal">
                  <Phone className="w-4 h-4 text-primary-pink-soft" />
                  +44 (0) 20 7946 0912
                </li>
                <li className="flex gap-2 items-center text-xs text-bg-vanilla-cream/70 font-normal">
                  <Mail className="w-4 h-4 text-primary-pink-soft" />
                  artistry@cakebylochi.co.uk
                </li>
              </ul>
            </div>

            {/* Col 4: Newsletter */}
            <div className="lg:col-span-3 space-y-4">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary-pink">
                Stay In The Glow
              </h4>
              <p className="text-xs text-bg-vanilla-cream/70 leading-relaxed font-normal">
                Receive secret seasonal recipe insights and early access booking alerts.
              </p>
              
              <form onSubmit={handleSubscribeSubmit} className="flex gap-2 mt-4">
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Enter email address"
                  required
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-primary-pink transition-colors"
                />
                <button
                  type="submit"
                  className="bg-primary-pink/90 hover:bg-primary-pink text-white rounded-xl px-4 py-2.5 text-xs font-bold cursor-pointer transition-colors shadow-md shrink-0 border border-primary-pink"
                >
                  Join
                </button>
              </form>

              <AnimatePresence>
                {isSubscribed && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-1.5 text-[10px] text-green-400 font-semibold"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Thank you! Welcome to the loop.
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

          {/* Bottom Copyright & Policies Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 text-[10px] font-bold uppercase tracking-wider text-bg-vanilla-cream/50">
            <span>
              © 2026 cake_by_lochi. All rights reserved.
            </span>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link href="/cookies" className="hover:text-white transition-colors">Cookie settings</Link>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
