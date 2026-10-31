import { z } from 'zod';

/**
 * Task Four Step 6 & 7: Server Boundary Validation Schemas
 * Strictly validates, trims, and normalizes all incoming authentication payloads.
 */

// 1. Account Activation Schema (Registration)
// Parent registers with Phone, Email, Student ID, Paper Slip Code, sets 4-digit PIN, and accepts Terms
export const activateSchema = z.object({
  phone: z
    .string()
    .trim()
    .min(1, 'Phone number cannot be left blank.')
    .regex(/^\d+$/, 'Phone number must contain digits only.')
    .refine((val) => val.length >= 10 && val.length <= 11, {
      message: 'Phone number must be 10 or 11 digits.',
    }),
  email: z
    .string()
    .trim()
    .min(1, 'Email address cannot be left blank.')
    .toLowerCase() // Step 5: Email case normalization
    .email('Please enter a valid email address.'),
  studentId: z
    .string()
    .trim()
    .min(1, 'Student ID cannot be left blank.')
    .toUpperCase()
    .min(4, 'Student ID must be at least 4 characters.'),
  slipCode: z
    .string()
    .trim()
    .min(1, 'Slip activation code cannot be left blank.')
    .regex(/^\d{6}$/, 'Slip code must be exactly 6 digits.'),
  pin: z
    .string()
    .trim() // Step 5: Passwords trimmed of whitespace, never lowercased
    .min(1, 'Security PIN cannot be left blank.')
    .regex(/^\d{4}$/, 'PIN must be exactly 4 digits.'),
  acceptTerms: z.literal(true, {
    message: 'You must accept the terms to activate your account.',
  }),
});

// 2. Sign In Schema
// Accepts either a 10-11 digit phone number OR a valid guardian email address
export const loginSchema = z
  .object({
    phone: z.string().optional(),
    identifier: z.string().optional(),
    email: z.string().optional(),
    pin: z
      .string()
      .trim() // Step 5: Passwords trimmed of whitespace, never lowercased
      .min(1, 'Security PIN cannot be left blank.')
      .regex(/^\d{4}$/, 'PIN must be exactly 4 digits.'),
  })
  .superRefine((data, ctx) => {
    const raw = (data.identifier ?? data.phone ?? data.email ?? '').trim();
    if (!raw) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Phone number or email address cannot be left blank.',
        path: [data.identifier ? 'identifier' : 'phone'],
      });
      return;
    }

    if (raw.includes('@')) {
      // Email format validation (Category 3: Asymmetric format rule)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(raw)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please enter a valid email address (e.g. parent@example.com).',
          path: [data.identifier ? 'identifier' : 'phone'],
        });
      }
    } else {
      // Phone format validation (Category 2: 10 or 11 digits numeric)
      if (!/^\d+$/.test(raw)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Must be a valid 10-11 digit phone number or email address.',
          path: [data.identifier ? 'identifier' : 'phone'],
        });
      } else if (raw.length < 10 || raw.length > 11) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Phone number must be 10 or 11 digits.',
          path: [data.identifier ? 'identifier' : 'phone'],
        });
      }
    }
  })
  .transform((data) => {
    const raw = (data.identifier ?? data.phone ?? data.email ?? '').trim();
    const isEmail = raw.includes('@');
    const normalized = isEmail ? raw.toLowerCase() : raw;
    return {
      identifier: normalized,
      phone: normalized, // backwards-compatible alias
      isEmail,
      pin: data.pin,
    };
  });

// 3. PIN Reset Schema (Guardian email only)
export const resetSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email address cannot be left blank.')
    .toLowerCase()
    .email('Please enter a valid email address.'),
});

// 4. PIN Reset Confirmation Schema (Step 5: Password Reset Kills Everything)
export const confirmResetSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email address cannot be left blank.')
    .toLowerCase()
    .email('Please enter a valid email address.'),
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, 'Verification code must be exactly 6 digits.'),
  newPin: z
    .string()
    .trim()
    .regex(/^\d{4}$/, 'New PIN must be exactly 4 digits.'),
});

export type ActivateInput = z.infer<typeof activateSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ResetInput = z.infer<typeof resetSchema>;
export type ConfirmResetInput = z.infer<typeof confirmResetSchema>;
