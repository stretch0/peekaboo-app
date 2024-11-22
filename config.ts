import { z } from 'zod'

const config = z.object({
  API_URL: z.string(),
  API_KEY: z.string(),
})

export default config.safeParse(process.env).data