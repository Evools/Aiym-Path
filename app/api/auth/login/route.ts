import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { signAdminToken, attachSessionCookie } from "@/lib/auth/jwt";
import {
  getClientIp,
  checkLoginRateLimit,
  recordFailedLoginAttempt,
  recordSuccessfulLogin,
} from "@/lib/security/rate-limiter";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req);
    const body = await req.json();
    const cleanEmail = (body.email || "").trim().toLowerCase();
    const cleanPass = (body.password || "").trim();

    if (!cleanEmail || !cleanPass) {
      return NextResponse.json(
        { success: false, error: "Укажите электронную почту и пароль" },
        { status: 400 }
      );
    }

    const rateKey = `${clientIp}_${cleanEmail}`;
    const rateCheck = checkLoginRateLimit(rateKey);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Слишком много неудачных попыток входа. Повторите попытку через ${rateCheck.retryAfterSeconds} сек.`,
        },
        { status: 429, headers: { "Retry-After": String(rateCheck.retryAfterSeconds || 60) } }
      );
    }

    const prisma = getPrisma();

    // Query user from PostgreSQL database
    const user = await prisma.adminUser.findUnique({
      where: { email: cleanEmail },
    });

    if (!user) {
      recordFailedLoginAttempt(rateKey);
      return NextResponse.json(
        { success: false, error: "Пользователь с такой почтой не найден" },
        { status: 401 }
      );
    }

    const isMatch = verifyPassword(cleanPass, user.password);
    if (!isMatch) {
      recordFailedLoginAttempt(rateKey);
      return NextResponse.json(
        { success: false, error: "Неверный пароль" },
        { status: 401 }
      );
    }

    // Success: clear rate limiter
    recordSuccessfulLogin(rateKey);

    // Sign secure JWT token
    const token = signAdminToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || "/images/guides/guide-2.jpg",
      },
    });

    // Attach HttpOnly cookie
    attachSessionCookie(response, token);

    return response;
  } catch (error: any) {
    console.error("POST /api/auth/login error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Ошибка сервера при авторизации" },
      { status: 500 }
    );
  }
}
