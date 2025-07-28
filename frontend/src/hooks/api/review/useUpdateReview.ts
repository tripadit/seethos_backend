import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';

import { useToast } from '@/components/ui/use-toast';
import { endpoints } from '@/global/endpoints';
import http from '@/utils/http';

export const updateReviewSchema = z.object({
  id: z.string().optional(),
  name: z.string().nonempty({ message: 'Full Name is required' }),
  rating: z.string(),
  title: z.string().nonempty({ message: 'Title is required' }),
  review: z.string().nonempty({ message: 'Review is required' }),
  company: z.string().nonempty({ message: 'Company is required' }),
  chatbot: z.string().optional(),
  image: z.any(),
});

export function useUpdateReview(rest: any) {
  const { toast } = useToast();

  const updateReview = (postData: z.infer<typeof updateReviewSchema>) => {
    const formData = new FormData();
    Object.entries(postData).map(([key, val]: any) => {
      if (key === 'image') {
        formData.append('image', postData.image);
        return;
      }
      formData.append(key, val);
    });
    const updatedEndpoints = endpoints.review.updateReview.replace(':id', postData.id as string);
    return http('multipart').put(updatedEndpoints, formData);
  };

  return useMutation(updateReview, {
    onError: (error: { error?: string }) => {
      toast({
        variant: 'destructive',
        title: `${error?.error || 'Error occured while updating the review!'}`,
        description: 'Please try again later.',
      });
    },
    ...rest,
  });
}
