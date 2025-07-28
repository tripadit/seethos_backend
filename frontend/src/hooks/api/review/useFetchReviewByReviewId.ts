import { useQuery } from '@tanstack/react-query';

import { useToast } from '@/components/ui/use-toast';
import { endpoints } from '@/global/endpoints';
import http from '@/utils/http';

export function useFetchReviewByReviewId(reviewId?: string, rest: any = {}) {
  const { toast } = useToast();

  const fetchReviewById = () => {
    let updatedEndpoints = endpoints.review.reviewDetail.replace(':id', reviewId as string);

    return http().get(updatedEndpoints);
  };

  return useQuery(['list', 'review', reviewId], fetchReviewById, {
    enabled: !!reviewId,
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
