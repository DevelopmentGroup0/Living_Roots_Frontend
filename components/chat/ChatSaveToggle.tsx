import React from 'react'
import {
  useChatStore,
  selectChats,
  selectSelectedChatId,
} from '@/store/useChatStore'
import { Check, CloudUpload, Loader2 } from 'lucide-react'

interface ChatSaveToggleProps {
  onSave?: () => void
  isSaving?: boolean
}

export const ChatSaveToggle: React.FC<ChatSaveToggleProps> = ({
  onSave,
  isSaving = false,
}) => {
  const chats = useChatStore(selectChats)
  const selectedChatId = useChatStore(selectSelectedChatId)

  // 1. Validar si el chat actual existe en el array de chats del store
  const isSaved = chats.some((chat) => chat.id === selectedChatId)

  return (
    <div className='flex items-center'>
      {isSaved && selectedChatId !== 'nosaved' ? (
        // Estado: Guardado (Informativo con transición suave)
        <div className='flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full shadow-sm transition-all duration-300 ease-in-out'>
          {isSaving ? (
            <>
              <Loader2 className='w-3.5 h-3.5 animate-spin text-emerald-600' />
              <span>Guardando...</span>
            </>
          ) : (
            <>
              <div className='w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-white transition-transform duration-300 scale-100'>
                <Check className='w-3 h-3 stroke-3' />
              </div>
              <span>Guardado</span>
            </>
          )}
        </div>
      ) : (
        // Estado: No guardado (Funciona como botón interactivo)
        <button
          onClick={onSave}
          disabled={isSaving}
          className='flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-full shadow-sm transition-all duration-200 cursor-pointer disabled:opacity-50'
          title='Haz clic para guardar este chat'
        >
          {isSaving ? (
            <>
              <Loader2 className='w-3.5 h-3.5 animate-spin text-amber-700' />
              <span>Guardando...</span>
            </>
          ) : (
            <>
              <CloudUpload className='w-3.5 h-3.5 text-amber-700' />
              <span>Guardar chat</span>
            </>
          )}
        </button>
      )}
    </div>
  )
}
