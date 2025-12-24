'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/header'
import { Sidebar } from '@/components/sidebar'
import { BottomNav } from '@/components/bottom-nav'
import { ConversationList } from '@/components/chat/conversation-list'
import { ChatWindow } from '@/components/chat/chat-window'
import { supabase } from '@/lib/supabase/client'

export default function MessagesPage() {
  const [conversations, setConversations] = useState([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
    }
    getUser()
  }, [])

  useEffect(() => {
    const fetchConversations = async () => {
      if (!user) return

      try {
        const { data, error } = await supabase
          .from('conversations')
          .select(`
            *,
            participant_1:profiles(display_name, avatar_url, is_online),
            participant_2:profiles(display_name, avatar_url, is_online)
          `)
          .or(`participant_1_id.eq.${user.id},participant_2_id.eq.${user.id}`)
          .order('last_message_at', { ascending: false })

        if (error) throw error
        setConversations(data || [])
        if (data && data.length > 0) {
          setSelectedId(data[0].id)
        }
      } catch (error) {
        console.error('Error fetching conversations:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchConversations()
  }, [user])

  return (
    <div className="flex h-screen flex-col bg-slate-900 md:flex-row">
      <div className="hidden md:block md:w-64 flex-shrink-0 border-r border-slate-700">
        <Sidebar />
      </div>

      <div className="flex flex-1 flex-col">
        <Header />

        <div className="flex-1 flex gap-4 overflow-hidden">
          {/* Conversations list */}
          <div className="hidden sm:flex sm:w-64 flex-col border-r border-slate-700 overflow-auto p-4">
            <h2 className="mb-4 text-xl font-bold text-white">Messages</h2>
            {loading ? (
              <div className="text-slate-400">Loading...</div>
            ) : (
              <ConversationList
                conversations={conversations}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
            )}
          </div>

          {/* Chat window */}
          <div className="flex-1 flex flex-col">
            {selectedId ? (
              <ChatWindow conversationId={selectedId} />
            ) : (
              <div className="flex items-center justify-center text-slate-400">
                Select a conversation to start messaging
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="md:hidden border-t border-slate-700">
        <BottomNav />
      </div>
    </div>
  )
}
