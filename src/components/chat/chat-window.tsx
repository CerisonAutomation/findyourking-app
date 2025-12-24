'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send } from 'lucide-react'
import toast from 'react-hot-toast'

export function ChatWindow({ conversationId }: { conversationId: string }) {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMessages()
    subscribeToMessages()
  }, [conversationId])

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })

      if (error) throw error
      setMessages(data || [])
    } catch (err) {
      console.error('Error fetching messages:', err)
    } finally {
      setLoading(false)
    }
  }

  const subscribeToMessages = () => {
    const subscription = supabase
      .channel(`messages-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as any])
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    try {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) return

      const { error } = await supabase.from('messages').insert({
        conversation_id: conversationId,
        sender_id: userData.user.id,
        content: newMessage,
        message_type: 'text',
      })

      if (error) throw error
      setNewMessage('')
    } catch (err) {
      toast.error('Failed to send message')
    }
  }

  return (
    <div className="flex flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        {loading ? (
          <div className="text-center text-slate-400">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-slate-400">No messages yet</div>
        ) : (
          messages.map((msg: any) => (
            <div key={msg.id} className="text-slate-300 text-sm">
              <p>{msg.content}</p>
            </div>
          ))
        )}
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="border-t border-slate-700 p-4">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}
