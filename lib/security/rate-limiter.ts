import { NextRequest } from "next/server";

interface RateLimitRecord {
  count: number;
  firstAttemptTime: number;
  lockedUntil?: number;
}

const loginAttemptsStore = new Map<string, RateLimitRecord>();
const generalRateStore = new Map<string, RateLimitRecord>();

// Cleanup stale records periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of loginAttemptsStore.entries()) {
    if (record.lockedUntil && record.lockedUntil < now && now - record.firstAttemptTime > 1000 * 60 * 30) {
      loginAttemptsStore.delete(key);
    }
  }
  for (const [key, record] of generalRateStore.entries()) {
    if (now - record.firstAttemptTime > 1000 * 60 * 5) {
      generalRateStore.delete(key);
    }
  }
}, 1000 * 60 * 5);

export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  return "127.0.0.1";
}

/**
 * Rate limiter for login / auth attempts.
 * Max 5 failed attempts within 10 minutes, triggers a 15-minute cooldown.
 */
export function checkLoginRateLimit(identifier: string): {
  allowed: boolean;
  remainingAttempts: number;
  retryAfterSeconds?: number;
} {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000; // 10 minutes
  const maxAttempts = 5;
  const lockoutMs = 15 * 60 * 1000; // 15 minutes lockout

  const record = loginAttemptsStore.get(identifier);

  if (!record) {
    return { allowed: true, remainingAttempts: maxAttempts };
  }

  // Check if currently locked
  if (record.lockedUntil && record.lockedUntil > now) {
    const retryAfter = Math.ceil((record.lockedUntil - now) / 1000);
    return {
      allowed: false,
      remainingAttempts: 0,
      retryAfterSeconds: retryAfter,
    };
  }

  // If window expired, reset
  if (now - record.firstAttemptTime > windowMs) {
    loginAttemptsStore.delete(identifier);
    return { allowed: true, remainingAttempts: maxAttempts };
  }

  if (record.count >= maxAttempts) {
    record.lockedUntil = now + lockoutMs;
    const retryAfter = Math.ceil(lockoutMs / 1000);
    return {
      allowed: false,
      remainingAttempts: 0,
      retryAfterSeconds: retryAfter,
    };
  }

  return {
    allowed: true,
    remainingAttempts: Math.max(0, maxAttempts - record.count),
  };
}

export function recordFailedLoginAttempt(identifier: string): void {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;

  const record = loginAttemptsStore.get(identifier);

  if (!record || now - record.firstAttemptTime > windowMs) {
    loginAttemptsStore.set(identifier, {
      count: 1,
      firstAttemptTime: now,
    });
  } else {
    record.count += 1;
    if (record.count >= 5) {
      record.lockedUntil = now + 15 * 60 * 1000; // 15 min lock
    }
  }
}

export function recordSuccessfulLogin(identifier: string): void {
  loginAttemptsStore.delete(identifier);
}
