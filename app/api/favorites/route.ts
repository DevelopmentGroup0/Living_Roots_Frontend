// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { NextResponse } from 'next/server'
// // import { prisma } from '@/lib/prisma'; // <--- Tu futura instancia de Prisma

// // GET: Obtener lista de favoritos
// const mockFavorites: any[] = []
// export async function GET() {
//   try {
//     const favorites = await prisma.favorite.findMany({
//       include: { plant: true },
//     })
//     // return NextResponse.json(favorites);

//     // MOCK TEMPORAL (Simulación):
//     return NextResponse.json(mockFavorites)
//   } catch (error) {
//     return NextResponse.json(
//       { error: 'Internal Server Error' },
//       { status: 500 },
//     )
//   }
// }

// // POST: Agregar o Quitar de favoritos
// export async function POST(request: Request) {
//   try {
//     const { plantId, action } = await request.json()
//     // Aquí normalmente obtendrías el userId de tu sesión (NextAuth, Kinde, Clerk, etc.)
//     const userId = 'user_mock_123'

//     if (action === 'ADD') {
//       // PRISMA FUTURO:
//       // await prisma.favorite.create({ data: { userId, plantId } });
//       console.log(`Guardando planta ${plantId} en Postgres mediante Prisma`)
//       mockFavorites.push({ herb_id: plantId })
//       return NextResponse.json({ success: true, message: 'Agregado' })
//     } else if (action === 'REMOVE') {
//       // PRISMA FUTURO:
//       // await prisma.favorite.delete({ where: { userId_plantId: { userId, plantId } } });
//       console.log(`Eliminando planta ${plantId} de Postgres mediante Prisma`)
//       mockFavorites.splice(
//         mockFavorites.findIndex((fav) => fav.herb_id === plantId),
//         1,
//       )
//       return NextResponse.json({ success: true, message: 'Eliminado' })
//     }

//     return NextResponse.json({ success: true })
//   } catch (error) {
//     return NextResponse.json(
//       { error: 'Error procesando solicitud' },
//       { status: 400 },
//     )
//   }
// }
