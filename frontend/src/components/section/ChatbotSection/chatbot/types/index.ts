export interface IChatBot extends IChatBotResponse {
  botId: string;
  showImages?: boolean;
}

export interface IChatBotResponse {
  avatar: string;
  company_logo: string;
  company_name: string;
  theme: 'light' | 'dark';
  name: string;
  greeting_message: string;
  greeting_tags: string[];
  status: boolean;
  socket_url: string;
  call_to_action_link: string;
}

export interface IChatBoteMessageContent {
  type: 'bot' | 'user';
  content: string;
  isLoading?: boolean;
  className?: string;
  uuid?: string;
  isActionButton?: boolean;
}

export interface IChatBotHook {
  onMessageSent: (message: string) => void;
  scrollToBottom: (next: () => void) => void;
  chatBot: any;
  socket: WebSocket | undefined;
  messageTypeing: boolean;
  socketConnecting: boolean;
  socketConnectionError: boolean;
  messsages: IChatBoteMessageContent[];
  socketDisconnected: boolean;
  setMessageTypeing: React.Dispatch<React.SetStateAction<boolean>>;
  socketOnline: boolean;
  botId: string;
  onReconnect: () => void;
  onMessageEntered: (message: string) => void;
  isLoading: boolean;
  isTyping: boolean;
  ref: any;
  userMessageProcessing: boolean;
  mic: any;
  setEnableVoice: React.Dispatch<React.SetStateAction<boolean>>;
  enableVoice: boolean;
  timer: number;
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
  handleResetChatBot: () => void;
}
