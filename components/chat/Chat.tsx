'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { MessageCircle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
} from '@/components/ai-elements/conversation'
import { Message, MessageContent } from '@/components/ai-elements/message'
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputSubmit,
} from '@/components/ai-elements/prompt-input'

interface ChatProps {
  isExpanded: boolean
  onExpandedChange: (expanded: boolean) => void
}

// Los anchos usan min()/dvh para que el chat ocupe toda la pantalla en móvil
// y no pase de 800px en escritorio (antes era fijo y se salía de la vista).
const miniVariant = {
  width: 'min(750px, calc(100vw - 2rem))',
  height: '70px',
  bottom: '2rem',
  right: '50%',
  x: '50%',
  borderRadius: '40px',
}
const sidebarVariant = {
  width: 'min(800px, 100vw)',
  height: '100dvh',
  bottom: '0',
  right: '0',
  x: '0',
  borderRadius: '0',
}

import { useChatSession } from '@/hooks/useChatSession'
import { useSession } from 'next-auth/react'
import { ChatSaveToggle } from './ChatSaveToggle'
import { TypewriterResponse } from './TypewriterResponse'

export function Chat({ isExpanded, onExpandedChange }: ChatProps) {
  const { data: session } = useSession()

  const {
    selectedMessages,
    sendMessage,
    status,
    error,
    saveAndCloseChat,
    selectedChatId,
  } = useChatSession({
    userId: session?.user?.id || '',
    accessToken: session?.accessToken || '',
  })
  const [input, setInput] = useState('')
  console.log('status:', status)

  console.log('📨 Mostrando Messages:', selectedMessages)
  console.log('Id del chat seleccionado:', selectedChatId)

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
        <div className='h-14 relative bg-white border-b border-gray-200 px-3 sm:px-4 flex items-center justify-between gap-2 shrink-0'>
          <ChatSaveToggle
            onSave={() => void saveAndCloseChat()}
            isSaving={false}
          />
          <div className='flex items-center gap-3'>
            <MessageCircle className='w-5 h-5 text-green-600' />
            <span className='hidden font-semibold text-gray-900 min-[420px]:inline'>
              Asistente de Plantas
            </span>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => onExpandedChange(false)}
              aria-label='Cerrar asistente'
            >
              <X className='w-5 h-5' />
            </Button>
          </div>
        </div>
      )}

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className='flex min-h-0 flex-1 flex-col bg-gray-50'
          >
            {/* Conversation (use-stick-to-bottom) debe ser quien haga scroll:
                necesita una altura definida (flex-1 + min-h-0) y el contenedor
                padre NO debe tener overflow-y-auto, o el auto-scroll no actúa. */}
            <Conversation className='min-h-0 flex-1'>
              <ConversationContent className='p-4 sm:p-8'>
                {selectedMessages.length === 0 ? (
                  <ConversationEmptyState
                    title='Asistente Living Roots'
                    description='¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte con tus plantas hoy?'
                  />
                ) : (
                  selectedMessages.map((message, messageIndex) => (
                    <Message key={message.id} from={message.role}>
                      <MessageContent>
                        {message.parts.map((part, index) => {
                          if (part.type === 'text') {
                            return message.role === 'assistant' ? (
                              <TypewriterResponse
                                key={index}
                                text={part.text}
                                live={
                                  isLoading &&
                                  messageIndex === selectedMessages.length - 1
                                }
                              />
                            ) : (
                              <p key={index}>{part.text}</p>
                            )
                          }
                          if (part.type === 'reasoning') {
                            return (
                              <div
                                key={index}
                                className='text-xs text-gray-400 italic'
                              >
                                {part.text}
                              </div>
                            )
                          }
                          return null
                        })}
                      </MessageContent>
                    </Message>
                  ))
                )}
              </ConversationContent>
            </Conversation>

            {error && (
              <p className='shrink-0 px-4 pb-4 text-sm text-red-500 text-center'>
                {error.message}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className='border-t bg-white p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shrink-0 sm:p-4 sm:mr-5'>
        <PromptInput
          onSubmit={(message, event) => {
            event.preventDefault()
            if (!message.text.trim()) return
            sendMessage({
              text: message.text,
            })
            setInput('')
          }}
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
