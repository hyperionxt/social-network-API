import { z } from "zod";

export const createSuscriptionSchema = z.object({
    user: z.string({
        required_error: "user is required"
    
    }),
    community: z.string({
        required_error: "community is required"
    })
})
