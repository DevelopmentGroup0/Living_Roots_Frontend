import { apiClient } from '@/lib/api-client'
import type {
  CreateChatPayload,
  AppendMessagesPayload,
  ApiChatDetail,
  ApiPaginatedChats,
  ListChatsQuery,
} from '../components/chat/types/chat.types'
import { getSession } from 'next-auth/react'

async function getToken(): Promise<string | undefined> {
  const session = await getSession()
  if (!session?.accessToken) {
    throw new Error('Sesión no encontrada. Por favor inicia sesión nuevamente.')
  }
  return session?.accessToken as string | undefined
}

/** Primer guardado manual del chat en curso. */
export async function createChat(
  payload: CreateChatPayload,
): Promise<ApiChatDetail> {
  const token = await getToken()
  return apiClient.post('/chat/persist', payload, token)
}

/** Guardado incremental: solo los mensajes nuevos del último turno. */
export async function appendChatMessages(
  chatId: string,
  payload: AppendMessagesPayload,
): Promise<ApiChatDetail> {
  const token = await getToken()
  return apiClient.patch(`/chat/${chatId}/messages`, payload, token)
}

/** Historial paginado del usuario autenticado (HU-10). */
export async function getChatHistory(
  query: ListChatsQuery = {},
): Promise<ApiPaginatedChats> {
  const searchParams = new URLSearchParams(
    Object.entries(query).reduce(
      (acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = String(value)
        }
        return acc
      },
      {} as Record<string, string>,
    ),
  ).toString()

  const queryString = searchParams ? `?${searchParams}` : ''
  const token = await getToken()
  return apiClient.get(`/chat/history${queryString}`, token)
}

/** Chat completo con mensajes, para restaurar contexto. */
export async function getChatDetail(chatId: string): Promise<ApiChatDetail> {
  const token = await getToken()
  return apiClient.get(`/chat/${chatId}`, token)
}

/** Elimina un chat del historial. */
export async function deleteChat(chatId: string): Promise<void> {
  const token = await getToken()
  return apiClient.delete(`/chat/${chatId}`, token)
}

/** Renombra un chat. */
export async function renameChat(
  chatId: string,
  title: string,
): Promise<ApiChatDetail> {
  const token = await getToken()
  return apiClient.patch(`/chat/${chatId}`, { title }, token)
}
