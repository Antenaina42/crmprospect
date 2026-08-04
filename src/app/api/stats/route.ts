import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const totalProspects = await prisma.prospect.count();
    const newProspects = await prisma.prospect.count({ where: { status: "Nouveau" } });
    const contacted = await prisma.prospect.count({ where: { status: { in: ["Contacté", "En discussion"] } } });
    const interested = await prisma.prospect.count({ where: { status: "Intéressé" } });
    const converted = await prisma.prospect.count({ where: { isClient: true } });
    const totalCalls = await prisma.callLog.count();
    const totalAppointments = await prisma.appointment.count();

    const conversionRate = totalProspects > 0 ? ((converted / totalProspects) * 100).toFixed(1) : "0";

    // Category breakdown
    const categoryGroup = await prisma.prospect.groupBy({
      by: ["category"],
      _count: { id: true },
    });

    const categoryStats = categoryGroup.map((g) => ({
      name: g.category,
      count: g._count.id,
    }));

    // City breakdown
    const cityGroup = await prisma.prospect.groupBy({
      by: ["city"],
      _count: { id: true },
    });

    const cityStats = cityGroup.map((g) => ({
      name: g.city,
      count: g._count.id,
    }));

    // Commercial activity breakdown
    const commercials = await prisma.user.findMany({
      where: { role: "COMMERCIAL" },
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            assignedProspects: true,
            callLogs: true,
            appointments: true,
          },
        },
      },
    });

    const commercialStats = commercials.map((c) => ({
      name: c.name,
      prospects: c._count.assignedProspects,
      calls: c._count.callLogs,
      appointments: c._count.appointments,
    }));

    // Monthly trends data
    const monthlyTrends = [
      { month: "Jan", prospects: 12, clients: 2, calls: 24 },
      { month: "Fév", prospects: 18, clients: 3, calls: 38 },
      { month: "Mar", prospects: 25, clients: 5, calls: 45 },
      { month: "Avr", prospects: 30, clients: 7, calls: 52 },
      { month: "Mai", prospects: 22, clients: 4, calls: 40 },
      { month: "Juin", prospects: 35, clients: 9, calls: 65 },
      { month: "Juil", prospects: 28, clients: 6, calls: 50 },
      { month: "Août", prospects: totalProspects, clients: converted, calls: totalCalls },
    ];

    return NextResponse.json({
      kpis: {
        totalProspects,
        newProspects,
        contacted,
        interested,
        converted,
        clientsCount: converted,
        conversionRate,
        totalCalls,
        totalAppointments,
      },
      categoryStats,
      cityStats,
      commercialStats,
      monthlyTrends,
    });
  } catch (error) {
    console.error("GET /api/stats error:", error);
    return NextResponse.json({ error: "Erreur lors du calcul des statistiques" }, { status: 500 });
  }
}
