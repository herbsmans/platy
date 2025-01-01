export interface FollowupSettings {
  followup_interval_minutes: number;
  max_followups: number;
  is_active: boolean;
  quiet_hours_start: string;
  quiet_hours_end: string;
}