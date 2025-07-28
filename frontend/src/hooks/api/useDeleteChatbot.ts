import { useMutation } from '@tanstack/react-query';

import { useToast } from '@/components/ui/use-toast';
import { endpoints } from '@/global/endpoints';
import http from '@/utils/http';

export function useDeleteChatBot(rest: any = {}) {
  const { toast } = useToast();

  const daleteChatBot = (chatBotId: string) => {
    const updatedEndpoints = endpoints.deleteChatBot.replace(':id', chatBotId);
    return http().post(updatedEndpoints, {});
  };

  return useMutation(daleteChatBot, {
    onError: (error: { error?: string }) => {
      toast({
        variant: 'destructive',
        title: `${error?.error || 'Error occured while deleting the chatbot!'}`,
        description: 'Please try again later.',
      });
    },
    ...rest,
  });
}
