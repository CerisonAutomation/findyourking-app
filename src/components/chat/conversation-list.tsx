'use client'

import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'

export function ConversationList({
  conversations,
  selectedId,
  onSelect,
}: {
  conversations: any[]
  selectedId: string | null
  onSelect: (id: string) => void
}) {
  if (conversations.length === 0) {
    return <div className="text-center text-slate-400">No conversations yet</div>
  }

  return (
    <div className="space-y-2">
      {conversations.map((conversation) => {
        const otherParticipant =
          conversation.participant_1_id === selectedId
            ? conversation.participant_2
            : conversation.participant_1

        return (
          <button
            key={conversation.id}
            onClick={() => onSelect(conversation.id)}
            className={cn(
              'w-full rounded-lg p-3 text-left transition-colors',
              selectedId === conversation.id
                ? 'bg-gold-500/20'
                : 'hover:bg-slate-700/50'
            )}
          >
            <div className="flex gap-3">
              <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full">
                {otherParticipant?.avatar_url ? (
                  <Image
                    src={otherParticipant.avatar_url}
                    alt={otherParticipant.display_name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-slate-700" />
                )}
                {otherParticipant?.is_online && (
                  <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-slate-800 bg-green-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white">{otherParticipant?.display_name}</p>
                <p className="truncate text-sm text-slate-400">
                  {conversation.last_message_at
                    ? formatDistanceToNow(new Date(conversation.last_message_at), { addSuffix: true })
                    : 'No messages'}
                </p>
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
