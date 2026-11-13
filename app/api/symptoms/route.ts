import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getBackendUrl } from '@/lib/server/backend-url'

export async function GET() {
  const session = await getServerSession(authOptions)
  const token = session?.error ? undefined : session?.accessToken

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const res = await fetch(getBackendUrl('/symptoms'), {
      headers: { Authorization: `Bearer ${token}` },
    })
    return NextResponse.json(await res.json(), { status: res.status })
  } catch (error) {
    console.error('Could not retrieve symptoms from backend', error)
    return NextResponse.json(
      { message: 'Could not retrieve symptoms from the backend' },
      { status: 502 },
    )
  }
}
