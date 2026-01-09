// lib/security/rate-limiter.ts
import { NextRequest } from 'next/server';

interface RateLimit {
  count: number;
  resetTime: number;
}

// Simple in-memory rate limiter (use Redis in production)
const rateLimitStore = new Map<string, RateLimit>();

export function rateLimit(request: NextRequest, maxRequests = 100, windowMs = 60000) {
  const clientId = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'anonymous';
  const now = Date.now();
  const windowStart = now - windowMs;

  // Clean expired entries
  for (const [key, limit] of rateLimitStore.entries()) {
    if (limit.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }

  const current = rateLimitStore.get(clientId) || { count: 0, resetTime: now + windowMs };

  // Reset if window expired
  if (current.resetTime < now) {
    current.count = 1;
    current.resetTime = now + windowMs;
  } else {
    current.count++;
  }

  rateLimitStore.set(clientId, current);

  return {
    allowed: current.count <= maxRequests,
    remaining: Math.max(0, maxRequests - current.count),
    resetTime: current.resetTime
  };
}