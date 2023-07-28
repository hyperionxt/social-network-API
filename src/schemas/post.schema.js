import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string({
    required_error: "title cannot be empty",
  }),
});
