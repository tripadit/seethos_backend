import { useQuery } from '@tanstack/react-query';

import { useToast } from '@/components/ui/use-toast';
import { endpoints } from '@/global/endpoints';
import http from '@/utils/http';

export function useFetchChatbot(chatBotID: string, rest: any = {}) {
  const { toast } = useToast();

  const fetchChatBot = (chatBotID: string) => {
    const updatedEndpoints = endpoints.chatBotDetail.replace(':id', chatBotID);
    return http().get(updatedEndpoints);
  };

  return useQuery(['chatbot-details', chatBotID], () => fetchChatBot(chatBotID), {
    enabled: !!chatBotID,
    onError: (error: { error?: string }) => {
      toast({
        variant: 'destructive',
        title: `${error?.error || 'Error occured while fetching the agent details!'}`,
        description: 'Please try again later.',
      });
    },
    ...rest,
  });
}
