import { z } from "zod";

export const createSuscriptionSchema = z.object({
  community: z.string({
    required_error: "community is required",
  }),
});
