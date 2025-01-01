export interface ChatHistoryEntry {
  id: string;
  user_id: string;
  instance_name: string;
  from_me: boolean;
  phone_number: string;
  remote_jid: number;
  message: string;
  created_at: string;
  contact_id: string | null;
  display_name: string;
  status_id?: string;
  profile_picture?: string | null;
  status_ia?: 's' | 'n';
}