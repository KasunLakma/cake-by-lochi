'use client';

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Sacramento } from "next/font/google";
import { ArrowRight } from "lucide-react";
import MegaHeader from "@/components/shared/mega-header";

const sacramento = Sacramento({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export default function AboutPage() {
  return (
    <div className="relative min-h-screen bg-[#fdfbf7] dark:bg-bg-vanilla-cream transition-colors duration-500 overflow-x-hidden font-sans">
      <MegaHeader />
      
      <main className="w-full pt-[120px] px-6 md:px-12 flex flex-col items-center">
        <section className="relative w-full max-w-7xl py-16 flex flex-col gap-12">
          
          <div className="text-center flex flex-col items-center gap-2">
            <span className={`${sacramento.className} text-4xl text-primary-pink-deep dark:text-primary-pink`}>
              Our Story
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-accent-chocolate dark:text-white uppercase mt-1">
              About Cake By Lochi
            </h1>
            <span className="w-12 h-0.5 bg-primary-pink/40 mt-3" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="flex flex-col gap-6 text-left">
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-accent-chocolate dark:text-white leading-snug">
                Where Architecture Meets Fine Pastry
              </h2>
              <p className="text-sm md:text-base text-accent-chocolate-light dark:text-bg-vanilla/80 leading-relaxed">
                Founded by Chef Lochi, our studio is dedicated to expanding the boundaries of traditional cake design. We view desserts as temporary sculptural installations, crafted with visual poetry and exquisite flavors.
              </p>
              <p className="text-sm md:text-base text-accent-chocolate-light dark:text-bg-vanilla/80 leading-relaxed">
                By fusing structural engineering concepts with classical French pastry techniques, we build multi-tiered cake sculptures that stand as the highlight of any celebration. Every detail—from edible gold accents to handcrafted sugar flowers—is applied with precision.
              </p>
              <p className="text-sm md:text-base text-accent-chocolate-light dark:text-bg-vanilla/80 leading-relaxed">
                Our philosophy prioritizes organic, farm-fresh ingredients and natural botanical flavor profiles. We invite you to experience confectionary craftsmanship at its finest.
              </p>
            </div>
            <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl">
              <Image 
                src="https://images.unsplash.com/photo-1535254973040-607b474cb50d?q=80&w=800&auto=format&fit=crop" 
                alt="Chef Lochi Studio Setup" 
                fill 
                className="object-cover"
              />
            </div>
          </div>

        </section>
      </main>
    </div>
  );
}
