'use client'

import { GetSecretSchema } from "@/app/api/secrets/route"
import { useCallback, useEffect, useState } from "react";
import Loader from "../Loader";

export default function GetSecretForm({
  secretId,
  privateKey
}: GetSecretFormProps) {

  const [secret, setSecret] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)


  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setToast(null)
    }, 5000)
  }, [toast])

  const decryptSecret = useCallback(async (secret: string, privateKey: string) => {
    const key = await window.crypto.subtle.importKey(
      "pkcs8",
      new Uint8Array([...privateKey].map(char => char.charCodeAt(0))).buffer,
      {
        name: "RSA-OAEP",
        hash: "SHA-256",
      },
      true,
      ["decrypt"]
    );

    const decryptedSecret = await window.crypto.subtle.decrypt(
      {
        name: "RSA-OAEP",
      },
      key,
      new Uint8Array([...secret].map(char => char.charCodeAt(0))).buffer
    );

    return new TextDecoder().decode(decryptedSecret);
  }, [])
  
  const handleGetSecret = async () => {
    try {
      setLoading(true)
      const url = new URL('/api/secrets', window.location.href)
      url.searchParams.set('id', secretId)
      
      const response = await fetch(url.toString())

      if( !response.ok ) {
        throw new Error('Failed to fetch secret')
      }

      const data = await response.json()

      const { secret } = GetSecretSchema.parse(data)

      const decryptedSecret = await decryptSecret(secret, privateKey)

      setSecret(decryptedSecret)
      setLoading(false)
    } catch(error) {
      console.error('Failed to fetch secret', error)
      setToast({
        message: 'No secret found',
        type: 'error'
      })
      setLoading(false)
    }
  }

  const handleCopySecret = useCallback(async () => {
    try {
      if( secret ) {
        await navigator.clipboard.writeText(secret)
        setToast({
          message: 'Copied secret to clipboard',
          type: 'success'
        })
      }
    } catch (error) {
      console.error('Failed to copy secret', error)
      setToast({
        message: 'Failed to copy secret',
        type: 'error'
      })
    }
  }, [secret])
  
  return (
    <div 
      className="flex w-full h-52 max-w-2xl relative"
    >
      {
        !secret && (
          <div
            className="absolute top-0 right-0 w-full h-full flex justify-center items-center backdrop-blur-sm"
          >
            {
              loading ? (
                <Loader />
              ) : (
                <button
                  className="px-4 py-2 text-sm font-semibold dark:text-black bg-black dark:bg-white rounded-lg flex items-center gap-2"
                  onClick={handleGetSecret}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                  Reveal secret
                </button>
              )
            }
          </div>
        )
      }

      {
        !!secret && (
          <button
            className="absolute top-4 right-4 p-2 text-lg font-semibold dark:text-black bg-gray-900 dark:bg-gray-300 rounded-lg"
            onClick={handleCopySecret}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
            </svg>
          </button>
        )
      }
      
      <code 
        id='secret-input'
        className="w-full h-52 max-w-2xl p-4 text-lg bg-gray-100 rounded-lg text-black focus:outline-none dark:bg-gray-800 dark:text-white break-words pr-16"
        contentEditable={false}
      >
        {secret || '*********'}
      </code>

      {toast?.type === 'success' && (
        <div 
          className={`fixed bottom-4 right-4 p-4 text-white bg-green-900 rounded-lg`}
        >
          {toast.message}
        </div>
      )}

      {toast?.type === 'error' && (
        <div 
          className={`fixed bottom-4 right-4 p-4 text-white bg-red-900 rounded-lg`}
        >
          {toast.message}
        </div>
      )}
      
    </div>
  )
}

type GetSecretFormProps = {
  secretId: string
  privateKey: string
}