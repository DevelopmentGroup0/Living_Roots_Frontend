'use client'

import { useState } from 'react'
import { useChat } from '@ai-sdk/react'
import { motion, AnimatePresence } from 'motion/react'
import { MessageCircle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
} from '@/components/ai-elements/conversation'
import {
  Message,
  MessageContent,
  MessageResponse,
} from '@/components/ai-elements/message'
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputSubmit,
} from '@/components/ai-elements/prompt-input'

interface ChatProps {
  isExpanded: boolean
  onExpandedChange: (expanded: boolean) => void
}

const miniVariant = {
  width: '750px',
  height: '70px',
  bottom: '2rem',
  right: '50%',
  x: '50%',
  borderRadius: '40px',
}
const sidebarVariant = {
  width: '800px',
  height: '100vh',
  bottom: '0',
  right: '0',
  x: '0',
  borderRadius: '0',
}

export function Chat({ isExpanded, onExpandedChange }: ChatProps) {
  const [input, setInput] = useState('')

  const { messages, sendMessage, status, error } = useChat()

  console.log('status:', status)

  console.log('📨 Messages:', messages)

  const isLoading = status === 'streaming' || status === 'submitted'

  return (
    <motion.div
      initial={false}
      animate={isExpanded ? sidebarVariant : miniVariant}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className='fixed bg-white shadow-2xl z-50 flex flex-col overflow-hidden'
      style={{ border: `1px solid ${isExpanded ? '#e5e7eb' : '#d1d5db'}` }}
    >
      {isExpanded && (
        <div className='h-14 bg-white border-b border-gray-200 px-4 flex items-center justify-between shrink-0'>
          <div className='flex items-center gap-3'>
            <MessageCircle className='w-5 h-5 text-green-600' />
            <span className='font-semibold text-gray-900'>
              Asistente de Plantas
            </span>
          </div>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => onExpandedChange(false)}
          >
            <X className='w-5 h-5' />
          </Button>
        </div>
      )}

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className='flex-1 overflow-y-auto p-4 bg-gray-50'
          >
            <Conversation>
              <ConversationContent>
                {messages.length === 0 ? (
                  <ConversationEmptyState
                    title='Asistente Living Roots'
                    description='¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte con tus plantas hoy?'
                  />
                ) : (
                  messages.map((message) => (
                    <Message key={message.id} from={message.role}>
                      <MessageContent>
                        {message.role === 'assistant' ? (
                          <MessageResponse>
                            {message.parts
                              ?.filter((p) => p.type === 'text')
                              .map((p) => p.text)
                              .join('')}
                          </MessageResponse>
                        ) : (
                          message.parts
                            ?.filter((p) => p.type === 'text')
                            .map((p) => p.text)
                        )}
                      </MessageContent>
                    </Message>
                  ))
                )}
              </ConversationContent>
            </Conversation>

            {error && (
              <p className='text-sm text-red-500 text-center mt-4'>
                {error.message}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className='border-t p-4 bg-white shrink-0'>
        <PromptInput
          onSubmit={(message, event) => {
            event.preventDefault()
            console.log(messages, 'Salieron mensajes')

            if (message.text) {
              sendMessage({ text: message.text })
              setInput('')
            }
          }}
          className='max-w-3xl mx-auto flex gap-2 items-end'
        >
          <PromptInputTextarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Escribe tu consulta...'
            disabled={isLoading}
            rows={1}
            className='flex-1'
          />
          <PromptInputSubmit disabled={isLoading || !input.trim()} />
        </PromptInput>
      </div>
    </motion.div>
  )
}
