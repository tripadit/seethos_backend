import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';

import { useToast } from '@/components/ui/use-toast';
import { endpoints } from '@/global/endpoints';
import http from '@/utils/http';

export const addReviewSchema = z.object({
  name: z
    .string({
      required_error: 'Full Name is required.',
    })
    .nonempty('Full Name is required.'),
  rating: z
    .number({
      required_error: 'Rating is required.',
    })
    .min(1, 'Rating is required'),
  title: z
    .string({
      required_error: 'Designation is required.',
    })
    .nonempty('Designation is required.'),
  review: z
    .string({
      required_error: 'Review is required.',
    })
    .nonempty('Review role is required.'),
  company: z
    .string({
      required_error: 'Company is required.',
      invalid_type_error: 'Company is required.',
    })
    .nonempty('Company is required.'),
  chatbot: z.string().optional(),
  image: z.any(),
});

export function useAddReview(rest: any) {
  const { toast } = useToast();

  const addReview = (postData: z.infer<typeof addReviewSchema>) => {
    const formData = new FormData();
    Object.entries(postData).map(([key, val]: any) => {
      if (key === 'image') {
        formData.append('image', postData.image);
        return;
      }
      formData.append(key, val);
    });
    const updatedEndpoints = endpoints.review.add;
    return http('multipart').post(updatedEndpoints, formData);
  };

  return useMutation(addReview, {
    onError: (error: { error?: string }) => {
      toast({
        variant: 'destructive',
        title: `${error?.error || 'Error occured while adding the review!'}`,
        description: 'Please try again later.',
      });
    },
    ...rest,
  });
}
