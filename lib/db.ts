export async function fetchHerbs() {

  const res = await fetch("http://localhost:4000/herbs")

  if (!res.ok) {
    throw new Error(`HTTP error: ${res.status}`)
  }

  const data = await res.json()

  return data
}

export async function searchHerbs({
  query,
  page,
}: {
  query: string
  page?: string
}) {
  const url = process.env.NEXT_PUBLIC_BACKEND_URL

  const res = await fetch(
    url + `?s=${encodeURIComponent(query)}&page=${page || '1'}`,
    {
      next: {
        revalidate: 60, // Revalida cada 60 segundos
      },
    },
  )

  if (!res.ok) {
    throw new Error(`HTTP error: ${res.status}`)
  }

  const data = await res.json()

  return data
}
