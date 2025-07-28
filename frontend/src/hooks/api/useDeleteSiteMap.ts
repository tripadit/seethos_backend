import { useMutation } from '@tanstack/react-query';

import { useToast } from '@/components/ui/use-toast';
import { endpoints } from '@/global/endpoints';
import http from '@/utils/http';

export function useDeleteSiteMap(rest: any = {}) {
  const { toast } = useToast();

  const deleteSiteMap = (siteMapId: string) => {
    const updatedEndpoints = endpoints.siteMap + siteMapId + '/';
    return http().delete(updatedEndpoints);
  };

  return useMutation(deleteSiteMap, {
    onError: (error: { error?: string }) => {
      toast({
        variant: 'destructive',
        title: `${error?.error || 'Error occured while deleting the sitemap!'}`,
        description: 'Please try again later.',
      });
    },
    ...rest,
  });
}
