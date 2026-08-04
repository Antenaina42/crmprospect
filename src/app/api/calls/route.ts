import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await req.json();
    const { prospectId, duration, result, notes } = body;

    if (!prospectId || !result) {
      return NextResponse.json({ error: "Prospect et résultat requis" }, { status: 400 });
    }

    const callLog = await prisma.callLog.create({
      data: {
        prospectId,
        userId,
        duration: parseInt(duration || "0"),
        result,
        notes,
      },
    });

    // Update prospect first contact date if null
    const prospect = await prisma.prospect.findUnique({ where: { id: prospectId } });
    if (prospect && !prospect.firstContactAt) {
      await prisma.prospect.update({
        where: { id: prospectId },
        data: { firstContactAt: new Date(), status: "Contacté" },
      });
    }

    return NextResponse.json(callLog);
  } catch (error) {
    console.error("POST /api/calls error:", error);
    return NextResponse.json({ error: "Erreur lors de l'enregistrement de l'appel" }, { status: 500 });
  }
}
