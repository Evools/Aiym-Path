import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ROUTES_DATA } from "@/data/routes.data";
import { GUIDEBOOK_ITEMS } from "@/data/guidebook.data";
import { INITIAL_LOCATIONS } from "@/data/locations.data";
import {
  DEFAULT_GUIDES,
  DEFAULT_LOCATIONS,
  DEFAULT_REGIONS,
  DEFAULT_CONTACTS,
} from "@/lib/services/admin-storage.service";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    // Delete existing records
    await prisma.routePOI.deleteMany({});
    await prisma.route.deleteMany({});
    await prisma.guide.deleteMany({});
    await prisma.location.deleteMany({});
    await prisma.region.deleteMany({});
    await prisma.guidebookItem.deleteMany({});
    await prisma.projectContact.deleteMany({});
    await prisma.adminUser.deleteMany({});

    // 1. Seed Regions
    for (const reg of DEFAULT_REGIONS) {
      await prisma.region.create({
        data: {
          id: reg.id,
          labelRu: reg.label.ru,
          labelKg: reg.label.kg,
          labelEn: reg.label.en,
        },
      });
    }

    // 2. Seed Guides
    for (const guide of DEFAULT_GUIDES) {
      await prisma.guide.create({
        data: {
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

    // 3. Seed Locations
    for (const loc of INITIAL_LOCATIONS) {
      await prisma.location.create({
        data: {
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
      await prisma.location.create({
        data: {
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
    for (const route of ROUTES_DATA) {
      await prisma.route.create({
        data: {
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
          pois: route.pois
            ? {
                create: route.pois.map((p) => ({
                  id: p.id,
                  nameRu: p.name.ru,
                  nameKg: p.name.kg,
                  nameEn: p.name.en,
                  type: p.type,
                  lat: p.lat,
                  lng: p.lng,
                  altitudeMeters: p.altitudeMeters,
                  descRu: p.description?.ru,
                  descKg: p.description?.kg,
                  descEn: p.description?.en,
                })),
              }
            : undefined,
        },
      });
    }

    // 5. Seed Guidebook Items
    for (const item of GUIDEBOOK_ITEMS) {
      await prisma.guidebookItem.create({
        data: {
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
    await prisma.projectContact.create({
      data: {
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
    const { hashPassword } = await import("@/lib/auth/password");
    await prisma.adminUser.create({
      data: {
        id: "admin-main",
        name: "Айым Администратор",
        email: "admin@aiympath.kg",
        password: hashPassword("admin"),
        role: "Главный администратор",
        avatar: "/images/guides/guide-2.jpg",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Database reset to defaults successfully",
    });
  } catch (error: any) {
    console.error("POST /api/reset error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to reset database" },
      { status: 500 }
    );
  }
}
