// src/app.js
// Express application factory.
// Keeping app creation separate from server.listen() makes the app
// easy to test without binding to a real port.

import express   from 'express';
import helmet    from 'helmet';
import cors      from 'cors';
import { env }   from './config/env.js';
import contactRouter from './routes/contact.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// ── Security headers (helmet) ─────────────────────────────────────────────────
// Sets ~15 HTTP headers: Content-Security-Policy, X-Frame-Options, etc.
app.use(helmet());

// ── CORS ──────────────────────────────────────────────────────────────────────
// Only accept requests from the listed frontend origins.
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. server-to-server, curl in dev)
      // only in non-production environments
      if (!origin && env.NODE_ENV !== 'production') {
        return callback(null, true);
      }

      if (env.ALLOWED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }

      callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    methods : ['POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
    optionsSuccessStatus: 204,
  }),
);

// ── Body parsing ──────────────────────────────────────────────────────────────
// Limit body size to 16 KB — more than enough for a contact form.
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: false, limit: '16kb' }));

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.status(200).json({ status: 'ok' }));

// ── API routes ────────────────────────────────────────────────────────────────
app.use('/api/contact', contactRouter);

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ── Centralized error handler (must be last) ──────────────────────────────────
app.use(errorHandler);

export default app;