import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { UIMessage } from 'ai'

import type {
  ChatStore,
  ChatSession,
} from '../components/chat/types/chat.types'

const INITIAL_STATE = {
  chats: [] as ChatSession[],
  selectedChatId: null as string | null,
  selectedMessages: [] as UIMessage[],
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      createChat: (chat) => {
        const session: ChatSession = { ...chat, persistedMessageCount: 0 }
        set((state) => ({
          chats: [...state.chats, session],
          selectedChatId: session.id,
          selectedMessages: session.messages,
        }))
      },

      setSelectedChat: (chatId) => {
        const chat = get().chats.find((c) => c.id === chatId)
        if (!chat) return
        set({ selectedChatId: chatId, selectedMessages: chat.messages })
      },

      updateSelectedMessages: (messages) => {
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

      updateChatTitle: (chatId, title) => {
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === chatId ? { ...chat, title } : chat,
          ),
        }))
      },

      updateLastActivity: (chatId) => {
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === chatId ? { ...chat, lastActiveAt: Date.now() } : chat,
          ),
        }))
      },

      deleteChat: (chatId) => {
        set((state) => ({
          chats: state.chats.filter((chat) => chat.id !== chatId),
          selectedChatId:
            state.selectedChatId === chatId ? null : state.selectedChatId,
          selectedMessages:
            state.selectedChatId === chatId ? [] : state.selectedMessages,
        }))
      },

      clearSelectedChat: () => {
        set({ selectedChatId: null, selectedMessages: [] })
      },

      resetStore: () => {
        set(INITIAL_STATE)
      },

      resolveChatId: (localId, chatId) => {
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === localId ? { ...chat, id: chatId } : chat,
          ),
          selectedChatId:
            state.selectedChatId === localId ? chatId : state.selectedChatId,
        }))
      },

      setPersistedCount: (chatId, count) => {
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === chatId
              ? { ...chat, persistedMessageCount: count }
              : chat,
          ),
        }))
      },
      hydrateChat: (chat) => {
        set((state) => {
          const exists = state.chats.some((c) => c.id === chat.id)
          return {
            chats: exists
              ? state.chats.map((c) => (c.id === chat.id ? chat : c))
              : [...state.chats, chat],
            selectedChatId: chat.id,
            selectedMessages: chat.messages,
          }
        })
      },
    }),

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

export const selectChats = (s: ChatStore) => s.chats
export const selectSelectedChatId = (s: ChatStore) => s.selectedChatId
export const selectSelectedMessages = (s: ChatStore) => s.selectedMessages
export const selectCurrentChat = (s: ChatStore) =>
  s.chats.find((chat) => chat.id === s.selectedChatId)
export const selectHasActiveConversation = (s: ChatStore) =>
  s.selectedMessages.length > 0
