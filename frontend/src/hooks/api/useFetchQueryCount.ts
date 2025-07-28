import { useQuery } from '@tanstack/react-query';

import { useToast } from '@/components/ui/use-toast';
import { endpoints } from '@/global/endpoints';
import http from '@/utils/http';

export function useFetchQueryCount(rest: any = {}) {
  const { toast } = useToast();

  const fetchQueryCount = () => {
    const updatedEndpoints = endpoints.queryCount;
    return http().get(updatedEndpoints);
  };

  return useQuery(['fetch', 'query-count'], fetchQueryCount, {
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
