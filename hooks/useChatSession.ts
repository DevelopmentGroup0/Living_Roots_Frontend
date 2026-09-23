import { useEffect, useCallback } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { useChatStore } from '@/store/useChatStore'
import { useChatPersist } from './useChatPersist'
import type { UseChatPersistOptions } from '../components/chat/types/chat.types'

interface UseChatSessionOptions extends UseChatPersistOptions {
  userId: string
  initialChatId?: string
}

export function useChatSession(options: UseChatSessionOptions) {
  const { userId, initialChatId, accessToken, ...persistOptions } = options

  const chats = useChatStore((state) => state.chats)
  const selectedChatId = useChatStore((state) => state.selectedChatId)
  const selectedMessages = useChatStore((state) => state.selectedMessages)
  const setSelectedChat = useChatStore((state) => state.setSelectedChat)
  const createChatLocal = useChatStore((state) => state.createChat)
  const updateSelectedMessages = useChatStore(
    (state) => state.updateSelectedMessages,
  )
  const clearSelectedChat = useChatStore((state) => state.clearSelectedChat)

  const { syncChat, saveAndCloseChat } = useChatPersist({
    accessToken,
    ...persistOptions,
  })

  // Inicializar sesión desde un chat existente
  useEffect(() => {
    if (initialChatId) setSelectedChat(initialChatId)
  }, [userId, initialChatId, setSelectedChat])

  const {
    messages,
    sendMessage: sendMessageRaw,
    status,
    error,
    stop,
  } = useChat({
    messages: selectedMessages,

    transport: new DefaultChatTransport({
      // api: 'http://localhost:4000/chat/generate',
      // headers: { Authorization: `Bearer ${accessToken}` },
      api: 'http://localhost:4000/rag/ask',
    }),

    onFinish: () => {
      // Guardado automático incremental — solo pega si el chat ya fue
      // guardado manualmente antes (allowCreate: false por defecto).
      void syncChat()
    },

    onError: (err) => {
      console.error('[useChatSession] Stream error:', err)
    },
  })

  // Crea el registro local en el primer mensaje de una conversación nueva.
  // Así sobrevive a navegaciones (localStorage) aunque nunca se guarde en BD.
  const sendMessage: typeof sendMessageRaw = useCallback(
    (message, ...rest) => {
      if (!selectedChatId) {
        const now = Date.now()
        createChatLocal({
          id: crypto.randomUUID(),
          userId,
          title: null,
          messages: [],
          createdAt: now,
          updatedAt: now,
        })
      }
      return sendMessageRaw(message, ...rest)
    },
    [selectedChatId, createChatLocal, userId, sendMessageRaw],
  )

  // Sync AI SDK → Zustand
  useEffect(() => {
    updateSelectedMessages(messages)
  }, [messages, updateSelectedMessages])

  const startNewChat = () => clearSelectedChat()

  return {
    messages,
    sendMessage,
    status,
    error,
    stop,
    chats,
    selectedChatId,
    selectedMessages,
    saveAndCloseChat,
    startNewChat,
  }
}
