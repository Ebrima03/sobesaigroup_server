// src/config/env.js
import dotenv from 'dotenv';
dotenv.config();

const parseAllowedOrigins = () => {
  const origins = process.env.ALLOWED_ORIGINS || 'http://localhost:3000';
  return origins.split(',').map(o => o.trim());
};

export const env = {
  NODE_ENV               : process.env.NODE_ENV || 'development',
  PORT                   : parseInt(process.env.PORT || '5000', 10),
  BASE_URL               : process.env.BASE_URL || '',
  RESEND_API_KEY         : process.env.RESEND_API_KEY,
  CONTACT_RECEIVER_EMAIL : process.env.CONTACT_RECEIVER_EMAIL,
  RESEND_FROM_EMAIL      : process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
  ALLOWED_ORIGINS        : parseAllowedOrigins(),
  RATE_LIMIT_WINDOW_MS   : parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  RATE_LIMIT_MAX         : parseInt(process.env.RATE_LIMIT_MAX || '10', 10),
};