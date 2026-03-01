// src/controllers/contactController.js
// Handles the POST /api/contact request.
// By this point the request body has already been:
//   1. Validated by Zod (via validate middleware) → available as req.validatedBody
//   2. Sanitized (strip HTML) inside this controller before email construction

import { transporter }    from '../config/mailer.js';
import { sanitizeContact } from '../utils/sanitize.js';
import { buildContactEmail } from '../utils/buildEmail.js';
import { asyncHandler }    from '../middleware/errorHandler.js';

/**
 * POST /api/contact
 * Sends the contact form email and returns a success response.
 *
 * HTTP status codes used:
 *   200 — email sent successfully
 *   422 — validation failed (handled upstream by validate middleware)
 *   429 — rate limit exceeded (handled upstream by rateLimiter)
 *   500 — unexpected server / SMTP error (handled by errorHandler)
 */
export const submitContact = asyncHandler(async (req, res) => {
  // Step 1: Sanitize validated input (strip any residual HTML/XSS)
  const clean = sanitizeContact(req.validatedBody);

  // Step 2: Build the email (also applies header-injection guards)
  const mailOptions = buildContactEmail(clean);

  // Step 3: Send — Nodemailer throws on SMTP failure, caught by asyncHandler
  await transporter.sendMail(mailOptions);

  // Step 4: Respond
  return res.status(200).json({
    success: true,
    message: "Message received! We'll get back to you within 24 hours.",
  });
});