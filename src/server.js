// src/server.js

import { env } from './config/env.js';
import app from './app.js';
import { verifyMailer } from './config/mailer.js';

const server = app.listen(env.PORT, async () => {
  const baseUrl =
    env.NODE_ENV === 'production'
      ? env.BASE_URL
      : `http://localhost:${env.PORT}`;

  console.log(`\n🚀 Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
  console.log(`Health: ${baseUrl}/health\n`);

  // verify email connection (non-blocking)
  await verifyMailer();
});

// ── Graceful shutdown ─────────────────────────
const shutdown = (signal) => {
  console.log(`\n${signal} received — shutting down gracefully…`);

  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// ── Safety nets ───────────────────────────────
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Promise Rejection:', reason);
  if (env.NODE_ENV === 'production') process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});