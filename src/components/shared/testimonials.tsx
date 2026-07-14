'use client';

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Share2, Play, Music, Star, Quote, Volume2 } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatarText: string;
}

export default function Testimonials() {
  const [likes, setLikes] = useState(24520);
  const [isLiked, setIsLiked] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; x: number }[]>([]);

  const handleLike = () => {
    if (!isLiked) {
      setLikes((prev) => prev + 1);
      setIsLiked(true);
    } else {
      setLikes((prev) => prev - 1);
      setIsLiked(false);
    }

    const newHeart = {
      id: Date.now(),
      x: Math.random() * 60 - 30, // Random horizontal drift offset
    };
    setFloatingHearts((prev) => [...prev, newHeart]);
  };

  const testimonialsRow1: Testimonial[] = [
    {
      id: "t1",
      name: "Genevieve Sterling",
      role: "Bride",
      content: "The wedding cake was an absolute showstopper! Not only was the sculptural design breathtaking, but the champagne velvet layer was insanely delicious.",
      rating: 5,
      avatarText: "GS"
    },
    {
      id: "t2",
      name: "Arthur Pendelton",
      role: "Art Director",
      content: "Lochi's custom studio is unparalleled. The geometric cake rig he designed for our gallery opening was a true culinary art installation.",
      rating: 5,
      avatarText: "AP"
    },
    {
      id: "t3",
      name: "Sophia Martinez",
      role: "Event Planner",
      content: "My clients expect perfection, and cake_by_lochi delivers every single time. The macarons are crispy, chewy, and absolute perfection.",
      rating: 5,
      avatarText: "SM"
    }
  ];

  const testimonialsRow2: Testimonial[] = [
    {
      id: "t4",
      name: "Dr. Clara Winters",
      role: "Birthday Special",
      content: "Finding gluten-free treats that taste luxurious is nearly impossible. The forest berry tart was a flavor revelation! Thank you, Lochi!",
      rating: 5,
      avatarText: "CW"
    },
    {
      id: "t5",
      name: "Marcus Vance",
      role: "Anniversary Couture",
      content: "A masterclass in culinary elegance. The hand-painted gold leaf detail was delicate, and the wild raspberry compote was fresh and vibrant.",
      rating: 5,
      avatarText: "MV"
    },
    {
      id: "t6",
      name: "Elena Rostova",
      role: "Gourmet Enthusiast",
      content: "Sensory bliss. The raspberry rose gold truffle cake we ordered was soft, moist, and perfectly balanced in sweetness. A triumph of pastry craft.",
      rating: 5,
      avatarText: "ER"
    }
  ];

  const renderCard = (t: Testimonial, idx: number) => (
    <div
      key={t.id}
      className="w-[300px] sm:w-[350px] p-6 rounded-2xl glass-card border border-white/20 dark:border-white/5 flex flex-col justify-between gap-4 bg-bg-vanilla/45 dark:bg-bg-vanilla-cream/30 hover:shadow-xl transition-all duration-300 pointer-events-auto"
    >
      <div className="space-y-3">
        {/* Rating and Quote Icon */}
        <div className="flex justify-between items-center">
          <div className="flex gap-1">
            {[...Array(t.rating)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 text-gold-accent fill-gold-accent" />
            ))}
          </div>
          <Quote className="w-6 h-6 text-primary-pink/20 dark:text-primary-pink/10 fill-primary-pink/5" />
        </div>

        {/* Review Text */}
        <p className="text-xs text-accent-chocolate dark:text-slate-100 leading-relaxed font-normal italic">
          "{t.content}"
        </p>
      </div>

      {/* Reviewer Details */}
      <div className="flex items-center gap-3 border-t border-accent-chocolate/5 dark:border-white/5 pt-3">
        <div className="w-9 h-9 rounded-full bg-primary-pink/25 dark:bg-primary-pink/10 flex items-center justify-center text-xs font-bold text-primary-pink-deep dark:text-primary-pink">
          {t.avatarText}
        </div>
        <div>
          <h4 className="text-xs font-bold text-accent-chocolate dark:text-white leading-tight">
            {t.name}
          </h4>
          <span className="text-[10px] text-accent-chocolate-light dark:text-slate-300">
            {t.role}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <section className="relative w-full py-24 px-4 md:px-8 lg:px-12 bg-bg-vanilla dark:bg-bg-vanilla-cream overflow-hidden transition-colors duration-500">
      
      {/* Background Ambience blobs */}
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-radial from-primary-pink/10 to-transparent blur-3xl opacity-50" />
        <div className="absolute bottom-[20%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-radial from-gold-accent-soft/10 to-transparent blur-3xl opacity-40" />
      </div>

      <div className="relative w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center z-10">
        
        {/* Left Column: Testimonial Marquees & Headings */}
        <div className="col-span-1 lg:col-span-7 flex flex-col gap-8">
          
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-primary-pink-deep dark:text-primary-pink">
              Our Sweet Praises
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-accent-chocolate dark:text-white mt-3 leading-tight">
              Loved by Connoisseurs
            </h2>
            <p className="text-sm text-accent-chocolate-light dark:text-slate-200 mt-4 leading-relaxed font-normal max-w-xl">
              Discover feedback from weddings, art openings, and bespoke birthday events celebrating Lochi's custom sculpture cakes.
            </p>
          </div>

          {/* Marquee Row 1 (Scrolling Left) */}
          <div className="w-full overflow-hidden select-none pointer-events-none [mask-image:linear-gradient(to_right,transparent,white_15%,white_85%,transparent)] py-2">
            <motion.div
              animate={{ x: ["0%", "-50%"] }}
              transition={{
                ease: "linear",
                duration: 25,
                repeat: Infinity,
              }}
              className="flex gap-6 pr-6 min-w-full shrink-0"
            >
              {testimonialsRow1.map((t, idx) => renderCard(t, idx))}
              {testimonialsRow1.map((t, idx) => renderCard(t, idx))}
            </motion.div>
          </div>

          {/* Marquee Row 2 (Scrolling Right) */}
          <div className="w-full overflow-hidden select-none pointer-events-none [mask-image:linear-gradient(to_right,transparent,white_15%,white_85%,transparent)] py-2">
            <motion.div
              animate={{ x: ["-50%", "0%"] }}
              transition={{
                ease: "linear",
                duration: 28,
                repeat: Infinity,
              }}
              className="flex gap-6 pr-6 min-w-full shrink-0"
            >
              {testimonialsRow2.map((t, idx) => renderCard(t, idx))}
              {testimonialsRow2.map((t, idx) => renderCard(t, idx))}
            </motion.div>
          </div>

        </div>

        {/* Right Column: TikTok Mock Cake-Decorating Video Frame */}
        <div className="col-span-1 lg:col-span-5 flex justify-center">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-[280px] sm:w-[320px] aspect-[9/16] rounded-[32px] overflow-hidden shadow-2xl border border-white/20 glass-card bg-black/10 group/video"
          >
            {/* Background Cover image simulating video preview */}
            <Image
              src="/cake_cat_celebration.png"
              alt="TikTok Video Preview"
              fill
              className="object-cover transition-transform duration-700 group-hover/video:scale-105"
            />

            {/* Video overlay glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/75 z-10" />

            {/* Center Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
                className="w-14 h-14 rounded-full bg-white/35 backdrop-blur-md border border-white/40 flex items-center justify-center text-white cursor-pointer shadow-lg transition-colors hover:bg-white/50"
                aria-label="Play video preview"
              >
                <Play className="w-6 h-6 fill-white text-white translate-x-0.5" />
              </motion.button>
            </div>

            {/* Floating Hearts Container */}
            <AnimatePresence>
              {floatingHearts.map((heart) => (
                <motion.div
                  key={heart.id}
                  initial={{ opacity: 1, y: 0, scale: 0.8 }}
                  animate={{ opacity: 0, y: -160, scale: 1.3, x: heart.x }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  onAnimationComplete={() => {
                    setFloatingHearts((prev) => prev.filter((h) => h.id !== heart.id));
                  }}
                  className="absolute bottom-20 right-4 text-primary-pink z-30 pointer-events-none"
                >
                  <Heart className="w-6 h-6 fill-primary-pink text-primary-pink-deep" />
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Right Action Sidebar (TikTok style) */}
            <div className="absolute right-3 bottom-24 flex flex-col gap-4 items-center z-20">
              
              {/* Heart (Like) button */}
              <div className="flex flex-col items-center gap-1">
                <motion.button
                  whileTap={{ scale: 0.8 }}
                  onClick={handleLike}
                  className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border cursor-pointer transition-colors ${
                    isLiked 
                      ? "bg-primary-pink/90 border-primary-pink text-white" 
                      : "bg-black/35 border-white/20 text-white hover:bg-black/50"
                  }`}
                  aria-label="Like video"
                >
                  <Heart className={`w-5 h-5 ${isLiked ? "fill-white" : ""}`} />
                </motion.button>
                <span className="text-[10px] font-bold text-white shadow-sm">
                  {likes.toLocaleString()}
                </span>
              </div>

              {/* Comments Mock Button */}
              <div className="flex flex-col items-center gap-1">
                <button
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-black/35 border border-white/20 text-white cursor-pointer hover:bg-black/50"
                  aria-label="View comments"
                >
                  <MessageCircle className="w-5 h-5" />
                </button>
                <span className="text-[10px] font-bold text-white shadow-sm">482</span>
              </div>

              {/* Share Mock Button */}
              <div className="flex flex-col items-center gap-1">
                <button
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-black/35 border border-white/20 text-white cursor-pointer hover:bg-black/50"
                  aria-label="Share video"
                >
                  <Share2 className="w-5 h-5" />
                </button>
                <span className="text-[10px] font-bold text-white shadow-sm">1.2K</span>
              </div>

            </div>

            {/* Bottom Details Overlay (TikTok style) */}
            <div className="absolute bottom-5 left-4 right-16 flex flex-col gap-2 z-20 text-left">
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  @chef_lochi
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                </h4>
                <p className="text-[10px] text-white/90 font-normal leading-relaxed mt-1">
                  Painting details onto the Blossom Vanilla Masterpiece. #cakedecorating #bakingjoy
                </p>
              </div>

              {/* Audio descriptor */}
              <div className="flex items-center gap-1.5 text-[9px] text-white/80 font-medium overflow-hidden">
                <Volume2 className="w-3.5 h-3.5 shrink-0 text-primary-pink" />
                <div className="whitespace-nowrap animate-pulse">
                  Original Audio - cake_by_lochi
                </div>
              </div>
            </div>

            {/* Bottom Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-20">
              <motion.div
                animate={{ width: ["0%", "100%"] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="h-full bg-primary-pink"
              />
            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
}
