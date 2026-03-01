// src/utils/sanitize.js
// Strips all HTML tags and attributes from user input to prevent XSS.
// Called AFTER Zod validation so we work with already-typed clean strings.

import sanitizeHtml from 'sanitize-html';

/**
 * Strips every HTML tag from a string.
 * sanitize-html with allowedTags: [] removes everything — including
 * <script>, <img onerror=...>, SVG payloads, etc.
 */
const strip = (value) =>
  sanitizeHtml(value, {
    allowedTags: [],       // no tags allowed at all
    allowedAttributes: {}, // no attributes allowed
    disallowedTagsMode: 'discard',
  });

/**
 * Sanitizes every string field in the contact payload.
 * Returns a new object — never mutates the original.
 *
 * @param {{ fullName: string, email: string, phone: string, inquiryType: string, message: string }} data
 * @returns same shape, all strings sanitized
 */
export const sanitizeContact = (data) => ({
  fullName   : strip(data.fullName),
  email      : strip(data.email),
  phone      : strip(data.phone),
  inquiryType: strip(data.inquiryType),
  message    : strip(data.message),
});