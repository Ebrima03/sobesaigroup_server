// src/middleware/errorHandler.js
// Centralized error handler — must be registered LAST in Express middleware chain.
// Catches anything passed to next(err) or unhandled throws in async routes.

import { env } from '../config/env.js';

/**
 * @type {import('express').ErrorRequestHandler}
 */
export const errorHandler = (err, req, res, _next) => {
  // Log the full error server-side
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.path} — ${err.stack || err.message}`);

  // Determine status code: respect err.status if set, else 500
  const status = typeof err.status === 'number' ? err.status : 500;

  // In production, never leak internal error details to the client
  const message =
    env.NODE_ENV === 'production' && status === 500
      ? 'An unexpected error occurred. Please try again later.'
      : err.message || 'Internal Server Error';

  res.status(status).json({
    success: false,
    message,
    // Only include stack trace in development
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

/**
 * Wraps an async Express route handler to forward errors to errorHandler.
 * Eliminates try/catch boilerplate in every controller.
 *
 * @param {import('express').RequestHandler} fn
 * @returns {import('express').RequestHandler}
 */
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);