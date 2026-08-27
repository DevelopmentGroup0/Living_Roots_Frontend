export type LoginResponse =
  | { requires2FA: true; preAuthToken: string }
  | { requires2FA: false; access_token: string }

export interface VerifyTwoFactorResponse {
  access_token: string
}

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL

async function parseResponse<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const message = data?.message ?? 'Ocurrió un error inesperado'
    throw new Error(Array.isArray(message) ? message.join(', ') : message)
  }

  return data as T
}

export async function loginRequest(
  email: string,
  password: string,
): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    // Necesario para que el navegador lea/guarde la cookie httpOnly del
    // dispositivo confiable (backend y frontend están en orígenes distintos).
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  return parseResponse<LoginResponse>(response)
}

export async function verifyTwoFactorRequest(
  preAuthToken: string,
  code: string,
  rememberDevice: boolean,
): Promise<VerifyTwoFactorResponse> {
  const response = await fetch(`${API_URL}/auth/login/verify-2fa`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${preAuthToken}`,
    },
    body: JSON.stringify({ code, rememberDevice }),
  })
  return parseResponse<VerifyTwoFactorResponse>(response)
}

export async function resendCodeRequest(
  preAuthToken: string,
): Promise<{ success: true }> {
  const response = await fetch(`${API_URL}/auth/login/resend-code`, {
    method: 'POST',
    credentials: 'include',
    headers: { Authorization: `Bearer ${preAuthToken}` },
  })
  return parseResponse<{ success: true }>(response)
}
