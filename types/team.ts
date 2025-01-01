export interface SchedulingSystem {
  id: string;
  name: string;
  required_fields: {
    [key: string]: {
      type: string;
      label: string;
      required: boolean;
    };
  };
  is_active: boolean;
}

export interface TeamMember {
  id: string;
  user_id: string;
  name: string;
  procedures: string[];
  additional_info: Record<string, any>;
  scheduling_configs: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}