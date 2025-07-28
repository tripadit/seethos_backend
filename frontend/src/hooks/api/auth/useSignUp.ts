import { useMutation } from '@tanstack/react-query';
import { useMixpanel } from 'react-mixpanel-browser';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { useToast } from '@/components/ui/use-toast';
import { endpoints } from '@/global/endpoints';
import { useRouteQuery } from '@/hooks';
import { routes } from '@/routes/routes';
import http from '@/utils/http';
import tokenService from '@/utils/token';

import { useSubscribe } from './useSubscribe';

export const signUpSchema = z.object({
  email: z.string().email('Invalid email address.'),
  full_name: z.string().nonempty('Full name is required.'),
  password: z
    .string()
    .min(7, 'Password must be at least 8 characters long.')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}$/,
      'Password must contain at least one uppercase letter and one special character.',
    ),
});

export function useSignUp() {
  const { toast } = useToast();
  const { subscribe } = useSubscribe();
  const billingCycle = useRouteQuery('billingCycle');
  const subscriptionType = useRouteQuery('subscriptionType');
  const navigate = useNavigate();
  const mixpanel = useMixpanel();
  const signUp = (postData: z.infer<typeof signUpSchema>) => {
    const updatedEndpoints = endpoints.auth.signUp;
    return http().post(updatedEndpoints, postData);
  };

  const signupMutate = useMutation(signUp, {
    onSuccess: (response) => {
      const { token, ...rest } = response;
      tokenService.setToken(token);

      mixpanel.track('Sign Up Success', {
        data: rest,
      });

      toast({
        variant: 'success',
        title: 'Signed up sucessfully',
        description: 'Congratulations! You are signed up sucessfully.',
      });
      if (subscriptionType && billingCycle) {
        subscribe.mutate(
          {
            email: response.email,
            subscription_type: subscriptionType as any,
            billing_cycle: billingCycle as any,
          },
          {
            onSettled: (response) => {
              toast({
                variant: 'success',
                title: 'Success!',
                description: 'Your request has been processed.',
              });
              window.open(response.url, '_blank');
            },
          },
        );
      } else {
        navigate(routes.dashboard);
        // navigate(routes.payment + `?email=${response.email}`);
      }
    },
    onError: (error: { error?: any }) => {
      toast({
        variant: 'destructive',
        title: `${error?.error?.code || error?.error || 'Something went wrong!'}`,
        description: `${
          error?.error === 'email - Email address has already been used.'
            ? 'Please use a different email address or try logging in with your existing account.'
            : 'Please try again later.'
        }`,
      });
    },
  });
  return { ...signupMutate, subscribe };
}
