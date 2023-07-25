import { z } from "zod";

export const createCommunitySchema = z.object({
    title: z.string({
        required_error: "Title is required, can not be empty."
    }),
    description: z.string({
        required_error: "Description is required, can not be empty."
    }),
    category: z.string({
        required_error: "Please, select a category or categories."
    })

})