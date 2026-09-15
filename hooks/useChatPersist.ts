import { useEffect, useRef, useCallback } from 'react'

import { useChatStore } from '@/store/useChatStore'
import { createChat, appendChatMessages } from '../services/chat-service'
import type {
  UseChatPersistOptions,
  BackendMessage,
} from '../components/chat/types/chat.types'
import type { UIMessage } from 'ai'

const DEFAULT_INACTIVITY_MS =
  Number(process.env.NEXT_PUBLIC_INACTIVITY_MS) || 30 * 60 * 1000

/** Filtra a solo partes de texto y descarta mensajes que se queden vacíos. */
function toBackendMessages(messages: UIMessage[]): BackendMessage[] {
  return messages
    .map((m) => ({
      id: m.id,
      role: m.role as BackendMessage['role'],
      parts: m.parts
        .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
        .map((p) => ({ type: 'text' as const, text: p.text })),
    }))
    .filter((m) => m.parts.length > 0)
}

export function useChatPersist(options: UseChatPersistOptions) {
  const {
    inactivityMs = DEFAULT_INACTIVITY_MS,
    onPersisted,
    onError,
    accessToken,
  } = options

  const chats = useChatStore((state) => state.chats)
  const selectedChatId = useChatStore((state) => state.selectedChatId)
  const clearSelectedChat = useChatStore((state) => state.clearSelectedChat)
  const resolveChatId = useChatStore((state) => state.resolveChatId)
  const setPersistedCount = useChatStore((state) => state.setPersistedCount)
  const updateChatTitle = useChatStore((state) => state.updateChatTitle)

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const isSyncingRef = useRef(false)

  const currentChat = chats.find((chat) => chat.id === selectedChatId)

  // Refs "frescos" para leer el estado más reciente dentro del handler de
  // beforeunload, que se registra una sola vez y no puede depender de closures viejas.
  const currentChatRef = useRef(currentChat)
  currentChatRef.current = currentChat
  const accessTokenRef = useRef(accessToken)
  accessTokenRef.current = accessToken

  // syncChat: crea (primera vez) o agrega (incremental)
  const syncChat = useCallback(
    async ({
      allowCreate = false,
    }: { allowCreate?: boolean } = {}): Promise<boolean> => {
      const chat = currentChat
      if (!chat || chat.messages.length === 0) return false
      if (isSyncingRef.current) return false

      // Primer guardado: solo si se autoriza explícitamente (botón "Guardar chat").
      if (chat.persistedMessageCount === 0 && !allowCreate) return false

      isSyncingRef.current = true
      try {
        if (chat.persistedMessageCount === 0) {
          const backendMessages = toBackendMessages(chat.messages)
          if (backendMessages.length === 0) return false

          const saved = await createChat({
            title: chat.title,
            lastActiveAt: new Date(chat.lastActiveAt).toISOString(),
            messages: backendMessages,
          })

          resolveChatId(chat.id, saved.chat_id)
          setPersistedCount(saved.chat_id, chat.messages.length)
          if (!chat.title && saved.title) {
            updateChatTitle(saved.chat_id, saved.title)
          }
          onPersisted?.(saved.chat_id)
          return true
        }

        // Incremental: solo el delta desde el último guardado.
        const pending = chat.messages.slice(chat.persistedMessageCount)
        const backendMessages = toBackendMessages(pending)
        if (backendMessages.length === 0) return true // nada nuevo que sincronizar

        await appendChatMessages(chat.id, {
          lastActiveAt: new Date(chat.lastActiveAt).toISOString(),
          messages: backendMessages,
        })

        setPersistedCount(chat.id, chat.messages.length)
        onPersisted?.(chat.id)
        return true
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err))
        onError?.(error)
        return false
      } finally {
        isSyncingRef.current = false
      }
    },
    [
      currentChat,
      onPersisted,
      onError,
      resolveChatId,
      setPersistedCount,
      updateChatTitle,
    ],
  )

  // Acción del botón "Guardar chat": guarda (crea si es la primera vez) y cierra la sesión.
  const saveAndCloseChat = useCallback(async () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    await syncChat({ allowCreate: true })
    clearSelectedChat()
  }, [syncChat, clearSelectedChat])

  // Cierre silencioso (inactividad): nunca crea, solo sincroniza si ya existía.
  const closeSessionSilently = useCallback(async () => {
    await syncChat({ allowCreate: false })
    clearSelectedChat()
  }, [syncChat, clearSelectedChat])

  // Watch inactividad
  useEffect(() => {
    if (!currentChat || currentChat.messages.length === 0) return

    const elapsed = Date.now() - currentChat.lastActiveAt
    if (elapsed >= inactivityMs) {
      void closeSessionSilently()
      return
    }

    const remaining = inactivityMs - elapsed
    timerRef.current = setTimeout(() => void closeSessionSilently(), remaining)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [currentChat, inactivityMs, closeSessionSilently])

  // ─────────────────────────────────────
  // beforeunload — solo sincroniza chats YA guardados antes (nunca crea).
  // fetch + keepalive reemplaza a sendBeacon porque este último no admite
  // headers personalizados y no podríamos mandar el Authorization.
  // ─────────────────────────────────────
  useEffect(() => {
    const handleBeforeUnload = () => {
      const chat = currentChatRef.current
      if (!chat || chat.messages.length === 0) return
      if (chat.persistedMessageCount === 0) return // nunca guardado: no autocrear

      const pending = chat.messages.slice(chat.persistedMessageCount)
      const backendMessages = toBackendMessages(pending)
      if (backendMessages.length === 0) return

      fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/${chat.id}/messages`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessTokenRef.current}`,
        },
        body: JSON.stringify({
          lastActiveAt: new Date(chat.lastActiveAt).toISOString(),
          messages: backendMessages,
        }),
        keepalive: true,
      }).catch(() => {
        // best-effort: la página ya se está cerrando, no hay nada más que hacer
      })
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  return {
    /** Sincroniza el chat activo. Úsalo tras cada respuesta del bot (allowCreate: false por defecto). */
    syncChat,
    /** Acción del botón "Guardar chat": guarda (crea si hace falta) y cierra la sesión activa. */
    saveAndCloseChat,
  }
}
