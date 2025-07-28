import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface IDeleteBotDialogProps {
  isOpen: boolean;
  onClose: () => void;
  actions?: React.ReactNode;
}

export const DeleteSiteMapDialog = ({ isOpen, onClose, actions }: IDeleteBotDialogProps) => {
  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete this sitemap?</DialogTitle>
            <DialogDescription>Are you sure you want to delete this sitemap?</DialogDescription>
          </DialogHeader>

          <DialogFooter>{actions}</DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
