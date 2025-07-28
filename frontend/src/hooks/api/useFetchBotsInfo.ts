import { useQuery } from '@tanstack/react-query';

import { useToast } from '@/components/ui/use-toast';
import { endpoints } from '@/global/endpoints';
import http from '@/utils/http';

export function useFetchBotInfo(rest: any = {}) {
  const { toast } = useToast();

  const fetchBotInfo = () => {
    const updatedEndpoints = endpoints.chatbotInfo;
    return http().get(updatedEndpoints);
  };

  return useQuery(['bot', 'info'], fetchBotInfo, {
    onError: (error: { error?: string }) => {
      toast({
        variant: 'destructive',
        title: `${error?.error || 'Error occured while fetching agent detail!'}`,
        description: 'Please try again later.',
      });
    },
    ...rest,
  });
}
