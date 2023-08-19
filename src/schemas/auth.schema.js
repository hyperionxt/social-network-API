import { z } from "zod";

export const signupSchema = z.object({
  username: z
    .string({
      required_error: "Username is required",
    })
    .max(15, { message: "Username must be less than 15 characters" })
    .refine((value) => !/\s/.test(value), { message: "No spaces allowed" }),
  email: z
    .string({
      required_error: "Email is required",
    })
    .email({
      message: "Invalid email",
    }),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(8, {
      message: "Password must be at least 8 character",
    })
    .refine(
      (password) => {
        return (
          /[A-Z]/.test(password) &&
          /\d/.test(password) &&
          /[!@#$%^&*]/.test(password) &&
          !/\s/.test(password)
        );
      },
      {
        message:
          "Password must contain at least one uppercase letter, one number, and one symbol",
      }
    ),
});

export const signinSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .email({
      message: "Invalid email",
    }),
  password: z.string({
    required_error: "Password is required",
  }),
});

export const updateProfileSchema = z.object({
  username: z
    .string()
    .max(15, { message: "Username must be less than 15 characters" })
    .refine((value) => !/\s/.test(value), { message: "No spaces allowed" }),
  email: z.string().email({
    message: "Invalid email",
  }),
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 character",
    })
    .refine(
      (password) => {
        return (
          /[A-Z]/.test(password) &&
          /\d/.test(password) &&
          /[!@#$%^&*]/.test(password) &&
          !/\s/.test(password)
        );
      },
      {
        message:
          "Password must contain at least one uppercase letter, one number, one symbol and no spapces.",
      }
    ),
});

export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 character",
    })
    .refine(
      (password) => {
        return (
          /[A-Z]/.test(password) &&
          /\d/.test(password) &&
          /[!@#$%^&*]/.test(password) &&
          !/\s/.test(password)
        );
      },
      {
        message:
          "Password must contain at least one uppercase letter, one number, one symbol and no spaces.",
      }
    ),
});
