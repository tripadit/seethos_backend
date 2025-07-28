import { useQuery } from '@tanstack/react-query';

import { useToast } from '@/components/ui/use-toast';
import { endpoints } from '@/global/endpoints';
import http from '@/utils/http';

export function useGetAllSessions(rest: any = {}) {
  const { toast } = useToast();

  const fetchAllSessions = () => {
    const updatedEndpoints = endpoints.getAllSession;
    return http().get(updatedEndpoints);
  };

  return useQuery(['sessions', 'all'], fetchAllSessions, {
    onError: (error: { error?: string }) => {
      toast({
        variant: 'destructive',
        title: `${error?.error || 'Error occured while fetching the agent detail!'}`,
        description: 'Please try again later.',
      });
    },
    ...rest,
  });
}
