// src/middleware/rateLimiter.js
// IP-based rate limiting for the contact route.
// Configured via .env so limits can be tuned without code changes.

import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';

export const contactRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS, // default: 15 minutes
  max     : env.RATE_LIMIT_MAX,       // default: 10 requests per window

  // Use the standardized RateLimit headers (RFC 6585 draft)
  standardHeaders: 'draft-7',
  legacyHeaders  : false,

  // Skip rate limiting in test environments
  skip: () => env.NODE_ENV === 'test',

  handler: (_req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many requests. Please wait a few minutes and try again.',
    });
  },
});