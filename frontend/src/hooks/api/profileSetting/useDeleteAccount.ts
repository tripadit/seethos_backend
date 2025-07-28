import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { useToast } from '@/components/ui/use-toast';
import { tokenConstants } from '@/global/appConstants';
import { endpoints } from '@/global/endpoints';
import { routes } from '@/routes/routes';
import http from '@/utils/http';
import * as storage from '@/utils/storage';
import tokenService from '@/utils/token';

export const useDeleteAccount = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const removeSubscription = () => {
    const url = endpoints.stripe.deleteAccount;
    return http().delete(url);
  };

  const deleteAccountFn = useMutation({
    mutationFn: removeSubscription,
    onSuccess: () => {
      tokenService.clearToken();
      storage.remove(tokenConstants.USER_DETAIL);
      navigate(routes.signIn);
      toast({
        variant: 'success',
        title: 'Account deleted successfully!',
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
  const removeSubscriptionFn = useMutation({
    mutationFn: removeSubscription,
    onSuccess: () => {
      navigate(routes.dashboard);
      toast({
        variant: 'success',
        title: 'Payment method removed successfully!',
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
  return { deleteAccountFn, removeSubscriptionFn };
};
