import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { UIMessage } from 'ai'

import type {
  ChatStore,
  ChatSession,
} from '../components/chat/types/chat.types'

// ─────────────────────────────────────────────
// Estado inicial
// ─────────────────────────────────────────────

const INITIAL_STATE = {
  chats: [],
  selectedChatId: null,
  selectedMessages: [],
}

// ─────────────────────────────────────────────
// Store
// ─────────────────────────────────────────────

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,
      // ───────────────────────────────────
      // Crear chat
      // ───────────────────────────────────

      createChat: (chat: ChatSession) => {
        set((state) => ({
          chats: [...state.chats, chat],
          selectedChatId: chat.id,
          selectedMessages: chat.messages,
        }))
      },

      // ───────────────────────────────────
      // Seleccionar chat
      // ───────────────────────────────────

      setSelectedChat: (chatId: string) => {
        const chat = get().chats.find((c) => c.id === chatId)
        if (!chat) return
        set({
          selectedChatId: chatId,
          selectedMessages: chat.messages,
        })
      },

      // ───────────────────────────────────
      // Actualizar mensajes
      // ───────────────────────────────────
      updateSelectedMessages: (messages: UIMessage[]) => {
        const selectedChatId = get().selectedChatId
        if (!selectedChatId) return
        set((state) => ({
          selectedMessages: messages,
          chats: state.chats.map((chat) =>
            chat.id === selectedChatId
              ? {
                  ...chat,
                  messages,
                  updatedAt: Date.now(),
                  lastActiveAt: Date.now(),
                }
              : chat,
          ),
        }))
      },

      // ───────────────────────────────────
      // Actualizar título
      // ───────────────────────────────────
      updateChatTitle: (chatId: string, title: string) => {
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === chatId
              ? {
                  ...chat,
                  title,
                }
              : chat,
          ),
        }))
      },

      // ───────────────────────────────────
      // Actualizar actividad
      // ───────────────────────────────────
      updateLastActivity: (chatId: string) => {
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === chatId
              ? {
                  ...chat,
                  lastActiveAt: Date.now(),
                }
              : chat,
          ),
        }))
      },

      // ───────────────────────────────────
      // Eliminar chat
      // ───────────────────────────────────

      deleteChat: (chatId: string) => {
        set((state) => ({
          chats: state.chats.filter((chat) => chat.id !== chatId),
          selectedChatId:
            state.selectedChatId === chatId ? null : state.selectedChatId,
          selectedMessages:
            state.selectedChatId === chatId ? [] : state.selectedMessages,
        }))
      },

      // ───────────────────────────────────
      // Limpiar selección
      // ───────────────────────────────────

      clearSelectedChat: () => {
        set({
          selectedChatId: null,
          selectedMessages: [],
        })
      },

      // ───────────────────────────────────
      // Logout
      // ───────────────────────────────────

      resetStore: () => {
        set(INITIAL_STATE)
      },
    }),

    // ─────────────────────────────────────
    // Persist
    // ─────────────────────────────────────

    {
      name: 'ai-chat-storage',

      storage: createJSONStorage(() => {
        if (typeof window === 'undefined') {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          }
        }
        return localStorage
      }),

      partialize: (state) => ({
        chats: state.chats,
        selectedChatId: state.selectedChatId,
        selectedMessages: state.selectedMessages,
      }),
    },
  ),
)

// ─────────────────────────────────────────────
// Selectores
// ─────────────────────────────────────────────

export const selectChats = (s: ChatStore) => s.chats
export const selectSelectedChatId = (s: ChatStore) => s.selectedChatId
export const selectSelectedMessages = (s: ChatStore) => s.selectedMessages
export const selectCurrentChat = (s: ChatStore) =>
  s.chats.find((chat) => chat.id === s.selectedChatId)
export const selectHasActiveConversation = (s: ChatStore) =>
  s.selectedMessages.length > 0
