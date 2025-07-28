import { useQuery } from '@tanstack/react-query';

import { useToast } from '@/components/ui/use-toast';
import { endpoints } from '@/global/endpoints';
import http from '@/utils/http';

export function useFetchPeakHoursByBotId(id: string, rest: any = {}) {
  const { toast } = useToast();

  const fetchPeakHoursByBotId = () => {
    let updatedEndpoints = endpoints.peakHours.replace(':id', id);

    return http().get(updatedEndpoints);
  };

  return useQuery(['fetch', 'peak-hours', id], fetchPeakHoursByBotId, {
    enabled: !!id,
    onError: (error: { error?: string }) => {
      toast({
        variant: 'destructive',
        title: `${error?.error || 'Something went wrong!'}`,
        description: 'Please try again later.',
      });
    },
    ...rest,
  });
}
