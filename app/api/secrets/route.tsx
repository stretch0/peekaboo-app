import { NextRequest } from "next/server"
import config from "@/config";
import { GetSecretSchema } from "@/schemas";

export async function GET(request: NextRequest) {

  const secretId = request.nextUrl.searchParams.get('id')

  if(!secretId) {
    return new Response('Secret ID is required', { status: 400 })
  }
  
  const url = new URL('/secrets', config?.API_URL)
  url.searchParams.set('id', secretId)
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      ...(config?.API_KEY && { 'x-api-key': config?.API_KEY })
    }
  })
  
  if(!response.ok) {
    throw new Error('Failed to fetch secret')
  }

  const data = await response.json()

  const { secret } = GetSecretSchema.parse(data)
  
  return new Response(JSON.stringify({ secret }), {
    headers: {
      'Content-Type': 'application/json',
    }
  })
}