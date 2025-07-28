import { useMutation } from '@tanstack/react-query';

import { useToast } from '@/components/ui/use-toast';
import { endpoints } from '@/global/endpoints';
import http from '@/utils/http';

export function useUpdateChatBot(rest: any = {}) {
  const { toast } = useToast();

  const updateChatBot = (chatBotId: string) => {
    const updatedEndpoints = endpoints.updateChatBot.replace(':id', chatBotId);
    return http().post(updatedEndpoints, {});
  };

  return useMutation(updateChatBot, {
    onError: (error: { error?: string }) => {
      toast({
        variant: 'destructive',
        title: `${error?.error || 'Something went wrong!'}`,
        description: 'Please try again later.',
      });
    },
    queryKey: ['updateChatBot'],
    ...rest,
  });
}
