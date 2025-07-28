import { useQuery } from '@tanstack/react-query';

import { useToast } from '@/components/ui/use-toast';
import { endpoints } from '@/global/endpoints';
import http from '@/utils/http';

export function useFetchChatBot(search?: string, rest: any = {}) {
  const { toast } = useToast();

  const fetchChatBot = () => {
    let updatedEndpoints = endpoints.chatbot;
    if (search || search !== '' || search !== undefined) {
      updatedEndpoints = updatedEndpoints + `?search=${search}`;
    }
    return http().get(updatedEndpoints);
  };

  return useQuery(['fetch', 'bot', search], fetchChatBot, {
    onSuccess: (data) => {
      console.log('Fetched chatbot data:', data);
    },
    onError: (error: { error?: string }) => {
      toast({
        variant: 'destructive',
        title: `${error?.error || 'Error occured while fetching the chatbot!'}`,
        description: 'Please try again later.',
      });
    },
    ...rest,
  });
}
