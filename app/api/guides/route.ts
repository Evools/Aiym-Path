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
    email: g.email || undefined,
    whatsapp: g.whatsapp || undefined,
    telegram: g.telegram || undefined,
    instagram: g.instagram || undefined,
    priceRange: g.priceRange || undefined,
    experienceYears: g.experienceYears,
    languages: g.languages || [],
    locations: g.locations || [],
    specialties: g.specialties || [],
    groupSize: g.groupSize || "1–8 человек",
    skills: {
      firstAid: Boolean(g.skillsFirstAid),
      mountaineer: Boolean(g.skillsMountaineer),
      mountainGuide: Boolean(g.skillsMountainGuide),
    },
    badges: (g.badges as any) || [],
    isFemale: Boolean(g.isFemale),
    isVerified: Boolean(g.isVerified),
    rating: g.rating ?? 5.0,
    routesCount: g.routesCount ?? 0,
    reviewsCount: g.reviewsCount ?? 12,
    bio: g.bioRu ? { ru: g.bioRu, kg: g.bioKg || g.bioRu, en: g.bioEn || g.bioRu } : undefined,
  };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const isFemale = searchParams.get("isFemale");

    const whereClause: any = {};
    if (category) whereClause.category = category;
    if (isFemale !== null && isFemale !== undefined) whereClause.isFemale = isFemale === "true";

    const guides = await prisma.guide.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: guides.map(mapDbGuideToItem) });
  } catch (error: any) {
    console.error("GET /api/guides error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch guides" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: AdminGuideItem = await req.json();
    const id = body.id || `guide-${Date.now()}`;

    const created = await prisma.guide.create({
      data: {
        id,
        name: body.name,
        category: body.category || "guide",
        roleRu: body.role.ru,
        roleKg: body.role.kg || body.role.ru,
        roleEn: body.role.en || body.role.ru,
        image: body.image || "/images/guides/guide-2.jpg",
        phone: body.phone,
        email: body.email || null,
        whatsapp: body.whatsapp || null,
        telegram: body.telegram || null,
        instagram: body.instagram || null,
        priceRange: body.priceRange || null,
        experienceYears: Number(body.experienceYears) || 1,
        languages: body.languages || [],
        locations: body.locations || [],
        specialties: body.specialties || [],
        groupSize: body.groupSize || "1–8 человек",
        skillsFirstAid: Boolean(body.skills?.firstAid),
        skillsMountaineer: Boolean(body.skills?.mountaineer),
        skillsMountainGuide: Boolean(body.skills?.mountainGuide),
        badges: (body.badges as any) || [],
        isFemale: Boolean(body.isFemale),
        isVerified: Boolean(body.isVerified),
        rating: typeof body.rating === "number" ? body.rating : 5.0,
        routesCount: typeof body.routesCount === "number" ? body.routesCount : 0,
        reviewsCount: typeof body.reviewsCount === "number" ? body.reviewsCount : 12,
        bioRu: body.bio?.ru || null,
        bioKg: body.bio?.kg || null,
        bioEn: body.bio?.en || null,
      },
    });

    return NextResponse.json({ success: true, data: mapDbGuideToItem(created) });
  } catch (error: any) {
    console.error("POST /api/guides error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create guide" },
      { status: 500 }
    );
  }
}
