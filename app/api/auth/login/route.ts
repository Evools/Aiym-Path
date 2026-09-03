import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth/password";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const cleanEmail = email?.trim().toLowerCase();
    const cleanPass = password?.trim();

    if (!cleanEmail || !cleanPass) {
      return NextResponse.json(
        { success: false, error: "Укажите электронную почту и пароль" },
        { status: 400 }
      );
    }

    const prisma = getPrisma();

    // Query user from PostgreSQL database
    const user = await prisma.adminUser.findUnique({
      where: { email: cleanEmail },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Пользователь с такой почтой не найден в базе данных" },
        { status: 401 }
      );
    }

    const isMatch = verifyPassword(cleanPass, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: "Неверный пароль" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || "/images/guides/guide-2.jpg",
      },
    });
  } catch (error: any) {
    console.error("POST /api/auth/login error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Ошибка сервера при авторизации" },
      { status: 500 }
    );
  }
}
