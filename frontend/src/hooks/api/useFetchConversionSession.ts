import { useQuery } from '@tanstack/react-query';

import { useToast } from '@/components/ui/use-toast';
import { endpoints } from '@/global/endpoints';
import http from '@/utils/http';

export function useFetchConversionSession(rest: any = {}) {
  const { toast } = useToast();

  const fetchConversion = () => {
    const updatedEndpoints = endpoints.total_sessions;
    return http().get(updatedEndpoints);
  };

  return useQuery(['fetch', 'total-session'], fetchConversion, {
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
