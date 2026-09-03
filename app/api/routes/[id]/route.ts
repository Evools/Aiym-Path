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

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const route = await prisma.route.findUnique({
      where: { id },
      include: { pois: true },
    });

    if (!route) {
      return NextResponse.json(
        { success: false, error: "Route not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: mapDbRouteToItem(route) });
  } catch (error: any) {
    console.error("GET /api/routes/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch route" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: RouteItem = await req.json();

    // Delete old POIs if updating
    await prisma.routePOI.deleteMany({
      where: { routeId: id },
    });

    const updated = await prisma.route.upsert({
      where: { id },
      update: {
        regionId: body.region || "ala-archa",
        titleRu: body.title.ru,
        titleKg: body.title.kg,
        titleEn: body.title.en,
        descRu: body.description.ru,
        descKg: body.description.kg,
        descEn: body.description.en,
        difficulty: body.difficulty || "easy",
        distanceKm: Number(body.distanceKm) || 0,
        durationHours: Number(body.durationHours) || 0,
        hasFemaleGuide: Boolean(body.hasFemaleGuide),
        elevationGainMeters: Number(body.elevationGainMeters) || 0,
        centerLat: body.centerCoordinates ? body.centerCoordinates[0] : 42.56,
        centerLng: body.centerCoordinates ? body.centerCoordinates[1] : 74.48,
        coordinates: body.coordinates || [],
        imageUrl: body.imageUrl || null,
        assignedGuides: (body.assignedGuides || []) as any,
        pois: body.pois
          ? {
              create: body.pois.map((p) => ({
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
      create: {
        id,
        regionId: body.region || "ala-archa",
        titleRu: body.title.ru,
        titleKg: body.title.kg,
        titleEn: body.title.en,
        descRu: body.description.ru,
        descKg: body.description.kg,
        descEn: body.description.en,
        difficulty: body.difficulty || "easy",
        distanceKm: Number(body.distanceKm) || 0,
        durationHours: Number(body.durationHours) || 0,
        hasFemaleGuide: Boolean(body.hasFemaleGuide),
        elevationGainMeters: Number(body.elevationGainMeters) || 0,
        centerLat: body.centerCoordinates ? body.centerCoordinates[0] : 42.56,
        centerLng: body.centerCoordinates ? body.centerCoordinates[1] : 74.48,
        coordinates: body.coordinates || [],
        imageUrl: body.imageUrl || null,
        assignedGuides: (body.assignedGuides || []) as any,
        pois: body.pois
          ? {
              create: body.pois.map((p) => ({
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

    return NextResponse.json({ success: true, data: mapDbRouteToItem(updated) });
  } catch (error: any) {
    console.error("PUT /api/routes/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update route" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.route.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Route deleted" });
  } catch (error: any) {
    console.error("DELETE /api/routes/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete route" },
      { status: 500 }
    );
  }
}
