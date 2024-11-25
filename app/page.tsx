import AddSecretForm from "@/components/AddSecretForm";
import { AddSecretResponseSchema, SubmitSecretSchema } from "@/schemas";
import config from "@/config";

export default function Home() {
  
  async function onSubmit(input: {
    encryptedSecret: string[];
    publicKey: string;
  }) {
    'use server'
    
    const { encryptedSecret } = SubmitSecretSchema.parse(input)
    
    const url = new URL('/secrets', config?.API_URL)
    
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        secret: encryptedSecret
      }),
      headers: {
        ...(config?.API_KEY && { 'x-api-key': config?.API_KEY })
      }
    })
 
    const data = await response.json()

    if(!response.ok) {
      throw new Error(data.message)
    }

    const { id } = AddSecretResponseSchema.parse(data)
    
    return id
  }

  return (
    <>
      <div className="grid grid-rows-[20px_1fr_20px] items-center min-h-screen p-4 md:p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-8 row-start-2 items-center">
          <p
            className="text-lg text-center max-w-lg text-gray-600 dark:text-gray-400 sm:text-xl sm:max-w-xl"
          >
            Securely share your secrets with a link that automatically expires after being viewed.
          </p>
          <AddSecretForm onSubmit={onSubmit} />
        </main>
      </div>
    </>
  );
}
