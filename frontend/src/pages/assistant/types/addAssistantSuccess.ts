interface Account {
  id: string;
  email: string;
  full_name: string | null;
  subscription_type: string;
}

export interface IAssistant {
  custom_prompt?: string;
  account: Account;
  agent_role: string;
  avatar: string;
  bot_id: string;
  call_to_action_link: string;
  call_to_action_prompt: string;
  color: string | null;
  company_logo: string;
  company_name: string;
  container_id: string;
  conversation_end_flow: string;
  conversation_start_flow: string;
  conversion: number;
  created_at: string;
  cta_button_label: string | null;
  file: any[];
  greeting_message: string;
  greeting_tags: string[];
  id: string;
  landing_page_headline: string | null;
  landing_page_subheadline: string | null;
  language: string | null;
  name: string;
  question: string;
  session: number;
  sitemap_url: string | null;
  status: boolean;
  suggestive_tags: string[];
  timezone: string | null;
  traning_links: string[];
  traning_status: string;
  updated_at: string;
  company_description?: string;
  theme?: string;
  ideal_customer_profile?: string;
  location?: string;
}
