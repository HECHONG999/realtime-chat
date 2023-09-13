import { z } from 'zod'

export const addFriendValidator = z.object({
  email: z.string(),
})
export const addUserValidator = z.object({
  name: z.string(),
  image: z.string(),
  emailVerified: z.null(),
  id: z.string()
})
