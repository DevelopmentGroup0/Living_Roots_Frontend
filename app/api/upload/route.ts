import { NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: Request) {
  const formData = await request.formData()
  const image = formData.get('image') as File | null

  if (!image) {
    return NextResponse.json({ error: 'No image provided' }, { status: 400 })
  }

  // Convert the file to a buffer
  const buffer = Buffer.from(await image.arrayBuffer())

  // Upload the file to Cloudinary
  const result = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream((error, result) => {
        if (error) {
          reject(error)
        } else {
          resolve(result)
        }
      })
      .end(buffer)
  })

  return NextResponse.json({
    message: 'File uploaded successfully',
    url: result,
  })
}
