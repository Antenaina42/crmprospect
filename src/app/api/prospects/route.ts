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

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const priority = searchParams.get("priority") || "";
    const city = searchParams.get("city") || "";
    const category = searchParams.get("category") || "";
    const isClient = searchParams.get("isClient") === "true";

    let prospects: any[] = [];

    try {
      const where: any = {
        isClient,
      };

      if (search) {
        where.OR = [
          { name: { contains: search } },
          { phone: { contains: search } },
          { email: { contains: search } },
          { city: { contains: search } },
          { decisionMaker: { contains: search } },
        ];
      }

      if (status) where.status = status;
      if (priority) where.priority = priority;
      if (city) where.city = city;
      if (category) where.category = category;

      prospects = await prisma.prospect.findMany({
        where,
        include: {
          assignedTo: { select: { id: true, name: true, email: true } },
          createdBy: { select: { id: true, name: true } },
          callLogs: { orderBy: { createdAt: "desc" }, take: 5 },
          appointments: { orderBy: { startTime: "asc" } },
          quotes: { orderBy: { createdAt: "desc" } },
        },
        orderBy: { importedAt: "desc" },
      });
    } catch (dbErr) {
      console.error("Database query fallback in GET /api/prospects:", dbErr);
      prospects = [];
    }

    return NextResponse.json(prospects);
  } catch (error) {
    console.error("GET /api/prospects route error:", error);
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

    const prospectsToImport = Array.isArray(body) ? body : [body];
    const importedResults = [];

    for (const item of prospectsToImport) {
      try {
        const prospect = await prisma.prospect.create({
          data: {
            googlePlaceId: item.googlePlaceId || `custom_${Date.now()}_${Math.random()}`,
            name: item.name,
            category: item.category || "Autre",
            phone: item.phone || "",
            phoneSecondary: item.phoneSecondary || null,
            email: item.email || null,
            address: item.address || "",
            city: item.city || "Antananarivo",
            region: item.region || "Analamanga",
            website: item.website || null,
            decisionMaker: item.decisionMaker || null,
            facebook: item.facebook || null,
            linkedin: item.linkedin || null,
            notes: item.notes || null,
            status: item.status || "Nouveau",
            priority: item.priority || "Moyenne",
            rating: item.rating ? parseFloat(item.rating) : null,
            userRatingsTotal: item.userRatingsTotal ? parseInt(item.userRatingsTotal) : null,
            lat: item.lat ? parseFloat(item.lat) : null,
            lng: item.lng ? parseFloat(item.lng) : null,
            assignedToId: item.assignedToId || userId,
            createdById: userId,
          },
        });
        importedResults.push(prospect);
      } catch (itemErr) {
        console.error("Single prospect import error:", itemErr);
      }
    }

    return NextResponse.json({ count: importedResults.length, data: importedResults });
  } catch (error: any) {
    console.error("POST /api/prospects error:", error);
    return NextResponse.json({ error: error.message || "Erreur lors de l'import" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: "ID prospect requis" }, { status: 400 });
    }

    if (updateData.status === "Client" && !updateData.isClient) {
      updateData.isClient = true;
      updateData.convertedAt = new Date();
    }

    const updated = await prisma.prospect.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/prospects error:", error);
    return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 });
  }
}
