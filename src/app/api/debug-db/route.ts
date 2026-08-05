import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

export async function GET() {
  const info: any = {
    cwd: process.cwd(),
    nodeEnv: process.env.NODE_ENV,
    platform: process.platform,
    hasEnvFile: fs.existsSync(path.resolve(process.cwd(), ".env")),
    hasEnvProdFile: fs.existsSync(path.resolve(process.cwd(), ".env.production")),
    databaseUrlSet: !!process.env.DATABASE_URL,
    databaseUrlMasked: process.env.DATABASE_URL
      ? process.env.DATABASE_URL.replace(/:[^:@]+@/, ":****@")
      : "NOT SET",
    dbConnectionStatus: "UNKNOWN",
    userCount: 0,
    prospectCount: 0,
    error: null,
  };

  try {
    const uCount = await prisma.user.count();
    const pCount = await prisma.prospect.count();
    info.dbConnectionStatus = "CONNECTED_SUCCESSFULLY";
    info.userCount = uCount;
    info.prospectCount = pCount;
  } catch (err: any) {
    info.dbConnectionStatus = "FAILED";
    info.error = {
      message: err?.message,
      code: err?.code,
      name: err?.name,
    };
  }

  return NextResponse.json(info);
}
