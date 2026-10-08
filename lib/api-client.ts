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
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
      ...options.headers,
    },
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config)
  console.log('url', `${BASE_URL}${endpoint}`, 'token', token)

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: 'Error desconocido' }))
    throw new Error(error.message || 'Error en la petición')
  }

  return response.json()
}

async function apiRequestBlob(endpoint: string, token?: string): Promise<Blob> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'GET',
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  })
  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: 'Error desconocido' }))
    throw new Error(error.message || 'Error en la petición')
  }
  return response.blob()
}

async function apiRequestForm<T>(
  endpoint: string,
  body: FormData,
  token?: string,
): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body,
  })
  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: 'Error desconocido' }))
    throw new Error(error.message || 'Error en la petición')
  }
  return response.json()
}

async function apiRequestDelete(endpoint: string, token?: string) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'DELETE',
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  })

  if (!res.ok) {
    throw new Error('Error en la petición DELETE')
  }

  // Si es 204 No Content o no hay contenido, retornamos null o vacío para evitar el error de JSON
  if (res.status === 204 || res.headers.get('content-length') === '0') {
    return null
  }

  return res.json()
}

export const apiClient = {
  get: <T>(url: string, token?: string) =>
    apiRequest<T>(url, { method: 'GET' }, token),
  post: <T>(url: string, body: unknown, token?: string) =>
    apiRequest<T>(url, { method: 'POST', body: JSON.stringify(body) }, token),
  put: <T>(url: string, body: unknown, token?: string) =>
    apiRequest<T>(url, { method: 'PUT', body: JSON.stringify(body) }, token),
  patch: <T>(url: string, body: unknown, token?: string) =>
    apiRequest<T>(url, { method: 'PATCH', body: JSON.stringify(body) }, token),
  delete: (url: string, token?: string) => apiRequestDelete(url, token),
  getBlob: (url: string, token?: string) => apiRequestBlob(url, token),
  postForm: <T>(url: string, body: FormData, token?: string) =>
    apiRequestForm<T>(url, body, token),
}
