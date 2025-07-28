import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { useToast } from '@/components/ui/use-toast';
import { endpoints } from '@/global/endpoints';
import { routes } from '@/routes/routes';
import http from '@/utils/http';

export const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email address.'),
  token: z.string(),
  new_password: z
    .string()
    .min(8, 'Password must be at least 8 characters long.')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}$/,
      'Password must contain at least one uppercase letter and one special character.',
    ),
});

export function useResetPassword() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const resetPassword = (postData: z.infer<typeof resetPasswordSchema>) => {
    const updatedEndpoints = endpoints.auth.resetPassword;
    return http().post(updatedEndpoints, postData);
  };

  return useMutation(resetPassword, {
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Congratulations!',
        description: 'Password reset successfully.',
      });
      navigate(routes.signIn);
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
