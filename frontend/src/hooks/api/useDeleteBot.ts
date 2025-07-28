import { useMutation } from '@tanstack/react-query';

import { useToast } from '@/components/ui/use-toast';
import { endpoints } from '@/global/endpoints';
import http from '@/utils/http';

export function useDeleteBot(rest: any = {}) {
  const { toast } = useToast();

  const deleteChatBot = (chatBotID: string) => {
    const updatedEndpoints = endpoints.deleteChatBot.replace(':id', chatBotID);
    return http().delete(updatedEndpoints);
  };

  return useMutation(deleteChatBot, {
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
