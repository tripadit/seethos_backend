import { useQuery } from '@tanstack/react-query';
import { jsonrepair } from 'jsonrepair';
import { useCallback } from 'react';

import { useToast } from '@/components/ui/use-toast';
import { endpoints } from '@/global/endpoints';
import http from '@/utils/http';

export function useFetchConversationAnalysis(chatBotID: string, sessionId: string, rest?: any) {
  const { toast } = useToast();

  const fetchConvDetail = (chatBotID: string, sessionId: string) => {
    const updatedEndpoints =
      endpoints.analyzeConversation.replace(':id', chatBotID) + '?session_id=' + sessionId;
    return http().get(updatedEndpoints);
  };

  return useQuery(
    ['fetch', 'conversation', chatBotID, sessionId],
    () => fetchConvDetail(chatBotID, sessionId),
    {
      ...rest,
      enabled: !!chatBotID || !!sessionId,
      onError: (error: { error?: string }) => {
        toast({
          variant: 'destructive',
          title: `${error?.error || 'Error occured while fetching the conversion analysis'}`,
          description: 'Please try again later.',
        });
      },

      select: useCallback((data: any) => onSelect(data), []),
    },
  );
}

const onSelect = (data: string) => {
  try {
    const newData = jsonrepair(data);
    return JSON.parse(newData);
  } catch (e) {
    return data;
  }
};
