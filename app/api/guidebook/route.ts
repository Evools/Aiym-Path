import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { GuidebookItem } from "@/types/guidebook.types";

export const dynamic = "force-dynamic";

function mapDbGuidebookToItem(g: any): GuidebookItem {
  return {
    id: g.id,
    audience: g.audience as any,
    category: g.category as any,
    iconName: g.iconName as any,
    title: {
      ru: g.titleRu,
      kg: g.titleKg,
      en: g.titleEn,
    },
    shortDescription: {
      ru: g.shortDescRu,
      kg: g.shortDescKg,
      en: g.shortDescEn,
    },
    details: {
      ru: g.detailsRu || [],
      kg: g.detailsKg || [],
      en: g.detailsEn || [],
    },
    badgeText:
      g.badgeTextRu || g.badgeTextKg || g.badgeTextEn
        ? {
            ru: g.badgeTextRu || "",
            kg: g.badgeTextKg || "",
            en: g.badgeTextEn || "",
          }
        : undefined,
    actionType: g.actionType as any,
  };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const audience = searchParams.get("audience");
    const category = searchParams.get("category");

    const whereClause: any = {};
    if (audience) whereClause.audience = audience;
    if (category) whereClause.category = category;

    const items = await prisma.guidebookItem.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: items.map(mapDbGuidebookToItem),
    });
  } catch (error: any) {
    console.error("GET /api/guidebook error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch guidebook items" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: GuidebookItem = await req.json();
    const id = body.id || `gb-${Date.now()}`;

    const created = await prisma.guidebookItem.create({
      data: {
        id,
        audience: body.audience || "travelers",
        category: body.category || "safety",
        iconName: body.iconName || "ShieldCheck",
        titleRu: body.title.ru,
        titleKg: body.title.kg,
        titleEn: body.title.en,
        shortDescRu: body.shortDescription.ru,
        shortDescKg: body.shortDescription.kg,
        shortDescEn: body.shortDescription.en,
        detailsRu: body.details.ru || [],
        detailsKg: body.details.kg || [],
        detailsEn: body.details.en || [],
        badgeTextRu: body.badgeText?.ru || null,
        badgeTextKg: body.badgeText?.kg || null,
        badgeTextEn: body.badgeText?.en || null,
        actionType: body.actionType || null,
      },
    });

    return NextResponse.json({
      success: true,
      data: mapDbGuidebookToItem(created),
    });
  } catch (error: any) {
    console.error("POST /api/guidebook error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create guidebook item" },
      { status: 500 }
    );
  }
}
