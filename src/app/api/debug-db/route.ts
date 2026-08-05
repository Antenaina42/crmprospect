import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

export async function GET() {
  const currentEnvUrl = process.env.DATABASE_URL || "NOT SET";
  const maskedCurrentUrl = currentEnvUrl.replace(/:[^:@]+@/, ":****@");

  const candidates = [
    currentEnvUrl,
    "mysql://u697568943_prospect:Prospect2026@127.0.0.1:3306/u697568943_prospect",
    "mysql://u697568943_prospect:Prospect2026@localhost:3306/u697568943_prospect",
    "mysql://u697568943_prospect:Prospect2026@auth-db1590.hstgr.io:3306/u697568943_prospect",
  ];

  const testResults: any[] = [];
  let successfulConnectionUrl: string | null = null;

  for (const url of candidates) {
    if (!url || url === "NOT SET") continue;
    const masked = url.replace(/:[^:@]+@/, ":****@");

    try {
      const tempPrisma = new PrismaClient({
        datasources: { db: { url } },
      });
      const uCount = await tempPrisma.user.count();
      const pCount = await tempPrisma.prospect.count();
      await tempPrisma.$disconnect();

      testResults.push({
        url: masked,
        status: "SUCCESS",
        userCount: uCount,
        prospectCount: pCount,
      });

      if (!successfulConnectionUrl) {
        successfulConnectionUrl = url;
      }
    } catch (err: any) {
      testResults.push({
        url: masked,
        status: "FAILED",
        error: err?.message,
      });
    }
  }

  return NextResponse.json({
    activeEnvUrlMasked: maskedCurrentUrl,
    successfulConnectionUrlMasked: successfulConnectionUrl
      ? successfulConnectionUrl.replace(/:[^:@]+@/, ":****@")
      : "NONE",
    results: testResults,
  });
}
