import { PrismaClient } from "@prisma/client";
import { ROUTES_DATA } from "../data/routes.data";
import { GUIDEBOOK_ITEMS } from "../data/guidebook.data";
import { INITIAL_LOCATIONS } from "../data/locations.data";
import {
  DEFAULT_GUIDES,
  DEFAULT_LOCATIONS,
  DEFAULT_REGIONS,
  DEFAULT_CONTACTS,
} from "../lib/services/admin-storage.service";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // 1. Seed Regions
  console.log("Seeding Regions...");
  for (const reg of DEFAULT_REGIONS) {
    await prisma.region.upsert({
      where: { id: reg.id },
      update: {
        labelRu: reg.label.ru,
        labelKg: reg.label.kg,
        labelEn: reg.label.en,
      },
      create: {
        id: reg.id,
        labelRu: reg.label.ru,
        labelKg: reg.label.kg,
        labelEn: reg.label.en,
      },
    });
  }

  // 2. Seed Guides
  console.log("Seeding Guides...");
  for (const guide of DEFAULT_GUIDES) {
    await prisma.guide.upsert({
      where: { id: guide.id },
      update: {
        name: guide.name,
        category: guide.category,
        roleRu: guide.role.ru,
        roleKg: guide.role.kg,
        roleEn: guide.role.en,
        image: guide.image,
        phone: guide.phone,
        experienceYears: guide.experienceYears,
        languages: guide.languages,
        locations: guide.locations,
        groupSize: guide.groupSize,
        skillsFirstAid: guide.skills.firstAid,
        skillsMountaineer: guide.skills.mountaineer,
        skillsMountainGuide: guide.skills.mountainGuide,
        isFemale: guide.isFemale,
        isVerified: guide.isVerified,
      },
      create: {
        id: guide.id,
        name: guide.name,
        category: guide.category,
        roleRu: guide.role.ru,
        roleKg: guide.role.kg,
        roleEn: guide.role.en,
        image: guide.image,
        phone: guide.phone,
        experienceYears: guide.experienceYears,
        languages: guide.languages,
        locations: guide.locations,
        groupSize: guide.groupSize,
        skillsFirstAid: guide.skills.firstAid,
        skillsMountaineer: guide.skills.mountaineer,
        skillsMountainGuide: guide.skills.mountainGuide,
        isFemale: guide.isFemale,
        isVerified: guide.isVerified,
      },
    });
  }

  // 3. Seed Locations (both from INITIAL_LOCATIONS and DEFAULT_LOCATIONS)
  console.log("Seeding Locations...");
  for (const loc of INITIAL_LOCATIONS) {
    await prisma.location.upsert({
      where: { id: loc.id },
      update: {
        key: loc.key,
        titleRu: loc.title.ru,
        titleKg: loc.title.kg,
        titleEn: loc.title.en,
        descRu: loc.desc.ru,
        descKg: loc.desc.kg,
        descEn: loc.desc.en,
        type: "location",
        image: loc.imageUrl,
        lat: 42.5644,
        lng: 74.4823,
        amenities: [],
        difficulty: loc.difficulty,
        distanceKm: loc.distanceKm,
        elevationGainMeters: loc.elevationGainMeters,
        hasFemaleGuide: loc.hasFemaleGuide,
        hasEmergencyPoints: loc.hasEmergencyPoints,
      },
      create: {
        id: loc.id,
        key: loc.key,
        titleRu: loc.title.ru,
        titleKg: loc.title.kg,
        titleEn: loc.title.en,
        descRu: loc.desc.ru,
        descKg: loc.desc.kg,
        descEn: loc.desc.en,
        type: "location",
        image: loc.imageUrl,
        lat: 42.5644,
        lng: 74.4823,
        amenities: [],
        difficulty: loc.difficulty,
        distanceKm: loc.distanceKm,
        elevationGainMeters: loc.elevationGainMeters,
        hasFemaleGuide: loc.hasFemaleGuide,
        hasEmergencyPoints: loc.hasEmergencyPoints,
      },
    });
  }

  for (const loc of DEFAULT_LOCATIONS) {
    await prisma.location.upsert({
      where: { id: loc.id },
      update: {
        titleRu: loc.title.ru,
        titleKg: loc.title.kg,
        titleEn: loc.title.en,
        descRu: loc.description.ru,
        descKg: loc.description.kg,
        descEn: loc.description.en,
        type: loc.type,
        image: loc.image,
        lat: loc.coordinates[0],
        lng: loc.coordinates[1],
        phone: loc.phone,
        amenities: loc.amenities || [],
      },
      create: {
        id: loc.id,
        titleRu: loc.title.ru,
        titleKg: loc.title.kg,
        titleEn: loc.title.en,
        descRu: loc.description.ru,
        descKg: loc.description.kg,
        descEn: loc.description.en,
        type: loc.type,
        image: loc.image,
        lat: loc.coordinates[0],
        lng: loc.coordinates[1],
        phone: loc.phone,
        amenities: loc.amenities || [],
      },
    });
  }

  // 4. Seed Routes & POIs
  console.log("Seeding Routes & POIs...");
  for (const route of ROUTES_DATA) {
    await prisma.route.upsert({
      where: { id: route.id },
      update: {
        regionId: route.region,
        titleRu: route.title.ru,
        titleKg: route.title.kg,
        titleEn: route.title.en,
        descRu: route.description.ru,
        descKg: route.description.kg,
        descEn: route.description.en,
        difficulty: route.difficulty,
        distanceKm: route.distanceKm,
        durationHours: route.durationHours,
        hasFemaleGuide: route.hasFemaleGuide,
        elevationGainMeters: route.elevationGainMeters,
        centerLat: route.centerCoordinates[0],
        centerLng: route.centerCoordinates[1],
        coordinates: route.coordinates,
        imageUrl: route.imageUrl,
        assignedGuides: route.assignedGuides as object,
      },
      create: {
        id: route.id,
        regionId: route.region,
        titleRu: route.title.ru,
        titleKg: route.title.kg,
        titleEn: route.title.en,
        descRu: route.description.ru,
        descKg: route.description.kg,
        descEn: route.description.en,
        difficulty: route.difficulty,
        distanceKm: route.distanceKm,
        durationHours: route.durationHours,
        hasFemaleGuide: route.hasFemaleGuide,
        elevationGainMeters: route.elevationGainMeters,
        centerLat: route.centerCoordinates[0],
        centerLng: route.centerCoordinates[1],
        coordinates: route.coordinates,
        imageUrl: route.imageUrl,
        assignedGuides: route.assignedGuides as object,
      },
    });

    if (route.pois && route.pois.length > 0) {
      for (const poi of route.pois) {
        await prisma.routePOI.upsert({
          where: { id: poi.id },
          update: {
            routeId: route.id,
            nameRu: poi.name.ru,
            nameKg: poi.name.kg,
            nameEn: poi.name.en,
            type: poi.type,
            lat: poi.lat,
            lng: poi.lng,
            altitudeMeters: poi.altitudeMeters,
            descRu: poi.description?.ru,
            descKg: poi.description?.kg,
            descEn: poi.description?.en,
          },
          create: {
            id: poi.id,
            routeId: route.id,
            nameRu: poi.name.ru,
            nameKg: poi.name.kg,
            nameEn: poi.name.en,
            type: poi.type,
            lat: poi.lat,
            lng: poi.lng,
            altitudeMeters: poi.altitudeMeters,
            descRu: poi.description?.ru,
            descKg: poi.description?.kg,
            descEn: poi.description?.en,
          },
        });
      }
    }
  }

  // 5. Seed Guidebook Items
  console.log("Seeding Guidebook Items...");
  for (const item of GUIDEBOOK_ITEMS) {
    await prisma.guidebookItem.upsert({
      where: { id: item.id },
      update: {
        audience: item.audience,
        category: item.category,
        iconName: item.iconName,
        titleRu: item.title.ru,
        titleKg: item.title.kg,
        titleEn: item.title.en,
        shortDescRu: item.shortDescription.ru,
        shortDescKg: item.shortDescription.kg,
        shortDescEn: item.shortDescription.en,
        detailsRu: item.details.ru,
        detailsKg: item.details.kg,
        detailsEn: item.details.en,
        badgeTextRu: item.badgeText?.ru,
        badgeTextKg: item.badgeText?.kg,
        badgeTextEn: item.badgeText?.en,
        actionType: item.actionType,
      },
      create: {
        id: item.id,
        audience: item.audience,
        category: item.category,
        iconName: item.iconName,
        titleRu: item.title.ru,
        titleKg: item.title.kg,
        titleEn: item.title.en,
        shortDescRu: item.shortDescription.ru,
        shortDescKg: item.shortDescription.kg,
        shortDescEn: item.shortDescription.en,
        detailsRu: item.details.ru,
        detailsKg: item.details.kg,
        detailsEn: item.details.en,
        badgeTextRu: item.badgeText?.ru,
        badgeTextKg: item.badgeText?.kg,
        badgeTextEn: item.badgeText?.en,
        actionType: item.actionType,
      },
    });
  }

  // 6. Seed Project Contacts
  console.log("Seeding Project Contacts...");
  await prisma.projectContact.upsert({
    where: { id: "main" },
    update: {
      email: DEFAULT_CONTACTS.email,
      phone: DEFAULT_CONTACTS.phone,
      addressRu: DEFAULT_CONTACTS.address.ru,
      addressKg: DEFAULT_CONTACTS.address.kg,
      addressEn: DEFAULT_CONTACTS.address.en,
      workingHoursRu: DEFAULT_CONTACTS.workingHours.ru,
      workingHoursKg: DEFAULT_CONTACTS.workingHours.kg,
      workingHoursEn: DEFAULT_CONTACTS.workingHours.en,
      emergencyContacts: DEFAULT_CONTACTS.emergencyContacts as object,
    },
    create: {
      id: "main",
      email: DEFAULT_CONTACTS.email,
      phone: DEFAULT_CONTACTS.phone,
      addressRu: DEFAULT_CONTACTS.address.ru,
      addressKg: DEFAULT_CONTACTS.address.kg,
      addressEn: DEFAULT_CONTACTS.address.en,
      workingHoursRu: DEFAULT_CONTACTS.workingHours.ru,
      workingHoursKg: DEFAULT_CONTACTS.workingHours.kg,
      workingHoursEn: DEFAULT_CONTACTS.workingHours.en,
      emergencyContacts: DEFAULT_CONTACTS.emergencyContacts as object,
    },
  });

  // 7. Seed Admin Users
  console.log("Seeding Admin Users...");
  const { hashPassword } = await import("../lib/auth/password");
  await prisma.adminUser.upsert({
    where: { email: "admin@aiympath.kg" },
    update: {
      name: "Айым Администратор",
      password: hashPassword("admin"),
      role: "Главный администратор",
      avatar: "/images/guides/guide-2.jpg",
    },
    create: {
      id: "admin-main",
      name: "Айым Администратор",
      email: "admin@aiympath.kg",
      password: hashPassword("admin"),
      role: "Главный администратор",
      avatar: "/images/guides/guide-2.jpg",
    },
  });

  console.log("✅ Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
