'use client';

import React, { useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { products } from "@/lib/products";
import MegaHeader from "@/components/shared/mega-header";
import { useCart } from "@/context/cart-context";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkle, ShoppingBag, ArrowLeft, Check, Plus, Minus } from "lucide-react";
import { Sacramento } from "next/font/google";

const sacramento = Sacramento({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const product = products.find((p) => p.id === id);
  const { addToCart } = useCart();

  const [activeImage, setActiveImage] = useState(product?.image || "");
  const [selectedFlavor, setSelectedFlavor] = useState(product?.flavors[0] || "");
  const [quantity, setQuantity] = useState(1);
  const [addedNotify, setAddedNotify] = useState(false);

  if (!product) {
    return (
      <div className="relative min-h-screen bg-[#fdfbf7] dark:bg-bg-vanilla-cream transition-colors duration-500 overflow-x-hidden font-sans flex flex-col justify-between">
        <MegaHeader />
        <div className="flex-grow flex flex-col items-center justify-center p-12 text-center mt-[120px]">
          <h2 className="font-serif text-3xl font-bold text-accent-chocolate dark:text-white mb-4">
            Creation Not Found
          </h2>
          <p className="text-sm text-accent-chocolate-light dark:text-bg-vanilla-cream/70 mb-8 max-w-md">
            The confectionery masterpiece you are seeking does not exist or has been archived.
          </p>
          <Link
            href="/shop"
            className="glass-button text-xs py-3 px-6 font-bold uppercase tracking-widest hover:bg-primary-pink hover:text-white transition-all duration-300 inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Catalog
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.priceNumber,
      priceString: product.price,
      flavor: selectedFlavor,
      image: product.image,
      quantity,
    });
    setAddedNotify(true);
    setTimeout(() => setAddedNotify(false), 3000);
  };

  return (
    <div className="relative min-h-screen bg-[#fdfbf7] dark:bg-bg-vanilla-cream transition-colors duration-500 overflow-x-hidden font-sans flex flex-col">
      <MegaHeader />

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-[140px] pb-24 flex-grow z-10">
        
        {/* Back Link */}
        <Link 
          href="/shop" 
          className="inline-flex items-center gap-2 text-xs font-semibold text-accent-chocolate-light dark:text-bg-vanilla/70 hover:text-primary-pink transition-colors mb-8 cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Catalog
        </Link>

        {/* Bento/Split Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Left Column: Premium Media Gallery (5 cols on lg) */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden glass-card border border-white/30 dark:border-white/10 shadow-lg bg-white/20 dark:bg-white/5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImage}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full h-full relative"
                >
                  <Image
                    src={activeImage || "/placeholder.png"}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              {product.badge && (
                <span className="absolute top-6 left-6 rounded-full bg-primary-pink text-white font-bold uppercase tracking-widest text-[9px] px-3.5 py-1.5 shadow-sm border border-white/20">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Gallery Thumbnails */}
            {product.gallery && product.gallery.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(img)}
                    className={`relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 border transition-all cursor-pointer ${
                      activeImage === img
                        ? "border-primary-pink ring-2 ring-primary-pink/20 scale-95"
                        : "border-accent-chocolate/10 hover:border-primary-pink/50 dark:border-white/10 dark:hover:border-white/30"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} gallery image ${i + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Details (6 cols on lg) */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div className="space-y-6 text-left">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-primary-pink-deep dark:text-primary-pink">
                  {product.category}
                </span>
                <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-accent-chocolate dark:text-white mt-2 leading-tight uppercase">
                  {product.name}
                </h1>
              </div>

              {/* Price Token */}
              <div className="inline-flex items-center rounded-full bg-accent-chocolate/5 dark:bg-white/5 border border-accent-chocolate/10 dark:border-white/10 px-5 py-2">
                <span className="text-2xl font-serif font-bold text-primary-pink-deep dark:text-primary-pink">
                  {product.price}
                </span>
                <span className="text-[10px] uppercase font-bold text-accent-chocolate-light dark:text-bg-vanilla/60 tracking-wider ml-3 pl-3 border-l border-accent-chocolate/10 dark:border-white/10">
                  Tax Included
                </span>
              </div>

              <p className="text-sm text-accent-chocolate-light dark:text-bg-vanilla-cream/80 leading-relaxed font-normal">
                {product.description}
              </p>

              {/* Flavor Selector */}
              {product.flavors && product.flavors.length > 0 && (
                <div className="space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-accent-chocolate-light dark:text-primary-pink-soft flex items-center gap-1.5">
                    <Sparkle className="w-3.5 h-3.5 text-gold-accent fill-gold-accent" />
                    Selected Flavor
                  </span>
                  <div className="flex flex-wrap gap-2.5">
                    {product.flavors.map((flavor) => (
                      <button
                        key={flavor}
                        onClick={() => setSelectedFlavor(flavor)}
                        className={`text-xs px-4 py-2 rounded-full border transition-all cursor-pointer font-medium ${
                          selectedFlavor === flavor
                            ? "bg-primary-pink border-primary-pink text-white font-semibold shadow-sm"
                            : "bg-white/40 border-accent-chocolate/10 text-accent-chocolate hover:bg-white/80 dark:bg-white/5 dark:border-white/10 dark:text-bg-vanilla dark:hover:bg-white/10"
                        }`}
                      >
                        {flavor}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-accent-chocolate-light dark:text-primary-pink-soft">
                  Select Quantity
                </span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-accent-chocolate/10 dark:border-white/10 rounded-full bg-white/40 dark:bg-white/5 p-1 backdrop-blur-md">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-accent-chocolate dark:text-white hover:bg-primary-pink/10 transition-colors disabled:opacity-30 cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-sm font-bold text-accent-chocolate dark:text-white">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-accent-chocolate dark:text-white hover:bg-primary-pink/10 transition-colors cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <span className="text-xs font-semibold text-accent-chocolate-light dark:text-bg-vanilla/60">
                    Total: <strong className="text-primary-pink-deep dark:text-primary-pink">${product.priceNumber * quantity}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-10 pt-8 border-t border-accent-chocolate/5 dark:border-white/5 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  className="glass-button flex-1 py-4 px-6 font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-primary-pink hover:text-white transition-all duration-300 cursor-pointer shadow-md"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Add to Bag
                </button>
                <Link
                  href="/checkout"
                  onClick={() => {
                    addToCart({
                      id: product.id,
                      name: product.name,
                      price: product.priceNumber,
                      priceString: product.price,
                      flavor: selectedFlavor,
                      image: product.image,
                      quantity,
                    });
                  }}
                  className="glass-button flex-1 py-4 px-6 font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 bg-accent-chocolate border-accent-chocolate text-white hover:bg-accent-chocolate-light transition-all duration-300 text-center shadow-md cursor-pointer"
                >
                  Buy Now
                </Link>
              </div>

              {/* Added Notification Toast */}
              <AnimatePresence>
                {addedNotify && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2.5 text-xs text-green-700 dark:text-green-400 font-semibold bg-green-500/10 border border-green-500/20 rounded-2xl px-4 py-3 justify-center"
                  >
                    <Check className="w-4 h-4" />
                    Successfully added {quantity} item(s) to your shopping bag!
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}
