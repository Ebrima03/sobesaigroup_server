// src/routes/contact.js
// Mounts all middleware specific to the /api/contact endpoint.

import { Router }            from 'express';
import { contactRateLimiter } from '../middleware/rateLimiter.js';
import { validate }           from '../middleware/validate.js';
import { contactSchema }      from '../validation/contactSchema.js';
import { submitContact }      from '../controllers/contactController.js';

const router = Router();

// POST /api/contact
// Pipeline: rate limit → body validation → sanitize + send email
router.post(
  '/',
  contactRateLimiter,   // 1. Reject spam IPs early
  validate(contactSchema), // 2. Validate & parse body with Zod
  submitContact,           // 3. Sanitize, build email, send
);

export default router;