'use client';

import React, { useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/cart-context";
import Image from "next/image";
import { 
  ChevronDown, 
  Search, 
  ShoppingBag, 
  Calendar,
  Sparkle,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { Sacramento } from "next/font/google";

const sacramento = Sacramento({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

interface DropdownItem {
  name: string;
  href: string;
  desc: string;
}

interface CategoryGroup {
  title: string;
  items: DropdownItem[];
}

export default function MegaHeader() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileCategoriesExpanded, setMobileCategoriesExpanded] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cartItems, removeFromCart, updateQuantity, cartCount, cartSubtotal } = useCart();

  const categories: CategoryGroup[] = [
    {
      title: "Signature Bakes",
      items: [
        { name: "Celebration Cakes", href: "/shop?category=celebration-cakes", desc: "Multi-layered luxury custom creations" },
        { name: "Artisanal Cupcakes", href: "/shop?category=cupcakes", desc: "Hand-piped buttercream delicate bites" },
        { name: "French Macarons", href: "/shop?category=macarons", desc: "Crisp almond shells with rich ganache fills" }
      ]
    },
    {
      title: "Specialties",
      items: [
        { name: "Coffee & Chocolate", href: "/shop?category=coffee-chocolate", desc: "Single-origin cacao and espresso fusions" },
        { name: "Organic Botanical", href: "/shop?category=organic-botanical", desc: "Crafted strictly with local, farm-fresh harvest" }
      ]
    }
  ];

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
    <>
      <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300 flex flex-col h-[120px] bg-transparent">
      {/* Background Glass Panel */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 bg-white/10 backdrop-blur-md border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.03)]"
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

      {/* Main Content Layout Container */}
      <div className="mx-auto w-full max-w-7xl px-8 py-5 relative flex items-center justify-between gap-4 z-20">
        
        {/* Desktop Navigation Split Grid */}
        <div className="hidden md:grid grid-cols-3 items-center w-full relative gap-4 lg:gap-8">
          
          {/* Left Side Links */}
          <div className="flex items-center gap-8 justify-start flex-row -mt-4">
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

              {/* Categories Mega Dropdown Menu */}
              <AnimatePresence>
                {activeDropdown === "categories" && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute top-full left-0 mt-2 w-[460px] rounded-3xl overflow-hidden glass-card border border-white/30 shadow-2xl p-6 bg-white/95 dark:bg-bg-vanilla-cream/95 backdrop-blur-xl z-50 flex flex-col gap-6"
                  >
                    <div className="grid grid-cols-2 gap-6">
                      {categories.map((group, groupIdx) => (
                        <div key={groupIdx} className="space-y-3">
                          <span className="text-[10px] font-extrabold tracking-widest text-primary-pink-deep dark:text-primary-pink-soft uppercase block border-b border-primary-pink/10 pb-1.5">
                            {group.title}
                          </span>
                          <ul className="space-y-2">
                            {group.items.map((item, itemIdx) => (
                              <li key={itemIdx}>
                                <Link 
                                  href={item.href}
                                  className="group/item flex flex-col hover:bg-primary-pink/5 p-2 rounded-xl transition-colors duration-200"
                                >
                                  <span className="text-xs font-bold text-accent-chocolate dark:text-white group-hover/item:text-primary-pink transition-colors">
                                    {item.name}
                                  </span>
                                  <span className="text-[9px] text-zinc-800 dark:text-zinc-100 mt-0.5 leading-relaxed font-normal">
                                    {item.desc}
                                  </span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    {/* Bottom CTA Block inside Dropdown */}
                    <div className="bg-primary-pink/10 dark:bg-white/5 rounded-2xl p-4 flex items-center justify-between border border-primary-pink/15">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-accent-chocolate dark:text-white flex items-center gap-1">
                          <Sparkle className="w-3.5 h-3.5 text-primary-pink fill-primary-pink/20" />
                          Custom Orders Available
                        </span>
                        <span className="text-[9px] text-zinc-800 dark:text-zinc-100 mt-0.5 font-normal">
                          Reserve a bespoke design for your celebration
                        </span>
                      </div>
                      <Link 
                        href="/contacts" 
                        className="glass-button relative py-2 px-3 text-[10px] font-bold tracking-wide shadow-md border border-white/20 bg-white/25 dark:bg-white/10 backdrop-blur-md hover:bg-primary-pink hover:text-white transition-all duration-300 flex items-center gap-1 rounded-xl"
                      >
                        Inquire
                      </Link>
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
          <div className="flex justify-center items-center flex-shrink-0">
            <Link href="/" className="group flex flex-col items-center select-none z-50 flex-shrink-0">
              {/* Arched peripheral subtext */}
              <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-accent-chocolate/65 dark:text-bg-vanilla/65 mb-1 transition-colors">
                Baked with Style
              </span>
              
              {/* Vector Rolling Pin & Floral Bundle */}
              <div className="relative w-48 h-6 flex items-center justify-center flex-shrink-0">
                
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
          <div className="flex items-center gap-8 justify-end flex-row -mt-4">
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
              {/* Search Trigger and Dropdown */}
              <div className="relative">
                <motion.button 
                  whileHover={{ scale: 1.08, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="p-2 text-accent-chocolate dark:text-bg-vanilla hover:bg-primary-pink/15 rounded-full transition-colors cursor-pointer bg-white/20 dark:bg-white/5 backdrop-blur-md border border-white/20 shadow-sm animate-fade-in"
                  aria-label="Search Catalog"
                >
                  <Search className="w-4 h-4" />
                </motion.button>

                <AnimatePresence>
                  {isSearchOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute top-full right-0 mt-2.5 w-72 bg-white/95 dark:bg-bg-vanilla-cream/95 backdrop-blur-md border border-accent-chocolate/10 dark:border-white/10 p-2.5 rounded-2xl shadow-2xl z-50 flex items-center gap-2"
                    >
                      <input 
                        type="text" 
                        autoFocus
                        placeholder="Search cakes..." 
                        className="w-full bg-transparent text-xs font-semibold text-accent-chocolate dark:text-white placeholder-accent-chocolate-light/50 dark:placeholder-white/40 focus:outline-none px-2 py-1.5"
                      />
                      <button 
                        onClick={() => setIsSearchOpen(false)}
                        className="text-accent-chocolate-light hover:text-primary-pink transition-colors p-1"
                        aria-label="Clear Search"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Cart Icon with indicator */}
              <motion.button 
                whileHover={{ scale: 1.08, y: -1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-accent-chocolate dark:text-bg-vanilla hover:bg-primary-pink/15 rounded-full transition-colors cursor-pointer bg-white/20 dark:bg-white/5 backdrop-blur-md border border-white/20 shadow-sm animate-fade-in"
                aria-label="View Shopping Cart"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary-pink text-[9px] font-bold text-white shadow-sm animate-scale-in">
                  {cartCount}
                </span>
              </motion.button>
            </div>
          </div>

        </div>

        {/* Mobile Layout */}
        <div className="flex md:hidden items-center justify-between w-full z-20 gap-4">
          {/* Logo */}
          <Link href="/" className="group flex flex-col items-center flex-shrink-0">
            <span className={`${sacramento.className} text-xl font-bold text-accent-chocolate dark:text-white`}>
              Cake By Lochi
            </span>
          </Link>

          {/* Right Mobile Utilities */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => { setIsCartOpen(true); setIsMobileMenuOpen(false); }}
              className="relative p-2 text-accent-chocolate dark:text-bg-vanilla hover:bg-primary-pink/15 rounded-full transition-colors cursor-pointer bg-white/20 dark:bg-white/5 backdrop-blur-md border border-white/20 shadow-sm"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary-pink text-[9px] font-bold text-white shadow-sm">
                {cartCount}
              </span>
            </button>
            
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
            className="absolute top-full left-4 right-4 mt-2 overflow-y-auto max-h-[calc(100vh-6rem)] rounded-3xl glass-card border border-white/30 shadow-2xl md:hidden bg-white/98 dark:bg-bg-vanilla-cream/98 z-50"
          >
            <div className="flex flex-col gap-6 p-6">
              
              {/* Primary Mobile Nav Links */}
              <nav className="flex flex-col gap-4">
                <Link 
                  href="/" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base font-semibold text-accent-chocolate dark:text-bg-vanilla py-1.5 border-b border-accent-chocolate/5"
                >
                  Home
                </Link>

                {/* Expandable Categories Group */}
                <div className="flex flex-col">
                  <button 
                    onClick={() => setMobileCategoriesExpanded(!mobileCategoriesExpanded)}
                    className="flex items-center justify-between text-base font-semibold text-accent-chocolate dark:text-bg-vanilla py-1.5 border-b border-accent-chocolate/5 cursor-pointer bg-transparent border-none w-full text-left"
                  >
                    <span>Categories</span>
                    <ChevronDown className={`w-4 h-4 text-accent-chocolate-light transition-transform duration-300 ${mobileCategoriesExpanded ? 'rotate-180' : ''}`} />
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


    {/* Slide-out Cart Drawer */}
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop shadow overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 z-[90] bg-black/45 backdrop-blur-sm cursor-pointer"
          />
          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[400px] z-[100] bg-[#fdfbf7] dark:bg-bg-vanilla-cream shadow-2xl flex flex-col justify-between border-l border-accent-chocolate/10"
          >
            {/* Header */}
            <div className="p-6 border-b border-accent-chocolate/5 flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-accent-chocolate dark:text-white uppercase tracking-wider">
                Your Shopping Bag
              </h3>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="text-accent-chocolate/60 dark:text-white/60 hover:text-primary-pink cursor-pointer p-1"
                aria-label="Close cart"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Items List */}
            <div className="flex-grow p-6 overflow-y-auto flex flex-col gap-6">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-accent-chocolate-light dark:text-bg-vanilla/60 gap-3">
                  <ShoppingBag className="w-12 h-12 stroke-[1.2] text-primary-pink/60 animate-bounce" />
                  <span className="font-serif text-lg font-semibold">Your bag is empty</span>
                  <p className="text-xs max-w-[200px]">Fill it with Chef Lochi's handcrafted sweet masterpieces!</p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={`${item.id}-${item.flavor}`} className="flex gap-4 items-center border-b border-accent-chocolate/5 pb-4">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-accent-chocolate/5">
                      <Image src={item.image || "/cake_hero_main.png"} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-grow flex flex-col text-left">
                      <span className="text-xs font-bold text-accent-chocolate dark:text-white leading-snug">{item.name}</span>
                      <span className="text-[10px] text-accent-chocolate-light/80 dark:text-bg-vanilla/60 mt-0.5">
                        Qty: {item.quantity} | Flavor: {item.flavor}
                      </span>
                      <div className="flex items-center gap-2 mt-1.5">
                        <button 
                          onClick={() => updateQuantity(item.id, item.flavor, item.quantity - 1)}
                          className="w-5 h-5 rounded bg-primary-pink/10 dark:bg-white/10 text-accent-chocolate dark:text-white flex items-center justify-center font-bold text-xs hover:bg-primary-pink hover:text-white transition-colors cursor-pointer"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.flavor, item.quantity + 1)}
                          className="w-5 h-5 rounded bg-primary-pink/10 dark:bg-white/10 text-accent-chocolate dark:text-white flex items-center justify-center font-bold text-xs hover:bg-primary-pink hover:text-white transition-colors cursor-pointer"
                        >
                          +
                        </button>
                        <button 
                          onClick={() => removeFromCart(item.id, item.flavor)}
                          className="text-[10px] text-red-500 hover:text-red-700 ml-auto cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                      <span className="text-xs font-bold text-primary-pink-deep dark:text-primary-pink mt-1">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-accent-chocolate/5 flex flex-col gap-4 bg-white/40 dark:bg-white/5 backdrop-blur-sm">
              <div className="flex justify-between items-baseline font-bold text-sm text-accent-chocolate dark:text-white">
                <span>Cart Subtotal</span>
                <span className="text-base text-primary-pink-deep dark:text-primary-pink">Rs. {cartSubtotal.toLocaleString()}</span>
              </div>
              <Link 
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="glass-button w-full py-3.5 px-6 font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 bg-accent-chocolate border-accent-chocolate text-white hover:bg-accent-chocolate-light dark:bg-rose-600 dark:border-rose-600 dark:text-white dark:hover:bg-rose-700 transition-all duration-300 block text-center shadow-md cursor-pointer"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4 inline" />
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
    </>
  );
}
