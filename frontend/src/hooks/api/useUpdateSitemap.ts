import { useMutation } from '@tanstack/react-query';

import { useToast } from '@/components/ui/use-toast';
import { endpoints } from '@/global/endpoints';
import http from '@/utils/http';

export function useUpdateSitemap(rest: any = {}) {
  const { toast } = useToast();

  const updateSitemap = (siteMapData: { [x: string]: any }) => {
    const updatedEndpoints = endpoints.siteMap + siteMapData.id + '/';
    return http().put(updatedEndpoints, siteMapData);
  };

  return useMutation(updateSitemap, {
    onError: (error: { error?: string }) => {
      toast({
        variant: 'destructive',
        title: `${error?.error || 'Error occured while updating sitemap!'}`,
        description: 'Please try again later.',
      });
    },
    ...rest,
  });
}
