import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    console.log("🌱 Triggering automatic database seeding for Hostinger MySQL...");

    const passwordHash = await bcrypt.hash("admin123", 10);

    // 1. Create Users
    const superAdmin = await prisma.user.upsert({
      where: { email: "superadmin@prospectmada.mg" },
      update: { passwordHash },
      create: {
        id: "usr_superadmin_01",
        name: "Super Admin",
        email: "superadmin@prospectmada.mg",
        passwordHash,
        role: "SUPER_ADMIN",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      },
    });

    const admin = await prisma.user.upsert({
      where: { email: "admin@prospectmada.mg" },
      update: { passwordHash },
      create: {
        id: "usr_admin_02",
        name: "Andry Rabe (Chef Ventes)",
        email: "admin@prospectmada.mg",
        passwordHash,
        role: "ADMIN",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      },
    });

    const commercial1 = await prisma.user.upsert({
      where: { email: "rakoto@prospectmada.mg" },
      update: { passwordHash },
      create: {
        id: "usr_comm_03",
        name: "Rakoto Jean",
        email: "rakoto@prospectmada.mg",
        passwordHash,
        role: "COMMERCIAL",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
      },
    });

    const commercial2 = await prisma.user.upsert({
      where: { email: "rasoa@prospectmada.mg" },
      update: { passwordHash },
      create: {
        id: "usr_comm_04",
        name: "Rasoa Marie",
        email: "rasoa@prospectmada.mg",
        passwordHash,
        role: "COMMERCIAL",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
      },
    });

    // 2. Create Cities of Madagascar
    const cities = [
      { id: "ct_1", name: "Antananarivo", region: "Analamanga", postalCode: "101" },
      { id: "ct_2", name: "Toamasina", region: "Atsinanana", postalCode: "501" },
      { id: "ct_3", name: "Antsirabe", region: "Vakinankaratra", postalCode: "110" },
      { id: "ct_4", name: "Mahajanga", region: "Boeny", postalCode: "401" },
      { id: "ct_5", name: "Fianarantsoa", region: "Haute Matsiatra", postalCode: "301" },
      { id: "ct_6", name: "Antsiranana (Diego)", region: "Diana", postalCode: "201" },
      { id: "ct_7", name: "Toliara (Tuléar)", region: "Atsimo-Andrefana", postalCode: "601" },
      { id: "ct_8", name: "Nosy Be", region: "Diana", postalCode: "207" },
      { id: "ct_9", name: "Sambava", region: "SAVA", postalCode: "208" },
      { id: "ct_10", name: "Taolagnaro (Fort-Dauphin)", region: "Anosy", postalCode: "614" },
    ];

    for (const city of cities) {
      await prisma.city.upsert({
        where: { name: city.name },
        update: {},
        create: city,
      });
    }

    // 3. Create Categories
    const categories = [
      { id: "cat_1", name: "Entreprises BTP", code: "BTP" },
      { id: "cat_2", name: "Agences de voyage", code: "TRAVEL" },
      { id: "cat_3", name: "Vente de véhicules", code: "AUTO_DEALER" },
      { id: "cat_4", name: "Garages automobiles", code: "AUTO_GARAGE" },
      { id: "cat_5", name: "Hôtels", code: "HOTEL" },
      { id: "cat_6", name: "Restaurants", code: "RESTAURANT" },
      { id: "cat_7", name: "Pharmacies", code: "PHARMACY" },
      { id: "cat_8", name: "Cliniques", code: "CLINIC" },
      { id: "cat_9", name: "Avocats", code: "LAWYER" },
      { id: "cat_10", name: "Banques", code: "BANK" },
      { id: "cat_11", name: "Sociétés informatiques", code: "IT" },
      { id: "cat_12", name: "Immobilières", code: "REAL_ESTATE" },
      { id: "cat_13", name: "Supermarchés", code: "SUPERMARKET" },
      { id: "cat_14", name: "Transporteurs & Transitaires", code: "LOGISTICS" },
      { id: "cat_15", name: "Centres de formation & Écoles", code: "EDUCATION" },
    ];

    for (const cat of categories) {
      await prisma.category.upsert({
        where: { name: cat.name },
        update: {},
        create: cat,
      });
    }

    // 4. Create Initial Prospects
    const sampleProspects = [
      {
        id: "prsp_1",
        googlePlaceId: "ChIJ_t123_Mada_01",
        name: "Madagascar Construction BTP S.A.",
        category: "Entreprises BTP",
        phone: "+261 34 02 123 45",
        phoneSecondary: "+261 32 07 987 65",
        email: "contact@madabtp.mg",
        address: "Zone Industrielle Akorondrano, Rue Hydrocarbures",
        city: "Antananarivo",
        region: "Analamanga",
        website: "https://madabtp.mg",
        decisionMaker: "M. Henri Randria (Directeur Technique)",
        notes: "Gros chantier à Tamatave prévu en Q4. Intéressé par offre M-IT Level Up à 1 500 000 Ar.",
        status: "Intéressé",
        priority: "Haute",
        rating: 4.6,
        userRatingsTotal: 34,
        lat: -18.8792,
        lng: 47.5256,
        assignedToId: commercial1.id,
        createdById: admin.id,
      },
      {
        id: "prsp_2",
        googlePlaceId: "ChIJ_t123_Mada_02",
        name: "Hôtel Carlton Madagascar",
        category: "Hôtels",
        phone: "+261 20 22 260 60",
        email: "reservation@carlton.mg",
        address: "Rue Pierre Stibbe, Anosy",
        city: "Antananarivo",
        region: "Analamanga",
        website: "https://carlton-madagascar.com",
        decisionMaker: "Mme Clarisse Razafy",
        notes: "Recherche solution CRM et réservation web M-IT Level Up.",
        status: "Devis envoyé",
        priority: "Urgente",
        rating: 4.5,
        userRatingsTotal: 820,
        lat: -18.9145,
        lng: 47.5218,
        assignedToId: commercial2.id,
        createdById: admin.id,
      },
      {
        id: "prsp_3",
        googlePlaceId: "ChIJ_t123_Mada_03",
        name: "Vanilla Travel Madagascar",
        category: "Agences de voyage",
        phone: "+261 32 05 444 12",
        email: "info@vanillatravel.mg",
        address: "Avenue de l'Indépendance, Analakely",
        city: "Antananarivo",
        region: "Analamanga",
        website: "https://vanillatravel.mg",
        decisionMaker: "M. Thierry Andria",
        status: "Contacté",
        priority: "Moyenne",
        rating: 4.8,
        userRatingsTotal: 65,
        lat: -18.9101,
        lng: 47.5249,
        assignedToId: commercial1.id,
        createdById: admin.id,
      },
      {
        id: "prsp_4",
        googlePlaceId: "ChIJ_t123_Mada_04",
        name: "SOCIETE MADA INFORMATIQUE",
        category: "Sociétés informatiques",
        phone: "+261 33 11 900 33",
        email: "sales@madainfo.mg",
        address: "Immeuble Pradon, Antanimena",
        city: "Antananarivo",
        region: "Analamanga",
        website: "https://madainfo.mg",
        decisionMaker: "M. Luc Rakotomalala",
        status: "Client",
        priority: "Haute",
        isClient: true,
        rating: 4.9,
        userRatingsTotal: 42,
        convertedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        lat: -18.8988,
        lng: 47.5270,
        assignedToId: commercial2.id,
        createdById: admin.id,
      },
      {
        id: "prsp_5",
        googlePlaceId: "ChIJ_t123_Mada_05",
        name: "Garage Ocean Indien Auto",
        category: "Garages automobiles",
        phone: "+261 34 50 111 22",
        address: "Boulevard Joffre",
        city: "Toamasina",
        region: "Atsinanana",
        notes: "Demande de démonstration rappel mardi 10h.",
        status: "À rappeler",
        priority: "Moyenne",
        rating: 4.2,
        userRatingsTotal: 19,
        lat: -18.1499,
        lng: 49.4023,
        assignedToId: commercial1.id,
        createdById: admin.id,
      },
    ];

    for (const p of sampleProspects) {
      await prisma.prospect.upsert({
        where: { googlePlaceId: p.googlePlaceId },
        update: {},
        create: p,
      });
    }

    const usersCount = await prisma.user.count();
    const prospectsCount = await prisma.prospect.count();

    return NextResponse.json({
      success: true,
      message: "Base de données Hostinger MySQL initialisée et alimentée avec succès !",
      stats: {
        users: usersCount,
        prospects: prospectsCount,
      },
      accounts: [
        { role: "Super Admin", email: "superadmin@prospectmada.mg", password: "admin123" },
        { role: "Admin (Chef Ventes)", email: "admin@prospectmada.mg", password: "admin123" },
        { role: "Commercial", email: "rakoto@prospectmada.mg", password: "admin123" },
        { role: "Commercial", email: "rasoa@prospectmada.mg", password: "admin123" },
      ],
    });
  } catch (error: any) {
    console.error("GET /api/seed error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de l'initialisation de la base de données",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
