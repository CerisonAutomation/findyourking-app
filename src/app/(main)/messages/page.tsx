'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { ConversationList } from '@/components/chat/conversation-list'
import { ChatWindow } from '@/components/chat/chat-window'
import { MessageSquare } from 'lucide-react'

export default function MessagesPage() {
  const [conversations, setConversations] = useState([])
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchConversations()
  }, [])

  const fetchConversations = async () => {
    try {
      setLoading(true)
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) return

      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          participant_1:participant_1_id(id, display_name, avatar_url, is_online),
          participant_2:participant_2_id(id, display_name, avatar_url, is_online)
        `)
        .or(`participant_1_id.eq.${userData.user.id},participant_2_id.eq.${userData.user.id}`)
        .order('last_message_at', { ascending: false })

      if (error) throw error
      setConversations(data || [])
      if (data && data.length > 0) {
        setSelectedConversationId(data[0].id)
      }
    } catch (err) {
      console.error('Error fetching conversations:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-[calc(100vh-80px)] gap-4 p-4 md:p-6">
      {/* Conversation list */}
      <div className="w-full border-r border-slate-700 md:w-80">
        <div className="mb-4 flex items-center gap-2">
          <MessageSquare className="h-6 w-6" />
          <h1 className="text-2xl font-bold text-white">Messages</h1>
        </div>
        {loading ? (
          <div className="text-center text-slate-400">Loading...</div>
        ) : (
          <ConversationList
            conversations={conversations}
            selectedId={selectedConversationId}
            onSelect={setSelectedConversationId}
          />
        )}
      </div>

      {/* Chat window */}
      <div className="hidden flex-1 md:flex">
        {selectedConversationId ? (
          <ChatWindow conversationId={selectedConversationId} />
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-400">
            <MessageSquare className="mb-4 h-12 w-12" />
            <p>Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  )
}
