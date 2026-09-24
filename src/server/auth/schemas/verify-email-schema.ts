import { z } from "zod";

import { tokenField } from "./fields";

export const verifyEmailSchema = z
  .object({
    token: tokenField,
  })
  .strict();

export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;