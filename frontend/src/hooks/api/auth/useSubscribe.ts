import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';

import { useToast } from '@/components/ui/use-toast';
import { endpoints } from '@/global/endpoints';
import http from '@/utils/http';

export const pricingSchema = z.object({
  email: z.string().email('Invalid email address.'),
  subscription_type: z.enum(['LOW', 'INTERMEDIATE', 'ADVANCED']),
  billing_cycle: z.enum(['MONTHLY', 'YEARLY']),
});

export function useSubscribe() {
  const { toast } = useToast();

  const signUp = (postData: z.infer<typeof pricingSchema>) => {
    const updatedEndpoints =
      postData.billing_cycle === 'YEARLY'
        ? endpoints.auth.subscribeYearly
        : endpoints.auth.subscribe;
    return http().post(updatedEndpoints, postData);
  };

  const upgradeSubscription = (postData: z.infer<typeof pricingSchema>) => {
    const updatedEndpoints = endpoints.auth.changeSubscription;
    return http().post(updatedEndpoints, postData);
  };

  const subscribe = useMutation(signUp, {
    onError: (error: { error?: string }) => {
      toast({
        variant: 'destructive',
        title: `${error?.error || 'Something went wrong!'}`,
        description: 'Please try again later.',
      });
    },
  });
  const upgradeSubscribe = useMutation(upgradeSubscription, {
    onError: (error: { error?: string }) => {
      toast({
        variant: 'destructive',
        title: `${error?.error || 'Something went wrong!'}`,
        description: 'Please try again later.',
      });
    },
  });
  return {
    subscribe,
    upgradeSubscribe,
  };
}
