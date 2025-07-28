import { useMutation } from '@tanstack/react-query';

import { useToast } from '@/components/ui/use-toast';
import { endpoints } from '@/global/endpoints';
import http from '@/utils/http';
import queryClient from '@/utils/queryClient';

export const useDeleteBillingAddress = () => {
  const { toast } = useToast();

  const deleteBillingAddress = (id: number) => {
    const url = endpoints.billingAddress.patch.replace(':id', id.toString());
    return http().delete(url);
  };
  return useMutation({
    mutationFn: deleteBillingAddress,
    onSuccess: () => {
      queryClient.invalidateQueries(['get-all-billing-address']),
        toast({
          variant: 'success',
          title: 'Remove billing address success.',
        });
    },
    onError: (error: { error?: string }) => {
      toast({
        variant: 'destructive',
        title: `${error?.error || 'Something went wrong!'}`,
        description: 'Please try again later.',
      });
    },
  });
};
