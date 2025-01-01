import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { CRMStatus } from '../types';

export function useStatuses() {
  const [statuses, setStatuses] = useState<CRMStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStatuses();
  }, []);

  const loadStatuses = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('default_crm_statuses')
        .select('*')
        .eq('is_active', true)
        .order('order');

      if (fetchError) throw fetchError;
      setStatuses(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading statuses');
    } finally {
      setLoading(false);
    }
  };

  return { statuses, loading, error, refresh: loadStatuses };
}