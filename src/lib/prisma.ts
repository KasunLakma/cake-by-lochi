import { neonConfig, Pool } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';
import ws from 'ws';

if (typeof window === 'undefined') {
  neonConfig.webSocketConstructor = ws;
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

let prismaClient: PrismaClient;

const getPrisma = (): PrismaClient => {
  if (typeof window === 'undefined') {
    if (globalForPrisma.prisma) {
      return globalForPrisma.prisma;
    }
    if (!prismaClient) {
      const connectionString = process.env.DATABASE_URL || process.env.NEXT_PUBLIC_DATABASE_URL;
      if (!connectionString) {
        throw new Error("DATABASE_URL environment variable is missing at runtime!");
      }
      const pool = new Pool({ connectionString });
      const adapter = new PrismaNeon(pool as any);
      prismaClient = new PrismaClient({ adapter: adapter as any });
      if (process.env.NODE_ENV !== 'production') {
        globalForPrisma.prisma = prismaClient;
      }
    }
    return prismaClient;
  }
  return {} as PrismaClient;
};

export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop, receiver) {
    const client = getPrisma();
    return Reflect.get(client, prop, receiver);
  }
});
