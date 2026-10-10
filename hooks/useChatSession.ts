import { useEffect, useCallback, useState } from 'react' // <--- Importar useState
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

  // 1. Crea un ID temporal único para cuando el usuario está en un chat nuevo sin ID de BD/Store aún
  const [tempChatId, setTempChatId] = useState(() => crypto.randomUUID())

  // Si cambia el selectedChatId real (ej. selecciona uno del historial), reseteamos el temporal
  useEffect(() => {
    if (selectedChatId) {
      setTempChatId(crypto.randomUUID())
    }
  }, [selectedChatId])

  const { syncChat, saveAndCloseChat } = useChatPersist({
    accessToken,
    ...persistOptions,
  })

  // Inicializar sesión desde un chat existente
  useEffect(() => {
    if (initialChatId) setSelectedChat(initialChatId)
  }, [userId, initialChatId, setSelectedChat])

  // 2. El ID que usará la AI SDK será el del chat seleccionado O el temporal único
  const activeChatId = selectedChatId ?? tempChatId

  const {
    messages,
    sendMessage: sendMessageRaw,
    status,
    error,
    stop,
  } = useChat({
    id: activeChatId,
    messages: selectedMessages,

    transport: new DefaultChatTransport({
      api: 'http://localhost:4000/rag/ask',
    }),

    onFinish: () => {
      void syncChat()
    },

    onError: (err) => {
      console.error('[useChatSession] Stream error:', err)
    },
  })

  // Crea el registro local en el primer mensaje de una conversación nueva.
  const sendMessage: typeof sendMessageRaw = useCallback(
    (message, ...rest) => {
      if (!selectedChatId) {
        const now = Date.now()
        createChatLocal({
          id: tempChatId,
          userId,
          title: null,
          messages: [],
          createdAt: now,
          updatedAt: now,
        })
      }
      return sendMessageRaw(message, ...rest)
    },
    [selectedChatId, createChatLocal, userId, sendMessageRaw, tempChatId],
  )

  // Sync AI SDK → Zustand
  useEffect(() => {
    updateSelectedMessages(messages)
  }, [messages, updateSelectedMessages])

  // Al iniciar un nuevo chat, genera UUID temporal limpio para la SDK
  const startNewChat = () => {
    clearSelectedChat()
    setTempChatId(crypto.randomUUID())
  }

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
