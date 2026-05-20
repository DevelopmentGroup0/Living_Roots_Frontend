import type { UIMessage } from 'ai'

// ─────────────────────────────────────────────────────────────
// Chat Session
// ─────────────────────────────────────────────────────────────

export interface ChatSession {
  id: string
  userId: string
  title: string | null
  messages: UIMessage[]
  createdAt: number
  updatedAt: number
  lastActiveAt: number
}

// ─────────────────────────────────────────────────────────────
// Zustand Store State
// ─────────────────────────────────────────────────────────────

export interface ChatStoreState {
  /** Chats cargados localmente */
  chats: ChatSession[]
  /** Chat actualmente seleccionado */
  selectedChatId: string | null
  /** Mensajes del chat activo */
  selectedMessages: UIMessage[]
}

// ─────────────────────────────────────────────────────────────
// Zustand Store Actions
// ─────────────────────────────────────────────────────────────
export interface ChatStoreActions {
  /** Crear nuevo chat */
  createChat: (chat: ChatSession) => void
  /** Seleccionar conversación */
  setSelectedChat: (chatId: string) => void
  /** Actualizar mensajes del chat activo */
  updateSelectedMessages: (messages: UIMessage[]) => void
  /** Actualizar título */
  updateChatTitle: (chatId: string, title: string) => void
  /** Actualizar actividad */
  updateLastActivity: (chatId: string) => void
  /** Eliminar chat */
  deleteChat: (chatId: string) => void
  /** Limpiar chat seleccionado */
  clearSelectedChat: () => void
  /** Reset completo (logout) */
  resetStore: () => void
}

export type ChatStore = ChatStoreState & ChatStoreActions

// ─────────────────────────────────────────────────────────────
// Persist Payload
// ─────────────────────────────────────────────────────────────
export interface PersistChatPayload {
  chatId?: string
  userId: string
  title?: string | null
  lastActiveAt: string
  messages: UIMessage[]
}

// ─────────────────────────────────────────────────────────────
// API Responses
// ─────────────────────────────────────────────────────────────

export interface ApiChatSummary {
  chat_id: string
  userId: string
  title: string | null
  createdAt: string
  updatedAt: string
  lastActiveAt: string
  messageCount: number
}

export interface ApiChatDetail {
  chat_id: string
  userId: string
  title: string | null
  createdAt: string
  updatedAt: string
  lastActiveAt: string
  messages: UIMessage[]
}

// ─────────────────────────────────────────────────────────────
// Hook Options
// ─────────────────────────────────────────────────────────────
export interface UseChatPersistOptions {
  /** Default: 30 minutos */
  inactivityMs?: number
  /** Callback tras persistencia */
  onPersisted?: (chatId: string) => void
  /** Callback de error */
  onError?: (error: Error) => void
}
