import { useMutation, useQueryClient } from '@tanstack/react-query'
import { renameChat, deleteChat } from '@/services/chat-service'
import { useChatStore } from '@/store/useChatStore'
import { chatHistoryKeys } from '@/constants/chat-history-keys'

export function useRenameChatMutation() {
  const queryClient = useQueryClient()
  const updateChatTitleLocal = useChatStore((s) => s.updateChatTitle)

  return useMutation({
    mutationFn: ({ chatId, title }: { chatId: string; title: string }) =>
      renameChat(chatId, title),
    onSuccess: (_data, { chatId, title }) => {
      // Si ese chat está abierto ahora mismo, su título se actualiza también ahí.
      updateChatTitleLocal(chatId, title)
      queryClient.invalidateQueries({ queryKey: chatHistoryKeys.all })
    },
  })
}

export function useDeleteChatMutation() {
  const queryClient = useQueryClient()
  const deleteChatLocal = useChatStore((s) => s.deleteChat)
  const selectedChatId = useChatStore((s) => s.selectedChatId)
  const clearSelectedChat = useChatStore((s) => s.clearSelectedChat)

  return useMutation({
    mutationFn: (chatId: string) => deleteChat(chatId),
    onSuccess: (_data, chatId) => {
      deleteChatLocal(chatId) // lo saca del store local si estaba cacheado
      if (selectedChatId === chatId) clearSelectedChat()
      queryClient.invalidateQueries({ queryKey: chatHistoryKeys.all })
    },
  })
}
