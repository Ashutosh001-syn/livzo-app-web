import { z } from "zod";

import { passwordField, tokenField } from "./fields";

export const resetPasswordSchema = z
  .object({
    token: tokenField,
    password: passwordField,
  })
  .strict();

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;