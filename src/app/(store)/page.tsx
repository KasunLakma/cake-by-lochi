'use client';

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronDown, 
  Search, 
  ShoppingBag, 
  ArrowRight,
  Sparkle,
  Sparkles,
  Star,
  Check
} from "lucide-react";
import { Sacramento } from "next/font/google";
import ProductCategories from "@/components/shared/product-categories";
import { useCart } from "@/context/cart-context";
import { formatEventDate } from "@/lib/dates";

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

// Interactive cursor trail overlay component
function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      maxSize: number;
      life: number;
      maxLife: number;
      color: string;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 1.5;
        this.vy = (Math.random() - 0.5) * 1.5 - 0.5;
        this.size = 12;
        this.maxSize = 42;
        this.life = 0;
        this.maxLife = 45;
        this.color = "250, 246, 240";
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life++;
        this.size = 12 + (this.maxSize - 12) * (this.life / this.maxLife);
      }

      draw(c: CanvasRenderingContext2D) {
        const progress = this.life / this.maxLife;
        const opacity = 1 - progress;
        
        c.save();
        const gradient = c.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size
        );
        gradient.addColorStop(0, `rgba(${this.color}, ${opacity * 0.18})`);
        gradient.addColorStop(0.5, `rgba(${this.color}, ${opacity * 0.08})`);
        gradient.addColorStop(1, `rgba(${this.color}, 0)`);
        
        c.fillStyle = gradient;
        c.beginPath();
        c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        c.fill();
        c.restore();
      }
    }

    let particles: Particle[] = [];
    
    const handleMouseMove = (e: MouseEvent) => {
      particles.push(new Particle(e.clientX, e.clientY));
      if (particles.length > 150) {
        particles.shift();
      }
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    const loop = () => {
      ctx.clearRect(0, 0, width, height);
      particles = particles.filter(p => p.life < p.maxLife);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.update();
        p.draw(ctx);
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-screen h-screen pointer-events-none z-[9999]"
    />
  );
}

