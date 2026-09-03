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

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const location = await prisma.location.findUnique({
      where: { id },
    });

    if (!location) {
      return NextResponse.json(
        { success: false, error: "Location not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: mapDbLocationToItem(location),
    });
  } catch (error: any) {
    console.error("GET /api/locations/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch location" },
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
    const body: AdminLocationItem = await req.json();

    const updated = await prisma.location.upsert({
      where: { id },
      update: {
        titleRu: body.title.ru,
        titleKg: body.title.kg,
        titleEn: body.title.en,
        descRu: body.description.ru,
        descKg: body.description.kg,
        descEn: body.description.en,
        type: body.type || "hotel",
        image: body.image,
        lat: body.coordinates ? body.coordinates[0] : 42.56,
        lng: body.coordinates ? body.coordinates[1] : 74.48,
        phone: body.phone || null,
        amenities: body.amenities || [],
      },
      create: {
        id,
        titleRu: body.title.ru,
        titleKg: body.title.kg,
        titleEn: body.title.en,
        descRu: body.description.ru,
        descKg: body.description.kg,
        descEn: body.description.en,
        type: body.type || "hotel",
        image: body.image,
        lat: body.coordinates ? body.coordinates[0] : 42.56,
        lng: body.coordinates ? body.coordinates[1] : 74.48,
        phone: body.phone || null,
        amenities: body.amenities || [],
      },
    });

    return NextResponse.json({
      success: true,
      data: mapDbLocationToItem(updated),
    });
  } catch (error: any) {
    console.error("PUT /api/locations/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update location" },
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
    await prisma.location.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Location deleted" });
  } catch (error: any) {
    console.error("DELETE /api/locations/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete location" },
      { status: 500 }
    );
  }
}
