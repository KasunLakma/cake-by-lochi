export interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  priceNumber: number;
  description: string;
  image: string;
  gallery: string[];
  flavors: string[];
  gridClass: string;
  imageAspect: string;
  badge?: string;
}

export const products: Product[] = [
  {
    id: "signature-truffle",
    name: "The Rose Gold Truffle",
    category: "Celebration Cakes",
    price: "Rs. 72,000",
    priceNumber: 72000,
    description: "Our signature multi-tiered creation featuring organic rosewater sponge, wild berry compote, and premium white chocolate truffle frosting. Hand-painted with edible gold leaf.",
    image: "/cake_hero_main.png",
    gallery: [
      "/cake_hero_main.png",
      "https://images.unsplash.com/photo-1535254973040-607b474cb50d?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=600&auto=format&fit=crop"
    ],
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
    priceNumber: 14400,
    description: "A curated flight of six fluffy bakes dressed in velvety gourmet frostings. Includes signature Madagascar vanilla, rich roasted pistachio, and pure salted caramel flavors.",
    image: "/cake_cat_cupcake.png",
    gallery: [
      "/cake_cat_cupcake.png",
      "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?q=80&w=600&auto=format&fit=crop"
    ],
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
    priceNumber: 19500,
    description: "Gluten-free and vegan tart loaded with forest berries and organic botanical greens. Uses cold-pressed coconut sugar and almond base.",
    image: "/cake_cat_dietary.png",
    gallery: [
      "/cake_cat_dietary.png",
      "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?q=80&w=600&auto=format&fit=crop"
    ],
    flavors: ["Lemon Botanical", "Wild Elderberry", "Coconut Matcha"],
    gridClass: "md:col-span-1 md:row-span-1",
    imageAspect: "aspect-[4/3] h-[200px]"
  },
  {
    id: "blossom-vanilla",
    name: "Blossom Vanilla Masterpiece",
    category: "Celebration Cakes",
    price: "Rs. 54,000",
    priceNumber: 54000,
    description: "Elegant double-layered cake featuring edible watercolor flower printings, organic vanilla bean mousse, and soft buttercream design.",
    image: "/cake_cat_celebration.png",
    gallery: [
      "/cake_cat_celebration.png",
      "https://images.unsplash.com/photo-1569864358642-9d1684040f43?q=80&w=600&auto=format&fit=crop"
    ],
    flavors: ["Vanilla Orchid", "Lavender Lemon", "Almond Buttercream"],
    gridClass: "md:col-span-2 md:row-span-1",
    imageAspect: "aspect-[2/1] h-[240px]",
    badge: "Best Seller"
  }
];
