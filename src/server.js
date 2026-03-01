// src/server.js
// Entry point — validates env, verifies SMTP, then starts the HTTP server.

import { env }         from './config/env.js';   // validates .env first
import app             from './app.js';
import { verifyMailer } from './config/mailer.js';

const server = app.listen(env.PORT, async () => {
  console.log(`\n🚀  Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
  console.log(`   Health: http://localhost:${env.PORT}/health\n`);

  await verifyMailer();
});

// ── Graceful shutdown ─────────────────────────────────────────────────────────
const shutdown = (signal) => {
  console.log(`\n${signal} received — shutting down gracefully…`);
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));

// ── Safety nets ───────────────────────────────────────────────────────────────
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Promise Rejection:', reason);
  // In production you may want to exit here and let the process manager restart
  if (env.NODE_ENV === 'production') process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});