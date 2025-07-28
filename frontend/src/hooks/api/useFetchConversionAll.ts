import { useQuery } from '@tanstack/react-query';

import { useToast } from '@/components/ui/use-toast';
import { endpoints } from '@/global/endpoints';
import http from '@/utils/http';

export function useFetchConversion(rest: any = {}) {
  const { toast } = useToast();

  const fetchConversion = () => {
    const updatedEndpoints = endpoints.total_projects;
    return http().get(updatedEndpoints);
  };

  return useQuery(['fetch', 'conversion'], fetchConversion, {
    onError: (error: { error?: string }) => {
      toast({
        variant: 'destructive',
        title: `${error?.error || 'Error occured while fetching the conversion analysis'}`,
        description: 'Please try again later.',
      });
    },
    ...rest,
  });
}
