import GetSecretForm from "@/components/GetSecretForm";

export default async function GetSecret({ params, searchParams }: GetSecretProps) {

  const { secretId } = await params

  const { privateKey } = await searchParams

  return (
    <>
      <div className="grid grid-rows-[20px_1fr_20px] items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-8 row-start-2 items-center align-items-center">
          <GetSecretForm secretId={secretId} privateKey={privateKey} />
          <p className="text-sm text-gray-500 italic -mt-5">
            This secret will be destroyed after it is viewed.
          </p>
        </main>
      </div>
    </>
  )
}

type GetSecretProps = {
  params: Promise<{
    secretId: string;
  }>,
  searchParams: Promise<{
    privateKey: string;
  }>
}