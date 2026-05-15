import { getSession } from 'next-auth/react'

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

interface StreamRequestOptions {
  endpoint: string
  body: unknown
  onChunk: (chunk: string) => void
}

export async function streamApiRequest({
  endpoint,
  body,
  onChunk,
}: StreamRequestOptions) {
  const session = await getSession()

  const token = session?.accessToken

  if (!token) {
    throw new Error('Sesión no válida')
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  })

  if (response.status === 429) {
    throw new Error('Demasiadas solicitudes. Espera un momento.')
  }

  if (!response.ok) {
    throw new Error('Error en el servidor')
  }

  if (!response.body) {
    throw new Error('No se pudo establecer el stream')
  }

  const reader = response.body.getReader()

  const decoder = new TextDecoder()

  let done = false

  while (!done) {
    const { value, done: doneReading } = await reader.read()

    done = doneReading

    if (value) {
      const chunk = decoder.decode(value)

      onChunk(chunk)
    }
  }
}
