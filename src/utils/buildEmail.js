// src/utils/buildEmail.js
// Constructs the Nodemailer mail options from sanitized contact data.
// Sends a beautifully formatted email to ebrimamanka03@gmail.com
// with all client information clearly laid out.

import { env } from '../config/env.js';

/** Removes CR/LF characters to prevent email header injection. */
const safeHeader = (str) => String(str).replace(/[\r\n]+/g, ' ').trim();

/** Escapes HTML special characters for safe rendering in email body. */
const escapeHtml = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\n/g, '<br>');

export const buildContactEmail = (data) => {
  const { fullName, email, phone, inquiryType, message } = data;

  const safeName    = safeHeader(fullName);
  const safeEmail   = safeHeader(email);
  const safePhone   = safeHeader(phone);
  const safeInquiry = safeHeader(inquiryType);

  const submittedAt = new Date().toLocaleString('en-GB', {
    timeZone : 'Africa/Banjul',
    dateStyle: 'full',
    timeStyle: 'short',
  });

  const text = [
    `NEW CONTACT FORM SUBMISSION — SOBESAI GROUP`,
    `═══════════════════════════════════════════`,
    ``,
    `Name         : ${safeName}`,
    `Email        : ${safeEmail}`,
    `Phone        : ${safePhone}`,
    `Inquiry Type : ${safeInquiry}`,
    `Submitted    : ${submittedAt} (Gambia Time)`,
    ``,
    `MESSAGE`,
    `───────`,
    message,
    ``,
    `Reply directly to this email to contact the client.`,
  ].join('\n');

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 16px;">
<tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;">

  <!-- Header -->
  <tr><td style="background:linear-gradient(135deg,#d97706 0%,#f59e0b 100%);border-radius:12px 12px 0 0;padding:28px 32px;text-align:center;">
    <h1 style="margin:0;color:#fff;font-size:1.4rem;font-weight:800;">📩 New Contact Submission</h1>
    <p style="margin:6px 0 0;color:#fef3c7;font-size:0.85rem;">Sobesai Group — Real Estate</p>
  </td></tr>

  <!-- Body -->
  <tr><td style="background:#fff;padding:32px;border-left:1px solid #e5e7eb;border-right:1px solid #e5e7eb;">

    <p style="margin:0 0 24px;color:#374151;font-size:0.9rem;line-height:1.6;">
      A new client submitted the contact form. <strong>Reply directly to this email to reach them.</strong>
    </p>

    <!-- Client Info -->
    <p style="margin:0 0 10px;font-size:0.7rem;font-weight:800;color:#9ca3af;text-transform:uppercase;letter-spacing:0.1em;">Client Information</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;border-radius:8px;overflow:hidden;border:1px solid #e5e7eb;">
      <tr>
        <td style="padding:10px 14px;background:#f9fafb;width:35%;border-bottom:1px solid #e5e7eb;border-right:1px solid #e5e7eb;">
          <p style="margin:0;font-size:0.72rem;font-weight:700;color:#6b7280;text-transform:uppercase;">Full Name</p>
        </td>
        <td style="padding:10px 14px;background:#f9fafb;border-bottom:1px solid #e5e7eb;">
          <p style="margin:0;font-size:0.95rem;font-weight:700;color:#111827;">${escapeHtml(safeName)}</p>
        </td>
      </tr>
      <tr>
        <td style="padding:10px 14px;background:#fff;border-bottom:1px solid #e5e7eb;border-right:1px solid #e5e7eb;">
          <p style="margin:0;font-size:0.72rem;font-weight:700;color:#6b7280;text-transform:uppercase;">Email</p>
        </td>
        <td style="padding:10px 14px;background:#fff;border-bottom:1px solid #e5e7eb;">
          <a href="mailto:${escapeHtml(safeEmail)}" style="color:#d97706;font-weight:600;font-size:0.95rem;text-decoration:none;">${escapeHtml(safeEmail)}</a>
        </td>
      </tr>
      <tr>
        <td style="padding:10px 14px;background:#f9fafb;border-bottom:1px solid #e5e7eb;border-right:1px solid #e5e7eb;">
          <p style="margin:0;font-size:0.72rem;font-weight:700;color:#6b7280;text-transform:uppercase;">Phone</p>
        </td>
        <td style="padding:10px 14px;background:#f9fafb;border-bottom:1px solid #e5e7eb;">
          <a href="tel:${escapeHtml(safePhone.replace(/\s/g,''))}" style="color:#d97706;font-weight:600;font-size:0.95rem;text-decoration:none;">${escapeHtml(safePhone)}</a>
        </td>
      </tr>
      <tr>
        <td style="padding:10px 14px;background:#fff;border-right:1px solid #e5e7eb;">
          <p style="margin:0;font-size:0.72rem;font-weight:700;color:#6b7280;text-transform:uppercase;">Inquiry Type</p>
        </td>
        <td style="padding:10px 14px;background:#fff;">
          <span style="display:inline-block;background:#fef3c7;color:#92400e;font-size:0.8rem;font-weight:700;padding:3px 12px;border-radius:999px;border:1px solid #fcd34d;">${escapeHtml(safeInquiry)}</span>
        </td>
      </tr>
    </table>

    <!-- Message -->
    <p style="margin:0 0 8px;font-size:0.7rem;font-weight:800;color:#9ca3af;text-transform:uppercase;letter-spacing:0.1em;">Client Message</p>
    <div style="background:#fffbeb;border-left:4px solid #f59e0b;border-radius:0 8px 8px 0;padding:16px 18px;margin-bottom:28px;">
      <p style="margin:0;color:#1c1917;font-size:0.925rem;line-height:1.7;">${escapeHtml(message)}</p>
    </div>

    <!-- Action Buttons -->
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td align="center">
        <a href="mailto:${escapeHtml(safeEmail)}?subject=Re: Your Property Inquiry - Sobesai Group"
          style="display:inline-block;background:linear-gradient(135deg,#d97706,#f59e0b);color:#fff;font-weight:700;font-size:0.875rem;padding:12px 24px;border-radius:8px;text-decoration:none;margin:0 6px;">
          ✉️ Reply to Client
        </a>
        <a href="tel:${escapeHtml(safePhone.replace(/\s/g,''))}"
          style="display:inline-block;background:#fff;color:#d97706;font-weight:700;font-size:0.875rem;padding:11px 24px;border-radius:8px;text-decoration:none;border:2px solid #f59e0b;margin:0 6px;">
          📞 Call Client
        </a>
      </td></tr>
    </table>

  </td></tr>

  <!-- Footer -->
  <tr><td style="background:#f9fafb;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;padding:16px 32px;text-align:center;">
    <p style="margin:0;font-size:0.75rem;color:#9ca3af;">Submitted on <strong style="color:#6b7280;">${submittedAt}</strong> (Gambia Time)</p>
    <p style="margin:4px 0 0;font-size:0.72rem;color:#d1d5db;">Sent automatically by the Sobesai Group website contact form.</p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;

  return {
    from   : `"Sobesai Group Website" <${env.GMAIL_USER}>`,
    to     : env.CONTACT_RECEIVER_EMAIL,
    replyTo: `"${safeName}" <${safeEmail}>`,
    subject: `[New Lead] ${safeInquiry} – ${safeName}`,
    text,
    html,
  };
};