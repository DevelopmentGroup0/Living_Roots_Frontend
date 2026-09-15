import { apiClient } from '@/lib/api-client'
import type {
  CreateChatPayload,
  AppendMessagesPayload,
  ApiChatDetail,
  ApiPaginatedChats,
  ListChatsQuery,
} from '../components/chat/types/chat.types'

// ─── Chat API (HU-10) ───────────────────────────────────────────────────────
// userId ya NO viaja en ningún lado: apiClient inyecta el token y el backend
// resuelve el usuario desde el JWT (@ActiveUser).

/** Primer guardado manual del chat en curso. */
export async function createChat(
  payload: CreateChatPayload,
): Promise<ApiChatDetail> {
  return apiClient.post('/chat/persist', payload)
}

/** Guardado incremental: solo los mensajes nuevos del último turno. */
export async function appendChatMessages(
  chatId: string,
  payload: AppendMessagesPayload,
): Promise<ApiChatDetail> {
  return apiClient.patch(`/chat/${chatId}/messages`, payload)
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
  return apiClient.get(`/chat/history${queryString}`)
}

/** Chat completo con mensajes, para restaurar contexto. */
export async function getChatDetail(chatId: string): Promise<ApiChatDetail> {
  return apiClient.get(`/chat/${chatId}`)
}

/** Elimina un chat del historial. */
export async function deleteChat(chatId: string): Promise<void> {
  return apiClient.delete(`/chat/${chatId}`)
}

/** Renombra un chat. */
export async function renameChat(
  chatId: string,
  title: string,
): Promise<ApiChatDetail> {
  return apiClient.patch(`/chat/${chatId}`, { title })
}
