'use client';

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sacramento } from "next/font/google";
import { ArrowRight } from "lucide-react";

const sacramento = Sacramento({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

interface CategoryItem {
  name: string;
  image: string;
  href: string;
  count: string;
}

const categoryData: CategoryItem[] = [
  {
    name: "Luxury Cupcakes",
    image: "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?q=80&w=600&auto=format&fit=crop",
    href: "/shop?category=luxury-cupcakes",
    count: "12 Items"
  },
  {
    name: "Celebration Cakes",
    image: "https://images.unsplash.com/photo-1535254973040-607b474cb50d?q=80&w=600&auto=format&fit=crop",
    href: "/shop?category=celebration-cakes",
    count: "8 Items"
  },
  {
    name: "Signature Desserts",
    image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=600&auto=format&fit=crop",
    href: "/shop?category=signature-desserts",
    count: "15 Items"
  },
  {
    name: "Artisan Pastries",
    image: "https://images.unsplash.com/photo-1569864358642-9d1684040f43?q=80&w=600&auto=format&fit=crop",
    href: "/shop?category=artisan-pastries",
    count: "24 Items"
  }
];

export default function ProductCategories() {
  return (
    <section className="relative z-10 w-full bg-white dark:bg-bg-vanilla-cream pt-24 pb-16 flex flex-col items-center">
      
      {/* Section Header */}
      <div className="text-center flex flex-col items-center gap-2 mb-12 px-6">
        <span className={`${sacramento.className} text-4xl text-primary-pink-deep dark:text-primary-pink-soft`}>
          Our Sweet Specialties
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-accent-chocolate dark:text-white uppercase mt-1">
          Explore Our Categories
        </h2>
        <span className="w-12 h-0.5 bg-primary-pink/40 mt-3" />
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6 max-w-7xl w-full mx-auto">
        {categoryData.map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -10, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="group relative h-80 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-white/20 bg-white/5"
          >
            <Link href={item.href} className="block w-full h-full relative">
              {/* Category Image */}
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10" />

              {/* Glassmorphic Bottom Label Strip */}
              <div className="absolute bottom-4 left-4 right-4 z-20 rounded-xl overflow-hidden">
                <div className="glass-card bg-white/40 dark:bg-black/30 backdrop-blur-md border border-white/30 p-4 flex items-center justify-between shadow-lg">
                  <div className="flex flex-col">
                    <span className="font-serif text-lg font-bold text-accent-chocolate dark:text-white">
                      {item.name}
                    </span>
                    <span className="text-[10px] font-semibold text-accent-chocolate-light dark:text-bg-vanilla/70 uppercase tracking-widest mt-0.5">
                      {item.count}
                    </span>
                  </div>
                  <div className="p-2 bg-primary-pink/20 rounded-full group-hover:bg-primary-pink group-hover:text-white transition-colors duration-300 text-primary-pink-deep dark:text-primary-pink-soft">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>

            </Link>
          </motion.div>
        ))}
      </div>

    </section>
  );
}
