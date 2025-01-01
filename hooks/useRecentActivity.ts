import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Activity {
  id: string;
  message: string;
  created_at: string;
}

export function useRecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadRecentActivity() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        // Get recent messages
        const { data: messages, error: messagesError } = await supabase
          .from('chat_history_with_contacts')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);

        if (messagesError) throw messagesError;

        const formattedActivities = messages.map(msg => ({
          id: msg.id,
          message: `${msg.from_me ? 'Sent to' : 'Received from'} ${msg.display_name}`,
          created_at: msg.created_at
        }));

        setActivities(formattedActivities);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load activity');
      } finally {
        setLoading(false);
      }
    }

    loadRecentActivity();
  }, []);

  return { activities, loading, error };
}