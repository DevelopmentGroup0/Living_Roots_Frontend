import type { ApiChatDetail, ChatSession } from './types/chat.types'

// Convierte la respuesta cruda del backend (ApiChatDetail) a un ChatSession
// listo para vivir en Zustand. persistedMessageCount se fija al total de
// mensajes recibidos, porque todo lo que viene de la BD ya está sincronizado.

export function toChatSession(
  chat: ApiChatDetail,
  userId: string,
): ChatSession {
  return {
    id: chat.chat_id,
    userId,
    title: chat.title,
    messages: chat.messages,
    createdAt: new Date(chat.createdAt).getTime(),
    updatedAt: new Date(chat.updatedAt).getTime(),
    lastActiveAt: new Date(chat.lastActiveAt).getTime(),
    persistedMessageCount: chat.messages.length,
  }
}
