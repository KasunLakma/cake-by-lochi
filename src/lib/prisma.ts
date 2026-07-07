import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import path from 'path';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

let prismaClient: PrismaClient;

if (typeof window === 'undefined') {
  const dbPath = path.resolve(process.cwd(), 'prisma/dev.db');
  const adapter = new PrismaBetterSqlite3({ url: dbPath });
  prismaClient = new PrismaClient({ adapter });

  // Self-executing dynamic seed wrapper
  (async () => {
    try {
      // 1. Ensure at least one admin exists
      const adminEmail = "guest@example.com";
      const existingUser = await prismaClient.user.findUnique({ where: { email: adminEmail } });
      if (!existingUser) {
        await prismaClient.user.create({
          data: {
            email: adminEmail,
            name: "Master Admin Lochi",
            isAdmin: true,
          }
        });
      } else if (!existingUser.isAdmin) {
        await prismaClient.user.update({
          where: { email: adminEmail },
          data: { isAdmin: true },
        });
      }

      // Also create administrative user admin@cakebylochi.com
      const mainAdminEmail = "admin@cakebylochi.com";
      const mainAdmin = await prismaClient.user.findUnique({ where: { email: mainAdminEmail } });
      if (!mainAdmin) {
        await prismaClient.user.create({
          data: {
            email: mainAdminEmail,
            name: "Chef Lochi",
            isAdmin: true,
          }
        });
      }

      // 2. Ensure initial products exist in DB
      const productCount = await prismaClient.product.count();
      if (productCount === 0) {
        const initialProducts = [
          {
            id: "signature-truffle",
            name: "The Rose Gold Truffle",
            category: "Celebration Cakes",
            price: "Rs. 72,000",
            priceNumber: 72000,
            description: "Our signature multi-tiered creation featuring organic rosewater sponge, wild berry compote, and premium white chocolate truffle frosting. Hand-painted with edible gold leaf.",
            image: "/cake_hero_main.png",
            flavors: "Wild Raspberry, Champagne Velvet, Salted Cocoa",
            badge: "Signature Collection"
          },
          {
            id: "cupcake-flight",
            name: "Gourmet Cupcake Flight",
            category: "Fine Pastries",
            price: "Rs. 14,400",
            priceNumber: 14400,
            description: "A curated flight of six fluffy bakes dressed in velvety gourmet frostings.",
            image: "/cake_cat_cupcake.png",
            flavors: "Madagascar Vanilla, Roasted Pistachio, Salted Caramel",
            badge: "Trending"
          },
          {
            id: "botanical-tart",
            name: "Botanical Forest Tart",
            category: "Dietary Luxe",
            price: "Rs. 19,500",
            priceNumber: 19500,
            description: "Gluten-free and vegan tart loaded with forest berries and organic botanical greens.",
            image: "/cake_cat_dietary.png",
            flavors: "Lemon Botanical, Wild Elderberry, Coconut Matcha",
            badge: null
          },
          {
            id: "blossom-vanilla",
            name: "Blossom Vanilla Masterpiece",
            category: "Celebration Cakes",
            price: "Rs. 54,000",
            priceNumber: 54000,
            description: "Elegant double-layered cake featuring edible watercolor flower printings, organic vanilla bean mousse, and soft buttercream design.",
            image: "/cake_cat_celebration.png",
            flavors: "Vanilla Orchid, Lavender Lemon, Almond Buttercream",
            badge: "Best Seller"
          }
        ];

        for (const prod of initialProducts) {
          await prismaClient.product.create({ data: prod });
        }
      }
    } catch (err) {
      console.error("Auto-seed error:", err);
    }
  })();
} else {
  prismaClient = {} as PrismaClient;
}

export const prisma = globalForPrisma.prisma || prismaClient;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
