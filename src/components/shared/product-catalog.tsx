import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, Sparkle } from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  description: string;
  image: string;
  flavors: string[];
  gridClass: string;
  imageAspect: string;
  badge?: string;
}

function SafeImage({ src, alt, ...props }: any) {
  const [imgSrc, setImgSrc] = useState(src || "/cake_hero_main.png");
  useEffect(() => {
    setImgSrc(src || "/cake_hero_main.png");
  }, [src]);
  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      onError={() => setImgSrc("/cake_hero_main.png")}
    />
  );
}

export default function ProductCatalog() {
  const [selectedFlavor, setSelectedFlavor] = useState<Record<string, string>>({});
  const [activeCategory, setActiveCategory] = useState("All");
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [dbProducts, setDbProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchDbProducts = async () => {
      try {
        const res = await fetch("/api/admin/products");
        const data = await res.json();
        if (data.success && data.products.length > 0) {
          const formatted = data.products.map((p: any) => ({
            ...p,
            flavors: p.flavors ? p.flavors.split(", ").filter(Boolean) : []
          }));
          
          if (!formatted.some((p: any) => p.id === "bespoke-studio")) {
            formatted.push({
              id: "bespoke-studio",
              name: "Custom Cake Orders",
              category: "Custom Consultation",
              price: "From Rs. 105,000",
              description: "Work directly with Chef Lochi to co-create a sculptural dessert masterpiece tailored strictly to your event's architectural theme.",
              image: "",
              flavors: [],
              gridClass: "md:col-span-1 md:row-span-1",
              imageAspect: ""
            });
          }
          setDbProducts(formatted);
        }
      } catch (err) {
        console.error("Failed to load products from DB, falling back to static:", err);
      }
    };
    fetchDbProducts();
  }, []);

  useEffect(() => {
    if (categoryParam) {
      const slug = categoryParam.toLowerCase();
      if (slug === "celebration-cakes" || slug === "wedding-cakes") {
        setActiveCategory("Celebration Cakes");
      } else if (
        slug === "fine-pastries" ||
        slug === "cupcakes" ||
        slug === "macarons" ||
        slug === "lollypops" ||
        slug === "just-treats" ||
        slug === "ice-cream"
      ) {
        setActiveCategory("Fine Pastries");
      } else if (
        slug === "dietary-luxe" ||
        slug === "organic-botanical" ||
        slug === "coffee-chocolate"
      ) {
        setActiveCategory("Dietary Luxe");
      }
    }
  }, [categoryParam]);

  const categoriesList = ["All", "Celebration Cakes", "Fine Pastries", "Dietary Luxe"];

  const products: Product[] = [
    {
      id: "signature-truffle",
      name: "The Rose Gold Truffle",
      category: "Celebration Cakes",
      price: "Rs. 72,000",
      description: "Our signature multi-tiered creation featuring organic rosewater sponge, wild berry compote, and premium white chocolate truffle frosting. Hand-painted with edible gold leaf.",
      image: "/cake_hero_main.png",
      flavors: ["Wild Raspberry", "Champagne Velvet", "Salted Cocoa"],
      gridClass: "md:col-span-2 md:row-span-2",
      imageAspect: "aspect-[4/3] md:aspect-auto md:h-[360px] lg:h-[420px]",
      badge: "Signature Collection"
    },
    {
      id: "cupcake-flight",
      name: "Gourmet Cupcake Flight",
      category: "Fine Pastries",
      price: "Rs. 14,400",
      description: "A curated flight of six fluffy bakes dressed in velvety gourmet frostings.",
      image: "/cake_cat_cupcake.png",
      flavors: ["Madagascar Vanilla", "Roasted Pistachio", "Salted Caramel"],
      gridClass: "md:col-span-1 md:row-span-1",
      imageAspect: "aspect-[4/3] h-[200px]",
      badge: "Trending"
    },
    {
      id: "botanical-tart",
      name: "Botanical Forest Tart",
      category: "Dietary Luxe",
      price: "Rs. 19,500",
      description: "Gluten-free and vegan tart loaded with forest berries and organic botanical greens.",
      image: "/cake_cat_dietary.png",
      flavors: ["Lemon Botanical", "Wild Elderberry", "Coconut Matcha"],
      gridClass: "md:col-span-1 md:row-span-1",
      imageAspect: "aspect-[4/3] h-[200px]"
    },
    {
      id: "blossom-vanilla",
      name: "Blossom Vanilla Masterpiece",
      category: "Celebration Cakes",
      price: "Rs. 54,000",
      description: "Elegant double-layered cake featuring edible watercolor flower printings, organic vanilla bean mousse, and soft buttercream design.",
      image: "/cake_cat_celebration.png",
      flavors: ["Vanilla Orchid", "Lavender Lemon", "Almond Buttercream"],
      gridClass: "md:col-span-2 md:row-span-1",
      imageAspect: "aspect-[2/1] h-[240px]",
      badge: "Best Seller"
    },
    {
      id: "bespoke-studio",
      name: "Custom Cake Orders",
      category: "Custom Consultation",
      price: "From Rs. 105,000",
      description: "Work directly with Chef Lochi to co-create a sculptural dessert masterpiece tailored strictly to your event's architectural theme.",
      image: "",
      flavors: [],
      gridClass: "md:col-span-1 md:row-span-1",
      imageAspect: ""
    }
  ];

  const activeProducts = dbProducts.length > 0 ? dbProducts : products;

  // Category filter handles either full match or dynamic inclusion check
  const filteredProducts = activeCategory === "All"
    ? activeProducts
    : activeProducts.filter(p => p.category.toLowerCase() === activeCategory.toLowerCase() || p.category === "Custom Consultation");

  return (
    <section className="relative w-full py-24 px-4 md:px-8 lg:px-12 bg-bg-vanilla dark:bg-bg-vanilla-cream transition-colors duration-500">
      
      {/* Visual Accent Ambient Blobs */}
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[20%] left-[-10%] w-[45vw] h-[45vw] rounded-full bg-radial from-primary-pink/10 to-transparent blur-3xl opacity-60" />
        <div className="absolute bottom-[20%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-radial from-gold-accent-soft/15 to-transparent blur-3xl opacity-50" />
      </div>

      <div className="relative w-full max-w-7xl mx-auto z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-primary-pink-deep dark:text-primary-pink">
            The Confectionery Gallery
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-accent-chocolate dark:text-white mt-3 leading-tight">
            Our Handcrafted Creations
          </h2>
          <p className="text-sm text-accent-chocolate-light dark:text-bg-vanilla-cream/70 mt-4 leading-relaxed font-normal">
            Explore our curated selection of bespoke cakes and pastries, dynamically categorized and customized for the sweet tooth connoisseur.
          </p>
        </div>

        {/* Dynamic Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categoriesList.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-xs px-5 py-2.5 rounded-full font-semibold border transition-all duration-300 cursor-pointer ${
                activeCategory === cat
                  ? "bg-accent-chocolate border-accent-chocolate text-white dark:bg-primary-pink dark:border-primary-pink dark:text-white"
                  : "bg-white/40 border-accent-chocolate/10 text-accent-chocolate hover:bg-white/80 dark:bg-white/5 dark:border-white/10 dark:text-bg-vanilla-cream dark:hover:bg-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Bento Grid Product Layout */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => {
              if (product.id === "bespoke-studio") {
                return (
                  <motion.div
                    layout
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="group relative rounded-[32px] glass-card border border-white/30 dark:border-white/10 p-6 flex flex-col justify-between bg-gradient-to-br from-primary-pink/10 to-primary-pink-soft/5 dark:from-primary-pink/5 dark:to-accent-chocolate/20 md:col-span-1 md:row-span-1"
                  >
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary-pink-deep dark:text-primary-pink">
                          {product.category}
                        </span>
                        <div className="p-1.5 bg-primary-pink/20 rounded-full text-primary-pink-deep">
                          <Sparkles className="w-4 h-4 fill-primary-pink/20" />
                        </div>
                      </div>
                      <h3 className="font-serif text-xl font-bold text-accent-chocolate dark:text-white leading-tight">
                        {product.name}
                      </h3>
                      <p className="text-xs text-zinc-800 dark:text-zinc-100 leading-relaxed font-normal">
                        {product.description}
                      </p>
                      
                      <ul className="space-y-2 mt-4">
                        <li className="flex items-center gap-2 text-[11px] text-accent-chocolate dark:text-bg-vanilla-cream font-medium">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary-pink" />
                          1-on-1 Sketching Session
                        </li>
                        <li className="flex items-center gap-2 text-[11px] text-accent-chocolate dark:text-bg-vanilla-cream font-medium">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary-pink" />
                          Private Tasting Flight (5 Flavors)
                        </li>
                        <li className="flex items-center gap-2 text-[11px] text-accent-chocolate dark:text-bg-vanilla-cream font-medium">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary-pink" />
                          Bespoke Structural Rig Design
                        </li>
                      </ul>
                    </div>

                    <div className="border-t border-accent-chocolate/5 dark:border-white/5 pt-4 mt-6">
                      <Link 
                        href="/book" 
                        className="inline-flex items-center justify-between w-full glass-button py-2.5 px-4 text-xs font-semibold hover:bg-primary-pink hover:text-white transition-all duration-300 shadow-md border-white/50 bg-white/40 dark:bg-white/5"
                      >
                        Message Us
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </motion.div>
                );
              }

              return (
                <motion.div
                  layout
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className={`group relative overflow-hidden rounded-[32px] glass-card border border-white/20 dark:border-white/10 flex flex-col justify-between bg-bg-vanilla/40 dark:bg-bg-vanilla-cream/20 ${product.gridClass}`}
                >
                  
                  {/* Image Container with Zoom & Overlay */}
                  <div className={`relative w-full overflow-hidden rounded-t-xl ${product.imageAspect || "h-48 sm:h-64"}`}>
                    
                    <motion.div
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="w-full h-full relative"
                    >
                      <SafeImage
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="(max-w-768px) 100vw, 50vw"
                        loading="lazy"
                        quality={80}
                      />
                    </motion.div>

                    {/* Gradient shading */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none z-0" />

                    {/* Left Badge */}
                    {product.badge && (
                      <span className="absolute top-4 left-4 z-10 rounded-full bg-primary-pink/95 dark:bg-primary-pink/85 px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-white shadow-sm border border-white/20">
                        {product.badge}
                      </span>
                    )}

                    {/* Price Tag Overlay */}
                    <span className="absolute top-4 right-4 z-10 rounded-full bg-accent-chocolate/80 dark:bg-bg-vanilla-cream/90 px-3.5 py-1 text-xs font-bold text-white dark:text-accent-chocolate shadow-sm backdrop-blur-md border border-white/10">
                      {product.price}
                    </span>

                    {/* Sliding Flavor Selection Widget on hover */}
                    {product.flavors.length > 0 && (
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-bg-vanilla/95 dark:bg-bg-vanilla-cream/95 backdrop-blur-md border-t border-accent-chocolate/5 dark:border-white/5 z-20 flex flex-col gap-2 rounded-t-2xl translate-y-[101%] group-hover:translate-y-0 transition-transform duration-300 ease-premium">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-accent-chocolate-light dark:text-primary-pink-soft flex items-center gap-1">
                          <Sparkle className="w-3 h-3 text-gold-accent fill-gold-accent" />
                          Select Custom Flavor
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {product.flavors.map((flavor) => {
                            const isSelected = selectedFlavor[product.id] === flavor;
                            return (
                              <button
                                key={flavor}
                                onClick={() => setSelectedFlavor(prev => ({ ...prev, [product.id]: flavor }))}
                                className={`text-[10px] px-2.5 py-1 rounded-full border transition-all cursor-pointer font-medium ${
                                  isSelected
                                    ? "bg-primary-pink border-primary-pink text-white font-semibold shadow-sm"
                                    : "border-accent-chocolate/10 hover:border-primary-pink dark:border-white/10 dark:hover:border-primary-pink text-accent-chocolate dark:text-bg-vanilla"
                                }`}
                              >
                                {flavor}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Product Text Details */}
                  <div className="p-6 flex flex-col flex-1 justify-between gap-4">
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-primary-pink-deep dark:text-primary-pink">
                        {product.category}
                      </span>
                      <h3 className="font-serif text-xl font-bold text-accent-chocolate dark:text-white leading-tight">
                        {product.name}
                      </h3>
                    </div>

                    <div className="flex items-center justify-between border-t border-accent-chocolate/5 dark:border-white/5 pt-4 mt-2">
                      <span className="text-[10px] font-medium text-accent-chocolate-light dark:text-bg-vanilla-cream/60">
                        {selectedFlavor[product.id] ? (
                          <>Selected: <strong className="text-primary-pink-deep dark:text-primary-pink">{selectedFlavor[product.id]}</strong></>
                        ) : (
                          "Flavor Options Available"
                        )}
                      </span>
                      <Link
                        href={`/shop/${product.id}`}
                        className="glass-button text-[10px] font-bold uppercase tracking-widest py-2 px-4 border-white/50 bg-primary-pink text-white hover:bg-primary-pink-deep transition-all cursor-pointer block text-center shadow-sm"
                      >
                        ADD TO CART
                      </Link>
                    </div>
                  </div>

                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
}
