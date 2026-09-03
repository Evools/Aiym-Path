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

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const item = await prisma.guidebookItem.findUnique({
      where: { id },
    });

    if (!item) {
      return NextResponse.json(
        { success: false, error: "Guidebook item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: mapDbGuidebookToItem(item),
    });
  } catch (error: any) {
    console.error("GET /api/guidebook/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch guidebook item" },
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
    const body: GuidebookItem = await req.json();

    const updated = await prisma.guidebookItem.upsert({
      where: { id },
      update: {
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
      create: {
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
      data: mapDbGuidebookToItem(updated),
    });
  } catch (error: any) {
    console.error("PUT /api/guidebook/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update guidebook item" },
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
    await prisma.guidebookItem.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Guidebook item deleted" });
  } catch (error: any) {
    console.error("DELETE /api/guidebook/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete guidebook item" },
      { status: 500 }
    );
  }
}
