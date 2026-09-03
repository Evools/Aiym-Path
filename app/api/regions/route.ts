import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { AdminRegionItem } from "@/lib/services/admin-storage.service";

export const dynamic = "force-dynamic";

function mapDbRegionToItem(r: any): AdminRegionItem {
  return {
    id: r.id,
    label: {
      ru: r.labelRu,
      kg: r.labelKg,
      en: r.labelEn,
    },
  };
}

export async function GET() {
  try {
    const regions = await prisma.region.findMany({
      orderBy: { id: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: regions.map(mapDbRegionToItem),
    });
  } catch (error: any) {
    console.error("GET /api/regions error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch regions" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: AdminRegionItem = await req.json();

    const created = await prisma.region.upsert({
      where: { id: body.id },
      update: {
        labelRu: body.label.ru,
        labelKg: body.label.kg,
        labelEn: body.label.en,
      },
      create: {
        id: body.id,
        labelRu: body.label.ru,
        labelKg: body.label.kg,
        labelEn: body.label.en,
      },
    });

    return NextResponse.json({
      success: true,
      data: mapDbRegionToItem(created),
    });
  } catch (error: any) {
    console.error("POST /api/regions error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create region" },
      { status: 500 }
    );
  }
}
