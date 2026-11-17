'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { MessageCircle, X } from 'lucide-react'
import { toast } from 'sonner'
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

import { useProfile } from '@/hooks/mutations/useProfile'
import { useChatSession } from '@/hooks/useChatSession'
import { useSession } from 'next-auth/react'
import { ChatSaveToggle } from './ChatSaveToggle'
import { TypewriterResponse } from './TypewriterResponse'

type TranslationSegment = {
  es: string
  nsy: string | null
  tier: 1 | 2 | 3
  status: 'traducido' | 'conservado_en_español' | 'no_verificada'
}

type TranslationPayload = {
  text_es: string
  text_nsy: string
  segments: TranslationSegment[]
  warning?: { code: 'TRANSLATION_UNAVAILABLE' }
}

function isTranslationPart(
  part: unknown
): part is { type: 'data-translation'; data: TranslationPayload } {
  if (!part || typeof part !== 'object') return false
  const value = part as Record<string, unknown>
  if (
    value.type !== 'data-translation' ||
    !value.data ||
    typeof value.data !== 'object'
  ) {
    return false
  }
  const data = value.data as Record<string, unknown>
  return (
    typeof data.text_es === 'string' &&
    typeof data.text_nsy === 'string' &&
    Array.isArray(data.segments) &&
    data.segments.every((segment) => {
      if (!segment || typeof segment !== 'object') return false
      const item = segment as Record<string, unknown>
      return (
        typeof item.es === 'string' &&
        (typeof item.nsy === 'string' || item.nsy === null) &&
        [1, 2, 3].includes(item.tier as number) &&
        ['traducido', 'conservado_en_español', 'no_verificada'].includes(
          item.status as string
        )
      )
    })
  )
}

function TranslationView({ data }: { data: TranslationPayload }) {
  const tierClass: Record<TranslationSegment['tier'], string> = {
    1: 'bg-emerald-100 text-emerald-900',
    2: 'bg-amber-100 text-amber-950 underline decoration-dotted',
    3: 'bg-gray-100 text-gray-700',
  }

  return (
    <section className='w-full space-y-3' aria-label='Respuesta traducida'>
      {data.warning?.code === 'TRANSLATION_UNAVAILABLE' && (
        <p
          role='status'
          className='rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900'
        >
          No fue posible traducir esta respuesta; se muestra en español.
        </p>
      )}
      <div className='grid gap-3 md:grid-cols-2'>
        <article className='rounded-lg border bg-white p-3'>
          <h3 className='mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500'>
            Español
          </h3>
          <p className='whitespace-pre-wrap text-sm'>{data.text_es}</p>
        </article>
        <article className='rounded-lg border bg-white p-3'>
          <h3 className='mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500'>
            Nasa Yuwe · Morales, Cauca
          </h3>
          <p className='whitespace-pre-wrap text-sm'>
            {data.segments.map((segment, index) => (
              <span
                key={`${index}-${segment.tier}`}
                className={`rounded px-0.5 ${tierClass[segment.tier]}`}
                title={
                  segment.tier === 1
                    ? 'Traducción validada'
                    : segment.tier === 2
                      ? 'Traducción automática pendiente de validación'
                      : 'Conservado en español'
                }
              >
                {segment.nsy ?? segment.es}
              </span>
            ))}
          </p>
          <p className='mt-3 text-xs text-gray-500'>
            <span className='mr-3'>Validado</span>
            <span className='mr-3 text-amber-800'>Pendiente de validación</span>
            <span>Conservado en español</span>
          </p>
        </article>
      </div>
    </section>
  )
}

export function Chat({ isExpanded, onExpandedChange }: ChatProps) {
  const { data: session } = useSession()
  const userId = session?.user?.id ?? ''
  const {
    user,
    isLoading: isProfileLoading,
    error: profileError,
    updateProfile,
    isUpdating: isUpdatingProfile,
  } = useProfile(userId)

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

  const isLoading = status === 'streaming' || status === 'submitted'
  const preferredLanguage = user?.preferredLanguage ?? 'ES'

  useEffect(() => {
    if (isExpanded && profileError) {
      toast.error(
        profileError instanceof Error
          ? profileError.message
          : 'No se pudo cargar la preferencia de idioma.'
      )
    }
  }, [isExpanded, profileError])

  console.log('status:', status)
  console.log('📨 Mostrando Messages:', selectedMessages)
  console.log('Id del chat seleccionado:', selectedChatId)

  const updatePreferredLanguage = async (language: 'ES' | 'NSY') => {
    if (!user || language === preferredLanguage || isUpdatingProfile) return

    try {
      await updateProfile({ preferredLanguage: language })
      toast.success(
        `Idioma de respuesta: ${language === 'ES' ? 'Español' : 'Nasa Yuwe'}`
      )
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'No se pudo guardar el idioma de respuesta.'
      )
    }
  }

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
            <div
              className='flex items-center rounded-full border border-gray-200 bg-gray-100 p-0.5'
              role='group'
              aria-label='Idioma de respuesta'
              aria-busy={isProfileLoading || isUpdatingProfile}
              title={
                profileError
                  ? 'No se pudo cargar la preferencia de idioma.'
                  : undefined
              }
            >
              <Button
                type='button'
                size='sm'
                variant={preferredLanguage === 'ES' ? 'secondary' : 'ghost'}
                className='h-7 px-2 text-xs'
                aria-pressed={preferredLanguage === 'ES'}
                disabled={
                  isProfileLoading || isUpdatingProfile || !user
                }
                onClick={() => void updatePreferredLanguage('ES')}
              >
                Español
              </Button>
              <Button
                type='button'
                size='sm'
                variant={preferredLanguage === 'NSY' ? 'secondary' : 'ghost'}
                className='h-7 px-2 text-xs'
                aria-pressed={preferredLanguage === 'NSY'}
                disabled={
                  isProfileLoading || isUpdatingProfile || !user
                }
                onClick={() => void updatePreferredLanguage('NSY')}
              >
                Nasa Yuwe
              </Button>
            </div>
            {profileError && (
              <span className='sr-only' role='alert'>
                No se pudo cargar la preferencia de idioma.
              </span>
            )}
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
                          if (isTranslationPart(part)) {
                            return (
                              <TranslationView
                                key={index}
                                data={part.data}
                              />
                            )
                          }
                          if (part.type === 'text') {
                            if (
                              message.role === 'assistant' &&
                              message.parts.some(isTranslationPart)
                            ) {
                              return null
                            }
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
            disabled={isLoading || isUpdatingProfile}
            rows={1}
            className='flex-1'
          />
          <PromptInputSubmit
            disabled={isLoading || isUpdatingProfile || !input.trim()}
          />
        </PromptInput>
      </div>
    </motion.div>
  )
}
