import { useQuery } from '@tanstack/react-query'
import { getChatHistory } from '../services/chat-service'
import { chatHistoryKeys } from '../constants/chat-history-keys'

const PREVIEW_LIMIT = 5

export function useChatHistoryPreview() {
  return useQuery({
    queryKey: chatHistoryKeys.preview(),
    queryFn: () =>
      getChatHistory({ page: 1, limit: PREVIEW_LIMIT, sortBy: 'lastActiveAt' }),
  })
}
