import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { RouteItem } from "@/types/route.types";

export const dynamic = "force-dynamic";

function mapDbRouteToItem(r: any): RouteItem {
  return {
    id: r.id,
    region: r.regionId,
    title: {
      ru: r.titleRu,
      kg: r.titleKg,
      en: r.titleEn,
    },
    description: {
      ru: r.descRu,
      kg: r.descKg,
      en: r.descEn,
    },
    difficulty: r.difficulty as any,
    distanceKm: r.distanceKm,
    durationHours: r.durationHours,
    hasFemaleGuide: r.hasFemaleGuide,
    elevationGainMeters: r.elevationGainMeters,
    centerCoordinates: [r.centerLat, r.centerLng],
    coordinates: Array.isArray(r.coordinates) ? r.coordinates : [],
    imageUrl: r.imageUrl || undefined,
    assignedGuides: Array.isArray(r.assignedGuides) ? r.assignedGuides : undefined,
    pois: r.pois?.map((p: any) => ({
      id: p.id,
      name: {
        ru: p.nameRu,
        kg: p.nameKg,
        en: p.nameEn,
      },
      type: p.type,
      lat: p.lat,
      lng: p.lng,
      altitudeMeters: p.altitudeMeters ?? undefined,
      description: {
        ru: p.descRu ?? undefined,
        kg: p.descKg ?? undefined,
        en: p.descEn ?? undefined,
      },
    })),
  };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const region = searchParams.get("region");

    const whereClause: any = {};
    if (region && region !== "all") {
      whereClause.regionId = region;
    }

    const routes = await prisma.route.findMany({
      where: whereClause,
      include: { pois: true },
      orderBy: { createdAt: "desc" },
    });

    const formatted = routes.map(mapDbRouteToItem);
    return NextResponse.json({ success: true, data: formatted });
  } catch (error: any) {
    console.error("GET /api/routes error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch routes" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const route: RouteItem = body;

    const id = route.id || `route-${Date.now()}`;

    const created = await prisma.route.create({
      data: {
        id,
        regionId: route.region || "ala-archa",
        titleRu: route.title.ru,
        titleKg: route.title.kg,
        titleEn: route.title.en,
        descRu: route.description.ru,
        descKg: route.description.kg,
        descEn: route.description.en,
        difficulty: route.difficulty || "easy",
        distanceKm: Number(route.distanceKm) || 0,
        durationHours: Number(route.durationHours) || 0,
        hasFemaleGuide: Boolean(route.hasFemaleGuide),
        elevationGainMeters: Number(route.elevationGainMeters) || 0,
        centerLat: route.centerCoordinates ? route.centerCoordinates[0] : 42.56,
        centerLng: route.centerCoordinates ? route.centerCoordinates[1] : 74.48,
        coordinates: route.coordinates || [],
        imageUrl: route.imageUrl || null,
        assignedGuides: (route.assignedGuides || []) as any,
        pois: route.pois
          ? {
              create: route.pois.map((p) => ({
                id: p.id || `poi-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                nameRu: p.name.ru,
                nameKg: p.name.kg,
                nameEn: p.name.en,
                type: p.type || "viewpoint",
                lat: p.lat,
                lng: p.lng,
                altitudeMeters: p.altitudeMeters ?? null,
                descRu: p.description?.ru ?? null,
                descKg: p.description?.kg ?? null,
                descEn: p.description?.en ?? null,
              })),
            }
          : undefined,
      },
      include: { pois: true },
    });

    return NextResponse.json({ success: true, data: mapDbRouteToItem(created) });
  } catch (error: any) {
    console.error("POST /api/routes error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create route" },
      { status: 500 }
    );
  }
}
