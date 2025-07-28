import { useQuery } from '@tanstack/react-query';

import { useToast } from '@/components/ui/use-toast';
import { endpoints } from '@/global/endpoints';
import http from '@/utils/http';

export function useFetchConversionActive(rest: any = {}) {
  const { toast } = useToast();

  const fetchConversion = () => {
    const updatedEndpoints = endpoints.total_active_bots;
    return http().get(updatedEndpoints);
  };

  return useQuery(['fetch', 'active-bots'], fetchConversion, {
    onError: (error: { error?: string }) => {
      toast({
        variant: 'destructive',
        title: `${error?.error || 'Error occured while fetching the active conversation data!'}`,
        description: 'Please try again later.',
      });
    },
    ...rest,
  });
}
