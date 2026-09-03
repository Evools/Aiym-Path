import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { AdminLocationItem } from "@/lib/services/admin-storage.service";

export const dynamic = "force-dynamic";

function mapDbLocationToItem(l: any): AdminLocationItem {
  return {
    id: l.id,
    title: {
      ru: l.titleRu,
      kg: l.titleKg,
      en: l.titleEn,
    },
    description: {
      ru: l.descRu,
      kg: l.descKg,
      en: l.descEn,
    },
    type: l.type as any,
    image: l.image,
    coordinates: [l.lat, l.lng],
    phone: l.phone ?? undefined,
    amenities: l.amenities || [],
  };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    const whereClause: any = {};
    if (type) whereClause.type = type;

    const locations = await prisma.location.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: locations.map(mapDbLocationToItem),
    });
  } catch (error: any) {
    console.error("GET /api/locations error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch locations" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: AdminLocationItem = await req.json();
    const id = body.id || `loc-${Date.now()}`;

    const created = await prisma.location.create({
      data: {
        id,
        titleRu: body.title.ru,
        titleKg: body.title.kg,
        titleEn: body.title.en,
        descRu: body.description.ru,
        descKg: body.description.kg,
        descEn: body.description.en,
        type: body.type || "hotel",
        image: body.image || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
        lat: body.coordinates ? body.coordinates[0] : 42.56,
        lng: body.coordinates ? body.coordinates[1] : 74.48,
        phone: body.phone || null,
        amenities: body.amenities || [],
      },
    });

    return NextResponse.json({
      success: true,
      data: mapDbLocationToItem(created),
    });
  } catch (error: any) {
    console.error("POST /api/locations error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create location" },
      { status: 500 }
    );
  }
}
