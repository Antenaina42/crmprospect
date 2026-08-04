const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Prospect Mada CRM seeding...');

  // Password hash for all test accounts: "admin123"
  const passwordHash = await bcrypt.hash('admin123', 10);

  // 1. Create Users
  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@prospectmada.mg' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'superadmin@prospectmada.mg',
      passwordHash,
      role: 'SUPER_ADMIN',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@prospectmada.mg' },
    update: {},
    create: {
      name: 'Andry Rabe (Chef Ventes)',
      email: 'admin@prospectmada.mg',
      passwordHash,
      role: 'ADMIN',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    },
  });

  const commercial1 = await prisma.user.upsert({
    where: { email: 'rakoto@prospectmada.mg' },
    update: {},
    create: {
      name: 'Rakoto Jean',
      email: 'rakoto@prospectmada.mg',
      passwordHash,
      role: 'COMMERCIAL',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    },
  });

  const commercial2 = await prisma.user.upsert({
    where: { email: 'rasoa@prospectmada.mg' },
    update: {},
    create: {
      name: 'Rasoa Marie',
      email: 'rasoa@prospectmada.mg',
      passwordHash,
      role: 'COMMERCIAL',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    },
  });

  console.log('✅ Users created.');

  // 2. Create Cities of Madagascar
  const cities = [
    { name: 'Antananarivo', region: 'Analamanga', postalCode: '101' },
    { name: 'Toamasina', region: 'Atsinanana', postalCode: '501' },
    { name: 'Antsirabe', region: 'Vakinankaratra', postalCode: '110' },
    { name: 'Mahajanga', region: 'Boeny', postalCode: '401' },
    { name: 'Fianarantsoa', region: 'Haute Matsiatra', postalCode: '301' },
    { name: 'Antsiranana (Diego)', region: 'Diana', postalCode: '201' },
    { name: 'Toliara (Tuléar)', region: 'Atsimo-Andrefana', postalCode: '601' },
    { name: 'Nosy Be', region: 'Diana', postalCode: '207' },
    { name: 'Sambava', region: 'SAVA', postalCode: '208' },
    { name: 'Taolagnaro (Fort-Dauphin)', region: 'Anosy', postalCode: '614' },
  ];

  for (const city of cities) {
    await prisma.city.upsert({
      where: { name: city.name },
      update: {},
      create: city,
    });
  }
  console.log('✅ Madagascar cities created.');

  // 3. Create Categories
  const categories = [
    { name: 'Entreprises BTP', code: 'BTP' },
    { name: 'Agences de voyage', code: 'TRAVEL' },
    { name: 'Vente de véhicules', code: 'AUTO_DEALER' },
    { name: 'Garages automobiles', code: 'AUTO_GARAGE' },
    { name: 'Hôtels', code: 'HOTEL' },
    { name: 'Restaurants', code: 'RESTAURANT' },
    { name: 'Pharmacies', code: 'PHARMACY' },
    { name: 'Cliniques', code: 'CLINIC' },
    { name: 'Avocats', code: 'LAWYER' },
    { name: 'Banques', code: 'BANK' },
    { name: 'Sociétés informatiques', code: 'IT' },
    { name: 'Immobilières', code: 'REAL_ESTATE' },
    { name: 'Supermarchés', code: 'SUPERMARKET' },
    { name: 'Transporteurs & Transitaires', code: 'LOGISTICS' },
    { name: 'Centres de formation & Écoles', code: 'EDUCATION' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: cat,
    });
  }
  console.log('✅ Categories created.');

  // 4. Create Initial Prospects
  const sampleProspects = [
    {
      googlePlaceId: 'ChIJ_t123_Mada_01',
      name: 'Madagascar Construction BTP S.A.',
      category: 'Entreprises BTP',
      phone: '+261 34 02 123 45',
      phoneSecondary: '+261 32 07 987 65',
      email: 'contact@madabtp.mg',
      address: 'Zone Industrielle Akorondrano, Rue Hydrocarbures',
      city: 'Antananarivo',
      region: 'Analamanga',
      website: 'https://madabtp.mg',
      decisionMaker: 'M. Henri Randria (Directeur Technique)',
      facebook: 'https://facebook.com/madabtp',
      notes: 'Gros chantier à Tamatave prévu en Q4. Intéressé par offre logiciel de gestion d\'équipe.',
      status: 'Intéressé',
      priority: 'Haute',
      rating: 4.6,
      userRatingsTotal: 34,
      lat: -18.8792,
      lng: 47.5256,
      assignedToId: commercial1.id,
      createdById: admin.id,
    },
    {
      googlePlaceId: 'ChIJ_t123_Mada_02',
      name: 'Hôtel Carlton Madagascar',
      category: 'Hôtels',
      phone: '+261 20 22 260 60',
      email: 'reservation@carlton.mg',
      address: 'Rue Pierre Stibbe, Anosy',
      city: 'Antananarivo',
      region: 'Analamanga',
      website: 'https://carlton-madagascar.com',
      decisionMaker: 'Mme Clarisse Razafy',
      notes: 'Recherche solution CRM pour le service événementiel.',
      status: 'Devis envoyé',
      priority: 'Urgente',
      rating: 4.5,
      userRatingsTotal: 820,
      lat: -18.9145,
      lng: 47.5218,
      assignedToId: commercial2.id,
      createdById: admin.id,
    },
    {
      googlePlaceId: 'ChIJ_t123_Mada_03',
      name: 'Vanilla Travel Madagascar',
      category: 'Agences de voyage',
      phone: '+261 32 05 444 12',
      email: 'info@vanillatravel.mg',
      address: 'Avenue de l\'Indépendance, Analakely',
      city: 'Antananarivo',
      region: 'Analamanga',
      website: 'https://vanillatravel.mg',
      decisionMaker: 'M. Thierry Andria',
      status: 'Contacté',
      priority: 'Moyenne',
      rating: 4.8,
      userRatingsTotal: 65,
      lat: -18.9101,
      lng: 47.5249,
      assignedToId: commercial1.id,
      createdById: admin.id,
    },
    {
      googlePlaceId: 'ChIJ_t123_Mada_04',
      name: 'SOCIETE MADA INFORMATIQUE',
      category: 'Sociétés informatiques',
      phone: '+261 33 11 900 33',
      email: 'sales@madainfo.mg',
      address: 'Immeuble Pradon, Antanimena',
      city: 'Antananarivo',
      region: 'Analamanga',
      website: 'https://madainfo.mg',
      decisionMaker: 'M. Luc Rakotomalala',
      status: 'Client',
      priority: 'Haute',
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
      googlePlaceId: 'ChIJ_t123_Mada_05',
      name: 'Garage Ocean Indien Auto',
      category: 'Garages automobiles',
      phone: '+261 34 50 111 22',
      address: 'Boulevard Joffre',
      city: 'Toamasina',
      region: 'Atsinanana',
      notes: 'Demande de démonstration rappel mardi 10h.',
      status: 'À rappeler',
      priority: 'Moyenne',
      rating: 4.2,
      userRatingsTotal: 19,
      lat: -18.1499,
      lng: 49.4023,
      assignedToId: commercial1.id,
      createdById: admin.id,
    },
    {
      googlePlaceId: 'ChIJ_t123_Mada_06',
      name: 'Pharmacie de la Corniche',
      category: 'Pharmacies',
      phone: '+261 20 55 221 00',
      address: 'Boulevard Poincare',
      city: 'Mahajanga',
      region: 'Boeny',
      status: 'Nouveau',
      priority: 'Faible',
      rating: 4.7,
      userRatingsTotal: 58,
      lat: -15.7225,
      lng: 46.3155,
      assignedToId: commercial2.id,
      createdById: admin.id,
    },
    {
      googlePlaceId: 'ChIJ_t123_Mada_07',
      name: 'Cabinet d\'Avocat Razafindrakoto',
      category: 'Avocats',
      phone: '+261 32 02 888 77',
      email: 'avocat.razaf@moov.mg',
      address: 'Isoraka, Lot II M 40',
      city: 'Antananarivo',
      region: 'Analamanga',
      decisionMaker: 'Maître Patrick Razafindrakoto',
      status: 'Rendez-vous fixé',
      priority: 'Urgente',
      rating: 4.9,
      userRatingsTotal: 12,
      lat: -18.9130,
      lng: 47.5200,
      assignedToId: commercial1.id,
      createdById: admin.id,
    },
    {
      googlePlaceId: 'ChIJ_t123_Mada_08',
      name: 'Supermarché Jumbo Score Tanjombato',
      category: 'Supermarchés',
      phone: '+261 20 22 460 00',
      address: 'Route Nationale 7, Tanjombato',
      city: 'Antananarivo',
      region: 'Analamanga',
      website: 'https://score.mg',
      status: 'En discussion',
      priority: 'Haute',
      rating: 4.3,
      userRatingsTotal: 1450,
      lat: -18.9555,
      lng: 47.5320,
      assignedToId: commercial2.id,
      createdById: admin.id,
    }
  ];

  for (const p of sampleProspects) {
    const createdProspect = await prisma.prospect.upsert({
      where: { googlePlaceId: p.googlePlaceId },
      update: {},
      create: p,
    });

    // Create call logs for some
    if (p.status === 'Intéressé' || p.status === 'Devis envoyé' || p.status === 'Client') {
      await prisma.callLog.create({
        data: {
          prospectId: createdProspect.id,
          userId: p.assignedToId,
          duration: 240,
          result: 'Interesse',
          notes: 'Présentation de la solution CRM Prospect Mada. Le client est très réceptif.',
          callDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        },
      });
    }

    // Create appointments for some
    if (p.status === 'Rendez-vous fixé') {
      await prisma.appointment.create({
        data: {
          prospectId: createdProspect.id,
          userId: p.assignedToId,
          title: 'RDV Démonstration Produit',
          description: 'Démonstration en visioconférence avec Maître Patrick.',
          startTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
          endTime: new Date(Date.now() + 25 * 60 * 60 * 1000),
          type: 'Rendez-vous',
          status: 'Programme',
        },
      });
    }

    // Create quotes for Devis envoyé
    if (p.status === 'Devis envoyé') {
      await prisma.quote.create({
        data: {
          quoteNumber: `DEV-2026-001`,
          prospectId: createdProspect.id,
          createdById: p.assignedToId,
          totalAmount: 1800000.0, // 1,800,000 Ariary MGA
          status: 'Envoye',
          validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
          itemsJson: JSON.stringify([
            { description: 'Licence Prospect Mada CRM - Formule Business (1 An)', quantity: 1, unitPrice: 1500000 },
            { description: 'Formation et accompagnement équipe commerciale (2 sessions)', quantity: 1, unitPrice: 300000 },
          ]),
        },
      });
    }
  }

  console.log('✅ Prospects, CallLogs, Appointments, and Quotes created.');

  // Create notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: commercial1.id,
        title: 'Nouveau prospect attribué',
        message: 'Madagascar Construction BTP S.A. vous a été attribué par Andry Rabe.',
        type: 'PROSPECT',
      },
      {
        userId: commercial1.id,
        title: 'Rendez-vous demain',
        message: 'RDV Démonstration Produit avec Cabinet d\'Avocat Razafindrakoto prévu demain à 10:00.',
        type: 'APPOINTMENT',
      },
      {
        userId: commercial2.id,
        title: 'Nouveau Client Converti ! 🎉',
        message: 'SOCIETE MADA INFORMATIQUE est désormais cliente.',
        type: 'CLIENT',
      },
    ],
  });

  console.log('✅ Notifications seeded successfully.');
  console.log('🚀 Seeding finished!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
