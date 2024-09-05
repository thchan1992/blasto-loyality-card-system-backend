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
