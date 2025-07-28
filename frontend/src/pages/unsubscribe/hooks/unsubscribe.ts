import { useMutation } from '@tanstack/react-query';

import { toast } from '@/components/ui/use-toast';

import { unsubscribeFromCampaign } from '../api/unsubscribe';

export function useUnsubscribe() {
  return useMutation({
    mutationFn: unsubscribeFromCampaign,
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Failed to unsubscribe from campaign.',
      });
    },
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Unsubscribed successfully.',
      });
    },
  });
}
