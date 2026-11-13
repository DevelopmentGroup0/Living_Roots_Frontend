import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { getBackendUrl } from '@/lib/server/backend-url'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  const token = session?.error ? undefined : session?.accessToken
  if (!token) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    const response = await fetch(getBackendUrl('/chat/generate'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: req.body,
      // @ts-expect-error — necesario para que Next.js no bufferice el stream
      duplex: 'half',
    })

    return new Response(response.body, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('content-type') ?? 'text/plain; charset=utf-8',
        'X-Vercel-AI-Data-Stream': 'v1',
      },
    })
  } catch (error) {
    console.error('Could not forward chat request to backend', error)
    return new Response('Could not reach the backend', { status: 502 })
  }
}
