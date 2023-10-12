import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string({
    required_error: "title cannot be empty",
  }),
});

export const updatePostSchema = z.object({
  title: z.string({
    required_error: "title cannot be empty",
  }),
  description: z.string(),
});
