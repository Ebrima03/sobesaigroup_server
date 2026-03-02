// src/config/mailer.js
// Production-safe Nodemailer configuration for Render

import nodemailer from 'nodemailer';
import { env } from './env.js';

/* ────────────────────────────────────────────────────────────────
   TRANSPORTER
   Explicit SMTP config (more reliable than service: 'gmail')
──────────────────────────────────────────────────────────────── */

export const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // required for port 465

  auth: {
    user: env.GMAIL_USER,
    pass: env.GMAIL_APP_PASSWORD,
  },

  // ⭐ Important for cloud providers (Render/Railway/etc.)
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 15000,
});

/* ────────────────────────────────────────────────────────────────
   VERIFY SMTP CONNECTION
──────────────────────────────────────────────────────────────── */

export const verifyMailer = async () => {
  try {
    await transporter.verify();

    console.log('✅ Nodemailer SMTP connection verified');
  } catch (err) {
    console.warn(
      '⚠️ Nodemailer SMTP verification failed:',
      err.message
    );
  }
};