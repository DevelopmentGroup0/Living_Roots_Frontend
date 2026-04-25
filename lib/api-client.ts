const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string,
): Promise<T> {
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      // Si hay token, lo inyectamos. Si no, no (para rutas públicas)
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
      ...options.headers,
    },
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config)

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: 'Error desconocido' }))
    throw new Error(error.message || 'Error en la petición')
  }

  return response.json()
}

export const apiClient = {
  get: <T>(url: string, token?: string) =>
    apiRequest<T>(url, { method: 'GET' }, token),
  post: <T>(url: string, body: unknown, token?: string) =>
    apiRequest<T>(url, { method: 'POST', body: JSON.stringify(body) }, token),
  patch: <T>(url: string, body: unknown, token?: string) =>
    apiRequest<T>(url, { method: 'PATCH', body: JSON.stringify(body) }, token),
  delete: <T>(url: string, token?: string) =>
    apiRequest<T>(url, { method: 'DELETE' }, token),
}
