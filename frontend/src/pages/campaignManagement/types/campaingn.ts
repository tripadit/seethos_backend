export interface ICommmonList<T> {
  count: number;
  next?: number;
  previous: number;
  data: T[];
}
export interface ICampaingnList {
  account: string;
  file: string;
  id: number;
  number_of_emails_sent: number;
  leadgen_id?: number;
  prompt: string | null;
  status: string;
  subject: string | null;
  auto_reply?: boolean;
  follow_up_prompt: string | null;
  is_sample_generated?: boolean;
  sender_email?: string;
  chatbot?: number;
  reply_prompt?: string;
  reply_email?: string;
  is_last_email_seen?: boolean;
  name?: string;
}

export interface ISenderEmailList {
  account: string;
  created_at: string;
  email: string;
  id: number;
  is_active: boolean;
  is_primary: boolean;
  is_verified: boolean;
  updated_at: string;
}
export interface ICampaignListResponse extends ICommmonList<ICampaingnList> {}

export interface ISenderEmailListResponse extends ICommmonList<ISenderEmailList> {}

export enum CampaignType {
  EMAIL = 'AI Campaign',
  SEQUENCE = 'Sequence Campaign',
  NEWSLETTER = 'NEWSLETTER',
}
