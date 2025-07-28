import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';

import { useToast } from '@/components/ui/use-toast';
import { endpoints } from '@/global/endpoints';
import http from '@/utils/http';

export const deactiveSubscriptionSchema = z.object({
  from: z.date({ required_error: 'Form date is required.' }).default(new Date()),
  to: z.date({ required_error: 'To date is required.' }),
});
export const useDeactiveAccount = ({ onSuccess }: { onSuccess: () => void }) => {
  const { toast } = useToast();

  const deactiveAccount = (postData: { date: string }) => {
    const url = endpoints.stripe.deactiveSubscription;
    return http().post(url, postData);
  };

  const activateAccount = () => {
    const url = endpoints.stripe.activeSubscription;
    return http().get(url);
  };
  const deactiveFn = useMutation({
    mutationFn: deactiveAccount,
    onSuccess: () => {
      onSuccess();
      toast({
        variant: 'success',
        title: 'Account deactive successfully!',
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
  const activateFn = useMutation({
    mutationFn: activateAccount,
    onSuccess: () => {
      onSuccess();
      toast({
        variant: 'success',
        title: 'Account has been successfully activated',
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
  return { deactiveFn, activateFn };
};
