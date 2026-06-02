import { Resend } from 'resend'
import { NextResponse } from 'next/server'
import EmailTemplate from '@/components/emails/Email-template'
// import { prisma } from '@/lib/prisma'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { message, type } = await request.json()

    // Validación básica de los datos de entrada
    if (!message || !type) {
      return NextResponse.json(
        { error: 'El mensaje y el tipo son requeridos' },
        { status: 400 },
      )
    }

    // 1. Configurar variables dinámicas según el tipo de mensaje
    const isTestimonio = type === 'testimonio'
    const targetEmail = isTestimonio
      ? 'buicynxbox3602020@gmail.com'
      : 'buicynxbox3602020@gmail.com'

    const subject = isTestimonio
      ? '¡Nuevo Testimonio Recibido!'
      : 'Nueva Sugerencia de Usuario'

    // 2. Si es testimonio, guardarlo en la base de datos PostgreSQL
    if (isTestimonio) {
      //   await prisma.testimonial.create({
      //     data: {
      //       content: message,
      //       // Agrega aquí campos adicionales si tu modelo los requiere (ej. user, rating, etc.)
      //     },
      //   })
    }

    // 3. Enviar el correo usando Resend con la plantilla de React
    const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: [targetEmail],
      subject: subject,
      react: EmailTemplate({ message }),
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(
      { message: 'Procesado y enviado correctamente', data },
      { status: 200 },
    )
  } catch (error) {
    console.error('Error en el servidor:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor al procesar la solicitud' },
      { status: 500 },
    )
  }
}
