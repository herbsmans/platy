import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { handleSupabaseError } from '../utils/error';
import type { ChatHistoryEntry } from '../types/chat';

export function useRealtimeChat() {
  const [messages, setMessages] = useState<ChatHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Load initial messages
  const loadMessages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      setUserId(user.id);

      const { data, error: fetchError } = await supabase
        .from('chat_history_with_contacts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setMessages(data || []);
    } catch (err) {
      const errorMessage = handleSupabaseError(err);
      console.error('Erro ao carregar histórico de chat:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update local message when contact status changes
  const updateMessageStatus = useCallback((contactId: string, status_ia: 's' | 'n') => {
    setMessages(currentMessages => 
      currentMessages.map(message => 
        message.contact_id === contactId
          ? { ...message, status_ia }
          : message
      )
    );
  }, []);

  useEffect(() => {
    loadMessages();

    // Subscribe only to chat history changes
    const channel = supabase
      .channel('realtime-chat')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_history',
          filter: userId ? `user_id=eq.${userId}` : undefined
        },
        async (payload) => {
          try {
            // Fetch complete message data including contact info
            const { data, error } = await supabase
              .from('chat_history_with_contacts')
              .select('*')
              .eq('id', payload.new.id)
              .single();

            if (error) throw error;
            if (data) {
              setMessages(currentMessages => [data, ...currentMessages]);
            }
          } catch (err) {
            console.error('Erro ao processar nova mensagem:', handleSupabaseError(err));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadMessages, userId]);

  return {
    messages,
    loading,
    error,
    refresh: loadMessages,
    updateMessageStatus
  };
}