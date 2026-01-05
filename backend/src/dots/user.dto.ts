import { z } from "zod";

export const RegisterUserDto = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be 6 chars"),
  role: z.enum(["user", "admin"]).optional(),
});

export const LoginUserDto = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
