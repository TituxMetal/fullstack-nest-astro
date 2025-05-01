import { z } from 'zod'

export const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, { message: 'Identifier is required' })
    .min(3, { message: 'Identifier must be at least 3 characters long' }),
  password: z
    .string()
    .min(1, { message: 'Password is required' })
    .min(8, { message: 'Password must be at least 8 characters' })
})

export type LoginFormData = z.infer<typeof loginSchema>
