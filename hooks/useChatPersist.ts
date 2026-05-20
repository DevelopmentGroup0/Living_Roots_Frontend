import { useEffect, useRef, useCallback } from 'react'

import { useChatStore } from '@/store/useChatStore'
import { persistChat } from '../services/chat-service'
import type { UseChatPersistOptions } from '../components/chat/types/chat.types'

const DEFAULT_INACTIVITY_MS =
  Number(process.env.NEXT_PUBLIC_INACTIVITY_MS) || 30 * 60 * 1000

export function useChatPersist(options: UseChatPersistOptions = {}) {
  const { inactivityMs = DEFAULT_INACTIVITY_MS, onPersisted, onError } = options

  // ─────────────────────────────────────
  // Zustand selectors
  // ─────────────────────────────────────

  const chats = useChatStore((state) => state.chats)
  const selectedChatId = useChatStore((state) => state.selectedChatId)
  const clearSelectedChat = useChatStore((state) => state.clearSelectedChat)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const isPersistingRef = useRef(false)

  // ─────────────────────────────────────
  // Chat actual
  // ─────────────────────────────────────
  const currentChat = chats.find((chat) => chat.id === selectedChatId)

  // ─────────────────────────────────────
  // Persistencia principal
  // ─────────────────────────────────────
  const persist = useCallback(async () => {
    if (!currentChat) return false
    if (currentChat.messages.length === 0) {
      return false
    }

    if (isPersistingRef.current) {
      return false
    }

    isPersistingRef.current = true
    try {
      await persistChat({
        chatId: currentChat.id,
        userId: currentChat.userId,
        title: currentChat.title,
        lastActiveAt: new Date(currentChat.lastActiveAt).toISOString(),
        messages: currentChat.messages,
      })

      onPersisted?.(currentChat.id)
      return true
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      console.error('[useChatPersist]', error)
      onError?.(error)
      return false
    } finally {
      isPersistingRef.current = false
    }
  }, [currentChat, onPersisted, onError])

  // ─────────────────────────────────────
  // Persist manual
  // ─────────────────────────────────────
  const persistAndClear = useCallback(async () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    await persist()
    clearSelectedChat()
  }, [persist, clearSelectedChat])

  // ─────────────────────────────────────
  // Watch inactivity
  // ─────────────────────────────────────
  useEffect(() => {
    if (!currentChat) return
    if (currentChat.messages.length === 0) {
      return
    }

    const elapsed = Date.now() - currentChat.lastActiveAt
    if (elapsed >= inactivityMs) {
      void persistAndClear()
      return
    }

    const remaining = inactivityMs - elapsed

    timerRef.current = setTimeout(() => {
      void persistAndClear()
    }, remaining)

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [currentChat, inactivityMs, persistAndClear])

  // ─────────────────────────────────────
  // beforeunload
  // ─────────────────────────────────────
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (!currentChat) return
      if (currentChat.messages.length === 0) {
        return
      }
      navigator.sendBeacon(
        `${process.env.NEXT_PUBLIC_API_URL}/chat/persist`,
        new Blob(
          [
            JSON.stringify({
              chatId: currentChat.id,
              userId: currentChat.userId,
              title: currentChat.title,
              lastActiveAt: new Date(currentChat.lastActiveAt).toISOString(),
              messages: currentChat.messages,
            }),
          ],
          {
            type: 'application/json',
          },
        ),
      )
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [currentChat])

  return {
    persist,

    persistAndClear,
  }
}
