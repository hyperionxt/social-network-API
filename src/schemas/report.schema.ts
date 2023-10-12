import { z } from "zod";

export const createReportSchema = z.object({
  context: z.string({
    required_error: "Context is required",
  }),
});
