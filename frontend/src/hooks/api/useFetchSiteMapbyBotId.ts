import { useQuery } from '@tanstack/react-query';

import { useToast } from '@/components/ui/use-toast';
import { endpoints } from '@/global/endpoints';
import http from '@/utils/http';

export function useFetchSiteMapByBotId(id: string, rest: any = {}) {
  const { toast } = useToast();

  const fetchSiteMapByBotId = () => {
    let updatedEndpoints = endpoints.siteMapById + '?chatbot_id=' + id;

    return http().get(updatedEndpoints);
  };

  return useQuery(['fetch', 'sitemap', 'bot', id], fetchSiteMapByBotId, {
    enabled: !!id,
    onError: (error: { error?: string }) => {
      toast({
        variant: 'destructive',
        title: `${error?.error || 'Error occured while fetching the record!'}`,
        description: 'Please try again later.',
      });
    },
    ...rest,
  });
}
