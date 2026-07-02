'use client';

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronDown, 
  Search, 
  ShoppingBag, 
  User, 
  Sparkles, 
  Cake, 
  Heart, 
  Calendar,
  ArrowRight,
  Sparkle
} from "lucide-react";
import { Sacramento } from "next/font/google";

const sacramento = Sacramento({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

// Types for navigation items
interface DropdownItem {
  name: string;
  href: string;
  desc: string;
}

interface CategoryGroup {
  title: string;
  icon: React.ReactNode;
  items: DropdownItem[];
}

export default function MegaHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileCategoriesExpanded, setMobileCategoriesExpanded] = useState(false);
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle scroll detection for sticky glass updates
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Category mapping for the Mega Dropdown Menu
  const categories: CategoryGroup[] = [
    {
      title: "Celebration Bakes",
      icon: <Cake className="w-4 h-4 text-primary-pink" />,
      items: [
        { name: "Wedding Masterpieces", href: "/categories/wedding", desc: "Bespoke tier creations styled for your story" },
        { name: "Birthday Specials", href: "/categories/birthday", desc: "Whimsical designs for unforgettable milestones" },
        { name: "Anniversary Couture", href: "/categories/anniversary", desc: "Timeless bakes symbolizing everlasting love" },
        { name: "Sculptural Custom Art", href: "/categories/custom", desc: "Cake sculptures designed to amaze guests" }
      ]
    },
    {
      title: "Fine Pastries & Treats",
      icon: <Sparkles className="w-4 h-4 text-primary-pink" />,
      items: [
        { name: "Signature Cupcakes", href: "/categories/cupcakes", desc: "Fluffy bakes dressed in velvety toppings" },
        { name: "French Macarons", href: "/categories/macarons", desc: "Delicate almond shells filled with fresh ganache" },
        { name: "Eclairs & Profiteroles", href: "/categories/choux", desc: "Crisp choux pastry featuring house custard" },
        { name: "Artisanal Tartlets", href: "/categories/tartlets", desc: "Crispy tart shells holding seasonal curds" }
      ]
    },
    {
      title: "Dietary Artistry",
      icon: <Heart className="w-4 h-4 text-primary-pink" />,
      items: [
        { name: "Vegan Luxe Collection", href: "/categories/vegan", desc: "Dairy-free luxury without flavor compromises" },
        { name: "Gluten-Free Wonders", href: "/categories/gluten-free", desc: "Coeliac-friendly bakes made with fresh grains" },
        { name: "Refined Sugar-Free", href: "/categories/sugar-free", desc: "Naturally sweetened to guiltless perfection" },
        { name: "Organic Botanical", href: "/categories/organic", desc: "Crafted strictly with local, farm-fresh harvest" }
      ]
    }
  ];

  // Helper handling dropdown hover timings
  const handleMouseEnter = (menu: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(menu);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white dark:bg-bg-vanilla-cream pb-4 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6 relative flex items-center justify-between">
        
        {/* Desktop Navigation Split Grid */}
        <div className="hidden md:grid grid-cols-3 items-center w-full relative">
          
          {/* Left Side Links */}
          <div className="flex items-center gap-8 justify-start">
            <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
              <Link href="/" className="text-sm font-medium tracking-wide text-accent-chocolate dark:text-white hover:text-primary-pink transition-colors">
                Home
              </Link>
            </motion.div>

            {/* Categories Menu Trigger (Hoverable) */}
            <div 
              onMouseEnter={() => handleMouseEnter("categories")}
              onMouseLeave={handleMouseLeave}
              className="py-2"
            >
              <button className="flex items-center gap-1.5 text-sm font-medium tracking-wide text-accent-chocolate dark:text-white hover:text-primary-pink transition-colors cursor-pointer bg-transparent border-none">
                Categories
                <motion.div
                  animate={{ rotate: activeDropdown === "categories" ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <ChevronDown className="w-4 h-4 text-accent-chocolate-light dark:text-bg-vanilla-cream/70" />
                </motion.div>
              </button>

              {/* Mega Dropdown Panel */}
              <AnimatePresence>
                {activeDropdown === "categories" && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute top-[80%] left-0 right-0 mx-auto mt-4 w-[calc(100%-2rem)] max-w-5xl rounded-3xl glass-card border border-white/40 p-8 shadow-2xl z-50 bg-bg-vanilla/95 dark:bg-bg-vanilla-cream/95 backdrop-blur-xl before:content-[''] before:absolute before:-top-4 before:left-0 before:right-0 before:h-4"
                  >
                    <div className="grid grid-cols-12 gap-8">
                      
                      {/* Left: Dynamic Cake Categories Layout */}
                      <div className="col-span-9 grid grid-cols-3 gap-6">
                        {categories.map((cat, idx) => (
                          <div key={idx} className="flex flex-col">
                            <div className="flex items-center gap-2 mb-4 border-b border-accent-chocolate/5 dark:border-white/5 pb-2">
                              {cat.icon}
                              <span className="text-xs font-bold uppercase tracking-wider text-accent-chocolate-light dark:text-primary-pink-soft">
                                {cat.title}
                              </span>
                            </div>
                            <ul className="space-y-3">
                              {cat.items.map((item, itemIdx) => (
                                <li key={itemIdx}>
                                  <Link 
                                    href={item.href}
                                    className="group/item block rounded-xl p-2 hover:bg-primary-pink/10 dark:hover:bg-primary-pink/10 transition-colors duration-200"
                                  >
                                    <div className="flex items-center gap-1 text-sm font-semibold text-accent-chocolate dark:text-bg-vanilla group-hover/item:text-primary-pink-deep dark:group-hover/item:text-primary-pink transition-colors">
                                      {item.name}
                                      <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-200" />
                                    </div>
                                    <p className="text-xs text-accent-chocolate-light dark:text-bg-vanilla-cream/70 line-clamp-2 mt-0.5 font-normal">
                                      {item.desc}
                                    </p>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>

                      {/* Right: Featured Interactive Banner */}
                      <div className="col-span-3 flex flex-col justify-between rounded-2xl bg-gradient-to-br from-primary-pink/20 to-primary-pink-soft/10 dark:from-primary-pink/10 dark:to-accent-chocolate/20 p-6 border border-white/20">
                        <div>
                          <div className="inline-flex items-center gap-1 rounded-full bg-white/70 dark:bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-accent-chocolate dark:text-primary-pink-soft border border-white/50">
                            <Sparkle className="w-3.5 h-3.5 text-gold-accent fill-gold-accent" />
                            Chef's Highlight
                          </div>
                          <h4 className="mt-4 text-base font-serif font-bold text-accent-chocolate dark:text-white leading-snug">
                            Raspberry Rose Gold Truffle Cake
                          </h4>
                          <p className="mt-1 text-xs text-accent-chocolate-light dark:text-bg-vanilla-cream/80 leading-relaxed font-normal">
                            A triple-layered champagne sponge layered with biological wild berries and premium white chocolate frosting.
                          </p>
                        </div>

                        <div className="relative group overflow-hidden rounded-xl mt-6">
                          <Link 
                            href="/order/featured"
                            className="glass-button relative py-2 px-4 text-xs font-semibold hover:bg-primary-pink hover:text-white transition-all duration-300 flex items-center justify-between w-full border border-white/20 bg-white/25 dark:bg-white/10 backdrop-blur-md"
                          >
                            {/* Shine Sweep Overlay */}
                            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
                            <span className="relative z-10 flex items-center justify-between w-full">
                              Discover Sweet Art
                              <ArrowRight className="w-4 h-4" />
                            </span>
                          </Link>
                        </div>
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
              <Link href="/about" className="text-sm font-medium tracking-wide text-accent-chocolate dark:text-white hover:text-primary-pink transition-colors">
                Our Craft
              </Link>
            </motion.div>
          </div>

          {/* Centered Brand Identity (Pure SVG Logo & Custom Typography) */}
          <div className="flex justify-center items-center">
            <Link href="/" className="group flex flex-col items-center select-none z-50 transform translate-y-3.5">
              {/* Arched peripheral subtext */}
              <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-accent-chocolate/65 dark:text-bg-vanilla/65 mb-1 transition-colors">
                Baked with Style
              </span>
              
              {/* Vector Rolling Pin & Floral Bundle */}
              <div className="relative w-48 h-6 flex items-center justify-center">
                
                {/* Floral Bundle */}
                <svg className="absolute -top-3.5 w-36 h-7 z-10 overflow-visible pointer-events-none" viewBox="0 0 100 20">
                  {/* Left Leaf */}
                  <path d="M 42,12 C 37,8 38,6 42,11" fill="none" stroke="#8f9779" strokeWidth="1.2" strokeLinecap="round" />
                  {/* Right Leaf */}
                  <path d="M 58,12 C 63,8 62,6 58,11" fill="none" stroke="#8f9779" strokeWidth="1.2" strokeLinecap="round" />
                  
                  {/* Flower Petals & Center (Pink) */}
                  <circle cx="50" cy="10" r="3.2" fill="#ffb5a7" />
                  <circle cx="50" cy="10" r="1.2" fill="#f28482" />
                  <circle cx="47" cy="8" r="1.8" fill="#fcd5ce" />
                  <circle cx="53" cy="8" r="1.8" fill="#fcd5ce" />
                  <circle cx="47" cy="12" r="1.8" fill="#fcd5ce" />
                  <circle cx="53" cy="12" r="1.8" fill="#fcd5ce" />
                  
                  {/* Left Mini Flower (Lavender) */}
                  <circle cx="43" cy="11.5" r="2.2" fill="#dbcdf0" />
                  <circle cx="43" cy="11.5" r="0.8" fill="#b5e2fa" />

                  {/* Right Mini Flower (Rose Gold) */}
                  <circle cx="57" cy="11.5" r="2.2" fill="#f7d1cd" />
                  <circle cx="57" cy="11.5" r="0.8" fill="#f28482" />
                </svg>

                {/* Rolling Pin SVG */}
                <svg className="w-full h-full overflow-visible" viewBox="0 0 160 20">
                  {/* Left handle */}
                  <path d="M 12,10 C 12,7 23,7 23,10 C 23,13 12,13 12,10 Z" fill="#b5838d" />
                  <path d="M 23,10 L 33,10" stroke="#a2aab0" strokeWidth="2.2" strokeLinecap="round" />
                  
                  {/* Cylinder */}
                  <rect x="33" y="4" width="94" height="12" rx="3.5" fill="#d4a373" />
                  {/* Cylinder highlight */}
                  <rect x="35" y="5.5" width="90" height="1.8" rx="0.8" fill="#faedcd" opacity="0.65" />

                  {/* Right handle */}
                  <path d="M 148,10 C 148,7 137,7 137,10 C 137,13 148,13 148,10 Z" fill="#b5838d" />
                  <path d="M 137,10 L 127,10" stroke="#a2aab0" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
              </div>

              {/* Typography Brand Script */}
              <span className={`${sacramento.className} text-3xl font-bold text-accent-chocolate dark:text-white drop-shadow-[0_1px_1.5px_rgba(255,255,255,0.85)] dark:drop-shadow-[0_1px_1.5px_rgba(0,0,0,0.6)] mt-1.5 tracking-wide select-none`}>
                Cake By Lochi
              </span>
            </Link>
          </div>

          {/* Right Side Links & Utilities */}
          <div className="flex items-center gap-8 justify-end">
            <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
              <Link href="/blog" className="text-sm font-medium tracking-wide text-accent-chocolate dark:text-white hover:text-primary-pink transition-colors">
                Blog
              </Link>
            </motion.div>

            <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
              <Link href="/shop" className="text-sm font-medium tracking-wide text-accent-chocolate dark:text-white hover:text-primary-pink transition-colors">
                Shop
              </Link>
            </motion.div>

            <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
              <Link href="/contacts" className="text-sm font-medium tracking-wide text-accent-chocolate dark:text-white hover:text-primary-pink transition-colors">
                Contacts
              </Link>
            </motion.div>

            <span className="h-4 w-px bg-accent-chocolate/10 dark:bg-white/10" />

            {/* Utilities */}
            <div className="flex items-center gap-3">
              {/* Search Button */}
              <motion.button 
                whileHover={{ scale: 1.08, y: -1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-accent-chocolate dark:text-bg-vanilla hover:bg-primary-pink/15 rounded-full transition-colors cursor-pointer bg-white/20 dark:bg-white/5 backdrop-blur-md border border-white/20 shadow-sm"
                aria-label="Search Catalog"
              >
                <Search className="w-4 h-4" />
              </motion.button>

              {/* Cart Icon with indicator */}
              <motion.button 
                whileHover={{ scale: 1.08, y: -1 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2 text-accent-chocolate dark:text-bg-vanilla hover:bg-primary-pink/15 rounded-full transition-colors cursor-pointer bg-white/20 dark:bg-white/5 backdrop-blur-md border border-white/20 shadow-sm"
                aria-label="Shopping Bag"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary-pink text-[9px] font-bold text-white shadow-sm">
                  2
                </span>
              </motion.button>

              {/* Book Now primary CTA */}
              <motion.div
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                className="hidden lg:block relative group overflow-hidden rounded-full"
              >
                <Link 
                  href="/book" 
                  className="glass-button relative py-2 px-4 text-xs font-semibold tracking-wide shadow-md border border-white/20 bg-white/20 dark:bg-white/10 backdrop-blur-md hover:bg-primary-pink/15 transition-all duration-300 flex items-center gap-1.5"
                >
                  {/* Shine Sweep Overlay */}
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
                  <Calendar className="w-3.5 h-3.5 text-primary-pink" />
                  Book Now
                </Link>
              </motion.div>
            </div>

          </div>

        </div>

        {/* Mobile Layout */}
        <div className="flex md:hidden items-center justify-between w-full">
          {/* Logo */}
          <Link href="/" className="group flex flex-col items-center">
            <span className={`${sacramento.className} text-xl font-bold text-accent-chocolate dark:text-white`}>
              Cake By Lochi
            </span>
          </Link>

          {/* Right Mobile Utilities */}
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-accent-chocolate dark:text-bg-vanilla" />
            
            {/* Hamburger Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-accent-chocolate dark:text-bg-vanilla hover:bg-primary-pink/15 rounded-full transition-colors cursor-pointer"
              aria-label="Toggle Mobile Menu"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center relative">
                <span className={`w-5 h-0.5 bg-accent-chocolate dark:bg-bg-vanilla rounded-full absolute transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45' : '-translate-y-1.5'}`} />
                <span className={`w-5 h-0.5 bg-accent-chocolate dark:bg-bg-vanilla rounded-full absolute transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
                <span className={`w-5 h-0.5 bg-accent-chocolate dark:bg-bg-vanilla rounded-full absolute transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45' : 'translate-y-1.5'}`} />
              </div>
            </button>
          </div>
        </div>

      </div>

      {/* Golden Inverted Triple Arch Bottom Boundary */}
      <div className="absolute bottom-[-40px] left-0 right-0 w-full overflow-hidden pointer-events-none h-12">
        <svg
          viewBox="0 0 1440 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full preserve-3d"
          preserveAspectRatio="none"
        >
          {/* Main solid bottom arch fill */}
          <path
            d="M0,24 C160,4 320,4 480,24 C600,44 840,44 960,24 C1120,4 1280,4 1440,24 L1440,0 L0,0 Z"
            fill="white"
            className="fill-white dark:fill-bg-vanilla-cream"
          />
          {/* Golden stroke trace */}
          <path
            d="M0,24 C160,4 320,4 480,24 C600,44 840,44 960,24 C1120,4 1280,4 1440,24"
            stroke="#c5a059"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      </div>

      {/* Mobile Drawer Panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-full left-4 right-4 mt-2 overflow-y-auto max-h-[calc(100vh-6rem)] rounded-3xl glass-card border border-white/30 shadow-2xl md:hidden bg-white/98 dark:bg-bg-vanilla-cream/98"
          >
            <div className="flex flex-col gap-6 p-6">
              
              {/* Primary Mobile Nav Links */}
              <nav className="flex flex-col gap-4">
                <Link 
                  href="/" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base font-semibold text-accent-chocolate dark:text-bg-vanilla py-1.5 border-b border-accent-chocolate/5 dark:border-white/5"
                >
                  Home
                </Link>

                {/* Mobile Categories Group */}
                <div>
                  <button 
                    onClick={() => setMobileCategoriesExpanded(!mobileCategoriesExpanded)}
                    className="flex items-center justify-between w-full text-base font-semibold text-accent-chocolate dark:text-bg-vanilla py-1.5 border-b border-accent-chocolate/5 dark:border-white/5 cursor-pointer bg-transparent border-none"
                  >
                    <span>Categories</span>
                    <motion.div
                      animate={{ rotate: mobileCategoriesExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-5 h-5 text-accent-chocolate-light" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {mobileCategoriesExpanded && (
                      <motion.ul 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pl-4 mt-2 space-y-4 border-l border-primary-pink/30 overflow-hidden"
                      >
                        {categories.map((cat, idx) => (
                          <li key={idx} className="space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-accent-chocolate-light/60 dark:text-primary-pink-soft/60 block pt-2">
                              {cat.title}
                            </span>
                            <ul className="space-y-1 pl-2">
                              {cat.items.map((item, itemIdx) => (
                                <li key={itemIdx}>
                                  <Link 
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block py-1 text-sm font-medium text-accent-chocolate dark:text-bg-vanilla-cream hover:text-primary-pink transition-colors"
                                  >
                                    {item.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>

                <Link 
                  href="/about" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base font-semibold text-accent-chocolate dark:text-bg-vanilla py-1.5 border-b border-accent-chocolate/5 dark:border-white/5"
                >
                  Our Craft
                </Link>

                <Link 
                  href="/blog" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base font-semibold text-accent-chocolate dark:text-bg-vanilla py-1.5 border-b border-accent-chocolate/5 dark:border-white/5"
                >
                  Blog
                </Link>

                <Link 
                  href="/shop" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base font-semibold text-accent-chocolate dark:text-bg-vanilla py-1.5 border-b border-accent-chocolate/5 dark:border-white/5"
                >
                  Shop
                </Link>

                <Link 
                  href="/contacts" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base font-semibold text-accent-chocolate dark:text-bg-vanilla py-1.5 border-b border-accent-chocolate/5 dark:border-white/5"
                >
                  Contacts
                </Link>
              </nav>

              {/* Mobile CTA */}
              <div className="flex flex-col gap-4 mt-4">
                <Link 
                  href="/book"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="glass-button w-full py-3 text-center text-sm font-bold shadow-md bg-primary-pink/15 hover:bg-primary-pink text-accent-chocolate dark:text-bg-vanilla border border-primary-pink/30 flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4 text-primary-pink" />
                  Book A Consultation
                </Link>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </header>
  );
}
