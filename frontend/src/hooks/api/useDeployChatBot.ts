import { useMutation } from '@tanstack/react-query';

import { useToast } from '@/components/ui/use-toast';
import { endpoints } from '@/global/endpoints';
import http from '@/utils/http';

export function useDeployChatbot() {
  const { toast } = useToast();

  const deployChatBot = (chatBotID: string) => {
    const updatedEndpoints = endpoints.deployChatbot.replace(':id', chatBotID);
    toast({
      variant: 'success',
      title: 'Deploying agent...',
    });
    return http().post(updatedEndpoints, chatBotID);
  };

  return useMutation(deployChatBot, {
    onError: (error: { error?: string }) => {
      toast({
        variant: 'destructive',
        title: `${error?.error || 'Error occured while deploying agent!'}`,
        description: 'Please try again later.',
      });
    },
  });
}
