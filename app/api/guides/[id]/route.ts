import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { AdminGuideItem } from "@/lib/services/admin-storage.service";

export const dynamic = "force-dynamic";

function mapDbGuideToItem(g: any): AdminGuideItem {
  return {
    id: g.id,
    name: g.name,
    category: g.category as "guide" | "agency",
    role: {
      ru: g.roleRu,
      kg: g.roleKg,
      en: g.roleEn,
    },
    image: g.image,
    phone: g.phone,
    experienceYears: g.experienceYears,
    languages: g.languages || [],
    locations: g.locations || [],
    groupSize: g.groupSize || "1–8 человек",
    skills: {
      firstAid: Boolean(g.skillsFirstAid),
      mountaineer: Boolean(g.skillsMountaineer),
      mountainGuide: Boolean(g.skillsMountainGuide),
    },
    isFemale: Boolean(g.isFemale),
    isVerified: Boolean(g.isVerified),
  };
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const guide = await prisma.guide.findUnique({
      where: { id },
    });

    if (!guide) {
      return NextResponse.json(
        { success: false, error: "Guide not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: mapDbGuideToItem(guide) });
  } catch (error: any) {
    console.error("GET /api/guides/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch guide" },
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
    const body: AdminGuideItem = await req.json();

    const updated = await prisma.guide.upsert({
      where: { id },
      update: {
        name: body.name,
        category: body.category || "guide",
        roleRu: body.role.ru,
        roleKg: body.role.kg,
        roleEn: body.role.en,
        image: body.image,
        phone: body.phone,
        experienceYears: Number(body.experienceYears) || 1,
        languages: body.languages || [],
        locations: body.locations || [],
        groupSize: body.groupSize || "1–8 человек",
        skillsFirstAid: Boolean(body.skills?.firstAid),
        skillsMountaineer: Boolean(body.skills?.mountaineer),
        skillsMountainGuide: Boolean(body.skills?.mountainGuide),
        isFemale: Boolean(body.isFemale),
        isVerified: Boolean(body.isVerified),
      },
      create: {
        id,
        name: body.name,
        category: body.category || "guide",
        roleRu: body.role.ru,
        roleKg: body.role.kg,
        roleEn: body.role.en,
        image: body.image || "/images/guides/guide-2.jpg",
        phone: body.phone,
        experienceYears: Number(body.experienceYears) || 1,
        languages: body.languages || [],
        locations: body.locations || [],
        groupSize: body.groupSize || "1–8 человек",
        skillsFirstAid: Boolean(body.skills?.firstAid),
        skillsMountaineer: Boolean(body.skills?.mountaineer),
        skillsMountainGuide: Boolean(body.skills?.mountainGuide),
        isFemale: Boolean(body.isFemale),
        isVerified: Boolean(body.isVerified),
      },
    });

    return NextResponse.json({ success: true, data: mapDbGuideToItem(updated) });
  } catch (error: any) {
    console.error("PUT /api/guides/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update guide" },
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
    await prisma.guide.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Guide deleted" });
  } catch (error: any) {
    console.error("DELETE /api/guides/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete guide" },
      { status: 500 }
    );
  }
}
