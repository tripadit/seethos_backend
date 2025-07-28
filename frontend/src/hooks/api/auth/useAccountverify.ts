import { useMutation, useQuery } from '@tanstack/react-query';

import { useToast } from '@/components/ui/use-toast';
import { endpoints } from '@/global/endpoints';
import { useRouteQuery } from '@/hooks';
import http from '@/utils/http';

export const useAccountverify = () => {
  const { toast } = useToast();
  const email = useRouteQuery('email') as string;
  const token = useRouteQuery('token') as string;

  const verifyAccount = () => {
    const updatedEndpoints = endpoints.auth.verify;
    return http().get(updatedEndpoints + `?token=${token}&email=${email}`);
  };

  return useQuery({
    queryFn: verifyAccount,
    queryKey: ['accountVerify-email'],
    enabled: email != null && token != null,
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Your account has been verified successfully.',
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Verification link has been expired. Please resend verification link.',
      });
    },
  });
};

export const useResendVerification = () => {
  const { toast } = useToast();
  const token = useRouteQuery('token') as string;
  const email = useRouteQuery('email') as string;

  const resendVerification = () => {
    const updatedEndpoints = endpoints.auth.resendEmail;
    return http().get(updatedEndpoints + `?email=${email}`);
  };

  const verification = useQuery({
    queryKey: ['resendVerification-email'],
    queryFn: resendVerification,
    enabled: email != null && token == null,
    onSuccess: () => {
      localStorage.clear();
      toast({
        variant: 'success',
        title: 'Account verification email has been sent successfully.',
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
  const resend = useMutation({
    mutationFn: resendVerification,
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Account verification email has been sent successfully.',
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
  return { ...verification, resend };
};
