export const HerbService = {
  async getAll() {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/herbs`, {
        cache: 'no-store',
      })

      if (!res.ok) throw new Error('Error al obtener hierbas')

      return await res.json()
    } catch (error) {
      console.error('HerbService Error:', error)
      throw error
    }
  },
}
