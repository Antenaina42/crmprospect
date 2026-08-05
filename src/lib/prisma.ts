import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';

const HOSTINGER_MYSQL_URL = "mysql://u697568943_prospect:Prospect2026@localhost:3306/u697568943_prospect";

// Try loading environment files if DATABASE_URL is missing or empty
if (!process.env.DATABASE_URL || process.env.DATABASE_URL.trim() === '') {
  try {
    const envOnlinePath = path.resolve(process.cwd(), '.env.production');
    const envPath = path.resolve(process.cwd(), '.env');

    if (fs.existsSync(envOnlinePath)) {
      require('dotenv').config({ path: envOnlinePath });
    } else if (fs.existsSync(envPath)) {
      require('dotenv').config({ path: envPath });
    }
  } catch (e) {}
}

// Guarantee Hostinger MySQL connection string in production if DATABASE_URL is still empty or points to SQLite
if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes("dev.db") || !process.env.DATABASE_URL.startsWith("mysql")) {
  if (process.env.NODE_ENV === "production" || process.platform === "linux") {
    process.env.DATABASE_URL = HOSTINGER_MYSQL_URL;
  }
}

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
