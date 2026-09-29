import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { DEFAULT_PDF_RESOURCES } from "@/data/guidebook.data";
import { PdfResourceItem } from "@/types/guidebook.types";

export const dynamic = "force-dynamic";

function mapDbToPdf(p: any): PdfResourceItem {
  return {
    id: p.id,
    title: { ru: p.titleRu, kg: p.titleKg, en: p.titleEn },
    description: { ru: p.descRu, kg: p.descKg, en: p.descEn },
    badge: { ru: p.badgeRu, kg: p.badgeKg, en: p.badgeEn },
    fileUrl: p.fileUrl,
    fileSize: p.fileSize || "",
  };
}

export async function GET() {
  try {
    if (!prisma?.pdfResource) {
      return NextResponse.json({
        success: true,
        data: DEFAULT_PDF_RESOURCES,
      });
    }

    const list = await prisma.pdfResource.findMany({
      orderBy: { orderIndex: "asc" },
    });

    if (list.length === 0) {
      return NextResponse.json({
        success: true,
        data: DEFAULT_PDF_RESOURCES,
      });
    }

    return NextResponse.json({
      success: true,
      data: list.map(mapDbToPdf),
    });
  } catch (error: any) {
    console.error("GET /api/pdf-resources error:", error);
    return NextResponse.json({
      success: true,
      data: DEFAULT_PDF_RESOURCES,
    });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const item: PdfResourceItem = await req.json();

    if (!prisma?.pdfResource) {
      return NextResponse.json({
        success: true,
        data: item,
      });
    }

    const saved = await prisma.pdfResource.upsert({
      where: { id: item.id },
      update: {
        titleRu: item.title.ru,
        titleKg: item.title.kg,
        titleEn: item.title.en,
        descRu: item.description.ru,
        descKg: item.description.kg,
        descEn: item.description.en,
        badgeRu: item.badge.ru,
        badgeKg: item.badge.kg,
        badgeEn: item.badge.en,
        fileUrl: item.fileUrl,
        fileSize: item.fileSize || "",
      },
      create: {
        id: item.id,
        titleRu: item.title.ru,
        titleKg: item.title.kg,
        titleEn: item.title.en,
        descRu: item.description.ru,
        descKg: item.description.kg,
        descEn: item.description.en,
        badgeRu: item.badge.ru,
        badgeKg: item.badge.kg,
        badgeEn: item.badge.en,
        fileUrl: item.fileUrl,
        fileSize: item.fileSize || "",
      },
    });

    return NextResponse.json({
      success: true,
      data: mapDbToPdf(saved),
    });
  } catch (error: any) {
    console.error("PUT /api/pdf-resources error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to save PDF in DB" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (id && prisma?.pdfResource) {
      await prisma.pdfResource.deleteMany({
        where: { id },
      });
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE /api/pdf-resources error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
