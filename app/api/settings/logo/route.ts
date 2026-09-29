import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { DEFAULT_SITE_LOGO, SiteLogoData } from "@/types/settings.types";

export const dynamic = "force-dynamic";

function mapDbToLogo(s: any): SiteLogoData {
  return {
    type: (s.logoType as any) || "text",
    text: {
      ru: s.logoTextRu || DEFAULT_SITE_LOGO.text.ru,
      kg: s.logoTextKg || DEFAULT_SITE_LOGO.text.kg,
      en: s.logoTextEn || DEFAULT_SITE_LOGO.text.en,
    },
    subtext: {
      ru: s.logoSubRu || DEFAULT_SITE_LOGO.subtext.ru,
      kg: s.logoSubKg || DEFAULT_SITE_LOGO.subtext.kg,
      en: s.logoSubEn || DEFAULT_SITE_LOGO.subtext.en,
    },
    imageUrl: s.logoImageUrl || "",
    imageHeight: s.logoHeight || 36,
    showSubtext: s.showSubtext !== false,
  };
}

export async function GET() {
  try {
    if (!prisma?.siteSettings) {
      return NextResponse.json({
        success: true,
        data: DEFAULT_SITE_LOGO,
      });
    }

    const settings = await prisma.siteSettings.findUnique({
      where: { id: "main" },
    });

    if (!settings) {
      return NextResponse.json({
        success: true,
        data: DEFAULT_SITE_LOGO,
      });
    }

    return NextResponse.json({
      success: true,
      data: mapDbToLogo(settings),
    });
  } catch (error: any) {
    console.error("GET /api/settings/logo error:", error);
    return NextResponse.json({
      success: true,
      data: DEFAULT_SITE_LOGO,
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
    const body: SiteLogoData = await req.json();

    if (!prisma?.siteSettings) {
      return NextResponse.json({
        success: true,
        data: body,
      });
    }

    const data = {
      logoType: body.type || "text",
      logoTextRu: body.text?.ru || DEFAULT_SITE_LOGO.text.ru,
      logoTextKg: body.text?.kg || DEFAULT_SITE_LOGO.text.kg,
      logoTextEn: body.text?.en || DEFAULT_SITE_LOGO.text.en,
      logoSubRu: body.subtext?.ru || DEFAULT_SITE_LOGO.subtext.ru,
      logoSubKg: body.subtext?.kg || DEFAULT_SITE_LOGO.subtext.kg,
      logoSubEn: body.subtext?.en || DEFAULT_SITE_LOGO.subtext.en,
      logoImageUrl: body.imageUrl?.trim() || "",
      logoHeight: Number(body.imageHeight) || 36,
      showSubtext: body.showSubtext ?? true,
    };

    const saved = await prisma.siteSettings.upsert({
      where: { id: "main" },
      update: data,
      create: {
        id: "main",
        ...data,
      },
    });

    return NextResponse.json({
      success: true,
      data: mapDbToLogo(saved),
    });
  } catch (error: any) {
    console.error("PUT /api/settings/logo error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update logo in DB" },
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
    if (prisma?.siteSettings) {
      await prisma.siteSettings.deleteMany({
        where: { id: "main" },
      });
    }
    return NextResponse.json({
      success: true,
      data: DEFAULT_SITE_LOGO,
    });
  } catch (error: any) {
    console.error("POST (reset) /api/settings/logo error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to reset logo" },
      { status: 500 }
    );
  }
}
