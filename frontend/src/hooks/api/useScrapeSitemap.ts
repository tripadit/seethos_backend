import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

import { useToast } from '@/components/ui/use-toast';
import { endpoints } from '@/global/endpoints';

export function useScrapeSitemap(rest: any = {}) {
  const { toast } = useToast();

  const scrapeSiteMap = (siteMap?: string) => {
    const updatedEndpoints = 'https://scrap.duality.junkirilabs.com' + endpoints.scrapeSiteMap;
    return axios.post(updatedEndpoints, {
      url: siteMap,
    });
  };

  return useMutation(scrapeSiteMap, {
    onError: (error: {
      response: { data?: { detail?: string } };
      message?: string;
      detail?: string;
    }) => {
      toast({
        variant: 'destructive',
        title:
          error?.response.data?.detail ||
          error?.detail ||
          error?.message ||
          'Something went wrong!',
        description: 'Please try again later.',
      });
    },
    ...rest,
  });
}
