import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { EQUIPMENT_CHECKLIST } from "@/data/guidebook.data";
import { ChecklistItem } from "@/types/guidebook.types";

export const dynamic = "force-dynamic";

function mapDbToChecklist(c: any): ChecklistItem {
  return {
    id: c.id,
    category: c.category as any,
    label: { ru: c.labelRu, kg: c.labelKg, en: c.labelEn },
    note: { ru: c.noteRu || "", kg: c.noteKg || "", en: c.noteEn || "" },
    isEssential: c.isEssential ?? false,
  };
}

export async function GET() {
  try {
    if (!prisma?.equipmentChecklistItem) {
      return NextResponse.json({
        success: true,
        data: EQUIPMENT_CHECKLIST,
      });
    }

    const list = await prisma.equipmentChecklistItem.findMany({
      orderBy: { orderIndex: "asc" },
    });

    if (list.length === 0) {
      return NextResponse.json({
        success: true,
        data: EQUIPMENT_CHECKLIST,
      });
    }

    return NextResponse.json({
      success: true,
      data: list.map(mapDbToChecklist),
    });
  } catch (error: any) {
    console.error("GET /api/checklist error:", error);
    return NextResponse.json({
      success: true,
      data: EQUIPMENT_CHECKLIST,
    });
  }
}

import { assertAdmin } from "@/lib/auth/assert-admin";

export async function PUT(req: NextRequest) {
  const auth = assertAdmin(req);
  if (!auth.authorized) {
    return auth.errorResponse!;
  }

  try {
    const item: ChecklistItem = await req.json();

    if (!prisma?.equipmentChecklistItem) {
      return NextResponse.json({
        success: true,
        data: item,
      });
    }

    const saved = await prisma.equipmentChecklistItem.upsert({
      where: { id: item.id },
      update: {
        labelRu: item.label.ru,
        labelKg: item.label.kg,
        labelEn: item.label.en,
        noteRu: item.note?.ru || "",
        noteKg: item.note?.kg || "",
        noteEn: item.note?.en || "",
        category: item.category,
        isEssential: item.isEssential || false,
      },
      create: {
        id: item.id,
        labelRu: item.label.ru,
        labelKg: item.label.kg,
        labelEn: item.label.en,
        noteRu: item.note?.ru || "",
        noteKg: item.note?.kg || "",
        noteEn: item.note?.en || "",
        category: item.category,
        isEssential: item.isEssential || false,
      },
    });

    return NextResponse.json({
      success: true,
      data: mapDbToChecklist(saved),
    });
  } catch (error: any) {
    console.error("PUT /api/checklist error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to save checklist item in DB" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const auth = assertAdmin(req);
  if (!auth.authorized) {
    return auth.errorResponse!;
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (id && prisma?.equipmentChecklistItem) {
      await prisma.equipmentChecklistItem.deleteMany({
        where: { id },
      });
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE /api/checklist error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
