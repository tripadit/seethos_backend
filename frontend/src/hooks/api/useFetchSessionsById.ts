import { useQuery } from '@tanstack/react-query';

import { useToast } from '@/components/ui/use-toast';
import { endpoints } from '@/global/endpoints';
import http from '@/utils/http';

export function useFetchSessionList(chatBotID: string, search?: string, rest: any = {}) {
  const { toast } = useToast();

  const fetchSessions = (chatBotID: string, search?: string) => {
    let updatedEndpoints = endpoints.allSessionById.replace(':id', chatBotID);
    if (search || search !== '' || search !== undefined) {
      updatedEndpoints = updatedEndpoints + `?search=${search}`;
    }
    return http().get(updatedEndpoints);
  };

  return useQuery(
    ['fetch', 'sessions', chatBotID, search],
    () => fetchSessions(chatBotID, search),
    {
      enabled: !!chatBotID,
      onError: (error: { error?: string }) => {
        toast({
          variant: 'destructive',
          title: `${error?.error || 'Something went wrong!'}`,
          description: 'Please try again later.',
        });
      },
      ...rest,
    },
  );
}
