import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET() {
  const session = await getServerSession(authOptions)
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/symptoms`, {
    headers: { Authorization: `Bearer ${session?.accessToken}` },
  })
  return NextResponse.json(await res.json(), { status: res.status })
}
