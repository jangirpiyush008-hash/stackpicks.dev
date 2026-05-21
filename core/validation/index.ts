/**
 * Zod schemas — single source of truth for input validation.
 * Used by both client forms and server routes.
 */
import { z } from 'zod';

export const indianPhoneSchema = z
  .string()
  .regex(/^(\+91)?[6-9]\d{9}$/, 'Enter a valid Indian phone (+91 prefix optional)');

export const pincodeSchema = z.string().regex(/^[1-9]\d{5}$/, 'Enter a valid 6-digit pincode');

export const emailSchema = z.string().email('Enter a valid email');

export const gstinSchema = z
  .string()
  .regex(
    /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
    'Enter a valid 15-character GSTIN'
  )
  .optional()
  .or(z.literal(''));

export const newsletterSignupSchema = z.object({
  email: emailSchema,
  source: z.string().max(50).optional(),
});

export const sponsorSignupSchema = z.object({
  company_name: z.string().min(2).max(100),
  contact_email: emailSchema,
  contact_phone: indianPhoneSchema.optional(),
  website: z.string().url().optional().or(z.literal('')),
  gstin: gstinSchema,
});

export const sponsoredSlotRequestSchema = z.object({
  placement: z.enum(['category_top', 'homepage_featured', 'newsletter']),
  category_id: z.string().uuid().optional(),
  repo_id: z.string().uuid().optional(),
  external_name: z.string().max(100).optional(),
  external_url: z.string().url().optional(),
  external_logo: z.string().url().optional(),
  months: z.number().int().min(1).max(12).default(1),
});

export const jobPostSchema = z.object({
  company_name: z.string().min(2).max(100),
  company_logo: z.string().url().optional().or(z.literal('')),
  title: z.string().min(5).max(200),
  description: z.string().min(50).max(5000),
  apply_url: z.string().url(),
  location: z.string().max(100).optional(),
  job_type: z.enum(['full_time', 'part_time', 'contract', 'freelance']),
  remote: z.enum(['onsite', 'hybrid', 'remote', 'remote_india']),
  salary_min_inr: z.number().int().positive().optional(),
  salary_max_inr: z.number().int().positive().optional(),
  required_tags: z.array(z.string().max(30)).max(10).default([]),
});

export type NewsletterSignup = z.infer<typeof newsletterSignupSchema>;
export type SponsorSignup = z.infer<typeof sponsorSignupSchema>;
export type SponsoredSlotRequest = z.infer<typeof sponsoredSlotRequestSchema>;
export type JobPost = z.infer<typeof jobPostSchema>;
