'use client'

import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { MessageCircle, X, Plus } from 'lucide-react'
import { MessageSquare } from 'lucide-react'
import { useChat, type UIMessage } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Conversation,
  ConversationContent,
  ConversationDownload,
  ConversationEmptyState,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation'
import {
  Message,
  MessageContent,
  MessageResponse,
} from '@/components/ai-elements/message'
import {
  PromptInput,
  type PromptInputMessage,
  PromptInputTextarea,
  PromptInputSubmit,
} from '@/components/ai-elements/prompt-input'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ChatProps {
  isExpanded: boolean
  onExpandedChange: (expanded: boolean) => void
}

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const MINI_VARIANT = {
  width: '750px',
  height: '70px',
  bottom: '2rem',
  right: '50%',
  x: '50%',
  borderRadius: '40px',
} as const

const SIDEBAR_VARIANT = {
  width: '800px',
  height: '100vh',
  bottom: '0',
  right: '0',
  x: '0',
  borderRadius: '0',
} as const

const TRANSITION = { duration: 0.3, ease: 'easeInOut' } as const

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function Chat({ isExpanded, onExpandedChange }: ChatProps) {
  const miniInputRef = useRef<HTMLInputElement>(null)

  const [input, setInput] = useState('')

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: 'http://localhost:4000/chat/generate',
    }),
  })

  const isStreaming = status === 'streaming'

  // -- Handlers --------------------------------------------------------------

  const handleOpen = () => onExpandedChange(true)
  const handleClose = () => onExpandedChange(false)

  /** Shared submit logic used by both the mini-input and the PromptInput */
  const handleSend = () => {
    const text = input.trim()
    if (!text || isStreaming) return
    sendMessage({ text })
    setInput('')
    if (!isExpanded) onExpandedChange(true)
  }

  const handleMiniKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend()
  }

  const handlePromptSubmit = (message: PromptInputMessage) => {
    const text = message.text.trim()
    if (!text || isStreaming) return
    sendMessage({ text })
    setInput('')
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <motion.div
      initial={false}
      animate={isExpanded ? SIDEBAR_VARIANT : MINI_VARIANT}
      transition={TRANSITION}
      className="fixed bg-white shadow-2xl z-50 flex flex-col overflow-hidden"
      style={{ border: '1px solid #e5e7eb' }}
    >
      {/* ------------------------------------------------------------------ */}
      {/* Header — visible only when expanded                                  */}
      {/* ------------------------------------------------------------------ */}
      <AnimatePresence>
        {isExpanded && (
          <motion.header
            key="header"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="h-14 bg-white border-b border-gray-200 px-4 flex items-center justify-between shrink-0"
          >
            <div className="flex items-center gap-3">
              <MessageCircle className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-gray-900">
                Asistente de Plantas
              </span>
            </div>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="w-5 h-5" />
            </Button>
          </motion.header>
        )}
      </AnimatePresence>

      {/* ------------------------------------------------------------------ */}
      {/* Messages area — visible only when expanded                           */}
      {/* ------------------------------------------------------------------ */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            key="messages"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col"
          >
            <Conversation>
              <ConversationContent>
                {messages.length === 0 ? (
                  <ConversationEmptyState
                    icon={<MessageSquare className="size-12" />}
                    title="Inicia una conversación"
                    description="Escribe tu consulta sobre medicina natural o plantas"
                  />
                ) : (
                  messages.map((message: UIMessage) => (
                    <Message from={message.role} key={message.id}>
                      <MessageContent>
                        {message.parts.map((part, i) => {
                          if (part.type !== 'text') return null
                          return (
                            <MessageResponse key={`${message.id}-${i}`}>
                              {part.text}
                            </MessageResponse>
                          )
                        })}
                      </MessageContent>
                    </Message>
                  ))
                )}
              </ConversationContent>

              <ConversationDownload messages={messages} />
              <ConversationScrollButton />
            </Conversation>

            {/* PromptInput — full-featured textarea with submit button */}
            <PromptInput
              onSubmit={handlePromptSubmit}
              className="mt-4 w-full max-w-2xl mx-auto relative"
            >
              <PromptInputTextarea
                value={input}
                placeholder="Escribe tu consulta..."
                onChange={(e) => setInput(e.currentTarget.value)}
                className="pr-12"
              />
              <PromptInputSubmit
                status={isStreaming ? 'streaming' : 'ready'}
                disabled={!input.trim()}
                className="absolute bottom-1 right-1"
              />
            </PromptInput>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ------------------------------------------------------------------ */}
      {/* Mini input bar — visible only when collapsed                         */}
      {/* ------------------------------------------------------------------ */}
      <AnimatePresence>
        {!isExpanded && (
          <motion.div
            key="mini-bar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="px-5 py-3 flex items-center gap-2 bg-white"
          >
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full shrink-0"
              onClick={handleOpen}
              aria-label="Abrir asistente"
            >
              <Plus className="w-5 h-5" />
            </Button>

            <Input
              ref={miniInputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={handleOpen}
              onKeyDown={handleMiniKeyDown}
              placeholder="Escribe tu consulta sobre medicina natural..."
              className="bg-gray-50 border-0 rounded-full focus-visible:ring-green-500"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
