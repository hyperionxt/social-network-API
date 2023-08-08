import { z } from "zod";

export const createCategorySchema = z.object({
  title: z.string({
    required_error: "Title is required",
  }),
});
