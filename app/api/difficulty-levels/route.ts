import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { DIFFICULTY_LEVELS_GUIDE } from "@/data/guidebook.data";
import { DifficultyLevelGuide } from "@/types/guidebook.types";

export const dynamic = "force-dynamic";

function mapDbToDifficulty(d: any): DifficultyLevelGuide {
  return {
    id: d.id as any,
    badge: { ru: d.badgeRu, kg: d.badgeKg, en: d.badgeEn },
    title: { ru: d.titleRu, kg: d.titleKg, en: d.titleEn },
    duration: { ru: d.durationRu, kg: d.durationKg, en: d.durationEn },
    elevation: { ru: d.elevationRu, kg: d.elevationKg, en: d.elevationEn },
    description: { ru: d.descRu, kg: d.descKg, en: d.descEn },
    suitableFor: { ru: d.suitableRu, kg: d.suitableKg, en: d.suitableEn },
    requiredGear: {
      ru: d.requiredGearRu || [],
      kg: d.requiredGearKg || [],
      en: d.requiredGearEn || [],
    },
  };
}

export async function GET() {
  try {
    if (!prisma?.difficultyLevel) {
      return NextResponse.json({
        success: true,
        data: DIFFICULTY_LEVELS_GUIDE,
      });
    }

    const list = await prisma.difficultyLevel.findMany({
      orderBy: { orderIndex: "asc" },
    });

    if (list.length === 0) {
      return NextResponse.json({
        success: true,
        data: DIFFICULTY_LEVELS_GUIDE,
      });
    }

    return NextResponse.json({
      success: true,
      data: list.map(mapDbToDifficulty),
    });
  } catch (error: any) {
    console.error("GET /api/difficulty-levels error:", error);
    return NextResponse.json({
      success: true,
      data: DIFFICULTY_LEVELS_GUIDE,
    });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const item: DifficultyLevelGuide = await req.json();

    if (!prisma?.difficultyLevel) {
      return NextResponse.json({
        success: true,
        data: item,
      });
    }

    const saved = await prisma.difficultyLevel.upsert({
      where: { id: item.id },
      update: {
        badgeRu: item.badge.ru,
        badgeKg: item.badge.kg,
        badgeEn: item.badge.en,
        titleRu: item.title.ru,
        titleKg: item.title.kg,
        titleEn: item.title.en,
        durationRu: item.duration.ru,
        durationKg: item.duration.kg,
        durationEn: item.duration.en,
        elevationRu: item.elevation.ru,
        elevationKg: item.elevation.kg,
        elevationEn: item.elevation.en,
        descRu: item.description.ru,
        descKg: item.description.kg,
        descEn: item.description.en,
        suitableRu: item.suitableFor.ru,
        suitableKg: item.suitableFor.kg,
        suitableEn: item.suitableFor.en,
        requiredGearRu: item.requiredGear?.ru || [],
        requiredGearKg: item.requiredGear?.kg || [],
        requiredGearEn: item.requiredGear?.en || [],
      },
      create: {
        id: item.id,
        badgeRu: item.badge.ru,
        badgeKg: item.badge.kg,
        badgeEn: item.badge.en,
        titleRu: item.title.ru,
        titleKg: item.title.kg,
        titleEn: item.title.en,
        durationRu: item.duration.ru,
        durationKg: item.duration.kg,
        durationEn: item.duration.en,
        elevationRu: item.elevation.ru,
        elevationKg: item.elevation.kg,
        elevationEn: item.elevation.en,
        descRu: item.description.ru,
        descKg: item.description.kg,
        descEn: item.description.en,
        suitableRu: item.suitableFor.ru,
        suitableKg: item.suitableFor.kg,
        suitableEn: item.suitableFor.en,
        requiredGearRu: item.requiredGear?.ru || [],
        requiredGearKg: item.requiredGear?.kg || [],
        requiredGearEn: item.requiredGear?.en || [],
      },
    });

    return NextResponse.json({
      success: true,
      data: mapDbToDifficulty(saved),
    });
  } catch (error: any) {
    console.error("PUT /api/difficulty-levels error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to save difficulty level in DB" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (id && prisma?.difficultyLevel) {
      await prisma.difficultyLevel.deleteMany({
        where: { id },
      });
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE /api/difficulty-levels error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
