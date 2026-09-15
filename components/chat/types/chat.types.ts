import type { UIMessage } from 'ai'

// Chat Session
export interface ChatSession {
  id: string
  userId: string
  title: string | null
  messages: UIMessage[]
  createdAt: number
  updatedAt: number
  lastActiveAt: number
  persistedMessageCount: number
}

// Zustand Store State
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
  createChat: (chat: Omit<ChatSession, 'persistedMessageCount'>) => void
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
  /** Renombra el id local al chat_id real del backend tras el primer guardado. */
  resolveChatId: (localId: string, chatId: string) => void
  /** Actualiza cuántos mensajes ya están sincronizados con el backend. */
  setPersistedCount: (chatId: string, count: number) => void
  hydrateChat: (chat: ChatSession) => void
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

// Payloads salientes (ya sin userId — va por token)
export interface BackendMessagePart {
  type: 'text'
  text: string
}

export interface BackendMessage {
  id?: string
  role: 'user' | 'assistant' | 'system'
  parts: BackendMessagePart[]
}

/** Primer guardado manual. */
export interface CreateChatPayload {
  title?: string | null
  lastActiveAt: string
  messages: BackendMessage[]
}

/** Guardados automáticos posteriores: solo los mensajes nuevos. */
export interface AppendMessagesPayload {
  lastActiveAt: string
  messages: BackendMessage[]
}

// API Responses
export interface ApiChatSummary {
  chat_id: string
  title: string | null
  createdAt: string
  updatedAt: string
  lastActiveAt: string
  messageCount: number
}

export interface ApiChatDetail {
  chat_id: string
  title: string | null
  createdAt: string
  updatedAt: string
  lastActiveAt: string
  messages: UIMessage[]
}

export interface ApiPaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
  hasNextPage: boolean
}

export interface ApiPaginatedChats {
  data: ApiChatSummary[]
  meta: ApiPaginationMeta
}

export type ChatSortBy = 'title' | 'lastActiveAt' | 'createdAt'

export interface ListChatsQuery {
  page?: number
  limit?: number
  sortBy?: ChatSortBy
}

// Hook Options
export interface UseChatPersistOptions {
  /** Default: 30 minutos */
  inactivityMs?: number
  /** Callback tras persistencia */
  onPersisted?: (chatId: string) => void
  /** Callback de error */
  onError?: (error: Error) => void
  accessToken: string
}
