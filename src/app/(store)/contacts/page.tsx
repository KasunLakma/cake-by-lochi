'use client';

import React from "react";
import { Sacramento } from "next/font/google";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import MegaHeader from "@/components/shared/mega-header";

const sacramento = Sacramento({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export default function ContactsPage() {
  return (
    <div className="relative min-h-screen bg-[#fdfbf7] dark:bg-bg-vanilla-cream transition-colors duration-500 overflow-x-hidden font-sans">
      <MegaHeader />
      
      <main className="w-full pt-[120px] px-6 md:px-12 flex flex-col items-center">
        <section className="relative w-full max-w-7xl py-16 flex flex-col gap-12">
          
          <div className="text-center flex flex-col items-center gap-2">
            <span className={`${sacramento.className} text-4xl text-primary-pink-deep dark:text-primary-pink`}>
              Get In Touch
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-accent-chocolate dark:text-white uppercase mt-1">
              Contact Lochi Studio
            </h1>
            <span className="w-12 h-0.5 bg-primary-pink/40 mt-3" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Details & Info */}
            <div className="flex flex-col gap-8 text-left">
              <h2 className="font-serif text-2xl font-bold text-accent-chocolate dark:text-white">Let’s Discuss Your Sculpture Cake</h2>
              <p className="text-xs sm:text-sm text-accent-chocolate-light dark:text-bg-vanilla-cream/80 leading-relaxed font-normal">
                Have an upcoming wedding, anniversary, or private gallery showing? Contact Chef Lochi to arrange a private tasting flight and design consultation. Let us build your sweet masterpiece.
              </p>

              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4 text-accent-chocolate dark:text-white">
                  <div className="p-3 bg-primary-pink/15 rounded-xl text-primary-pink-deep">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-accent-chocolate-light dark:text-bg-vanilla/60">Phone Call</span>
                    <span className="text-sm font-bold">070 441 5115</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-accent-chocolate dark:text-white">
                  <div className="p-3 bg-primary-pink/15 rounded-xl text-primary-pink-deep">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-accent-chocolate-light dark:text-bg-vanilla/60">Email Support</span>
                    <span className="text-sm font-bold">studio@cakebylochi.com</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-accent-chocolate dark:text-white">
                  <div className="p-3 bg-primary-pink/15 rounded-xl text-primary-pink-deep">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-accent-chocolate-light dark:text-bg-vanilla/60">Bespoke Studio</span>
                    <span className="text-sm font-bold">Colombo, Sri Lanka</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <form className="flex flex-col gap-4 bg-white/40 dark:bg-white/5 border border-white/30 dark:border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-xl backdrop-blur-sm">
              <div className="flex flex-col gap-1 text-left">
                <label className="text-[10px] font-bold uppercase tracking-wider text-accent-chocolate-light dark:text-bg-vanilla/60">Full Name</label>
                <input type="text" className="w-full p-3 rounded-xl border border-accent-chocolate/10 bg-white/60 dark:bg-white/5 focus:outline-none focus:border-primary-pink text-xs font-semibold" placeholder="Your Name" />
              </div>
              <div className="flex flex-col gap-1 text-left">
                <label className="text-[10px] font-bold uppercase tracking-wider text-accent-chocolate-light dark:text-bg-vanilla/60">Email Address</label>
                <input type="email" className="w-full p-3 rounded-xl border border-accent-chocolate/10 bg-white/60 dark:bg-white/5 focus:outline-none focus:border-primary-pink text-xs font-semibold" placeholder="your@email.com" />
              </div>
              <div className="flex flex-col gap-1 text-left">
                <label className="text-[10px] font-bold uppercase tracking-wider text-accent-chocolate-light dark:text-bg-vanilla/60">Event Message</label>
                <textarea rows={4} className="w-full p-3 rounded-xl border border-accent-chocolate/10 bg-white/60 dark:bg-white/5 focus:outline-none focus:border-primary-pink text-xs font-semibold resize-none" placeholder="Describe your dream cake design..." />
              </div>
              <button type="submit" className="glass-button w-full mt-2 py-3.5 px-6 font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-primary-pink hover:text-white transition-all duration-300">
                Send Message <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </section>
      </main>
    </div>
  );
}
