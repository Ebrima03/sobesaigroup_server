import { z } from 'zod';

// Reject any string that looks like an email header injection attempt
const NO_HEADER_INJECTION_REGEX = /[\r\n]/;

const INQUIRY_TYPES = [
  'Buy a Property',
  'Sell a Property',
  'Rent a Property',
  'General Inquiry',
];

export const contactSchema = z.object({
  fullName: z
    .string({ required_error: 'Full name is required' })
    .trim()
    .min(3, 'Full name must be at least 3 characters')
    .max(80, 'Full name is too long')
    .refine(
      (val) => !NO_HEADER_INJECTION_REGEX.test(val),
      'Invalid characters in name',
    ),

  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .email('Please enter a valid email address')
    .max(254, 'Email address is too long')
    .refine(
      (val) => !NO_HEADER_INJECTION_REGEX.test(val),
      'Invalid characters in email',
    ),

  phone: z
    .string({ required_error: 'Phone number is required' })
    .trim()
    .regex(
      /^(\+220|00220)?[\s-]?[2-9]\d{2}[\s-]?\d{4}$/,
      'Please enter a valid Gambian number (e.g. 375 5522 or +220 375 5522)',
    ),

  inquiryType: z
    .string({ required_error: 'Inquiry type is required' })
    .refine(
      (val) => INQUIRY_TYPES.includes(val),
      `Inquiry type must be one of: ${INQUIRY_TYPES.join(', ')}`,
    ),

  message: z
    .string({ required_error: 'Message is required' })
    .trim()
    .min(15, 'Message must be at least 15 characters')
    .max(2000, 'Message is too long (max 2000 characters)'),
});
