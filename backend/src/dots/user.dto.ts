import z from "zod";

import { UserSchema } from "../types/user.type";

// re-use UseSchma from types
export const CreateUserDTO = UserSchema.pick( // pick means pick ths followin schemas from the actual schema which is in mdoel 
//   Why pick is useful

// DTOs (Data Transfer Objects)

// Security (don’t accept unwanted fields)

// Clean API inputs
  {
    firstname: true,
    lastname:true,
    email:true,
    username: true,
    password: true,
    imageUrl: true,
    role: true,

    
  }
).extend(
  // add new attributes to zod
  {
    confirmPassword: z.string().min(6)
  }
  ).refine(
    // extra validation for confirm password
    (data) =>data.password ===data.confirmPassword,
    {
      message : "password do not match",
      path: ["confirmPassword"]
    }
  )
  export type CreateUserDTO = z.infer<typeof CreateUserDTO>;

  export const LoginUserDto = z.object({
    email:z.email(),
    password: z.string().min(6)
  });

  export type LoginUserDto = z.infer<typeof LoginUserDto>;

  export const UpdateUserDto = UserSchema.partial();//.partial() means:
//  partial = "Make every field optional" 
// So if original UserSchema has 10 fields, UpdateUserDto allows sending any subset of them:
// JSON// Valid examples:
// { "firstname": "NewName" }
// { "imageUrl": "https://..." }
// { "firstname": "Gauchan", "lastname": "Rai" }
  export type UpdateUserDto = z.infer<typeof UpdateUserDto>;
// Big central UserSchema
//     │
//     ├───── .pick() ──→ CreateUserDTO (registration shape + confirmPassword)
//     ├───── .object() ─→ LoginUserDto  (only login fields)
//     └───── .partial() → UpdateUserDto (any combination of fields)