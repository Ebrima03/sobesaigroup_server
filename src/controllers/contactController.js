// src/controllers/contactController.js
import { resend }            from '../config/mailer.js';
import { sanitizeContact }   from '../utils/sanitize.js';
import { buildContactEmail } from '../utils/buildEmail.js';
import { asyncHandler }      from '../middleware/errorHandler.js';

export const submitContact = asyncHandler(async (req, res) => {
  const clean = sanitizeContact(req.validatedBody);
  const mail  = buildContactEmail(clean);

  const { error } = await resend.emails.send({
    from   : mail.from,
    to     : mail.to,
    replyTo: mail.replyTo,
    subject: mail.subject,
    text   : mail.text,
    html   : mail.html,
  });

  if (error) {
    throw Object.assign(new Error(error.message ?? 'Failed to send email'), {
      status: 502,
    });
  }

  return res.status(200).json({
    success: true,
    message: "Message received! We'll get back to you within 24 hours.",
  });
});