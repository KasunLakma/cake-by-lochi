'use client';

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Sparkles, 
  MapPin, 
  Phone, 
  Mail, 
  ChevronRight, 
  Check, 
  AlertCircle 
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

// Calendar Slots type definitions
interface DaySlot {
  day: number;
  status: "available" | "limited" | "booked";
  slots: string[];
}

export default function Home() {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [emailInput, setEmailInput] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Calendar setup for July 2026 (Wednesday starts the month)
  const daysInMonth = 31;
  const startOffset = 3; // Wednesday offset (Sun, Mon, Tue are empty)
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Mock Calendar slot configurations
  const calendarSlots: Record<number, DaySlot> = {
    1: { day: 1, status: "available", slots: ["10:00 AM", "01:00 PM", "04:30 PM"] },
    2: { day: 2, status: "booked", slots: [] },
    3: { day: 3, status: "limited", slots: ["11:30 AM", "03:00 PM"] },
    4: { day: 4, status: "booked", slots: [] }, // Weekend
    5: { day: 5, status: "booked", slots: [] }, // Weekend
    6: { day: 6, status: "available", slots: ["09:00 AM", "12:30 PM", "04:00 PM"] },
    7: { day: 7, status: "available", slots: ["10:30 AM", "02:00 PM", "05:00 PM"] },
    8: { day: 8, status: "limited", slots: ["01:30 PM"] },
    9: { day: 9, status: "available", slots: ["10:00 AM", "01:00 PM", "04:00 PM"] },
    10: { day: 10, status: "limited", slots: ["03:30 PM"] },
    11: { day: 11, status: "booked", slots: [] },
    12: { day: 12, status: "booked", slots: [] },
    13: { day: 13, status: "available", slots: ["09:30 AM", "01:00 PM", "04:30 PM"] },
    14: { day: 14, status: "available", slots: ["11:00 AM", "03:00 PM", "06:00 PM"] },
    15: { day: 15, status: "booked", slots: [] },
    16: { day: 16, status: "limited", slots: ["02:00 PM", "04:30 PM"] },
    17: { day: 17, status: "available", slots: ["10:00 AM", "01:00 PM", "05:00 PM"] },
    18: { day: 18, status: "booked", slots: [] },
    19: { day: 19, status: "booked", slots: [] },
    20: { day: 20, status: "available", slots: ["09:00 AM", "12:00 PM", "03:30 PM"] },
    21: { day: 21, status: "available", slots: ["10:30 AM", "02:00 PM", "04:30 PM"] },
    22: { day: 22, status: "limited", slots: ["01:00 PM"] },
    23: { day: 23, status: "booked", slots: [] },
    24: { day: 24, status: "available", slots: ["11:30 AM", "02:30 PM", "05:30 PM"] },
    25: { day: 25, status: "booked", slots: [] },
    26: { day: 26, status: "booked", slots: [] },
    27: { day: 27, status: "available", slots: ["10:00 AM", "01:00 PM", "04:00 PM"] },
    28: { day: 28, status: "limited", slots: ["03:00 PM"] },
    29: { day: 29, status: "available", slots: ["09:30 AM", "12:30 PM", "04:30 PM"] },
    30: { day: 30, status: "available", slots: ["11:00 AM", "02:00 PM", "05:00 PM"] },
    31: { day: 31, status: "limited", slots: ["02:30 PM"] }
  };

  const handleDayClick = (day: number) => {
    const slot = calendarSlots[day];
    if (slot && slot.status !== "booked") {
      setSelectedDay(day);
      setSelectedTime(null);
    }
  };

  const handleSubscribeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim() !== "") {
      setIsSubscribed(true);
      setEmailInput("");
      setTimeout(() => setIsSubscribed(false), 5000);
    }
  };

  // Generate blank spots before Wednesday starts the month
  const emptySpots = Array(startOffset).fill(null);
  const calendarDays = Array.from({ length: daysInMonth }, (_, idx) => idx + 1);

  return (
    <div className="flex flex-col min-h-screen bg-bg-vanilla dark:bg-bg-vanilla-cream text-accent-chocolate dark:text-bg-vanilla transition-colors duration-500 overflow-x-hidden font-sans pt-20">
      
      {/* 1. Mega Navigation Header */}
      <MegaHeader />

      <main className="flex-1 w-full">
        
        {/* 2. Immersive Hero Section */}
        <HeroSection />

        {/* 3. Bento Grid Product Catalog */}
        <ProductCatalog />

        {/* 4. Testimonials Showcase */}
        <Testimonials />

        {/* 5. Live Slot Booking Calendar Widget */}
        <section className="relative w-full py-24 px-4 md:px-8 lg:px-12 bg-bg-vanilla dark:bg-bg-vanilla-cream/50 transition-colors duration-500 border-t border-accent-chocolate/5 dark:border-white/5">
          <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
            <div className="absolute top-[30%] right-[-10%] w-[35vw] h-[35vw] rounded-full bg-radial from-gold-accent-soft/10 to-transparent blur-3xl opacity-50" />
            <div className="absolute bottom-[10%] left-[-10%] w-[35vw] h-[35vw] rounded-full bg-radial from-primary-pink/10 to-transparent blur-3xl opacity-45" />
          </div>

          <div className="relative w-full max-w-6xl mx-auto z-10">
            
            {/* Title block */}
            <div className="text-center max-w-xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-primary-pink-deep dark:text-primary-pink">
                Secure Your Event Date
              </span>
              <h2 className="font-serif text-3xl md:text-5xl font-bold text-accent-chocolate dark:text-white mt-3 leading-tight">
                Live Consultation Booking
              </h2>
              <p className="text-sm text-accent-chocolate-light dark:text-bg-vanilla-cream/70 mt-4 leading-relaxed font-normal">
                Check our live calendar availability for luxury wedding cake tastings and custom sculpting session consultations.
              </p>
            </div>

            {/* Calendar & Details Bento Grid Card */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* Left Calendar Grid Card */}
              <div className="col-span-1 lg:col-span-7 rounded-[32px] glass-card border border-white/40 p-6 sm:p-8 bg-bg-vanilla/30 dark:bg-bg-vanilla-cream/20 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-serif text-xl font-bold text-accent-chocolate dark:text-white">
                      July 2026
                    </h3>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-accent-chocolate-light dark:text-primary-pink-soft bg-white/50 dark:bg-white/5 px-3 py-1 rounded-full border border-white/60">
                      Standard BST Times
                    </span>
                  </div>

                  {/* Day labels */}
                  <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold uppercase text-accent-chocolate-light/80 dark:text-primary-pink-soft/80 tracking-widest mb-4">
                    {weekdays.map(d => <div key={d} className="py-1">{d}</div>)}
                  </div>

                  {/* Calendar Day Grid */}
                  <div className="grid grid-cols-7 gap-2">
                    {emptySpots.map((_, idx) => (
                      <div key={`empty-${idx}`} className="aspect-square" />
                    ))}
                    {calendarDays.map((day) => {
                      const slot = calendarSlots[day];
                      const isSelected = selectedDay === day;
                      
                      let bgClass = "bg-white/40 hover:bg-white/80 dark:bg-white/5 dark:hover:bg-white/10 text-accent-chocolate dark:text-bg-vanilla border-white/30";
                      let dotClass = "";

                      if (slot) {
                        if (slot.status === "booked") {
                          bgClass = "bg-accent-chocolate/5 text-accent-chocolate-light/30 cursor-not-allowed border-transparent line-through";
                        } else if (slot.status === "limited") {
                          dotClass = "bg-orange-400";
                          if (isSelected) bgClass = "bg-orange-400/20 border-orange-400/60 text-orange-600 dark:text-orange-300";
                        } else if (slot.status === "available") {
                          dotClass = "bg-primary-pink";
                          if (isSelected) bgClass = "bg-primary-pink/20 border-primary-pink/60 text-primary-pink-deep dark:text-primary-pink";
                        }
                      }

                      return (
                        <button
                          key={day}
                          onClick={() => handleDayClick(day)}
                          disabled={!slot || slot.status === "booked"}
                          className={`relative aspect-square rounded-2xl flex items-center justify-center text-xs font-bold border transition-all duration-300 cursor-pointer ${bgClass}`}
                        >
                          {day}
                          {dotClass !== "" && !isSelected && (
                            <span className={`absolute bottom-1.5 w-1.5 h-1.5 rounded-full ${dotClass}`} />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Status legend indicators */}
                <div className="flex gap-4 border-t border-accent-chocolate/5 dark:border-white/5 pt-6 mt-8 justify-center text-[10px] font-bold uppercase tracking-wider text-accent-chocolate-light dark:text-bg-vanilla-cream/70">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-primary-pink" />
                    Slots Available
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-orange-400" />
                    Limited Slots
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-accent-chocolate/10 dark:bg-white/10" />
                    Fully Booked
                  </div>
                </div>
              </div>

              {/* Right Detail Slots Preview Card */}
              <div className="col-span-1 lg:col-span-5 rounded-[32px] glass-card border border-white/40 p-6 sm:p-8 bg-bg-vanilla/30 dark:bg-bg-vanilla-cream/20 shadow-xl flex flex-col justify-between">
                <AnimatePresence mode="wait">
                  {selectedDay !== null ? (
                    <motion.div
                      key="details-active"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      className="flex-1 flex flex-col justify-between gap-6"
                    >
                      <div>
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-primary-pink/15 dark:bg-primary-pink/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-pink-deep dark:text-primary-pink">
                          <Clock className="w-3.5 h-3.5" />
                          Select Time Slot
                        </div>
                        <h3 className="font-serif text-2xl font-bold text-accent-chocolate dark:text-white mt-4 leading-tight">
                          Availability for July {selectedDay}, 2026
                        </h3>
                        <p className="text-xs text-accent-chocolate-light dark:text-bg-vanilla-cream/70 mt-2 font-normal">
                          Choose an open time slot below to secure your consultation appointment.
                        </p>

                        {/* List of open times */}
                        <div className="flex flex-col gap-3 mt-8">
                          {calendarSlots[selectedDay]?.slots.map((time) => {
                            const isTimeSelected = selectedTime === time;
                            return (
                              <button
                                key={time}
                                onClick={() => setSelectedTime(time)}
                                className={`w-full py-3.5 px-4 rounded-xl border flex items-center justify-between transition-all duration-300 cursor-pointer ${
                                  isTimeSelected
                                    ? "bg-primary-pink/20 border-primary-pink text-primary-pink-deep dark:text-primary-pink font-semibold shadow-sm"
                                    : "bg-white/30 border-white/50 hover:bg-white/60 dark:bg-white/5 dark:border-white/10 dark:hover:bg-white/10 text-accent-chocolate dark:text-bg-vanilla-cream"
                                }`}
                              >
                                <span className="text-xs font-semibold">{time}</span>
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                                  isTimeSelected 
                                    ? "bg-primary-pink border-primary-pink text-white" 
                                    : "border-accent-chocolate/20 dark:border-white/20"
                                }`}>
                                  {isTimeSelected && <Check className="w-2.5 h-2.5" />}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Next booking stage CTA */}
                      <motion.button
                        disabled={selectedTime === null}
                        whileHover={selectedTime !== null ? { scale: 1.03 } : {}}
                        whileTap={selectedTime !== null ? { scale: 0.98 } : {}}
                        className={`w-full py-4 rounded-xl text-xs font-bold uppercase tracking-widest text-center shadow-lg transition-all duration-300 border border-white/50 cursor-pointer ${
                          selectedTime !== null
                            ? "bg-primary-pink hover:bg-primary-pink-deep text-white"
                            : "bg-accent-chocolate/5 text-accent-chocolate-light/45 cursor-not-allowed"
                        }`}
                      >
                        {selectedTime !== null ? "Continue To Details" : "Select A Time To Proceed"}
                      </motion.button>

                    </motion.div>
                  ) : (
                    <motion.div
                      key="details-empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex-1 flex flex-col justify-center items-center text-center gap-4 py-16"
                    >
                      <div className="w-14 h-14 rounded-full bg-accent-chocolate/5 dark:bg-white/5 flex items-center justify-center text-accent-chocolate-light dark:text-primary-pink-soft border border-white/30">
                        <CalendarIcon className="w-6 h-6 animate-pulse" />
                      </div>
                      <h3 className="font-serif text-lg font-bold text-accent-chocolate dark:text-white leading-tight">
                        No Date Selected
                      </h3>
                      <p className="text-xs text-accent-chocolate-light dark:text-bg-vanilla-cream/70 max-w-[240px] leading-relaxed font-normal">
                        Please select an active date from the July calendar grid to preview open slots.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>

          </div>
        </section>

      </main>

      {/* 6. Dark Chocolate Premium Footer */}
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
