import { useQuery } from '@tanstack/react-query';

import { useToast } from '@/components/ui/use-toast';
import { endpoints } from '@/global/endpoints';
import http from '@/utils/http';

export function useFetchFile(fileID: string, rest: any = {}) {
  const { toast } = useToast();

  const fetchFile = (fileID: string) => {
    const updatedEndpoints = endpoints.fileDetail.replace(':id', fileID);
    return http().get(updatedEndpoints);
  };

  return useQuery(['fetch', 'file', fileID], () => fetchFile(fileID), {
    enabled: !!fileID,
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
