import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useDeleteReviewByReviewId } from '@/hooks/api/review';

import ReviewCard, { IReviewCardProps } from '../molecules/ReviewCard';
import { Button } from '../ui/button';
import { useToast } from '../ui/use-toast';

interface IDeleteReviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  review: IReviewCardProps;
  onDelete?: () => void;
}

export const DeleteReviewDialog = ({
  review,
  isOpen,
  onClose,
  onDelete,
}: IDeleteReviewDialogProps) => {
  const { toast } = useToast();
  const { isLoading, mutate } = useDeleteReviewByReviewId(review.id, {
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Review deleted sucessfully',
      });
      onDelete && onDelete();
      onClose();
    },
  });

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete review?</DialogTitle>
            <DialogDescription>Are you sure you want to delete this review?</DialogDescription>
          </DialogHeader>
          <ReviewCard {...review} enableHoverMenu={false} />
          <Button variant="purple" className="mt-5" onClick={() => mutate()} isLoading={isLoading}>
            Delete Review
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};
