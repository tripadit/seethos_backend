import { useMutation } from '@tanstack/react-query';

import { useToast } from '@/components/ui/use-toast';
import { endpoints } from '@/global/endpoints';
import http from '@/utils/http';

export function useDeleteReviewByReviewId(reviewId?: string, rest: any = {}) {
  const { toast } = useToast();

  const deleteReviewById = () => {
    let updatedEndpoints = endpoints.review.reviewDetail.replace(':id', reviewId as string);

    return http().delete(updatedEndpoints);
  };

  return useMutation(deleteReviewById, {
    enabled: !!reviewId,

    onError: (error: { error?: string }) => {
      toast({
        variant: 'destructive',
        title: `${error?.error || 'Error occured while deleting the reviews!'}`,
        description: 'Please try again later.',
      });
    },
    ...rest,
  });
}
