import { z } from "zod";

export const createCommunitySchema = z.object({
  title: z.string({
    required_error: "Title is required, can not be empty.",
  }),
  category: z.string({
    required_error: "Select one or more categories, please.",
  }),
});

export const updateCommunitySchema = z.object({
  title: z.string({
    required_error: "Title is required, can not be empty.",
  }),
  description: z.string(),
});
