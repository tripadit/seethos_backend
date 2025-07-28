import { useQuery } from '@tanstack/react-query';

import { useToast } from '@/components/ui/use-toast';
import { endpoints } from '@/global/endpoints';
import http from '@/utils/http';

export function useFetchAvgConversion(rest: any = {}) {
  const { toast } = useToast();

  const fetchAvgConversion = () => {
    const updatedEndpoints = endpoints.avg_time_to_conversion;
    return http().get(updatedEndpoints);
  };

  return useQuery(['fetch', 'avg-conversion'], fetchAvgConversion, {
    onError: (error: { error?: string }) => {
      toast({
        variant: 'destructive',
        title: `${error?.error || 'Error occured while fetching the average conversion data!'}`,
        description: 'Please try again later.',
      });
    },
    ...rest,
  });
}
