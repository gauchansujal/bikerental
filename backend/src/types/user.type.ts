import z from "zod";
export const UserSchema = z.object({
  username: z.string().min(1),
  email:z.email(),
  password: z.string().min(6),
  firstname:z.string().optional(),
  lastname: z.string().optional(),
  role:z.enum(["user", "admin"]).optional().default("user"),
  imageUrl:z.string().optional(),
});
export type UserType = z.infer<typeof UserSchema>;

// what does z.infer doo 
// Simple example
// const UserSchema = z.object({
//   email: z.string(),
//   age: z.number(),
// });


// Now infer the type:

// type User = z.infer<typeof UserSchema>;


// This becomes:

// type User = {
//   email: string;
//   age: number;
// };


// ✨ Automatically created — no manual typing.