import { useEffect } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { useChatStore } from '@/store/useChatStore'
import { useChatPersist } from './useChatPersist'
import type { UseChatPersistOptions } from '../components/chat/types/chat.types'

interface UseChatSessionOptions extends UseChatPersistOptions {
  userId: string
  initialChatId?: string
}

/**
 * useChatSession
 *
 * Orquesta:
 *
 * - AI SDK streaming
 * - Zustand global state
 * - Persistencia PostgreSQL
 */
export function useChatSession(options: UseChatSessionOptions) {
  const { userId, initialChatId, ...persistOptions } = options

  // ─────────────────────────────────────────
  // Zustand
  // ─────────────────────────────────────────

  const chats = useChatStore((state) => state.chats)
  const selectedChatId = useChatStore((state) => state.selectedChatId)
  const selectedMessages = useChatStore((state) => state.selectedMessages)
  const setSelectedChat = useChatStore((state) => state.setSelectedChat)
  const updateSelectedMessages = useChatStore(
    (state) => state.updateSelectedMessages,
  )

  const clearSelectedChat = useChatStore((state) => state.clearSelectedChat)

  // ─────────────────────────────────────────
  // Persistencia
  // ─────────────────────────────────────────

  const { persistAndClear } = useChatPersist(persistOptions)

  // ─────────────────────────────────────────
  // Inicializar sesión
  // ─────────────────────────────────────────

  useEffect(() => {
    if (initialChatId) {
      setSelectedChat(initialChatId)
    }
  }, [userId, initialChatId, setSelectedChat])

  // ─────────────────────────────────────────
  // AI SDK v6
  // ─────────────────────────────────────────

  const { messages, sendMessage, status, error, stop } = useChat({
    messages: selectedMessages,

    transport: new DefaultChatTransport({
      api: 'http://localhost:4000/chat/generate',
    }),

    onFinish: () => {
      console.log('[useChatSession] Stream finalizado')
    },

    onError: (error) => {
      console.error('[useChatSession] Stream error:', error)
    },
  })

  // ─────────────────────────────────────────
  // Sync AI SDK → Zustand
  // ─────────────────────────────────────────

  useEffect(() => {
    updateSelectedMessages(messages)
  }, [messages, updateSelectedMessages])

  // ─────────────────────────────────────────
  // Nueva conversación
  // ─────────────────────────────────────────

  const startNewChat = () => {
    clearSelectedChat()
  }

  // ─────────────────────────────────────────
  // API pública
  // ─────────────────────────────────────────

  return {
    // AI SDK
    messages,
    sendMessage,
    status,
    error,
    stop,

    // Zustand
    chats,
    selectedChatId,

    // Persistencia
    persistAndClear,

    // Actions
    startNewChat,
  }
}
