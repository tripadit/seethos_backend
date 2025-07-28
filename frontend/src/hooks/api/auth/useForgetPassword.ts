import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';

import { useToast } from '@/components/ui/use-toast';
import { endpoints } from '@/global/endpoints';
import http from '@/utils/http';

export const forgetPasswordSchema = z.object({
  email: z.string().email('Invalid email address.'),
});

export function useForgetPassword() {
  const { toast } = useToast();

  const forgetPassword = (postData: z.infer<typeof forgetPasswordSchema>) => {
    const updatedEndpoints = endpoints.auth.resetPassword;
    return http().get(updatedEndpoints + `?email=${postData.email}`);
  };

  return useMutation(forgetPassword, {
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Reset password link sent to your email.',
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
}
