import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useUser() {
  const [userData, setUserData] = useState<{ 
    scheduling_system: string | null;
    scheduling_system_id: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Fetch user scheduling system
      const { data, error: fetchError } = await supabase
        .from('user_scheduling_systems')
        .select('scheduling_system, scheduling_system_id')
        .eq('user_id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;
      setUserData(data || null);
    } catch (err) {
      console.error('Error loading user data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const updateSchedulingSystem = async (systemName: string, systemId: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Use upsert with on_conflict parameter
      const { error: upsertError } = await supabase
        .from('user_scheduling_systems')
        .upsert({ 
          user_id: user.id,
          scheduling_system: systemName,
          scheduling_system_id: systemId
        }, {
          onConflict: 'user_id'
        });

      if (upsertError) throw upsertError;
      
      setUserData({
        scheduling_system: systemName,
        scheduling_system_id: systemId
      });
    } catch (err) {
      console.error('Error updating scheduling system:', err);
      setError(err instanceof Error ? err.message : 'Failed to update scheduling system');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  return {
    userData,
    loading,
    error,
    updateSchedulingSystem,
    refresh: loadUserData
  };
}