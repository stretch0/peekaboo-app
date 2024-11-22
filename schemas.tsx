import { z } from 'zod'

export const AddSecretFormSchema = z.object({
  encryptedSecret: z.string().min(1).max(1000),
})

export const AddSecretResponseSchema = z.object({
  id: z.string(),
})

export const GetSecretSchema = z.object({
  secret: z.string()
})