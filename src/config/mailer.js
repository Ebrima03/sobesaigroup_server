// src/config/mailer.js
// Creates and exports a singleton Nodemailer transporter.
// Uses Gmail with an App Password — never your real Gmail password.

import nodemailer from 'nodemailer';
import { env } from './env.js';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: env.GMAIL_USER,
    pass: env.GMAIL_APP_PASSWORD,
  },
});

/**
 * Verifies the SMTP connection at startup.
 * Logs a warning instead of crashing so the server still boots
 * (you may want to make this fatal in production).
 */
export const verifyMailer = async () => {
  try {
    await transporter.verify();
    console.log('✅  Nodemailer SMTP connection verified');
  } catch (err) {
    console.error('⚠️  Nodemailer SMTP verification failed:', err.message);
  }
};