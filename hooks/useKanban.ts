import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Contact, CRMStatus } from '../types';

export function useKanban() {
  const [statuses, setStatuses] = useState<CRMStatus[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load active statuses from default_crm_statuses
      const { data: statusesData, error: statusesError } = await supabase
        .from('default_crm_statuses')
        .select('*')
        .eq('is_active', true)
        .order('order');

      if (statusesError) throw statusesError;

      // Load contacts
      const { data: contactsData, error: contactsError } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at');

      if (contactsError) throw contactsError;

      setStatuses(statusesData);
      setContacts(contactsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading data');
    } finally {
      setLoading(false);
    }
  };

  const moveContact = async (contactId: string, newStatusId: string) => {
    try {
      const { error: updateError } = await supabase
        .from('contacts')
        .update({ status_id: newStatusId })
        .eq('id', contactId);

      if (updateError) throw updateError;

      // Update local state
      setContacts(prevContacts =>
        prevContacts.map(contact =>
          contact.id === contactId
            ? { ...contact, status_id: newStatusId }
            : contact
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error moving contact');
      // Reload data to ensure consistency
      await loadData();
    }
  };

  return {
    statuses,
    contacts,
    loading,
    error,
    moveContact,
    refresh: loadData
  };
}