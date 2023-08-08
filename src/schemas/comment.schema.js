import { z } from "zod";

export const createCommentSchema = z.object({
    text: z.string({
        required_error: "Comments cannot be empty"
    })
})