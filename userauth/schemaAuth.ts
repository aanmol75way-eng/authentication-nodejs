import z from 'zod'
export let registerSchema = z.object({
    userName: z.string().min(3, "Name must be at least 3 characters"),
    userEmail: z.string().email("Invalid email address"),
    userPassword: z.string().min(6, "Password must be at least 6 characters"),
})

export type registerInput = z.infer<typeof registerSchema>;