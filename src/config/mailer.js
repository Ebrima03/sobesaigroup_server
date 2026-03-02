// src/config/mailer.js
import { Resend } from 'resend';
import { env } from './env.js';

export const resend = new Resend(env.RESEND_API_KEY);

export const verifyMailer = async () => {
  if (!env.RESEND_API_KEY) {
    console.warn('⚠️  RESEND_API_KEY is not set — emails will fail');
    return;
  }
  console.log('✅  Resend email client ready');
};