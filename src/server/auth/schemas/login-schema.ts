import { z } from "zod";

import { emailField } from "./fields";

export const loginSchema = z
  .object({
    email: emailField,
    password: z.string().min(1, "Password is required.").max(128, "Password is invalid."),
    rememberMe: z.boolean().default(false),
  })
  .strict();

export type LoginInput = z.infer<typeof loginSchema>;