import { useQuery, UseQueryResult } from '@tanstack/react-query';
import axios from 'axios';

import { CONFIG } from '@/global/config.ts';

import { IChatBotResponse } from '../types';

export const botId = 'botdea9bfcb';

export const useFetchChatBotInfor = () => {
  const { data, isLoading, status }: UseQueryResult<IChatBotResponse, any> = useQuery({
    queryKey: ['chat-bot-info', botId],
    queryFn: async () => {
      const data = await axios.get(
        `${CONFIG.BASE_API_URL}/bot_info/get_chatbot_info/?bot_id=${botId}`,
      );
      return data.data;
    },
    staleTime: Infinity,
  });
  return { data, isLoading, status };
};
