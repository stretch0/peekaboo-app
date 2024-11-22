import Link from "next/link";

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen mt-12 p-8 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)] text-lg w-full text-gray-600 dark:text-gray-400 sm:text-xl sm:max-w-5xl m-auto w-full flex flex-col">
      <p>
        Peekaboo is a secure way to share your secret keys or environment variables with team members with a link that automatically expires after being viewed.
      </p>

      <p>
        Peekaboo uses RSA-OAEP encryption to securely encrypt your secrets. When you share a secret, Peekaboo generates a key pair, encrypts your secret with the public key, and generates a unique link that you can share with anyone. The link will automatically expire after being viewed, so you can share your secrets with confidence.
      </p>

      <p>
        To view a secret, simply enter the link that will include the private key that was provided when the secret was shared. Peekaboo will decrypt the secret in the browser and display it to you. Once the secret has been viewed, the link will automatically expire and the secret will be deleted from the server.
      </p>

      <p>
        Peekaboo stores only your encrypted secret. You keep the keys, and Peekaboo never receives them. Share your secrets confidently with Peekaboo!
      </p>

      <p>
        Peekaboo is open source and free to use. You can view the source code on <a href="https://github.com/stretch0/peekaboo-app" className="text-blue-500 dark:text-blue-400 hover:underline">GitHub</a> and contribute to the project.
      </p>

      <div>
        <Link href="/" className="px-8 py-4 text-lg font-semibold text-white bg-black rounded-lg dark:text-black dark:bg-white dark:hover:bg-gray-100 dark:hover:text-black hover:bg-gray-100 hover:text-black focus:outline-none justify-center items-center flex gap-4 max-w-md mx-auto">
          Get Started
        </Link>
      </div>
    </main>
  )
}