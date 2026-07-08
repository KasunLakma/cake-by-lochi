import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

// Explicitly pass config maps under standard instantiation layout
const clientOptions = {
  log: ['error'],
}

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient(clientOptions)

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
