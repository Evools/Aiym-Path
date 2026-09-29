import { NextRequest, NextResponse } from "next/server";
import { getAdminTokenFromRequest, verifyAdminToken } from "@/lib/auth/jwt";

export interface AuthCheckResult {
  authorized: boolean;
  authenticated: boolean;
  userId?: string;
  email?: string;
  role?: string;
  errorResponse?: NextResponse;
  response?: NextResponse;
}

export function assertAdmin(req: NextRequest): AuthCheckResult {
  const token = getAdminTokenFromRequest(req);

  if (!token) {
    const errorResponse = NextResponse.json(
      {
        success: false,
        error: "Доступ запрещен: требуется авторизация администратора",
      },
      { status: 401 }
    );
    return {
      authorized: false,
      authenticated: false,
      errorResponse,
      response: errorResponse,
    };
  }

  const payload = verifyAdminToken(token);

  if (!payload) {
    const errorResponse = NextResponse.json(
      {
        success: false,
        error: "Срок действия сессии администратора истек. Пожалуйста, выполните вход заново.",
      },
      { status: 401 }
    );
    return {
      authorized: false,
      authenticated: false,
      errorResponse,
      response: errorResponse,
    };
  }

  return {
    authorized: true,
    authenticated: true,
    userId: payload.userId,
    email: payload.email,
    role: payload.role,
  };
}
