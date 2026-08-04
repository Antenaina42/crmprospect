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

// Automatic Hostinger MySQL fallback if DATABASE_URL is not provided by server environment
const isProductionServer = process.env.NODE_ENV === 'production' || process.env.HOSTINGER || process.env.USER === 'u697568943';

if (!process.env.DATABASE_URL && isProductionServer) {
  process.env.DATABASE_URL = "mysql://u697568943_prospect:Prospect2026@127.0.0.1:3306/u697568943_prospect";
}

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
