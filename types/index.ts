export interface Contact {
  id: string;
  user_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  status_id: string;
  created_at: string;
  updated_at: string;
}

export interface CRMStatus {
  id: string;
  name: string;
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}