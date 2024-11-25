import { z } from 'zod'

export const AddSecretFormSchema = z.object({
  encryptedSecret: z.string().min(1)
})

export const AddSecretResponseSchema = z.object({
  id: z.string(),
})

export const GetSecretSchema = z.object({
  secret: z.string().or(z.array(z.string()))
})

export const SubmitSecretSchema = z.object({
  encryptedSecret: z.array(z.string())
})