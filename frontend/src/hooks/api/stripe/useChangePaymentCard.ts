import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

import { toast } from '@/components/ui/use-toast';
import { endpoints } from '@/global/endpoints';
import http from '@/utils/http';
import queryClient from '@/utils/queryClient';

export const useChangePaymentCard = (rest: any) => {
  const [loading, setLoading] = useState(false);
  const stripe = useStripe();
  const elements: any = useElements();
  const changePaymentFn = (data: Record<string, any>) => {
    const url = endpoints.stripe.changeCard;
    return http().post(url, data);
  };
  const { mutate, isLoading } = useMutation({
    mutationFn: changePaymentFn,
    onSuccess: () => {
      rest.onSuccess();
      queryClient.invalidateQueries(['get-card-details']),
        toast({
          variant: 'success',
          title: 'Payment card change success.',
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
  const handleCardChange = async () => {
    setLoading(true);

    const res: any = await stripe?.createToken(elements.getElement(CardElement));
    if (res?.error) {
      toast({
        variant: 'destructive',
        title: 'Something went wrong!',
        description: 'Please try again later.',
      });
      // Handle error appropriately, e.g., display an error message to the user
    } else {
      mutate({
        card_token: res?.token?.id,
      });
      // Handle successful payment method creation, e.g., send to your server
    }
    setLoading(false);
  };
  return { handleCardChange, isLoading: loading || isLoading };
};
