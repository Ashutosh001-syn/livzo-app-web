import { z } from "zod";

export const emailField = z
  .string()
  .trim()
  .toLowerCase()
  .max(254, "Enter a valid email address.")
  .email("Enter a valid email address.");

export const handleField = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^[a-z0-9_]{3,30}$/, "Use 3-30 letters, numbers, or underscores.");

export const passwordField = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .max(128, "Password must be 128 characters or fewer.")
  .regex(/[a-z]/, "Password must include a lowercase letter.")
  .regex(/[A-Z]/, "Password must include an uppercase letter.")
  .regex(/[0-9]/, "Password must include a number.")
  .regex(/[^A-Za-z0-9\s]/, "Password must include a special character.")
  .refine((value) => !/\s/.test(value), "Password cannot contain whitespace.");

export const tokenField = z.string().trim().min(1, "Token is required.").max(512, "Token is invalid.");