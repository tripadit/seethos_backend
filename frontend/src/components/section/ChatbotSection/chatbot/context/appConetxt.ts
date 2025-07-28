import { createContext } from 'react';

import { IChatBotHook } from '@/components/section/ChatbotSection/chatbot/types';

export const AppContext = createContext<IChatBotHook>({
  onMessageSent: () => {},
  scrollToBottom: () => {},
  chatBot: {},
  socket: undefined,
  messageTypeing: false,
  socketConnecting: false,
  socketConnectionError: false,
  messsages: [],
  socketDisconnected: false,
  setMessageTypeing: () => {},
  socketOnline: false,
  botId: '',
  onReconnect: () => {},
  onMessageEntered: () => {},
  isLoading: false,
  isTyping: false,
  ref: undefined,
  userMessageProcessing: false,
  mic: undefined,
  setEnableVoice: () => {},
  enableVoice: false,
  timer: 0,
  setTimeLeft: () => {},
  handleResetChatBot: () => {},
});
