import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';

import { useToast } from '@/components/ui/use-toast';
import { endpoints } from '@/global/endpoints';
import http from '@/utils/http';

export const changePasswordSchema = z
  .object({
    new_password: z
      .string()
      .min(8, 'Password must be at least 8 characters long.')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}$/,
        'Password must contain at least one uppercase letter and one special character.',
      ),
    old_password: z
      .string()
      .min(8, 'Password must be at least 8 characters long.')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}$/,
        'Password must contain at least one uppercase letter and one special character.',
      ),
    confirm_password: z
      .string()
      .min(8, 'Password must be at least 8 characters long.')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}$/,
        'Password must contain at least one uppercase letter and one special character.',
      ),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords don't match",
    path: ['confirm_password'],
  });

export const useChangePassword = ({ onSuccess }: { onSuccess: () => void }) => {
  const { toast } = useToast();

  const changePassword = (postData: z.infer<typeof changePasswordSchema>) => {
    const updatedEndpoints = endpoints.auth.changePassword;
    return http().post(updatedEndpoints, postData);
  };

  return useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      onSuccess();
      toast({
        variant: 'success',
        title: 'Your password has been changed.',
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
