import rateLimit from 'express-rate-limit'
import { env } from '../config/env'

/**
 * General API rate limiter
 */
export const apiLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  message: {
    error: 'Too many requests. Please try again later.',
    retryAfter: Math.ceil(env.RATE_LIMIT_WINDOW_MS / 1000),
  },
  standardHeaders: true,
  legacyHeaders: false,
})

/**
 * Stricter rate limiter for AI endpoints
 * Respects Gemini free tier: 15 RPM
 */
export const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 per minute per user (leave buffer for free tier)
  message: {
    error: 'AI rate limit reached. Please wait a moment before trying again.',
  },
  keyGenerator: (req) => req.userId || req.ip || 'unknown',
  standardHeaders: true,
  legacyHeaders: false,
})
