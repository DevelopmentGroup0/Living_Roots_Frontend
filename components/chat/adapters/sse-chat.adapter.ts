import { streamApiRequest } from '@/services/stream-api-client'

import { ChatMessage } from '../types/chat.types'

interface SendMessageParams {
  messages: ChatMessage[]
  onChunk: (chunk: string) => void
}

export async function streamChat({ messages, onChunk }: SendMessageParams) {
  return streamApiRequest({
    endpoint: '/chat/generate',
    body: { messages },
    onChunk,
  })
}
