import { z } from "zod";

export const createBanSchema = z.object({
  reason: z.string({
    required_error: "Reason is required",
  }),
});
