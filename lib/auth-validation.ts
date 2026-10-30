import { z } from 'zod';

/**
 * Task Four Step 6 & 7: Server Boundary Validation Schemas
 * Strictly validates, trims, and normalizes all incoming authentication payloads.
 */

// 1. Account Activation Schema (Registration)
export const activateSchema = z.object({
  phone: z
    .string({ required_error: 'Phone number cannot be left blank.' })
    .trim()
    .regex(/^\d+$/, 'Phone number must contain digits only.')
    .refine((val) => val.length >= 10 && val.length <= 11, {
      message: 'Phone number must be 10 or 11 digits.',
    }),
  email: z
    .string({ required_error: 'Email address cannot be left blank.' })
    .trim()
    .toLowerCase() // Step 5: Email case normalization
    .email('Please enter a valid email address.'),
  studentId: z
    .string({ required_error: 'Student ID cannot be left blank.' })
    .trim()
    .toUpperCase()
    .min(4, 'Student ID must be at least 4 characters.'),
  slipCode: z
    .string({ required_error: 'Slip activation code cannot be left blank.' })
    .trim()
    .regex(/^\d{6}$/, 'Slip code must be exactly 6 digits.'),
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the terms to activate your account.' }),
  }),
});

// 2. Sign In Schema
export const loginSchema = z.object({
  phone: z
    .string({ required_error: 'Phone number cannot be left blank.' })
    .trim()
    .regex(/^\d+$/, 'Phone number must contain numbers only.')
    .refine((val) => val.length >= 10 && val.length <= 11, {
      message: 'Phone number must be 10 or 11 digits.',
    }),
  pin: z
    .string({ required_error: 'Security PIN cannot be left blank.' })
    .trim() // Step 5: Passwords trimmed of whitespace, never lowercased
    .regex(/^\d{4}$/, 'PIN must be exactly 4 digits.'),
});

// 3. PIN Reset Schema
export const resetSchema = z.object({
  phone: z
    .string({ required_error: 'Phone number cannot be left blank.' })
    .trim()
    .regex(/^\d+$/, 'Phone number must contain numbers only.')
    .refine((val) => val.length >= 10 && val.length <= 11, {
      message: 'Phone number must be 10 or 11 digits.',
    }),
  email: z
    .string({ required_error: 'Email address cannot be left blank.' })
    .trim()
    .toLowerCase()
    .email('Please enter a valid email address.'),
});

export type ActivateInput = z.infer<typeof activateSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ResetInput = z.infer<typeof resetSchema>;