export default function Home() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileCategoriesExpanded, setMobileCategoriesExpanded] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cartItems, removeFromCart, updateQuantity, cartCount, cartSubtotal } = useCart();

  const [activeCommentIndex, setActiveCommentIndex] = useState(0);

  // Event booking states
  const [activeEvent, setActiveEvent] = useState<{ title: string; date: string; type: string } | null>(null);
  const [bookingModal, setBookingModal] = useState<"BOOK" | "REQUEST" | "TICKETS" | null>(null);
  const [bookingName, setBookingName] = useState("");
  const [bookingEmail, setBookingEmail] = useState("");
  const [bookingPhone, setBookingPhone] = useState("");
  const [bookingSeats, setBookingSeats] = useState(1);
  const [bookingIntake, setBookingIntake] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [generatedTicket, setGeneratedTicket] = useState<string | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  const handleEventBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeEvent || !bookingName || !bookingEmail) return;

    setBookingLoading(true);
    setBookingError("");

    let ticketCode = undefined;
    if (bookingModal === "TICKETS") {
      ticketCode = `TKT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    }

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventTitle: activeEvent.title,
          eventType: activeEvent.type,
          eventDate: activeEvent.date,
          name: bookingName,
          email: bookingEmail,
          phone: bookingPhone,
          seats: bookingSeats,
          intakeNotes: bookingIntake,
          ticketCode,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Booking failed");

      if (bookingModal === "TICKETS") {
        setGeneratedTicket(ticketCode || "");
      } else {
        setBookingSuccess(true);
      }
    } catch (err: any) {
      setBookingError(err.message || "Failed to submit booking");
    } finally {
      setBookingLoading(false);
    }
  };

  const closeBookingModal = () => {
    setBookingModal(null);
    setActiveEvent(null);
    setBookingName("");
    setBookingEmail("");
    setBookingPhone("");
    setBookingSeats(1);
    setBookingIntake("");
    setBookingSuccess(false);
    setBookingError("");
    setGeneratedTicket(null);
  };

  const customerComments = [
    {
      name: "Genevieve Sterling",
      rating: 5,
      text: "The wedding cake was an absolute showstopper! Not only was the sculptural design breathtaking, but the champagne velvet layer was insanely delicious.",
      event: "Wedding Celebration"
    },
    {
      name: "Arthur Pendelton",
      rating: 5,
      text: "Lochi's custom studio is unparalleled. The geometric cake rig he designed for our gallery opening was a true culinary art installation.",
      event: "Art Gallery Opening"
    },
    {
      name: "Sophia Martinez",
      rating: 5,
      text: "My clients expect perfection, and cake_by_lochi delivers every single time. The macarons are crispy, chewy, and absolute perfection.",
      event: "Bespoke Corporate Event"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveCommentIndex((prev) => (prev + 1) % customerComments.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [customerComments.length]);

  // Category mapping for the Mega Dropdown Menu
  const categories: CategoryGroup[] = [
    {
      title: "Celebration Bakes",
      items: [
        { name: "Wedding Masterpieces", href: "/shop?category=celebration-cakes", desc: "Bespoke tier creations styled for your story" },
        { name: "Birthday Specials", href: "/shop?category=celebration-cakes", desc: "Whimsical designs for unforgettable milestones" },
        { name: "Anniversary Couture", href: "/shop?category=celebration-cakes", desc: "Timeless bakes symbolizing everlasting love" },
        { name: "Sculptural Custom Art", href: "/shop?category=celebration-cakes", desc: "Cake sculptures designed to amaze guests" }
      ]
    },
    {
      title: "Fine Pastries & Treats",
      items: [
        { name: "Signature Cupcakes", href: "/shop?category=cupcakes", desc: "Fluffy bakes dressed in velvety toppings" },
        { name: "French Macarons", href: "/shop?category=macarons", desc: "Delicate almond shells filled with fresh ganache" },
        { name: "Eclairs & Profiteroles", href: "/shop?category=fine-pastries", desc: "Crisp choux pastry featuring house custard" },
        { name: "Artisanal Tartlets", href: "/shop?category=fine-pastries", desc: "Crispy tart shells holding seasonal curds" }
      ]
    },
    {
      title: "Dietary Artistry",
      items: [
        { name: "Vegan Luxe Collection", href: "/shop?category=dietary-luxe", desc: "Dairy-free luxury without flavor compromises" },
        { name: "Gluten-Free Wonders", href: "/shop?category=dietary-luxe", desc: "Coeliac-friendly bakes made with fresh grains" },
        { name: "Refined Sugar-Free", href: "/shop?category=dietary-luxe", desc: "Naturally sweetened to guiltless perfection" },
        { name: "Organic Botanical", href: "/shop?category=organic-botanical", desc: "Crafted strictly with local, farm-fresh harvest" }
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

        <div className="mx-auto w-full max-w-7xl px-4 py-5 md:px-6 relative flex items-center justify-between gap-4 z-20">
          
          {/* Desktop Navigation Split Grid */}
          <div className="hidden md:grid grid-cols-3 items-center w-full relative gap-4 lg:gap-8">
            
            {/* Left Side Links */}
            <div className="flex items-center gap-8 justify-start -mt-4">
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
                                      <p className="text-xs text-zinc-800 dark:text-zinc-100 line-clamp-2 mt-0.5 font-normal">
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
                            <p className="mt-1 text-xs text-zinc-800 dark:text-zinc-100 leading-relaxed font-normal">
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
            <div className="flex items-center gap-8 justify-end -mt-4">
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
                    className="p-2 text-accent-chocolate dark:text-bg-vanilla hover:bg-primary-pink/15 rounded-full transition-colors cursor-pointer bg-white/20 dark:bg-white/5 backdrop-blur-md border border-white/20 shadow-sm"
                    aria-label="Search"
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

                {/* Cart */}
                <motion.button 
                  whileHover={{ scale: 1.08, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsCartOpen(true)}
                  className="relative p-2 text-accent-chocolate dark:text-bg-vanilla hover:bg-primary-pink/15 rounded-full transition-colors cursor-pointer bg-white/20 dark:bg-white/5 backdrop-blur-md border border-white/20 shadow-sm"
                  aria-label="Cart"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary-pink text-[9px] font-bold text-white shadow-sm">
                    {cartCount}
                  </span>
                </motion.button>
              </div>

            </div>

          </div>

          {/* Mobile Layout */}
          <div className="flex md:hidden items-center justify-between w-full gap-4">
            {/* Logo */}
            <Link href="/" className="group flex flex-col items-center flex-shrink-0">
              <span className={`${sacramento.className} text-xl font-bold text-accent-chocolate dark:text-white`}>
                Cake By Lochi
              </span>
            </Link>

            {/* Mobile Actions */}
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

        {/* Responsive Clip Path Definition */}
        <svg className="absolute w-0 h-0 pointer-events-none">
          <defs>
            <clipPath id="header-clip" clipPathUnits="objectBoundingBox">
              <path d="M 0,0 L 1,0 L 1,0.8 C 0.888,0.63 0.777,0.63 0.666,0.8 C 0.583,0.96 0.416,0.96 0.333,0.8 C 0.222,0.63 0.111,0.63 0,0.8 Z" />
            </clipPath>
            <clipPath id="hero-clip-path" clipPathUnits="objectBoundingBox">
              <path d="M 0,0.038 C 0.111,0 0.222,0 0.333,0.038 C 0.416,0.073 0.583,0.073 0.666,0.038 C 0.777,0 0.888,0 1,0.038 L 1,1 L 0,1 Z" />
            </clipPath>
          </defs>
        </svg>

      </header>

      {/* Hero Collage Section */}
      <main className="w-full pt-0 bg-[#fdfbf7] dark:bg-bg-vanilla-cream min-h-screen flex flex-col">
        
        {/* Collage & Glass Panel Section */}
        <section className="relative w-full flex-grow min-h-[60vh] flex items-center justify-center overflow-visible pt-24 pb-16">
          
          {/* Collage Grid */}
          <div 
            className="absolute inset-0 grid grid-cols-2 md:grid-cols-4 gap-0 space-x-0 z-10 min-h-[550px]"
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
              className="flex flex-col items-center gap-6 w-full text-center"
            >
              
              {/* Floating Sparkles Badge */}
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white border border-white/25 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-pink-200 fill-pink-200/30 animate-pulse" />
                Bespoke Confectionery Art
              </div>

              {/* Main Typography Title */}
              <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white leading-snug drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] text-center mx-auto">
                {"Dessert is a Beautiful Cake, Handcrafted with Love and a Touch of Sri Lankan Flavor!"
                  .split("")
                  .map((char, index) => (
                    <motion.span
                      key={index}
                      className="inline-block origin-center"
                      animate={{
                        scale: [1, 1.1, 1],
                        y: [0, -4, 0]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: index * 0.05,
                        ease: "easeInOut"
                      }}
                    >
                      {char === " " ? "\u00A0" : char}
                    </motion.span>
                  ))}
              </h1>

              {/* Description */}
              <p className="text-xs sm:text-sm text-white/90 max-w-md leading-relaxed font-normal drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]">
                We co-create architectural cake structures and delicate pastries with organic ingredients, celebrating life's sweet milestones with true artistic excellence.
              </p>

              {/* Explore Catalog Glass Action Button */}
              <div className="relative group overflow-hidden rounded-full mt-2">
                <Link 
                  href="/shop" 
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



        </section>

        {/* Product Categories Grid */}
        <ProductCategories />

        {/* About Us Section */}
        <section className="relative w-full py-24 px-6 md:px-12 bg-[#FAF6EE] dark:bg-bg-vanilla-cream/50 transition-colors duration-500 overflow-hidden">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Left Side: Rich Text Profile */}
            <div className="lg:col-span-6 flex flex-col gap-6 text-left">
              <span className={`${sacramento.className} text-4xl text-primary-pink-deep dark:text-primary-pink`}>
                About Us
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-accent-chocolate dark:text-white uppercase leading-tight">
                Crafting Confectionery Sculptures
              </h2>
              <span className="w-16 h-0.5 bg-primary-pink" />
              <p className="text-sm md:text-base text-accent-chocolate-light dark:text-bg-vanilla/80 leading-relaxed font-normal">
                Born out of a passion for avant-garde baking, Cake By Lochi combines classical Parisian pastry techniques with modern architectural design principles. We believe that a cake should not only taste sublime but stand as a visual centerpiece—a bespoke sculpture that commands the room.
              </p>
              <p className="text-sm md:text-base text-accent-chocolate-light dark:text-bg-vanilla/80 leading-relaxed font-normal">
                Every creation is individually designed, utilizing locally sourced organic farm-fresh ingredients and biological botanical extracts. From hand-painted gold leaf tiers to delicate sugar floral installations, our work is sugar art redefined.
              </p>
              <div className="mt-4">
                <Link href="/about" className="glass-button inline-flex items-center gap-2 px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-accent-chocolate border-accent-chocolate/20 bg-white/40 dark:text-white dark:border-white/20 dark:bg-white/5 hover:bg-primary-pink hover:text-white transition-all duration-300">
                  Read Our Story
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            
            {/* Right Side: Stylized Multi-Photo Collage */}
            <div className="lg:col-span-6 grid grid-cols-12 gap-4 relative">
              <div className="col-span-8 overflow-hidden rounded-[2rem] shadow-xl aspect-[3/4] relative group">
                <Image 
                  src="https://images.unsplash.com/photo-1535254973040-607b474cb50d?q=80&w=600&auto=format&fit=crop" 
                  alt="Wedding Cake Tier Detail" 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="col-span-4 flex flex-col gap-4">
                <div className="overflow-hidden rounded-[2rem] shadow-md aspect-square relative group">
                  <Image 
                    src="/cake_cat_dietary.png" 
                    alt="Pastry Detail" 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="overflow-hidden rounded-[2rem] shadow-md aspect-[3/4] relative group mt-2">
                  <Image 
                    src="/cake_cat_celebration.png" 
                    alt="Floral Detail" 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Customer Comments (Testimonials Slider) */}
        <section className="relative w-full py-24 px-6 md:px-12 bg-white dark:bg-bg-vanilla-cream transition-colors duration-500 flex flex-col items-center">
          <div className="text-center flex flex-col items-center gap-2 mb-12">
            <span className={`${sacramento.className} text-4xl text-primary-pink-deep dark:text-primary-pink`}>
              Customer Comments
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-accent-chocolate dark:text-white uppercase mt-1">
              Loved by Connoisseurs
            </h2>
            <span className="w-12 h-0.5 bg-primary-pink/40 mt-3" />
          </div>

          <div className="max-w-3xl w-full relative overflow-hidden h-72 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {customerComments.map((comment, index) => {
                if (index !== activeCommentIndex) return null;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="absolute w-full p-8 md:p-12 rounded-[2rem] bg-gradient-to-br from-primary-pink/15 to-primary-pink-soft/5 dark:from-white/5 dark:to-white/10 border border-primary-pink/15 flex flex-col gap-6 shadow-lg text-center"
                  >
                    <div className="flex justify-center gap-1">
                      {[...Array(comment.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-gold-accent fill-gold-accent" />
                      ))}
                    </div>
                    <p className="text-sm sm:text-base md:text-lg text-accent-chocolate dark:text-white leading-relaxed font-normal italic">
                      "{comment.text}"
                    </p>
                    <div className="flex flex-col items-center gap-0.5">
                      <span className="text-xs font-bold text-accent-chocolate dark:text-white">
                        {comment.name}
                      </span>
                      <span className="text-[10px] text-accent-chocolate-light dark:text-bg-vanilla/60 uppercase tracking-wider font-semibold">
                        {comment.event}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Dot Pagination indicators */}
          <div className="flex gap-2.5 mt-8">
            {customerComments.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveCommentIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  index === activeCommentIndex
                    ? "bg-primary-pink scale-125 shadow-sm"
                    : "bg-primary-pink/30 hover:bg-primary-pink/50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </section>

        {/* Social Media 'Our Cake Stories' Video Box */}
        <section className="relative w-full py-24 px-6 md:px-12 bg-[#FAF6EE] dark:bg-bg-vanilla-cream/30 transition-colors duration-500 overflow-hidden flex flex-col items-center">
          <div className="text-center flex flex-col items-center gap-2 mb-12">
            <span className={`${sacramento.className} text-4xl text-primary-pink-deep dark:text-primary-pink`}>
              Our Cake Stories
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-accent-chocolate dark:text-white uppercase mt-1">
              Sugar Art In Motion
            </h2>
            <span className="w-12 h-0.5 bg-primary-pink/40 mt-3" />
          </div>

          <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-12 gap-12 items-center bg-white/40 dark:bg-white/5 border border-white/30 dark:border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-xl backdrop-blur-sm">
            {/* Left: Text & Social Handles */}
            <div className="md:col-span-6 flex flex-col gap-6 text-left">
              <h3 className="font-serif text-2xl md:text-3xl font-bold text-accent-chocolate dark:text-white leading-snug">
                Follow Chef Lochi’s Creative Process
              </h3>
              <p className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-100 leading-relaxed font-normal">
                Go behind the scenes of our luxury confections. Watch the mesmerizing details, the paint sweeps, the edible pearls, and the final structural setup. We post daily stories sharing our love for luxury cake sculptures.
              </p>
              
              <div className="flex flex-col gap-4 mt-2">
                {/* Instagram Handle */}
                <Link href="https://instagram.com" className="flex items-center gap-4 group/social bg-white/60 dark:bg-white/5 border border-white/50 p-4 rounded-2xl hover:bg-primary-pink/10 hover:border-primary-pink/30 transition-all duration-300">
                  <div className="p-3 bg-rose-100 dark:bg-rose-950/30 rounded-xl text-rose-500">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-accent-chocolate dark:text-white group-hover/social:text-primary-pink transition-colors">
                      @cakebylochi
                    </span>
                    <span className="text-[10px] text-accent-chocolate-light/80 dark:text-bg-vanilla/60 font-medium">
                      Instagram Stories & Reels
                    </span>
                  </div>
                </Link>

                {/* TikTok Handle */}
                <Link href="https://tiktok.com" className="flex items-center gap-4 group/social bg-white/60 dark:bg-white/5 border border-white/50 p-4 rounded-2xl hover:bg-primary-pink/10 hover:border-primary-pink/30 transition-all duration-300">
                  <div className="p-3 bg-cyan-50 dark:bg-cyan-950/30 rounded-xl text-cyan-500">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-accent-chocolate dark:text-white group-hover/social:text-primary-pink transition-colors">
                      @chef_lochi
                    </span>
                    <span className="text-[10px] text-accent-chocolate-light/80 dark:text-bg-vanilla/60 font-medium">
                      TikTok Decorating Clips
                    </span>
                  </div>
                </Link>
              </div>
            </div>

            {/* Right: Vertical Mobile-Aspect Video Box */}
            <div className="md:col-span-6 flex justify-center">
              <div className="relative w-[260px] sm:w-[280px] aspect-[9/16] rounded-[2rem] overflow-hidden shadow-2xl border border-white/30 bg-black/10 group/video">
                {/* Placeholder Image mimicking video preview */}
                <Image
                  src="/cake_hero_main.png"
                  alt="Story Video Preview"
                  fill
                  className="object-cover transition-transform duration-700 group-hover/video:scale-105"
                />
                
                {/* Glow Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/60 z-10" />

                {/* Center Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <button className="w-12 h-12 rounded-full bg-white/35 backdrop-blur-md border border-white/40 flex items-center justify-center text-white cursor-pointer shadow-lg hover:bg-white/50 hover:scale-110 transition-all duration-300">
                    <svg className="w-5 h-5 fill-white text-white translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </button>
                </div>

                <div className="absolute bottom-4 left-4 right-12 z-20 text-left">
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    LIVE PROCESS
                  </span>
                  <p className="text-[9px] text-white/90 font-medium leading-relaxed mt-1">
                    Bespoke sketching to cake structure completion. Watch the masterclass!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Team & Price List Section */}
        <section className="relative w-full py-24 px-6 md:px-12 bg-white dark:bg-bg-vanilla-cream transition-colors duration-500 flex flex-col items-center">
          <div className="text-center flex flex-col items-center gap-2 mb-12">
            <span className={`${sacramento.className} text-4xl text-primary-pink-deep dark:text-primary-pink`}>
              Our Team & Custom Offerings
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-accent-chocolate dark:text-white uppercase mt-1">
              Pricing & Tiers
            </h2>
            <span className="w-12 h-0.5 bg-primary-pink/40 mt-3" />
          </div>

          <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Column 1: Signature Cakes Menu */}
            <div className="flex flex-col gap-6 text-left">
              <h3 className="font-serif text-xl font-bold text-accent-chocolate dark:text-white border-b border-accent-chocolate/10 dark:border-white/10 pb-3 flex items-center justify-between">
                <span>Signature Cakes</span>
                <span className="text-xs uppercase tracking-wider text-primary-pink-deep dark:text-primary-pink font-semibold">Base Price</span>
              </h3>
              
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-baseline font-bold text-sm sm:text-base text-accent-chocolate dark:text-white">
                    <span>The Rose Gold Truffle</span>
                    <span className="w-full mx-3 border-b border-dotted border-accent-chocolate/20 dark:border-white/20" />
                    <span className="whitespace-nowrap">Rs. 72,000</span>
                  </div>
                  <p className="text-xs text-zinc-800 dark:text-zinc-100 font-normal">
                    Organic rosewater sponge with wild berry compote and white chocolate truffle.
                  </p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-baseline font-bold text-sm sm:text-base text-accent-chocolate dark:text-white">
                    <span>Blossom Vanilla Masterpiece</span>
                    <span className="w-full mx-3 border-b border-dotted border-accent-chocolate/20 dark:border-white/20" />
                    <span className="whitespace-nowrap">Rs. 54,000</span>
                  </div>
                  <p className="text-xs text-zinc-800 dark:text-zinc-100 font-normal">
                    Watercolor flower printings, organic vanilla bean mousse, and fresh buttercream.
                  </p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-baseline font-bold text-sm sm:text-base text-accent-chocolate dark:text-white">
                    <span>Botanical Forest Creation</span>
                    <span className="w-full mx-3 border-b border-dotted border-accent-chocolate/20 dark:border-white/20" />
                    <span className="whitespace-nowrap">Rs. 49,500</span>
                  </div>
                  <p className="text-xs text-zinc-800 dark:text-zinc-100 font-normal">
                    Vegan chocolate layers with raspberry puree and biological elderberry frosting.
                  </p>
                </div>
              </div>
            </div>

            {/* Column 2: Custom Tiers & Consultations */}
            <div className="flex flex-col gap-6 text-left">
              <h3 className="font-serif text-xl font-bold text-accent-chocolate dark:text-white border-b border-accent-chocolate/10 dark:border-white/10 pb-3 flex items-center justify-between">
                <span>Bespoke Consulting</span>
                <span className="text-xs uppercase tracking-wider text-primary-pink-deep dark:text-primary-pink font-semibold">Details</span>
              </h3>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-baseline font-bold text-sm sm:text-base text-accent-chocolate dark:text-white">
                    <span>Bespoke Sculptural Design</span>
                    <span className="w-full mx-3 border-b border-dotted border-accent-chocolate/20 dark:border-white/20" />
                    <span className="whitespace-nowrap">From Rs. 105,000</span>
                  </div>
                  <p className="text-xs text-zinc-800 dark:text-zinc-100 font-normal">
                    1-on-1 design session, private tasting flight, and custom structural rig.
                  </p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-baseline font-bold text-sm sm:text-base text-accent-chocolate dark:text-white">
                    <span>Private Tasting Flight</span>
                    <span className="w-full mx-3 border-b border-dotted border-accent-chocolate/20 dark:border-white/20" />
                    <span className="whitespace-nowrap">Rs. 19,500</span>
                  </div>
                  <p className="text-xs text-zinc-800 dark:text-zinc-100 font-normal">
                    Curated tasting profile of 5 signature flavors for your wedding or milestone event.
                  </p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-baseline font-bold text-sm sm:text-base text-accent-chocolate dark:text-white">
                    <span>Floral & Sugar Rig Setup</span>
                    <span className="w-full mx-3 border-b border-dotted border-accent-chocolate/20 dark:border-white/20" />
                    <span className="whitespace-nowrap">Rs. 36,000</span>
                  </div>
                  <p className="text-xs text-zinc-800 dark:text-zinc-100 font-normal">
                    On-site installation, stabilization, and decoration of your bespoke cake sculpture.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Events Block */}
        <section className="relative w-full py-24 px-6 md:px-12 bg-[#FAF6EE] dark:bg-bg-vanilla-cream/50 transition-colors duration-500 flex flex-col items-center">
          <div className="text-center flex flex-col items-center gap-2 mb-12">
            <span className={`${sacramento.className} text-4xl text-primary-pink-deep dark:text-primary-pink`}>
              Events
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-accent-chocolate dark:text-white uppercase mt-1">
              Masterclasses & Tastings
            </h2>
            <span className="w-12 h-0.5 bg-primary-pink/40 mt-3" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 max-w-7xl w-full mx-auto">
            {/* Event 1 */}
            <div className="flex flex-col gap-4 bg-white dark:bg-white/5 border border-white/30 dark:border-white/10 rounded-[2rem] p-6 shadow-md hover:shadow-xl transition-shadow duration-300">
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary-pink-deep dark:text-primary-pink">
                Masterclass
              </span>
              <h3 className="font-serif text-lg font-bold text-accent-chocolate dark:text-white">
                Parisian Macaron Workshop
              </h3>
              <p className="text-xs text-zinc-800 dark:text-zinc-100 leading-relaxed font-normal">
                Learn the delicate art of piping and baking classical French macarons with biological ganache fillings.
              </p>
              <div className="border-t border-accent-chocolate/5 dark:border-white/5 pt-4 mt-2 flex justify-between items-center text-xs font-semibold text-accent-chocolate dark:text-white">
                <span>{formatEventDate("July 15, 2026")}</span>
                <button 
                  onClick={() => {
                    setActiveEvent({ title: "Parisian Macaron Workshop", date: formatEventDate("July 15, 2026"), type: "WORKSHOP" });
                    setBookingModal("BOOK");
                  }}
                  className="text-primary-pink hover:text-primary-pink-deep flex items-center gap-1 cursor-pointer bg-transparent border-none font-semibold text-xs"
                >
                  Book Slot <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Event 2 */}
            <div className="flex flex-col gap-4 bg-white dark:bg-white/5 border border-white/30 dark:border-white/10 rounded-[2rem] p-6 shadow-md hover:shadow-xl transition-shadow duration-300">
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary-pink-deep dark:text-primary-pink">
                Private Tasting
              </span>
              <h3 className="font-serif text-lg font-bold text-accent-chocolate dark:text-white">
                Autumn Tasting Expo
              </h3>
              <p className="text-xs text-zinc-800 dark:text-zinc-100 leading-relaxed font-normal">
                A private session for engaged couples to taste our signature cakes and sketch design rigs.
              </p>
              <div className="border-t border-accent-chocolate/5 dark:border-white/5 pt-4 mt-2 flex justify-between items-center text-xs font-semibold text-accent-chocolate dark:text-white">
                <span>{formatEventDate("August 08, 2026")}</span>
                <button 
                  onClick={() => {
                    setActiveEvent({ title: "Autumn Tasting Expo", date: formatEventDate("August 08, 2026"), type: "INVITATION" });
                    setBookingModal("REQUEST");
                  }}
                  className="text-primary-pink hover:text-primary-pink-deep flex items-center gap-1 cursor-pointer bg-transparent border-none font-semibold text-xs"
                >
                  Request Invite <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Event 3 */}
            <div className="flex flex-col gap-4 bg-white dark:bg-white/5 border border-white/30 dark:border-white/10 rounded-[2rem] p-6 shadow-md hover:shadow-xl transition-shadow duration-300">
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary-pink-deep dark:text-primary-pink">
                Exhibition
              </span>
              <h3 className="font-serif text-lg font-bold text-accent-chocolate dark:text-white">
                Sugar Sculpture Show
              </h3>
              <p className="text-xs text-zinc-800 dark:text-zinc-100 leading-relaxed font-normal">
                Join us for an exclusive gallery showing of Chef Lochi's latest custom geometric cake installations.
              </p>
              <div className="border-t border-accent-chocolate/5 dark:border-white/5 pt-4 mt-2 flex justify-between items-center text-xs font-semibold text-accent-chocolate dark:text-white">
                <span>{formatEventDate("Sept 20, 2026")}</span>
                <button 
                  onClick={() => {
                    setActiveEvent({ title: "Sugar Sculpture Show", date: formatEventDate("Sept 20, 2026"), type: "TICKET" });
                    setBookingModal("TICKETS");
                  }}
                  className="text-primary-pink hover:text-primary-pink-deep flex items-center gap-1 cursor-pointer bg-transparent border-none font-semibold text-xs"
                >
                  Get Tickets <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Section */}
        <footer className="relative z-30 w-full bg-white dark:bg-bg-vanilla-cream py-12 border-t border-accent-chocolate/5 flex flex-col items-center gap-6">
          <div className="max-w-4xl w-full px-6 flex flex-col sm:flex-row items-center justify-between gap-6 text-[10px] font-bold tracking-[0.2em] text-accent-chocolate-light dark:text-zinc-100 uppercase">
            {/* Phone */}
            <div className="flex items-center gap-2.5">
              <svg className="w-4 h-4 text-primary-pink stroke-[2]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>070 441 5115</span>
            </div>
            
            <span className="hidden sm:block h-4 w-px bg-accent-chocolate/10 dark:bg-white/10" />

            {/* Facebook */}
            <Link href="https://facebook.com" className="flex items-center gap-2.5 hover:text-primary-pink dark:hover:text-pink-400 transition-colors">
              <svg className="w-4 h-4 text-primary-pink stroke-[2]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
              <span>Cake By Lochi</span>
            </Link>

            <span className="hidden sm:block h-4 w-px bg-accent-chocolate/10 dark:bg-white/10" />

            {/* Instagram */}
            <Link href="https://instagram.com" className="flex items-center gap-2.5 hover:text-primary-pink dark:hover:text-pink-400 transition-colors">
              <svg className="w-4 h-4 text-primary-pink stroke-[2]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
              <span>@cakebylochi</span>
            </Link>
          </div>
          
          <div className="flex gap-6 text-[9px] font-bold tracking-widest text-accent-chocolate-light/75 dark:text-zinc-100/60 uppercase">
            <Link href="/faq" className="hover:text-primary-pink dark:hover:text-pink-400 transition-colors">FAQ</Link>
            <Link href="/policies" className="hover:text-primary-pink dark:hover:text-pink-400 transition-colors">Policies</Link>
            <Link href="/terms" className="hover:text-primary-pink dark:hover:text-pink-400 transition-colors">Terms of Service</Link>
          </div>

          <div className="text-[9px] text-accent-chocolate-light/60 dark:text-zinc-100/50 tracking-wider">
            &copy; {new Date().getFullYear()} Cake By Lochi. All Rights Reserved. Crafted with Parisienne Elegance.
          </div>
        </footer>

      </main>


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

      {/* Event Booking Modals */}
      <AnimatePresence>
        {bookingModal && activeEvent && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeBookingModal}
              className="fixed inset-0 z-[99990] bg-black/60 backdrop-blur-sm cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="fixed inset-0 m-auto h-fit w-full max-w-md z-[99999] rounded-[2rem] glass-card border border-white/40 dark:border-white/10 p-6 sm:p-8 bg-bg-vanilla/95 dark:bg-bg-vanilla-cream/95 shadow-2xl overflow-y-auto max-h-[90vh] text-left"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary-pink-deep dark:text-primary-pink">
                    {activeEvent.type === "WORKSHOP" ? "Event Booking" : activeEvent.type === "INVITATION" ? "Invitation Request" : "Entry Pass"}
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-accent-chocolate dark:text-white uppercase leading-tight mt-1">
                    {activeEvent.title}
                  </h3>
                  <span className="text-xs text-accent-chocolate-light dark:text-bg-vanilla/60 mt-1 block font-normal">
                    Scheduled for {activeEvent.date}
                  </span>
                </div>
                <button
                  onClick={closeBookingModal}
                  className="text-accent-chocolate/40 hover:text-primary-pink cursor-pointer p-1"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {bookingSuccess ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-12 h-12 bg-green-500/10 border border-green-500/20 text-green-600 rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif text-lg font-bold text-accent-chocolate dark:text-white uppercase">
                    Submission Received!
                  </h4>
                  <p className="text-xs text-accent-chocolate-light dark:text-bg-vanilla/80 leading-relaxed max-w-sm mx-auto font-normal">
                    {activeEvent.type === "WORKSHOP" 
                      ? "Your seat is reserved. We've sent details to your inbox." 
                      : "We have received your intake requirements and will extend invitations shortly."}
                  </p>
                  <div className="pt-4 flex gap-3 justify-center">
                    <Link
                      href="/dashboard"
                      className="glass-button text-[10px] font-bold uppercase tracking-widest py-2.5 px-4 bg-primary-pink border-primary-pink text-white hover:bg-primary-pink-deep text-center"
                    >
                      Go to Dashboard
                    </Link>
                    <button
                      onClick={closeBookingModal}
                      className="glass-button text-[10px] font-bold uppercase tracking-widest py-2.5 px-4 cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : generatedTicket ? (
                <div className="space-y-6">
                  <div className="relative border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-amber-500/0 rounded-2xl p-6 text-center shadow-inner overflow-hidden before:content-[''] before:absolute before:-left-3 before:top-1/2 before:-translate-y-1/2 before:w-6 before:h-6 before:rounded-full before:bg-[#fdfbf7] dark:before:bg-bg-vanilla-cream before:border-r before:border-amber-500/20 after:content-[''] after:absolute after:-right-3 after:top-1/2 after:-translate-y-1/2 after:w-6 after:h-6 after:rounded-full after:bg-[#fdfbf7] dark:after:bg-bg-vanilla-cream after:border-l after:border-amber-500/20">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 block mb-2">Official Entry Pass</span>
                    <h4 className="font-serif text-lg font-bold text-accent-chocolate dark:text-white uppercase leading-snug">{activeEvent.title}</h4>
                    <span className="text-[10px] text-accent-chocolate-light/80 dark:text-bg-vanilla/60 mt-1 block font-normal">{formatEventDate(activeEvent.date)}</span>
                    
                    <div className="w-full border-t border-dashed border-amber-500/20 my-4" />
                    
                    <div className="space-y-1">
                      <span className="text-[8px] font-bold uppercase tracking-wider text-accent-chocolate-light/50 dark:text-bg-vanilla/40">Ticket Code</span>
                      <span className="text-sm font-mono font-bold text-accent-chocolate dark:text-white block">{generatedTicket}</span>
                    </div>

                    <div className="mt-4 flex items-center justify-center">
                      <div className="h-8 w-48 bg-[repeating-linear-gradient(90deg,currentColor,currentColor_2px,transparent_2px,transparent_6px)] opacity-50" />
                    </div>
                  </div>
                  
                  <p className="text-[11px] text-accent-chocolate-light/80 dark:text-bg-vanilla/60 text-center leading-relaxed font-normal">
                    This ticket pass has been registered to your email. You can present this code at Lochi's Custom Studio on arrival or view it in your dashboard.
                  </p>
                  
                  <div className="flex gap-3 justify-center">
                    <Link
                      href="/dashboard"
                      className="glass-button text-[10px] font-bold uppercase tracking-widest py-2.5 px-4 bg-primary-pink border-primary-pink text-white hover:bg-primary-pink-deep text-center"
                    >
                      View Dashboard
                    </Link>
                    <button
                      onClick={closeBookingModal}
                      className="glass-button text-[10px] font-bold uppercase tracking-widest py-2.5 px-4 cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleEventBookingSubmit} className="space-y-4">
                  {bookingError && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-400 text-xs font-semibold text-center">
                      {bookingError}
                    </div>
                  )}

                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-accent-chocolate-light dark:text-bg-vanilla/60 mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={bookingName}
                      onChange={(e) => setBookingName(e.target.value)}
                      placeholder="Genevieve Sterling"
                      className="w-full bg-white/40 dark:bg-white/5 border border-accent-chocolate/10 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-accent-chocolate dark:text-white focus:outline-none focus:border-primary-pink transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-accent-chocolate-light dark:text-bg-vanilla/60 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={bookingEmail}
                      onChange={(e) => setBookingEmail(e.target.value)}
                      placeholder="name@domain.com"
                      className="w-full bg-white/40 dark:bg-white/5 border border-accent-chocolate/10 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-accent-chocolate dark:text-white focus:outline-none focus:border-primary-pink transition-colors font-sans"
                    />
                  </div>

                  {bookingModal !== "TICKETS" && (
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-accent-chocolate-light dark:text-bg-vanilla/60 mb-1.5">
                        Phone Number (Optional)
                      </label>
                      <input
                        type="tel"
                        value={bookingPhone}
                        onChange={(e) => setBookingPhone(e.target.value)}
                        placeholder="+94 77 123 4567"
                        className="w-full bg-white/40 dark:bg-white/5 border border-accent-chocolate/10 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-accent-chocolate dark:text-white focus:outline-none focus:border-primary-pink transition-colors font-sans"
                      />
                    </div>
                  )}

                  {bookingModal === "BOOK" && (
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-accent-chocolate-light dark:text-bg-vanilla/60 mb-1.5">
                        Seat Quantity
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={10}
                        required
                        value={bookingSeats}
                        onChange={(e) => setBookingSeats(parseInt(e.target.value) || 1)}
                        className="w-full bg-white/40 dark:bg-white/5 border border-accent-chocolate/10 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-accent-chocolate dark:text-white focus:outline-none focus:border-primary-pink transition-colors font-sans"
                      />
                    </div>
                  )}

                  {bookingModal === "REQUEST" && (
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-accent-chocolate-light dark:text-bg-vanilla/60 mb-1.5">
                        Intake / Custom Requirements
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={bookingIntake}
                        onChange={(e) => setBookingIntake(e.target.value)}
                        placeholder="Provide details about your target event design theme, milestone bakes expectations, or dietary requests."
                        className="w-full bg-white/40 dark:bg-white/5 border border-accent-chocolate/10 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-accent-chocolate dark:text-white focus:outline-none focus:border-primary-pink transition-colors resize-none leading-relaxed"
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className="glass-button w-full py-3.5 px-6 font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 bg-primary-pink border-primary-pink text-white hover:bg-primary-pink-deep transition-all duration-300 shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {bookingLoading ? "Submitting..." : bookingModal === "BOOK" ? "Confirm Booking" : bookingModal === "REQUEST" ? "Submit Invitation Request" : "Generate Entry Pass"}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Interactive cursor trail canvas overlay */}
      <CursorTrail />

    </div>
  );
}
