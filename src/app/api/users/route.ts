import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    let users: any[] = [];
    let auditLogs: any[] = [];

    try {
      users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          active: true,
          createdAt: true,
          _count: { select: { assignedProspects: true, callLogs: true } },
        },
        orderBy: { createdAt: "desc" },
      });

      auditLogs = await prisma.auditLog.findMany({
        take: 20,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true, email: true } } },
      });
    } catch (dbErr) {
      console.error("Database query error in GET /api/users:", dbErr);
    }

    return NextResponse.json({ users: users || [], auditLogs: auditLogs || [] });
  } catch (error) {
    console.error("GET /api/users route error:", error);
    return NextResponse.json({ users: [], auditLogs: [] });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const currentUserRole = (session?.user as any)?.role;
    if (currentUserRole !== "SUPER_ADMIN" && currentUserRole !== "ADMIN") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    const { name, email, password, role } = await req.json();

    if (!email || !name) {
      return NextResponse.json({ error: "Nom et email requis" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Cet email est déjà utilisé" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password || "admin123", 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: role || "COMMERCIAL",
      },
    });

    return NextResponse.json(newUser);
  } catch (error: any) {
    console.error("POST /api/users error:", error);
    return NextResponse.json({ error: error?.message || "Erreur lors de la création de l'utilisateur" }, { status: 500 });
  }
}
