import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

// Proxy para crear usuarios desde el panel de administración. El token del
// admin se toma de la sesión en el servidor (nunca viaja desde el cliente) y
// el rol se verifica aquí además del guard del backend.
export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.accessToken || session.error) {
    return NextResponse.json({ message: 'No autenticado' }, { status: 401 })
  }

  if (session.user?.role !== 'admin') {
    return NextResponse.json({ message: 'No autorizado' }, { status: 403 })
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ message: 'JSON inválido' }, { status: 400 })
  }

  // Lista blanca: nunca se reenvía una contraseña ni campos inesperados.
  const { name, lastName, email, role, phone } = body

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({ name, lastName, email, role, phone }),
      cache: 'no-store',
    })

    const data = await res.json().catch(() => ({}))
    return NextResponse.json(data, { status: res.status })
  } catch {
    return NextResponse.json(
      { message: 'No se pudo contactar al servidor' },
      { status: 502 },
    )
  }
}
