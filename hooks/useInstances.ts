import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useInstances() {
  const [instances, setInstances] = useState<{ instance_name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadInstances = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { data, error: fetchError } = await supabase
          .from('whatsapp_instances')
          .select('instance_name')
          .eq('user_id', user.id)
          .order('instance_name');

        if (fetchError) throw fetchError;
        setInstances(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load instances');
      } finally {
        setLoading(false);
      }
    };

    loadInstances();
  }, []);

  return { instances, loading, error };
}