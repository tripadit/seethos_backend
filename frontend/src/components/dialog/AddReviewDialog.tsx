import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useFetchReviewByReviewId } from '@/hooks/api/review';
import { addReviewSchema, useAddReview } from '@/hooks/api/review/useAddReview';
import { useUpdateReview } from '@/hooks/api/review/useUpdateReview';

import { SingleImageUpload, StarRating } from '../molecules';
import { CounterTextArea } from '../molecules/CounterInput';
import { Button } from '../ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { useToast } from '../ui/use-toast';

interface IAddReviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  chatbot: string;
  reviewId?: string;
}

export const AddReviewDialog = ({ isOpen, onClose, chatbot, reviewId }: IAddReviewDialogProps) => {
  const { toast } = useToast();
  const [image, setImage] = useState<any>();

  const initialData = {
    name: '',
    rating: 0,
    title: '',
    company: '',
    review: '',
    image: '',
  };

  const { isLoading } = useFetchReviewByReviewId(reviewId, {
    onSuccess: (data: any) => {
      form.reset(data);
      setImage(data.image);
    },
  });

  useEffect(() => {
    if (reviewId === undefined) {
      form.reset(initialData);
    }

    return () => {
      form.reset(initialData);
    };
  }, [reviewId]);

  const { status: updateReviewStatus, mutate: updateReviewFn } = useUpdateReview({
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Review updated sucessfully!',
      });
      onClose();
      setImage(undefined);
    },
  });

  const { status: reviewStatus, mutate: addReviewFn } = useAddReview({
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Review added sucessfully!',
      });
      onClose();
      form.reset(initialData);
      setImage(undefined);
    },
  });

  const form = useForm<z.infer<typeof addReviewSchema>>({
    resolver: zodResolver(addReviewSchema),
    defaultValues: {},
  });

  const onSubmit = (value: z.infer<typeof addReviewSchema>) => {
    const req = {
      ...value,
      image: image,
    };
    if (typeof req.image === 'string' || req.image === undefined || req.image === null) {
      delete req.image;
    }

    if (!reviewId) {
      addReviewFn({
        ...req,
        chatbot: chatbot.toString(),
      });
    }
    if (reviewId) {
      updateReviewFn({
        ...req,
        id: reviewId,
        rating: req.rating.toString(),
      });
    }
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={() => {
          onClose();
        }}
      >
        <DialogContent className="sm:max-w-[425px] min-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">Add a review</DialogTitle>
          </DialogHeader>
          {reviewId && isLoading && (
            <div className="my-10 flex flex-col items-center">
              <Loader2 className="animate-spin" />
              <p>Loading..</p>
            </div>
          )}
          {(!reviewId || !isLoading) && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                {/* name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-[100px_1fr]">
                      <FormLabel className="min-w-170">Full Name</FormLabel>
                      <div className="w-full">
                        <FormControl>
                          <Input
                            placeholder="Hellen Jimmy"
                            className="w-full"
                            {...field}
                            autoComplete="off"
                          />
                        </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                {/* rating */}
                <div className="grid grid-cols-[110px_1fr]">
                  <FormLabel className="min-w-170">Rating</FormLabel>
                  <Controller
                    control={form.control}
                    name="rating"
                    render={({ field: { onChange, value } }) => (
                      <div className="flex flex-col my-2">
                        <StarRating onChange={onChange} value={value} />
                        {form.formState.errors.rating && (
                          <span className="text-red-500">
                            {form.formState.errors.rating.message}
                          </span>
                        )}
                      </div>
                    )}
                  />
                </div>

                {/* Designation */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-[100px_1fr]">
                      <FormLabel className="min-w-170">Designation</FormLabel>
                      <div className="w-full">
                        <FormControl>
                          <Input placeholder="CEO" className="w-full" {...field} />
                        </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                {/* Company */}
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-[100px_1fr]">
                      <FormLabel className="min-w-170">Company</FormLabel>
                      <div className="w-full">
                        <FormControl>
                          <Input
                            placeholder="ABC pvt. ltd."
                            className="w-full"
                            autoComplete="off"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                {/* image */}
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-[100px_1fr]">
                      <FormLabel className="min-w-170">Profile Image</FormLabel>
                      <div className="w-full">
                        <FormControl>
                          <div className="flex gap-3">
                            <SingleImageUpload
                              title="Upload File"
                              onImageUpload={(file) => {
                                setImage(file[0]);
                                field.onChange(file);
                              }}
                              className="h-[71px] w-[95px] bg-white border flex-col border-neutral-300"
                            ></SingleImageUpload>
                            {((image && typeof image !== 'string' && URL.createObjectURL(image)) ||
                              field.value) && (
                              <img
                                src={
                                  (image &&
                                    typeof image !== 'string' &&
                                    URL.createObjectURL(image)) ||
                                  field.value
                                }
                                className="w-12 h-12"
                              />
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                {/* Review */}
                <FormField
                  control={form.control}
                  name="review"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-[100px_1fr]">
                      <FormLabel className="min-w-170">Review</FormLabel>
                      <div className="w-full">
                        <FormControl>
                          <CounterTextArea
                            charLimit={185}
                            placeholder="Enter review..."
                            className="w-full"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  variant="purple"
                  className="w-max m-auto mt-4"
                  isLoading={reviewStatus === 'loading' || updateReviewStatus === 'loading'}
                >
                  {reviewId ? 'Update' : 'Add'} Review
                </Button>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
