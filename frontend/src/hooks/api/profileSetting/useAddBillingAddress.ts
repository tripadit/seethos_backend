import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';

import { useToast } from '@/components/ui/use-toast';
import { endpoints } from '@/global/endpoints';
import http from '@/utils/http';
import queryClient from '@/utils/queryClient';

export const billingAddressSchema = z.object({
  phone: z.string({ required_error: 'Phone is required.' }),
  city: z.string({ required_error: 'City is required.' }),
  state: z.string({ required_error: 'State is required.' }),
  address: z.string().optional(),
  country: z.string({ required_error: 'Country is required.' }),
  zip_code: z.string({ required_error: 'Zip code is required.' }),
});

export const useAddBillingAddress = ({ onAddSuccess }: { onAddSuccess: () => void }) => {
  const { toast } = useToast();

  const addBillingAddress = (postData: z.infer<typeof billingAddressSchema>) => {
    const url = endpoints.billingAddress.get;
    return http().post(url, postData);
  };

  const editBillingAddress = (props: {
    postData: z.infer<typeof billingAddressSchema>;
    id: number;
  }) => {
    const url = endpoints.billingAddress.patch.replace(':id', props.id.toString());
    return http().patch(url, props.postData);
  };

  const addMutate = useMutation(addBillingAddress, {
    onSuccess: () => {
      onAddSuccess(),
        queryClient.invalidateQueries(['get-all-billing-address']),
        toast({
          variant: 'success',
          title: 'Billing address has been successfully added.',
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

  const editMutate = useMutation({
    mutationFn: editBillingAddress,
    onSuccess: () => {
      onAddSuccess(),
        queryClient.invalidateQueries(['get-all-billing-address']),
        toast({
          variant: 'success',
          title: 'Billing address has been successfully updated.',
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
  return { addMutate, editMutate };
};
