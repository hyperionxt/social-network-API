import { z } from "zod";

export const signupSchema = z.object({
  username: z.string({
    required_error: "Username is required(response from src/schema/auth.schema.js)",
  }),
  email: z
    .string({
      required_error: "Email is required(response from src/schema/auth.schema.js)",
    })
    .email({
      message: "Invalid email(response from src/schema/auth.schema.js)",
    }),
  password: z
    .string({
      required_error: "Password is required(response from src/schema/auth.schema.js)",
    })
    .min(8, {
      message:
        "Password must be at least 6 character(response from src/schema/auth.schema.js)",
    }),
});

export const signinSchema = z.object({
  email: z
    .string({
      required_error: "Email is required(response from src/schema/auth.schema.js)",
    })
    .email({
      message: "Invalid email(response from src/schema/auth.schema.js)",
    }),
  password: z
    .string({
      required_error: "Password is required(response from src/schema/auth.schema.js)",
    })
    .min(8, {
      message:
        "Password must be at least 8 character(response from src/schema/auth.schema.js)",
    }),
});
