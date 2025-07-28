import { useMutation } from '@tanstack/react-query';

import { useToast } from '@/components/ui/use-toast';
import { endpoints } from '@/global/endpoints';
import http from '@/utils/http';

export const useDeleteFile = () => {
  const { toast } = useToast();

  const deleteFile = ({ id }: { id: string }) => {
    const updatedEndpoints = endpoints.fileDetail.replace(':id', id);
    return http().delete(updatedEndpoints);
  };

  return useMutation(deleteFile, {
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'File deleted successfully',
        description: '',
      });
    },
    onError: (error: { error?: string }) => {
      toast({
        variant: 'destructive',
        title: `${error?.error || 'Error occured while deleting the file!'}`,
        description: 'Please try again later.',
      });
    },
  });
};
