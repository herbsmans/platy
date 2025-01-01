import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { FollowupSettings } from '../types/followup';

const DEFAULT_SETTINGS: FollowupSettings = {
  followup_interval_minutes: 120,
  max_followups: 3,
  is_active: true,
  quiet_hours_start: '22:00',
  quiet_hours_end: '08:00'
};

export function useFollowupSettings() {
  const [settings, setSettings] = useState<FollowupSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error: fetchError } = await supabase
        .from('user_followup_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          // No settings found, create default ones
          const { data: newData, error: insertError } = await supabase
            .from('user_followup_settings')
            .insert({
              user_id: user.id,
              ...DEFAULT_SETTINGS
            })
            .select()
            .single();

          if (insertError) throw insertError;
          setSettings(newData);
        } else {
          throw fetchError;
        }
      } else {
        setSettings(data);
      }
    } catch (err) {
      console.error('Error loading follow-up settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<FollowupSettings>) => {
    try {
      setError(null);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error: updateError } = await supabase
        .from('user_followup_settings')
        .update(newSettings)
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      setSettings(prev => prev ? { ...prev, ...newSettings } : null);
      return true;
    } catch (err) {
      console.error('Error updating follow-up settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to update settings');
      return false;
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  return {
    settings,
    loading,
    error,
    updateSettings,
    refresh: loadSettings
  };
}