'use client';

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Menu, 
  X, 
  ChevronDown, 
  Search, 
  ShoppingBag, 
  User, 
  Sparkles, 
  Cake, 
  Heart, 
  Calendar,
  Gift,
  ArrowRight,
  Sparkle
} from "lucide-react";

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
  
  const dropdownRef = useRef<HTMLDivElement>(null);
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
    <header className="fixed top-0 left-0 right-0 z-50 w-full px-4 pt-4 md:px-6">
      {/* Floating Glass Container */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`mx-auto w-full max-w-7xl rounded-full glass-card border border-white/30 transition-all duration-500 ${
          isScrolled 
            ? "py-2 px-6 shadow-lg bg-bg-vanilla-glow/85 backdrop-blur-lg" 
            : "py-4 px-8 bg-bg-vanilla-glow/65 backdrop-blur-md"
        }`}
      >
        <div className="flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link href="/" className="group relative z-50 flex items-center gap-2">
            <span className="font-serif text-2xl font-bold tracking-wide text-accent-chocolate dark:text-bg-vanilla transition-colors duration-300">
              cake<span className="text-primary-pink group-hover:text-primary-pink-deep transition-colors duration-300">_by_</span>lochi
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="relative text-sm font-medium tracking-wide text-accent-chocolate/85 dark:text-bg-vanilla/90 hover:text-accent-chocolate dark:hover:text-white transition-colors hover-underline-reveal">
              Home
            </Link>

            {/* Categories Menu Trigger (Hoverable) */}
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnter("categories")}
              onMouseLeave={handleMouseLeave}
            >
              <button className="flex items-center gap-1.5 text-sm font-medium tracking-wide text-accent-chocolate/85 dark:text-bg-vanilla/90 hover:text-accent-chocolate dark:hover:text-white transition-colors cursor-pointer">
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
                    className="absolute top-full -left-48 lg:-left-64 mt-4 w-[680px] lg:w-[840px] rounded-3xl glass-card border border-white/40 p-8 shadow-2xl z-50 bg-bg-vanilla/95 dark:bg-bg-vanilla-cream/95 backdrop-blur-xl"
                  >
                    <div className="grid grid-cols-12 gap-8">
                      
                      {/* Left: Dynamic Cake Categories Layout */}
                      <div className="col-span-8 grid grid-cols-2 gap-x-8 gap-y-6">
                        {categories.map((cat, idx) => (
                          <div key={idx} className={idx === 2 ? "col-span-2 grid grid-cols-2 gap-8 border-t border-accent-chocolate/5 dark:border-white/5 pt-6" : ""}>
                            <div className="flex items-center gap-2 mb-2">
                              {cat.icon}
                              <span className="text-xs font-bold uppercase tracking-wider text-accent-chocolate-light dark:text-primary-pink-soft">
                                {cat.title}
                              </span>
                            </div>
                            <ul className="space-y-3">
                              {cat.items.slice(0, idx === 2 ? 4 : 2).map((item, itemIdx) => (
                                <li key={itemIdx}>
                                  <Link 
                                    href={item.href}
                                    className="group/item block rounded-xl p-2 hover:bg-primary-pink/10 dark:hover:bg-primary-pink/10 transition-colors duration-200"
                                  >
                                    <div className="flex items-center gap-1 text-sm font-semibold text-accent-chocolate dark:text-bg-vanilla group-hover/item:text-primary-pink-deep dark:group-hover/item:text-primary-pink transition-colors">
                                      {item.name}
                                      <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-200" />
                                    </div>
                                    <p className="text-xs text-accent-chocolate-light dark:text-bg-vanilla-cream/70 line-clamp-1 mt-0.5 font-normal">
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
                      <div className="col-span-4 flex flex-col justify-between rounded-2xl bg-gradient-to-br from-primary-pink/20 to-primary-pink-soft/10 dark:from-primary-pink/10 dark:to-accent-chocolate/20 p-6 border border-white/20">
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

                        <Link 
                          href="/order/featured"
                          className="mt-6 inline-flex items-center justify-between w-full glass-button py-2 px-4 text-xs font-semibold hover:bg-primary-pink hover:text-white transition-all duration-300"
                        >
                          Discover Sweet Art
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/about" className="relative text-sm font-medium tracking-wide text-accent-chocolate/85 dark:text-bg-vanilla/90 hover:text-accent-chocolate dark:hover:text-white transition-colors hover-underline-reveal">
              Our Craft
            </Link>
            <Link href="/custom-studio" className="relative text-sm font-medium tracking-wide text-accent-chocolate/85 dark:text-bg-vanilla/90 hover:text-accent-chocolate dark:hover:text-white transition-colors hover-underline-reveal">
              Bespoke Studio
            </Link>
          </nav>

          {/* Action Utilities & Menu Icons */}
          <div className="flex items-center gap-2 md:gap-4">
            
            {/* Search Button */}
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2.5 text-accent-chocolate dark:text-bg-vanilla hover:bg-primary-pink/15 rounded-full transition-colors cursor-pointer"
              aria-label="Search Catalog"
            >
              <Search className="w-4 h-4 md:w-5 h-5" />
            </motion.button>

            {/* Profile Button */}
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2.5 text-accent-chocolate dark:text-bg-vanilla hover:bg-primary-pink/15 rounded-full transition-colors cursor-pointer"
              aria-label="User Account"
            >
              <User className="w-4 h-4 md:w-5 h-5" />
            </motion.button>

            {/* Cart Icon with indicator */}
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2.5 text-accent-chocolate dark:text-bg-vanilla hover:bg-primary-pink/15 rounded-full transition-colors cursor-pointer"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="w-4 h-4 md:w-5 h-5" />
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary-pink text-[9px] font-bold text-white shadow-sm">
                2
              </span>
            </motion.button>

            {/* Book Now primary CTA */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="hidden lg:block"
            >
              <Link 
                href="/book" 
                className="glass-button py-2.5 px-6 text-sm font-semibold tracking-wide shadow-md border-white/50"
              >
                <Calendar className="w-4 h-4 text-primary-pink" />
                Book Now
              </Link>
            </motion.div>

            {/* Mobile Hamburger Trigger */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex items-center justify-center p-2 text-accent-chocolate dark:text-bg-vanilla hover:bg-primary-pink/15 rounded-full md:hidden transition-colors cursor-pointer"
              aria-label="Toggle Mobile Menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </motion.button>

          </div>
        </div>
      </motion.div>

      {/* Responsive Mobile Menu Panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-full left-4 right-4 mt-2 overflow-hidden rounded-3xl glass-card border border-white/30 shadow-2xl md:hidden bg-bg-vanilla/98 dark:bg-bg-vanilla-cream/98"
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

                {/* Mobile Categories Dropdown Group */}
                <div>
                  <button 
                    onClick={() => setMobileCategoriesExpanded(!mobileCategoriesExpanded)}
                    className="flex items-center justify-between w-full text-base font-semibold text-accent-chocolate dark:text-bg-vanilla py-1.5 border-b border-accent-chocolate/5 dark:border-white/5 cursor-pointer"
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
                        className="pl-4 mt-2 space-y-2 border-l border-primary-pink/30 overflow-hidden"
                      >
                        {categories.flatMap(c => c.items).map((item, idx) => (
                          <li key={idx}>
                            <Link 
                              href={item.href}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="block py-2 text-sm text-accent-chocolate-light dark:text-bg-vanilla-cream/80 hover:text-primary-pink"
                            >
                              {item.name}
                            </Link>
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
                  href="/custom-studio" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base font-semibold text-accent-chocolate dark:text-bg-vanilla py-1.5 border-b border-accent-chocolate/5 dark:border-white/5"
                >
                  Bespoke Studio
                </Link>
              </nav>

              {/* Mobile CTA */}
              <div className="flex flex-col gap-4 mt-4">
                <Link 
                  href="/book"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="glass-button w-full py-3 text-center text-sm font-bold shadow-md bg-primary-pink/15 hover:bg-primary-pink text-accent-chocolate dark:text-bg-vanilla border-primary-pink/30"
                >
                  <Calendar className="w-4 h-4 text-primary-pink inline mr-2" />
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
