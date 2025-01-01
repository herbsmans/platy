import { useState } from 'react';
import { supabase } from '../lib/supabase';

export function useAIStatus(initialStatus: 's' | 'n', onStatusChange?: (status: 's' | 'n') => void) {
  const [status, setStatus] = useState<'s' | 'n'>(initialStatus);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleStatus = async (contactId: string) => {
    if (updating) return;

    try {
      setUpdating(true);
      setError(null);
      const newStatus = status === 's' ? 'n' : 's';

      // Optimistically update the UI
      setStatus(newStatus);
      
      const { error: updateError } = await supabase
        .from('contacts')
        .update({ status_ia: newStatus })
        .eq('id', contactId);

      if (updateError) {
        // Revert on error
        setStatus(status);
        throw updateError;
      }

      // Notify parent component of status change
      onStatusChange?.(newStatus);
    } catch (err) {
      console.error('Error updating AI status:', err);
      setError(err instanceof Error ? err.message : 'Failed to update AI status');
    } finally {
      setUpdating(false);
    }
  };

  return { status, updating, error, toggleStatus };
}