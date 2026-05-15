import { Card } from '@/components/ui/card'
import { ChatMessage as Message } from './types/chat.types'

interface Props {
  message: Message
}

export function ChatMessage({ message }: Props) {
  return (
    <Card
      className={`p-3 rounded-xl ${
        message.role === 'user' ? 'bg-green-100 ml-auto' : 'bg-white'
      }`}
    >
      <p className='text-sm whitespace-pre-wrap'>{message.content}</p>
    </Card>
  )
}
