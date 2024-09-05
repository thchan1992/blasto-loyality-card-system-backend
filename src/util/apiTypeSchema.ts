import { z } from "zod";

export const businessUpdateSchema = z.object({
  name: z.string(),
  logo: z.string(),
  loyaltyProgram: z.union([z.literal(5), z.literal(10)]),
  clerkUserId: z.string(),
});

export const formDataSchema = z.object({
  oldFileUrl: z.string().optional(),
});

export const giveStampSchema = z.object({
  customerId: z.string(),
  stampNum: z.literal(1),
});

export const redeemRewardSchema = z.object({ customerId: z.string() });

export const supportEmailSchema = z.object({
  message: z
    .string()
    .min(1, "Message is required")
    .max(500, "Message must be 500 characters or less"),
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or less"),
  email: z
    .string()
    .email("Invalid email address")
    .min(1, "Email is required")
    .max(100, "Email must be 100 characters or less"),
});
