import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useMixpanel } from 'react-mixpanel-browser';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { useToast } from '@/components/ui/use-toast';
import { tokenConstants } from '@/global/appConstants';
import { endpoints } from '@/global/endpoints';
import { routes } from '@/routes/routes';
import http from '@/utils/http';
import * as storage from '@/utils/storage';
import tokenService from '@/utils/token';

export const signInSchema = z.object({
  email: z.string().email('Invalid email address.'),
  password: z.string().min(8, 'Please enter valid password'),
});

const signInResponseSchema = z.object({
  data: z.object({
    id: z.string(),
    token: z.object({
      access: z.string(),
      refresh: z.string(),
    }),
    email: z.string().email(),
    full_name: z.string(),
    subscription_type: z.enum(['LOW', 'INTERMEDIATE', 'ADVANCED']),
    //   subscription_pause_date: z.date().nullable(),
    //   is_verified: z.boolean(),
    //   is_subscription_pause: z.boolean(),
    //   is_subscription_cancel: z.boolean(),
  }),
});

export function useSignIn() {
  const [email, setEmail] = useState<string>('');
  const { toast } = useToast();
  const navigate = useNavigate();
  const mixpanel = useMixpanel();

  const signIn = (postData: z.infer<typeof signInSchema>) => {
    setEmail(postData?.email);
    const updatedEndpoints = endpoints.auth.signIn;
    return http().post(updatedEndpoints, postData);
  };

  return useMutation(signIn, {
    onSuccess: (response: z.infer<typeof signInResponseSchema>) => {
      const { token, ...rest } = response.data;

      tokenService.setToken(token);
      storage.set(tokenConstants.USER_DETAIL, JSON.stringify({ ...rest }));
      mixpanel.identify(rest.id);
      mixpanel.track('Sign In Success', {
        email: rest.email,
      });
      toast({
        variant: 'success',
        title: 'Signed in sucessfully',
      });
      navigate(routes.dashboard);
    },
    onError: (error: { error?: any }) => {
      if (error?.error?.code == 'unverified') {
        navigate(routes.verify + `?email=${email}`);
      }
      mixpanel.track('Sign In Failed', {
        error: error,
      });
      toast({
        variant: 'destructive',
        title: `${error?.error?.code || error?.error || 'Something went wrong!'}`,
        description: 'Please try again later.',
      });
    },
  });
}
