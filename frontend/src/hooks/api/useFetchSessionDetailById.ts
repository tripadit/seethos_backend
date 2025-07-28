import { useQuery } from '@tanstack/react-query';

import { useToast } from '@/components/ui/use-toast';
import { endpoints } from '@/global/endpoints';
import http from '@/utils/http';

export function useFetchSessionDetail(chatBotID: string, sessionId: string, rest: any = {}) {
  const { toast } = useToast();

  const fetchSessionDetail = (chatBotID: string, sessionId: string) => {
    const updatedEndpoints =
      endpoints.getSessionInfo.replace(':id', chatBotID) + '?session_id=' + sessionId;
    return http().get(updatedEndpoints);
  };

  return useQuery(
    ['fetch', 'session', chatBotID, sessionId],
    () => fetchSessionDetail(chatBotID, sessionId),
    {
      enabled: !!chatBotID || !!sessionId,
      onError: (error: { error?: string }) => {
        toast({
          variant: 'destructive',
          title: `${error?.error || 'Error occured while fetching the session detail!'}`,
          description: 'Please try again later.',
        });
      },
      ...rest,
    },
  );
}
