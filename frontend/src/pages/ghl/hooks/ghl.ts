import { useMutation, useQuery } from '@tanstack/react-query';

import { toast } from '@/components/ui/use-toast';
import { useRouteQuery } from '@/hooks';
import { appQuery } from '@/utils/constant/appQuery';
import queryClient from '@/utils/queryClient';

import { connectGHLApi, disconnectGHLApi, linkGHLApi } from '../api/ghl';

export const useConnectGHL = () => {
  return useMutation({
    mutationFn: connectGHLApi,
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Failed to connect.',
      });
    },
  });
};
export const useDisconnectGHL = () => {
  return useMutation({
    mutationFn: disconnectGHLApi,
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Failed to disconnect.',
      });
    },
    onSuccess: () => {
      toast({ variant: 'success', title: 'Disconnected successfully.' });
      queryClient.invalidateQueries({
        queryKey: [appQuery.getUserProfile],
      });
    },
  });
};

// export const useV
export const useVerifyConnectGHL = () => {
  const code = useRouteQuery('code');
  return useQuery({
    queryFn: () =>
      linkGHLApi({
        code: code,
      }),
    queryKey: ['verify-connect-ghl', code],
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Failed to verify code. Invalide code.',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [appQuery.getUserProfile],
      });
    },
    enabled: Boolean(code),
    retry: 0,
  });
};
