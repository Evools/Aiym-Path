import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { assertAdmin } from "@/lib/auth/assert-admin";

export const dynamic = "force-dynamic";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await assertAdmin(req);
  if (!auth.authenticated) {
    return auth.response;
  }

  try {
    const { id } = await params;
    await prisma.region.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Region deleted" });
  } catch (error: any) {
    console.error("DELETE /api/regions/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete region" },
      { status: 500 }
    );
  }
}
