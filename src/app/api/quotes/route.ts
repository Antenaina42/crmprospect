import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const userId = (session.user as any)?.id;
    const userRole = (session.user as any)?.role || "COMMERCIAL";
    const isSuperAdmin = userRole === "SUPER_ADMIN" || userRole === "ADMIN";

    let quotes: any[] = [];
    try {
      const where: any = {};
      if (!isSuperAdmin) {
        where.OR = [
          { createdById: userId },
          { prospect: { assignedToId: userId } },
          { prospect: { createdById: userId } },
        ];
      }

      quotes = await prisma.quote.findMany({
        where,
        include: {
          prospect: { select: { id: true, name: true, phone: true, email: true, city: true } },
          createdBy: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
      });
    } catch (dbErr) {
      console.error("Database query error in GET /api/quotes:", dbErr);
      quotes = [];
    }

    return NextResponse.json(quotes || []);
  } catch (error) {
    console.error("GET /api/quotes route error:", error);
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await req.json();
    const { prospectId, items, totalAmount, validDays } = body;

    const count = await prisma.quote.count().catch(() => 0);
    const quoteNumber = `DEV-${new Date().getFullYear()}-${(count + 1).toString().padStart(3, "0")}`;

    const quote = await prisma.quote.create({
      data: {
        quoteNumber,
        prospectId,
        createdById: userId,
        totalAmount: parseFloat(totalAmount),
        status: "Envoye",
        validUntil: new Date(Date.now() + (parseInt(validDays || "15") * 24 * 60 * 60 * 1000)),
        itemsJson: JSON.stringify(items),
      },
    });

    try {
      await prisma.prospect.update({
        where: { id: prospectId },
        data: { status: "Devis envoyé" },
      });
    } catch (e) {
      // Optional status update
    }

    return NextResponse.json(quote);
  } catch (error: any) {
    console.error("POST /api/quotes error:", error);
    return NextResponse.json({ error: error?.message || "Erreur lors de la création du devis" }, { status: 500 });
  }
}
