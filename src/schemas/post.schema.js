import { z } from "zod";

export const createPost = z.object({
  title: z.string({
    required_error: "title cannot be empty",
  }),
});
