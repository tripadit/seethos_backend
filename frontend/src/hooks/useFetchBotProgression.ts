import { useQuery } from '@tanstack/react-query';

import { useToast } from '@/components/ui/use-toast';
import { endpoints } from '@/global/endpoints';
import http from '@/utils/http';

export function useFetchBotProgression(id: string, rest: any = {}) {
  const { toast } = useToast();

  const fetchBotProgression = () => {
    let updatedEndpoints = endpoints.progressionbyBotId.replace(':id', id);
    return http().get(updatedEndpoints);
  };

  return useQuery(['fetch', 'progression', 'bot', id], fetchBotProgression, {
    enabled: !!id,
    onError: (error: { error?: string }) => {
      toast({
        variant: 'destructive',
        title: `${error?.error || 'Error occured while fetching record!'}`,
        description: 'Please try again later.',
      });
    },
    ...rest,
  });
}
