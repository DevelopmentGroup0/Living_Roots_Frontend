import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getBackendUrl } from '@/lib/server/backend-url'

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  const token = session?.error ? undefined : session?.accessToken

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const response = await fetch(getBackendUrl('/rag/ask'), {
      method: 'POST',
      headers: {
        'Content-Type': request.headers.get('content-type') ?? 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: request.body,
      // @ts-expect-error required by Node.js fetch when forwarding a stream
      duplex: 'half',
    })

    return new Response(response.body, {
      status: response.status,
      headers: {
        'Content-Type':
          response.headers.get('content-type') ?? 'text/plain; charset=utf-8',
        'x-vercel-ai-ui-message-stream':
          response.headers.get('x-vercel-ai-ui-message-stream') ?? 'v1',
        'Cache-Control': response.headers.get('cache-control') ?? 'no-cache',
      },
    })
  } catch (error) {
    console.error('Could not forward RAG request to backend', error)
    return NextResponse.json(
      { message: 'Could not reach the backend' },
      { status: 502 },
    )
  }
}
