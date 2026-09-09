// import { NextRequest, NextResponse } from 'next/server'
// import { getServerSession } from 'next-auth'
// import { authOptions } from '@/app/api/auth/[...nextauth]/route'

// export async function GET(request: NextRequest) {
//   const session = await getServerSession(authOptions)
//   const { search } = new URL(request.url)

//   const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/herbs${search}`, {
//     headers: { Authorization: `Bearer ${session?.accessToken}` },
//   })

//   return NextResponse.json(await res.json(), { status: res.status })
// }
