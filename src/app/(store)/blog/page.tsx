'use client';

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Sacramento } from "next/font/google";
import { ArrowRight } from "lucide-react";
import MegaHeader from "@/components/shared/mega-header";
import { blogPosts } from "@/lib/blog";
import { formatEventDate } from "@/lib/dates";

const sacramento = Sacramento({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export default function BlogPage() {
  return (
    <div className="relative min-h-screen bg-[#fdfbf7] dark:bg-bg-vanilla-cream transition-colors duration-500 overflow-x-hidden font-sans">
      <MegaHeader />
      
      <main className="w-full pt-[120px] px-4 sm:px-6 md:px-12 flex flex-col items-center">
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
            {blogPosts.map((post) => (
              <div key={post.slug} className="flex flex-col gap-4 bg-white/40 dark:bg-white/5 border border-white/30 dark:border-white/10 rounded-[2.5rem] p-6 shadow-md hover:shadow-xl transition-shadow duration-300">
                <div className="relative aspect-video rounded-2xl overflow-hidden">
                  <Image 
                    src={post.image} 
                    alt={post.title} 
                    fill 
                    className="object-cover" 
                    loading="lazy"
                    quality={80}
                  />
                </div>
                <span className="text-[10px] font-bold text-primary-pink-deep dark:text-primary-pink">{formatEventDate(post.date)}</span>
                <h3 className="font-serif text-lg font-bold text-accent-chocolate dark:text-white leading-snug">{post.title}</h3>
                <p className="text-xs text-accent-chocolate-light dark:text-slate-300 leading-relaxed font-normal">{post.excerpt}</p>
                <div className="border-t border-accent-chocolate/5 dark:border-white/5 pt-2">
                  <Link 
                    href={`/blog/${post.slug}`} 
                    className="text-xs font-semibold text-primary-pink hover:text-primary-pink-deep inline-flex items-center gap-1 min-h-[48px] py-2.5 px-1 w-full"
                  >
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
