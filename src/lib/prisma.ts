import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

// Multi-path dotenv loader for Hostinger production environments
const possibleEnvPaths = [
  path.resolve(process.cwd(), '.env.production'),
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), '.env.local'),
];

for (const envPath of possibleEnvPaths) {
  if (fs.existsSync(envPath)) {
    try {
      dotenv.config({ path: envPath });
    } catch (e) {}
  }
}

// CRITICAL: On Hostinger shared hosting, "localhost" uses Unix socket auth which FAILS.
// Force 127.0.0.1 TCP socket which works. Always replace localhost with 127.0.0.1.
if (process.env.DATABASE_URL) {
  process.env.DATABASE_URL = process.env.DATABASE_URL.replace('@localhost:', '@127.0.0.1:');
}

// Fallback: if DATABASE_URL is still missing or points to SQLite dev.db
if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes("dev.db") || !process.env.DATABASE_URL.startsWith("mysql")) {
  if (process.env.NODE_ENV === "production" || process.platform === "linux") {
    process.env.DATABASE_URL = "mysql://u697568943_prospect:Prospect2026@127.0.0.1:3306/u697568943_prospect";
  }
}

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
