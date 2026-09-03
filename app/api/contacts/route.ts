import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { AdminProjectContacts, DEFAULT_CONTACTS } from "@/lib/services/admin-storage.service";

export const dynamic = "force-dynamic";

function mapDbContactToItem(c: any): AdminProjectContacts {
  return {
    email: c.email,
    phone: c.phone,
    address: {
      ru: c.addressRu,
      kg: c.addressKg,
      en: c.addressEn,
    },
    workingHours: {
      ru: c.workingHoursRu,
      kg: c.workingHoursKg,
      en: c.workingHoursEn,
    },
    emergencyContacts: Array.isArray(c.emergencyContacts)
      ? c.emergencyContacts
      : DEFAULT_CONTACTS.emergencyContacts,
  };
}

export async function GET() {
  try {
    const contact = await prisma.projectContact.findUnique({
      where: { id: "main" },
    });

    if (!contact) {
      return NextResponse.json({
        success: true,
        data: DEFAULT_CONTACTS,
      });
    }

    return NextResponse.json({
      success: true,
      data: mapDbContactToItem(contact),
    });
  } catch (error: any) {
    console.error("GET /api/contacts error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch contacts" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body: AdminProjectContacts = await req.json();

    const updated = await prisma.projectContact.upsert({
      where: { id: "main" },
      update: {
        email: body.email,
        phone: body.phone,
        addressRu: body.address.ru,
        addressKg: body.address.kg,
        addressEn: body.address.en,
        workingHoursRu: body.workingHours.ru,
        workingHoursKg: body.workingHours.kg,
        workingHoursEn: body.workingHours.en,
        emergencyContacts: (body.emergencyContacts || []) as any,
      },
      create: {
        id: "main",
        email: body.email,
        phone: body.phone,
        addressRu: body.address.ru,
        addressKg: body.address.kg,
        addressEn: body.address.en,
        workingHoursRu: body.workingHours.ru,
        workingHoursKg: body.workingHours.kg,
        workingHoursEn: body.workingHours.en,
        emergencyContacts: (body.emergencyContacts || []) as any,
      },
    });

    return NextResponse.json({
      success: true,
      data: mapDbContactToItem(updated),
    });
  } catch (error: any) {
    console.error("PUT /api/contacts error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update contacts" },
      { status: 500 }
    );
  }
}
