import { useCallback, useState } from 'react'
import { useChatStore } from '@/store/useChatStore'
import { getChatDetail } from '../services/chat-service'
import { toChatSession } from '@/components/chat/chat-mappers'

export function useOpenChatFromHistory(userId: string) {
  const hydrateChat = useChatStore((s) => s.hydrateChat)
  const [loadingChatId, setLoadingChatId] = useState<string | null>(null)

  const openChat = useCallback(
    async (chatId: string) => {
      setLoadingChatId(chatId)
      try {
        const detail = await getChatDetail(chatId)
        const logueo = toChatSession(detail, userId)
        console.log('UseOpenChatFromHistory', logueo)
        hydrateChat(logueo)
      } finally {
        setLoadingChatId(null)
      }
    },
    [hydrateChat, userId],
  )

  return { openChat, loadingChatId }
}
