import type {
  PersistChatPayload,
  ApiChatSummary,
  ApiChatDetail,
} from '../components/chat/types/chat.types'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

// ─── Helper ────────────────────────────────────────────────────────────────────

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`[chat-api] ${res.status} ${res.statusText}: ${body}`)
  }

  // 204 No Content no tiene body
  if (res.status === 204) return undefined as T

  return res.json() as Promise<T>
}

// ─── Chat API ──────────────────────────────────────────────────────────────────

/**
 * Persiste la conversación de Zustand en PostgreSQL.
 * Usa upsert: crea si es nueva, actualiza si ya tiene chatId.
 * Llamado en: logout | timeout inactividad | fin de sesión.
 */
export async function persistChat(
  payload: PersistChatPayload,
): Promise<ApiChatDetail> {
  return apiFetch<ApiChatDetail>('/chat/persist', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

/**
 * Obtiene el historial de chats del usuario para el sidebar.
 */
export async function getUserChats(userId: string): Promise<ApiChatSummary[]> {
  return apiFetch<ApiChatSummary[]>(`/chat/history/${userId}`)
}

/**
 * Obtiene un chat completo con mensajes para restaurar contexto.
 */
export async function getChatDetail(
  chatId: string,
  userId: string,
): Promise<ApiChatDetail> {
  return apiFetch<ApiChatDetail>(`/chat/${chatId}/${userId}`)
}

/**
 * Elimina un chat del historial.
 */
export async function deleteChat(
  chatId: string,
  userId: string,
): Promise<void> {
  return apiFetch<void>(`/chat/${chatId}/${userId}`, { method: 'DELETE' })
}

/**
 * Renombra un chat.
 */
export async function renameChat(
  chatId: string,
  userId: string,
  title: string,
): Promise<ApiChatDetail> {
  return apiFetch<ApiChatDetail>(`/chat/${chatId}/${userId}`, {
    method: 'PATCH',
    body: JSON.stringify({ title }),
  })
}
