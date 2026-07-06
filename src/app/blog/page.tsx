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

export default function BlogPage() {
  const posts = [
    {
      title: "Art of Edible Gold: Designing The Rose Gold Truffle",
      excerpt: "Behind the scenes of Chef Lochi's signature gold-leaf application and organic rosewater baking process.",
      date: "June 24, 2026",
      image: "/cake_hero_main.png"
    },
    {
      title: "How to Store and Transport Tiered Cake Sculptures",
      excerpt: "Crucial professional guidance on maintaining structural stability and buttercream textures on warm days.",
      date: "May 18, 2026",
      image: "/cake_cat_celebration.png"
    },
    {
      title: "Sugar Flowers vs. Real Blooms: The Pastry Debate",
      excerpt: "Exploring the aesthetic, practical, and food-safety arguments surrounding cake floral decorations.",
      date: "April 02, 2026",
      image: "/cake_cat_dietary.png"
    }
  ];

  return (
    <div className="relative min-h-screen bg-[#fdfbf7] dark:bg-bg-vanilla-cream transition-colors duration-500 overflow-x-hidden font-sans">
      <MegaHeader />
      
      <main className="w-full pt-[120px] px-6 md:px-12 flex flex-col items-center">
        <section className="relative w-full max-w-7xl py-16 flex flex-col gap-12">
          
          <div className="text-center flex flex-col items-center gap-2">
            <span className={`${sacramento.className} text-4xl text-primary-pink-deep dark:text-primary-pink`}>
              Our Stories
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-accent-chocolate dark:text-white uppercase mt-1">
              Cake By Lochi Blog
            </h1>
            <span className="w-12 h-0.5 bg-primary-pink/40 mt-3" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {posts.map((post, index) => (
              <div key={index} className="flex flex-col gap-4 bg-white/40 dark:bg-white/5 border border-white/30 dark:border-white/10 rounded-[2.5rem] p-6 shadow-md hover:shadow-xl transition-shadow duration-300">
                <div className="relative aspect-video rounded-2xl overflow-hidden">
                  <Image src={post.image} alt={post.title} fill className="object-cover" />
                </div>
                <span className="text-[10px] font-bold text-primary-pink-deep dark:text-primary-pink">{post.date}</span>
                <h3 className="font-serif text-lg font-bold text-accent-chocolate dark:text-white leading-snug">{post.title}</h3>
                <p className="text-xs text-accent-chocolate-light dark:text-bg-vanilla-cream/80 leading-relaxed font-normal">{post.excerpt}</p>
                <div className="border-t border-accent-chocolate/5 dark:border-white/5 pt-4 mt-2">
                  <Link href={`/blog/${index}`} className="text-xs font-semibold text-primary-pink hover:text-primary-pink-deep inline-flex items-center gap-1">
                    Read Article <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </section>
      </main>
    </div>
  );
}
