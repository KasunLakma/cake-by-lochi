import { neonConfig, Pool } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';
import ws from 'ws';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const createPrismaClient = () => {
  if (typeof window === 'undefined') {
    neonConfig.webSocketConstructor = ws;
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL
    });
    const adapter = new PrismaNeon(pool as any);
    return new PrismaClient({ adapter: adapter as any });
  }
  return {} as PrismaClient;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  if (typeof window === 'undefined') {
    globalForPrisma.prisma = prisma;
  }
}
