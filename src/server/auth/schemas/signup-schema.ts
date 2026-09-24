import { z } from "zod";

import { emailField, handleField, passwordField } from "./fields";

export const signupSchema = z
  .object({
    email: emailField,
    password: passwordField,
    displayName: z.string().trim().min(1, "Display name is required.").max(80, "Display name is too long."),
    handle: handleField,
  })
  .strict();

export type SignupInput = z.infer<typeof signupSchema>;