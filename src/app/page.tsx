'use client';

import React, { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronDown, 
  Search, 
  ShoppingBag, 
  ArrowRight,
  Sparkle,
  Sparkles
} from "lucide-react";
import { Sacramento } from "next/font/google";
import ProductCategories from "@/components/shared/product-categories";

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
  items: DropdownItem[];
}

export default function Home() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileCategoriesExpanded, setMobileCategoriesExpanded] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Category mapping for the Mega Dropdown Menu
  const categories: CategoryGroup[] = [
    {
      title: "Celebration Bakes",
      items: [
        { name: "Wedding Masterpieces", href: "/categories/wedding", desc: "Bespoke tier creations styled for your story" },
        { name: "Birthday Specials", href: "/categories/birthday", desc: "Whimsical designs for unforgettable milestones" },
        { name: "Anniversary Couture", href: "/categories/anniversary", desc: "Timeless bakes symbolizing everlasting love" },
        { name: "Sculptural Custom Art", href: "/categories/custom", desc: "Cake sculptures designed to amaze guests" }
      ]
    },
    {
      title: "Fine Pastries & Treats",
      items: [
        { name: "Signature Cupcakes", href: "/categories/cupcakes", desc: "Fluffy bakes dressed in velvety toppings" },
        { name: "French Macarons", href: "/categories/macarons", desc: "Delicate almond shells filled with fresh ganache" },
        { name: "Eclairs & Profiteroles", href: "/categories/choux", desc: "Crisp choux pastry featuring house custard" },
        { name: "Artisanal Tartlets", href: "/categories/tartlets", desc: "Crispy tart shells holding seasonal curds" }
      ]
    },
    {
      title: "Dietary Artistry",
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
    <div className="relative min-h-screen bg-[#fdfbf7] dark:bg-bg-vanilla-cream transition-colors duration-500 overflow-x-hidden font-sans">
      
      {/* Floating White Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full pb-5 transition-all duration-300 flex flex-col h-[120px] bg-transparent">
        {/* Background Glass Panel with Clip-Path */}
        <div 
          className="absolute inset-0 pointer-events-none z-0 bg-white/65 dark:bg-bg-vanilla-cream/65 backdrop-blur-md"
          style={{
            clipPath: "url(#header-clip)"
          }}
        />

        {/* Golden Stroke Rim Overlay */}
        <div className="absolute inset-x-0 bottom-0 pointer-events-none z-10 h-[120px]">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
            preserveAspectRatio="none"
          >
            <path
              d="M0,96 C160,75.6 320,75.6 480,96 C600,115.2 840,115.2 960,96 C1120,75.6 1280,75.6 1440,96"
              stroke="#c5a059"
              strokeWidth="1.5"
              fill="none"
            />
          </svg>
        </div>

        <div className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6 relative flex items-center justify-between z-20">
          
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

            {/* Center Brand Identity (Pure SVG Logo & Custom Typography) */}
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



              {/* Utilities */}
              <div className="flex items-center gap-3">
                {/* Search */}
                <motion.button 
                  whileHover={{ scale: 1.08, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 text-accent-chocolate dark:text-bg-vanilla hover:bg-primary-pink/15 rounded-full transition-colors cursor-pointer bg-white/20 dark:bg-white/5 backdrop-blur-md border border-white/20 shadow-sm"
                  aria-label="Search"
                >
                  <Search className="w-4 h-4" />
                </motion.button>

                {/* Cart */}
                <motion.button 
                  whileHover={{ scale: 1.08, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative p-2 text-accent-chocolate dark:text-bg-vanilla hover:bg-primary-pink/15 rounded-full transition-colors cursor-pointer bg-white/20 dark:bg-white/5 backdrop-blur-md border border-white/20 shadow-sm"
                  aria-label="Cart"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary-pink text-[9px] font-bold text-white shadow-sm">
                    2
                  </span>
                </motion.button>
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

            {/* Mobile Actions */}
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-accent-chocolate dark:text-bg-vanilla" />
              
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

        {/* Responsive Clip Path Definition */}
        <svg className="absolute w-0 h-0 pointer-events-none">
          <defs>
            <clipPath id="header-clip" clipPathUnits="objectBoundingBox">
              <path d="M 0,0 L 1,0 L 1,0.8 C 0.888,0.63 0.777,0.63 0.666,0.8 C 0.583,0.96 0.416,0.96 0.333,0.8 C 0.222,0.63 0.111,0.63 0,0.8 Z" />
            </clipPath>
          </defs>
        </svg>

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
                <nav className="flex flex-col gap-4">
                  <Link 
                    href="/" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-base font-semibold text-accent-chocolate dark:text-bg-vanilla py-1.5 border-b border-accent-chocolate/5 dark:border-white/5"
                  >
                    Home
                  </Link>

                  {/* Categories */}
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
                              <span className="text-[10px] font-bold uppercase tracking-wider text-accent-chocolate-light/60 block pt-2">
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
                    className="text-base font-semibold text-accent-chocolate dark:text-bg-vanilla py-1.5 border-b border-accent-chocolate/5"
                  >
                    Our Craft
                  </Link>

                  <Link 
                    href="/blog" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-base font-semibold text-accent-chocolate dark:text-bg-vanilla py-1.5 border-b border-accent-chocolate/5"
                  >
                    Blog
                  </Link>

                  <Link 
                    href="/shop" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-base font-semibold text-accent-chocolate dark:text-bg-vanilla py-1.5 border-b border-accent-chocolate/5"
                  >
                    Shop
                  </Link>

                  <Link 
                    href="/contacts" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-base font-semibold text-accent-chocolate dark:text-bg-vanilla py-1.5 border-b border-accent-chocolate/5"
                  >
                    Contacts
                  </Link>
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </header>

      {/* Hero Collage Section */}
      <main className="w-full pt-[136px] bg-[#fdfbf7] dark:bg-bg-vanilla-cream min-h-screen flex flex-col">
        
        {/* Collage & Glass Panel Section */}
        <section className="relative w-full flex-grow min-h-[60vh] flex items-center justify-center overflow-hidden py-16">
          
          {/* Collage Grid */}
          <div className="absolute -top-20 bottom-0 left-0 right-0 grid grid-cols-2 md:grid-cols-4 gap-0 z-0">
            <div className="relative h-full w-full overflow-hidden">
              <Image 
                src="/cake_hero_main.png" 
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

            {/* Dark & Soft Pastel Rose-Gold/Vanilla overlay to keep text extremely readable */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#fdfbf7]/45 via-black/45 to-black/60 z-10" />
            <div className="absolute inset-0 bg-rose-900/10 mix-blend-color-burn z-15" />
          </div>

          {/* Centered Glass Text Panel */}
          <div className="relative z-20 w-full max-w-2xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/20 rounded-3xl p-8 sm:p-10 shadow-2xl flex flex-col items-center gap-6"
            >
              
              {/* Floating Sparkles Badge */}
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white border border-white/25 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-pink-200 fill-pink-200/30 animate-pulse" />
                Bespoke Confectionery Art
              </div>

              {/* Main Typography Title */}
              <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white leading-snug drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                Dessert is a Beautiful Cake, Cafes, Coffe and All Sweet WordPress Theme
              </h1>

              {/* Description */}
              <p className="text-xs sm:text-sm text-white/90 max-w-md leading-relaxed font-normal drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)]">
                We co-create architectural cake structures and delicate pastries with organic ingredients, celebrating life's sweet milestones with true artistic excellence.
              </p>

              {/* Explore Catalog Glass Action Button */}
              <div className="relative group overflow-hidden rounded-full mt-2">
                <Link 
                  href="/catalog" 
                  className="group relative flex items-center justify-center gap-2.5 px-8 py-3.5 text-xs font-bold tracking-widest uppercase border border-white/35 bg-white/15 hover:bg-white/25 shadow-lg text-white backdrop-blur-md transition-all duration-300 rounded-full"
                >
                  {/* Shine Sweep Overlay */}
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
                  Explore Catalog
                  <ArrowRight className="w-4 h-4 text-white" />
                </Link>
              </div>

            </motion.div>
          </div>

          {/* Repeating Scalloped / Wavy Border Pattern */}
          <div className="absolute bottom-0 left-0 right-0 z-30 pointer-events-none w-full">
            <svg 
              viewBox="0 0 1440 120" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-auto translate-y-[2px]"
              preserveAspectRatio="none"
            >
              {/* Secondary wave shadow */}
              <path 
                d="M0,60 C240,110 480,110 720,60 C960,10 1200,10 1440,60 L1440,120 L0,120 Z" 
                fill="rgba(255, 255, 255, 0.35)" 
                className="backdrop-blur-md"
              />
              {/* Main solid wave */}
              <path 
                d="M0,64 C240,114 480,114 720,64 C960,14 1200,14 1440,64 L1440,120 L0,120 Z" 
                fill="white"
                className="fill-white dark:fill-bg-vanilla-cream"
              />
            </svg>
          </div>

        </section>

        {/* Product Categories Grid */}
        <ProductCategories />

        {/* Bottom Ribbon Coordinate Bar */}
        <div className="relative z-30 w-full bg-white dark:bg-bg-vanilla-cream py-8 border-t border-accent-chocolate/5 flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl w-full px-6 flex flex-col sm:flex-row items-center justify-between gap-6 text-[10px] font-bold tracking-[0.2em] text-accent-chocolate-light dark:text-bg-vanilla/80 uppercase"
          >
            {/* Phone */}
            <div className="flex items-center gap-2.5">
              <svg className="w-4 h-4 text-primary-pink stroke-[2]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>070 441 5115</span>
            </div>
            
            <span className="hidden sm:block h-4 w-px bg-accent-chocolate/10 dark:bg-white/10" />

            {/* Facebook */}
            <Link href="https://facebook.com" className="flex items-center gap-2.5 hover:text-primary-pink transition-colors">
              <svg className="w-4 h-4 text-primary-pink stroke-[2]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
              <span>Cake By Lochi</span>
            </Link>

            <span className="hidden sm:block h-4 w-px bg-accent-chocolate/10 dark:bg-white/10" />

            {/* Instagram */}
            <Link href="https://instagram.com" className="flex items-center gap-2.5 hover:text-primary-pink transition-colors">
              <svg className="w-4 h-4 text-primary-pink stroke-[2]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
              <span>@cakebylochi</span>
            </Link>
          </motion.div>
        </div>

      </main>

    </div>
  );
}
