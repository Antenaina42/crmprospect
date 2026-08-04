import { PrismaClient } from '@prisma/client';
import path from 'path';

// Ensure .env is explicitly loaded in production
if (!process.env.DATABASE_URL) {
  try {
    require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });
  } catch (e) {
    // Dotenv fallback
  }
}

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
