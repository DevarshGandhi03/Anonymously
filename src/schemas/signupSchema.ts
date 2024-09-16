import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(3, "Username should be minimum 3 characters")
  .max(16, "Username should be maximum 16 characters")
  .regex(
    /^[A-Za-z][A-Za-z0-9_]{3,16}$/,
    "Username should not consist of any special characters except _"
  )

export const signUpSchema = z.object({
  username: usernameValidation,

  email: z.string().email({ message: "Please enter a valid email adderess" }).regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,"Please enter a valid email adderess"),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters with one uppercase, lowercase letters and alteast one digit" }).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()]).{6,20}$/,{message: "Password must be at least 6 characters with one uppercase, lowercase letters, special character and alteast one digit"})
});
