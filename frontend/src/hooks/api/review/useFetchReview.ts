import { useQuery } from '@tanstack/react-query';

import { useToast } from '@/components/ui/use-toast';
import { endpoints } from '@/global/endpoints';
import http from '@/utils/http';

export function useFetchReview(chatbotId: string, rest: any = {}) {
  const { toast } = useToast();

  const fetchReview = () => {
    let updatedEndpoints = endpoints.review.list + `?chatbot_id=${chatbotId}`;

    return http().get(updatedEndpoints);
  };

  return useQuery(['list', 'review'], fetchReview, {
    onError: (error: { error?: string }) => {
      toast({
        variant: 'destructive',
        title: `${error?.error || 'Error occured while fetching the reviews!'}`,
        description: 'Please try again later.',
      });
    },
    ...rest,
  });
}
