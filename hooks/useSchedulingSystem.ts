import { useState } from 'react';
import { supabase } from '../lib/supabase';
import type { SchedulingSystem } from '../types/team';

export function useSchedulingSystem() {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateSystem = async (
    systemName: string, 
    systemId: string,
    schedulingType?: 'dentist' | 'procedure'
  ) => {
    try {
      setUpdating(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error: upsertError } = await supabase
        .from('user_scheduling_systems')
        .upsert({ 
          user_id: user.id,
          scheduling_system: systemName,
          scheduling_system_id: systemId,
          scheduling_type: schedulingType
        }, {
          onConflict: 'user_id'
        });

      if (upsertError) throw upsertError;
      return true;
    } catch (err) {
      console.error('Error updating scheduling system:', err);
      setError(err instanceof Error ? err.message : 'Failed to update scheduling system');
      return false;
    } finally {
      setUpdating(false);
    }
  };

  return {
    updating,
    error,
    updateSystem
  };
}