import { z } from "zod";

export const RegisterUserDto = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["user", "admin"]).optional(),
});

export type RegisterUserInput = z.infer<typeof RegisterUserDto>;

export const LoginUserDto = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginUserInput = z.infer<typeof LoginUserDto>;
