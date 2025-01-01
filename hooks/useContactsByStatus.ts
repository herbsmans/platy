import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface StatusData {
  id: string;
  name: string;
  count: number;
  percentage: number;
}

export function useContactsByStatus() {
  const [statusData, setStatusData] = useState<StatusData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadContactsByStatus() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        // Get contacts count by status
        const { data: contacts, error: contactsError } = await supabase
          .from('contacts')
          .select(`
            status_id,
            default_crm_statuses (
              id,
              name
            )
          `)
          .eq('user_id', user.id);

        if (contactsError) throw contactsError;

        // Calculate counts and percentages
        const statusCounts = contacts.reduce((acc: Record<string, number>, contact) => {
          const statusId = contact.status_id;
          acc[statusId] = (acc[statusId] || 0) + 1;
          return acc;
        }, {});

        const totalContacts = contacts.length;

        const statusDataArray = Object.entries(statusCounts).map(([statusId, count]) => {
          const status = contacts.find(c => c.status_id === statusId)?.default_crm_statuses;
          return {
            id: statusId,
            name: status?.name || 'Unknown',
            count,
            percentage: totalContacts ? (count / totalContacts) * 100 : 0
          };
        });

        setStatusData(statusDataArray);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load status data');
      } finally {
        setLoading(false);
      }
    }

    loadContactsByStatus();
  }, []);

  return { statusData, loading, error };
}