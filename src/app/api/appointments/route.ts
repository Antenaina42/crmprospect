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

    const appointments = await prisma.appointment.findMany({
      include: {
        prospect: { select: { id: true, name: true, phone: true, city: true } },
        user: { select: { id: true, name: true } },
      },
      orderBy: { startTime: "asc" },
    });

    return NextResponse.json(appointments);
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
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
    const { prospectId, title, description, startTime, endTime, type, reminderMinutes } = body;

    const appointment = await prisma.appointment.create({
      data: {
        prospectId,
        userId,
        title,
        description,
        startTime: new Date(startTime),
        endTime: new Date(endTime || startTime),
        type: type || "Rendez-vous",
        reminderMinutes: parseInt(reminderMinutes || "15"),
      },
    });

    // Update prospect status to RDV_fixe
    if (type === "Rendez-vous") {
      await prisma.prospect.update({
        where: { id: prospectId },
        data: { status: "Rendez-vous fixé" },
      });
    }

    return NextResponse.json(appointment);
  } catch (error) {
    console.error("POST /api/appointments error:", error);
    return NextResponse.json({ error: "Erreur lors de la création du rendez-vous" }, { status: 500 });
  }
}
