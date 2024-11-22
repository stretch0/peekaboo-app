'use client'
import { AddSecretFormSchema } from "@/schemas";
import { FormEvent, useCallback, useEffect, useState } from "react";

export default function AddSecretForm({
  onSubmit
}: AddSecretFormProps) {

  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setToast(null)
    }, 3000)
  }, [toast])

  const generateKeyPair = useCallback(async () => {
    const keyPair = await window.crypto.subtle.generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
      },
      true,
      ["encrypt", "decrypt"]
    );

    const publicKey = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);
    const privateKey = await window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey);

    return {
      publicKey: String.fromCharCode(...new Uint8Array(publicKey)),
      privateKey: String.fromCharCode(...new Uint8Array(privateKey)),
    };
  }, [])
  
  const handleSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    
    const formData = new FormData(event.currentTarget);

    const {
      data,
      error,
      success
    } = AddSecretFormSchema.safeParse({ encryptedSecret: formData.get('secret-input') })
    
    if(!success) {
      setToast({
        message: error.errors[0].message,
        type: 'error'
      })
      return
    }

    const keyPair = await generateKeyPair();

    const publicKeyBuffer = new Uint8Array([...keyPair.publicKey].map(char => char.charCodeAt(0))).buffer;

    const publicKey = await window.crypto.subtle.importKey(
      "spki",
      publicKeyBuffer,
      {
        name: "RSA-OAEP",
        hash: "SHA-256",
      },
      true,
      ["encrypt"]
    );

    const encryptedSecret = await window.crypto.subtle.encrypt(
      {
        name: "RSA-OAEP"
      },
      publicKey,
      new TextEncoder().encode(data.encryptedSecret)
    );

    const id = await onSubmit({
      encryptedSecret: String.fromCharCode(...new Uint8Array(encryptedSecret)),
      publicKey: keyPair.publicKey,
    })

    const url = new URL(id, window.location.href);
    url.searchParams.set("privateKey", keyPair.privateKey);
    
    setShareUrl(url.toString());
  }, [onSubmit, generateKeyPair])

  const handleCopy = useCallback(async (shareUrl: string) => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setToast({
        message: 'Copied to clipboard',
        type: 'success'
      })
    } catch (error) {
      console.error('Failed to copy to clipboard', error)
      setToast({
        message: 'Failed to copy to clipboard',
        type: 'error'
      })
    }
  }, [])
  
  return (
    <>
      {
        !!shareUrl ? (
          <>
            <div 
              className="flex flex-row gap-0 items-center w-full max-w-xl max-w-full mx-auto mt-8 justify-center"
            >
              <input 
                className="flex-grow p-2 md:p-4 text-lg bg-gray-100 rounded-l-lg text-black focus:outline-none dark:bg-gray-800 dark:text-white overflow-ellipsis border-2 border-indigo-400 border-r-0"
                value={shareUrl}
                readOnly
              />
              <button
                className="p-2 md:p-4 text-lg font-semibold text-white bg-black rounded-r-lg dark:text-white dark:bg-gray-600 dark:hover:bg-gray-700 dark:hover:text-white hover:bg-gray-100 hover:text-black focus:outline-none flex-shrink-0 border-2 border-indigo-400 border-l-0"
                onClick={() => {
                  handleCopy(shareUrl)
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                </svg>
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit} 
            className='w-full max-w-2xl mx-auto flex flex-col gap-4'
          >
            <textarea 
              id='secret-input'
              name='secret-input'
              className="w-full h-52 max-w-2xl p-4 text-lg bg-gray-100 rounded-lg text-black focus:outline-none dark:bg-gray-800 dark:text-white"
              placeholder="Enter your secret keys or .env files..."
            />
            <button
              type="submit"
              className="px-8 py-4 text-lg font-semibold text-white bg-black rounded-lg dark:text-black dark:bg-white dark:hover:bg-gray-100 dark:hover:text-black hover:bg-gray-100 hover:text-black focus:outline-none justify-center items-center flex gap-4 max-w-md mx-auto"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
              </svg>
              Share 
            </button>
          </form>
        )
      }

      {toast?.type === 'success' && (
        <div 
          className={`fixed bottom-4 right-4 p-2 md:p-4 text-white bg-green-900 rounded-lg`}
        >
          {toast.message}
        </div>
      )}

      {toast?.type === 'error' && (
        <div 
          className={`fixed bottom-4 right-4 p-2 md:p-4 text-white bg-red-900 rounded-lg`}
        >
          {toast.message}
        </div>
      )}
    </>
  )
}

type AddSecretFormProps = {
  onSubmit: (args: {
    encryptedSecret: string;
    publicKey: string;
  }) => Promise<string>;
}