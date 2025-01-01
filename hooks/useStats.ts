import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface DashboardStats {
  totalContacts: number;
  totalMessages: number;
  activeChats: number;
  messagesToday: number;
}

export function useStats() {
  const [stats, setStats] = useState<DashboardStats>({
    totalContacts: 0,
    totalMessages: 0,
    activeChats: 0,
    messagesToday: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        // Get total contacts
        const { count: totalContacts } = await supabase
          .from('contacts')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        // Get total messages (excluding broadcast messages)
        const { count: totalMessages } = await supabase
          .from('chat_history')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .not('remote_jid', 'is', null);

        // Get active chats (messages in last 24 hours)
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        const { data: activeChatsData } = await supabase
          .from('chat_history')
          .select('remote_jid')
          .eq('user_id', user.id)
          .gt('created_at', yesterday.toISOString())
          .not('remote_jid', 'is', null);

        // Count unique remote_jids
        const uniqueChats = new Set(activeChatsData?.map(chat => chat.remote_jid));
        const activeChats = uniqueChats.size;

        // Get messages today
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const { count: messagesToday } = await supabase
          .from('chat_history')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .gt('created_at', today.toISOString())
          .not('remote_jid', 'is', null);

        setStats({
          totalContacts: totalContacts || 0,
          totalMessages: totalMessages || 0,
          activeChats,
          messagesToday: messagesToday || 0
        });
      } catch (err) {
        console.error('Error loading stats:', err);
        setError(err instanceof Error ? err.message : 'Failed to load stats');
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  return { stats, loading, error };
}