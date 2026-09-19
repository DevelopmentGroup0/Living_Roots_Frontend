'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  MessageSquare,
  MoreVertical,
  Pencil,
  Trash2,
  ExternalLink,
  Check,
  X,
  Plus,
  Loader2,
} from 'lucide-react'

import { useChatStore } from '@/store/useChatStore'
import type { ApiChatSummary } from './types/chat.types'
import { useChatHistoryPreview } from '@/hooks/useChatHistoryPreview'
import { useOpenChatFromHistory } from '@/hooks/useOpenChatFromHistory'
import {
  useDeleteChatMutation,
  useRenameChatMutation,
} from '@/hooks/mutations/useChatHistoryMutations'

interface ChatSidemenuProps {
  userId: string
}

export function ChatSidemenu({ userId }: ChatSidemenuProps) {
  const selectedChatId = useChatStore((state) => state.selectedChatId)
  const clearSelectedChat = useChatStore((state) => state.clearSelectedChat)

  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)
  const [editingChatId, setEditingChatId] = useState<string | null>(null)
  const [newTitle, setNewTitle] = useState('')

  const { data, isLoading } = useChatHistoryPreview()
  const { openChat, loadingChatId } = useOpenChatFromHistory(userId)
  const renameMutation = useRenameChatMutation()
  const deleteMutation = useDeleteChatMutation()

  const chats = data?.data ?? []

  const handleRenameSubmit = (chatId: string) => {
    if (!newTitle.trim()) return
    renameMutation.mutate(
      { chatId, title: newTitle.trim() },
      { onSuccess: () => setEditingChatId(null) },
    )
  }

  return (
    <aside className='w-64 bg-zinc-900 text-zinc-200 flex flex-col h-full border-r border-zinc-800 p-3'>
      <button
        onClick={() => clearSelectedChat()}
        className='flex items-center gap-2 w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-100 px-3 py-2 rounded-lg text-sm font-medium transition mb-4'
      >
        <Plus size={16} />
        Nuevo chat
      </button>

      <div className='text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 px-2'>
        Historial reciente
      </div>

      <div className='flex-1 overflow-y-auto space-y-1'>
        {isLoading && (
          <div className='text-sm text-zinc-500 px-2 py-1'>Cargando...</div>
        )}

        {!isLoading && chats.length === 0 && (
          <div className='text-sm text-zinc-500 px-2 py-2'>
            Aún no tienes consultas guardadas.
          </div>
        )}

        {chats.map((chat: ApiChatSummary) => {
          const isSelected = selectedChatId === chat.chat_id
          const isEditing = editingChatId === chat.chat_id
          const isOpening = loadingChatId === chat.chat_id

          return (
            <div
              key={chat.chat_id}
              className={`group relative flex items-center justify-between rounded-lg px-2 py-2 text-sm transition hover:bg-zinc-800 ${
                isSelected
                  ? 'bg-zinc-800 text-white font-medium'
                  : 'text-zinc-400'
              }`}
            >
              {isEditing ? (
                <div className='flex items-center gap-1 w-full mr-2'>
                  <input
                    type='text'
                    defaultValue={chat.title ?? ''}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className='bg-zinc-950 text-white text-xs px-2 py-1 rounded border border-zinc-700 w-full outline-none focus:border-zinc-500'
                    autoFocus
                  />
                  <button
                    onClick={() => handleRenameSubmit(chat.chat_id)}
                    className='p-1 hover:text-green-400'
                    disabled={renameMutation.isPending}
                  >
                    <Check size={14} />
                  </button>
                  <button
                    onClick={() => setEditingChatId(null)}
                    className='p-1 hover:text-red-400'
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => openChat(chat.chat_id)}
                  disabled={isOpening}
                  className='flex items-center gap-2 truncate text-left flex-1'
                >
                  {isOpening ? (
                    <Loader2 size={16} className='shrink-0 animate-spin' />
                  ) : (
                    <MessageSquare size={16} className='shrink-0' />
                  )}
                  <span className='truncate'>
                    {chat.title || 'Nueva consulta'}
                  </span>
                </button>
              )}

              {!isEditing && (
                <div className='relative'>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setOpenDropdownId(
                        openDropdownId === chat.chat_id ? null : chat.chat_id,
                      )
                    }}
                    className='opacity-0 group-hover:opacity-100 p-1 hover:bg-zinc-700 rounded text-zinc-400 hover:text-white transition'
                  >
                    <MoreVertical size={16} />
                  </button>

                  {openDropdownId === chat.chat_id && (
                    <div className='absolute right-0 mt-1 w-32 bg-zinc-950 border border-zinc-800 rounded-lg shadow-xl py-1 z-50'>
                      <button
                        onClick={() => {
                          setEditingChatId(chat.chat_id)
                          setNewTitle(chat.title ?? '')
                          setOpenDropdownId(null)
                        }}
                        className='flex items-center gap-2 w-full px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-white'
                      >
                        <Pencil size={13} />
                        Renombrar
                      </button>
                      <button
                        onClick={() => {
                          deleteMutation.mutate(chat.chat_id)
                          setOpenDropdownId(null)
                        }}
                        className='flex items-center gap-2 w-full px-3 py-1.5 text-xs text-red-400 hover:bg-zinc-800 hover:text-red-300'
                      >
                        <Trash2 size={13} />
                        Eliminar
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className='pt-3 border-t border-zinc-800 mt-2'>
        <Link
          href='/chats'
          className='flex items-center justify-between w-full px-3 py-2 text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition'
        >
          <span>Ver todos los chats</span>
          <ExternalLink size={14} />
        </Link>
      </div>
    </aside>
  )
}
