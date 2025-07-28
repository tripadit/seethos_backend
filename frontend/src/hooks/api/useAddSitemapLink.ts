import { useMutation } from '@tanstack/react-query';

import { useToast } from '@/components/ui/use-toast';
import { endpoints } from '@/global/endpoints';
import http from '@/utils/http';

interface IAddSitemap {
  url: string;
  traning_links?: string[];
  chatbot: string;
}

export function useAddSitemap() {
  const { toast } = useToast();

  const addSiteMap = (postData: IAddSitemap) => {
    const updatedEndpoints = endpoints.siteMap;
    return http().post(updatedEndpoints, postData);
  };

  return useMutation(addSiteMap, {
    onError: (error: { error?: string }) => {
      toast({
        variant: 'destructive',
        title: `${error?.error || 'Error occured while addting the sitemap!'}`,
        description: 'Please try again later.',
      });
    },
  });
}
