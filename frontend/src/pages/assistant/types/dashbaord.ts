export type SessionType = {
  id: string;
  company_name: string;
  session: string;
  conversion: string;
  bot_id: string;
  status: 'active' | 'inactive';
  date_created: string;
  name?: string;
  created_at: string;
  avatar?: string;
  traning_status?: string;
};
