// src/app.js
// Express application factory.

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

import { env } from './config/env.js';
import contactRouter from './routes/contact.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

/* ────────────────────────────────────────────────────────────────
   TRUST PROXY (⭐ FIXES RENDER + express-rate-limit ERROR)
   Render sits behind a proxy and sends X-Forwarded-For headers.
──────────────────────────────────────────────────────────────── */

if (env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

/* ────────────────────────────────────────────────────────────────
   SECURITY HEADERS
──────────────────────────────────────────────────────────────── */

app.use(helmet());

/* ────────────────────────────────────────────────────────────────
   RATE LIMITING (GLOBAL)
──────────────────────────────────────────────────────────────── */

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                  // max requests per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Please try again later.',
  },
});

app.use(limiter);

/* ────────────────────────────────────────────────────────────────
   CORS
──────────────────────────────────────────────────────────────── */

app.use(
  cors({
    origin: (origin, callback) => {
      // allow server-to-server or curl/postman
      if (!origin) return callback(null, true);

      if (env.ALLOWED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }

      callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    methods: ['POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
    optionsSuccessStatus: 204,
  }),
);

/* ────────────────────────────────────────────────────────────────
   BODY PARSING
──────────────────────────────────────────────────────────────── */

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: false, limit: '16kb' }));

/* ────────────────────────────────────────────────────────────────
   HEALTH CHECK
──────────────────────────────────────────────────────────────── */

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

/* ────────────────────────────────────────────────────────────────
   ROUTES
──────────────────────────────────────────────────────────────── */

app.use('/api/contact', contactRouter);

/* ────────────────────────────────────────────────────────────────
   404 HANDLER
──────────────────────────────────────────────────────────────── */

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

/* ────────────────────────────────────────────────────────────────
   ERROR HANDLER (MUST BE LAST)
──────────────────────────────────────────────────────────────── */

app.use(errorHandler);

export default app;