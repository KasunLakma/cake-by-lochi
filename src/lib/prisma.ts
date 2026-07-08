import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

const clientOptions = {
  log: ['error' as const],
}

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient(clientOptions)

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
