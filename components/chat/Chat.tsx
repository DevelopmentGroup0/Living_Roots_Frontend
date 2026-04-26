import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { MessageCircle, X, Plus, Wrench, ChevronDown, Mic } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Avatar, AvatarFallback } from '../../components/ui/avatar'
import { Card } from '../../components/ui/card'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ChatProps {
  isExpanded: boolean
  onExpandedChange: (expanded: boolean) => void
}

export function Chat({ isExpanded, onExpandedChange }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleInputFocus = () => {
    onExpandedChange(true)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isExpanded) {
      onExpandedChange(true)
    }
  }

  const handleClose = () => {
    onExpandedChange(false)
  }

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = { role: 'user', content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('http://localhost:4000/chat/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      })

      if (response.status === 429) {
        throw new Error('Demasiadas solicitudes. Por favor, espera un minuto.')
      }

      if (!response.body) throw new Error('No se pudo establecer el stream.')

      // Inicializamos el mensaje del asistente vacío
      setMessages((prev) => [...prev, { role: 'assistant', content: '' }])

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let done = false

      while (!done) {
        const { value, done: doneReading } = await reader.read()
        done = doneReading

        const chunkValue = decoder.decode(value)

        // El backend envía "data: {...}\n\n", debemos limpiar eso
        const lines = chunkValue.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.replace('data: ', ''))
              const content = data.content

              // Actualizamos el último mensaje (el del asistente) con el nuevo fragmento
              setMessages((prev) => {
                const lastMessage = prev[prev.length - 1]
                const otherMessages = prev.slice(0, -1)
                return [
                  ...otherMessages,
                  { ...lastMessage, content: lastMessage.content + content },
                ]
              })
            } catch (e) {
              // Fragmento incompleto o JSON inválido (ignorar)
            }
          }
        }
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error desconocido')
    } finally {
      setIsLoading(false)
    }
  }

  // Variante Cerrado/Mini: Widget flotante pequeño en bottom center
  const miniVariant = {
    width: '750px',
    height: '70px',
    bottom: '2rem',
    right: '50%',
    x: '50%',
    borderRadius: '40px',
  }

  // Variante Abierto/Lateral: Panel lateral derecho de altura completa
  const sidebarVariant = {
    width: '800px',
    height: '100vh',
    bottom: '0',
    right: '0',
    x: '0',
    borderRadius: '0',
  }

  return (
    <motion.div
      initial={false}
      animate={isExpanded ? sidebarVariant : miniVariant}
      transition={{
        duration: 0.3,
        ease: 'easeInOut',
      }}
      className='fixed bg-white shadow-2xl z-50 flex flex-col overflow-hidden'
      style={{
        border: isExpanded ? '1px solid #e5e7eb' : '1px solid #d1d5db',
      }}
    >
      {/* Header - Solo visible en variante Abierto/Lateral */}
      {isExpanded && (
        <div className='h-14 bg-white border-b border-gray-200 px-4 flex items-center justify-between shrink-0'>
          <div className='flex items-center gap-3'>
            <MessageCircle className='w-5 h-5 text-green-600' />
            <span className='font-semibold text-gray-900'>
              Asistente de Plantas
            </span>
          </div>
          <Button variant='ghost' size='icon' onClick={handleClose}>
            <X className='w-5 h-5' />
          </Button>
        </div>
      )}

      {/* Messages Area - Solo visible en variante Abierto/Lateral */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className='flex-1 overflow-y-auto p-4 bg-gray-50'
          >
            <div className='space-y-4'>
              <div className='flex gap-3'>
                <Avatar className='w-8 h-8 shrink-0'>
                  <AvatarFallback className='bg-green-600 text-white'>
                    <MessageCircle className='w-4 h-4' />
                  </AvatarFallback>
                </Avatar>
                <Card className='bg-white rounded-lg rounded-tl-none p-3 shadow-sm max-w-[80%] border-0'>
                  <p className='text-sm text-gray-800'>
                    ¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte con
                    tus plantas hoy?
                  </p>
                </Card>
              </div>
              {messages.map((m, i) => (
                <Card
                  key={i}
                  className={`p-2 rounded ${m.role === 'user' ? 'bg-blue-100 text-right' : 'bg-gray-100'}`}
                >
                  <p className='text-sm font-bold'>
                    {m.role === 'user' ? 'Tú' : 'IA'}
                  </p>
                  <p>{m.content}</p>
                </Card>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <div
        className={`bg-white shrink-0 ${isExpanded ? 'p-4 border-t border-gray-200' : 'px-5 py-3'}`}
      >
        <div className='flex items-center gap-2'>
          <Button variant='ghost' size='icon' className='rounded-full shrink-0'>
            <Plus className='w-5 h-5' />
          </Button>

          <div className='flex-1 relative'>
            <Input
              type='text'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              onFocus={handleInputFocus}
              onClick={handleInputFocus}
              onKeyPress={handleKeyPress}
              placeholder='Escribe tu consulta sobre medicina natural...'
              disabled={isLoading}
              className='bg-gray-50 border-0 rounded-full focus-visible:ring-green-500'
            />
          </div>

          {!isExpanded && (
            <>
              <Button
                onClick={sendMessage}
                disabled={isLoading}
                variant='ghost'
                size='icon'
                className='rounded-full shrink-0 disabled:bg-gray-400'
              >
                <Mic className='w-5 h-5' />
              </Button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  )
}
