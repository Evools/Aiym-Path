import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { DEFAULT_HERO_BANNER, HeroBannerData } from "@/types/banner.types";

export const dynamic = "force-dynamic";

function mapDbBannerToItem(b: any): HeroBannerData {
  return {
    badge: {
      ru: b.badgeRu,
      kg: b.badgeKg,
      en: b.badgeEn,
    },
    titlePrefix: {
      ru: b.titlePrefixRu,
      kg: b.titlePrefixKg,
      en: b.titlePrefixEn,
    },
    titleLine2: {
      ru: b.titleLine2Ru,
      kg: b.titleLine2Kg,
      en: b.titleLine2En,
    },
    titleLine3: {
      ru: b.titleLine3Ru,
      kg: b.titleLine3Kg,
      en: b.titleLine3En,
    },
    subtitle: {
      ru: b.subtitleRu,
      kg: b.subtitleKg,
      en: b.subtitleEn,
    },
    ctaMap: {
      ru: b.ctaMapRu,
      kg: b.ctaMapKg,
      en: b.ctaMapEn,
    },
    ctaGuides: {
      ru: b.ctaGuidesRu,
      kg: b.ctaGuidesKg,
      en: b.ctaGuidesEn,
    },
    backgroundImage: b.backgroundImage,
    ornamentImage: b.ornamentImage,
    girlImage: b.girlImage,
  };
}

export async function GET() {
  try {
    if (!prisma?.heroBanner) {
      return NextResponse.json({
        success: true,
        data: DEFAULT_HERO_BANNER,
      });
    }

    const banner = await prisma.heroBanner.findUnique({
      where: { id: "main" },
    });

    if (!banner) {
      return NextResponse.json({
        success: true,
        data: DEFAULT_HERO_BANNER,
      });
    }

    return NextResponse.json({
      success: true,
      data: mapDbBannerToItem(banner),
    });
  } catch (error: any) {
    console.error("GET /api/banner error:", error);
    return NextResponse.json({
      success: true,
      data: DEFAULT_HERO_BANNER,
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
    const body: HeroBannerData = await req.json();

    if (!prisma?.heroBanner) {
      return NextResponse.json({
        success: true,
        data: body,
      });
    }

    const bannerData = {
      badgeRu: body.badge?.ru ?? DEFAULT_HERO_BANNER.badge?.ru ?? "",
      badgeKg: body.badge?.kg ?? DEFAULT_HERO_BANNER.badge?.kg ?? "",
      badgeEn: body.badge?.en ?? DEFAULT_HERO_BANNER.badge?.en ?? "",
      titlePrefixRu: body.titlePrefix?.ru || DEFAULT_HERO_BANNER.titlePrefix.ru,
      titlePrefixKg: body.titlePrefix?.kg || DEFAULT_HERO_BANNER.titlePrefix.kg,
      titlePrefixEn: body.titlePrefix?.en || DEFAULT_HERO_BANNER.titlePrefix.en,
      titleLine2Ru: body.titleLine2?.ru || DEFAULT_HERO_BANNER.titleLine2.ru,
      titleLine2Kg: body.titleLine2?.kg || DEFAULT_HERO_BANNER.titleLine2.kg,
      titleLine2En: body.titleLine2?.en || DEFAULT_HERO_BANNER.titleLine2.en,
      titleLine3Ru: body.titleLine3?.ru || DEFAULT_HERO_BANNER.titleLine3.ru,
      titleLine3Kg: body.titleLine3?.kg || DEFAULT_HERO_BANNER.titleLine3.kg,
      titleLine3En: body.titleLine3?.en || DEFAULT_HERO_BANNER.titleLine3.en,
      subtitleRu: body.subtitle?.ru || DEFAULT_HERO_BANNER.subtitle.ru,
      subtitleKg: body.subtitle?.kg || DEFAULT_HERO_BANNER.subtitle.kg,
      subtitleEn: body.subtitle?.en || DEFAULT_HERO_BANNER.subtitle.en,
      ctaMapRu: body.ctaMap?.ru || DEFAULT_HERO_BANNER.ctaMap.ru,
      ctaMapKg: body.ctaMap?.kg || DEFAULT_HERO_BANNER.ctaMap.kg,
      ctaMapEn: body.ctaMap?.en || DEFAULT_HERO_BANNER.ctaMap.en,
      ctaGuidesRu: body.ctaGuides?.ru || DEFAULT_HERO_BANNER.ctaGuides.ru,
      ctaGuidesKg: body.ctaGuides?.kg || DEFAULT_HERO_BANNER.ctaGuides.kg,
      ctaGuidesEn: body.ctaGuides?.en || DEFAULT_HERO_BANNER.ctaGuides.en,
      backgroundImage: body.backgroundImage?.trim() || DEFAULT_HERO_BANNER.backgroundImage,
      ornamentImage: body.ornamentImage?.trim() || DEFAULT_HERO_BANNER.ornamentImage,
      girlImage: body.girlImage?.trim() || DEFAULT_HERO_BANNER.girlImage,
    };

    const saved = await prisma.heroBanner.upsert({
      where: { id: "main" },
      update: bannerData,
      create: {
        id: "main",
        ...bannerData,
      },
    });

    return NextResponse.json({
      success: true,
      data: mapDbBannerToItem(saved),
    });
  } catch (error: any) {
    console.error("PUT /api/banner error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update banner in DB" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const auth = assertAdmin(req);
  if (!auth.authorized) {
    return auth.errorResponse!;
  }

  try {
    if (prisma?.heroBanner) {
      await prisma.heroBanner.deleteMany({
        where: { id: "main" },
      });
    }
    return NextResponse.json({
      success: true,
      data: DEFAULT_HERO_BANNER,
    });
  } catch (error: any) {
    console.error("POST (reset) /api/banner error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to reset banner" },
      { status: 500 }
    );
  }
}
