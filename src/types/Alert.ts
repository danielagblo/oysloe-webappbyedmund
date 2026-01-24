export interface Alert {
  id: number;
  user: number;
  title: string;
  body?: string;
  kind?: string;
  is_read?: boolean;
  created_at: string;
}
