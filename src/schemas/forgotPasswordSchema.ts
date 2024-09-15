import { z } from "zod";

export const passwordValidation = z
  .string()
  .min(6, {
    message:
      "Password must be at least 6 characters with one uppercase, lowercase letters and alteast one digit",
  })
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,20}$/, {
    message:
      "Password must be at least 6 characters with one uppercase, lowercase letters and alteast one digit",
  });
